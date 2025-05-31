import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getUserId() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    const { documentType, documentUrl } = await req.json();

    await connectDB();

    const updateData: any = {};
    if (documentType === 'studentId') {
      updateData['verificationStatus.studentId'] = {
        documentUrl,
        verified: false
      };
    } else if (documentType === 'nationalId') {
      updateData['verificationStatus.nationalId'] = {
        documentUrl,
        verified: false
      };
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Document submitted for verification',
      verificationStatus: user.verificationStatus
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 401 }
    );
  }
}