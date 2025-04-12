"use client";

import { Schema } from "@/amplify/data/resource";
import { formatNumber } from "@/app/utils/formatter";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { SelectionSet } from "aws-amplify/api";
import dayjs from "dayjs";

const selectionSet = [
  "id",
  "status",
  "customerId",
  "datetime",
  "pointsEarned",
  "billAmount",
  "createdAt",
  "updatedAt",
  "entryType",
] as const;
export default function LastVisitsComp({
  visits,
}: {
  visits: SelectionSet<Schema["Visit"]["type"], typeof selectionSet>[];
}) {
  return visits.length === 0 ? (
    <Card>
      <CardBody className="flex flex-col items-center py-8 gap-2">
        <Icon
          icon="lucide:calendar"
          className="text-default-400"
          width={48}
          height={48}
        />
        <p className="text-default-500">No tienes visitas recientes</p>
      </CardBody>
    </Card>
  ) : (
    <div className="space-y-3">
      {visits.map((visit) => (
        <Card key={visit.id} className="overflow-visible">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-primary-50 rounded-full">
                  <Icon
                    icon="lucide:shopping-bag"
                    className="text-primary"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {visit.entryType?.substring(0, 1)}-{visit.id.split("-")[0]}
                  </p>
                  <p className="text-small text-default-500">
                    {dayjs(visit.datetime).format("DD/MM")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatNumber((visit?.billAmount || 0) / 100)}
                </p>
                <p className="text-small text-success">
                  +{visit.pointsEarned} puntos
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
