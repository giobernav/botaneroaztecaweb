import { defineFunction } from "@aws-amplify/backend";

export const postConfirmationFcn = defineFunction({
  name: "post-confirmation",
  resourceGroupName: "auth",
  runtime: 20,
  environment: {
    DEFAULT_COMPANY: process.env?.NEXT_PUBLIC_DEFAULT_COMPANY || "",
    PASSKIT_PROGRAM_ID:
      process.env?.NEXT_PUBLIC_PASSKIT_PROGRAM_ID || "6d5VaG05qZ0X52pu3AVbp7",
    PASSKIT_API_URL:
      process.env?.NEXT_PUBLIC_PASSKIT_API_URL || "https://api.pub1.passkit.io",
  },
});
