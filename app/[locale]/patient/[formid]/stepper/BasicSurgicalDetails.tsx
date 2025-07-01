/* eslint-disable react/display-name */
import {
  Grid,
  TextField,
  FormControl,
  InputAdornment,
  MenuItem,
  TextFieldProps,
} from "@mui/material";
import React, { forwardRef, useEffect, useMemo, useCallback } from "react";
import { FormBoxWrapper } from "../component/CustomFormWrapper";
import Heading from "@/app/components/Heading";
import { useFormContext, Controller, RegisterOptions } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

interface CustomInputProps {
  [key: string]: any;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
  return (
    <TextField
      fullWidth
      {...props}
      inputRef={ref}
      label="Birth Date"
      autoComplete="off"
      InputLabelProps={{ shrink: true }}
    />
  );
});
CustomInput.displayName = "CustomInput";

// Type definitions for optimized components
interface OptimizedTextFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  minRows?: number;
  placeholder?: string;
  sx?: any;
  InputProps?: any;
  InputLabelProps?: any;
  inputProps?: any;
  onInput?: React.FormEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  select?: boolean;
}

// Optimized TextField Component for better performance
const OptimizedTextField: React.FC<OptimizedTextFieldProps> = React.memo(({
  name,
  label,
  type = "text",
  required = false,
  multiline = false,
  minRows,
  placeholder,
  sx,
  InputProps,
  InputLabelProps,
  inputProps,
  onInput,
  children,
  select = false,
  ...props
}) => {
  const { register, formState: { errors }, watch } = useFormContext<any>();

  // Watch only the specific field instead of entire form
  const fieldValue = watch(name);

  const fieldError = useMemo(() => {
    const pathArray = name.split('.');
    let error: any = errors;
    for (const path of pathArray) {
      error = error?.[path];
    }
    return error;
  }, [errors, name]);

  const shrinkLabel = useMemo(() => {
    if (InputLabelProps?.shrink !== undefined) {
      return InputLabelProps.shrink;
    }
    return !!fieldValue || undefined;
  }, [fieldValue, InputLabelProps?.shrink]);

  return (
    <TextField
      {...register(name)}
      label={label}
      type={type}
      required={required}
      multiline={multiline}
      minRows={minRows}
      placeholder={placeholder}
      select={select}
      fullWidth
      error={!!fieldError}
      helperText={fieldError?.message || ''}
      sx={sx}
      InputProps={InputProps}
      InputLabelProps={{
        ...InputLabelProps,
        shrink: shrinkLabel
      }}
      inputProps={inputProps}
      onInput={onInput}
      {...props}
    >
      {children}
    </TextField>
  );
});

interface OptimizedNumberFieldProps {
  name: string;
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  validationRules?: RegisterOptions;
  [key: string]: any;
}

// Optimized Number Field Component
const OptimizedNumberField: React.FC<OptimizedNumberFieldProps> = React.memo(({
  name,
  label,
  required = false,
  min = 0,
  max,
  validationRules,
  ...props
}) => {
  const { register, formState: { errors }, watch } = useFormContext<any>();
  const fieldValue = watch(name);

  const fieldError = useMemo(() => {
    const pathArray = name.split('.');
    let error: any = errors;
    for (const path of pathArray) {
      error = error?.[path];
    }
    return error;
  }, [errors, name]);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    // Remove any non-numeric characters
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9.]/g, '');
  }, []);

  return (
    <TextField
      {...register(name, validationRules)}
      label={label}
      type="text"
      required={required}
      fullWidth
      error={!!fieldError}
      helperText={fieldError?.message || ''}
      InputLabelProps={{ shrink: !!fieldValue || undefined }}
      inputProps={{
        inputMode: "numeric",
        pattern: "[0-9]*",
        min,
        max
      }}
      InputProps={{
        sx: {
          "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
          },
          "& input": {
            "-moz-appearance": "textfield",
          },
        },
      }}
      onInput={handleInput}
      {...props}
    />
  );
});

interface OptimizedPhoneFieldProps {
  name: string;
  label: string;
  required?: boolean;
  [key: string]: any;
}

