"use server";
import { cookiesClient } from "@/app/utils/amplify-utils";
import { ProfileActionState, profileFormSchema } from "../profile/schema";
import { Schema } from "@/amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";
import { diff } from "deep-object-diff";

const customerSelectionSet = [
  "id",
  "phone",
  "name",
  "lastName",
  "email",
  "birthdate",
  "tierEndDate",
  "memberTier",
] as const;

export async function updateProfile(
  customer: SelectionSet<
    Schema["Customer"]["type"],
    typeof customerSelectionSet
  >,
  formData: FormData
): Promise<ProfileActionState> {
  const form = Object.fromEntries(formData);
  console.log("form", form);

  const validationResult = profileFormSchema.safeParse(form);
  console.log("validationResult", validationResult);

  if (!validationResult.success) {
    const errors: any = validationResult.error.flatten().fieldErrors;
    let fieldErrors = {};
    Object.keys(errors).map((x: string) => {
      fieldErrors = { ...fieldErrors, [x]: errors[x][0] };
    });

    return {
      success: false,
      form: {
        email: form.email as string,
        name: form.name as string,
        lastName: form.lastName as string,
        birthdate: form.datetime as string,
      },
      fieldErrors,
    };
  }

  // get the updated data from the customer data
  const updatedData = diff(customer, {
    id: customer.id,
    phone: customer.phone,
    ...validationResult.data,
  });
  console.log("updatedData", updatedData);

  const { data, errors } = await cookiesClient.models.Customer.update({
    id: customer.id,
  });
  console.log("updated profile data", data);

  if (errors) {
    console.log("newVisit errors", errors);
    return { success: false, errors: errors.map((x) => x.message) };
  }

  return { success: true };
}

export async function getCustomer(userId: string) {
  const { data: customer, errors } = await cookiesClient.models.Customer.get(
    {
      id: userId!,
    },
    {
      authMode: "identityPool",
      selectionSet: customerSelectionSet,
    }
  );

  if (errors) {
    console.log("errors", errors);
  }

  return customer;
}
