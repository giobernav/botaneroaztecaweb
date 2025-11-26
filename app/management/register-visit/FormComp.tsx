"use client";

import { useCallback, useEffect, useState } from "react";
import { VisitActionState, visitFormInitialState } from "./schema";
import { Form } from "@heroui/form";

import { Switch } from "@heroui/switch";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { NumberInput } from "@heroui/number-input";
import { I18nProvider } from "@react-aria/i18n";
import { Scanner } from "@yudiel/react-qr-scanner";
import { registerVisit } from "@/app/actions/visit";
import { useRouter } from "next/navigation";
import { useCountdown } from "usehooks-ts";
import { Alert } from "@heroui/alert";
import PhoneInput from "react-phone-number-input";
import es from "react-phone-number-input/locale/es";

export default function FormComp() {
  const [count, { startCountdown }] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  });
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);
  const [isQRMode, setIsQRMode] = useState(false);
  const [pending, setPending] = useState(false);
  const [customerId, setCustomerId] = useState<string | undefined>();
  // const [token, setToken] = useState<string | undefined>();
  const [state, setState] = useState<VisitActionState>(visitFormInitialState);

  const formAction = useCallback(
    () =>
      registerVisit.bind(null, isQRMode ? "QR" : "MANUAL", customerId, null),
    [isQRMode, customerId]
  );

  const handleModeChange = useCallback((selected: boolean) => {
    setIsQRMode(selected);

    if (selected) {
      setIsActive(true);
    } else {
      setCustomerId(undefined);
      setIsActive(false);
      setState((prev) => ({
        ...prev,
        errors: undefined,
        fieldErrors: {
          ...prev.fieldErrors,
          customerPhone: undefined,
        },
      }));
    }
  }, []);

  const onScan = async (scan: any) => {
    setIsActive(false);

    if (scan?.[0]?.rawValue) {
      // const scannedURL = new URL(scan?.[0]?.rawValue);
      // const mode = scannedURL.searchParams.get("mode");

      // if (scannedURL.hostname === "botaneroazteca.es" && mode === "qr") {
      // const token = scannedURL.searchParams.get("token");
      // const customerId = scannedURL.searchParams.get("cusid");
      const customerId = scan?.[0]?.rawValue;

      // console.log("token", token);
      if (customerId) {
        // SET customerId & token state
        setCustomerId(customerId?.trim());
        // setToken(token);
      } else {
        setCustomerId(undefined);
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

  const handleSubmit = async (_event: React.FormEvent<HTMLFormElement>) => {
    _event.preventDefault();
    setPending(true);
    const formData = new FormData(_event.currentTarget as HTMLFormElement);
    const result = await formAction()(formData);
    setState(result);
    setPending(false);

    if (!result.success && isQRMode) {
      setCustomerId(undefined);
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
      onSubmit={handleSubmit}
      validationErrors={state.fieldErrors}
      className="space-y-4"
    >
      <Switch
        isSelected={isQRMode}
        onValueChange={handleModeChange}
        size="lg"
        color="primary"
        startContent={<Icon icon="lucide:qr-code" className="text-xl" />}
        endContent={<Icon icon="lucide:phone" className="text-xl" />}
      >
        {isQRMode ? "Escanear QR" : "Número de celular"}
      </Switch>

      {!isQRMode ? (
        <>
          <PhoneInput
            labels={es}
            international
            countryCallingCodeEditable={false}
            defaultCountry="ES"
            inputComponent={Input}
            onChange={(value) =>
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
              }))
            }
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
        </>
      ) : (
        <div className="relative w-64 h-64 mx-auto">
          <Scanner
            onScan={onScan}
            onError={(error: any) => {
              console.log(`onError: ${error}`);
            }}
            paused={!isActive}
          />
          {customerId ? (
            <div className="absolute inset-0 flex items-center justify-center bg-lime-500 text-lime-100 bg-opacity-60">
              <Icon
                icon="lucide:circle-check"
                className="w-32 h-32"
                color="currentColor"
              />
            </div>
          ) : null}
        </div>
      )}

      <Input
        name="table"
        type="text"
        placeholder="Ingresa la mesa"
        label="Mesa"
        defaultValue={state?.form?.table}
        errorMessage={state.fieldErrors?.table}
        validationState={state.fieldErrors?.table ? "invalid" : undefined}
        onValueChange={(value) =>
          setState((prev) => ({
            ...prev,
            fieldErrors: {
              ...prev.fieldErrors,
              table: undefined,
            },
            form: {
              ...prev.form,
              table: value,
            },
          }))
        }
      />

      <NumberInput
        formatOptions={{
          style: "currency",
          currency: "EUR",
          // currencyDisplay: "code",
          // currencySign: "accounting",
        }}
        min={0}
        name="billAmount"
        inputMode="numeric"
        label="Monto de la cuenta"
        hideStepper
        defaultValue={
          state?.form?.billAmount !== undefined && state.form.billAmount !== ""
            ? Number(state.form.billAmount)
            : undefined
        }
        errorMessage={state.fieldErrors?.billAmount}
        validationState={state.fieldErrors?.billAmount ? "invalid" : undefined}
        onValueChange={(value) =>
          setState((prev) => ({
            ...prev,
            fieldErrors: {
              ...prev.fieldErrors,
              billAmount: undefined,
            },
            form: {
              ...prev.form,
              billAmount:
                value !== null && Number.isFinite(value)
                  ? value.toString()
                  : "",
            },
          }))
        }
      />

      <I18nProvider locale="es-ES">
        <DatePicker
          name="datetime"
          label="Fecha de la visita"
          placeholderValue={today(getLocalTimeZone())}
          defaultValue={
            state.form?.datetime
              ? parseDate(state.form?.datetime)
              : today(getLocalTimeZone())
          }
          hideTimeZone
          granularity="day"
          minValue={today(getLocalTimeZone()).subtract({ days: 5 })}
          maxValue={today(getLocalTimeZone())}
          errorMessage={state.fieldErrors?.datetime}
          validationState={state.fieldErrors?.datetime ? "invalid" : undefined}
          onChange={(value) =>
            setState((prev) => ({
              ...prev,
              fieldErrors: {
                ...prev.fieldErrors,
                datetime: undefined,
              },
              form: {
                ...prev.form,
                datetime: value?.toString(),
              },
            }))
          }
        />
      </I18nProvider>

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
          title={`Registro guardado exitosamente!`}
          description={`Serás redireccionado en ${count} segundos`}
        />
      ) : null}

      <Button
        type="submit"
        color="primary"
        className="w-full"
        startContent={!pending && <Icon icon="lucide:save" />}
        disabled={pending}
        isLoading={pending}
      >
        {pending ? "Procesando..." : "Registrar visita"}
      </Button>
    </Form>
  );
}
