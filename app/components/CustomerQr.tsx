"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import QRCode from "react-qr-code";

export default function CustomerQr({ customerId }: { customerId: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        className="bg-foreground text-background"
        startContent={
          <Icon className="flex-none" icon="lucide:qr-code" width={16} />
        }
        onPress={onOpen}
      >
        QR
      </Button>
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        placement="auto"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mi código
              </ModalHeader>
              <ModalBody>
                <div className="p-4 max-w-60 w-full bg-white rounded-lg mt-0 mb-4 mx-auto">
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`https://rewards.botaneroazteca.es/rewards/verify?mode=qr&company=botaneroazteca&branch=valdebebas&cusid=${customerId}`}
                    viewBox={`0 0 256 256`}
                    level="Q"
                  />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
