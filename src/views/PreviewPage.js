import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf'; 
import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react';
import '../fonts/THSarabunNew-normal'; // Import the generated font JS file

const PreviewPage = () => {
  const location = useLocation();
  const { selectedData } = location.state || { selectedData: [] };
  const [pdfUrl, setPdfUrl] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const generatePDF = () => {
      const doc = new jsPDF('p', 'pt', 'a4');

      // Register and set the Thai font
      doc.addFont('THSarabunNew-normal.ttf', 'THSarabunNew', 'normal');
      doc.setFont('THSarabunNew', 'normal');
      doc.setFontSize(12);

      const margin = 12; // Margin from the edges
      const halfPageHeight = (doc.internal.pageSize.height - margin * 2) / 2; // Half page height
      const lineSpacing = 10;

      // Display month and year at a 45-degree angle in the top-left corner
    
      console.log({selectedData})
      selectedData.forEach((data, index) => {
        // Check if we need to add a new page
        if (index > 0 && index % 4 === 0) {
          doc.addPage(); // Add a new page after every four rooms
        }

        // Calculate x and y positions for each block
        const xPosition = margin + (index % 2) * (doc.internal.pageSize.width / 2); // 2 columns
        let yPosition = margin + Math.floor(index % 4 / 2) * halfPageHeight; // 2 rows

        // Draw vertical line to separate left and right sections
        const verticalLineX = doc.internal.pageSize.width / 2; // Middle of the page
        doc.line(verticalLineX, margin, verticalLineX, doc.internal.pageSize.height - margin); // Vertical line

        if (index % 4 === 0) {
          const separatorY = yPosition + halfPageHeight - margin; // Position it at the bottom of the block
          doc.setDrawColor(0); // Set the color for the line
          doc.setLineWidth(1); // Set the line width
          doc.line(margin, separatorY, doc.internal.pageSize.width - margin, separatorY); // Horizontal line     
        }

        doc.setFontSize(16);
        doc.text(`${data.monthThai} ${Number(data.year) + 543}`,  xPosition + 5, yPosition + 15); // Position (40,40) and rotate text by 45 degrees
      
        // Fill in the data for this block
        doc.setFontSize(24);
        const roomText = `ห้อง: ${data.roomNo}`;
        const textWidth = doc.getTextWidth(roomText);
        const centerTextX = xPosition + (doc.internal.pageSize.width / 2 - textWidth) / 2;
        doc.text(roomText, centerTextX, yPosition + 30); // Centered Room Number

        doc.setFontSize(22);
        doc.text(`ค่าเช่า: `, xPosition + 80, yPosition + 60);
        doc.text(`${data.rentPrice}`, xPosition + 130, yPosition + 60);
        doc.text(`บาท`, xPosition + 180, yPosition + 60);
        yPosition += lineSpacing;

        // Electricity Section
        doc.text(`ค่าไฟ:`, xPosition + 10, yPosition + 90);
        const elecUsage = Number(data.elecNew) - Number(data.elecOld);
        doc.text(`${elecUsage}`, xPosition + 70, yPosition + 90);
        doc.text('หน่วย', xPosition + 120, yPosition + 90);
        doc.text(`${data.elecBill}`, xPosition + 180, yPosition + 90);
        doc.text('บาท', xPosition + 230, yPosition + 90);
        yPosition += lineSpacing; // Increase spacing

        doc.text(`มิเตอร์ใหม่:`, xPosition + 10, yPosition + 120);
        doc.text(`${data.elecNew}`, xPosition + 100, yPosition + 120);
        yPosition += lineSpacing * 2; // Increase spacing
        doc.text(`มิเตอร์เก่า:`, xPosition + 10, yPosition + 140);
        doc.text(`${data.elecOld}`, xPosition + 100, yPosition + 140);

        // Water Section
        doc.text(`ค่าน้ำ:`, xPosition + 10, yPosition + 190);
        const waterUsage = Number(data.waterNew) - Number(data.waterOld); // Convert to number and subtract
        doc.text(`${waterUsage}`, xPosition + 70, yPosition + 190);
        doc.text('หน่วย', xPosition + 120, yPosition + 190);
        doc.text(`${data.waterBill}`, xPosition + 180, yPosition + 190);
        doc.text('บาท', xPosition + 230, yPosition + 190);
        yPosition += lineSpacing; // Increase spacing

        doc.text(`มิเตอร์ใหม่:`, xPosition + 10, yPosition + 220);
        doc.text(`${data.waterNew}`, xPosition + 100, yPosition + 220);
        yPosition += lineSpacing * 2; // Increase spacing
        doc.text(`มิเตอร์เก่า: `, xPosition + 10, yPosition + 240);
        doc.text(`${data.waterOld}`, xPosition + 100, yPosition + 240);

        // Total Section
        doc.setFontSize(24);
        doc.text('รวม', xPosition + 80, yPosition + 290);
        doc.text(data.netBill, xPosition + 120, yPosition + 290);
      });

      // Generate PDF blob
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl); // Set PDF URL for iframe preview
    };

    if (selectedData.length > 0) {
      generatePDF(); // Call PDF generation
    }
  }, [selectedData]);


  return (
    <div>
      <CCard>
        <CCardHeader>
          บิลค่าบ้าน
          {/* Back Button */}
          <CButton color="secondary" onClick={() => navigate(-1)} style={{ float: 'right' }}>
            ย้อนกลับ
          </CButton>
        </CCardHeader>
        <CCardBody>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="800"
              title="PDF Preview"
              style={{ border: 'none' }}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default PreviewPage;