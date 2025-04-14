"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Icon } from "@iconify/react";
import { BotaneroIcon } from "./BotaneroIcon";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import es from "react-phone-number-input/locale/es";
import { E164Number } from "libphonenumber-js/core";
import {
  autoSignIn,
  confirmSignIn,
  confirmSignUp,
  signIn,
  signUp,
} from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import { useRouter } from "next/navigation";

const client = generateClient<Schema>();

function Login({ nextUrl }: { nextUrl?: string }) {
  const router = useRouter();

  const [pending, setPending] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [phone, setPhone] = React.useState<E164Number | undefined>();
  const [password, setPassword] = React.useState("");
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isPhoneValid, setIsPhoneValid] = React.useState(true);
  const [authFlow, setAuthFlow] = React.useState("signUp");

  const toggleVisibility = () => setIsVisible(!isVisible);

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

  const validatePassword = (value: string) => value.match(/^[0-9]{6,8}$/);

  const isInvalidPassword = React.useMemo(() => {
    if (password === "") return false;
    return validatePassword(password) ? false : true;
  }, [password]);

  const handlePhoneSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    if (!phone?.length) {
      setIsPhoneValid(false);
      setPending(false);
      return;
    }

    if (isValidPhoneNumber(phone)) {
      setIsPhoneValid(true);
      const { data: retrievedUser, errors } =
        await client.queries.getCognitoUser({ username: phone });
      console.log("retrievedUser", retrievedUser, errors);

      if (retrievedUser?.Username) {
        // sign in flow
        setAuthFlow("signIn");
        const { nextStep: signInNextStep } = await signIn({
          username: phone,
          options: {
            authFlowType: "USER_AUTH",
            preferredChallenge: "SMS_OTP",
          },
        });
        console.log("signInNextStep", signInNextStep);
        if (signInNextStep.signInStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
          setPending(false);
          paginate(1);
        }
      } else {
        // sign up flow
        setAuthFlow("signUp");
        const { nextStep: signUpNextStep } = await signUp({
          username: phone,
          options: {
            userAttributes: {
              phone_number: phone,
            },
            autoSignIn: {
              authFlowType: "USER_AUTH",
              preferredChallenge: "SMS_OTP",
            },
          },
        });

        console.log("signUpNextStep", signUpNextStep);

        if (signUpNextStep.signUpStep === "DONE") {
          console.log(`SignUp Complete`);
        }

        if (signUpNextStep.signUpStep === "CONFIRM_SIGN_UP") {
          console.log(
            `Code Delivery Medium: ${signUpNextStep.codeDeliveryDetails.deliveryMedium}`
          );
          console.log(
            `Code Delivery Destination: ${signUpNextStep.codeDeliveryDetails.destination}`
          );
          setPending(false);
          paginate(1);
        }
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    if (authFlow === "signIn") {
      // prompt user for otp code delivered via SMS
      const { nextStep: confirmSignInNextStep } = await confirmSignIn({
        challengeResponse: password,
      });

      if (confirmSignInNextStep.signInStep === "DONE") {
        console.log("Sign in successful!");
        router.push(nextUrl || "/loyalty");
      }
    } else {
      const { nextStep: confirmSignUpNextStep } = await confirmSignUp({
        username: phone!,
        confirmationCode: password,
      });

      if (confirmSignUpNextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
        // Call `autoSignIn` API to complete the flow
        const { nextStep } = await autoSignIn();

        if (nextStep.signInStep === "DONE") {
          console.log("Successfully signed in.");
          router.push(nextUrl || "/loyalty");
        }
      }

      if (confirmSignUpNextStep.signUpStep === "DONE") {
        setPending(false);
        paginate(0);
        console.log(`SignUp Complete`);
      }
    }
  };

  const handleSubmit = page === 0 ? handlePhoneSubmit : handlePasswordSubmit;

  return (
    <div className="relative flex h-screen w-full items-start overflow-x-auto overflow-y-auto transition-colors duration-200 p-4 justify-center">
      <div className="flex flex-col h-full w-full items-center justify-center">
        <div className="flex flex-col items-center pb-6">
          <BotaneroIcon size={80} />
          <p className="-mt-6 text-xl font-medium">Bienvenido de nuevo</p>
          <p className="text-small text-default-500">
            Inicia sesión en tu cuenta
          </p>
        </div>
        <div className="mt-2 flex w-full max-w-md flex-col gap-4 rounded-large bg-content1 px-6 sm:px-8 pb-10 pt-6 shadow-small">
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
                  <Input
                    endContent={
                      <button type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <Icon
                            className="pointer-events-none text-2xl text-default-400"
                            icon="solar:eye-closed-linear"
                          />
                        ) : (
                          <Icon
                            className="pointer-events-none text-2xl text-default-400"
                            icon="solar:eye-bold"
                          />
                        )}
                      </button>
                    }
                    errorMessage={
                      isInvalidPassword ? "Código inválido" : undefined
                    }
                    label="Código de autenticación"
                    name="password"
                    placeholder="Ingresa el código"
                    type={isVisible ? "text" : "password"}
                    isInvalid={isInvalidPassword}
                    value={password}
                    variant="bordered"
                    onValueChange={(value) => {
                      setPassword(value);
                    }}
                    fullWidth
                    inputMode="numeric"
                  />
                )}

                <Button
                  fullWidth
                  color="primary"
                  type="submit"
                  disabled={pending}
                  isLoading={pending}
                >
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
