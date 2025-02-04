import nodemailer from 'nodemailer';

const sendEmail = async ({
  from,
  to,
  subject,
  html,
  text,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    service: process.env.EMAIL_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const mail = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html,
      text: text,
    });
    return mail;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default sendEmail;
