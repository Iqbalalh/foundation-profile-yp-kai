"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const CustomMap = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function MainPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-screen w-screen">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <div className="absolute inset-0 z-0">
          <CustomMap setIsOpen={setIsOpen} />
        </div>

        <DrawerContent className="z-[1000]">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Informasi Pribadi</DrawerTitle>
            </DrawerHeader>

            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <div className="space-y-1">
                  <Image
                    width={80}
                    height={80}
                    src={"/img/dummy-profile.jpg"}
                    alt={"dummy"}
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                  <h3 className="font-bold text-lg text-center">Iqbal</h3>
                  <p className="text-sm text-gray-700">
                    <strong>Alamat:</strong> Balam
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Anak:</strong> 2
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Umur:</strong> 22 tahun
                  </p>
                </div>
              </div>
            </div>

            <DrawerFooter>
              <div className="flex space-x-4 items-center justify-center">
                <Button className="w-1/2">Navigasi</Button>
                <Button className="w-1/2">NavGMaps</Button>
              </div>
            </DrawerFooter>
            <div className="mt-4"></div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
