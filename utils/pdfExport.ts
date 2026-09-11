import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Sanitizes a string for use in a file name
 */
export const sanitizeFilenamePart = (input: string): string => {
  return (input || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9_-]/g, '_')     // replace non-alphanumeric with _
    .replace(/_+/g, '_')                  // collapse multiple underscores
    .replace(/^_|_$/g, '') || 'document';
};

export interface PdfExportResult {
  success: boolean;
  filename: string;
  error?: string;
}

/**
 * Exports a DOM element as a high-DPI Swiss A4 PDF document
 */
export const exportInvoiceToPdf = async (
  element: HTMLElement,
  invoiceNumber: string,
  customerName: string
): Promise<PdfExportResult> => {
  const cleanInv = sanitizeFilenamePart(invoiceNumber);
  const cleanCust = sanitizeFilenamePart(customerName);
  const filename = `BATIMOVE_Facture_${cleanInv}_${cleanCust}.pdf`;

  try {
    // 1. High-DPI canvas render
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x resolution for ultra-sharp Swiss typography & vector-like lines
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200 // Consistent desktop rendering width
    });

    // 2. Initialize A4 portrait PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate height of image in PDF mm
    const imgHeightInPdf = (canvasHeight * pdfWidth) / canvasWidth;
    const imgData = canvas.toDataURL('image/png');

    // If fits on 1 page or slightly larger, scale to fit single page if within 10%
    if (imgHeightInPdf <= pdfHeight || imgHeightInPdf <= pdfHeight * 1.08) {
      const renderHeight = Math.min(imgHeightInPdf, pdfHeight);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderHeight, undefined, 'FAST');
    } else {
      // Multi-page handling
      let heightLeft = imgHeightInPdf;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeightInPdf;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
    }

    // 3. Save to browser download pipeline
    pdf.save(filename);
    return { success: true, filename };
  } catch (err: any) {
    console.error('Failed to generate invoice PDF:', err);
    return {
      success: false,
      filename,
      error: err?.message || 'Erreur lors de la génération du document PDF.'
    };
  }
};
