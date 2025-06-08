"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import { Form } from "@heroui/form";
import { Switch } from "@heroui/switch";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";
import { Scanner } from "@yudiel/react-qr-scanner";
import PhoneInput from "react-phone-number-input";
import { useCountdown } from "usehooks-ts";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

import es from "react-phone-number-input/locale/es";
import { RedeemActionState, redeemFormInitialState } from "./schema";
import { redeemReward } from "@/app/actions/redeem";

export function RedeemRewardForm() {
  const [count, { startCountdown }] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  });
  const [isActive, setIsActive] = useState(true);
  const [isQRMode, setIsQRMode] = useState(true);
  const [rewardId, setRewardId] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<RedeemActionState>(redeemFormInitialState);

  const formAction = useCallback(
    () => redeemReward.bind(null, isQRMode ? "QR" : "MANUAL", rewardId),
    [isQRMode, rewardId]
  );

  const onScan = async (scan: any) => {
    console.log("scan result", scan);
    setIsActive(false);

    if (scan?.[0]?.rawValue) {
      const scannedURL = new URL(scan?.[0]?.rawValue);
      console.log("scannedURL", scannedURL);
      const mode = scannedURL.searchParams.get("mode");

      if (scannedURL.hostname === "botaneroazteca.es" && mode === "qr") {
        // const token = scannedURL.searchParams.get("token");
        const rewardId = scannedURL.searchParams.get("rewid");

        // console.log("token", token);
        console.log("rewardId", rewardId);

        if (rewardId) {
          // SET customerId & token state
          setRewardId(rewardId);
          // setToken(token);
        } else {
          setRewardId(undefined);
          // setToken(undefined);
          setState({
            success: false,
            errors: ["Token no válido, escanea el código nuevamente"],
          });
          setIsActive(true);
        }
      }
    }
  };

  const handleSubmit = async (_event: FormEvent<HTMLFormElement>) => {
    _event.preventDefault();
    setPending(true);
    const formData = new FormData(_event.currentTarget as HTMLFormElement);
    const result = await formAction()(formData);
    console.log("result", result);
    setState(result);
    setPending(false);

    if (!result.success && isQRMode) {
      setRewardId(undefined);
      // setToken(undefined);
      setIsActive(true);
    }

    if (result.success) {
      startCountdown();
    }
  };

  useEffect(() => {
    if (count == 0) {
      redirect("/management", RedirectType.push);
    }
  }, [count]);

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
          {isQRMode ? "Escanear QR" : "Entrada manual"}
        </Switch>
      </div>

      {isQRMode ? (
        <div className="space-y-4 w-full">
          <div className="w-64 h-64 mx-auto">
            <Scanner
              onScan={onScan}
              onError={(error: any) => {
                console.log(`onError: ${error}`);
              }}
              paused={!isActive}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <PhoneInput
            labels={es}
            international
            countryCallingCodeEditable={false}
            defaultCountry="ES"
            inputComponent={Input}
            onChange={(value) => {
              console.log("phone", value);
            }}
            name="customerPhone"
            type="tel"
            label="Número de celular"
            placeholder="Ingresa tu número de celular"
            defaultValue={state?.form?.customerPhone}
            className="w-full"
          />

          <Input
            label="ID de la recompensa"
            name="rewardId"
            placeholder="Enter reward identification code"
            startContent={<Icon icon="lucide:gift" />}
            isRequired
            fullWidth
            defaultValue={state?.form?.rewardId}
          />
        </div>
      )}

      {state.success ? (
        <Alert
          color="success"
          title={`Recompensa canjeada exitosamente!`}
          description={`Serás redireccionado en ${count} segundos`}
        />
      ) : null}

      <Button
        type="submit"
        color="primary"
        className="w-full"
        startContent={!pending && <Icon icon="lucide:check" />}
        disabled={pending}
        isLoading={pending}
      >
        {pending ? "Procesando..." : "Registrar recompensa"}
      </Button>

      <div className="flex justify-center">
        <Button
          as={Link}
          href="/management"
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
