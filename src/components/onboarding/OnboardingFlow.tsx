import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import VerificationSetup from "./VerificationSetup";
import OrganizationDetails from "./OrganizationDetails";
import ComplianceDueDiligence from "./ComplianceDueDiligence";
import WalletSetup from "./WalletSetup";
import FinalReview from "./FinalReview";
import DocumentManagement from "./DocumentManagement";
import { useOnboarding } from "./OnboardingContext";

const OnboardingFlow = () => {
  const { entityId, entityType, currentStep, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  const { step } = useParams<{ step: string }>();

  // Handle step navigation
  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep <= 6) {
      setCurrentStep(nextStep);
      navigate(`/onboarding/${nextStep}`);
    }
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= 1) {
      setCurrentStep(prevStep);
      navigate(`/onboarding/${prevStep}`);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding/registration" />} />
      <Route path="/registration" element={<RegistrationForm />} />
      <Route path="/verification" element={<VerificationSetup />} />
      <Route path="/organization" element={<OrganizationDetails />} />
      <Route path="/compliance" element={<ComplianceDueDiligence />} />
      <Route
        path="/documents"
        element={
          entityId ? (
            <DocumentManagement entityId={entityId} entityType={entityType} />
          ) : (
            <Navigate to="/onboarding/registration" />
          )
        }
      />
      <Route path="/wallet-setup" element={<WalletSetup />} />
      <Route path="/review" element={<FinalReview />} />
      <Route path="/:step" element={<StepRouter />} />
    </Routes>
  );
};

// Helper component to route to the correct step based on the step parameter
const StepRouter = () => {
  const { step } = useParams<{ step: string }>();
  const stepNumber = parseInt(step || "1", 10);

  switch (stepNumber) {
    case 1:
      return <Navigate to="/onboarding/registration" replace />;
    case 2:
      return <Navigate to="/onboarding/organization" replace />;
    case 3:
      return <Navigate to="/onboarding/compliance" replace />;
    case 4:
      return <Navigate to="/onboarding/documents" replace />;
    case 5:
      return <Navigate to="/onboarding/wallet-setup" replace />;
    case 6:
      return <Navigate to="/onboarding/review" replace />;
    default:
      return <Navigate to="/onboarding/registration" replace />;
  }
};

export default OnboardingFlow;
