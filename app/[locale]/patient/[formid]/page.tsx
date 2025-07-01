"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import HealthAssessment from "./stepper/HealthAssessment";
import MedicalHistoryDetails from "./stepper/MedicalHistoryDetails";
import TestsMedications from "./stepper/TestsMedications";
import BasicSurgicalDetails from "./stepper/BasicSurgicalDetails";
import {
  basicAndSurgicalSchema,
  medicalHistorySchema,
  testsAndMedicationSchema,
  healthAssessmentSchema,
} from "./utils/schemas";
import { toast } from "react-toastify";
import { useAppContext } from "@/app/hooks/useAppContext";
import ConsentDialog from "@/app/components/landing-page/ConsentDialog";
import { useTranslations } from "next-intl";
import QuestionnaireService from "@/app/services/questionnaire";
import { useRouter } from "@/i18n/routing";
import { deductCredits } from "@/app/api/credits/[userId]/utils";
import { useUserStore } from "@/app/store/user.store";
import ConsentSubmitDialog from "./component/ConsentSubmitDialog";

// Types
interface FormErrors {
  [key: string]: any;
}

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  errors: string[];
  currentStep: number;
}

// Error Dialog Component
const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, onClose, errors, currentStep }) => {
  const t = useTranslations("Index");
  
  const getStepName = (step: number) => {
    switch (step) {
      case 0:
        return t("patientInfoHeader") || "Basic Surgical Details";
      case 1:
        return t("medicalHistoryTitle") || "Medical History";
      case 2:
        return t("testMedicationTitle") || "Tests & Medications";
      case 3:
        return t("healthAssesmentTitle") || "Health Assessment";
      default:
        return "Form";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main' }}>
        ⚠️ Please Fix the Following Errors
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Please correct the following issues in <strong>{getStepName(currentStep)}</strong> before proceeding:
        </Typography>
        <List dense>
          {errors.map((error, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText 
                primary={`• ${error}`}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontSize: '0.9rem',
                    color: 'error.main'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          OK, I will Fix These
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Utility function to extract and format error messages
const formatErrorMessages = (errors: FormErrors): string[] => {
  const errorMessages: string[] = [];

  const extractErrors = (obj: any, prefix = ''): void => {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const currentPath = prefix ? `${prefix}.${key}` : key;
      
      if (value?.message) {
        // Format field name for better readability
        const fieldName = currentPath
          .split('.')
          .pop()
          ?.replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .toLowerCase()
          .replace(/^\w/, c => c.toUpperCase()) || 'Field';
        
        errorMessages.push(`${fieldName}: ${value.message}`);
      } else if (typeof value === 'object' && value !== null) {
        extractErrors(value, currentPath);
      }
    });
  };

  extractErrors(errors);
  return errorMessages;
};

// Alternative: Simple toast error messages
const showErrorToasts = (errors: FormErrors): void => {
  const errorMessages = formatErrorMessages(errors);
  
  if (errorMessages.length > 0) {
    // Show a summary toast
    toast.error(`Please fix ${errorMessages.length} error${errorMessages.length > 1 ? 's' : ''} before proceeding`);
    
    // Optionally show individual errors (be careful not to spam)
    if (errorMessages.length <= 3) {
      errorMessages.forEach((message, index) => {
        setTimeout(() => {
          toast.error(message);
        }, index * 500); // Stagger the toasts
      });
    }
  }
};

// Main validation function
const validateCurrentStep = (errors: FormErrors, currentStep: number): boolean => {
  const stepFieldMappings = {
    0: ['patient_information'], // Basic Surgical Details
    1: ['medical_history'], // Medical History
    2: ['test_and_medication'], // Tests & Medications
    3: ['health_assesment', 'images'], // Health Assessment
  };

  const currentStepFields = stepFieldMappings[currentStep as keyof typeof stepFieldMappings] || [];
  
  // Check if there are any errors in the current step's fields
  const hasCurrentStepErrors = currentStepFields.some(field => {
    return errors[field] && Object.keys(errors[field]).length > 0;
  });

  return !hasCurrentStepErrors;
};

const getCurrentSchema = (currentStep: number) => {
  switch (currentStep) {
    case 0:
      return basicAndSurgicalSchema;
    case 1:
      return medicalHistorySchema;
    case 2:
      return testsAndMedicationSchema;
    case 3:
      return healthAssessmentSchema;
    default:
      return z.object({});
  }
};

export default function Form1({ params }: { params: { formid: string } }) {
  const {
    form1: { form1Step: currentStep, setForm1Step },
  } = useAppContext();

  const [showConcentDialog, setShowConcentDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [currentErrors, setCurrentErrors] = useState<string[]>([]);
  const t = useTranslations("Index");
  const [isDown, setIsDown] = useState(true);
  const [formDetails, setFormDetails] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConsentSubmitDialog, setShowConsentSubmitDialog] = useState(false);

  const { userDetails } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
      return "You have unsaved changes. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const checkFormExists = async () => {
      try {
        const patientQuestionnaire =
          await QuestionnaireService.getQuestionnaire(params.formid);
        setFormDetails(patientQuestionnaire.item);

        console.log("hippaContractData : ", patientQuestionnaire);
      } catch (error) {
        console.error("Error checking form existence:", error);
        toast.error("Failed to check form existence");
      }
    };
    checkFormExists();
  }, [params.formid]);

  const getCurrentForm = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return <BasicSurgicalDetails setIsDown={setIsDown} />;
      case 1:
        return <MedicalHistoryDetails setIsDown={setIsDown} />;
      case 2:
        return <TestsMedications setIsDown={setIsDown} />;
      case 3:
        return (
          <HealthAssessment setIsDown={setIsDown} formDetails={formDetails} />
        );
      default:
        return null;
    }
  };

  const currentSchema = useMemo(
    () => getCurrentSchema(currentStep),
    [currentStep]
  );

  const hookForm = useForm({
    resolver: zodResolver(currentSchema),
    reValidateMode: "onChange",
    defaultValues: { patient_information: { gender: "" }, images: [] },
  });

  const formData = hookForm.watch();
  console.log("my data : ", formData);

  const handleNext = () => {
    setForm1Step(currentStep + 1);
  };
  
  const handleBack = () => {
    setForm1Step(currentStep - 1);
  };
  
  const handleDialogOpen = () => {
    setShowConcentDialog(true);
  };

  // Enhanced error handling function
  const handleFormErrors = (errors: FormErrors) => {
    console.log({ error: errors });

    // Method 1: Show Error Dialog (Recommended)
    const errorMessages = formatErrorMessages(errors);
    if (errorMessages.length > 0) {
      setCurrentErrors(errorMessages);
      setShowErrorDialog(true);
      return false;
    }

    // Method 2: Alternative - Show toast errors (uncomment if preferred)
    // showErrorToasts(errors);

    return true;
  };

  const handleSubmitForm = async (data: any) => {
    // Check for validation errors
    const formErrors = hookForm.formState.errors;
    
    if (Object.keys(formErrors).length > 0) {
      const isValid = handleFormErrors(formErrors);
      if (!isValid) {
        return; // Stop submission if there are errors
      }
    }

    // Validate current step specifically
    if (!validateCurrentStep(formErrors, currentStep)) {
      handleFormErrors(formErrors);
      return;
    }

    if (currentStep !== 3) {
      handleNext();
      setIsDown(false);
      return;
    }

    if (formDetails?.consent) {
      return handleDialogOpen();
    }
    
    setShowConsentSubmitDialog(true);
  };

  // Manual validation trigger for button click
  const handleButtonClick = async () => {
    // Trigger validation manually
    const isValid = await hookForm.trigger();
    
    if (!isValid) {
      const errors = hookForm.formState.errors;
      handleFormErrors(errors);
      return;
    }

    // If validation passes, submit the form
    hookForm.handleSubmit(handleSubmitForm)();
  };

  const submitFormData = async () => {
    setIsSubmitting(true);
    try {
      console.log("Data being sent:", formData);
      const response = await QuestionnaireService.generateReport(
        formData,
        params.formid
      );
      console.log(response);
      if (response.isSuccess) {
        toast.success("Your response has been submitted successfully");
        try {
          await deductCredits(userDetails?.email, 1);
        } catch (error) {
          console.error("Error deducting credits:", error);
        }
        router.push(`/patient/${params.formid}/success`);
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error("Error submitting", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...hookForm}>
      <form onSubmit={hookForm.handleSubmit(handleSubmitForm)}>
        <Box sx={{ pt: 1 }}>{getCurrentForm(currentStep)}</Box>

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Button
            size="large"
            variant="outlined"
            color="secondary"
            disabled={currentStep === 0}
            onClick={handleBack}
          >
            {t("back")}
          </Button>
          <Button
            size="large"
            variant="contained"
            onClick={handleButtonClick}
            disabled={isSubmitting || !isDown}
          >
            {currentStep === 3 ? t("submit") : t("next")}
          </Button>
        </Grid>

        {/* Error Dialog */}
        <ErrorDialog
          open={showErrorDialog}
          onClose={() => setShowErrorDialog(false)}
          errors={currentErrors}
          currentStep={currentStep}
        />

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isSubmitting}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <ConsentDialog
          open={showConcentDialog}
          setOpen={setShowConcentDialog}
          onSubmit={() => setShowConsentSubmitDialog(true)}
          setValue={hookForm.setValue}
        />

        <ConsentSubmitDialog
          open={showConsentSubmitDialog}
          onClose={() => setShowConsentSubmitDialog(false)}
          onSubmit={submitFormData}
        />
      </form>
    </FormProvider>
  );
}

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Alert,
//   Backdrop,
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Typography,
// } from "@mui/material";
// import { FormProvider, useForm } from "react-hook-form";
// import { z } from "zod";
// import { useEffect, useMemo, useState } from "react";
// import HealthAssessment from "./stepper/HealthAssessment";
// import MedicalHistoryDetails from "./stepper/MedicalHistoryDetails";
// import TestsMedications from "./stepper/TestsMedications";
// import BasicSurgicalDetails from "./stepper/BasicSurgicalDetails";
// import {
//   basicAndSurgicalSchema,
//   medicalHistorySchema,
//   testsAndMedicationSchema,
//   healthAssessmentSchema,
// } from "./utils/schemas";
// import { toast } from "react-toastify";
// import { useAppContext } from "@/app/hooks/useAppContext";
// import ConsentDialog from "@/app/components/landing-page/ConsentDialog";
// import { useTranslations } from "next-intl";
// import QuestionnaireService from "@/app/services/questionnaire";
// import { useRouter } from "@/i18n/routing";
// import { deductCredits } from "@/app/api/credits/[userId]/utils";
// import { useUserStore } from "@/app/store/user.store";
// import ConsentSubmitDialog from "./component/ConsentSubmitDialog";

