"use server";
import apiKeyAuth from "@/lib/passkit/apiKeyAuth";
import transform from "@/lib/passkit/transform";

export async function getProgram(programId: string) {
  if (!process.env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }

  if (!programId) {
    throw new Error("Program ID is required");
  }

  if (typeof programId !== "string") {
    throw new Error("Program ID must be a string");
  }

  const url = process.env.PASSKIT_API_URL + `/members/program/${programId}`;

  const token = apiKeyAuth();

  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    return { success: true, data: json };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;

    return { success: false, message };
  }
}

export async function listTiers(programId: string) {
  if (!process.env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }

  if (!programId) {
    throw new Error("Program ID is required");
  }

  if (typeof programId !== "string") {
    throw new Error("Program ID must be a string");
  }

  const url = process.env.PASSKIT_API_URL + `/members/tiers/list`;

  const token = apiKeyAuth();

  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }

  console.log("Fetching tiers for program:", programId);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ programId }),
    });
    console.log("Response:", response);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const text = await response.text();
    const data = transform(text);

    return { data, success: true };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;

    return { success: false, message };
  }
}

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

// update a member in a program
export async function updateMember({
  memberId,
  programId,
  tierId,
  externalId,
  status,
  person,
}: Member & { memberId: string }) {
  if (!process.env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }
  if (!memberId || !programId || !tierId) {
    throw new Error("Member ID, Program ID, and Tier ID are required");
  }
  if (
    typeof memberId !== "string" ||
    typeof programId !== "string" ||
    typeof tierId !== "string"
  ) {
    throw new Error("Member ID, Program ID, and Tier ID must be strings");
  }
  const url = process.env.PASSKIT_API_URL + `/members/member`;
  const token = apiKeyAuth();
  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        id: memberId,
        programId,
        tierId,
        externalId,
        status,
        person,
      }),
      headers: {
        Authorization: token,
      },
    });
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

// change tier of a member in a program
export async function changeMemberTier({
  memberId,
  tierId,
}: {
  memberId: string;
  tierId: string;
}) {
  if (!process.env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }

  if (!memberId || !tierId) {
    throw new Error("Member ID and Tier ID are required");
  }

  if (typeof memberId !== "string" || typeof tierId !== "string") {
    throw new Error("Member ID and Tier ID must be strings");
  }

  const url = process.env.PASSKIT_API_URL + `/members/member/tier`;

  const token = apiKeyAuth();

  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({ memberId, tierId }),
      headers: {
        Authorization: token,
      },
    });

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

// update memeber expiration date
export async function updateMemberExpiration({
  memberId,
  expiryDate,
}: {
  memberId: string;
  expiryDate: string;
}) {
  if (!process.env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }

  if (!memberId || !expiryDate) {
    throw new Error("Member ID and Expiration Date are required");
  }

  if (typeof memberId !== "string" || typeof expiryDate !== "string") {
    throw new Error("Member ID and Expiration Date must be strings");
  }

  const url = process.env.PASSKIT_API_URL + `/members/member/updateExpiry`;

  const token = apiKeyAuth();

  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({ id: memberId, expiryDate }),
      headers: {
        Authorization: token,
      },
    });

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

// earn points for a member in a program
export async function earnPoints({
  memberId,
  points,
  tierId = "", // optional tierId, can be empty
}: {
  memberId: string;
  points: number;
  tierId?: string; // optional tierId, can be empty
}) {
  if (!process.env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }

  if (!memberId || !points) {
    throw new Error("Member ID and Points are required");
  }

  if (typeof memberId !== "string" || typeof points !== "number") {
    throw new Error("Member ID must be a string and Points must be a number");
  }

  const url = process.env.PASSKIT_API_URL + `/members/member/points/earn`;

  const token = apiKeyAuth();

  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ id: memberId, tierPoints: points, tierId }),
      headers: {
        Authorization: token,
      },
    });

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

// set points for a member in a program
export async function setPoints({
  memberId,
  points,
  tierId = "", // optional tierId, can be empty
  resetTierPoints = false, // optional, default is false
}: {
  memberId: string;
  points: number;
  tierId?: string; // optional tierId, can be empty
  resetTierPoints?: boolean; // optional, default is false
}) {
  if (!process.env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }

  if (!memberId || !points) {
    throw new Error("Member ID and Points are required");
  }

  if (typeof memberId !== "string" || typeof points !== "number") {
    throw new Error("Member ID must be a string and Points must be a number");
  }

  const url = process.env.PASSKIT_API_URL + `/members/member/points/set`;

  const token = apiKeyAuth();

  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        id: memberId,
        tierPoints: points,
        tierId,
        resetTierPoints,
      }),
      headers: {
        Authorization: token,
      },
    });

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
