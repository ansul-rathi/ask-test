/* eslint-disable react/display-name */
import {
  Grid,
  TextField,
  FormControl,
  Typography,
  Card,
  MenuItem,
} from "@mui/material";
import React, { forwardRef, useRef, useEffect, useMemo, useCallback } from "react";
import { FormBoxWrapper } from "../component/CustomFormWrapper";
import Heading from "@/app/components/Heading";
import { useFormContext, Controller } from "react-hook-form";
import TableFormField from "@/app/components/form/FormTable";
import AllergyFormField from "@/app/components/form/AllergyTable";
import FormCheck from "@/app/components/form/FormCheck";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

// Type definitions
interface CustomInputProps {
  [key: string]: any;
}

interface MedicalHistoryDetailsProps {
  setIsDown: (value: boolean) => void;
}

interface OptimizedSelectFieldProps {
  name: string;
  label?: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  defaultValue?: string;
  [key: string]: any;
}

interface OptimizedTextFieldProps {
  name: string;
  label: string;
  fullWidth?: boolean;
  [key: string]: any;
}

interface CheckboxItem {
  label: string;
  key: string;
  children?: Array<{
    label: string;
    key: string;
  }>;
}

interface DentalItem {
  key: string;
  label: string;
}

interface BleedingItem {
  label: string;
  key: string;
}

interface AnesthesiaItem {
  label: string;
  key: string;
  children?: Array<{
    label: string;
    key: string;
  }>;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (props, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} autoComplete="off" />;
  }
);
CustomInput.displayName = "CustomInput";

// Optimized Select Field Component
const OptimizedSelectField: React.FC<OptimizedSelectFieldProps> = React.memo(({
  name,
  label,
  options,
  required = false,
  defaultValue,
  ...props
}) => {
  const { register, watch, formState: { errors } } = useFormContext<any>();
  const fieldValue = watch(name);

  const fieldError = useMemo(() => {
    const pathArray = name.split('.');
    let error: any = errors;
    for (const path of pathArray) {
      error = error?.[path];
    }
    return error;
  }, [errors, name]);

  return (
    <FormControl fullWidth>
      <TextField
        {...register(name)}
        select
        required={required}
        label={label}
        value={fieldValue || defaultValue || ""}
        error={!!fieldError}
        helperText={fieldError?.message || ''}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
});

// Optimized Text Field Component
const OptimizedTextField: React.FC<OptimizedTextFieldProps> = React.memo(({
  name,
  label,
  fullWidth = true,
  ...props
}) => {
  const { register, formState: { errors } } = useFormContext<any>();

  const fieldError = useMemo(() => {
    const pathArray = name.split('.');
    let error: any = errors;
    for (const path of pathArray) {
      error = error?.[path];
    }
    return error;
  }, [errors, name]);

  return (
    <TextField
      {...register(name)}
      fullWidth={fullWidth}
      label={label}
      error={!!fieldError}
      helperText={fieldError?.message || ''}
      {...props}
    />
  );
});

// Gender and Age Section Component
const GenderAgeSection: React.FC<{ t: (key: string) => string }> = React.memo(({ t }) => {
  const { watch } = useFormContext<any>();
  
  // Watch specific fields instead of entire form
  const patientGender = watch("patient_information.gender");
  const patientDob = watch("patient_information.dob");
  const hysterectomy = watch("medical_history.hysterectomy");

  // Memoize age calculation
  const patientAge = useMemo(() => {
    if (!patientDob) return 0;
    return new Date().getFullYear() - new Date(patientDob).getFullYear();
  }, [patientDob]);

  // Memoize yes/no options
  const yesNoOptions = useMemo(() => [
    { value: "yes", label: t("yes") },
    { value: "no", label: t("no") }
  ], [t]);

  const shouldShowFemaleQuestions = patientGender === "female" && patientAge > 10;

  if (!shouldShowFemaleQuestions) return null;

  return (
    <>
      {/* Hysterectomy Question */}
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Typography>{t("medicalHistoryHysterectomy")}</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <OptimizedSelectField
            name="medical_history.hysterectomy"
            options={yesNoOptions}
            required
          />
        </Grid>
      </Grid>

      {/* Menstrual Question - only if hysterectomy is "no" */}
      {hysterectomy === "no" && (
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12}>
            <Typography>{t("medicalHistoryMenstrual")}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <OptimizedSelectField
              name="medical_history.menstrual"
              options={yesNoOptions}
              required
            />
          </Grid>
        </Grid>
      )}
    </>
  );
});

