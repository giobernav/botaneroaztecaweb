"use client";

import QRCode from "react-qr-code";
import { useCountdown } from "usehooks-ts";
import { generateToken } from "../../actions/totp";
import { useEffect, useState } from "react";
import { Progress } from "@heroui/progress";
import { Card } from "@heroui/card";
import { Icon } from "@iconify/react";

const COUNT_START = 60;

export default function CustomerQr({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>();
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: COUNT_START,
    intervalMs: 1000,
  });

  const fetchToken = async () => {
    resetCountdown();
    setLoading(true);
    const newToken = await generateToken();
    console.log("token", newToken);
    setToken(newToken);
    startCountdown();
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      fetchToken();
    }
  }, [token]);

  useEffect(() => {
    if (count === 0) {
      fetchToken();
    }
  }, [count]);

  return (
    <div className="border-2 border-dashed border-default-200 p-4 rounded-lg">
      {loading ? (
        <Card
          className="w-56 h-56 flex items-center justify-center animate-pulse"
          radius="lg"
        >
          <Icon
            icon="lucide:qr-code"
            className="text-default-400"
            width={256}
            height={256}
          />
        </Card>
      ) : (
        <div className="w-56 h-56 bg-white p-2 flex items-center justify-center">
          {/* Using a placeholder for the QR code */}
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={`https://botaneroazteca.es/rewards/verify?mode=qr&company=botaneroazteca&branch=valdebebas&cusid=${customerId}&token=${token}`}
            viewBox={`0 0 256 256`}
            level="Q"
          />
        </div>
      )}
      <div className="flex flex-col gap-6 w-full mx-auto mt-1">
        <Progress
          aria-label="Loading..."
          size="sm"
          color="primary"
          value={+((count / COUNT_START) * 100).toFixed(0)}
        />
      </div>
    </div>
  );
}
