import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params }: { params: { siteId: string } }
) {
    try {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        const body = await req.json();

        const {name} = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if(!params.siteId) {
            return new NextResponse("Store id is required", {status: 400})
        }

        const site = await prismadb.site.updateMany({
            where: {
                id: params.siteId,
                userId: user.id
            },
            data: {
                name
            }
        })

        return NextResponse.json(site)

    } catch (error) {
        console.log('STORE_PATCH', error)
        return new NextResponse("Internal error", {status: 500})
    }
}



export async function DELETE (
    req: Request,
    { params }: { params: { siteId: string } }
) {
    try {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        const body = await req.json();

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.siteId) {
            return new NextResponse("Store id is required", {status: 400})
        }

        const site = await prismadb.site.deleteMany({
            where: {
                id: params.siteId,
                userId: user.id
            },
        })

        return NextResponse.json(site)

    } catch (error) {
        console.log('STORE_DELETE', error)
        return new NextResponse("Internal error", {status: 500})
    }
}