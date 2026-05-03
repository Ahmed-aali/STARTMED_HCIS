import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! 👋 How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const faqData = {
    'book appointment': 'To book an appointment:\n1) Go to "Book Appointment" page\n2) Select a doctor\n3) Choose date and time\n4) Enter reason for visit\n5) Click "Book Appointment"',
    'view records': 'To view your medical records:\n1) Go to "Medical Records" in your dashboard\n2) All your past records will be displayed with diagnosis and treatment details',
    'pay bills': 'To pay bills:\n1) Go to "Bills" section\n2) Click "Pay" button next to unpaid bills\n3) Enter payment amount\n4) Confirm payment',
    'view prescriptions': 'To view prescriptions:\n1) Go to "Prescriptions" in your dashboard\n2) You can see all prescriptions issued by your doctors',
    'contact support': 'For support, please contact the admin through the system or call the hospital helpline.',
    'change password': 'To change password: Go to Settings > Account > Change Password',
    'appointment reminder': 'You will receive appointment reminders on your registered email before the scheduled appointment.',
    'cancel appointment': 'To cancel an appointment: Go to "My Appointments" > Select appointment with "Pending" status > Click "Cancel"',
    'hello': 'Hi there! How can I assist you? 😊',
    'hi': 'Hello! What can I help you with today?',
    'help': 'I can help you with:\n• Booking appointments\n• Viewing medical records\n• Paying bills\n• Viewing prescriptions\n• Cancelling appointments\n• Contact support',
  };

  const quickActions = [
    'Book Appointment',
    'View Records',
    'Pay Bills',
    'Help',
  ];

  const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();

    for (const [key, value] of Object.entries(faqData)) {
      if (message.includes(key)) {
        return value;
      }
    }

    return "I'm sorry, I don't understand that question. Try asking about: booking appointments, viewing records, paying bills, prescriptions, or type 'help' for more options.";
  };

  const handleSendMessage = (text) => {
    const messageText = text || input;
    if (messageText.trim() === '') return;

    const newUserMessage = { id: Date.now(), text: messageText, sender: 'user' };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getResponse(messageText);
      const newBotMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, newBotMessage]);
    }, 600);
  };

  const styles = {
    container: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      fontFamily: "'Inter', sans-serif",
      zIndex: 1000,
    },
    toggleBtn: {
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    window: {
      position: 'absolute',
      bottom: '72px',
      right: '0',
      width: '380px',
      height: '520px',
      backgroundColor: '#f8fafc',
      borderRadius: '20px',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      animation: 'chatSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    header: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      padding: '18px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontWeight: '700',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    headerDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#06d6a0',
      boxShadow: '0 0 8px rgba(6, 214, 160, 0.5)',
    },
    closeBtn: {
      background: 'rgba(255,255,255,0.15)',
      border: 'none',
      color: 'white',
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    messagesArea: {
      flex: 1,
      overflow: 'auto',
      padding: '16px',
    },
    messageRow: (sender) => ({
      marginBottom: '12px',
      display: 'flex',
      justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
      animation: 'msgFadeIn 0.3s ease',
    }),
    bubble: (sender) => ({
      background: sender === 'user'
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'white',
      color: sender === 'user' ? 'white' : '#334155',
      padding: '12px 16px',
      borderRadius: sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
      maxWidth: '80%',
      wordBreak: 'break-word',
      fontSize: '14px',
      lineHeight: '1.5',
      boxShadow: sender === 'user' ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
      whiteSpace: 'pre-line',
    }),
    typingIndicator: {
      display: 'flex',
      gap: '4px',
      padding: '12px 16px',
      background: 'white',
      borderRadius: '16px 16px 16px 4px',
      width: 'fit-content',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    dot: (delay) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#94a3b8',
      animation: `dotBounce 1.2s infinite ${delay}s`,
    }),
    quickActionsArea: {
      padding: '8px 16px',
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    quickBtn: {
      padding: '6px 14px',
      borderRadius: '20px',
      border: '1.5px solid #e2e8f0',
      background: 'white',
      color: '#667eea',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: "'Inter', sans-serif",
    },
    inputArea: {
      display: 'flex',
      gap: '8px',
      padding: '12px 16px',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: 'white',
    },
    input: {
      flex: 1,
      padding: '10px 14px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: "'Inter', sans-serif",
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    sendBtn: {
      padding: '10px 18px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '14px',
      fontFamily: "'Inter', sans-serif",
      transition: 'all 0.2s',
    },
  };

  return (
    <>
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
      <div style={styles.container}>
        {!isOpen && (
          <button
            style={styles.toggleBtn}
            onClick={() => setIsOpen(true)}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            💬
          </button>
        )}

        {isOpen && (
          <div style={styles.window}>
            <div style={styles.header}>
              <div style={styles.headerTitle}>
                <div style={styles.headerDot}></div>
                Start Med Assistant
              </div>
              <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div style={styles.messagesArea}>
              {messages.map((msg) => (
                <div key={msg.id} style={styles.messageRow(msg.sender)}>
                  <div style={styles.bubble(msg.sender)}>{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={styles.typingIndicator}>
                    <div style={styles.dot(0)}></div>
                    <div style={styles.dot(0.15)}></div>
                    <div style={styles.dot(0.3)}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={styles.quickActionsArea}>
              {quickActions.map((action) => (
                <button
                  key={action}
                  style={styles.quickBtn}
                  onClick={() => handleSendMessage(action)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {action}
                </button>
              ))}
            </div>

            <div style={styles.inputArea}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                style={styles.input}
                onFocus={(e) => { e.target.style.borderColor = '#667eea'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; }}
              />
              <button
                style={styles.sendBtn}
                onClick={() => handleSendMessage()}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
