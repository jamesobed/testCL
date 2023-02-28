const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host: `${process.env.D_HOST}`,
  port: 465,
  secure: true,
  auth: {
    user: `${process.env.D_USER}`,
    pass: `${process.env.D_PSW}`,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
let transporterD = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS_2FA,
  },
});

export = {
  sendOTP: async (email: string, purpose: string, otp: number) => {
    let mailOptions = {
      // from: `MD CEO  <obed.james@youraccessibilityasset.com>`,
      from: `CargoLand  <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'CargoLand Shipment OTP',
      html: `This is your OTP ${purpose}:  ${otp} it expires in 5 minutes`,
    };
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
  verifyUserEmail: async (email: string, token: string) => {
    const link = `${process.env.ROOT_URL}/user/verify/${token}`;
    let temp = `
       <div style="max-width: 700px;
       margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
       <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome CargoLand</h2>
        <p>Dear Customer, Follow the link by clicking on the button to verify your email
        </p>
         <a href=${link}
         style="background: crimson; text-decoration: none; color: white;
          padding: 10px 20px; margin: 10px 0;
         display: inline-block;">Click here</a>
        </div>
        `;
    let mailOptions = {
      // from: `MD CEO  <obed.james@youraccessibilityasset.com>`,
      from: `CargoLand  <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify your email',
      html: temp,
    };
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  resendVerificationLink: async (email: string, token: string) => {
    const link = `${process.env.ROOT_URL}/user/verify/${token}`;
    let temp = ` <div style="max-width: 700px;text-align: center; text-transform: uppercase;
    margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="color: teal;">Welcome To CargoLand</h2>
    <p>Please Follow the link by clicking on the button to verify your email
      </p>
      <div style='text-align:center ;'>
        <a href=${link}
        style="background: #277BC0; text-decoration: none; color: white;
        padding: 10px 20px; margin: 10px 0;
        display: inline-block;">Click here</a>
      </div>
  </div>`;
    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: temp,
    };
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
  forgotPassword: async (email: string, token: string) => {
    const link = `${process.env.FRONTEND_URL}/resetpassword/${token}`;
    let temp = `<div style="max-width: 700px;text-align: center; text-transform: uppercase;
    margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="color: teal;">CargoLand New Password Request</h2>
    <p>Please Follow the link by clicking on the button to change your password or ignore this email if you did not request this
     </p>
     <div style='text-align:center ;'>
       <a href=${link}
      style="background: #277BC0; text-decoration: none; color: white;
       padding: 10px 20px; margin: 10px 0;
      display: inline-block;">Click here</a>
     </div>
  </div>`;
    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: temp,
    };
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
  OrderNotification: async (email: string[], message: string) => {
    const link = `${process.env.FRONTEND_URL}/dashboard`;
    let temp = `<div style="max-width: 700px;text-align: center; text-transform: uppercase;
    margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="color: teal;">CargoLand New Research Post Notification</h2>
    <p>${message}</p>
    <br/>
    <p>Please Follow the link by clicking on the button to view the post
     <div style='text-align:center ;'>
       <a href=${link}
      style="background: #277BC0; text-decoration: none; color: white;
       padding: 10px 20px; margin: 10px 0;
      display: inline-block;">Click here</a>
     </div>
  </div>`;
    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'New Research Post Notification',
      html: temp,
    };
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  surveyNotification: async (email: string, token: string) => {
    const link = `${process.env.FRONTEND_URL}/survey/${token}`;
    let temp = `<div style="max-width: 700px;text-align: center; text-transform: uppercase;
    margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="color: teal;">CargoLand Survey Form</h2>
    <p>Please Follow the link by clicking on the button to fill the survey form
     </p>
     <div style='text-align:center ;'>
       <a href=${link}
      style="background: #277BC0; text-decoration: none; color: white;
       padding: 10px 20px; margin: 10px 0;
      display: inline-block;">Click here</a>
     </div>
  </div>`;
    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Survey Form',
      html: temp,
    };
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
  contactUs: async (email: string, name: string, message: string) => {
    let temp = `<div style="max-width: 700px;text-align: center; text-transform: uppercase;
    margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="color: teal;">CargoLand Contact Us</h2>
    <p>From: ${name}</p>
    <p>Email: ${email}</p>
    <p>Message: ${message}</p>
  </div>`;
    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Contact Us',
      html: temp,
    };
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
};
