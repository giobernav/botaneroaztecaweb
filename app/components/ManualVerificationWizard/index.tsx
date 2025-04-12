"use client";
import React, { FormEvent } from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";

import MultistepNavigationButtons from "./MultistepNavigationButtons";
import CustomerForm from "./CustomerForm";
import VisitForm from "./VisitForm";
import MultiStepSidebar from "./multistep-sidebar";

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

export default function ManualVerificationWizard({
  customerId,
}: {
  customerId: string;
}) {
  const [[page, direction], setPage] = React.useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage((prev) => {
      const nextPage = prev[0] + newDirection;

      if (nextPage < 0 || nextPage > 3) return prev;

      return [nextPage, newDirection];
    });
  };

  const onChangePage = (newPage: number) => {
    setPage((prev) => {
      if (newPage < 0 || newPage > 3) return prev;
      const currentPage = prev[0];

      return [newPage, newPage > currentPage ? 1 : -1];
    });
  };

  const onBack = React.useCallback(() => {
    paginate(-1);
  }, [paginate]);

  const onSubmit: React.FormEventHandler = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    console.log("formData", formData);

    if (page === 0) {
      console.log("next step");
      paginate(1);
    } else {
      console.log("submit form");
    }
  };

  const content = React.useMemo(() => {
    let component = <CustomerForm />;

    switch (page) {
      case 1:
        component = <VisitForm />;
        break;
      //   case 2:
      //     component = <ChooseAddressForm />;
      //     break;
    }

    return (
      <LazyMotion features={domAnimation}>
        <m.div
          key={page}
          animate="center"
          className="col-span-12"
          custom={direction}
          exit="exit"
          initial="exit"
          transition={{
            y: {
              ease: "backOut",
              duration: 0.35,
            },
            opacity: { duration: 0.4 },
          }}
          variants={variants}
        >
          {component}
        </m.div>
      </LazyMotion>
    );
  }, [direction, page]);

  return (
    <MultiStepSidebar
      currentPage={page}
      onBack={onBack}
      onChangePage={onChangePage}
      onSubmit={onSubmit}
    >
      <div className="relative flex h-fit w-full flex-col pt-6 lg:h-full lg:justify-center lg:pt-0">
        {content}
        <MultistepNavigationButtons
          backButtonProps={{ isDisabled: page === 0 }}
          className="hidden justify-start lg:flex"
          nextButtonProps={{
            children: page === 0 ? "Siguiente" : "Registrar",
          }}
          onBack={onBack}
        />
      </div>
    </MultiStepSidebar>
  );
}
