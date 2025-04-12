import apiKeyAuth from "@/lib/passkit/apiKeyAuth";

export async function POST(req: Request) {
  const token = apiKeyAuth();

  if (token) {
    return Response.json({ token });
  }

  return new Response(`Error generating token`, {
    status: 400,
  });
}
