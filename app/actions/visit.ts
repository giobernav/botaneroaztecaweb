"use server";

import dayjs from "dayjs";
import { cookiesClient } from "@/app/utils/amplify-utils";

import type { Schema } from "../../amplify/data/resource";
import {
  VisitActionState,
  visitFormSchema,
} from "../management/register-visit/schema";
// import { verifyToken } from "./totp";

export async function registerVisit(
  entryType: "QR" | "MANUAL",
  userId: string | undefined | null,
  token: string | undefined | null,
  formData: FormData
): Promise<VisitActionState> {
  let customerId = userId;

  const form = Object.fromEntries(formData);
  console.log("form", form);

  const validationResult =
    entryType === "QR"
      ? visitFormSchema.partial({ customerPhone: true }).safeParse(form)
      : visitFormSchema.safeParse(form);
  console.log("validationResult", validationResult);

  // Return early if the form data is invalid
  if (!validationResult.success) {
    const errors: any = validationResult.error.flatten().fieldErrors;
    let fieldErrors = {};
    Object.keys(errors).map((x: string) => {
      fieldErrors = { ...fieldErrors, [x]: errors[x][0] };
    });

    return {
      success: false,
      form: {
        customerPhone: form.customerPhone as string,
        table: form.table as string,
        billAmount: form.billAmount as string,
        datetime: form.datetime as string,
      },
      fieldErrors,
    };
  }

  // if (entryType === "QR") {
  //   // verificar token
  //   const isValidToken = await verifyToken(customerId!, token!);
  //   console.log("isValidToken", isValidToken);

  //   if (!isValidToken) {
  //     return {
  //       success: false,
  //       errors: ["Token no válido, escanea el código nuevamente"],
  //     };
  //   }
  // }

  if (!customerId) {
    const customerPhone = validationResult.data.customerPhone?.replace(
      /\s+/g,
      ""
    );

    const cognitoUser = await cookiesClient.queries.getCognitoUser({
      username: customerPhone,
    });
    customerId = cognitoUser.data?.Username!;
  }

  if (!customerId) {
    return {
      success: false,
      errors: ["Usuario no encontrado"],
    };
  }

  const now = new Date();

  //  comprobar si existe un registro del mismo día
  const { data } = await cookiesClient.models.Visit.listVisitByCustomer({
    customerId,
    datetime: {
      beginsWith: now.toISOString().substring(0, 10),
    },
  });

  if (data && data.length) {
    return {
      success: false,
      errors: ["Ya existe visita registrada en menos de 24 horas."],
    };
  }

  const billAmount = +(+validationResult.data.billAmount * 100).toFixed(0);
  const rawFormData = {
    customerId,
    status: "ACTIVE",
    entryType,
    datetime: new Date(validationResult.data.datetime).toISOString(),
    table: validationResult.data.table,
    billAmount,
    pointsEarned: billAmount,
  } as Schema["Visit"]["createType"];
  console.log("rawFormData", rawFormData);

  // mutate data
  const { errors, data: newVisit } = await cookiesClient.models.Visit.create(
    rawFormData
  );
  console.log("newVisit", newVisit, errors);

  if (errors) {
    console.log("newVisit errors", errors);
    return { success: false, errors: errors.map((x) => x.message) };
  }

  // revalidate cache
  return { success: true };
}

export async function listVisits(customerId: string, endDate?: string | null) {
  const between: [string, string] = [
    endDate
      ? dayjs(endDate).subtract(1, "year").startOf("day").toISOString()
      : dayjs().subtract(1, "year").startOf("day").toISOString(),
    dayjs().endOf("day").toISOString(),
  ];

  const { errors, data: visits } =
    await cookiesClient.models.Visit.listVisitByCustomer(
      {
        customerId,
        datetime: {
          between,
        },
      },
      {
        sortDirection: "DESC",
        selectionSet: [
          "id",
          "status",
          "customerId",
          "datetime",
          "pointsEarned",
          "billAmount",
          "createdAt",
          "updatedAt",
          "entryType",
        ],
      }
    );

  if (errors) {
    console.log("visits errors", errors);
    return { success: false, errors: errors.map((x) => x.message) };
  }

  const totalPoints = visits?.reduce(
    (sum, visit) => sum + (visit?.pointsEarned || 0),
    0
  );

  return { success: true, visits, totalPoints };
}
