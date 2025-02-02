// src/app/api/login/route.js
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
// import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ message: 'Username and password are required' }), { status: 400 });
  }

  await connectToDatabase();

  const user = await User.findOne({ username });
  if (!user) {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
  }

  // Implement session handling or token generation here

  return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
}

/*
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
}

const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

return new Response(JSON.stringify({ token }), { status: 200 }); */