import { createClient } from "@/utils/supabase/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"

interface Message {
    sender: 'user' | 'assistant';
    text: string;
}

export async function GET(req: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        try {
            const chats = await prismadb.conversation.findMany({
                where: {
                    userId: user.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
console.log("conversations:", chats)
            return NextResponse.json(chats);
        } catch (error) {
            console.error('[CONVERSATIONS_GET]', error);
            return new NextResponse(`Failed to get conversations: ${error}`, { status: 500 });
        }
    } catch (error) {
        console.log('[OTHER_ERROR]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { userId, title, messages } = body;

        console.log('User:', user);
        console.log('UserId:', userId);
        console.log('Title:', title);
        console.log('Messages:', messages);

        // Check if userId, title and messages are present
        if (!userId || !title || !messages) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Check if messages is an array
        if (!Array.isArray(messages)) {
            return new NextResponse("Messages must be an array", { status: 400 });
        }

        try {
            const savedConversation = await prismadb.conversation.create({
                data: {
                    userId,
                    title,
                    messages: {
                        create: messages.map((msg: Message) => ({
                            role: msg.sender === 'user' ? 'user' : 'assistant',
                            content: msg.text
                        }))
                    }
                }
            });

            return NextResponse.json(savedConversation);
        } catch (error) {
            console.error('[CONVERSATIONS_POST]', error);
            return new NextResponse(`Failed to save conversation: ${error}`, { status: 500 });
        }
    } catch (error) {
        console.log('[OUTER_ERROR]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}