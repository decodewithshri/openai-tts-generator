import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { text, voice = 'alloy', model = 'tts-1' } = body;

    // Validate text input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Check text length (OpenAI limit is 4096 characters)
    if (text.length > 4096) {
      return NextResponse.json(
        { error: 'Text exceeds maximum length of 4096 characters' },
        { status: 400 }
      );
    }

    // Validate voice
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(voice)) {
      return NextResponse.json(
        { error: `Invalid voice. Must be one of: ${validVoices.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate model
    const validModels = ['tts-1', 'tts-1-hd'];
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: `Invalid model. Must be one of: ${validModels.join(', ')}` },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Generate speech
    const mp3Response = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: text,
      response_format: 'mp3',
    });

    // Convert response to buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    // Return MP3 with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('Text-to-speech error:', error);
    
    // Handle OpenAI API errors
    if (error?.status) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message || 'Unknown error'}` },
        { status: error.status }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'An unexpected error occurred while generating speech' },
      { status: 500 }
    );
  }
}
