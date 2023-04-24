const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'alroundervamshi@gmail.com',
    pass: 'ubcramybxywiinhl'
  }
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'alroundervamshi@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  sendEmail
};
