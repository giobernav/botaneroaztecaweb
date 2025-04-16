import { getCustomer } from "@/app/actions/customer";
import { listVisits } from "@/app/actions/visit";
import LastVisitsComp from "@/app/components/loyalty/LastVisitsComp";
import { AuthGetCurrentUserServer } from "@/app/utils/amplify-utils";
import { formatNumber } from "@/app/utils/formatter";
import { Divider } from "@heroui/divider";

export default async function LoyaltyLastVisitsPage() {
  const user = await AuthGetCurrentUserServer();
  // visitas del cliente en los ultimos 90 días
  const customer = await getCustomer(user?.userId!);
  const { visits: lastVisits = [] } = await listVisits(
    user?.userId!,
    customer?.tierEndDate
  );
  console.log("lastVisits", lastVisits);

  return (
    <div className="p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Visitas recientes</h3>
          <span className="text-sm text-default-500">Último año</span>
        </div>

        <LastVisitsComp visits={lastVisits!} />

        <Divider />

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">Visitas</p>
            <p className="text-lg font-semibold">{lastVisits?.length}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">Total gastado</p>
            <p className="text-lg font-semibold">
              {formatNumber(
                lastVisits?.reduce(
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
              {lastVisits?.reduce(
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
