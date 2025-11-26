import { Schema } from "@/amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";

export const loyaltyCustomerSelection = [
  "id",
  "phone",
  "name",
  "lastName",
  "email",
  "birthdate",
  "tierEndDate",
  "memberTier",
  "profilePicture",
  "passKitMemberId",
] as const;

export type LoyaltyCustomer = SelectionSet<
  Schema["Customer"]["type"],
  typeof loyaltyCustomerSelection
>;

export const loyaltyVisitSelection = [
  "id",
  "status",
  "customerId",
  "datetime",
  "pointsEarned",
  "billAmount",
  "createdAt",
  "updatedAt",
  "entryType",
] as const;

export type LoyaltyVisit = SelectionSet<
  Schema["Visit"]["type"],
  typeof loyaltyVisitSelection
>;

export const loyaltyCompanySelection = [
  "id",
  "name",
  "tierLevels.*",
  "passKitProgramId",
] as const;

export type LoyaltyCompany = SelectionSet<
  Schema["Company"]["type"],
  typeof loyaltyCompanySelection
>;