// Metal Implant Section Component
const MetalImplantSection: React.FC<{ t: (key: string) => string }> = React.memo(({ t }) => {
  const { control, watch } = useFormContext<any>();
  const metalImplant = watch("medical_history.metal_implant");

  // Memoize yes/no options
  const yesNoOptions = useMemo(() => [
    { value: "yes", label: t("yes") },
    { value: "no", label: t("no") }
  ], [t]);

  return (
    <Grid container item xs={12} spacing={2} direction="row">
      <Grid item xs={12}>
        {t("medicalHistoryMetalImplant")}
      </Grid>
      <Grid item xs={12} sm={3}>
        <OptimizedSelectField
          name="medical_history.metal_implant"
          options={yesNoOptions}
          defaultValue="no"
        />
      </Grid>

      {metalImplant === "yes" && (
        <>
          <Grid item xs={12} sm={6}>
            <OptimizedTextField
              name="medical_history.metal_implant_site"
              label={t("medicalHistoryMetalImplantSite")}
            />
          </Grid>
          <Grid item xs={12}>
            <FormCheck
              name="medical_history.nerve_stimulator"
              control={control}
              label={t("MedicalHistoryNerveStimulator")}
              error={undefined}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
});

// Surgery Table Section Component
const SurgeryTableSection: React.FC<{ t: (key: string) => string }> = React.memo(({ t }) => {
  const tableColumns = useMemo(() => [
    {
      title: t("medicalHistorySurgeryOrProcedure"),
      key: "surgeryOrProcedure",
    },
    { 
      key: "date", 
      title: t("medicalHistoryDate") 
    },
  ], [t]);

  return (
    <Grid item xs={12}>
      <Card>
        <Typography
          fontSize={16}
          fontWeight={800}
          color="primary"
          sx={{ p: 2 }}
        >
          {t("medicalHistorySurgeriesTitle")}
        </Typography>
        <TableFormField
          formName="medical_history"
          name="surgery_or_procedure"
          columns={tableColumns}
          sx={{ p: 0 }}
        />
      </Card>
    </Grid>
  );
});

// Allergy Table Section Component
const AllergyTableSection: React.FC<{ t: (key: string) => string }> = React.memo(({ t }) => {
  const allergyColumns = useMemo(() => [
    {
      title: t("medicalHistoryAllergiesMedications"),
      key: "allergies",
    },
  ], [t]);

  return (
    <Grid item xs={12}>
      <Card>
        <Typography
          fontSize={16}
          fontWeight={800}
          color="primary"
          sx={{ p: 2, mb: 2 }}
        >
          {t("medicalHistoryAllergiesTitle")}
        </Typography>
        <AllergyFormField
          name="medical_history.allergies"
          columns={allergyColumns}
          sx={{ p: 0 }}
        />
      </Card>
    </Grid>
  );
});

// Family Problems Section Component
const FamilyProblemsSection: React.FC<{ t: (key: string) => string }> = React.memo(({ t }) => {
  const { control, formState: { errors } } = useFormContext<any>();

  const bleedingProblems: BleedingItem[] = useMemo(() => [
    {
      label: t("medicalHistoryNoseBleeds"),
      key: "nose_bleed",
    },
    {
      label: t("medicalHistoryToothExtractions"),
      key: "bleeding_with_tooth_extractions",
    },
    {
      label: t("medicalHistorySurgeryBleeding"),
      key: "bleeding_after_surgery",
    },
  ], [t]);

  return (
    <>
      <Grid item xs={12} sx={{ mt: -1 }}>
        <Typography
          fontSize={16}
          fontWeight={800}
          color="primary"
          sx={{ p: 0 }}
        >
          {t("medicalHistoryFamilyProblems")}
        </Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        {bleedingProblems.map((item, index) => (
          <Grid
            key={index}
            item
            xs={12}
            mb={2}
            sx={{
              display: { xs: "grid", md: "flex" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormCheck
              name={`medical_history.${item.key}`}
              control={control}
              label={item.label}
              error={errors[item.key]}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
});

// Anesthesia Problems Section Component
const AnesthesiaProblemsSection: React.FC<{ t: (key: string) => string }> = React.memo(({ t }) => {
  const { control, watch, formState: { errors } } = useFormContext<any>();
  const awarenessUnderAnesthesia = watch("medical_history.awareness_under_anesthesia.awareness_under_anesthesia");

  const anesthesiaProblems: AnesthesiaItem[] = useMemo(() => [
    {
      label: t("MedicalHistoryAwarenessUnderAnesthesia"),
      key: "awareness_under_anesthesia",
      children: [
        {
          label: t("MedicalHistoryWasItDuringEndoScopy"),
          key: "was_it_during_endoscopy",
        },
        {
          label: t("MedicalHistoryDentalProcedure"),
          key: "was_it_during_dental_procedure",
        },
      ],
    },
    {
      label: t("medicalHistoryNauseaVomiting"),
      key: "sever_nausea_vomiting",
    },
    {
      label: t("medicalHistoryHyperthermia"),
      key: "malignant_hyperthermia",
    },
    {
      label: t("medicalHistoryBreathingIssues"),
      key: "breathing_difficulties",
    },
    {
      label: t("medicalHistoryBreathingTubeIssues"),
      key: "placement_of_breathing_tube",
    },
    {
      label: t("medicalHistoryPseudocholinesteraseDeficiency"),
      key: "pseudocholinesterase_deficiency",
    },
    {
      label: t("medicalHistoryMotionSickness"),
      key: "motion_sickness",
    },
  ], [t]);

  return (
    <>
      <Grid item xs={12} sx={{ mt: -1 }}>
        <Typography
          fontSize={16}
          fontWeight={800}
          color="primary"
          sx={{ p: 0 }}
        >
          {t("medicalHistoryAnesthesiaProblems")}
        </Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        {anesthesiaProblems.map((item, index) => (
          <React.Fragment key={index}>
            <Grid
              item
              xs={12}
              mb={2}
              sx={{
                display: { xs: "grid", md: "flex" },
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FormCheck
                name={
                  item.children
                    ? `medical_history.${item.key}.${item.key}`
                    : `medical_history.${item.key}`
                }
                control={control}
                label={item.label}
                error={errors[item.key]}
              />
            </Grid>

            {item.children && awarenessUnderAnesthesia && 
              item.children.map((child) => (
                <Grid
                  key={child.key}
                  item
                  xs={12}
                  mb={1}
                  ml={2}
                  sx={{
                    display: { xs: "grid" },
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormCheck
                    name={`medical_history.awareness_under_anesthesia.${child.key}`}
                    control={control}
                    label={child.label}
                    error={errors[child.key]}
                  />
                </Grid>
              ))
            }
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
});

// Current Issues Section Component
const CurrentIssuesSection: React.FC<{ t: (key: string) => string }> = React.memo(({ t }) => {
  const { control, watch, formState: { errors } } = useFormContext<any>();
  const dentalDamageImplants = watch("medical_history.dental_damage_implants");

  const dentalItems: DentalItem[] = useMemo(() => [
    {
      key: "chipped_teeth",
      label: t("medicalHistoryDentalChippedTeeth"),
    },
    {
      key: "loose_teeth",
      label: t("medicalHistoryDentalLooseTeeth"),
    },
    {
      key: "upper_denture",
      label: t("medicalHistoryDentalUpperDenture"),
    },
    {
      key: "lower_denture",
      label: t("medicalHistoryDentalLowerDenture"),
    },
    {
      key: "upper_partials",
      label: t("medicalHistoryDentalUpperPartials"),
    },
    {
      key: "lower_partials",
      label: t("medicalHistoryDentalLowerPartials"),
    },
    {
      key: "dental_implant_veneer",
      label: t("medicalHistoryDentalImplantVeneer"),
    },
    {
      key: "retainer",
      label: t("medicalHistoryDentalRetainer"),
    },
    {
      key: "braces",
      label: t("medicalHistoryDentalBraces"),
    },
  ], [t]);

  return (
    <>
      <Grid item xs={12} sx={{ mt: -1 }}>
        <Typography
          fontSize={16}
          fontWeight={800}
          color="primary"
          sx={{ p: 0 }}
        >
          {t("medicalHistoryCurrentIssues")}
        </Typography>
      </Grid>

      {/* Dental damage/implants checkbox */}
      <Grid
        item
        xs={12}
        mb={2}
        sx={{
          display: { xs: "grid", md: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormCheck
          name="medical_history.dental_damage_implants"
          control={control}
          label={t("medicalHistoryLooseTeeth")}
          error={errors["dental_damage_implants"]}
        />
      </Grid>

      {/* Dental sub-options */}
      {dentalDamageImplants && (
        <Grid container pl={4} xs={12} md={12}>
          {dentalItems.map((item, index) => (
            <Grid
              key={index}
              item
              xs={6}
              md={4}
              mb={2}
              sx={{
                display: { xs: "grid", md: "flex" },
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FormCheck
                name={`medical_history.dental_damage_implants.${item.key}`}
                control={control}
                label={item.label}
                error={errors[item.key]}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Mouth opening problems */}
      <Grid
        item
        xs={12}
        mb={2}
        sx={{
          display: { xs: "grid", md: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormCheck
          name="medical_history.problems_opening_mouth"
          control={control}
          label={t("medicalHistoryMouthOpening")}
          error={errors["problems_opening_mouth"]}
        />
      </Grid>

      {/* Neck movement problems */}
      <Grid
        item
        xs={12}
        mb={2}
        sx={{
          display: { xs: "grid", md: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormCheck
          name="medical_history.problems_moving_neck"
          control={control}
          label={t("medicalHistoryNeckMovement")}
          error={errors["problems_moving_neck"]}
        />
      </Grid>
    </>
  );
});

// Main Component
const MedicalHistoryDetails: React.FC<MedicalHistoryDetailsProps> = ({ setIsDown }) => {
  const t = useTranslations("Index");
  const formBoxRef = useRef<HTMLDivElement>(null);
  
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
  });

  // Memoized scroll handler to prevent recreation on every render
  const handleScroll = useCallback(() => {
    if (formBoxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = formBoxRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log("down");
        setIsDown(true);
      }
    }
  }, [setIsDown]);

  // Scroll event listener setup
  useEffect(() => {
    const formBox = formBoxRef.current;
    if (formBox) {
      formBox.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (formBox) {
        formBox.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // In-view detection
  useEffect(() => {
    if (inView) {
      setIsDown(true);
    }
  }, [inView, setIsDown]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormBoxWrapper
          sx={{ height: "75vh", overflowY: "auto" }}
          ref={formBoxRef}
        >
          <Grid container spacing={4} mb={4}>
            <Grid item xs={12}>
              <Heading label={t("medicalHistoryTitle")} />
            </Grid>

            {/* Gender and Age Specific Questions */}
            <GenderAgeSection t={t} />

            {/* Metal Implant Section */}
            <MetalImplantSection t={t} />

            {/* Surgery Table */}
            <SurgeryTableSection t={t} />

            {/* Allergy Table */}
            <AllergyTableSection t={t} />

            {/* Family History Card */}
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: 800, fontSize: "28px" }}>
                      {t("medicalHistoryFamilyTitle")}
                    </Typography>
                  </Grid>

                  {/* Family Problems */}
                  <FamilyProblemsSection t={t} />

                  {/* Anesthesia Problems */}
                  <AnesthesiaProblemsSection t={t} />

                  {/* In-view reference for scroll detection */}
                  <div ref={inViewRef} />

                  {/* Current Issues */}
                  <CurrentIssuesSection t={t} />
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </FormBoxWrapper>
      </Grid>
    </Grid>
  );
};

export default MedicalHistoryDetails;

// import {
//   Grid,
//   TextField,
//   FormControl,
//   Typography,
//   Card,
//   MenuItem,
// } from "@mui/material";
// import React, { forwardRef, useRef, useEffect } from "react";
// import { FormBoxWrapper } from "../component/CustomFormWrapper";
// import Heading from "@/app/components/Heading";
// import { useFormContext } from "react-hook-form";
// import TableFormField from "@/app/components/form/FormTable";
// import AllergyFormField from "@/app/components/form/AllergyTable";
// import FormCheck from "@/app/components/form/FormCheck";
// import { useTranslations } from "next-intl";
// import { useInView } from "react-intersection-observer";

// interface CustomInputProps {
//   [key: string]: any;
// }

// const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
//   (props, ref) => {
//     return <TextField fullWidth {...props} inputRef={ref} autoComplete="off" />;
//   }
// );
// CustomInput.displayName = "CustomInput";

// interface MedicalHistoryDetailsProps {
//   setIsDown: (value: boolean) => void;
// }

// const MedicalHistoryDetails: React.FC<MedicalHistoryDetailsProps> = ({
//   setIsDown,
// }) => {
//   const {
//     watch,
//     register,
//     setValue,
//     control,
//     formState: { errors },
//   } = useFormContext();

//   const values = watch();
//   const t = useTranslations("Index");
//   const formBoxRef = useRef<HTMLDivElement>(null);
//   const { ref: inViewRef, inView } = useInView({
//     threshold: 0,
//   });

//   const handleDateChange = (date: Date | null) => {
//     setValue("medical_history.menstrual_date", date?.toISOString());
//   };

//   const handleScroll = () => {
//     if (formBoxRef.current) {
//       const { scrollTop, scrollHeight, clientHeight } = formBoxRef.current;
//       if (scrollTop + clientHeight >= scrollHeight) {
//         console.log("down");
//         setIsDown(true);
//       }
//     }
//   };

//   useEffect(() => {
//     const formBox = formBoxRef.current;
//     if (formBox) {
//       formBox.addEventListener("scroll", handleScroll);
//     }

//     return () => {
//       if (formBox) {
//         formBox.removeEventListener("scroll", handleScroll);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (inView) {
//       setIsDown(true);
//     }
//   }, [inView]);

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <FormBoxWrapper
//           sx={{ height: "75vh", overflowY: "auto" }}
//           ref={formBoxRef}
//         >
//           <Grid container spacing={4} mb={4}>
//             <Grid item xs={12}>
//               <Heading label={t("medicalHistoryTitle")} />
//             </Grid>

//             {values?.patient_information?.gender === "female" &&
//               values?.patient_information?.dob &&
//               new Date().getFullYear() - new Date(values.patient_information.dob).getFullYear() > 10 && (
//               <Grid container item xs={12} spacing={2}>
//               <Grid item xs={12}>
//                 <Typography>{t("medicalHistoryHysterectomy")}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <FormControl fullWidth>
//                 <TextField
//                   select
//                   required
//                   value={values["hysterectomy"]}
//                   {...register("medical_history.hysterectomy")}
//                 >
//                   <MenuItem value="yes">{t("yes")}</MenuItem>
//                   <MenuItem value="no">{t("no")}</MenuItem>
//                 </TextField>
//                 </FormControl>
//               </Grid>
//               </Grid>
//             )}

//             {values?.medical_history?.hysterectomy === "no" && (
//               <Grid container item xs={12} spacing={2}>
//                 <Grid item xs={12}>
//                   <Typography>{t("medicalHistoryMenstrual")}</Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={3}>
//                   <FormControl fullWidth>
//                     <TextField
//                       select
//                       required
//                       value={values["menstrual"]}
//                       {...register("medical_history.menstrual")}
//                     >
//                       <MenuItem value="yes">{t("yes")}</MenuItem>
//                       <MenuItem value="no">{t("no")}</MenuItem>
//                     </TextField>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             )}

//             <Grid container item xs={12} spacing={2} direction={"row"}>
//               <Grid item xs={12}>
//                 {t("medicalHistoryMetalImplant")}
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <FormControl fullWidth>
//                   <TextField
//                     select
//                     value={values["metal_implant"]}
//                     {...register("medical_history.metal_implant")}
//                     defaultValue={"no"}
//                   >
//                     <MenuItem value="yes">{t("yes")}</MenuItem>
//                     <MenuItem value="no">{t("no")}</MenuItem>
//                   </TextField>
//                 </FormControl>
//               </Grid>

//               {values?.medical_history?.metal_implant === "yes" && (
//                 <>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label={t("medicalHistoryMetalImplantSite")}
//                       {...register("medical_history.metal_implant_site")}
//                     />
//                   </Grid>
//                   <Grid item xs={12} >
//                     <FormCheck
//                       name="medical_history.nerve_stimulator"
//                       control={control}
//                       label={t("MedicalHistoryNerveStimulator")}
//                       error={errors["nerve_stimulator"]}
//                     />
//                   </Grid>
//                 </>
//               )}
//             </Grid>

//             <Grid item xs={12}>
//               <Card>
//                 <Typography
//                   fontSize={16}
//                   fontWeight={800}
//                   color={"primary"}
//                   sx={{ p: 2 }}
//                 >
//                   {t("medicalHistorySurgeriesTitle")}
//                 </Typography>
//                 <TableFormField
//                   formName="medical_history"
//                   name="surgery_or_procedure"
//                   columns={[
//                     {
//                       title: t("medicalHistorySurgeryOrProcedure"),
//                       key: "surgeryOrProcedure",
//                     },
//                     { key: "date", title: t("medicalHistoryDate") },
//                   ]}
//                   sx={{ p: 0 }}
//                 />
//               </Card>
//             </Grid>

//             <Grid item xs={12}>
//               <Card>
//                 <Typography
//                   fontSize={16}
//                   fontWeight={800}
//                   color={"primary"}
//                   sx={{ p: 2, mb: 2 }}
//                 >
//                   {t("medicalHistoryAllergiesTitle")}
//                 </Typography>
//                 <AllergyFormField
//                   name="medical_history.allergies"
//                   columns={[
//                     {
//                       title: t("medicalHistoryAllergiesMedications"),
//                       key: "allergies",
//                     },
//                   ]}
//                   sx={{ p: 0 }}
//                 />
//               </Card>
//             </Grid>

//             <Grid item xs={12}>
//               <Card sx={{ p: 2 }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12}>
//                     <Typography sx={{ fontWeight: 800, fontSize: "28px" }}>
//                       {t("medicalHistoryFamilyTitle")}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sx={{ mt: -1 }}>
//                     <Typography
//                       fontSize={16}
//                       fontWeight={800}
//                       color={"primary"}
//                       sx={{ p: 0 }}
//                     >
//                       {t("medicalHistoryFamilyProblems")}
//                     </Typography>
//                   </Grid>

//                   <Grid item xs={12} md={12}>
//                     {[
//                       {
//                         label: t("medicalHistoryNoseBleeds"),
//                         key: "nose_bleed",
//                       },
//                       {
//                         label: t("medicalHistoryToothExtractions"),
//                         key: "bleeding_with_tooth_extractions",
//                       },
//                       {
//                         label: t("medicalHistorySurgeryBleeding"),
//                         key: "bleeding_after_surgery",
//                       },
//                     ].map((item, index) => (
//                       <Grid
//                         key={index}
//                         item
//                         xs={12}
//                         mb={2}
//                         sx={{
//                           display: { xs: "grid", md: "flex" },
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <FormCheck
//                           name={`medical_history.${item.key}`}
//                           control={control}
//                           label={item.label}
//                           error={errors[item.key]}
//                         />
//                       </Grid>
//                     ))}
//                   </Grid>

//                   <Grid item xs={12} sx={{ mt: -1 }}>
//                     <Typography
//                       fontSize={16}
//                       fontWeight={800}
//                       color={"primary"}
//                       sx={{ p: 0 }}
//                     >
//                       {t("medicalHistoryAnesthesiaProblems")}
//                     </Typography>
//                   </Grid>

//                   <Grid item xs={12} md={12}>
//                     {[
//                       {
//                         label: t("MedicalHistoryAwarenessUnderAnesthesia"),
//                         key: "awareness_under_anesthesia",
//                         children: [
//                           {
//                             label: t("MedicalHistoryWasItDuringEndoScopy"),
//                             key: "was_it_during_endoscopy",
//                           },
//                           {
//                             label: t("MedicalHistoryDentalProcedure"),
//                             key: "was_it_during_dental_procedure",
//                           },
//                         ],
//                       },
//                       {
//                         label: t("medicalHistoryNauseaVomiting"),
//                         key: "sever_nausea_vomiting",
//                       },
//                       {
//                         label: t("medicalHistoryHyperthermia"),
//                         key: "malignant_hyperthermia",
//                       },
//                       {
//                         label: t("medicalHistoryBreathingIssues"),
//                         key: "breathing_difficulties",
//                       },
//                       {
//                         label: t("medicalHistoryBreathingTubeIssues"),
//                         key: "placement_of_breathing_tube",
//                       },
//                       {
//                         label: t(
//                           "medicalHistoryPseudocholinesteraseDeficiency"
//                         ),
//                         key: "pseudocholinesterase_deficiency",
//                       },
//                       {
//                         label: t("medicalHistoryMotionSickness"),
//                         key: "motion_sickness",
//                       },
//                     ].map((item, index) => (
//                       <>
//                         <Grid
//                           key={index}
//                           item
//                           xs={12}
//                           mb={2}
//                           sx={{
//                             display: { xs: "grid", md: "flex" },
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FormCheck
//                             name={item.children ? `medical_history.${item.key}.${item.key}`: `medical_history.${item.key}`}
//                             control={control}
//                             label={item.label}
//                             error={errors[item.key]}
//                           />
//                         </Grid>
//                         {item.children &&
//                           values?.medical_history?.[item.key]?.[item.key] &&
//                           item.children.map((child, index) => (
//                             <Grid
//                               key={child.key}
//                               item
//                               xs={12}
//                               mb={1}
//                               ml={2}
//                               sx={{
//                                 display: { xs: "grid" },
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                               }}
//                             >
//                               <FormCheck
//                                 name={`medical_history.awareness_under_anesthesia.${child.key}`}
//                                 control={control}
//                                 label={child.label}
//                                 error={errors[child.key]}
//                               />
//                             </Grid>
//                           ))}
//                       </>
//                     ))}
//                   </Grid>

//                   <Grid item xs={12} sx={{ mt: -1 }}>
//                     <Typography
//                       fontSize={16}
//                       fontWeight={800}
//                       color={"primary"}
//                       sx={{ p: 0 }}
//                     >
//                       {t("medicalHistoryCurrentIssues")}
//                     </Typography>
//                   </Grid>

//                   <div ref={inViewRef} />

//                   <Grid
//                     item
//                     xs={12}
//                     mb={2}
//                     sx={{
//                       display: { xs: "grid", md: "flex" },
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <FormCheck
//                       name={`medical_history.dental_damage_implants`}
//                       control={control}
//                       label={t("medicalHistoryLooseTeeth")}
//                       error={errors["dental_damage_implants"]}
//                     />
//                   </Grid>

//                   {values?.medical_history?.dental_damage_implants && (
//                     <Grid container pl={4} xs={12} md={12}>
//                       {[
//                         {
//                           key: "chipped_teeth",
//                           label: t("medicalHistoryDentalChippedTeeth"),
//                         },
//                         {
//                           key: "loose_teeth",
//                           label: t("medicalHistoryDentalLooseTeeth"),
//                         },
//                         {
//                           key: "upper_denture",
//                           label: t("medicalHistoryDentalUpperDenture"),
//                         },
//                         {
//                           key: "lower_denture",
//                           label: t("medicalHistoryDentalLowerDenture"),
//                         },
//                         {
//                           key: "upper_partials",
//                           label: t("medicalHistoryDentalUpperPartials"),
//                         },
//                         {
//                           key: "lower_partials",
//                           label: t("medicalHistoryDentalLowerPartials"),
//                         },
//                         {
//                           key: "dental_implant_veneer",
//                           label: t("medicalHistoryDentalImplantVeneer"),
//                         },
//                         {
//                           key: "retainer",
//                           label: t("medicalHistoryDentalRetainer"),
//                         },
//                         {
//                           key: "braces",
//                           label: t("medicalHistoryDentalBraces"),
//                         },
//                       ].map((item, index) => (
//                         <Grid
//                           key={index}
//                           item
//                           xs={6}
//                           md={4}
//                           mb={2}
//                           sx={{
//                             display: { xs: "grid", md: "flex" },
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FormCheck
//                             name={`medical_history.dental_damage_implants.${item.key}`}
//                             control={control}
//                             label={item.label}
//                             error={errors[item.key]}
//                           />
//                         </Grid>
//                       ))}
//                     </Grid>
//                   )}
//                   <Grid
//                     item
//                     xs={12}
//                     mb={2}
//                     sx={{
//                       display: { xs: "grid", md: "flex" },
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <FormCheck
//                       name={`medical_history.problems_opening_mouth`}
//                       control={control}
//                       label={t("medicalHistoryMouthOpening")}
//                       error={errors["problems_opening_mouth"]}
//                     />
//                   </Grid>
//                   <Grid
//                     item
//                     xs={12}
//                     mb={2}
//                     sx={{
//                       display: { xs: "grid", md: "flex" },
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <FormCheck
//                       name={`medical_history.problems_moving_neck`}
//                       control={control}
//                       label={t("medicalHistoryNeckMovement")}
//                       error={errors["problems_moving_neck"]}
//                     />
//                   </Grid>
//                 </Grid>
//               </Card>
//             </Grid>
//           </Grid>
//         </FormBoxWrapper>
//       </Grid>
//     </Grid>
//   );
// };

// export default MedicalHistoryDetails;
