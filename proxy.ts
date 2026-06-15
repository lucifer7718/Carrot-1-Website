import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const adminSession = request.cookies.get("admin-auth")?.value;
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  const isPublicAdminApi =
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";

  const isProtectedAdminApi =
    pathname.startsWith("/api/admin/") && !isPublicAdminApi;

  if (isProtectedAdminApi && adminSession !== "authenticated") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (isAdminPage && !isLoginPage && adminSession !== "authenticated") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && adminSession === "authenticated") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};