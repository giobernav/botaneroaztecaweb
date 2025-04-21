"use client";
import { Progress } from "@heroui/progress";

const PointsComp = ({
  userPoints,
  hasNextTier,
  nextTierPoints,
}: {
  userPoints?: number;
  memberTier?: string;
  hasNextTier: boolean;
  nextTierPoints: number;
}) => {
  return (
    <div className="bg-content1 py-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Tus puntos</h3>
        <span className="text-xl font-bold text-primary">{userPoints}</span>
      </div>
      <Progress
        value={userPoints}
        maxValue={nextTierPoints}
        color="primary"
        className="mb-2"
        showValueLabel={true}
        label="Tu progreso"
      />
      <p className="text-sm text-default-500">
        {hasNextTier
          ? `Gana ${
              nextTierPoints - (userPoints || 0)
            } puntos más para subir de nivel`
          : `Gana ${
              nextTierPoints - (userPoints || 0)
            } puntos para mantener tu nivel`}
      </p>
    </div>
  );
};

export default PointsComp;
