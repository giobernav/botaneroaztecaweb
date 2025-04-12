import FormComp from "./FormComp";

export default async function ManagementRegisterVisitPage() {
  // const registerManualVisit = registerVisit.bind(null, "MANUAL", null);

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-default-50 rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Registrar visita
        </h1>
        <FormComp />
      </div>
    </div>
  );
}
