import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, phone, message, toEmail, smtpConfig } = await request.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Prime Accounting" <${smtpConfig.user}>`,
      to: toEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #EAB308; margin-bottom: 20px;">New Contact Form Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background-color: #f9fafb; font-weight: bold;">Email:</td>
              <td style="padding: 10px;"><a href="mailto:${email}" style="color: #EAB308;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 10px; background-color: #f9fafb; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;">${phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 10px;">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
          
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Sent from Prime Accounting Contact Form<br>
            <span style="color: #9ca3af;">IP: ${request.headers.get('x-forwarded-for') || 'Unknown'}</span>
          </p>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ''}
        
        Message:
        ${message}
        
        ---
        Sent from Prime Accounting Contact Form
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error: any) {
    console.error('SMTP Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to send email' 
    }, { 
      status: 500 
    });
  }
}