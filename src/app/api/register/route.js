// src/app/api/register/route.js
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectMongo();
  const { username, email, password } = await req.json();

  // Check if the user already exists using either username or email
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return new Response(
      JSON.stringify({ message: 'User already exists' }),
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with username, email, and password
  const newUser = new User({
    username,
    email, // ensure email is passed here
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new Response(
      JSON.stringify({ message: 'User registered successfully' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
}


/*
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ message: 'Username and password are required' }), { status: 400 });
  }

  await connectToDatabase();

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
}
*/

/*
// src/app/api/register/route.js
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ message: 'Username and password are required' }), { status: 400 });
  }

  await connectToDatabase();

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
}
*/