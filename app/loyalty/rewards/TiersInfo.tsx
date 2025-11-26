"use client";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";
import Link from "next/link";

const TiersInfo = () => {
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<Schema["TierLevel"]["type"][]>([]);

  useEffect(() => {
    // get company data
    const fetchCompanyData = async () => {
      try {
        const { data: companyData } = await client.models.Company.get(
          {
            id: process.env.NEXT_PUBLIC_DEFAULT_COMPANY || "",
          },
          { authMode: "userPool" }
        );
        setTiers(
          Array.isArray(companyData?.tierLevels)
            ? (companyData?.tierLevels as Schema["TierLevel"]["type"][])
            : []
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setLoading(false);
        setTiers([]);
      }
    };
    fetchCompanyData();
  }, []);

  return (
    <Popover placement="right">
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="faded"
          radius="full"
          size="sm"
          className="ml-1"
          color="primary"
        >
          <Icon icon="ion:information" className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Niveles de Lealtad</div>
          <div className="text-tiny">¡Gana 100 puntos por cada € gastado!</div>
          {loading ? (
            <Skeleton
              className="w-full h-20 mt-2"
              style={{ borderRadius: "0.375rem" }}
            >
              <div className="flex flex-col space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </Skeleton>
          ) : tiers.length === 0 ? (
            <div className="text-sm text-default-500">
              No hay niveles de lealtad disponibles en este momento.
            </div>
          ) : (
            <ul className="list-disc list-inside my-2">
              {tiers.map((tier) => {
                if (!tier) return null;

                const discountLabel =
                  typeof tier.discount === "number" ? `${tier.discount}%` : "—";

                return (
                  <li key={tier.id || `${tier.title}-${discountLabel}`}>
                    {tier.title || "Nivel"}: {discountLabel} de descuento
                  </li>
                );
              })}
            </ul>
          )}
          <div className="text-tiny text-default-500 mt-2">
            Para más información sobre el programa de lealtad consulta términos
            y condiciones{" "}
            <Link href="/terminos/programa-lealtad" className="text-primary">
              aquí
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default TiersInfo;
