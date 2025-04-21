import { Schema } from "@/amplify/data/resource";
import { cookiesClient } from "@/app/utils/amplify-utils";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    name,
    tierLevels,
    currency = "EUR",
    lang = "ES",
    logo: logoPath,
    pointExpirationDays = 365,
  }: Schema["Company"]["createType"] = body || {};

  //  get from DB
  const { data: createdCompany, errors } =
    await cookiesClient.models.Company.create({
      name,
      tierLevels,
      currency,
      lang,
      logo: logoPath,
      pointExpirationDays,
    });

  console.log("createdCompany", createdCompany);
  console.log("errors", errors);

  if (errors) {
    return new Response(`Error: ${errors?.[0]?.message}`, { status: 422 });
  }

  return Response.json({
    success: true,
    company: createdCompany,
  });
}
