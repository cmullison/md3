// app/api/conversation/[id]/route.ts
import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conversation = await prismadb.conversation.findFirst({
      where: {
        id: params.id,
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
        const messages = await prismadb.message.deleteMany({
      where: {
        conversationId: params.id,
      },
      
    });
    const conversation = await prismadb.conversation.delete({
      where: {
        id: params.id,
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}