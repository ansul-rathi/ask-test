/* eslint-disable react/display-name */
import {
  Grid,
  TextField,
  FormControl,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import React, { forwardRef, useEffect, useMemo, useCallback } from "react";
import { FormBoxWrapper } from "../component/CustomFormWrapper";
import Heading from "@/app/components/Heading";
import { useFormContext, Controller } from "react-hook-form";
import TableFormField from "@/app/components/form/FormTable";
import { DatePicker } from "@mui/x-date-pickers";
import FormCheck from "@/app/components/form/FormCheck";
import { parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

// Type definitions
interface CustomInputProps {
  [key: string]: any;
}

interface TestsMedicationsProps {
  setIsDown: (value: boolean) => void;
}

interface OptimizedTextFieldProps {
  name: string;
  label: string;
  type?: string;
  fullWidth?: boolean;
  [key: string]: any;
}

interface OptimizedDatePickerProps {
  name: string;
  label?: string;
  disableFuture?: boolean;
  [key: string]: any;
}

interface TestItem {
  title: string;
  titleKey: string;
  labelKey: string;
  dateKey: string;
}

interface DrugItem {
  label: string;
  schema: string;
  fieldPrimary?: string;
  fieldPrimarySchema?: string;
  fieldSecondary?: string;
  fieldSecondarySchema?: string;
  fieldTertiary?: string;
  fieldTertiarySchema?: string;
}

interface TestSectionProps {
  t: (key: string) => string;
  testItems: TestItem[];
}

interface DrugSectionProps {
  t: (key: string) => string;
  drugsList: DrugItem[];
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete="off" />;
});
CustomInput.displayName = "CustomInput";

// Optimized TextField Component
const OptimizedTextField: React.FC<OptimizedTextFieldProps> = React.memo(({
  name,
  label,
  type = "text",
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
      label={label}
      type={type}
      fullWidth={fullWidth}
      error={!!fieldError}
      helperText={fieldError?.message || ''}
      {...props}
    />
  );
});

// Optimized Date Picker Component
const OptimizedDatePicker: React.FC<OptimizedDatePickerProps> = React.memo(({
  name,
  label,
  disableFuture = false,
  ...props
}) => {
  const { control } = useFormContext<any>();

  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label={label}
            disableFuture={disableFuture}
            value={field.value ? parseISO(field.value) : null}
            onChange={(date: Date | null) => field.onChange(date?.toISOString())}
            //  value={field.value ? (() => {
            //   const [year, month, day] = field.value.split('-').map(Number);
            //   return new Date(year, month - 1, day);
            // })() : null}
            // onChange={(date: Date | null) => {
            //   if (date) {
            //     const year = date.getFullYear();
            //     const month = String(date.getMonth() + 1).padStart(2, '0');
            //     const day = String(date.getDate()).padStart(2, '0');
            //     field.onChange(`${year}-${month}-${day}`);
            //   } else {
            //     field.onChange(null);
            //   }
            // }}
            {...props}
          />
        )}
      />
    </FormControl>
  );
});

