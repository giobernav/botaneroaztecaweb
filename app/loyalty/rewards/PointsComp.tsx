"use client";
import { Progress } from "@heroui/progress";
import TiersInfo from "./TiersInfo";

const PointsComp = ({
  userPoints,
  hasNextTier,
  nextTierPoints,
  surplusPoints = 0,
}: {
  userPoints?: number;
  hasNextTier: boolean;
  nextTierPoints: number;
  surplusPoints?: number;
}) => {
  const safeUserPoints = userPoints ?? 0;
  const remainingPoints = Math.max(nextTierPoints, 0);
  const progressMax =
    remainingPoints > 0
      ? safeUserPoints + remainingPoints
      : safeUserPoints || 1;
  const message = hasNextTier
    ? remainingPoints > 0
      ? `Gana ${remainingPoints} puntos más para subir de nivel`
      : "¡Estás listo para el siguiente nivel!"
    : remainingPoints > 0
    ? `Gana ${remainingPoints} puntos para mantener tu nivel`
    : surplusPoints > 0
    ? `Tienes ${surplusPoints} puntos adicionales sobre el mínimo necesario`
    : "Nivel asegurado";

  return (
    <div className="bg-content1 py-4 rounded-lg w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold">Tus puntos en el nivel</h3>
        <span className="text-lg font-bold text-primary">{safeUserPoints}</span>
      </div>
      <Progress
        value={Math.min(safeUserPoints, progressMax)}
        maxValue={progressMax}
        color="primary"
        className="mb-2"
        showValueLabel={true}
        label="Tu progreso"
      />
      <p className="text-sm text-default-500">
        {message}
        <TiersInfo />
      </p>
    </div>
  );
};

export default PointsComp;
