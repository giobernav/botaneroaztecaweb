"use client";

import { Form } from "@heroui/form";
import { Switch } from "@heroui/switch";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useState, FormEvent } from "react";
import { Link } from "@heroui/link";

interface RedeemFormData {
  isQRMode: boolean;
  phoneNumber: string;
  rewardId: string;
}

export function RedeemRewardForm() {
  const [isQRMode, setIsQRMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rewardId, setRewardId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData: RedeemFormData = {
      isQRMode,
      phoneNumber: !isQRMode ? phoneNumber : "",
      rewardId,
    };

    console.log("Redeem form submitted:", formData);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form or show success message
    }, 1500);
  };

  return (
    <Form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
        <Switch
          isSelected={isQRMode}
          onValueChange={setIsQRMode}
          size="lg"
          color="primary"
          startContent={<Icon icon="lucide:qr-code" className="text-xl" />}
          endContent={<Icon icon="lucide:keyboard" className="text-xl" />}
        >
          {isQRMode ? "Scan Code" : "Manual Entry"}
        </Switch>
      </div>

      {isQRMode ? (
        <div className="space-y-4 w-full">
          <div className="h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center w-full">
            <Icon icon="lucide:scan" className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm text-center px-4">
              Position the QR code within the scanner area to automatically
              redeem the reward
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <Input
            label="Phone Number"
            placeholder="Enter customer phone number"
            value={phoneNumber}
            onValueChange={setPhoneNumber}
            startContent={<Icon icon="lucide:phone" />}
            type="tel"
            pattern="[0-9]*"
            isRequired
            fullWidth
          />

          <Input
            label="Reward ID"
            placeholder="Enter reward identification code"
            value={rewardId}
            onValueChange={setRewardId}
            startContent={<Icon icon="lucide:gift" />}
            isRequired
            fullWidth
          />
        </div>
      )}

      <Button
        type="submit"
        color="primary"
        className="w-full"
        startContent={<Icon icon="lucide:check" />}
        isLoading={isSubmitting}
        isDisabled={
          isSubmitting ||
          (!isQRMode && (phoneNumber.trim() === "" || rewardId.trim() === ""))
        }
      >
        {isSubmitting ? "Procesando..." : "Redimir Recompensa"}
      </Button>

      <div className="flex justify-center">
        <Button
          as={Link}
          href="/"
          color="default"
          variant="light"
          startContent={<Icon icon="lucide:arrow-left" />}
        >
          Regresar al Inicio
        </Button>
      </div>
    </Form>
  );
}
