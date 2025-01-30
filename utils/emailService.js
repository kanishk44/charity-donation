const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const defaultSender = new Sender(
  "noreply@kanishkcodes.biz",
  "Charity Donation Platform"
);

const emailTemplates = {
  donationConfirmation: {
    subject: "Thank you for your donation!",
    html: (data) => `
      <h2>Thank you for your donation!</h2>
      <p>Dear ${data.donorName},</p>
      <p>Thank you for your generous donation of ₹${data.amount} to ${
      data.charityName
    }.</p>
      <p>Your donation will help make a difference in their mission: ${
        data.charityMission
      }</p>
      <p>Donation Details:</p>
      <ul>
        <li>Receipt Number: ${data.receiptNumber}</li>
        <li>Date: ${new Date(data.date).toLocaleDateString()}</li>
        <li>Payment ID: ${data.paymentId}</li>
      </ul>
      <p>You can download your donation receipt from your dashboard.</p>
      <p>Thank you for your support!</p>
    `,
  },
  charityUpdate: {
    subject: "Update from {{charityName}}",
    html: (data) => `
      <h2>Update from ${data.charityName}</h2>
      <p>Dear ${data.donorName},</p>
      <p>${data.message}</p>
      <p>Impact Summary:</p>
      <ul>
        <li>Beneficiaries Helped: ${data.beneficiariesCount}</li>
        <li>Period: ${data.period}</li>
      </ul>
      <p>Thank you for your continued support!</p>
    `,
  },
};

async function sendEmail(type, recipientEmail, recipientName, data) {
  try {
    const template = emailTemplates[type];
    if (!template) {
      throw new Error("Invalid email template type");
    }

    const recipients = [new Recipient(recipientEmail, recipientName)];

    const emailParams = new EmailParams()
      .setFrom(defaultSender)
      .setTo(recipients)
      .setSubject(template.subject)
      .setHtml(template.html(data));

    await mailerSend.email.send(emailParams);
    console.log(`${type} email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = {
  sendDonationConfirmation: async (donation, user, charity) => {
    await sendEmail("donationConfirmation", user.email, user.name, {
      donorName: user.name,
      amount: donation.amount,
      charityName: charity.name,
      charityMission: charity.mission,
      receiptNumber: donation.receiptNumber,
      date: donation.createdAt,
      paymentId: donation.paymentId,
    });
  },

  sendCharityUpdate: async (report, donors) => {
    for (const donor of donors) {
      await sendEmail("charityUpdate", donor.email, donor.name, {
        donorName: donor.name,
        charityName: report.Charity.name,
        message: report.description,
        beneficiariesCount: report.beneficiariesCount,
        period: report.period,
      });
    }
  },
};
