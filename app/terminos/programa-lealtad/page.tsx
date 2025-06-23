"use client";

export default function TerminosYCondiciones() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Términos y Condiciones del Programa de Lealtad – Lealtia
      </h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Objeto del programa</h2>
          <p>
            El presente documento regula las condiciones del Programa de Lealtad
            Lealtia ofrecido por los establecimientos afiliados, mediante el
            cual los usuarios pueden obtener descuentos, recompensas u otros
            beneficios en función de su consumo y nivel de fidelización.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. Adhesión al programa
          </h2>
          <p>
            La participación en el programa es gratuita. Para adherirse, el
            cliente deberá registrarse a través de la aplicación Lealtia,
            aceptar los presentes términos y realizar al menos una compra en un
            establecimiento participante.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. Acumulación de puntos y niveles
          </h2>
          <p>
            Los puntos y beneficios se asignan automáticamente tras cada consumo
            registrado, conforme a los criterios definidos por el
            establecimiento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            4. Condiciones de uso de recompensas y descuentos
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              El importe mínimo de consumo para utilizar cualquier recompensa o
              descuento es de <strong>10 euros</strong>.
            </li>
            <li>
              El importe máximo de descuento aplicable por consumo es de{" "}
              <strong>100 euros</strong>.
            </li>
            <li>
              Los descuentos y recompensas solo se aplican a{" "}
              <strong>alimentos</strong>.
            </li>
            <li>
              No se aplican a{" "}
              <strong>bebidas, menús establecidos ni combos</strong>.
            </li>
            <li>
              Los beneficios del programa{" "}
              <strong>no son acumulables con otras promociones</strong>.
            </li>
            <li>
              Las recompensas no son transferibles ni canjeables por dinero.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            5. Caducidad de puntos y recompensas
          </h2>
          <p>
            Cada establecimiento podrá establecer una política de caducidad para
            los puntos o recompensas no utilizadas. Esta información será
            visible en la app o en el perfil del usuario.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            6. Limitaciones y cancelación
          </h2>
          <p>
            Lealtia y los establecimientos asociados podrán modificar o cancelar
            el programa, con previo aviso al usuario. Asimismo, podrán excluir a
            quienes hagan uso indebido o fraudulento del mismo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            7. Protección de datos personales
          </h2>
          <p>
            Los datos personales serán tratados conforme al Reglamento (UE)
            2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD). Consulte nuestra
            Política de Privacidad para más información.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            8. Legislación aplicable y jurisdicción
          </h2>
          <p>
            Estos términos se rigen por la legislación española. Para
            controversias, se estará a lo dispuesto en los Juzgados y Tribunales
            del domicilio del consumidor.
          </p>
        </section>
      </div>
    </div>
  );
}
