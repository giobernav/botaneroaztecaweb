"use client";

import { useMemo } from "react";
import { UAParser } from "ua-parser-js";

import LoyaltyPageComp from "../components/loyalty/LoyaltyPageComp";
import { useLoyaltyData } from "./LoyaltyDataProvider";

export default function LoyaltyPage() {
  const { userId, customer } = useLoyaltyData();
  const deviceInfo = useMemo(() => {
    if (typeof window === "undefined") {
      return { isMobile: false, os: undefined as string | undefined };
    }

    const parser = new UAParser(window.navigator.userAgent);
    const result = parser.getResult();
    return {
      isMobile: result.device?.type === "mobile",
      os: result.os?.name || undefined,
    };
  }, []);

  if (!userId) {
    return null;
  }

  return (
    <LoyaltyPageComp
      isMobile={deviceInfo.isMobile}
      os={deviceInfo.os}
      customerId={userId}
      passKitMemberId={customer?.passKitMemberId || ""}
    />
  );
}
