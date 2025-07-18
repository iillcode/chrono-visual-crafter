import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Shield, FileText } from "lucide-react";
import { Footer } from "@/components/ui/footer-section";

interface Metadata {
  title: string;
  subtitle: string;
  lastUpdated: string;
  icon: string;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
}

interface QuickSummary {
  title: string;
  content: string;
}

interface LegalPageLayoutProps {
  metadata: Metadata;
  quickSummary?: QuickSummary;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  metadata,
  quickSummary,
  children,
}) => {
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return Shield;
      case "FileText":
        return FileText;
      default:
        return Shield;
    }
  };

  const IconComponent = getIcon(metadata.icon);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="w-4 h-4" />
              Last updated: {metadata.lastUpdated}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <IconComponent
                className={
                  metadata.icon === "Shield"
                    ? "w-4 h-4 text-blue-400"
                    : "w-4 h-4 text-green-400"
                }
              />
              <span className="text-sm text-white/80">Legal Document</span>
            </div>
            <h1
              className={
                metadata.icon === "Shield"
                  ? "text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white"
                  : "text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-white"
              }
            >
              {metadata.title}
            </h1>
            <p className="text-xl text-white/60">{metadata.subtitle}</p>
          </div>

          {/* Quick Summary */}
          {quickSummary && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-3 text-white">
                {quickSummary.title}
              </h2>
              <p className="text-white/80 leading-relaxed">
                {quickSummary.content}
              </p>
            </div>
          )}

          {/* Content */}
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10">
        <Footer />
      </div>
    </div>
  );
};

export default LegalPageLayout;
