import { NextRequest, NextResponse } from "next/server";

import { fetchAuthSession } from "aws-amplify/auth/server";

import { runWithAmplifyServerContext } from "@/app/utils/amplify-utils";

// 1. Specify protected and public routes
const protectedRoutes = ["/profile", "/loyalty", "/rewards", "/management"];
const publicRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  console.log("middleware running...");
  const response = NextResponse.next();
  // 2. Check if the current route is protected or public
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec, {});
        return session.tokens !== undefined;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });

  // if (authenticated) {
  //   return response;
  // }

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !authenticated) {
    const newUrl = new URL(`/login`, request.url);

    request.nextUrl.searchParams.forEach((val, key) => {
      newUrl.searchParams.set(key, val);
    });
    newUrl.searchParams.append("next_url", request.nextUrl.pathname);

    return NextResponse.redirect(newUrl);
  }

  if (
    isPublicRoute &&
    authenticated &&
    !request.nextUrl.pathname.startsWith("/loyalty")
  ) {
    return NextResponse.redirect(new URL("/loyalty", request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     */
    // "/profile",
    // "/loyalty",
    // "/loyalty/(.*)",
    // "/rewards/(.*)",
    // "/management/(.*)",
    // "/management",
    // "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
