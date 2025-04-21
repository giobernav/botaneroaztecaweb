"use client";
import { useEffect, useMemo, useState } from "react";
import { Progress } from "@heroui/progress";
import { Schema } from "@/amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";
import { FetchUserAttributesOutput } from "aws-amplify/auth";
import { Button } from "@heroui/button";
import NextLink from "next/link";

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

export default function CompleteProfileComp({
  customer,
}: {
  customer: SelectionSet<
    Schema["Customer"]["type"],
    typeof customerSelectionSet
  > | null;
  userAttributes?: FetchUserAttributesOutput;
}) {
  const [profileProgress, setProfileProgress] = useState({
    emailCompleted: false,
    nameCompleted: false,
    birthdate: false,
  });

  useEffect(() => {
    if (customer) {
      setProfileProgress({
        emailCompleted: !!customer.email,
        nameCompleted: !!(customer.name && customer.lastName),
        birthdate: !!customer.birthdate,
      });
    }
  }, [customer]);

  const profileCompleted = useMemo(
    () => Object.values(profileProgress).reduce((sum, val) => sum && val, true),
    [profileProgress]
  );

  return profileCompleted ? null : (
    <section className="max-w-sm mb-6 bg-warning-50 p-4 rounded-lg">
      <h1 className="mb-2 text-xl font-medium" id="getting-started">
        Completa tu perfil
      </h1>
      <p className="mb-5 text-small text-default-500">
        Completa la informacón de tu perfil y obtén 1.000 puntos de lealtad
        adicionales.
      </p>
      <Progress
        classNames={{
          base: "px-0.5 mb-5",
          label: "text-small",
          value: "text-small text-default-400",
        }}
        maxValue={3}
        minValue={0}
        size="md"
        color="warning"
        aria-label="Progreso del perfil"
        value={Object.values(profileProgress).reduce(
          (sum, val) => sum + (val ? 1 : 0),
          0
        )}
      />
      <Button
        as={NextLink}
        color="warning"
        variant="shadow"
        radius="md"
        href="/profile"
        fullWidth
      >
        Completar perfil
      </Button>
    </section>
  );
}
