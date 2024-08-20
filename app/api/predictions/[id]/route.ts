// File: app/api/predictions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing prediction ID' }, { status: 400 });
  }

  try {
    const prediction = await replicate.predictions.get(id);
    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Error fetching prediction:', error);
    return NextResponse.json({ error: 'Failed to fetch prediction' }, { status: 500 });
  }
}