// Optimized Phone Number Field Component
const OptimizedPhoneField: React.FC<OptimizedPhoneFieldProps> = React.memo(({ name, label, required = false, ...props }) => {
  const { register, formState: { errors }, watch } = useFormContext<any>();
  const fieldValue = watch(name);

  const fieldError = useMemo(() => {
    const pathArray = name.split('.');
    let error: any = errors;
    for (const path of pathArray) {
      error = error?.[path];
    }
    return error;
  }, [errors, name]);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    // Remove any non-numeric characters
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]/g, '');
  }, []);

  return (
    <TextField
      {...register(name)}
      label={label}
      type="text"
      required={required}
      fullWidth
      error={!!fieldError}
      helperText={fieldError?.message || ''}
      InputLabelProps={{ shrink: !!fieldValue || undefined }}
      inputProps={{
        inputMode: "numeric",
        pattern: "[0-9]*"
      }}
      InputProps={{
        sx: {
          "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
          },
          "& input": {
            "-moz-appearance": "textfield",
          },
        },
      }}
      onInput={handleInput}
      {...props}
    />
  );
});

interface SelectOption {
  value: string;
  label: string;
}

interface OptimizedSelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  [key: string]: any;
}

// Optimized Select Field Component
const OptimizedSelectField: React.FC<OptimizedSelectFieldProps> = React.memo(({ name, label, options, required = false, ...props }) => {
  const { register, formState: { errors }, watch } = useFormContext<any>();
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
        value={fieldValue || ""}
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

interface OptimizedDatePickerProps {
  name: string;
  label: string;
  disableFuture?: boolean;
  [key: string]: any;
}

// Optimized Date Picker Component
const OptimizedDatePicker: React.FC<OptimizedDatePickerProps> = React.memo(({ name, label, disableFuture = false, ...props }) => {
  const { control, formState: { errors } } = useFormContext<any>();

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
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label={label}
            value={field.value ? parseISO(field.value) : null}
            onChange={(date: Date | null) => field.onChange(date?.toISOString())}
            // value={field.value ? (() => {
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
            disableFuture={disableFuture}
            {...props}
          />
        )}
      />
      {fieldError && (
        <p className="error-message" style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>
          {fieldError.message || "Please select a date"}
        </p>
      )}
    </FormControl>
  );
});

interface BasicSurgicalDetailsProps {
  setIsDown: (value: boolean) => void;
}

