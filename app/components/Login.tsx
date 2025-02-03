"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";
import { InputOtp } from "@heroui/input-otp";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Icon } from "@iconify/react";
import { BotaneroIcon } from "./BotaneroIcon";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import es from "react-phone-number-input/locale/es";
import { E164Number } from "libphonenumber-js/core";
import { confirmSignIn, signIn } from "aws-amplify/auth";

function Login({ nextUrl }: { nextUrl?: string }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const [phone, setPhone] = React.useState<E164Number | undefined>();
  const [password, setPassword] = React.useState("");
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isPhoneValid, setIsPhoneValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handlePhoneSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone?.length) {
      setIsPhoneValid(false);
      return;
    }

    if (isValidPhoneNumber(phone)) {
      setIsPhoneValid(true);
      const { nextStep: signInNextStep } = await signIn({
        username: phone,
        options: {
          authFlowType: "USER_AUTH",
          preferredChallenge: "SMS_OTP",
        },
      });
      console.log("signInNextStep", signInNextStep);
      if (signInNextStep.signInStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
        paginate(1);
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.length) {
      setIsPasswordValid(false);
      return;
    }
    setIsPasswordValid(true);

    // Here you can send the email and password to your API for authentication.
    console.log(`Phone Number: ${phone}, Password: ${password}`);

    // prompt user for otp code delivered via SMS
    const { nextStep: confirmSignInNextStep } = await confirmSignIn({
      challengeResponse: password,
    });

    if (confirmSignInNextStep.signInStep === "DONE") {
      console.log("Sign in successful!");
    }
  };

  const handleSubmit = page === 0 ? handlePhoneSubmit : handlePasswordSubmit;

  useEffect(() => {
    if (user) {
      redirect(nextUrl || "/fidelity-card");
    }
  }, [user]);

  return (
    <div className="relative flex h-screen w-full items-start overflow-x-auto overflow-y-auto transition-colors duration-200 p-4 justify-center">
      <div className="flex flex-col h-full w-full items-center justify-center">
        <div className="flex flex-col items-center pb-6">
          <BotaneroIcon size={64} />
          <p className="-mt-4 text-xl font-medium">Bienvenido de nuevo</p>
          <p className="text-small text-default-500">
            Inicia sesión en tu cuenta
          </p>
        </div>
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <LazyMotion features={domAnimation}>
            <m.div layout className="flex min-h-[40px] items-center gap-2 pb-2">
              {page === 1 && (
                <m.div>
                  <Tooltip content="Go back" delay={3000}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => paginate(-1)}
                    >
                      <Icon
                        className="text-default-500"
                        icon="solar:alt-arrow-left-linear"
                        width={16}
                      />
                    </Button>
                  </Tooltip>
                </m.div>
              )}
              <m.h1
                layout
                className="text-xl font-medium"
                transition={{ duration: 0.25 }}
              >
                Inicia sesión
              </m.h1>
            </m.div>
            <AnimatePresence custom={direction} initial={false} mode="wait">
              <m.form
                key={page}
                animate="center"
                className="flex flex-col gap-3"
                custom={direction}
                exit="exit"
                initial="enter"
                transition={{
                  duration: 0.25,
                }}
                variants={variants}
                onSubmit={handleSubmit}
              >
                {page === 0 ? (
                  <PhoneInput
                    labels={es}
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="ES"
                    value={phone}
                    inputComponent={Input}
                    onChange={(value) => {
                      setIsPhoneValid(isValidPhoneNumber(value || ""));
                      setPhone(value);
                    }}
                    name="phone"
                    type="tel"
                    variant="bordered"
                    label="Número de celular"
                    placeholder="Ingresa tu número de celular"
                    errorMessage={
                      !isPhoneValid
                        ? "Ingresa un número de celular válido"
                        : undefined
                    }
                    isInvalid={!isPhoneValid}
                  />
                ) : (
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                    <InputOtp
                      description="Ingresa el código que recibiste por SMS."
                      length={6}
                      size="lg"
                      variant="bordered"
                      errorMessage={
                        !isPasswordValid ? "Código incorrecto" : undefined
                      }
                      label="Código OTP"
                      name="password"
                      isInvalid={!isPasswordValid}
                      value={password}
                      onValueChange={(value) => {
                        setIsPasswordValid(true);
                        setPassword(value);
                      }}
                      fullWidth
                    />
                  </div>
                )}

                <Button fullWidth color="primary" type="submit">
                  {page === 0 ? "Enviar código" : "Iniciar sesión"}
                </Button>
              </m.form>
            </AnimatePresence>
          </LazyMotion>
        </div>
      </div>
    </div>
  );
}

export default Login;