// Test Section Component
const TestSection: React.FC<TestSectionProps> = React.memo(({ t, testItems }) => {
  return (
    <Grid item xs={12}>
      <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
        {t("testMedicationCheckOffTitle")}
      </Typography>

      <Divider sx={{ mt: 4, mb: 4 }} />

      {testItems.map((item, index) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
          }}
          key={index}
        >
          <Grid container item spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography>{item.title}</Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
              <OptimizedTextField
                name={`test_and_medication.${item.titleKey}.${item.labelKey}`}
                label={t("testMedicationLocation")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <OptimizedDatePicker
                name={`test_and_medication.${item.titleKey}.${item.dateKey}`}
                disableFuture
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Grid>
  );
});

// Drug Checkbox Item Component
const DrugCheckboxItem: React.FC<{ 
  drug: DrugItem; 
  index: number; 
  t: (key: string) => string;
}> = React.memo(({ drug, index, t }) => {
  const { control, watch } = useFormContext<any>();
  
  // Watch only the specific drug field
  const drugSelected = watch(`test_and_medication.${drug.schema}.${drug.schema}`);

  return (
    <Grid
      container
      item
      xs={12}
      spacing={2}
      mb={2}
      sx={{ alignItems: "center" }}
    >
      {/* Drug Checkbox */}
      <Grid item xs={drug.fieldSecondary ? 12 : 8}>
        <FormCheck
          name={`test_and_medication.${drug.schema}.${drug.schema}`}
          control={control}
          label={drug.label}
          error={undefined}
        />
      </Grid>

      {/* Primary Field (Dose/Name) */}
      {drug.fieldPrimary && drugSelected && (
        <Grid item xs={12} sm={4}>
          <OptimizedTextField
            name={`test_and_medication.${drug.schema}.${drug.fieldPrimarySchema}`}
            label={drug.fieldPrimary}
          />
        </Grid>
      )}

      {/* Secondary Field (Which/Frequency) */}
      {drug.fieldSecondary && drugSelected && (
        <Grid item xs={12} sm={4}>
          <OptimizedTextField
            name={`test_and_medication.${drug.schema}.${drug.fieldSecondarySchema}`}
            label={drug.fieldSecondary}
          />
        </Grid>
      )}

      {/* Tertiary Field (How Long/Frequency) */}
      {drug.fieldTertiary && drugSelected && (
        <Grid item xs={12} sm={4}>
          <OptimizedTextField
            name={`test_and_medication.${drug.schema}.${drug.fieldTertiarySchema}`}
            label={drug.fieldTertiary}
          />
        </Grid>
      )}
    </Grid>
  );
});

// Drug Section Component
const DrugSection: React.FC<DrugSectionProps> = React.memo(({ t, drugsList }) => {
  return (
    <Grid item xs={12}>
      <Typography sx={{ fontSize: 24, fontWeight: 700, marginTop: 5 }}>
        {t("testMedicationDrugCheckTitle")}
      </Typography>

      <Divider sx={{ mt: 4, mb: 4 }} />

      {drugsList.map((drug, index) => (
        <DrugCheckboxItem
          key={drug.schema}
          drug={drug}
          index={index}
          t={t}
        />
      ))}
    </Grid>
  );
});

// Medications List Section Component
const MedicationsListSection: React.FC<{ t: (key: string) => string }> = React.memo(({ t }) => {
  return (
    <Grid item xs={12}>
      <Typography sx={{ fontWeight: 700, fontSize: 24, marginTop: 5 }}>
        {t("testMedicationMedicationsListTitle")}
      </Typography>

      <Divider sx={{ mt: 4, mb: 2 }} />

      <TableFormField
        formName="test_and_medication"
        name="medicationsPast"
      />
    </Grid>
  );
});

// Main Component
const TestsMedications: React.FC<TestsMedicationsProps> = ({ setIsDown }) => {
  const t = useTranslations("Index");
  
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
  });

  // Memoized test items configuration
  const testItems: TestItem[] = useMemo(() => [
    {
      title: t("testMedicationEKG"),
      titleKey: "ekg",
      labelKey: "location_of_ekg",
      dateKey: "date_of_ekg",
    },
    {
      title: t("testMedicationSleepStudy"),
      titleKey: "sleep_study",
      labelKey: "location_of_sleep_study",
      dateKey: "date_of_sleep_study",
    },
    {
      title: t("testMedicationBloodWork"),
      titleKey: "blood_work",
      labelKey: "location_of_blood_work",
      dateKey: "date_of_blood_work",
    },
    {
      title: t("testMedicationStressTest"),
      titleKey: "stress_test",
      labelKey: "location_of_stress_test",
      dateKey: "date_of_stress_test",
    },
    {
      title: t("testMedicationEcho"),
      titleKey: "echo",
      labelKey: "location_of_echo",
      dateKey: "date_of_echo",
    },
    {
      title: t("testMedicationPulmonaryFunction"),
      titleKey: "pulmonary_function_test",
      labelKey: "location_of_pulmonary_function_test",
      dateKey: "date_of_pulmonary_function_test",
    },
  ], [t]);

  // Memoized drugs list configuration
  const drugsList: DrugItem[] = useMemo(() => [
    {
      label: t("testMedicationDrugMorphine"),
      schema: "morphine",
      fieldPrimary: t("testMedicationDrugDose"),
      fieldPrimarySchema: "morphine_dose",
    },
    {
      label: t("testMedicationDrugOxycodone"),
      schema: "oxycodone",
      fieldPrimary: t("testMedicationDrugDose"),
      fieldPrimarySchema: "oxycodone_dose",
    },
    {
      label: t("testMedicationDrugBuprenorphine"),
      schema: "buprenorphine",
      fieldPrimary: t("testMedicationDrugDose"),
      fieldPrimarySchema: "buprenorphine_dose",
    },
    {
      label: t("testMedicationDrugMethadone"),
      schema: "methadone",
      fieldPrimary: t("testMedicationDrugDose"),
      fieldPrimarySchema: "methadone_dose",
    },
    {
      label: t("testMedicationDrugNaltrexone"),
      schema: "naltrexone",
      fieldPrimary: t("testMedicationDrugDose"),
      fieldPrimarySchema: "naltrexone_dose",
    },
    {
      label: t("testMedicationDrugHIVPrEP"),
      schema: "hiv_prep",
    },
    {
      label: t("testMedicationDrugWeightLoss"),
      schema: "weight_loss_drugs",
    },
    {
      label: t("testMedicationDrugInsulin"),
      schema: "insulin",
      fieldPrimary: t("testMedicationDrugDose"),
      fieldPrimarySchema: "insulin_dose",
      fieldSecondary: t("which"),
      fieldSecondarySchema: "insulin_dose_drug_option",
    },
    {
      label: t("testMedicationOralDiabetesDrug"),
      schema: "oral_diabetes",
      fieldPrimary: t("testMedicationDrugDose"),
      fieldPrimarySchema: "oral_diabetes_dose",
      fieldSecondary: t("which"),
      fieldSecondarySchema: "oral_diabetes_drug_option",
    },
    {
      label: t("testMedicationDrugChronicSteroids"),
      schema: "chronic_steroids",
      fieldPrimary: t("testMedicationDrugName"),
      fieldPrimarySchema: "chronic_steroids_drug_name",
      fieldSecondary: t("testMedicationDrugDose"),
      fieldSecondarySchema: "chronic_steroids_dose",
      fieldTertiary: t("testMedicationDrugHowLong"),
      fieldTertiarySchema: "how_long_have_you_been_on_chronic_steroids",
    },
    {
      label: t("testMedicationDrugBloodThinners"),
      schema: "blood_thinners",
      fieldPrimary: t("testMedicationDrugName"),
      fieldPrimarySchema: "blood_thinners_drug_name",
      fieldSecondary: t("testMedicationDrugDose"),
      fieldSecondarySchema: "blood_thinners_dose",
      fieldTertiary: t("testMedicationDrugFrequency"),
      fieldTertiarySchema: "blood_thinners_frequency",
    },
    {
      label: t("testMedicationDrugInhalers"),
      schema: "inhalers",
      fieldPrimary: t("testMedicationDrugName"),
      fieldPrimarySchema: "inhalers_drug_name",
      fieldSecondary: t("testMedicationDrugFrequency"),
      fieldSecondarySchema: "inhalers_frequency",
    },
    {
      label: t("testMedicationDrugLosartan"),
      schema: "losartan",
    },
    {
      label: t("testMedicationDrugLisinopril"),
      schema: "lisinopril",
    },
    {
      label: t("testMedicationDrugBetaBlockers"),
      schema: "beta_blockers",
    },
  ], [t]);

  // In-view detection effect
  useEffect(() => {
    if (inView) {
      setIsDown(true);
    }
  }, [inView, setIsDown]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormBoxWrapper sx={{ height: "75vh", overflowY: "auto" }}>
          <Grid container item spacing={2} sx={{ p: 2 }}>
            {/* Header */}
            <Grid item xs={12}>
              <Heading label={t("testMedicationTitle")} />
            </Grid>

            {/* Test Section */}
            <TestSection t={t} testItems={testItems} />

            {/* Drug Section */}
            <DrugSection t={t} drugsList={drugsList} />

            {/* Medications List Section */}
            <MedicationsListSection t={t} />

            {/* In-view reference for scroll detection */}
            <div ref={inViewRef} />
          </Grid>
        </FormBoxWrapper>
      </Grid>
    </Grid>
  );
};

