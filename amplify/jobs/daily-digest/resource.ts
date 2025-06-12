import { defineFunction } from "@aws-amplify/backend";

export const dailyDigestFcn = defineFunction({
  name: "daily-digest",
  schedule: "0 3 ? * * *",
  timeoutSeconds: 60 * 5,
  environment: {
    DEFAULT_COMPANY: process.env?.NEXT_PUBLIC_DEFAULT_COMPANY || "",
    PASSKIT_PROGRAM_ID:
      process.env?.NEXT_PUBLIC_PASSKIT_PROGRAM_ID || "6d5VaG05qZ0X52pu3AVbp7",
    PASSKIT_API_URL:
      process.env?.NEXT_PUBLIC_PASSKIT_API_URL || "https://api.pub1.passkit.io",
  },
});
