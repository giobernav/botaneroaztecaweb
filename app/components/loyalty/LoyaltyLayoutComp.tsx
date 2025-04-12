"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import { Schema } from "@/amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";
import { useMemo } from "react";
import CompleteProfileComp from "@/app/loyalty/CompleteProfileComp";

const selectionSet = ["id", "phone", "name", "lastName"] as const;
export default function LoyaltyLayoutComp({
  customer,
  children,
}: {
  customer: SelectionSet<
    Schema["Customer"]["type"],
    typeof selectionSet
  > | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const customerName = useMemo(() => {
    return customer?.name || customer?.lastName
      ? `${customer.name || ""}${customer.name ? " " : ""}${
          customer.lastName || ""
        }`
      : "";
  }, [customer?.name, customer?.lastName]);

  return (
    <div className="max-w-5xl mx-auto">
      <CompleteProfileComp />

      <ProfileHeader
        name={customerName}
        phone={customer?.phone || ""}
        avatarUrl={"https://i.pravatar.cc/150?u=alex.johnson@example.com"}
        membershipLevel={"Miembro bronce"}
        points={450}
      />

      <Card className="overflow-visible">
        <CardBody className="overflow-hidden p-2">
          <Tabs
            aria-label="Loyalty profile"
            selectedKey={pathname}
            radius="lg"
            color="primary"
            variant="underlined"
          >
            <Tab
              as={NextLink}
              key="/loyalty"
              title="Código QR"
              href="/loyalty"
            />
            <Tab
              as={NextLink}
              key="/loyalty/last-visits"
              title="Últimas visitas"
              href="/loyalty/last-visits"
            />
            <Tab
              as={NextLink}
              key="/loyalty/rewards"
              title="Recompensas y cupones"
              href="/loyalty/rewards"
            />
          </Tabs>

          {children}
        </CardBody>
      </Card>
    </div>
  );
}
