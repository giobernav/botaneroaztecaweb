import { defineFunction } from "@aws-amplify/backend";

export const dDBVisitStreamFcn = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: "dDBVisitStreamFcn",
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: "./handler.ts",
  resourceGroupName: "data",
});