export default TestsMedications;
// import {
//   Grid,
//   TextField,
//   FormControl,
//   Box,
//   Typography,
//   Divider,
// } from "@mui/material";
// import React, { forwardRef, useEffect, useState } from "react";
// import { FormBoxWrapper } from "../component/CustomFormWrapper";
// import Heading from "@/app/components/Heading";
// import { useFormContext } from "react-hook-form";
// import TableFormField from "@/app/components/form/FormTable";
// import { DatePicker } from "@mui/x-date-pickers";
// import FormCheck from "@/app/components/form/FormCheck";
// import { parseISO } from "date-fns";
// import { useTranslations } from "next-intl";
// import { useInView } from "react-intersection-observer";

// const CustomInput = forwardRef((props, ref) => {
//   return <TextField fullWidth {...props} inputRef={ref} autoComplete="off" />;
// });
// CustomInput.displayName = "CustomImput";

// interface TestsMedicationsProps {
//   setIsDown: (value: boolean) => void;
// }

// const TestsMedications: React.FC<TestsMedicationsProps> = ({ setIsDown }) => {
//   const {
//     register,
//     watch,
//     control,
//     setValue,
//     formState: { errors },
//   } = useFormContext();

//   const values = watch();
//   const t = useTranslations("Index");
//   const { ref: inViewRef, inView } = useInView({
//     threshold: 0,
//   });

