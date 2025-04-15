"use client";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";

export const Footer = () => {
  return (
    <footer className="bg-default-900 text-default-100 py-12 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon
                icon="lucide:utensils"
                width={24}
                className="text-amber-500"
              />
              <h3 className="text-xl font-bold">Botanero Azteca</h3>
            </div>
            <p className="mb-4 text-default-400">
              Auténtica cocina mexicana con un toque azteca. Servimos platillos
              tradicionales elaborados con ingredientes frescos y sabores
              audaces.
            </p>
            <div className="flex items-start gap-4">
              <a
                href="https://www.instagram.com/botaneroazteca"
                target="_blank"
                className="text-default-400 hover:text-amber-500 transition-colors"
              >
                <Icon
                  className="text-default-400"
                  icon="lucide:instagram"
                  width={24}
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <div className="space-y-3 text-default-400">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:map-pin" width={18} />
                <p>Josefina Aldecoa 8. Madrid, 28055</p>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:phone" width={18} />
                <p>(+34) 671 45 14 03</p>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:mail" width={18} />
                <p>contacto@botaneroazteca.es</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Horario de servicio</h3>
            <div className="space-y-2 text-default-400">
              <div className="flex justify-between">
                <span>Lunes</span>
                <span>Cerrado</span>
              </div>
              <div className="flex justify-between">
                <span>Martes - Jueves</span>
                <span>18:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Viernes - Sábado</span>
                <span>13:00 - 23:30</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo</span>
                <span>13:00 - 22:30</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-default-400">
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  className="hover:text-amber-500 transition-colors"
                >
                  Menú
                </a>
              </li>
              <li>
                <a
                  href="#reservation"
                  className="hover:text-amber-500 transition-colors"
                >
                  Reservas
                </a>
              </li>
              <li>
                <a
                  href="#loyalty"
                  className="hover:text-amber-500 transition-colors"
                >
                  Programa de lealtad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Eventos privados
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="my-6 bg-default-700" />

        <div className="text-center text-default-400 text-sm">
          <p>
            © {new Date().getFullYear()} Botanero Azteca Valdebebas, SL.
            Derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
