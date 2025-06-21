// app/(admin)/layout.jsx
"use client";
import Dashboard from "@/components/Dashboard";
import { useRouter, useParams } from "next/navigation";
export default function AdminLayout({ children }) {
  const { id } = useParams();

  return <Dashboard id={id}>{children}</Dashboard>;
}
