import { cache } from "react";

import { getCompany } from "../actions/company";
import { getCustomer } from "../actions/customer";
import { listVisits } from "../actions/visit";

export const getCachedCustomer = cache(async (userId: string) => {
  return getCustomer(userId);
});

export const getCachedCompany = cache(async (companyId?: string | null) => {
  if (!companyId) return null;
  return getCompany(companyId);
});

export const getCachedVisitsSummary = cache(
  async (userId: string, tierEndDate?: string | null) => {
    return listVisits(userId, tierEndDate ?? undefined);
  }
);
