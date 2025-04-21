import { z } from "zod";

export const profileFormSchema = z.object({
  email: z
    .string()
    .email("Ingresa un email válido")
    .nullish()
    .catch(null)
    .optional(),
  name: z.string().min(3, "Al menos 3 caracteres necesarios").optional(),
  lastName: z.string().min(3, "Al menos 3 caracteres necesarios").optional(),
  birthdate: z.string().date().nullish().catch(null),
});

export const profileFormInitialState = {
  success: undefined,
  form: undefined,
  fieldErrors: {},
  errors: undefined,
};

export type ProfileActionState = {
  success?: boolean;
  form?: z.infer<typeof profileFormSchema>;
  fieldErrors?: {
    email?: string[];
    name?: string[];
    lastName?: string[];
    bithdate?: string[];
  };
  errors?: string[];
};
