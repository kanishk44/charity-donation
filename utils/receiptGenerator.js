const PDFDocument = require("pdfkit");

function generateReceipt(donation) {
  const doc = new PDFDocument();

  // Handle errors
  doc.on("error", (err) => {
    console.error("Error generating PDF:", err);
  });

  // Add letterhead
  doc.fontSize(20).text("Charity Donation Platform", { align: "center" });
  doc.moveDown();
  doc.fontSize(16).text("Donation Receipt", { align: "center" });
  doc.moveDown();

  // Add receipt details
  doc.fontSize(12);
  doc.text(`Receipt Number: ${donation.receiptNumber}`);
  doc.text(`Date: ${new Date(donation.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  // Add donor details
  doc.text(`Donor Name: ${donation.User.name}`);
  doc.text(`Donor Email: ${donation.User.email}`);
  doc.moveDown();

  // Add charity details
  doc.text(`Charity Name: ${donation.Charity.name}`);
  doc.text(`Charity Address: ${donation.Charity.address}`);
  doc.moveDown();

  // Add donation details
  doc.text(`Amount: ₹${donation.amount}`);
  doc.text(`Payment ID: ${donation.paymentId}`);
  doc.text(`Status: ${donation.status}`);
  doc.moveDown();

  // Add footer
  doc
    .fontSize(10)
    .text("Thank you for your generous donation!", { align: "center" });

  return doc;
}

module.exports = generateReceipt;
