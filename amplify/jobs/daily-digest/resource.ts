import { defineFunction } from "@aws-amplify/backend";

export const dailyDigestFcn = defineFunction({
  name: "daily-digest",
  schedule: "0 3 ? * * *",
  timeoutSeconds: 60 * 5,
});
