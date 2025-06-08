"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import { Schema } from "@/amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";
import { useEffect, useMemo, useState } from "react";
import CompleteProfileComp from "@/app/loyalty/CompleteProfileComp";
import { formatNumber } from "@/app/utils/formatter";
import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
} from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";

const customerSelectionSet = [
  "id",
  "phone",
  "name",
  "lastName",
  "email",
  "birthdate",
  "tierEndDate",
  "memberTier",
  "profilePicture",
] as const;

export default function LoyaltyLayoutComp({
  customer,
  totalPoints,
  children,
}: {
  customer: SelectionSet<
    Schema["Customer"]["type"],
    typeof customerSelectionSet
  > | null;
  totalPoints: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthenticator((context) => [context.user]);
  const [attrs, setAttrs] = useState<FetchUserAttributesOutput | undefined>();
  const [signedUrl, setSignedUrl] = useState<URL | string | undefined>();

  const customerName = useMemo(() => {
    return customer?.name || customer?.lastName
      ? `Hola ${customer.name || ""}${customer.name ? " " : ""}${
          customer.lastName || ""
        }`
      : "";
  }, [customer?.name, customer?.lastName]);

  useEffect(() => {
    const fetch = async () => {
      const userAttrs = await fetchUserAttributes();
      setAttrs(userAttrs);
    };
    if (user?.userId) {
      fetch();
    } else {
      setAttrs(undefined);
    }
  }, [user?.userId]);

  useEffect(() => {
    const fetch = async () => {
      // Retrieve the file's signed URL:
      const signedURL = await getUrl({ path: customer?.profilePicture! });
      setSignedUrl(signedURL.url);
    };

    if (customer?.profilePicture) {
      fetch();
    }
  }, [customer?.profilePicture]);

  return (
    <div className="max-w-5xl mx-auto">
      <CompleteProfileComp customer={customer} userAttributes={attrs} />

      <ProfileHeader
        name={customerName}
        phone={customer?.phone || ""}
        avatarUrl={signedUrl?.toString() || "/logo botanero chpi.png"}
        membershipLevel={`Nivel ${customer?.memberTier || "BRONZE"}`}
        points={formatNumber(totalPoints || 0, "decimal")}
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
              key="/loyalty/rewards"
              title="Recompensas"
              href="/loyalty/rewards"
            />
            <Tab
              as={NextLink}
              key="/loyalty/last-visits"
              title="Historial"
              href="/loyalty/last-visits"
            />
          </Tabs>

          {children}
        </CardBody>
      </Card>
    </div>
  );
}
