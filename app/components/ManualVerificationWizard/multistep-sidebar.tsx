"use client";

import React from "react";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import VerticalSteps from "./vertical-steps";
import RowSteps from "./row-steps";
import MultistepNavigationButtons from "./MultistepNavigationButtons";

export type MultiStepSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  currentPage: number;
  onBack: () => void;
  onNext?: () => void;
  onChangePage: (page: number) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

const stepperClasses = cn(
  // light
  "[--step-color:hsl(var(--heroui-secondary-400))]",
  "[--active-color:hsl(var(--heroui-secondary-400))]",
  "[--inactive-border-color:hsl(var(--heroui-secondary-200))]",
  "[--inactive-bar-color:hsl(var(--heroui-secondary-200))]",
  "[--inactive-color:hsl(var(--heroui-secondary-300))]",
  // dark
  "dark:[--step-color:rgba(255,255,255,0.1)]",
  "dark:[--active-color:hsl(var(--heroui-foreground-600))]",
  "dark:[--active-border-color:rgba(255,255,255,0.5)]",
  "dark:[--inactive-border-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-bar-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-color:rgba(255,255,255,0.2)]"
);

const MultiStepSidebar = React.forwardRef<
  HTMLDivElement,
  MultiStepSidebarProps
>(
  (
    {
      children,
      className,
      currentPage,
      onBack,
      onNext,
      onChangePage,
      onSubmit,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex w-full gap-x-2", className)}
        {...props}
      >
        <div className="hidden h-full w-[344px] flex-shrink-0 flex-col items-start gap-y-8 rounded-large bg-gradient-to-b from-default-100 via-danger-100 to-secondary-100 px-8 py-6 shadow-small lg:flex">
          <Button
            className="bg-default-50 text-small font-medium text-default-500 shadow-lg"
            isDisabled={currentPage === 0}
            radius="full"
            variant="flat"
            onPress={onBack}
          >
            <Icon icon="solar:arrow-left-outline" width={18} />
            Back
          </Button>
          <div>
            <div className="text-xl font-medium leading-7 text-default-foreground">
              Programa de recompensas
            </div>
            <div className="mt-1 text-base font-medium leading-6 text-default-500">
              Registra visitas y canjea recompensas y promociones.
            </div>
          </div>
          {/* Desktop Steps */}
          <VerticalSteps
            className={stepperClasses}
            color="secondary"
            currentStep={currentPage}
            steps={[
              {
                title: "Datos del cliente",
                description: "Información del usuario",
              },
              {
                title: "Datos de la visita",
                description: "Información de la visita al restaurante",
              },
            ]}
            onStepChange={onChangePage}
          />
        </div>
        <div className="flex h-full w-full flex-col items-center gap-4 md:p-4">
          <div className="sticky top-0 z-10 w-full sm:rounded-large bg-gradient-to-r from-default-100 via-danger-100 to-secondary-100 py-4 shadow-small md:max-w-xl lg:hidden">
            <div className="flex justify-center">
              {/* Mobile Steps */}
              <RowSteps
                className={cn("pl-6", stepperClasses)}
                currentStep={currentPage}
                steps={[
                  {
                    title: "Cliente",
                  },
                  {
                    title: "Visita",
                  },
                ]}
                onStepChange={onChangePage}
              />
            </div>
          </div>
          <Form
            onSubmit={onSubmit}
            validationBehavior="native"
            className="h-full w-full p-4 sm:max-w-md md:max-w-lg"
          >
            {children}
            <MultistepNavigationButtons
              backButtonProps={{ isDisabled: currentPage === 0 }}
              className="lg:hidden"
              nextButtonProps={{
                children: currentPage === 0 ? "Siguiente" : "Registar",
              }}
              onBack={onBack}
            />
          </Form>
        </div>
      </div>
    );
  }
);

MultiStepSidebar.displayName = "MultiStepSidebar";

export default MultiStepSidebar;
