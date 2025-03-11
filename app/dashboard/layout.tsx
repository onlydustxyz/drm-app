"use client";

import { CrmLayout } from "@/components/layout/crm-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CrmLayout>{children}</CrmLayout>;
} 