"use client";

import { Input } from "@heroui/input";
import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import es from "react-phone-number-input/locale/es";
import { E164Number } from "libphonenumber-js/core";
import { RadioGroup, Radio } from "@heroui/radio";
import { cn } from "@heroui/react";

export default function CustomerForm() {
  const [phone, setPhone] = useState<E164Number | undefined>();
  const [selected, setSelected] = useState("visit");

  const radioClassNames = {
    base: cn(
      "inline-flex m-0 bg-default-100 items-center justify-between",
      "flex-row-reverse w-full max-w-full cursor-pointer rounded-lg p-4 border-medium border-transparent"
      //   "data-[selected=true]:border-secondary"
    ),
    // control: "bg-secondary text-secondary-foreground",
    // wrapper: "group-data-[selected=true]:border-secondary",
    label: "text-small text-default-500 font-medium",
    labelWrapper: "m-0",
  };

  return (
    <div className="flex flex-col gap-3">
      <PhoneInput
        labels={es}
        international
        countryCallingCodeEditable={false}
        defaultCountry="ES"
        name="phone"
        value={phone}
        inputComponent={Input}
        onChange={(value) => {
          setPhone(value);
        }}
        type="tel"
        variant="bordered"
        label="Número de celular"
        placeholder="Ingresa tu número de celular"
        isRequired
        validate={(value: string) => {
          if (value.length < 4) {
            return "Ingresa un número de celular válido";
          }

          return !isValidPhoneNumber(value || "")
            ? "Ingresa un número de celular válido"
            : null;
        }}
      />

      <RadioGroup
        className="mt-4 col-span-12"
        classNames={{
          wrapper: "gap-4",
        }}
        defaultValue="address1"
        name="registerType"
        label="Selecciona tipo de validación"
        value={selected}
        onValueChange={setSelected}
      >
        <Radio classNames={radioClassNames} value="visit">
          Registrar visita
        </Radio>
        <Radio classNames={radioClassNames} value="search">
          Buscar recompensa
        </Radio>
      </RadioGroup>
    </div>
  );
}
