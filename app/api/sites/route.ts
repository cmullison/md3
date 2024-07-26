import { createClient } from "@/utils/supabase/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST (
    req: Request,
) {
    try {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
        
        const body = await req.json();

        const {name} = body;

        if(!user) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        const site = await prismadb.site.create({
            data: {
                name, userId: user.id
            }
        })

        return NextResponse.json(site);

    } catch (error) {
        console.log('[STORES_POST]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}