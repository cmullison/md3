import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;

        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        const profile = await prismadb.profile.findFirst({
            where: { userId }
        });

        if (!profile) {
            return new NextResponse("Profile not found", { status: 404 });
        }

        return NextResponse.json(profile);

    } catch (error) {
        console.error('[PROFILES_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}