import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  await connectMongo();
  const { username, email } = await req.json();

  const existingUser = await User.findOne({
    $or: [{ name: username }, { email }],
  });

  if (existingUser) {
    const errors = {};
    if (existingUser.name === username) errors.username = 'Username already taken';
    if (existingUser.email === email) errors.email = 'Email already registered';
    return new Response(JSON.stringify({ exists: true, errors }), { status: 409 });
  }

  return new Response(JSON.stringify({ exists: false }), { status: 200 });
}
