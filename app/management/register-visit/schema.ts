import { z } from "zod";
import isMobilePhone from "validator/lib/isMobilePhone";

export const visitFormSchema = z.object({
  customerPhone: z
    .string({
      required_error: "Ingresa un número de teléfono",
      invalid_type_error: "Ingresa un número de teléfono válido",
    })
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => isMobilePhone(val), {
      message: "Ingresa un número de celular válido",
    }),
  table: z
    .string({
      required_error: "Ingresa la mesa",
    })
    .nonempty("Ingresa un valor"),
  billAmount: z
    .string({
      required_error: "Ingresa el monto de la cuenta",
    })
    .nonempty("Ingresa el monto de la cuenta")
    .refine((n) => +n > 0, "Ingresa el monto de la cuenta"),
  datetime: z.coerce.date(),
});

export const visitFormFields = [
  "customerPhone",
  "table",
  "billAmount",
  "datetime",
] as const;

export const visitFormInitialState = {
  success: undefined,
  form: undefined,
  fieldErrors: {},
  errors: undefined,
};

export type VisitActionState = {
  success?: boolean;
  form?: {
    customerPhone?: string;
    table?: string;
    billAmount?: string;
    datetime?: string;
  };
  fieldErrors?: Partial<
    Record<"customerPhone" | "table" | "billAmount" | "datetime", string>
  >;
  errors?: string[];
};
