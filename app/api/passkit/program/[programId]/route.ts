import { getProgram } from "@/app/actions/passkit";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ programId: string }> }
) {
  const { programId } = await params;

  if (!programId) {
    throw new Error("Program ID is required");
  }

  if (typeof programId !== "string") {
    throw new Error("Program ID must be a string");
  }

  try {
    const response = await getProgram(programId);
    console.log("Response from getProgram:", response);
    if (!response.success) {
      throw new Error(`Response status: ${response.message}`);
    }

    return Response.json(response.data);
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;

    return Response.json({ success: false, message }, { status: 400 });
  }
}
