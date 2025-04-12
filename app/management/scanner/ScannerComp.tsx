"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { verifyToken } from "@/app/actions/totp";
import { registerVisit } from "@/app/actions/visit";

export default function ScannerComp() {
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState<string | undefined>();

  const onScan = async (result: any) => {
    console.log("result", result);
    setMessage("");
    setIsActive(false);

    if (result?.[0]?.rawValue) {
      const scannedURL = new URL(result?.[0]?.rawValue);
      const mode = scannedURL.searchParams.get("mode");

      if (scannedURL.hostname === "botaneroazteca.es" && mode === "qr") {
        const token = scannedURL.searchParams.get("token");
        const customerId = scannedURL.searchParams.get("cusid");

        if (customerId && token) {
          // verificar token
          const isValidToken = await verifyToken(customerId, token);
          console.log("isValidToken", isValidToken);

          if (isValidToken) {
            // registrar visita
            const formData = new FormData();
            const result = await registerVisit("QR", customerId, {}, formData);
            console.log("registerVisit result", result);
            setMessage(
              result.success
                ? "Visita registrada correctamente!"
                : result.errors?.[0]
            );
          } else {
            setMessage("Código inválido, intenta de nuevo");
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="w-64 h-64 mx-auto">
        <Scanner
          onScan={onScan}
          onError={(error: any) => {
            console.log(`onError: ${error}`);
          }}
          scanDelay={2000}
          paused={!isActive}
        />
      </div>
      {message ? <p aria-live="polite">{message}</p> : null}
      {!isActive ? (
        <button onClick={() => setIsActive(true)}>Escanear QR</button>
      ) : null}
    </div>
  );
}
