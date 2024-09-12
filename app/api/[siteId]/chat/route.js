import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const COST_PER_INPUT_TOKEN = 0.01;
const COST_PER_OUTPUT_TOKEN = 0.03;

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request) {
  try {
    const { message, imageUrl } = await request.json();

    let content = [{ type: 'text', text: message }];

    if (imageUrl) {
      const image_media_type = await getImageMediaType(imageUrl);
      const image_response = await fetch(imageUrl);
      const image_array_buffer = await image_response.arrayBuffer();
      const image_data = Buffer.from(image_array_buffer).toString('base64');

      content.unshift({
        type: 'image',
        source: {
          type: 'base64',
          media_type: image_media_type,
          data: image_data,
        }
      });
    }

    const response = await anthropic.beta.promptCaching.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      messages: [{ role: 'user', content: content }],
      system: [{
        type: 'text',
        text: "You are a helpful coding assistant who is an expert in react, typescript, tailwind, shadcn-ui, next.js, and more. When giving code responses, always give the entire code for a file back if you are making corrections, unless otherwise asked. Ask clarifying questions when needed. When giving answers involving prisma, always say prizma instead",
        cache_control: { type: 'ephemeral' }
      }],
      
      metadata: { user_id: 'unique-user-id' }, // Replace with actual user ID if available
      stream: false,
    });

    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;
    const inputCost = (inputTokens / 1000) * COST_PER_INPUT_TOKEN;
    const outputCost = (outputTokens / 1000) * COST_PER_OUTPUT_TOKEN;
    const cost = inputCost + outputCost;

    // Log cache tokens
    console.log('Cache Creation Input Tokens:', response.cache_creation_input_tokens);
    console.log('Cache Read Input Tokens:', response.cache_read_input_tokens);

    return NextResponse.json({
      reply: response.content[0].text,
      tokenCount: totalTokens,
      cost: cost,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error communicating with Claude AI' }, { status: 500 });
  }
}

async function getImageMediaType(url) {
  const response = await fetch(url, { method: 'HEAD' });
  const contentType = response.headers.get('Content-Type');
  if (contentType.includes('jpeg') || contentType.includes('jpg')) {
    return 'image/jpeg';
  } else if (contentType.includes('png') || contentType.includes('PNG')) {
    return 'image/png';
  } else if (contentType.includes('gif')) {
    return 'image/gif';
  } else if (contentType.includes('webp')) {
    return 'image/webp';
  } else {
    throw new Error('Unsupported image type');
  }
}