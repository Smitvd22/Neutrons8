import nodemailer from 'nodemailer';
import connectMongo from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';

export async function POST(req) {
  await connectMongo();
  const { email } = await req.json();

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'Email already registered' }), { status: 409 });
  }

  // Generate a 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP in MongoDB with expiration time (5 minutes)
  await OTP.create({ email, code: otpCode, expiresAt: new Date(Date.now() + 300000) });

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password if using Gmail
    },
  });
  

  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
  });

  return new Response(JSON.stringify({ message: 'OTP sent successfully' }), { status: 200 });
}