// const getCurrentSchema = (currentStep: number) => {
//   switch (currentStep) {
//     case 0:
//       return basicAndSurgicalSchema;
//     case 1:
//       return medicalHistorySchema;
//     case 2:
//       return testsAndMedicationSchema;
//     case 3:
//       return healthAssessmentSchema;
//     default:
//       return z.object({});
//   }
// };

// export default function Form1({ params }: { params: { formid: string } }) {
//   const {
//     form1: { form1Step: currentStep, setForm1Step },
//   } = useAppContext();

//   const [showConcentDialog, setShowConcentDialog] = useState(false);
//   const t = useTranslations("Index");
//   const [isDown, setIsDown] = useState(true);
//   const [formDetails, setFormDetails] = useState<any>();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showConsentSubmitDialog, setShowConsentSubmitDialog] = useState(false);

//   const { userDetails } = useUserStore();
//   const router = useRouter();

//   useEffect(() => {
//     const handleBeforeUnload = (event: BeforeUnloadEvent) => {
//       event.preventDefault();
//       event.returnValue = ""; // Some browsers require a return value for the dialog to appear
//       return "You have unsaved changes. Are you sure you want to leave?";
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   useEffect(() => {
//     const checkFormExists = async () => {
//       try {
//         const patientQuestionnaire =
//           await QuestionnaireService.getQuestionnaire(params.formid);
//         setFormDetails(patientQuestionnaire.item);

//         console.log("hippaContractData : ", patientQuestionnaire);
//       } catch (error) {
//         console.error("Error checking form existence:", error);
//         toast.error("Failed to check form existence");
//       }
//     };
//     checkFormExists();
//   }, [params.formid]);

//   const handleButtonClick = () => {
//     // setIsDown(false);
//     hookForm.handleSubmit(handleSubmitForm)();
//   };

//   const getCurrentForm = (currentStep: number) => {
//     switch (currentStep) {
//       case 0:
//         return <BasicSurgicalDetails setIsDown={setIsDown} />;
//       case 1:
//         return <MedicalHistoryDetails setIsDown={setIsDown} />;
//       case 2:
//         return <TestsMedications setIsDown={setIsDown} />;
//       case 3:
//         return (
//           <HealthAssessment setIsDown={setIsDown} formDetails={formDetails} />
//         );
//       default:
//         return null;
//     }
//   };

//   const currentSchema = useMemo(
//     () => getCurrentSchema(currentStep),
//     [currentStep]
//   );

//   const hookForm = useForm({
//     resolver: zodResolver(currentSchema),
//     reValidateMode: "onChange",
//     defaultValues: { patient_information: { gender: "" }, images: [] },
//   });

//   const formData = hookForm.watch();
//   console.log("my data : ", formData);

//   const handleNext = () => {
//     setForm1Step(currentStep + 1);
//   };
//   const handleBack = () => {
//     setForm1Step(currentStep - 1);
//   };
//   const handleDialogOpen = () => {
//     setShowConcentDialog(true);
//   };
//   console.log({ error: hookForm.formState.errors });
//   const handleSubmitForm = async (data: any) => {
//     if (currentStep !== 3) {
//       handleNext();
//       setIsDown(false);

//       return;
//     }
//     if (formDetails?.consent) {
//       return handleDialogOpen();
//     }
//     setShowConsentSubmitDialog(true);
//   };

//   const submitFormData = async () => {
//     setIsSubmitting(true);
//     try {
//       console.log("Data being sent:", formData);
//       const response = await QuestionnaireService.generateReport(
//         formData,
//         params.formid
//       );
//       console.log(response);
//       if (response.isSuccess) {
//         toast.success("Your response has been submitted successfully");
//         try {
//           await deductCredits(userDetails?.email, 1);
//         } catch (error) {
//           console.error("Error deducting credits:", error);
//         }
//         router.push(`/patient/${params.formid}/success`);
//       } else {
//         toast.error(response.message || "Something went wrong");
//       }
//     } catch (err) {
//       toast.error("Something went wrong!");
//       console.error("Error submitting", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <FormProvider {...hookForm}>
//       <form onSubmit={hookForm.handleSubmit(handleSubmitForm)}>
//         <Box sx={{ pt: 1 }}>{getCurrentForm(currentStep)}</Box>

//         <Grid
//           item
//           xs={12}
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginTop: 4,
//           }}
//         >
//           <Button
//             size="large"
//             variant="outlined"
//             color="secondary"
//             disabled={currentStep === 0}
//             onClick={handleBack}
//           >
//             {t("back")}
//           </Button>
//           <Button
//             size="large"
//             type="submit"
//             variant="contained"
//             onClick={handleButtonClick}
//             disabled={isSubmitting || !isDown}
//           >
//             {currentStep === 3 ? t("submit") : t("next")}
//           </Button>
//         </Grid>

//         <Backdrop
//           sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//           open={isSubmitting}
//         >
//           <CircularProgress color="inherit" />
//         </Backdrop>

//         <ConsentDialog
//           open={showConcentDialog}
//           setOpen={setShowConcentDialog}
//           onSubmit={() => setShowConsentSubmitDialog(true)}
//           setValue={hookForm.setValue}
//         />

//         <ConsentSubmitDialog
//           open={showConsentSubmitDialog}
//           onClose={() => setShowConsentSubmitDialog(false)}
//           onSubmit={submitFormData}
//         />
//       </form>
//     </FormProvider>
//   );
// }