//   const handleDateChange = (date: Date | null, name: string) => {
//     if (date) setValue(name, date.toISOString());
//   };


//   const drugsList = [
//     {
//       label: t("testMedicationDrugMorphine"),
//       schema: "morphine",
//       fieldPrimary: t("testMedicationDrugDose"),
//       fieldPrimarySchema: "morphine_dose",
//     },
//     {
//       label: t("testMedicationDrugOxycodone"),
//       schema: "oxycodone",
//       fieldPrimary: t("testMedicationDrugDose"),
//       fieldPrimarySchema: "oxycodone_dose",
//     },
//     {
//       label: t("testMedicationDrugBuprenorphine"),
//       schema: "buprenorphine",
//       fieldPrimary: t("testMedicationDrugDose"),
//       fieldPrimarySchema: "buprenorphine_dose",
//     },
//     {
//       label: t("testMedicationDrugMethadone"),
//       schema: "methadone",
//       fieldPrimary: t("testMedicationDrugDose"),
//       fieldPrimarySchema: "methadone_dose",
//     },
//     {
//       label: t("testMedicationDrugNaltrexone"),
//       schema: "naltrexone",
//       fieldPrimary: t("testMedicationDrugDose"),
//       fieldPrimarySchema: "naltrexone_dose",
//     },
//     {
//       label: t("testMedicationDrugHIVPrEP"),
//       schema: "hiv_prep",
//       // fieldPrimary: t("testMedicationDrugDose"),
//       // fieldPrimarySchema: "hiv_prep_dose",
//     },
//     {
//       label: t("testMedicationDrugWeightLoss"),
//       schema: "weight_loss_drugs",
//     },
//     {
//       label: t("testMedicationDrugInsulin"),
//       schema: "insulin",
//       fieldPrimary: t("testMedicationDrugDose"),
//       fieldPrimarySchema: "insulin_dose",
//       fieldSecondary: t("which"),
//       fieldSecondarySchema: "insulin_dose_drug_option",
//     },
//     {
//       label: t("testMedicationOralDiabetesDrug"),
//       schema: "oral_diabetes",
//       fieldPrimary: t("testMedicationDrugDose"),
//       fieldPrimarySchema: "oral_diabetes_dose",
//       fieldSecondary: t("which"),
//       fieldSecondarySchema: "oral_diabetes_drug_option",
//     },
//     {
//       label: t("testMedicationDrugChronicSteroids"),
//       schema: "chronic_steroids",
//       fieldPrimary: t("testMedicationDrugName"),
//       fieldPrimarySchema: "chronic_steroids_drug_name",
//       fieldSecondary: t("testMedicationDrugDose"),
//       fieldSecondarySchema: "chronic_steroids_dose",
//       fieldTertiary: t("testMedicationDrugHowLong"),
//       fieldTertiarySchema: "how_long_have_you_been_on_chronic_steroids",
//     },
//     {
//       label: t("testMedicationDrugBloodThinners"),
//       schema: "blood_thinners",
//       fieldPrimary: t("testMedicationDrugName"),
//       fieldPrimarySchema: "blood_thinners_drug_name",
//       fieldSecondary: t("testMedicationDrugDose"),
//       fieldSecondarySchema: "blood_thinners_dose",
//       fieldTertiary: t("testMedicationDrugFrequency"),
//       fieldTertiarySchema: "blood_thinners_frequency",
//     },
//     {
//       label: t("testMedicationDrugInhalers"),
//       schema: "inhalers",
//       fieldPrimary: t("testMedicationDrugName"),
//       fieldPrimarySchema: "inhalers_drug_name",
//       fieldSecondary: t("testMedicationDrugFrequency"),
//       fieldSecondarySchema: "inhalers_frequency",
//     },
//     {
//       label: t("testMedicationDrugLosartan"),
//       schema: "losartan",
//     },
//     {
//       label: t("testMedicationDrugLisinopril"),
//       schema: "lisinopril",
//     },
//     {
//       label: t("testMedicationDrugBetaBlockers"),
//       schema: "beta_blockers",
//     },
//   ];

