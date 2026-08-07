"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  brand: React.ReactNode;
  invoice: React.ReactNode;
  contact: React.ReactNode;
  estimate: React.ReactNode;
};

export function AdminSettingsTabs({ brand, invoice, contact, estimate }: Props) {
  return (
    <Tabs defaultValue="brand" className="w-full gap-4">
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
        <TabsTrigger value="brand" className="text-xs sm:text-sm">
          ბრენდი
        </TabsTrigger>
        <TabsTrigger value="invoice" className="text-xs sm:text-sm">
          ინვოისი
        </TabsTrigger>
        <TabsTrigger value="contact" className="text-xs sm:text-sm">
          კონტაქტი
        </TabsTrigger>
        <TabsTrigger value="estimate" className="text-xs sm:text-sm">
          ბიუჯეტი
        </TabsTrigger>
      </TabsList>
      <TabsContent value="brand" className="mt-0 space-y-4 outline-none">
        {brand}
      </TabsContent>
      <TabsContent value="invoice" className="mt-0 space-y-4 outline-none">
        {invoice}
      </TabsContent>
      <TabsContent value="contact" className="mt-0 space-y-4 outline-none">
        {contact}
      </TabsContent>
      <TabsContent value="estimate" className="mt-0 space-y-4 outline-none">
        {estimate}
      </TabsContent>
    </Tabs>
  );
}
