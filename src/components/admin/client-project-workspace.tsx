"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  ClientAssetsPanel,
  ClientChatPanel,
} from "@/components/admin/client-project-panels";
import type { ClientAssetKind } from "@/config/client-portal";
import { ClientInvoicesPanel } from "@/components/admin/client-invoices-panel";
import { ClientProjectForm } from "@/components/admin/client-project-form";
import { PromoteToPortfolioButton } from "@/components/admin/promote-to-portfolio-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  clientProjectStatusLabel,
  type ClientProjectStatus,
} from "@/config/client-portal";
import type { InvoiceSignatureTransform } from "@/lib/invoice-signature";
import type { InvoiceBankConfig } from "@/config/invoice";

type Invoice = {
  id: string;
  invoiceNumber: string;
  title: string;
  amountGel: number;
  netGel: number;
  status: "draft" | "sent" | "paid";
  paymentStage: string;
  currency: string;
  recipientName: string | null;
  pdfUrl: string | null;
  dueDate: Date | null;
  issuedAt: Date;
};

type Asset = {
  id: string;
  filename: string;
  url: string;
  mime: string;
  kind: ClientAssetKind;
  createdAt: Date;
};

type Message = {
  id: string;
  authorRole: "admin" | "client";
  authorEmail: string;
  body: string;
  createdAt: Date;
};

type Props = {
  project: {
    id: string;
    title: string;
    status: ClientProjectStatus;
    progressPercent: number;
    clientEmail: string;
    notes: string;
    portfolioProjectId: string | null;
    assets: Asset[];
    messages: Message[];
    invoices: Invoice[];
  };
  clientDisplayName: string | null;
  clientPhone: string | null;
  clientAddress: string | null;
  supplierSignature: {
    url: string | null;
    transform: InvoiceSignatureTransform;
  };
  clientSignature: {
    clientUserId: string | null;
    url: string | null;
    transform: InvoiceSignatureTransform;
  };
  bankConfig: InvoiceBankConfig;
  canPromote: boolean;
};

function tabLabel(text: string, count: number) {
  return count > 0 ? `${text} (${count})` : text;
}

export function ClientProjectWorkspace({
  project,
  clientDisplayName,
  clientPhone,
  clientAddress,
  supplierSignature,
  clientSignature,
  bankConfig,
  canPromote,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/clients"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          კლიენტები
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {project.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.clientEmail}
              {clientDisplayName ? ` · ${clientDisplayName}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {clientProjectStatusLabel(project.status)}
              </Badge>
              <Badge variant="outline" className="tabular-nums">
                {project.progressPercent}%
              </Badge>
              {clientPhone ? (
                <span className="text-xs text-muted-foreground">{clientPhone}</span>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <PromoteToPortfolioButton
              projectId={project.id}
              eligible={canPromote}
              portfolioProjectId={project.portfolioProjectId}
            />
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/portal/projects/${project.id}`} />}
            >
              <ExternalLink data-icon="inline-start" />
              პორტალი
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full gap-4">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border bg-transparent p-0"
        >
          <TabsTrigger
            value="general"
            className="rounded-none px-4 py-2.5 data-active:bg-transparent"
          >
            ზოგადი
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="rounded-none px-4 py-2.5 data-active:bg-transparent"
          >
            {tabLabel("ფაილები", project.assets.length)}
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="rounded-none px-4 py-2.5 data-active:bg-transparent"
          >
            {tabLabel("ჩატი", project.messages.length)}
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="rounded-none px-4 py-2.5 data-active:bg-transparent"
          >
            {tabLabel("ინვოისები", project.invoices.length)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0 w-full outline-none">
          <Card className="w-full border-border/80 shadow-sm">
            <CardContent className="pt-5">
              <ClientProjectForm
                mode="edit"
                embedded
                projectId={project.id}
                initial={{
                  title: project.title,
                  status: project.status,
                  progressPercent: project.progressPercent,
                  clientEmail: project.clientEmail,
                  notes: project.notes,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="mt-0 outline-none">
          <Card className="border-border/80 shadow-sm">
            <CardContent className="pt-5">
              <ClientAssetsPanel
                embedded
                projectId={project.id}
                assets={project.assets}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-0 outline-none">
          <Card className="border-border/80 shadow-sm">
            <CardContent className="pt-5">
              <ClientChatPanel
                embedded
                projectId={project.id}
                messages={project.messages}
                clientDisplayName={clientDisplayName}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-0 outline-none">
          <ClientInvoicesPanel
            embedded
            projectId={project.id}
            invoices={project.invoices}
            supplierSignature={supplierSignature}
            clientSignature={clientSignature}
            bankConfig={bankConfig}
            prefill={{
              projectTitle: project.title,
              recipientName: clientDisplayName?.trim() || "",
              recipientPhone: clientPhone?.trim() || "",
              recipientAddress: clientAddress?.trim() || "",
              recipientEmail: project.clientEmail,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