//   useEffect(() => {
//     if (inView) {
//       setIsDown(true);
//     }
//   }, [inView]);

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <FormBoxWrapper sx={{ height: "75vh", overflowY: "auto" }}>
//           <Grid container item spacing={2} sx={{ p: 2 }}>
//             <Grid item xs={12}>
//               <Heading label={t("testMedicationTitle")} />
//             </Grid>


//             <Grid item xs={12}>
//               <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
//                 {t("testMedicationCheckOffTitle")}
//               </Typography>

//               <Divider sx={{ mt: 4, mb: 4 }} />

//               {[
//                 {
//                   title: t("testMedicationEKG"),
//                   titleKey: "ekg",
//                   labelKey: "location_of_ekg",
//                   dateKey: "date_of_ekg",
//                 },
//                 {
//                   title: t("testMedicationSleepStudy"),
//                   titleKey: "sleep_study",
//                   labelKey: "location_of_sleep_study",
//                   dateKey: "date_of_sleep_study",
//                 },
//                 {
//                   title: t("testMedicationBloodWork"),
//                   titleKey: "blood_work",
//                   labelKey: "location_of_blood_work",
//                   dateKey: "date_of_blood_work",
//                 },
//                 {
//                   title: t("testMedicationStressTest"),
//                   titleKey: "stress_test",
//                   labelKey: "location_of_stress_test",
//                   dateKey: "date_of_stress_test",
//                 },
//                 {
//                   title: t("testMedicationEcho"),
//                   titleKey: "echo",
//                   labelKey: "location_of_echo",
//                   dateKey: "date_of_echo",
//                 },
//                 {
//                   title: t("testMedicationPulmonaryFunction"),
//                   titleKey: "pulmonary_function_test",
//                   labelKey: "location_of_pulmonary_function_test",
//                   dateKey: "date_of_pulmonary_function_test",
//                 },
//               ].map((item, index) => (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginTop: 2,
//                   }}
//                   key={index}
//                 >
//                   <Grid container item spacing={2}>
//                     <Grid item xs={12} sm={4}>
//                       <Typography>{item.title}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={5}>
//                       <TextField
//                         label={t("testMedicationLocation")}
//                         type="text"
//                         fullWidth
//                         {...register(
//                           `test_and_medication.${item.titleKey}.${item.labelKey}`
//                         )}
//                         error={
//                           !!errors[
//                             `test_and_medication.${item.titleKey}.${item.labelKey}`
//                           ]
//                         }
//                         helperText={
//                           errors[
//                             `test_and_medication.${item.titleKey}.${item.labelKey}`
//                           ]?.message as any
//                         }
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={3}>
//                       <FormControl fullWidth>
//                         <DatePicker
//                           disableFuture
//                           value={
//                             values?.test_and_medication?.[item.titleKey]?.[
//                               item.dateKey
//                             ]
//                               ? parseISO(
//                                   values?.test_and_medication?.[
//                                     item.titleKey
//                                   ]?.[item.dateKey]
//                                 )
//                               : null
//                           }
//                           onChange={(date) =>
//                             handleDateChange(
//                               date,
//                               `test_and_medication.${item.titleKey}.${item.dateKey}`
//                             )
//                           }
//                         />
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               ))}
//             </Grid>

