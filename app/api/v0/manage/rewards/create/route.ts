import { Schema } from "@/amplify/data/resource";
import { cookiesClient } from "@/app/utils/amplify-utils";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    type,
    category,
    expiryDate, // ISOString
    expirationDays = 90,
    image: imagePath,
    title,
    description,
    pointsRequired = 0,
  }: Schema["Reward"]["createType"] = body || {};

  //  get from DB
  const { data: createdReward, errors } =
    await cookiesClient.models.Reward.create({
      status: "ACTIVE",
      pointsRequired,
      title,
      description,
      type,
      category, // BIRTHDAY, REVIEW, PROFILE, COUPON, WELCOME, etc.
      expiryDate,
      expirationDays,
      image: imagePath,
    });

  console.log("createdReward", createdReward);
  console.log("errors", errors);

  if (errors) {
    return new Response(`Error: ${errors?.[0]?.message}`, { status: 422 });
  }

  return Response.json({
    success: true,
    reward: createdReward,
  });
}
