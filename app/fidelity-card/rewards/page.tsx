"use client";

import type { CardProps } from "@heroui/card";

import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Form } from "@heroui/form";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/theme";

const CardComponent = (props: CardProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("handleSubmit");
  };

  const content = isOpen ? (
    <div className="h-full w-full items-start justify-center overflow-scroll px-4 pb-24 pt-20">
      <div className="flex flex-col gap-2">
        <Form
          className="w-full"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            autoFocus
            fullWidth
            isRequired
            aria-label="Affiliate code"
            classNames={{
              inputWrapper:
                "group-data-[focus-visible=true]:outline-foreground",
            }}
            label="Enter affiliate code"
            labelPlacement="outside"
            placeholder="E.g. ACME123"
          />
          <Button className="mt-1 w-full" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <Divider className="mb-8 mt-10" />
      <ul className="flex flex-col gap-1">
        <li>
          <Link className="text-default-400" href="#" size="sm">
            Where do I find my affiliate code?
          </Link>
        </li>
        <li>
          <Link className="text-default-400" href="#" size="sm">
            How do I become an affiliate?
          </Link>
        </li>
        <li>
          <Link className="text-default-400" href="#" size="sm">
            What are the benefits of being an affiliate?
          </Link>
        </li>
        <li>
          <Link className="text-default-400" href="#" size="sm">
            Contact Acme Support
          </Link>
        </li>
      </ul>
    </div>
  ) : (
    <ul>
      <li className="flex items-center gap-1">
        <Icon className="text-default-600" icon="ci:check" width={24} />
        <p className="text-small text-default-500">New Acme customer</p>
      </li>
      <li className="flex items-center gap-1">
        <Icon className="text-default-600" icon="ci:check" width={24} />
        <p className="text-small text-default-500">Fewer than 10 employees</p>
      </li>
      <li className="flex items-center gap-1">
        <Icon className="text-default-600" icon="ci:check" width={24} />
        <p className="text-small text-default-500">
          Affiliated with an Acme partner
        </p>
      </li>
    </ul>
  );

  return (
    <Card {...props} className="relative w-full max-w-[400px] pb-[120px]">
      <Button
        className="absolute right-4 top-8 z-10"
        isIconOnly={isOpen}
        radius="full"
        size="sm"
        onPress={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <Icon icon="ci:close-sm" width={24} /> : "Apply"}
      </Button>
      <CardBody className="relative min-h-[300px] bg-gradient-to-br from-content1 to-default-100/50 p-8 before:inset-0 before:h-full before:w-full before:content-['']">
        <h1 className="mb-4 text-default-400">Get up to</h1>
        <h2 className="inline bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-6xl font-semibold tracking-tight text-transparent dark:to-foreground-200">
          Four
          <br />
          months
          <br />
          free
        </h2>
      </CardBody>
      <CardFooter
        className={cn(
          "absolute bottom-0 h-[120px] overflow-visible bg-content1 px-6 duration-300 ease-in-out transition-height",
          {
            "h-full": isOpen,
            "border-t-1 border-default-100": !isOpen,
          }
        )}
      >
        {content}
      </CardFooter>
    </Card>
  );
};

const AvailableRewardsPage = () => {
  return (
    <section>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium text-foreground" id="application">
            Recompensas disponibles
          </h2>
        </div>
      </div>
      <p className="mt-2 text-default-500">
        Canjea las recompensas que tienes disponibles. Verifica la vigencia de
        tus recompensas y canjealas cuanto antes.
      </p>

      <div className="mt-4 gap-3 grid grid-cols-1 sm:grid-cols-3">
        {Array.from(new Array(4)).map((_, index) => (
          <CardComponent key={index} />
        ))}
      </div>
    </section>
  );
};

export default AvailableRewardsPage;