//             <Grid item xs={12}>
//               <Typography sx={{ fontSize: 24, fontWeight: 700, marginTop: 5 }}>
//                 {t("testMedicationDrugCheckTitle")}
//               </Typography>

//               <Divider sx={{ mt: 4, mb: 4 }} />

//               {drugsList.map((name, index) => (
//                 <Grid
//                   container
//                   item
//                   xs={12}
//                   spacing={2}
//                   mb={2}
//                   sx={{ alignItems: "center" }}
//                   key={index}
//                 >
//                   {name.label && (
//                     <Grid item xs={name.fieldSecondary ? 12 : 8}>
//                       <FormCheck
//                         name={`test_and_medication.${name.schema}.${name.schema}`}
//                         control={control}
//                         label={`${name.label}`}
//                         error={
//                           errors?.[
//                             `test_and_medication.${name.schema}.${name.schema}`
//                           ]
//                         }
//                       />
//                     </Grid>
//                   )}
//                   {name.fieldPrimary &&
//                   values?.test_and_medication?.[name.schema]?.[name.schema] ? (
//                     <Grid item xs={12} sm={4}>
//                       <TextField
//                         label={name.fieldPrimary}
//                         type="text"
//                         fullWidth
//                         {...register(
//                           `test_and_medication.${name.schema}.${name.fieldPrimarySchema}`
//                         )}
//                         error={
//                           !!errors[
//                             `test_and_medication.${name.schema}.${name.fieldPrimarySchema}`
//                           ]
//                         }
//                         helperText={
//                           errors[
//                             `test_and_medication.${name.schema}.${name.fieldPrimarySchema}`
//                           ]?.message as any
//                         }
//                       />
//                     </Grid>
//                   ) : null}
//                   {name.fieldSecondary &&
//                   values?.test_and_medication?.[name.schema]?.[name.schema] ? (
//                     <Grid item xs={12} sm={4}>
//                       <TextField
//                         label={name.fieldSecondary}
//                         type="text"
//                         fullWidth
//                         {...register(
//                           `test_and_medication.${name.schema}.${name.fieldSecondarySchema}`
//                         )}
//                         error={
//                           !!errors[
//                             `test_and_medication.${name.schema}.${name.fieldSecondarySchema}`
//                           ]
//                         }
//                         helperText={
//                           errors[
//                             `test_and_medication.${name.schema}.${name.fieldSecondarySchema}`
//                           ]?.message as any
//                         }
//                       />
//                     </Grid>
//                   ) : null}
//                   {name.fieldTertiary &&
//                   values?.test_and_medication?.[name.schema]?.[name.schema] ? (
//                     <Grid item xs={12} sm={4}>
//                       <TextField
//                         label={name.fieldTertiary}
//                         type="text"
//                         fullWidth
//                         {...register(
//                           `test_and_medication.${name.schema}.${name.fieldTertiarySchema}`
//                         )}
//                         error={
//                           !!errors[
//                             `test_and_medication.${name.schema}.${name.fieldTertiarySchema}`
//                           ]
//                         }
//                         helperText={
//                           errors[
//                             `test_and_medication.${name.schema}.${name.fieldTertiarySchema}`
//                           ]?.message as any
//                         }
//                       />
//                     </Grid>
//                   ) : null}
//                 </Grid>
//               ))}
//             </Grid>

//             <Grid item xs={12}>
//               <Typography sx={{ fontWeight: 700, fontSize: 24, marginTop: 5 }}>
//                 {t("testMedicationMedicationsListTitle")}
//               </Typography>

//               <Divider sx={{ mt: 4, mb: 2 }} />

//               <TableFormField
//                 formName="test_and_medication"
//                 name="medicationsPast"
//               />
//             </Grid>

//             <div ref={inViewRef} />
//           </Grid>
//         </FormBoxWrapper>
//       </Grid>
//     </Grid>
//   );
// };

// export default TestsMedications;
