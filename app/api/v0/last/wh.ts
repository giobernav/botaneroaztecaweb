export async function POST(request: Request) {
  try {
    const req = await request.json();
    console.log("req", req);
    // Process the webhook payload
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    return new Response(`Webhook error: ${message}`, {
      status: 400,
    });
  }

  return new Response("Success!", {
    status: 200,
  });
}
