"use client";

import { Amplify } from "aws-amplify";

import outputs from "@/amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs, { ssr: true });

export default function ConfigureAmplifyClientSide({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
