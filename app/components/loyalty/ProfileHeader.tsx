"use client";

import React from "react";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import NextLink from "next/link";

interface ProfileHeaderProps {
  name: string;
  phone: string;
  avatarUrl: string;
  membershipLevel: string;
  points: number;
}

export function ProfileHeader({
  name,
  phone,
  avatarUrl,
  membershipLevel,
  points,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 bg-content1 rounded-lg mb-6">
      <Avatar
        src={avatarUrl}
        className="w-20 h-20"
        isBordered
        color="primary"
      />

      <div className="flex flex-col items-center md:items-start gap-1 flex-grow">
        <h2 className="text-xl font-bold">{name || "Bienvenid@ de nuevo"}</h2>
        <p className="text-default-500">{phone}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge color="primary" variant="flat">
            {membershipLevel}
          </Badge>
          <div className="flex items-center gap-1">
            <Icon icon="lucide:star" className="text-warning" />
            <span className="text-sm">{points} puntos</span>
          </div>
        </div>
      </div>

      <Button
        as={NextLink}
        href="/profile"
        variant="light"
        color="primary"
        endContent={<Icon icon="lucide:settings" />}
      >
        Ajustes
      </Button>
    </div>
  );
}
