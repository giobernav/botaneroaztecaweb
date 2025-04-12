"use client";

import { Input } from "@heroui/input";

export default function VisitForm() {
  return (
    <div className="flex flex-col gap-3">
      <Input
        defaultValue="xxxxxx"
        name="customerId"
        label="Customer ID"
        isDisabled
        isRequired
      />
      <Input
        label="Table"
        name="table"
        placeholder="Número de mesa"
        isRequired
      />
      <Input
        endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">€</span>
          </div>
        }
        name="billAmount"
        label="Total de la cuenta"
        placeholder="0.00"
        type="number"
        isRequired
      />
    </div>
  );
}
