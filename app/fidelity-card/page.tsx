import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Icon } from "@iconify/react";

export default function FidelityCardPage() {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium text-foreground" id="application">
            Tarjeta de fidelidad
          </h2>
        </div>
      </div>
      <p className="mt-2 text-default-500">
        Tus visitas registradas en los últimos 180 días. Obtén tus sellos y
        canjea por recompensas y descuentos.
      </p>

      <div className="max-w-xs mx-auto mt-4 gap-3 grid grid-cols-3">
        {Array.from(new Array(15)).map((_, index) => (
          <Card key={index} fullWidth isDisabled={index !== 0}>
            <CardBody className="inline-flex items-center justify-center">
              <span>
                <Icon
                  className="text-purple-400"
                  icon="mdi-light:taco"
                  width={64}
                />
              </span>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="relative flex h-full w-full items-start overflow-x-auto overflow-y-auto transition-colors duration-200 py-4 justify-center">
        <Card className="flex flex-col overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none overflow-none relative w-[420px] border-small border-foreground/10">
          <CardBody className="px-3">
            <div className="flex flex-col gap-2 px-2">
              <p className="text-large font-medium">
                Tienes recompensas disponibles
              </p>
              <p className="text-small">
                Canjea tus recompensas disponibles en tu siguiente visita.
                Consulta la fecha de vencimiento para que los aproveches cuanto
                antes.
              </p>
            </div>
          </CardBody>
          <CardFooter className="justify-end gap-2">
            <Button color="secondary" fullWidth>
              Canjear recompensa
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
