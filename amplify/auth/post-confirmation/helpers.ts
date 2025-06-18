import { env } from "$amplify/env/post-confirmation";
import apiKeyAuth from "../../../lib/passkit/apiKeyAuth";

interface Person {
  externalId: string;
  forename: string;
  surname: string;
  emailAddress: string;
  mobileNumber: string;
}

interface Member {
  id?: string | null;
  externalId: string;
  programId: string;
  tierId: string;
  status?: string; // e.g., "ACTIVE", "DELETED", "EXPIRED", "ENROLLED"
  person: Person;
}

// enroll a member in a program
export async function enrollMember({
  programId,
  tierId,
  externalId,
  status,
  person,
}: Member) {
  if (!env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }

  if (!programId || !tierId) {
    throw new Error("Program ID, Member ID, and Tier ID are required");
  }

  if (typeof programId !== "string" || typeof tierId !== "string") {
    throw new Error("Program ID, Member ID, and Tier ID must be strings");
  }

  const url = env.PASSKIT_API_URL + `/members/member`;

  const token = apiKeyAuth(env.PASSKIT_REST_SECRET, env.PASSKIT_REST_KEY);

  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }

  try {
    const params = { programId, tierId, externalId, status, person };
    console.log("Request Params:", params);
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    console.log("Response:", response);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return { success: true, data: json };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;

    return { success: false, message };
  }
}
