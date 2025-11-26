"use client";
import { useMemo } from "react";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { LoyaltyCustomer } from "./selectionSets";

export default function CompleteProfileComp({
  customer,
}: {
  customer: LoyaltyCustomer | null;
}) {
  const profileCompleted = useMemo(
    () =>
      !!customer?.email &&
      !!(customer?.name && customer?.lastName) &&
      !!customer?.birthdate,
    [customer?.email, customer?.name, customer?.lastName, customer?.birthdate]
  );

  const completedStepsCount = useMemo(() => {
    const steps = [
      !!customer?.email,
      !!(customer?.name && customer?.lastName),
      !!customer?.birthdate,
    ];
    return steps.reduce((sum, step) => sum + (step ? 1 : 0), 0);
  }, [
    customer?.email,
    customer?.name,
    customer?.lastName,
    customer?.birthdate,
  ]);

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
        value={completedStepsCount}
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
