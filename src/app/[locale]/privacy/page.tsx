import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PrivacyContent } from "@/components/sections/privacy-content";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
