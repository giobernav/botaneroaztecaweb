"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { generateClient } from "aws-amplify/data";

import { type Schema } from "@/amplify/data/resource";
import LoyaltyLayoutComp from "../components/loyalty/LoyaltyLayoutComp";
import {
  loyaltyCustomerSelection,
  loyaltyCompanySelection,
  loyaltyVisitSelection,
  type LoyaltyCustomer,
  type LoyaltyCompany,
  type LoyaltyVisit,
} from "./selectionSets";

const client = generateClient<Schema>();

interface LoyaltyDataContextValue {
  customer: LoyaltyCustomer | null;
  company: LoyaltyCompany | null;
  visits: LoyaltyVisit[];
  totalPoints: number;
  hasNextTier: boolean;
  neededPoints: number;
  surplusPoints: number;
  availableTiers: Schema["TierLevel"]["type"][] | undefined;
  userId: string;
  refresh: () => Promise<void>;
}

const LoyaltyDataContext = createContext<LoyaltyDataContextValue | null>(null);

export function useLoyaltyData() {
  const context = useContext(LoyaltyDataContext);
  if (!context) {
    throw new Error("useLoyaltyData must be used within LoyaltyLayoutProvider");
  }

  return context;
}

async function fetchCustomer(userId: string) {
  const { data } = await client.models.Customer.get(
    { id: userId },
    { authMode: "userPool", selectionSet: loyaltyCustomerSelection }
  );

  return data ?? null;
}

async function fetchCompany(companyId?: string | null) {
  if (!companyId) return null;
  const { data } = await client.models.Company.get(
    { id: companyId },
    { authMode: "userPool", selectionSet: loyaltyCompanySelection }
  );
  return data ?? null;
}

async function fetchVisits(
  userId: string,
  tierEndDate?: string | null
): Promise<LoyaltyVisit[]> {
  const [startDate, endDate] = tierEndDate
    ? [
        dayjs(tierEndDate).subtract(366, "days").startOf("day").toISOString(),
        dayjs(tierEndDate).endOf("day").toISOString(),
      ]
    : [
        dayjs().subtract(180, "days").startOf("day").toISOString(),
        dayjs().endOf("day").toISOString(),
      ];

  const { data = [] } = await client.models.Visit.listVisitByCustomer(
    {
      customerId: userId,
      datetime: {
        between: [startDate, endDate],
      },
    },
    {
      authMode: "userPool",
      sortDirection: "DESC",
      selectionSet: loyaltyVisitSelection,
    }
  );

  return data.filter((visit): visit is LoyaltyVisit => Boolean(visit));
}

export function LoyaltyLayoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<LoyaltyCustomer | null>(null);
  const [company, setCompany] = useState<LoyaltyCompany | null>(null);
  const [visits, setVisits] = useState<LoyaltyVisit[]>([]);

  const userId = user?.userId;

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const customerResult = await fetchCustomer(userId);
      const [companyResult, visitsResult] = await Promise.all([
        fetchCompany(process.env.NEXT_PUBLIC_DEFAULT_COMPANY),
        fetchVisits(userId, customerResult?.tierEndDate),
      ]);

      setCustomer(customerResult);
      setCompany(companyResult);
      setVisits(visitsResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    loadData();
  }, [userId, loadData]);

  const availableTiers = useMemo(() => {
    if (!Array.isArray(company?.tierLevels)) {
      return undefined;
    }

    return company.tierLevels
      .filter((tier): tier is NonNullable<typeof tier> => tier !== null)
      .slice()
      .sort((a, b) => (a?.pointsRequired || 0) - (b?.pointsRequired || 0))
      .map((tier) =>
        tier
          ? {
              ...tier,
              status:
                tier.status === "ACTIVE" ||
                tier.status === "INACTIVE" ||
                tier.status === null
                  ? tier.status
                  : undefined,
            }
          : tier
      );
  }, [company?.tierLevels]);

  const totalPoints = useMemo(
    () => visits.reduce((sum, visit) => sum + (visit.pointsEarned || 0), 0),
    [visits]
  );

  const currentTierIdx = availableTiers?.findIndex(
    (tier) => tier?.id === customer?.memberTier
  );

  const hasValidTierIndex =
    typeof currentTierIdx === "number" && currentTierIdx >= 0;

  const hasNextTier = Boolean(
    availableTiers?.length &&
      hasValidTierIndex &&
      currentTierIdx! < availableTiers.length - 1
  );

  const nextTier = hasNextTier
    ? availableTiers?.[currentTierIdx! + 1]
    : hasValidTierIndex
    ? availableTiers?.[currentTierIdx!]
    : availableTiers?.[0];

  const tierDelta = (nextTier?.pointsRequired || 0) - (totalPoints || 0);
  const neededPoints = tierDelta > 0 ? tierDelta : 0;
  const surplusPoints = tierDelta < 0 ? Math.abs(tierDelta) : 0;

  const contextValue = useMemo(() => {
    if (!userId) return null;

    return {
      customer,
      company,
      visits,
      totalPoints,
      hasNextTier,
      neededPoints,
      surplusPoints,
      availableTiers,
      userId,
      refresh: loadData,
    } satisfies LoyaltyDataContextValue;
  }, [
    availableTiers,
    company,
    customer,
    hasNextTier,
    loadData,
    neededPoints,
    surplusPoints,
    totalPoints,
    userId,
    visits,
  ]);

  if (!userId) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <Spinner label="Iniciando sesión" color="primary" />
      </section>
    );
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <Spinner label="Cargando programa de lealtad" color="primary" />
      </section>
    );
  }

  if (error || !contextValue) {
    return (
      <Card className="max-w-md mx-auto">
        <CardBody className="flex flex-col items-center gap-4 py-8">
          <Icon
            icon="lucide:alert-triangle"
            className="text-warning"
            width={32}
            height={32}
          />
          <p className="text-center text-default-500">
            {error || "No pudimos cargar tu información de lealtad."}
          </p>
          <Button
            color="primary"
            onPress={loadData}
            startContent={<Icon icon="lucide:refresh-cw" />}
          >
            Reintentar
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <LoyaltyDataContext.Provider value={contextValue}>
      <LoyaltyLayoutComp
        customer={customer}
        totalPoints={totalPoints}
        hasNextTier={hasNextTier}
        neededPoints={neededPoints}
        surplusPoints={surplusPoints}
        tiers={availableTiers}
      >
        {children}
      </LoyaltyLayoutComp>
    </LoyaltyDataContext.Provider>
  );
}
