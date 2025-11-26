"use client";

import LastVisitsComp from "@/app/components/loyalty/LastVisitsComp";
import { formatNumber } from "@/app/utils/formatter";
import { Divider } from "@heroui/divider";
import { useLoyaltyData } from "../LoyaltyDataProvider";

export default function LoyaltyLastVisitsPage() {
  const { visits } = useLoyaltyData();
  const lastVisits = visits || [];

  return (
    <div className="p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Visitas recientes</h3>
          <span className="text-sm text-default-500">Últimos 180 días</span>
        </div>

        <LastVisitsComp visits={lastVisits} />

        <Divider />

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">Visitas</p>
            <p className="text-lg font-semibold">{lastVisits.length}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">Total gastado</p>
            <p className="text-lg font-semibold">
              {formatNumber(
                lastVisits.reduce(
                  (sum, visit) => sum + (visit?.billAmount || 0) / 100,
                  0
                )
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-default-500">Puntos ganados</p>
            <p className="text-lg font-semibold text-success">
              +
              {lastVisits.reduce(
                (sum, visit) => sum + (visit?.pointsEarned || 0),
                0
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
