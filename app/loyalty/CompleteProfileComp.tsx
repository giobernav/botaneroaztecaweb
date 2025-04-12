"use client";
import { useState } from "react";
import { Progress } from "@heroui/progress";
import VerticalSteps from "./VerticalSteps";

const steps = [
  {
    title: "Agrega tu nombre",
    description: "Ingresa tu nombre completo.",
  },
  {
    title: "Ingresa y confirma tu email",
    description: "Tu dirección de correo electrónico personal.",
  },
  {
    title: "Añade tu cumpleaños",
    description: "Regalos y descuentos en tu cumpleaños.",
  },
];

export default function CompleteProfileComp() {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <section className="max-w-sm mb-6">
      <h1 className="mb-2 text-xl font-medium" id="getting-started">
        Completa tu perfil
      </h1>
      <p className="mb-5 text-small text-default-500">
        Completa la información de tu perfil y obtén 1.000 puntos de fidelidad.
      </p>
      <Progress
        classNames={{
          base: "px-0.5 mb-5",
          label: "text-small",
          value: "text-small text-default-400",
        }}
        label="Steps"
        maxValue={steps.length - 1}
        minValue={0}
        showValueLabel={true}
        size="md"
        value={currentStep}
        valueLabel={`${currentStep + 1} of ${steps.length}`}
      />
      <VerticalSteps
        hideProgressBars
        currentStep={currentStep}
        stepClassName="border border-default-200 dark:border-default-50 aria-[current]:bg-default-100 dark:aria-[current]:bg-default-50"
        steps={steps}
        onStepChange={setCurrentStep}
      />
    </section>
  );
}
