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
import { useRouter } from "next/navigation";

import es from "react-phone-number-input/locale/es";
import { RedeemActionState, redeemFormInitialState } from "./schema";
import { redeemReward } from "@/app/actions/redeem";

export function RedeemRewardForm() {
  const [count, { startCountdown }] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  });
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);
  const [isQRMode, setIsQRMode] = useState(true);
  const [rewardId, setRewardId] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<RedeemActionState>(redeemFormInitialState);

  const formAction = useCallback(
    () => redeemReward.bind(null, isQRMode ? "QR" : "MANUAL", rewardId),
    [isQRMode, rewardId]
  );

  const handleModeChange = useCallback((selected: boolean) => {
    setIsQRMode(selected);

    if (!selected) {
      setRewardId(undefined);
      setIsActive(false);
      setState((prev) => ({
        ...prev,
        errors: undefined,
        fieldErrors: {
          ...prev.fieldErrors,
          rewardId: undefined,
          customerPhone: undefined,
        },
      }));
    } else {
      setIsActive(true);
    }
  }, []);

  const onScan = async (scan: any) => {
    setIsActive(false);

    if (scan?.[0]?.rawValue) {
      // const scannedValue = new URL(scan?.[0]?.rawValue);
      // console.log("scannedValue", scannedValue);
      // const mode = scannedURL.searchParams.get("mode");

      // if (scannedURL.hostname === "botaneroazteca.es" && mode === "qr") {
      // const token = scannedURL.searchParams.get("token");
      // const rewardId = scannedURL.searchParams.get("rewid");
      const rewardId = scan?.[0]?.rawValue;

      // console.log("token", token);
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
      // }
    }
  };

  const handleSubmit = async (_event: FormEvent<HTMLFormElement>) => {
    _event.preventDefault();
    setPending(true);
    const formData = new FormData(_event.currentTarget as HTMLFormElement);
    const result = await formAction()(formData);
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
      router.push("/management");
    }
  }, [count, router]);

  return (
    <Form
      className="space-y-4"
      onSubmit={handleSubmit}
      validationErrors={state.fieldErrors}
    >
      <div className="flex items-center justify-between p-2 rounded-lg">
        <Switch
          isSelected={isQRMode}
          onValueChange={handleModeChange}
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
          <div className="relative w-64 h-64 mx-auto">
            <Scanner
              onScan={onScan}
              onError={(error: any) => {
                console.log(`onError: ${error}`);
              }}
              paused={!isActive}
            />
            {rewardId ? (
              <div className="absolute inset-0 flex items-center justify-center bg-lime-500 text-lime-100 bg-opacity-60">
                <Icon
                  icon="lucide:circle-check"
                  className="w-32 h-32"
                  color="currentColor"
                />
              </div>
            ) : null}
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
              setState((prev) => ({
                ...prev,
                fieldErrors: {
                  ...prev.fieldErrors,
                  customerPhone: undefined,
                },
                form: {
                  ...prev.form,
                  customerPhone: value || "",
                },
              }));
            }}
            name="customerPhone"
            type="tel"
            label="Número de celular"
            placeholder="Ingresa tu número de celular"
            defaultValue={state?.form?.customerPhone}
            className="w-full"
          />
          {state.fieldErrors?.customerPhone ? (
            <p className="text-sm text-danger" role="alert">
              {state.fieldErrors.customerPhone}
            </p>
          ) : null}

          <Input
            label="ID de la recompensa"
            name="rewardId"
            placeholder="Enter reward identification code"
            startContent={<Icon icon="lucide:gift" />}
            isRequired
            fullWidth
            defaultValue={state?.form?.rewardId}
            errorMessage={state.fieldErrors?.rewardId}
            validationState={
              state.fieldErrors?.rewardId ? "invalid" : undefined
            }
            onValueChange={(value) =>
              setState((prev) => ({
                ...prev,
                fieldErrors: {
                  ...prev.fieldErrors,
                  rewardId: undefined,
                },
                form: {
                  ...prev.form,
                  rewardId: value,
                },
              }))
            }
          />
        </div>
      )}

      {state?.errors?.map((message: string, idx) => {
        return (
          <Alert
            key={`error_${idx}`}
            color="danger"
            title="Error"
            description={message}
          />
        );
      })}

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
