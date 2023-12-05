const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,               
    host: "smtp.gmail.com",
       auth: {
            user: `${process.env.projmail}`,
            pass: `${process.env.projpass}`,
         },
    secure: true,
});

const mailData = {
    from: `${process.env.projmail}`,
    to: 'placeholderTo',
    subject: 'placeholderSubject',
    html: '<b>Placeholder Text!</b>',
};

function SetMailData(to, subject, html) {
    mailData.to = to;
    mailData.subject = subject;
    mailData.html = html;
}

async function SendMail(to, subject, html) { 
    SetMailData(to, subject, html);                                          
    return await transporter.sendMail(mailData, function (err, info) {
        if (err)
            console.log(err);
        // else
        //     console.log(info);
    })
};

const Mail = {SendMail}; 

module.exports = Mail;