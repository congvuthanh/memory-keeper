import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This middleware function will run on the paths specified in the matcher configuration
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for certain paths
  if (
    path === "/" || // Home page is public
    path.startsWith("/api/") || // Skip all API routes
    path.includes("auth") || // Skip any auth-related paths
    path.includes("_next") // Skip Next.js internal paths
  ) {
    return NextResponse.next();
  }

  try {
    // Get the session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Redirect to home if no token
    if (!token) {
      console.log(`No token found, redirecting from ${path} to home`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    // On error, redirect to home
    console.error("Auth middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If we have a token, allow access to protected pages
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all paths except:
    // - Static files and images
    // - API routes (handled separately in the middleware)
    "/((?!_next/static|_next/image|_next/data|images/|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|ico)).*)",
  ],
}; 