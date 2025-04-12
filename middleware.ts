import { NextRequest, NextResponse } from "next/server";

import { fetchAuthSession } from "aws-amplify/auth/server";

import { runWithAmplifyServerContext } from "@/app/utils/amplify-utils";

export async function middleware(request: NextRequest) {
  console.log("middleware running...");
  const response = NextResponse.next();

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

  if (authenticated) {
    return response;
  }

  const newUrl = new URL(`/login`, request.url);

  request.nextUrl.searchParams.forEach((val, key) => {
    newUrl.searchParams.set(key, val);
  });

  newUrl.searchParams.append("next_url", request.nextUrl.pathname);

  return NextResponse.redirect(newUrl);
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
    "/profile",
    "/loyalty",
    "/loyalty/(.*)",
    "/fidelity-card",
    "/fidelity-card/(.*)",
    "/rewards/(.*)",
    // "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
