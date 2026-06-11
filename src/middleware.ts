import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/auth/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await isAdminAuthenticated();

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth/login");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" && authenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  if (authenticated) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
