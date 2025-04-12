"use client";

import { Spacer } from "@heroui/spacer";
import { Tabs, Tab } from "@heroui/tabs";
import { Icon } from "@iconify/react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Key, useState } from "react";
import ManualVerificationWizard from "./ManualVerificationWizard";

const tabsList = [
  { key: "scan", label: "Escanear QR" },
  { key: "manual", label: "Manual" },
];

export default function RewardsVerify({ customerId }: { customerId: string }) {
  const [selectedTab, setSelectedTab] = useState(tabsList[0]); // default: scan

  const onTabChange = (selectedKey: Key) => {
    const tabsIndex = tabsList.findIndex((f) => f.key === selectedKey);

    setSelectedTab(tabsList[tabsIndex]);
  };

  return (
    <>
      <Tabs
        classNames={{
          tab: "data-[hover-unselected=true]:opacity-90",
        }}
        radius="full"
        size="lg"
        selectedKey={selectedTab.key}
        onSelectionChange={onTabChange}
      >
        <Tab
          key={"scan"}
          aria-label="Pay Yearly"
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:scan-qr-code" />
              <span>Escanear QR</span>
            </div>
          }
        />
        <Tab
          key={"manual"}
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:keyboard" />
              <span>Registro manual</span>
            </div>
          }
        />
      </Tabs>

      <Spacer y={12} />

      {selectedTab.key === "scan" ? (
        <div className="w-64 mx-auto">
          <Scanner
            onScan={(result: any) => console.log(result)}
            onError={(error: any) => {
              console.log(`onError: ${error}'`);
            }}
            scanDelay={2000}
            paused
          />
        </div>
      ) : (
        <ManualVerificationWizard customerId={customerId} />
      )}
    </>
  );
}