const BasicSurgicalDetails: React.FC<BasicSurgicalDetailsProps> = ({
  setIsDown,
}) => {
  const t = useTranslations("Index");

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    initialInView: false,
    onChange(inView: boolean, entry: IntersectionObserverEntry) {
      console.log({ inView, entry });
    },
  });

  // Memoize gender options to prevent recreation on every render
  const genderOptions: SelectOption[] = useMemo(() => [
    { value: "male", label: t("patientInfoMale") },
    { value: "female", label: t("patientInfoFemale") },
    { value: "intersex", label: t("patientInfoIntersex") },
  ], [t]);

  // Memoize validation rules to prevent recreation
  const heightInchesValidation: RegisterOptions = useMemo(() => ({
    min: { value: 0, message: "Height must be at least 0 inches" },
    max: { value: 12, message: "Height cannot exceed 12 inches" },
  }), []);

  useEffect(() => {
    console.log({ inView });
    if (inView) {
      setIsDown(true);
    }
  }, [inView, setIsDown]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormBoxWrapper sx={{ height: "75vh", overflowY: "auto" }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Heading label={t("patientInfoHeader")} />
            </Grid>

            {/* Patient Name */}
            <Grid item xs={12} sm={6}>
              <OptimizedTextField
                name="patient_information.patient_name"
                label={t("patientInfoName")}
                required
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} sm={3}>
              <OptimizedDatePicker
                name="patient_information.dob"
                label={t("patientInfoBirthDate")}
                disableFuture
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={3}>
              <OptimizedSelectField
                name="patient_information.gender"
                label={t("patientInfoGender")}
                options={genderOptions}
                required
              />
            </Grid>

            {/* Height Feet */}
            <Grid item xs={6} sm={3}>
              <OptimizedNumberField
                name="patient_information.height_feet"
                label={t("patientInfoHeightFeet")}
                required
                min={0}
              />
            </Grid>

            {/* Height Inches */}
            <Grid item xs={6} sm={3}>
              <OptimizedNumberField
                name="patient_information.height_inches"
                label={t("patientInfoHeightInches")}
                required
                min={0}
                max={12}
                validationRules={heightInchesValidation}
              />
            </Grid>

            {/* Weight */}
            <Grid item xs={12} sm={6}>
              <OptimizedNumberField
                name="patient_information.weight"
                label={t("patientInfoWeight")}
                required
                min={0}
              />
            </Grid>

            {/* Primary Care Name */}
            <Grid item xs={12} sm={6}>
              <OptimizedTextField
                name="patient_information.name_of_primary_care"
                label={t("patientInfoPrimaryCareName")}
                required
              />
            </Grid>

            {/* Primary Care Phone */}
            <Grid item xs={12} sm={6}>
              <OptimizedPhoneField
                name="patient_information.primary_care_phone_number"
                label={t("patientInfoPrimaryCareNumber")}
              />
            </Grid>

            {/* Cardiologist Name */}
            <Grid item xs={12} sm={6}>
              <OptimizedTextField
                name="patient_information.name_of_cardiologist"
                label={t("patientInfoCardiologistName")}
              />
            </Grid>

            {/* Cardiologist Phone */}
            <Grid item xs={12} sm={6}>
              <OptimizedPhoneField
                name="patient_information.cardiologist_phone_number"
                label={t("patientInfoCardiologistNumber")}
              />
            </Grid>

            {/* Doctor Name */}
            <Grid item xs={12} sm={6}>
              <OptimizedTextField
                name="patient_information.name_of_doctor"
                label={t("patientInfoDoctorName")}
                required
              />
            </Grid>

            {/* Surgical Procedure */}
            <Grid item xs={12}>
              <OptimizedTextField
                name="patient_information.surgical_procedure"
                label={t("patientInfoSurgicalProcedure")}
                placeholder={t("patientInfoSurgicalProcedurePlaceholder")}
                required
                multiline
                minRows={2}
                sx={{
                  "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
              />
            </Grid>

            <div ref={inViewRef} />
          </Grid>
        </FormBoxWrapper>
      </Grid>
    </Grid>
  );
};

export default BasicSurgicalDetails;

// import {
//   Grid,
//   TextField,
//   FormControl,
//   InputAdornment,
//   MenuItem,
// } from "@mui/material";
// import React, { forwardRef, useEffect } from "react";
// import { FormBoxWrapper } from "../component/CustomFormWrapper";
// import Heading from "@/app/components/Heading";
// import { useFormContext } from "react-hook-form";
// import { DatePicker } from "@mui/x-date-pickers";
// import { parseISO } from "date-fns";
// import { useTranslations } from "next-intl";
// import { useInView } from "react-intersection-observer";

// const CustomInput = forwardRef((props, ref) => {
//   return (
//     <TextField
//       fullWidth
//       {...props}
//       inputRef={ref}
//       label="Birth Date"
//       autoComplete="off"
//       InputLabelProps={{ shrink: true }}
//     />
//   );
// });
// CustomInput.displayName = "CustomInput";
// interface BasicSurgicalDetailsProps {
//   setIsDown: (value: boolean) => void;
// }

// const BasicSurgicalDetails: React.FC<BasicSurgicalDetailsProps> = ({
//   setIsDown,
// }) => {
//   const {
//     register,
//     watch,
//     setValue,
//     formState: { errors },
//   }: any = useFormContext();

//   const values = watch();
//   const t = useTranslations("Index");
//   const { ref: inViewRef, inView } = useInView({
//     // threshold: 0,
//     threshold: 0.1, // Adjust threshold as needed
//     triggerOnce: true,
//     initialInView: false,
//     onChange(inView, entry) {
//         console.log({inView, entry})
//     },
//   });

//   const handleDateChange = (date: Date | null) => {
//     setValue("patient_information.dob", date?.toISOString());
//   };

//   useEffect(() => {
//     console.log({inView})
//     if (inView) {
//       setIsDown(true);
//     }
//   }, [inView]);

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <FormBoxWrapper sx={{ height: "75vh", overflowY: "auto" }}>
//           <Grid container spacing={4}>
//             <Grid item xs={12}>
//               <Heading label={t("patientInfoHeader")} />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 required
//                 label={t("patientInfoName")}
//                 type="text"
//                 fullWidth
//                 InputLabelProps={{ shrink: !!values?.patient_information?.patient_name || undefined }}
//                 {...register("patient_information.patient_name")}
//                 error={!!errors?.patient_information?.patient_name}
//                 helperText={
//                   errors?.patient_information?.patient_name?.message as any
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth>
//                 <DatePicker
//                   value={
//                     values?.patient_information?.["dob"]
//                       ? parseISO(values?.patient_information?.["dob"])
//                       : null
//                   }
//                   label={t("patientInfoBirthDate")}
//                   // disableOpenPicker
//                   onAccept={handleDateChange}
//                   disableFuture
//                 />
//                 {errors?.patient_information?.dob && (
//                   <p className="error-message">Please select a date</p>
//                 )}
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   select
//                   required
//                   label={t("patientInfoGender")}
//                   value={values["gender"]}
//                   // InputLabelProps={{ shrink: !!values?.patient_information?.gender || undefined }}
//                   {...register("patient_information.gender")}
//                   error={!!errors?.patient_information?.gender}
//                   helperText={
//                     errors?.patient_information?.gender?.message as any
//                   }
//                 >
//                   <MenuItem value="male">{t("patientInfoMale")}</MenuItem>
//                   <MenuItem value="female">{t("patientInfoFemale")}</MenuItem>
//                   <MenuItem value="intersex">
//                     {t("patientInfoIntersex")}
//                   </MenuItem>
//                 </TextField>
//               </FormControl>
//             </Grid>

//             <Grid item xs={6} sm={3}>
//               <TextField
//                 label={t("patientInfoHeightFeet")}
//                 fullWidth
//                 type="number"
//                 required
//                 inputProps={{ min: 0 }}
//                 InputLabelProps={{ shrink: !!values?.patient_information?.height_feet || undefined }}
//                 InputProps={{
//                   sx: {
//                     min: 0,
//                     "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button":
//                       {
//                         "-webkit-appearance": "none",
//                         margin: 0,
//                       },
//                     "& input": {
//                       "-moz-appearance": "textfield",
//                     },
//                   },
//                 }}
//                 {...register("patient_information.height_feet")}
//                 error={!!errors?.patient_information?.height_feet}
//                 helperText={
//                   errors?.patient_information?.height_feet?.message as any
//                 }
//               />
//             </Grid>

//             <Grid item xs={6} sm={3}>
//               <TextField
//                 label={t("patientInfoHeightInches")}
//                 fullWidth
//                 required
//                 type="number"
//                 inputProps={{ min: 0, max: 12 }}
//                 InputLabelProps={{ shrink: !!values?.patient_information?.height_inches || undefined }}
//                 InputProps={{
//                   sx: {
//                     min: 0,
//                     "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button":
//                       {
//                         "-webkit-appearance": "none",
//                         margin: 0,
//                       },
//                     "& input": {
//                       "-moz-appearance": "textfield",
//                     },
//                   },
//                 }}
//                 {...register("patient_information.height_inches", {
//                   min: { value: 1, message: "Height must be at least 1 foot" },
//                   max: { value: 12, message: "Height cannot exceed 12 feet" },
//                 })}
//                 error={!!errors?.patient_information?.height_inches}
//                 helperText={
//                   errors?.patient_information?.height_inches?.message as any
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label={t("patientInfoWeight")}
//                 type="number"
//                 fullWidth
//                 required
//                 InputLabelProps={{ shrink: !!values?.patient_information?.weight || undefined }}
//                 InputProps={{
//                   sx: {
//                     min: 0,
//                     "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button":
//                       {
//                         "-webkit-appearance": "none",
//                         margin: 0,
//                       },
//                     "& input": {
//                       "-moz-appearance": "textfield",
//                     },
//                   },
//                 }}
//                 {...register("patient_information.weight")}
//                 error={!!errors?.patient_information?.weight}
//                 helperText={errors?.patient_information?.weight?.message as any}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 required
//                 label={t("patientInfoPrimaryCareName")}
//                 type="text"
//                 fullWidth
//                 InputLabelProps={{ shrink: !!values?.patient_information?.name_of_primary_care || undefined }}
//                 {...register("patient_information.name_of_primary_care")}
//                 error={!!errors?.patient_information?.name_of_primary_care}
//                 helperText={
//                   errors?.patient_information?.name_of_primary_care
//                     ?.message as any
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label={t("patientInfoPrimaryCareNumber")}
//                 type="text"
//                 InputLabelProps={{ shrink: !!values?.patient_information?.primary_care_phone_number || undefined }}
//                  inputProps={{
//       inputMode: "numeric",
//       pattern: "[0-9]*"
//     }}
//                 InputProps={{
//                   sx: {
//                     min: 0,
//                     "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button":
//                       {
//                         "-webkit-appearance": "none",
//                         margin: 0,
//                       },
//                     "& input": {
//                       "-moz-appearance": "textfield",
//                     },
//                   },
//                 }}
//                  onInput={(e) => {
//       // Remove any non-numeric characters
//       e.target.value = e.target.value.replace(/[^0-9]/g, '');
//     }}
//                 fullWidth
//                 {...register("patient_information.primary_care_phone_number")}
//                 error={!!errors?.patient_information?.primary_care_phone_number}
//                 helperText={
//                   errors?.patient_information?.primary_care_phone_number
//                     ?.message as any
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label={t("patientInfoCardiologistName")}
//                 type="text"
//                 fullWidth
//                 InputLabelProps={{ shrink: !!values?.patient_information?.name_of_cardiologist || undefined }}
//                 {...register("patient_information.name_of_cardiologist")}
//                 error={!!errors?.patient_information?.name_of_cardiologist}
//                 helperText={
//                   errors?.patient_information?.name_of_cardiologist
//                     ?.message as any
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label={t("patientInfoCardiologistNumber")}
//                 type="text"
//                 InputLabelProps={{ shrink: !!values?.patient_information?.cardiologist_phone_number || undefined }}
//                      inputProps={{
//       inputMode: "numeric",
//       pattern: "[0-9]*"
//     }}
//                 InputProps={{
//                   sx: {
//                     min: 0,
//                     "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button":
//                       {
//                         "-webkit-appearance": "none",
//                         margin: 0,
//                       },
//                     "& input": {
//                       "-moz-appearance": "textfield",
//                     },
//                   },
//                 }}
//                 fullWidth
//                  onInput={(e) => {
//       // Remove any non-numeric characters
//       e.target.value = e.target.value.replace(/[^0-9]/g, '');
//     }}
//                 {...register("patient_information.cardiologist_phone_number")}
//                 error={!!errors?.patient_information?.cardiologist_phone_number}
//                 helperText={
//                   errors?.patient_information?.cardiologist_phone_number
//                     ?.message as any
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 required
//                 label={t("patientInfoDoctorName")}
//                 type="text"
//                 fullWidth
//                 InputLabelProps={{ shrink: !!values?.patient_information?.name_of_doctor || undefined }}
//                 {...register("patient_information.name_of_doctor")}
//                 error={!!errors?.patient_information?.name_of_doctor}
//                 helperText={
//                   errors?.patient_information?.name_of_doctor?.message as any
//                 }
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 multiline
//                 minRows={2}
//                 label={t("patientInfoSurgicalProcedure")}
//                 placeholder={t("patientInfoSurgicalProcedurePlaceholder")}
//                 InputLabelProps={{ shrink: !!values?.patient_information?.surgical_procedure || undefined }}
//                 {...register("patient_information.surgical_procedure")}
//                 error={!!errors?.patient_information?.surgical_procedure}
//                 helperText={
//                   errors?.patient_information?.surgical_procedure
//                     ?.message as any
//                 }
//                 sx={{
//                   "& .MuiOutlinedInput-root": { alignItems: "baseline" },
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start"></InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>
//             <div ref={inViewRef} />

//           </Grid>
//         </FormBoxWrapper>
//       </Grid>
//     </Grid>
//   );
// };

// export default BasicSurgicalDetails;
