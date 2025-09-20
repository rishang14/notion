import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default async function middleware(req: NextRequest) {
  const session = await auth();

  if (session?.user?.email) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }  

  return NextResponse.next()
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};