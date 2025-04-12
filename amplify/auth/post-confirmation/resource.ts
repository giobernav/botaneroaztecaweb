import { defineFunction } from "@aws-amplify/backend";

export const postConfirmationFcn = defineFunction({
  name: "post-confirmation",
  resourceGroupName: "auth",
});
