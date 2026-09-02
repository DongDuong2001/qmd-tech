import React from "react";
import { Link } from "@/i18n/routing";
import { CustomPcBuilder } from "@/components/builder/CustomPcBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface SavedBuildPageProps {
  params: Promise<{ buildId: string; locale: string }>;
}

export default async function SavedBuildPage({ params }: SavedBuildPageProps) {
  const { buildId } = await params;

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex items-center justify-between rounded-xl border border-[#3B82F6]/40 bg-[#3B82F6]/10 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#3B82F6]" />
            <div>
              <div className="text-xs font-semibold text-[#3B82F6] uppercase">
                Cấu hình PC được chia sẻ
              </div>
              <div className="text-sm font-bold text-[#F2F4F8]">
                Mã cấu hình: <span className="font-mono text-[#FACC15]">{buildId}</span>
              </div>
            </div>
          </div>
          <Link href="/build-pc">
            <Button variant="secondary" size="sm" className="gap-1 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              Tạo cấu hình mới
            </Button>
          </Link>
        </div>
      </div>

      <CustomPcBuilder />
    </div>
  );
}
