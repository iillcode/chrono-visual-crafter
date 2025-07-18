import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalDocumentRenderer from "@/components/legal/LegalDocumentRenderer";
import { privacyPolicyData } from "@/data/privacyPolicyData";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout
      metadata={privacyPolicyData.metadata}
      quickSummary={privacyPolicyData.quickSummary}
    >
      <LegalDocumentRenderer
        sections={privacyPolicyData.sections}
        effectiveNotice={privacyPolicyData.effectiveNotice}
      />
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
