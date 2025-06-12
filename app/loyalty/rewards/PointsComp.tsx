"use client";
import { Progress } from "@heroui/progress";

const PointsComp = ({
  userPoints,
  hasNextTier,
  nextTierPoints,
}: {
  userPoints?: number;
  hasNextTier: boolean;
  nextTierPoints: number;
}) => {
  return (
    <div className="bg-content1 py-4 rounded-lg w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold">Tus puntos en el nivel</h3>
        <span className="text-lg font-bold text-primary">{userPoints}</span>
      </div>
      <Progress
        value={userPoints}
        maxValue={nextTierPoints + (userPoints || 0)}
        color="primary"
        className="mb-2"
        showValueLabel={true}
        label="Tu progreso"
      />
      <p className="text-sm text-default-500">
        {hasNextTier
          ? `Gana ${nextTierPoints} puntos más para subir de nivel`
          : `Gana ${nextTierPoints} puntos para mantener tu nivel`}
      </p>
    </div>
  );
};

export default PointsComp;
