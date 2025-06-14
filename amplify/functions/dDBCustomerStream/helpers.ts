import { Amplify } from "aws-amplify";
import dayjs from "dayjs";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/dDBCustomerStreamFcn";

import { mockSystem } from "../../../app/utils/system-data";

import apiKeyAuth from "../../../lib/passkit/apiKeyAuth";
import { Schema } from "../../data/resource";

export const customerSelectionSet = [
  "id",
  "name",
  "lastName",
  "email",
  "phone",
  "birthdate",
  "passKitMemberId",
] as const;

export type CustomerSS = SelectionSet<
  Schema["Customer"]["type"],
  typeof customerSelectionSet
>;

interface Person {
  externalId?: string | null; // Optional external ID for the person
  forename: string;
  surname: string;
  emailAddress: string;
  mobileNumber: string;
}

interface Member {
  id?: string | null;
  externalId: string; // Optional external ID for the member
  programId: string;
  tierId: string;
  status?: string; // e.g., "ACTIVE", "DELETED", "EXPIRED", "ENROLLED"
  person: Person;
}

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

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

export async function handleEnrollMember(customer: CustomerSS) {
  // Si no tiene passKitMemberId y tiene email y phone, enrollar en PassKit
  // y asignar el passKitMemberId al Customer
  try {
    // Obtener Company
    const { data: company } = await client.models.Company.get({
      id: env.DEFAULT_COMPANY,
    });

    const { tierLevels } = company || mockSystem;

    const sortedTierLevels = [...tierLevels!].sort(
      (a, b) => a?.pointsRequired! - b?.pointsRequired!
    );
    // Enrollar en PassKit
    const { data: passkitMember } = await enrollMember({
      externalId: customer.id,
      programId: env.PASSKIT_PROGRAM_ID,
      tierId: sortedTierLevels[0]?.id || "base",
      status: "ACTIVE", // "ACTIVE", "DELETED", "EXPIRED", "ENROLLED"
      person: {
        forename: customer.name || "",
        surname: customer.lastName || "",
        emailAddress: customer?.email || "",
        mobileNumber: customer?.phone || "",
      },
    });

    console.log("passkitMember", passkitMember);
    if (!passkitMember?.id) {
      throw new Error("Failed to enroll member in PassKit");
    }
    // Si se ha creado el passKitMember, actualizar Customer con passKitMemberId
    await client.models.Customer.update({
      id: customer.id,
      passKitMemberId: passkitMember.id,
    });
    console.log(
      `Customer ${customer.id} enrolled in PassKit with member ID: ${passkitMember.id}`
    );
  } catch (error: Error | any) {
    console.log(`Error during PassKit enrollment: `, error);
  }
}

export async function handleCompleteProfileReward(customer: CustomerSS) {
  // Verificar si el usuario completó su perfil de usuario
  const isProfileComplete = Boolean(
    customer?.name &&
      customer.lastName &&
      customer.email &&
      customer.phone &&
      customer.birthdate
  );
  console.log("isProfileComplete", isProfileComplete);

  // Verificar que no se haya entregado esa recompensa
  const { data: retrievedCusRew, errors } =
    await client.models.CustomerReward.listCusRewByCustomer(
      {
        customerId: customer.id,
        typeCategory: {
          eq: {
            type: "ONCE",
            category: "PROFILE",
          },
        },
      },
      {
        selectionSet: [
          "id",
          "customerId",
          "rewardId",
          "status",
          "expiryDate",
          "category",
          "type",
        ],
      }
    );

  console.log("retrievedCusRew", retrievedCusRew, errors);

  if (isProfileComplete && !retrievedCusRew.length) {
    // Find Reward
    const { data: retrievedRewards } =
      await client.models.Reward.listRewardByCategory({
        category: "PROFILE",
      });
    console.log("retrievedRewards", retrievedRewards);

    // Si hay recompensa de completar perfil disponible
    if (retrievedRewards.length) {
      // Crear CustomerReward de recompensa del perfil
      await client.models.CustomerReward.create({
        customerId: customer.id,
        rewardId: retrievedRewards[0].id,
        expiryDate: dayjs().add(1, "year").endOf("day").toISOString(),
        status: "REDEEMED",
        type: retrievedRewards[0].type,
        category: retrievedRewards[0].category,
      });
      // Crear Visit con entryType = "TRIGGER" para asignar los puntos ganados por completar el perfil
      await client.models.Visit.create({
        datetime: dayjs().toISOString(),
        billAmount: null,
        pointsEarned: 1000,
        table: null,
        status: "ACTIVE",
        customerId: customer.id,
        entryType: "TRIGGER",
      });
      console.log(
        `Profile completion reward created for customer ${customer.id}.`
      );
    } else {
      console.log(
        `No profile completion reward available for customer ${customer.id}.`
      );
    }
  } else {
    console.log(
      `Customer ${customer.id} already has a profile or has received the reward.`
    );
  }
}
