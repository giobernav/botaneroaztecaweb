"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Scroll() {
  // when clicking a link, user will not scroll to the top of the page if the header is sticky.
  // their current scroll position will persist to the next page.
  // this useEffect is a workaround to 'fix' that behavior.

  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    // Scroll to the top of the page when the pathname changes
    // console.log("Scroll to top on pathname change:", pathname);
    // Use window.scroll to scroll to the top smoothly
    window.scroll({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return <></>;
}
