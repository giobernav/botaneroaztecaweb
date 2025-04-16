export const mockSystem = {
  currency: "EUR",
  lang: "ES",
  logo: null,
  pointExpirationDays: 365,
  EARNED_POINTS_X_UNIT: 100,
  POINTS_UNIT_VALUE_CENTS: 100,
  tierLevels: [
    {
      id: "BRONZE",
      title: "Bronce",
      pointsRequired: 0,
      discount: 5,
      status: "ACTIVE",
    },
    {
      id: "SILVER",
      title: "Plata",
      pointsRequired: 5000,
      discount: 10,
      status: "ACTIVE",
    },
    {
      id: "GOLD",
      title: "Oro",
      pointsRequired: 10000,
      discount: 15,
      status: "ACTIVE",
    },
  ],
};
