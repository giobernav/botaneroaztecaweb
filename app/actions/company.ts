"use server";
import { cookiesClient } from "@/app/utils/amplify-utils";
import { mockSystem } from "../utils/system-data";

export async function getCompany(id?: string) {
  if (!id) {
    return mockSystem;
  }

  const { data } = await cookiesClient.models.Company.get({ id });

  if (!data) {
    return mockSystem;
  }

  return data;
}
