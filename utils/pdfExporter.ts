import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type StoredFIRData } from '../types';

export const exportFirToPdf = (firData: StoredFIRData) => {
  const doc = new jsPDF();
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Title
  doc.setFontSize(18);
  doc.text('First Information Report (F.I.R)', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Basic Info
  doc.setFontSize(12);
  doc.text(`Submission Date: ${new Date(firData.submissionDate).toLocaleString()}`, margin, yPos);
  yPos += 7;
  doc.text(`Incident Date & Time: ${new Date(firData.dateTime).toLocaleString()}`, margin, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.text(`Complainant: ${firData.complainantName}`, margin, yPos);
  yPos += 7;
  doc.text(`Address: ${firData.address}`, margin, yPos);
  yPos += 7;
  doc.text(`Place of Occurrence: ${firData.placeOfOccurrence}`, margin, yPos);
  yPos += 15;

  // Incident Details
  doc.setFontSize(14);
  doc.text('Details of Incident', margin, yPos);
  yPos += 8;
  doc.setFontSize(10);
  const detailsText = doc.splitTextToSize(firData.incidentDetails, pageWidth - margin * 2);
  doc.text(detailsText, margin, yPos);
  
  // Calculate y position after the multiline text
  const textHeight = doc.getTextDimensions(detailsText).h;
  yPos += textHeight + 10;

  // IPC Sections Table
  doc.setFontSize(14);
  doc.text('Applicable IPC Sections', margin, yPos);
  yPos += 8;

  const tableColumn = ["Section", "Title", "Description"];
  const tableRows = firData.ipcSections.map(ipc => [ipc.section, ipc.title, ipc.description]);
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: yPos,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] }, // brand-blue
  });

  // Save the PDF
  const fileName = `FIR_${firData.complainantName.replace(/\s+/g, '_')}_${new Date(firData.submissionDate).toLocaleDateString().replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
