import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import './VideoConsultation.css';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const VideoConsultation = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('apt');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [remoteUser, setRemoteUser] = useState(null);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const timerRef = useRef(null);
  const chatEndRef = useRef(null);

  const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email;

  // Initialize media and socket
  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        setLocalStream(stream);
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Connect to signaling server
        const s = io('http://localhost:5000');
        socketRef.current = s;
        setSocket(s);

        s.on('connect', () => {
          console.log('Connected to signaling server');
          s.emit('join-room', {
            roomId,
            userId: user?.id || user?._id,
            userName,
            role: user?.role,
          });
          setCallStatus('Waiting for other participant...');
        });

        // When another user joins (you are the second user joining an existing room)
        s.on('room-users', (users) => {
          if (users.length > 0) {
            const otherUser = users[0];
            setRemoteUser(otherUser);
            setCallStatus('Connecting call...');
            // Do not initiate, but create the connection so it's ready for ICE candidates
            createPeerConnection(s, otherUser.socketId, stream, false);
          }
        });

        // When someone joins your room (you are the first user)
        s.on('user-joined', ({ socketId, userName: name, role }) => {
          setRemoteUser({ socketId, userName: name, role });
          setCallStatus('Connecting call...');
          // You act as initiator since you were here first
          createPeerConnection(s, socketId, stream, true);
        });

        s.on('offer', async ({ from, offer }) => {
          // Create connection if it doesn't exist
          if (!peerConnectionRef.current) {
            await createPeerConnection(s, from, stream, false);
          }
          try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            s.emit('answer', { to: from, answer });
          } catch (e) {
            console.error('Error handling offer:', e);
          }
        });

        s.on('answer', async ({ from, answer }) => {
          if (peerConnectionRef.current) {
            try {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (e) {
              console.error('Error handling answer:', e);
            }
          }
        });

        s.on('ice-candidate', async ({ from, candidate }) => {
          if (peerConnectionRef.current) {
            try {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.error('Error adding ICE candidate:', e);
            }
          }
        });

        s.on('chat-message', ({ message, userName: name, timestamp }) => {
          setChatMessages((prev) => [...prev, { message, userName: name, timestamp, isRemote: true }]);
        });

        s.on('user-left', ({ userName: name }) => {
          setCallStatus(`${name} has left the call`);
          setRemoteUser(null);
          setRemoteStream(null);
          setIsConnected(false);
          if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
          }
          if (timerRef.current) clearInterval(timerRef.current);
        });
      } catch (err) {
        console.error('Media access error:', err);
        setCallStatus('Camera/Microphone access denied. Please allow access and reload.');
      }
    };

    init();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.emit('leave-room', { roomId });
        socketRef.current.disconnect();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roomId]);

  const createPeerConnection = useCallback(async (s, remoteSocketId, stream, isInitiator) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    // Add local tracks
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Handle remote stream
    pc.ontrack = (event) => {
      const [remStream] = event.streams;
      setRemoteStream(remStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remStream;
      }
      setIsConnected(true);
      setCallStatus('In Call');
      // Start call duration timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        s.emit('ice-candidate', { to: remoteSocketId, candidate: event.candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        setCallStatus('Connection lost. Reconnecting...');
        setIsConnected(false);
      }
    };

    // If initiator, create and send offer
    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      s.emit('offer', { to: remoteSocketId, offer });
    }
  }, []);

  // Controls
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setIsMuted((prev) => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setIsVideoOff((prev) => !prev);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = peerConnectionRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(screenTrack);

        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;

        screenTrack.onended = () => {
          const camTrack = localStreamRef.current.getVideoTracks()[0];
          if (sender) sender.replaceTrack(camTrack);
          if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
          setIsScreenSharing(false);
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen share error:', err);
      }
    } else {
      const camTrack = localStreamRef.current.getVideoTracks()[0];
      const sender = peerConnectionRef.current
        ?.getSenders()
        .find((s) => s.track?.kind === 'video');
      if (sender) sender.replaceTrack(camTrack);
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
      setIsScreenSharing(false);
    }
  };

  const endCall = () => {
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => t.stop());
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId });
      socketRef.current.disconnect();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(-1);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socketRef.current) return;
    socketRef.current.emit('chat-message', { roomId, message: chatInput, userName });
    setChatMessages((prev) => [
      ...prev,
      { message: chatInput, userName, timestamp: new Date(), isRemote: false },
    ]);
    setChatInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="vc-container">
      {/* Header */}
      <div className="vc-header">
        <div className="vc-header-info">
          <h2>📹 Video Consultation</h2>
          <div className="vc-status">
            <span className={`vc-status-dot ${isConnected ? 'connected' : ''}`} />
            <span>{callStatus}</span>
            {isConnected && <span className="vc-duration">{formatDuration(callDuration)}</span>}
          </div>
        </div>
        {remoteUser && (
          <div className="vc-remote-info">
            <span className="vc-remote-badge">{remoteUser.role === 'doctor' ? '👨‍⚕️' : '🧑‍💼'}</span>
            <span>{remoteUser.userName}</span>
          </div>
        )}
      </div>

      {/* Video Area */}
      <div className={`vc-video-area ${showChat ? 'with-chat' : ''}`}>
        <div className="vc-videos">
          {/* Remote video (large) */}
          <div className="vc-remote-video-container">
            {remoteStream ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="vc-remote-video" />
            ) : (
              <div className="vc-waiting">
                <div className="vc-waiting-pulse" />
                <p>Waiting for {user?.role === 'doctor' ? 'patient' : 'doctor'} to join...</p>
                <span className="vc-room-code">Room: {roomId}</span>
              </div>
            )}
          </div>

          {/* Local video (small overlay) */}
          <div className="vc-local-video-container">
            <video ref={localVideoRef} autoPlay playsInline muted className="vc-local-video" />
            {isVideoOff && (
              <div className="vc-video-off-overlay">
                <span>📷</span>
                <p>Camera Off</p>
              </div>
            )}
            <span className="vc-local-name">You</span>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="vc-chat-panel">
            <div className="vc-chat-header">
              <h4>💬 Chat</h4>
              <button className="vc-chat-close" onClick={() => setShowChat(false)}>✕</button>
            </div>
            <div className="vc-chat-messages">
              {chatMessages.length === 0 && (
                <p className="vc-chat-empty">No messages yet. Start chatting!</p>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`vc-chat-msg ${msg.isRemote ? 'remote' : 'local'}`}>
                  <span className="vc-chat-sender">{msg.isRemote ? msg.userName : 'You'}</span>
                  <p>{msg.message}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form className="vc-chat-input" onSubmit={sendChat}>
              <input
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="vc-controls">
        <button
          className={`vc-ctrl-btn ${isMuted ? 'active' : ''}`}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <span>{isMuted ? '🔇' : '🎤'}</span>
          <small>{isMuted ? 'Unmute' : 'Mute'}</small>
        </button>

        <button
          className={`vc-ctrl-btn ${isVideoOff ? 'active' : ''}`}
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}
        >
          <span>{isVideoOff ? '📷' : '📹'}</span>
          <small>{isVideoOff ? 'Start Video' : 'Stop Video'}</small>
        </button>

        <button
          className={`vc-ctrl-btn ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
          title="Share Screen"
        >
          <span>🖥️</span>
          <small>{isScreenSharing ? 'Stop Share' : 'Share Screen'}</small>
        </button>

        <button
          className={`vc-ctrl-btn ${showChat ? 'active' : ''}`}
          onClick={() => setShowChat(!showChat)}
          title="Chat"
        >
          <span>💬</span>
          <small>Chat</small>
        </button>

        <button className="vc-ctrl-btn vc-end-call" onClick={endCall} title="End Call">
          <span>📞</span>
          <small>End Call</small>
        </button>
      </div>
    </div>
  );
};

export default VideoConsultation;
