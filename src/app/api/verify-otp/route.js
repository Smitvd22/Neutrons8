import connectMongo from '@/lib/mongodb';
import OTP from '@/models/OTP';

export async function POST(req) {
  await connectMongo();
  const { email, otp } = await req.json();

  const otpRecord = await OTP.findOne({ email, code: otp });

  if (!otpRecord || new Date() > otpRecord.expiresAt) {
    return new Response(JSON.stringify({ message: 'Invalid or expired OTP' }), { status: 400 });
  }

  // OTP verified, remove from database
  await OTP.deleteOne({ email });

  return new Response(JSON.stringify({ message: 'OTP verified successfully' }), { status: 200 });
}
