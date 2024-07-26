import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params }: { params: { siteId: string, heroId: string } }
) {
    try {
const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
        const body = await req.json();

        const { label, imageUrl } = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label) {
            return new NextResponse("Label is required", {status: 400})
        }

        if(!imageUrl) {
            return new NextResponse("ImageUrl is required", {status: 400})
        }

        if(!params.heroId) {
            return new NextResponse("Hero id is required", {status: 400})
        }

        const siteByUserId = await prismadb.site.findFirst({
            where: {
                id: params.siteId,
                userId: user.id,
            }
        })
        
        if(!siteByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const hero = await prismadb.hero.updateMany({
            where: {
                id: params.heroId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(hero)

    } catch (error) {
        console.log('HERO_PATCH', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function DELETE (
    req: Request,
    { params }: { params: { siteId: string, heroId: string } }
) {
    try {
const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.heroId) {
            return new NextResponse("hero id is required", {status: 400})
        }

        const siteByUserId = await prismadb.site.findFirst({
            where: {
                id: params.siteId,
                userId: user.id,
            }
        })
        
        if(!siteByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const hero = await prismadb.hero.deleteMany({
            where: {
                id: params.heroId,
            },
        })

        return NextResponse.json(hero)

    } catch (error) {
        console.log('HERO_DELETE', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function GET (
    req: Request,
    { params }: { params: { heroId: string } }
) {
    try {

        if(!params.heroId) {
            return new NextResponse("hero id is required", {status: 400})
        }

        const hero = await prismadb.hero.findUnique({
            where: {
                id: params.heroId,
            },
        })

        return NextResponse.json(hero)

    } catch (error) {
        console.log('HERO_GET', error)
        return new NextResponse("Internal error", {status: 500})
    }
}