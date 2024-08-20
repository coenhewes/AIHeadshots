import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const prediction = await request.json();
  
  // Here you can handle the completed prediction
  // For example, you might want to store it in a database
  console.log('Prediction completed:', prediction);

  return NextResponse.json({ message: 'Webhook received' });
}
