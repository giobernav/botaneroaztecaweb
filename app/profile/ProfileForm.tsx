"use client";

import { Form } from "@heroui/form";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { DateInput } from "@heroui/date-input";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { ChangeEvent, useRef, useState } from "react";
import { Schema } from "@/amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";
import {
  ProfileActionState,
  profileFormInitialState,
} from "@/app/profile/schema";
import { updateProfile } from "../actions/customer";
import { Alert } from "@heroui/alert";

const selectionSet = [
  "id",
  "phone",
  "name",
  "lastName",
  "email",
  "birthdate",
] as const;
export default function ProfileForm({
  customer,
}: {
  customer: SelectionSet<Schema["Customer"]["type"], typeof selectionSet>;
}) {
  const [state, setState] = useState<ProfileActionState>(
    profileFormInitialState
  );
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle profile picture upload
  const handleProfilePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setProfilePicture(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle save button click
  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const result = await updateProfile(customer, formData);
    console.log("result", result);
    setState(result);
    setIsLoading(false);

    if (result.success) {
      setIsSaved(true);

      // Reset saved status after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <Card className="w-full max-w-xl" disableRipple>
      <CardBody className="gap-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Mi perfil</h1>
          <div className="relative">
            <Avatar
              src={profilePicture || undefined}
              name={customer.name || "User"}
              className="w-24 h-24 text-large cursor-pointer"
              onClick={handleAvatarClick}
              isBordered
            />
            <div
              className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer"
              onClick={handleAvatarClick}
            >
              <Icon
                icon="lucide:camera"
                className="text-white"
                width={16}
                height={16}
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureUpload}
            />
          </div>
          <span className="text-default-500 text-sm">
            Actualiza tu foto de perfil
          </span>
        </div>

        <Divider />

        <Form onSubmit={handleSave} validationErrors={state.fieldErrors}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="phone"
              label="Número de celular"
              placeholder="Enter your phone number"
              type="tel"
              errorMessage={(validationResult) =>
                typeof validationResult === "string"
                  ? validationResult
                  : undefined
              }
              readOnly
              isDisabled
              defaultValue={customer.phone!}
            />

            <Input
              name="name"
              label="Nombre(s)"
              placeholder="Ingresa tu nombre"
              isRequired
              defaultValue={customer.name!}
            />

            <Input
              name="lastName"
              label="Apellido(s)"
              placeholder="Ingresa tus apellidos"
              isRequired
              defaultValue={customer.lastName!}
            />

            <Input
              name="email"
              label="Correo electrónico"
              placeholder="juan@miempresa.com"
              type="email"
              errorMessage={(validationResult) =>
                typeof validationResult === "string"
                  ? validationResult
                  : undefined
              }
              defaultValue={customer.email!}
            />

            <DateInput name="birthdate" label="Cumpleaños" />
          </div>

          {state?.errors?.map((message: string, idx) => {
            return (
              <Alert
                key={`error_${idx}`}
                color="danger"
                title="Error"
                description={message}
              />
            );
          })}

          {state.success ? (
            <Alert
              color="success"
              title={`¡Muy bien!`}
              description={`Tu perfl ha sido actualizado exitosamente.`}
            />
          ) : null}

          <div className="w-full flex justify-end mt-4">
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="px-8"
              startContent={
                !isLoading && !isSaved && <Icon icon="lucide:save" />
              }
              endContent={isSaved && <Icon icon="lucide:check" />}
              defaultValue={customer.birthdate!}
            >
              {isSaved ? "Saved" : "Save Changes"}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
