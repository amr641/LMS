import PDFDocument from "pdfkit";

export function generateCertificate(userName: string, courseName: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ layout: "landscape", size: "A4" });
    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Colors and Styling Setup
    doc.fillColor("#333");
    doc.font("Helvetica-Bold");

    // Title
    doc.fontSize(40).text("Certificate of Achievement", { align: "center" }).moveDown(1);
    
    // Decorative Line
    doc.moveTo(50, 140).lineTo(790, 140).strokeColor("#007ACC").lineWidth(2).stroke();

    // Recipient Name
    doc.font("Helvetica-Bold").fontSize(30).fillColor("#007ACC");
    doc.text(userName.toUpperCase(), { align: "center" }).moveDown(1);

    // Course Description
    doc.fillColor("#333").fontSize(20);
    doc.text(`For successfully completing the course:`, { align: "center" }).moveDown(0.5);
    doc.font("Helvetica-Oblique").text(`"${courseName}"`, { align: "center" }).moveDown(1);

    // Issuance Date
    doc.font("Helvetica").fontSize(16).fillColor("#666");
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, { align: "center" }).moveDown(2);

    // Signature Placeholder
    doc.moveDown(4).fontSize(14);
    doc.text("LMS", 600, 500, { align: "left" });
    doc.moveTo(600, 495).lineTo(750, 495).strokeColor("#333").stroke();

    // Finalize
    doc.end();
  });
}
