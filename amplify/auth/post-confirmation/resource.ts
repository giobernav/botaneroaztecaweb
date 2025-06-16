import { defineFunction, secret } from "@aws-amplify/backend";

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
    PASSKIT_REST_KEY: secret("PASSKIT_REST_KEY") || "",
    PASSKIT_REST_SECRET: secret("PASSKIT_REST_SECRET") || "",
    DEFAULT_GROUP_NAME: "everyone",
    DEFAULT_ADMIN_USER: "+34666047402",
  },
});
