import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePrescriptionPDF = async (prescription, patient) => {
  // Create a hidden container element
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '50px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = '"Inter", "Segoe UI", Arial, sans-serif';
  container.style.boxSizing = 'border-box';

  // Build the HTML content
  container.innerHTML = `
    <div style="border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="color: #2563eb; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">STARTMED</h1>
        <p style="margin: 5px 0 0; color: #64748b; font-size: 14px;">123 Healthcare Blvd, Medical District</p>
        <p style="margin: 0; color: #64748b; font-size: 14px;">Contact: +1 (555) 123-4567 | care@startmed.com</p>
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; font-size: 24px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">Prescription</h2>
        <p style="margin: 8px 0 0; font-size: 14px;"><strong>Date:</strong> ${new Date(prescription.issuedDate).toLocaleDateString()}</p>
        <p style="margin: 2px 0 0; font-size: 14px;"><strong>Rx ID:</strong> #${prescription._id.slice(-6).toUpperCase()}</p>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <div style="flex: 1;">
        <h3 style="margin: 0 0 10px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Patient Details</h3>
        <p style="margin: 0; font-weight: 700; font-size: 18px; color: #0f172a;">${patient.firstName} ${patient.lastName}</p>
        <p style="margin: 5px 0 0; font-size: 14px;">Email: ${patient.email}</p>
      </div>
      <div style="flex: 1; text-align: right;">
        <h3 style="margin: 0 0 10px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Doctor Details</h3>
        <p style="margin: 0; font-weight: 700; font-size: 18px; color: #0f172a;">Dr. ${prescription.doctorId?.userId?.firstName} ${prescription.doctorId?.userId?.lastName}</p>
        <p style="margin: 5px 0 0; font-size: 14px;">Specialization: ${prescription.doctorId?.specialization || 'General Practitioner'}</p>
      </div>
    </div>

    <h3 style="color: #0f172a; margin-bottom: 15px; font-size: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
      💊 Prescribed Medications
    </h3>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="padding: 14px 16px; text-align: left; border-bottom: 2px solid #cbd5e1; font-weight: 600; font-size: 14px;">Medicine</th>
          <th style="padding: 14px 16px; text-align: left; border-bottom: 2px solid #cbd5e1; font-weight: 600; font-size: 14px;">Dosage</th>
          <th style="padding: 14px 16px; text-align: left; border-bottom: 2px solid #cbd5e1; font-weight: 600; font-size: 14px;">Frequency</th>
          <th style="padding: 14px 16px; text-align: left; border-bottom: 2px solid #cbd5e1; font-weight: 600; font-size: 14px;">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${prescription.medicines.map((m, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#fafafa'};">
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 15px;"><strong>${m.medicineName}</strong></td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${m.dosage}</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${m.frequency}</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${m.duration}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    ${prescription.notes ? `
      <div style="margin-bottom: 40px;">
        <h3 style="color: #64748b; margin-bottom: 10px; font-size: 14px; text-transform: uppercase;">Doctor's Notes & Instructions:</h3>
        <p style="padding: 16px; background-color: #f8fafc; border-left: 4px solid #3b82f6; margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">
          ${prescription.notes}
        </p>
      </div>
    ` : ''}

    <div style="margin-top: 80px; display: flex; justify-content: flex-end;">
      <div style="text-align: center; width: 250px;">
        <div style="border-bottom: 1px solid #94a3b8; padding-bottom: 10px; margin-bottom: 10px; font-family: 'Georgia', serif; font-size: 28px; font-style: italic; color: #0f172a;">
          Dr. ${prescription.doctorId?.userId?.lastName}
        </div>
        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">Authorized Signature</p>
        <p style="margin: 4px 0 0; color: #94a3b8; font-size: 12px;">Valid electronically, no stamp required.</p>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Wait for a brief moment to ensure fonts/styles are applied
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(container, {
      scale: 2, // High quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`STARTMED_Prescription_${prescription._id.slice(-6).toUpperCase()}.pdf`);
  } catch (err) {
    console.error('Error generating PDF:', err);
  } finally {
    document.body.removeChild(container);
  }
};
