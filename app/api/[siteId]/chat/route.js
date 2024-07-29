import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const COST_PER_INPUT_TOKEN = 0.01; // Example cost, adjust as needed
const COST_PER_OUTPUT_TOKEN = 0.03;

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      system: "You are a helpful coding assistant who is an expert in react, typescript, tailwind, next.js, and more. You will primarily be asked for code, and questions related to it. Be concise with your responses and ask for clarifying questions when needed.",
      messages: [{ role: 'user', content: message }],
    });

    // Calculate token count and cost
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;
    const inputCost = (response.usage.input_tokens / 1000) * COST_PER_INPUT_TOKEN;
    const outputCost = (response.usage.output_tokens / 1000) * COST_PER_OUTPUT_TOKEN;
    const cost = inputCost + outputCost;

    return NextResponse.json({
      reply: response.content[0].text,
      tokenCount: totalTokens,
      cost: cost.toFixed(6), // Round to 6 decimal places
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error communicating with Claude AI' }, { status: 500 });
  }
}
