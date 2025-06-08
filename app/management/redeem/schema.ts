import { z } from "zod";
import isMobilePhone from "validator/lib/isMobilePhone";

export const redeemFormSchema = z.object({
  customerPhone: z
    .string({
      required_error: "Ingresa un número de teléfono",
      invalid_type_error: "Ingresa un número de teléfono válido",
    })
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => isMobilePhone(val), {
      message: "Ingresa un número de celular válido",
    }),
  rewardId: z.string({
    required_error: "Ingresa el ID de la recompensa",
  }),
});

export const redeemFormInitialState = {
  success: undefined,
  form: undefined,
  fieldErrors: {},
  errors: undefined,
};

export type RedeemActionState = {
  success?: boolean;
  form?: z.infer<typeof redeemFormSchema>;
  fieldErrors?: {
    customerPhone?: string[];
    rewardId?: string[];
  };
  errors?: string[];
};
