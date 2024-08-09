import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "fable",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
