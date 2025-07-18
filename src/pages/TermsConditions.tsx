import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalDocumentRenderer from "@/components/legal/LegalDocumentRenderer";
import { termsConditionsData } from "@/data/termsConditionsData";

const TermsConditions = () => {
  return (
    <LegalPageLayout
      metadata={termsConditionsData.metadata}
      quickSummary={termsConditionsData.agreementOverview}
    >
      <LegalDocumentRenderer
        sections={termsConditionsData.sections}
        effectiveNotice={termsConditionsData.effectiveNotice}
      />
    </LegalPageLayout>
  );
};

export default TermsConditions;
