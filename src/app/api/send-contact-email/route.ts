import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Log the contact form submission
    console.log('📧 Contact Form Submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject || 'Contact Form');
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('---');

    // Send actual email now that SMTP is configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS.replace(/\s/g, ''), // Remove any spaces from password
        },
        secure: true,
        port: 465,
      });

      const mailOptions = {
        from: `"Noamani Perfume" <${process.env.SMTP_USER}>`,
        to: 'noamaniperfumes@gmail.com', // Send to your business email
        subject: subject || 'New Contact Form Message - Noamani Perfumes',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #bfa14a; border-radius: 10px;">
            <h2 style="color: #bfa14a; text-align: center;">New Contact Form Submission</h2>
            <hr style="border: 1px solid #bfa14a; margin: 20px 0;">
            <p><strong style="color: #333;">Name:</strong> ${name}</p>
            <p><strong style="color: #333;">Email:</strong> <a href="mailto:${email}" style="color: #bfa14a;">${email}</a></p>
            <p><strong style="color: #333;">Subject:</strong> ${subject || 'Contact Form'}</p>
            <p><strong style="color: #333;">Message:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #bfa14a;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <hr style="border: 1px solid #bfa14a; margin: 20px 0;">
            <p style="text-align: center; color: #666; font-size: 12px;">Sent from Noamani Perfumes Website Contact Form</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully to:', mailOptions.to);
    } else {
      console.log('⚠️ SMTP credentials not configured, email not sent');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your message! We have received your inquiry and will get back to you soon.' 
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email.' },
      { status: 500 }
    );
  }
} 