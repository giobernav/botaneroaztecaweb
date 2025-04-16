"use client";

import React from "react";

export const useHash = () => {
  const [hash, setHash] = React.useState<undefined | string>();

  React.useEffect(() => {
    const onHashChanged = () => setHash(window.location.hash);
    const { pushState, replaceState } = window.history;
    window.history.pushState = function (...args) {
      pushState.apply(window.history, args);
      setTimeout(() => setHash(window.location.hash));
    };
    window.history.replaceState = function (...args) {
      replaceState.apply(window.history, args);
      setTimeout(() => setHash(window.location.hash));
    };
    window.addEventListener("hashchange", onHashChanged);
    return () => {
      window.removeEventListener("hashchange", onHashChanged);
    };
  }, []);
  return hash;
};
