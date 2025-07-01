/* eslint-disable react/display-name */
import {
  Grid,
  TextField,
  InputAdornment,
  Stack,
  Typography,
  Card,
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  FormLabel,
  FormGroup,
} from "@mui/material";
import React, { forwardRef, useEffect, useMemo, useCallback } from "react";
import { FormBoxWrapper } from "../component/CustomFormWrapper";
import Heading from "@/app/components/Heading";
import { Controller, useFormContext } from "react-hook-form";
import FormCheck from "@/app/components/form/FormCheck";
import { useTranslatedFields } from "../constants/health-assessments";
import UploadImage from "../component/UploadImage";
import { DatePicker } from "@mui/x-date-pickers";
import { parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

// Type definitions
interface CustomInputProps {
  [key: string]: any;
}

interface OptimizedTextFieldProps {
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  minRows?: number;
  placeholder?: string;
  sx?: any;
  InputProps?: any;
  onInput?: React.FormEventHandler<HTMLDivElement>;
  inputProps?: any;
  [key: string]: any;
}

interface FieldItem {
  titleSchema: string;
  title?: string;
  fieldPrimary?: string;
  fieldPrimarySchema?: string;
  fieldSecondary?: string;
  fieldSecondarySchema?: string;
  fieldTertiary?: string;
  fieldTertiarySchema?: string;
  fieldOptions?: string[];
  fieldOptionsTitle?: string;
  fieldOptionsSchema?: string;
  dateSchema?: string;
  fieldRadio?: string;
  fieldRadioSchema?: string;
}

interface SectionProps {
  errors: any;
  t: (key: string) => string;
}

interface OtherSectionsProps extends SectionProps {
  formDetails?: any;
  handleChangeImage: (name: string, base64: string) => void;
}

interface HealthAssessmentDetailsProps {
  formDetails?: any;
  setIsDown: (value: boolean) => void;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
  return (
    <TextField
      fullWidth
      {...props}
      inputRef={ref}
      label="Date"
      autoComplete="off"
    />
  );
});
CustomInput.displayName = "CustomInput";

// Optimized TextField Component
const OptimizedTextField: React.FC<OptimizedTextFieldProps> = React.memo(({ 
  name, 
  label, 
  type = "text", 
  multiline = false, 
  minRows,
  placeholder,
  sx,
  InputProps,
  onInput,
  inputProps,
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
      multiline={multiline}
      minRows={minRows}
      placeholder={placeholder}
      fullWidth
      error={!!fieldError}
      helperText={fieldError?.message || ''}
      sx={sx}
      InputProps={InputProps}
      onInput={onInput}
      inputProps={inputProps}
      {...props}
    />
  );
});

// Cardiovascular Section Component
const CardiovascularSection: React.FC<SectionProps> = React.memo(({ errors, t }) => {
  const { control, watch, setValue } = useFormContext<any>();
  const { cardiovascularFields } = useTranslatedFields();
  
  // Watch only specific cardiovascular fields
  const cardiovascularValues = watch("health_assesment.cardiovascular_health");

  // const handleDateChange = useCallback((date: Date | null, name: string) => {
  //   setValue(name, date?.toISOString());
  // }, [setValue]);

  const handleNumericInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9.]/g, '');
  }, []);

  return (
    <Card sx={{ mt: 2, mb: 2, p: 2 }}>
      <Typography fontWeight={700} fontSize={18}>
        {t("cardiovascularHealth")}
      </Typography>
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <Grid container spacing={1}>
        {cardiovascularFields.map((name: FieldItem, index: number) => (
          <React.Fragment key={index}>
            <Grid
              item
              xs={12}
              sm={12}
              md={
                cardiovascularValues?.[name.titleSchema]?.[name.titleSchema] && name.fieldPrimary
                  ? 12
                  : 6
              }
            >
              {name.title && (
                <Stack direction="row" alignItems="center">
                  <FormCheck
                    name={`health_assesment.cardiovascular_health.${name.titleSchema}.${name.titleSchema}`}
                    control={control}
                    label={name.title}
                    error={errors?.cardiovascular_health?.[name.titleSchema]?.[name.titleSchema]}
                  />
                </Stack>
              )}
            </Grid>
            
            {cardiovascularValues?.[name.titleSchema]?.[name.titleSchema] && (
              <>
                {name.fieldPrimary && (
                  <Grid
                    item
                    xs={12}
                    sm={
                      name.fieldSecondary || name.dateSchema
                        ? name.fieldTertiary
                          ? 4
                          : 6
                        : 8
                    }
                  >
                    <OptimizedTextField
                      name={`health_assesment.cardiovascular_health.${name.titleSchema}.${name.fieldPrimarySchema}`}
                      label={name.fieldPrimary}
                      type="text"
                      onInput={name.fieldPrimarySchema === "diabetes_hba1c" ? handleNumericInput : undefined}
                      inputProps={name.fieldPrimarySchema === "diabetes_hba1c" ? {
                        inputMode: "numeric",
                        pattern: "[0-9.]*"
                      } : undefined}
                      sx={{ marginRight: 2 }}
                    />
                  </Grid>
                )}
                
                {name.fieldSecondary && (
                  <Grid item xs={12} sm={name.fieldTertiary ? 4 : 6}>
                    <OptimizedTextField
                      name={`health_assesment.cardiovascular_health.${name.titleSchema}.${name.fieldSecondarySchema}`}
                      label={name.fieldSecondary}
                      sx={{ marginRight: 2 }}
                    />
                  </Grid>
                )}
                
                {name.fieldTertiary && (
                  <Grid item xs={12} sm={4}>
                    <OptimizedTextField
                      name={`health_assesment.cardiovascular_health.${name.titleSchema}.${name.fieldTertiarySchema}`}
                      label={name.fieldTertiary}
                      sx={{ marginRight: 2 }}
                    />
                  </Grid>
                )}
                
                {name.fieldOptions && (
                  <Grid item xs={12} sm={7}>
                    <Controller
                      name={`health_assesment.cardiovascular_health.${name.titleSchema}.${name.fieldOptionsSchema}`}
                      control={control}
                      render={({ field }) => (
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            {name.fieldOptionsTitle}
                          </FormLabel>
                          <RadioGroup {...field} row aria-label={name.fieldOptionsTitle}>
                            {name.fieldOptions?.map((option: string, optIndex: number) => (
                              <FormControlLabel
                                key={optIndex}
                                value={option}
                                control={<Radio />}
                                label={option}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Grid>
                )}
                
                {name.dateSchema && (
                  <Grid
                    item
                    xs={12}
                    sm={name.fieldPrimary || name.fieldOptionsTitle ? 4 : 8}
                    sx={{ ml: 2 }}
                  >
                    <Controller
                      name={`health_assesment.cardiovascular_health.${name.titleSchema}.${name.dateSchema}`}
                      control={control}
                      render={({ field }) => (
                        <FormControl>
                          <DatePicker
                            {...field}
                            disableFuture
                            value={field.value ? parseISO(field.value) : null}
                            onChange={(date: Date | null) => field.onChange(date?.toISOString())}
            //                  value={field.value ? (() => {
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
                          />
                        </FormControl>
                      )}
                    />
                  </Grid>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </Grid>
    </Card>
  );
});

// Respiratory Section Component
const RespiratorySection: React.FC<SectionProps> = React.memo(({ errors, t }) => {
  const { watch, control } = useFormContext<any>();
  const { respiratoryFields } = useTranslatedFields();
  const respiratoryValues = watch("health_assesment.respiratory_health");

  const numericFields = ["sleep_apnea", "high_blood_pressure_treatment", "smoke", "ever_smoked"];
  
  const handleNumericInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]/g, '');
  }, []);

  return (
    <Card sx={{ mt: 2, mb: 2, p: 2 }}>
      <Typography fontWeight={700} fontSize={18}>
        {t("respiratoryHealth")}
      </Typography>
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <Grid container spacing={1}>
        {respiratoryFields.map((name: FieldItem, index: number) => (
          <React.Fragment key={index}>
            <Grid
              item
              xs={12}
              sm={12}
              md={
                respiratoryValues?.[name.titleSchema]?.[name.titleSchema] && name.fieldPrimary
                  ? 12
                  : 6
              }
            >
              <Stack direction="row" alignItems="center">
                <FormCheck
                  name={`health_assesment.respiratory_health.${name.titleSchema}.${name.titleSchema}`}
                  control={control}
                  label={name.title || ''}
                  error={errors?.respiratory_health?.[name.titleSchema]?.[name.titleSchema]}
                />
              </Stack>
            </Grid>
            
            {respiratoryValues?.[name.titleSchema]?.[name.titleSchema] && (
              <>
                {name.fieldPrimary && (
                  <Grid item xs={12} sm={name.fieldSecondary ? 6 : 8}>
                    <OptimizedTextField
                      name={`health_assesment.respiratory_health.${name.titleSchema}.${name.fieldPrimarySchema}`}
                      label={name.fieldPrimary}
                      type="text"
                      onInput={numericFields.includes(name.titleSchema) ? handleNumericInput : undefined}
                      inputProps={numericFields.includes(name.titleSchema) ? {
                        inputMode: "numeric",
                        pattern: "[0-9]*"
                      } : undefined}
                      sx={{ marginRight: 2 }}
                    />
                  </Grid>
                )}
                
                {name.fieldSecondary && (
                  <Grid item xs={12} sm={6}>
                    <OptimizedTextField
                      name={`health_assesment.respiratory_health.${name.titleSchema}.${name.fieldSecondarySchema}`}
                      label={name.fieldSecondary}
                      type="text"
                      onInput={numericFields.includes(name.titleSchema) ? handleNumericInput : undefined}
                      sx={{ marginRight: 2 }}
                    />
                  </Grid>
                )}
                
                {name.fieldRadio && (
                  <Grid item xs={12} sm={name.fieldSecondary ? 6 : 8}>
                    <Controller
                      name={`health_assesment.respiratory_health.${name.titleSchema}.${name.fieldRadioSchema}`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl
                          component="fieldset"
                          error={!!error}
                          fullWidth
                          sx={{ marginRight: 2 }}
                        >
                          <FormLabel component="legend">
                            {name.fieldRadio}
                          </FormLabel>
                          <RadioGroup {...field} aria-label={name.fieldRadio} row>
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                          {error?.message && (
                            <FormHelperText>{error.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </Grid>
    </Card>
  );
});

// Alcohol Drug Section Component
const AlcoholDrugSection: React.FC<SectionProps> = React.memo(({ errors, t }) => {
  const { watch, control } = useFormContext<any>();
  const { alcoholDrugFields } = useTranslatedFields();
  const alcoholDrugValues = watch("health_assesment.alcohol_drug_use");

  return (
    <Card sx={{ mt: 2, mb: 2, p: 2 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
        {t("alcoholDrug")}
      </Typography>
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <Grid container spacing={1}>
        {alcoholDrugFields.map((name: FieldItem, index: number) => (
          <React.Fragment key={index}>
            <Grid
              item
              xs={12}
              sm={12}
              md={
                alcoholDrugValues?.[name.titleSchema]?.[name.titleSchema] && name.fieldPrimary
                  ? 12
                  : 6
              }
            >
              {name.title && (
                <Stack direction="row" alignItems="center">
                  <FormCheck
                    name={`health_assesment.alcohol_drug_use.${name.titleSchema}.${name.titleSchema}`}
                    control={control}
                    label={name.title}
                    error={errors?.alcohol_drug_use?.[name.titleSchema]?.[name.titleSchema]}
                  />
                </Stack>
              )}
            </Grid>
            
            {name.fieldPrimary && alcoholDrugValues?.[name.titleSchema]?.[name.titleSchema] && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={
                    name.fieldSecondary
                      ? name.fieldTertiary
                        ? 4
                        : 6
                      : 8
                  }
                >
                  <OptimizedTextField
                    name={`health_assesment.alcohol_drug_use.${name.titleSchema}.${name.fieldPrimarySchema}`}
                    label={name.fieldPrimary}
                    sx={{ marginRight: 2 }}
                  />
                </Grid>
                
                {name.fieldSecondary && (
                  <Grid item xs={12} sm={name.fieldTertiary ? 4 : 6}>
                    <OptimizedTextField
                      name={`health_assesment.alcohol_drug_use.${name.titleSchema}.${name.fieldSecondarySchema}`}
                      label={name.fieldSecondary}
                      sx={{ marginRight: 2 }}
                    />
                  </Grid>
                )}
                
                {name.fieldTertiary && (
                  <Grid item xs={12} sm={4}>
                    <OptimizedTextField
                      name={`health_assesment.alcohol_drug_use.${name.titleSchema}.${name.fieldTertiarySchema}`}
                      label={name.fieldTertiary}
                      sx={{ marginRight: 2 }}
                    />
                  </Grid>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </Grid>
    </Card>
  );
});

// Other Sections Component
const OtherSections: React.FC<OtherSectionsProps> = React.memo(({ errors, t, formDetails, handleChangeImage }) => {
  const { control, register, watch } = useFormContext<any>();
  const {
    cancerFields,
    bloodDisorderField,
    liverField,
    kidneyField,
    digestiveSystemField,
    backNeckJawField,
    nerveMusclesField,
  } = useTranslatedFields();

  // Watch specific fields instead of entire form
  const cancerValues = watch("health_assesment.cancer");
  const kidneyValues = watch("health_assesment.kidney");
  const nerveMusclesValues = watch("health_assesment.nerves_muscles");
  const backNeckJawValues = watch("health_assesment.back_neck_jaw");
  const healthDetailHaveQuestions = watch("health_assesment.health_detail_have_any_questions");

  return (
    <>
      {/* Cancer Section */}
      <Grid item xs={12}>
        <Card sx={{ border: "1px solid #dfdfdf", borderRadius: "6px", padding: "20px" }}>
          <Grid container spacing={1}>
            {cancerFields.map((name: FieldItem, index: number) => (
              <React.Fragment key={index}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={cancerValues?.[name.titleSchema]?.[name.titleSchema] ? 12 : 6}
                >
                  {name.title && (
                    <Stack direction="row" alignItems="center">
                      <FormCheck
                        name={`health_assesment.cancer.${name.titleSchema}.${name.titleSchema}`}
                        control={control}
                        label={name.title}
                        error={errors?.cancer?.[name.titleSchema]?.[name.titleSchema]}
                      />
                    </Stack>
                  )}
                </Grid>
                {name.fieldPrimary && cancerValues?.[name.titleSchema]?.[name.titleSchema] && (
                  <Grid item xs={12} sm={8}>
                    <OptimizedTextField
                      name={`health_assesment.cancer.${name.titleSchema}.${name.fieldPrimarySchema}`}
                      label={name.fieldPrimary}
                      sx={{ marginRight: 2 }}
                    />
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
        </Card>
      </Grid>

      {/* Blood Disorders, Liver, Kidney, etc. sections */}
      <Card sx={{ mt: 2, mb: 2, p: 2 }}>
        <Grid container spacing={1}>
          {/* Blood Disorders */}
          <Grid item xs={12}>
            <Typography fontWeight={700} fontSize={18}>
              {t("bloodDisorders")}
            </Typography>
            <Divider sx={{ marginTop: 1 }} />
          </Grid>
          {bloodDisorderField.map((name: FieldItem, index: number) => (
            <Grid item key={index} xs={12} sm={12} md={6}>
              {name.title && (
                <Stack direction="row" alignItems="center">
                  <FormCheck
                    name={`health_assesment.blood_disorder.${name.titleSchema}.${name.titleSchema}`}
                    control={control}
                    label={name.title}
                    error={errors?.blood_disorder?.[name.titleSchema]?.[name.titleSchema]}
                  />
                </Stack>
              )}
            </Grid>
          ))}

          {/* Liver */}
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600, fontSize: 18, mt: 4 }}>
              {t("liver")}
            </Typography>
            <Divider sx={{ marginTop: 1 }} />
          </Grid>
          {liverField.map((name: FieldItem, index: number) => (
            <Grid item key={index} xs={12} sm={12} md={6}>
              {name.title && (
                <Stack direction="row" alignItems="center">
                  <FormCheck
                    name={`health_assesment.liver.${name.titleSchema}.${name.titleSchema}`}
                    control={control}
                    label={name.title}
                    error={errors?.liver?.[name.titleSchema]?.[name.titleSchema]}
                  />
                </Stack>
              )}
            </Grid>
          ))}

           <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600, fontSize: 18, mt: 4 }}>
              {t("kidneys")}
            </Typography>
            <Divider sx={{ marginTop: 1 }} />
          </Grid>
          {kidneyField.map((name: FieldItem, index: number) => (
            <Grid item key={index} xs={12} sm={12} md={6}>
              {name.title && (
                <Stack direction="row" alignItems="center">
                  <FormCheck
                    name={`health_assesment.kidney.${name.titleSchema}.${name.titleSchema}`}
                    control={control}
                    label={name.title}
                    error={errors?.kidney?.[name.titleSchema]?.[name.titleSchema]}
                  />
                </Stack>
              )}
            </Grid>
          ))}

           <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600, fontSize: 18, mt: 4 }}>
              {t("digestiveSystem")}
            </Typography>
            <Divider sx={{ marginTop: 1 }} />
          </Grid>
          {digestiveSystemField.map((name: FieldItem, index: number) => (
            <Grid item key={index} xs={12} sm={12} md={6}>
              {name.title && (
                <Stack direction="row" alignItems="center">
                  <FormCheck
                    name={`health_assesment.digestive_system.${name.titleSchema}.${name.titleSchema}`}
                    control={control}
                    label={name.title}
                    error={errors?.digestive_system?.[name.titleSchema]?.[name.titleSchema]}
                  />
                </Stack>
              )}
            </Grid>
          ))}

           <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600, fontSize: 18, mt: 4 }}>
              {t("other")}
            </Typography>
            <Divider sx={{ marginTop: 1 }} />
          </Grid>
          {backNeckJawField.map((name: FieldItem, index: number) => (
            <Grid item key={index} xs={12} sm={12} md={6}>
              {name.title && (
                <Stack direction="row" alignItems="center">
                  <FormCheck
                    name={`health_assesment.back_neck_jaw.${name.titleSchema}.${name.titleSchema}`}
                    control={control}
                    label={name.title}
                    error={errors?.back_neck_jaw?.[name.titleSchema]?.[name.titleSchema]}
                  />
                </Stack>
              )}
            </Grid>
          ))}

          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600, fontSize: 18, mt: 4 }}>
              {t("neurological")}
            </Typography>
            <Divider sx={{ marginTop: 1 }} />
          </Grid>
          {nerveMusclesField.map((name: FieldItem, index: number) => (
            <Grid item key={index} xs={12} sm={12} md={6}>
              {name.title && (
                <Stack direction="row" alignItems="center">
                  <FormCheck
                    name={`health_assesment.nerves_muscles.${name.titleSchema}.${name.titleSchema}`}
                    control={control}
                    label={name.title}
                    error={errors?.nerves_muscles?.[name.titleSchema]?.[name.titleSchema]}
                  />
                </Stack>
              )}
            </Grid>
          ))}

          {/* Additional Medical Illnesses */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <OptimizedTextField
              name="health_assesment.additional_medical_illnesses"
              label={t("additionalMedicalIllnesses")}
              placeholder={t("additionalMedicalIllnesses")}
              multiline
              minRows={4}
              sx={{ "& .MuiOutlinedInput-root": { alignItems: "baseline" } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
              }}
            />
          </Grid>

          {/* Comments/Questions Checkbox */}
          <Grid item xs={12}>
            <FormCheck
              name="health_assesment.health_detail_have_any_questions"
              control={control}
              label={t("commentsQuestions")}
              error={errors?.health_detail_have_any_questions}
            />
          </Grid>

          {/* Conditional Comments TextField */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            {healthDetailHaveQuestions && (
              <Controller
                name="health_assesment.health_detail_write_any_questions"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={4}
                    label={t("questionComment")}
                    placeholder={t("questionComment")}
                    error={!!error}
                    helperText={error?.message || ''}
                    sx={{
                      "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start"></InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            )}
          </Grid>

          {/* Image Upload Section */}
          {formDetails?.images && (
            <Grid
              item
              display={{ xs: "flex" }}
              flexDirection={{ xs: "column" }}
              spacing={{ xs: 2, md: 0 }}
            >
              <h1 style={{marginBottom: 1}}>{t("uploadImage")}</h1>
              {/* color of uploadImageWarningSize should be red */}
              <h6 style={{ color: "red", margin: 0 }}>*{t("uploadImageWarningSize")}</h6>
              <Stack
                display={{ xs: "flex" }}
                flexDirection={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, md: 0 }}
              >
                <UploadImage
                  type={t("teeth")}
                  onChange={(base64: string) => handleChangeImage("images[0]", base64)}
                  placeholderImg="teeth"
                />
                <UploadImage
                  type={t("face")}
                  onChange={(base64: string) => handleChangeImage("images[1]", base64)}
                  placeholderImg="face"
                />
                <UploadImage
                  type={t("throat")}
                  onChange={(base64: string) => handleChangeImage("images[2]", base64)}
                  placeholderImg="throat"
                />
              </Stack>
            </Grid>
          )}
        </Grid>
      </Card>
    </>
  );
});

// Main Component
const HealthAssessmentDetails: React.FC<HealthAssessmentDetailsProps> = ({ formDetails, setIsDown }) => {
  const { setValue, formState: { errors: globalErrors } } = useFormContext<any>();

  // Memoize errors
  const errors: any = useMemo(
    () => globalErrors.health_assesment,
    [globalErrors.health_assesment]
  );

  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
  });

  const t = useTranslations("Index");

  // Memoized callback for image changes
  const handleChangeImage = useCallback((name: string, base64: string) => {
    setValue(name, base64 || "");
  }, [setValue]);

  useEffect(() => {
    if (inView) {
      setIsDown(true);
    }
  }, [inView, setIsDown]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormBoxWrapper sx={{ height: "75vh", overflowY: "auto" }}>
          <Grid container marginBottom={2}>
            <Grid item xs={12}>
              <Heading label={t("healthAssesmentTitle")} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <CardiovascularSection errors={errors} t={t} />
          </Grid>

          <Grid item xs={12}>
            <RespiratorySection errors={errors} t={t} />
          </Grid>

          <Grid item xs={12}>
            <AlcoholDrugSection errors={errors} t={t} />
          </Grid>

          <OtherSections 
            errors={errors} 
            t={t} 
            formDetails={formDetails}
            handleChangeImage={handleChangeImage}
          />

          <div ref={inViewRef} />
        </FormBoxWrapper>
      </Grid>
    </Grid>
  );
};

export default HealthAssessmentDetails;
// import {
//   Grid,
//   TextField,
//   InputAdornment,
//   Stack,
//   Typography,
//   Card,
//   Divider,
//   FormControl,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   FormHelperText,
//   FormLabel,
//   FormGroup,
// } from "@mui/material";
// import React, { forwardRef, useEffect, useMemo, useState } from "react";
// import { FormBoxWrapper } from "../component/CustomFormWrapper";
// import Heading from "@/app/components/Heading";
// import { Controller, useFormContext } from "react-hook-form";
// import FormCheck from "@/app/components/form/FormCheck";
// import { useTranslatedFields } from "../constants/health-assessments";
// import UploadImage from "../component/UploadImage";
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
//       label="Date"
//       autoComplete="off"
//     />
//   );
// });
// CustomInput.displayName = "CustomImput";

// // Main Schema combining all sub-schemas

// function HealthAssessmentDetails({ formDetails, setIsDown }: any) {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     control,
//     formState: { errors: globalErrors },
//   } = useFormContext();

//   const errors: any = useMemo(
//     () => globalErrors.health_assesment,
//     [globalErrors]
//   );

//   const { ref: inViewRef, inView } = useInView({
//     threshold: 0,
//   });

//   const {
//     cardiovascularFields,
//     respiratoryFields,
//     alcoholDrugFields,
//     cancerFields,
//     bloodDisorderField,
//     liverField,
//     kidneyField,
//     digestiveSystemField,
//     backNeckJawField,
//     nerveMusclesField,
//   } = useTranslatedFields();

//   const values = watch();
//   const t = useTranslations("Index");
//   const handleDateChange = (date: Date | null, name: string) => {
//     console.log("date value", name);
//     setValue(name, date?.toISOString());
//   };
//   const handleChangeImage = (name: string, base64: string) => {
//     setValue(name, base64 || "");
//   };

//   useEffect(() => {
//     if (inView) {
//       setIsDown(true);
//     }
//   }, [inView]);

//   return (
//     <>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <FormBoxWrapper sx={{ height: "75vh", overflowY: "auto" }}>
//             <Grid container marginBottom={2}>
//               <Grid item xs={12}>
//                 <Heading label={t("healthAssesmentTitle")} />
//               </Grid>
//             </Grid>

//             <Grid item xs={12}>
//               <Card sx={{ mt: 2, mb: 2, p: 2 }}>
//                 <Typography fontWeight={700} fontSize={18}>
//                   {t("cardiovascularHealth")}
//                 </Typography>

//                 <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
//                 <Grid container spacing={1}>
//                   {cardiovascularFields.map((name, index) => {
//                     return (
//                       <>
//                         <Grid
//                           item
//                           xs={12}
//                           sm={12}
//                           md={
//                             values?.health_assesment?.cardiovascular_health?.[
//                               name.titleSchema
//                             ]?.[name.titleSchema] && name.fieldPrimary
//                               ? 12
//                               : 6
//                           }
//                           key={index}
//                         >
//                           {name.title ? (
//                             <Stack direction="row" alignItems="center">
//                               <FormCheck
//                                 name={`health_assesment.cardiovascular_health.${name.titleSchema}.${name.titleSchema}`}
//                                 control={control}
//                                 label={name.title}
//                                 error={
//                                   errors?.health_assesment
//                                     ?.cardiovascular_health?.[
//                                     name.titleSchema
//                                   ]?.[name.titleSchema]
//                                 }
//                               />
//                             </Stack>
//                           ) : (
//                             <></>
//                           )}
//                         </Grid>
//                         {values?.health_assesment?.cardiovascular_health?.[
//                           name.titleSchema
//                         ]?.[name.titleSchema] ? (
//                           <>
//                             {name.fieldPrimary ? (
//                               <Grid
//                                 item
//                                 xs={12}
//                                 sm={
//                                   name.fieldSecondary || name.dateSchema
//                                     ? name.fieldTertiary
//                                       ? 4
//                                       : 6
//                                     : 8
//                                 }
//                               >
//                                 <TextField
//                                   sx={{
//                                     marginRight: 2,
//                                   }}
//                                   fullWidth
//                                   label={name?.fieldPrimary}
//                                   type={
//                                     name.fieldPrimarySchema === "diabetes_hba1c"
//                                       ? "number"
//                                       : "text"
//                                   }
//                                   {...register(
//                                     `health_assesment.cardiovascular_health.${name.titleSchema}.${name.fieldPrimarySchema}`
//                                   )}
//                                   error={
//                                     !!errors?.cardiovascular_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldPrimarySchema]
//                                   }
//                                   helperText={
//                                     errors?.cardiovascular_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldPrimarySchema]?.message
//                                   }
//                                 />
//                               </Grid>
//                             ) : (
//                               <></>
//                             )}
//                             {name?.fieldSecondary ? (
//                               <Grid
//                                 item
//                                 xs={12}
//                                 sm={name.fieldTertiary ? 4 : 6}
//                               >
//                                 <TextField
//                                   sx={{
//                                     marginRight: 2,
//                                   }}
//                                   fullWidth
//                                   label={name?.fieldSecondary}
//                                   type="text"
//                                   {...register(
//                                     `health_assesment.cardiovascular_health.${name.titleSchema}.${name.fieldSecondarySchema}`
//                                   )}
//                                   error={
//                                     !!errors?.cardiovascular_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldSecondarySchema]
//                                   }
//                                   helperText={
//                                     errors?.cardiovascular_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldSecondarySchema]?.message
//                                   }
//                                 />
//                               </Grid>
//                             ) : (
//                               <></>
//                             )}
//                             {name?.fieldTertiary ? (
//                               <Grid item xs={12} sm={4}>
//                                 <TextField
//                                   sx={{
//                                     marginRight: 2,
//                                   }}
//                                   fullWidth
//                                   label={name?.fieldTertiary}
//                                   type="text"
//                                   {...register(
//                                     `health_assesment.cardiovascular_health.${name.titleSchema}.${name.fieldTertiarySchema}`
//                                   )}
//                                   error={
//                                     !!errors?.cardiovascular_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldTertiarySchema]
//                                   }
//                                   helperText={
//                                     errors?.cardiovascular_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldTertiarySchema]?.message
//                                   }
//                                 />
//                               </Grid>
//                             ) : (
//                               <></>
//                             )}
//                             {name.fieldOptions && (
//                               <Grid
//                                 item
//                                 xs={12}
//                                 sm={7}
//                                 key={`options-${index}`}
//                               >
//                                 <FormControl component="fieldset">
//                                   <FormLabel component="legend">
//                                     {name.fieldOptionsTitle}
//                                   </FormLabel>
//                                   <RadioGroup
//                                     row
//                                     aria-label={name.fieldOptionsTitle}
//                                     name={`health_assesment.cardiovascular_health.${name.titleSchema}.${name.fieldOptionsSchema}`}
//                                     value={
//                                       values?.health_assesment
//                                         ?.cardiovascular_health?.[
//                                         name.titleSchema
//                                       ]?.[name.fieldOptionsSchema] || ""
//                                     }
//                                     onChange={(e) =>
//                                       setValue(
//                                         `health_assesment.cardiovascular_health.${name.titleSchema}.${name.fieldOptionsSchema}`,
//                                         e.target.value
//                                       )
//                                     }
//                                   >
//                                     {name.fieldOptions.map(
//                                       (option, optIndex) => (
//                                         <FormControlLabel
//                                           key={`option-${optIndex}`}
//                                           value={option}
//                                           control={<Radio />}
//                                           label={option}
//                                         />
//                                       )
//                                     )}
//                                   </RadioGroup>
//                                 </FormControl>
//                               </Grid>
//                             )}
//                             {name?.dateSchema ? (
//                               <Grid
//                                 item
//                                 xs={12}
//                                 sm={
//                                   name.fieldPrimary || name.fieldOptionsTitle
//                                     ? 4
//                                     : 8
//                                 }
//                                 sx={{ ml: 2 }}
//                               >
//                                 <FormControl>
//                                   <DatePicker
//                                     disableFuture
//                                     value={
//                                       values?.health_assesment
//                                         ?.cardiovascular_health?.[
//                                         name.titleSchema
//                                       ]?.[name.dateSchema]
//                                         ? parseISO(
//                                             values?.health_assesment
//                                               ?.cardiovascular_health?.[
//                                               name.titleSchema
//                                             ]?.[name.dateSchema]
//                                           )
//                                         : null
//                                     }
//                                     // id={name.dateSchema}
//                                     onChange={(date) =>
//                                       handleDateChange(
//                                         date,
//                                         `health_assesment.cardiovascular_health.${name.titleSchema}.${name.dateSchema}`
//                                       )
//                                     }
//                                   />
//                                 </FormControl>
//                               </Grid>
//                             ) : (
//                               <></>
//                             )}
//                           </>
//                         ) : (
//                           <></>
//                         )}
//                       </>
//                     );
//                   })}
//                 </Grid>
//               </Card>
//             </Grid>

//             <Grid item xs={12}>
//               <Card sx={{ mt: 2, mb: 2, p: 2 }}>
//                 <Typography fontWeight={700} fontSize={18}>
//                   {t("respiratoryHealth")}
//                 </Typography>
//                 <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

//                 <Grid container spacing={1}>
//                   {respiratoryFields.map((name, index) => {
//                     return (
//                       <>
//                         <Grid
//                           item
//                           xs={12}
//                           sm={12}
//                           md={
//                             values?.health_assesment?.respiratory_health?.[
//                               name.titleSchema
//                             ]?.[name.titleSchema] && name.fieldPrimary
//                               ? 12
//                               : 6
//                           }
//                           key={index}
//                         >
//                           <Stack direction="row" alignItems="center">
//                             <FormCheck
//                               name={`health_assesment.respiratory_health.${name.titleSchema}.${name.titleSchema}`}
//                               control={control}
//                               label={name.title}
//                               // @ts-ignore
//                               error={
//                                 errors?.health_assesment?.respiratory_health?.[
//                                   name.titleSchema
//                                 ]?.[name.titleSchema]
//                               }
//                             />
//                           </Stack>
//                         </Grid>
//                         {values?.health_assesment?.respiratory_health?.[
//                           name.titleSchema
//                         ]?.[name.titleSchema] ? (
//                           <>
//                             {name.fieldPrimary ? (
//                               <Grid item xs={12} sm={name.fieldSecondary ? 6 : 8}>
//                                 <TextField
//                                   sx={{
//                                     marginRight: 2,
//                                   }}
//                                   fullWidth
//                                   label={name?.fieldPrimary}
//                                   type={
//                                     name.titleSchema === "sleep_apnea" ||
//                                     name.titleSchema ===
//                                       "high_blood_pressure_treatment" ||
//                                     name.titleSchema === "smoke" ||
//                                     name.titleSchema === "ever_smoked"
//                                       ? "number"
//                                       : "text"
//                                   }
//                                   {...register(
//                                     `health_assesment.respiratory_health.${name.titleSchema}.${name.fieldPrimarySchema}`
//                                   )}
//                                   error={
//                                     !!errors?.respiratory_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldPrimarySchema]
//                                   }
//                                   helperText={
//                                     errors?.respiratory_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldPrimarySchema]?.message
//                                   }
//                                 />
//                               </Grid>
//                             ) : (
//                               <></>
//                             )}

//                             {name.fieldSecondary ? (
//                               <Grid item xs={12} sm={6}>
//                                 <TextField
//                                   sx={{
//                                     marginRight: 2,
//                                   }}
//                                   fullWidth
//                                   label={name?.fieldSecondary}
//                                   type={
//                                     name.titleSchema === "sleep_apnea" ||
//                                     name.titleSchema ===
//                                       "high_blood_pressure_treatment" ||
//                                     name.titleSchema === "smoke" ||
//                                     name.titleSchema === "ever_smoked"
//                                       ? "number"
//                                       : "text"
//                                   }
//                                   {...register(
//                                     `health_assesment.respiratory_health.${name.titleSchema}.${name.fieldSecondarySchema}`
//                                   )}
//                                   error={
//                                     !!errors?.respiratory_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldSecondarySchema]
//                                   }
//                                   helperText={
//                                     errors?.respiratory_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldSecondarySchema]?.message
//                                   }
//                                 />
//                               </Grid>
//                             ) : (
//                               <></>
//                             )}

//                             {name.fieldRadio ? (
//                               <Grid item xs={12} sm={name.fieldSecondary ? 6 : 8}>
//                                 <FormControl
//                                   component="fieldset"
//                                   error={
//                                     !!errors?.respiratory_health?.[
//                                       name.titleSchema
//                                     ]?.[name.fieldRadioSchema]
//                                   }
//                                   fullWidth
//                                   sx={{ marginRight: 2 }}
//                                 >
//                                   <FormLabel component="legend">
//                                     {name?.fieldRadio}
//                                   </FormLabel>
//                                   <Controller
//                                     name={`health_assesment.respiratory_health.${name.titleSchema}.${name.fieldRadioSchema}`}
//                                     control={control}
//                                     render={({ field }) => (
//                                       <RadioGroup
//                                         {...field}
//                                         aria-label={name?.fieldRadio}
//                                         row // Adjust to 'row' if you want horizontal layout
//                                       >
//                                         {/* Adjust the options dynamically based on your needs */}
//                                         <FormControlLabel
//                                           value="yes"
//                                           control={<Radio />}
//                                           label="Yes"
//                                         />
//                                         <FormControlLabel
//                                           value="no"
//                                           control={<Radio />}
//                                           label="No"
//                                         />
//                                       </RadioGroup>
//                                     )}
//                                   />
//                                   {errors?.respiratory_health?.[
//                                     name.titleSchema
//                                   ]?.[name.fieldRadioSchema]?.message && (
//                                     <FormHelperText>
//                                       {
//                                         errors?.respiratory_health?.[
//                                           name.titleSchema
//                                         ]?.[name.fieldRadioSchema]?.message
//                                       }
//                                     </FormHelperText>
//                                   )}
//                                 </FormControl>
//                               </Grid>
//                             ) : (
//                               <></>
//                             )}
//                             {/* {name?.dateSchema ? (
//                               <Grid
//                                 item
//                                 xs={12}
//                                 sm={name.fieldPrimary ? 4 : 8}
//                                 sx={{ ml: 2 }}
//                               >
//                                 <FormControl>
//                                   <DatePicker
//                                     disableFuture
//                                     value={
//                                       values?.health_assesment
//                                         ?.respiratory_health?.[
//                                         name.titleSchema
//                                       ]?.[name.dateSchema]
//                                         ? parseISO(
//                                             values?.health_assesment
//                                               ?.respiratory_health?.[
//                                               name.titleSchema
//                                             ]?.[name.dateSchema]
//                                           )
//                                         : null
//                                     }
//                                     // showYearDropdown
//                                     // showMonthDropdown
//                                     // placeholderText="MM-DD-YYYY"
//                                     // customInput={<CustomInput />}
//                                     // id={name.dateSchema}
//                                     onChange={(date) =>
//                                       handleDateChange(
//                                         date,
//                                         `health_assesment.respiratory_health.${name.titleSchema}.${name.dateSchema}`
//                                       )
//                                     }
//                                   />
//                                 </FormControl>
//                               </Grid>
//                             ) : (
//                               <></>
//                             )} */}
//                           </>
//                         ) : (
//                           <></>
//                         )}
//                       </>
//                     );
//                   })}
//                 </Grid>
//               </Card>
//             </Grid>

//             <Grid item xs={12}>
//               <Card sx={{ mt: 2, mb: 2, p: 2 }}>
//                 <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
//                   {t("alcoholDrug")}
//                 </Typography>
//                 <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
//                 <Grid container spacing={1}>
//                   {alcoholDrugFields.map((name, index) => (
//                     <>
//                       <Grid
//                         item
//                         key={index}
//                         xs={12}
//                         sm={12}
//                         md={
//                           values?.health_assesment?.alcohol_drug_use?.[
//                             name.titleSchema
//                           ]?.[name.titleSchema] && name.fieldPrimary
//                             ? 12
//                             : 6
//                         }
//                       >
//                         {name?.title ? (
//                           <>
//                             <Stack direction="row" alignItems="center">
//                               <FormCheck
//                                 name={`health_assesment.alcohol_drug_use.${name.titleSchema}.${name.titleSchema}`}
//                                 control={control}
//                                 // rules={}
//                                 label={name.title}
//                                 // @ts-ignore
//                                 error={
//                                   errors?.health_assesment?.alcohol_drug_use?.[
//                                     name.titleSchema
//                                   ]?.[name.titleSchema]
//                                 }
//                               />
//                             </Stack>
//                           </>
//                         ) : (
//                           <></>
//                         )}
//                       </Grid>
//                       {name?.fieldPrimary &&
//                       values?.health_assesment?.alcohol_drug_use?.[
//                         name.titleSchema
//                       ]?.[name.titleSchema] ? (
//                         <>
//                           <Grid
//                             item
//                             xs={12}
//                             sm={
//                               name.fieldSecondary
//                                 ? name.fieldTertiary
//                                   ? 4
//                                   : 6
//                                 : 8
//                             }
//                           >
//                             <TextField
//                               sx={{
//                                 marginRight: 2,
//                               }}
//                               fullWidth
//                               label={name?.fieldPrimary}
//                               type={
//                                 // name.fieldPrimarySchema === "days_per_week" ||
//                                 // name.fieldPrimarySchema === "quantity_alcohol"
//                                 //   ? "number"
//                                 //   :
//                                 "text"
//                               }
//                               {...register(
//                                 `health_assesment.alcohol_drug_use.${name.titleSchema}.${name.fieldPrimarySchema}`
//                               )}
//                               error={
//                                 !!errors?.respiratory_health?.[
//                                   name.titleSchema
//                                 ]?.[name.fieldPrimarySchema]
//                               }
//                               helperText={
//                                 errors?.respiratory_health?.[
//                                   name.titleSchema
//                                 ]?.[name.fieldPrimarySchema]?.message
//                               }
//                             />
//                           </Grid>
//                           {name?.fieldSecondary ? (
//                             <Grid item xs={12} sm={name.fieldTertiary ? 4 : 6}>
//                               <TextField
//                                 sx={{
//                                   marginRight: 2,
//                                 }}
//                                 fullWidth
//                                 label={name?.fieldSecondary}
//                                 type="text"
//                                 {...register(
//                                   `health_assesment.alcohol_drug_use.${name.titleSchema}.${name.fieldSecondarySchema}`
//                                 )}
//                                 error={
//                                   !!errors?.respiratory_health?.[
//                                     name.titleSchema
//                                   ]?.[name.fieldSecondarySchema]
//                                 }
//                                 helperText={
//                                   errors?.respiratory_health?.[
//                                     name.titleSchema
//                                   ]?.[name.fieldSecondarySchema]?.message
//                                 }
//                               />
//                             </Grid>
//                           ) : (
//                             <></>
//                           )}

//                           {name?.fieldTertiary ? (
//                             <Grid item xs={12} sm={4}>
//                               <TextField
//                                 sx={{
//                                   marginRight: 2,
//                                 }}
//                                 fullWidth
//                                 label={name?.fieldTertiary}
//                                 type={
//                                   // name.fieldTertiarySchema ===
//                                   //   "days_per_week" ||
//                                   // name.fieldTertiarySchema ===
//                                   //   "quantity_alcohol"
//                                   //   ? "number"
//                                   //   :
//                                   "text"
//                                 }
//                                 {...register(
//                                   `health_assesment.alcohol_drug_use.${name.titleSchema}.${name.fieldTertiarySchema}`
//                                 )}
//                                 error={
//                                   !!errors?.respiratory_health?.[
//                                     name.titleSchema
//                                   ]?.[name.fieldTertiarySchema]
//                                 }
//                                 helperText={
//                                   errors?.respiratory_health?.[
//                                     name.titleSchema
//                                   ]?.[name.fieldTertiarySchema]?.message
//                                 }
//                               />
//                             </Grid>
//                           ) : (
//                             <></>
//                           )}
//                         </>
//                       ) : (
//                         <></>
//                       )}
//                     </>
//                   ))}
//                 </Grid>
//               </Card>

//               <Grid item xs={12}>
//                 <Card
//                   sx={{
//                     border: "1px solid #dfdfdf",
//                     borderRadius: "6px",
//                     padding: "20px",
//                   }}
//                 >
//                   <Grid container spacing={1}>
//                     {cancerFields.map((name, index) => (
//                       <>
//                         <Grid
//                           item
//                           key={index}
//                           xs={12}
//                           sm={12}
//                           md={
//                             values?.health_assesment?.cancer?.[
//                               name.titleSchema
//                             ]?.[name.titleSchema]
//                               ? 12
//                               : 6
//                           }
//                         >
//                           {name?.title ? (
//                             <>
//                               <Stack direction="row" alignItems="center">
//                                 <FormCheck
//                                   name={`health_assesment.cancer.${name.titleSchema}.${name.titleSchema}`}
//                                   control={control}
//                                   // rules={}
//                                   label={name.title}
//                                   // @ts-ignore
//                                   error={
//                                     errors?.health_assesment?.cancer?.[
//                                       name.titleSchema
//                                     ]?.[name.titleSchema]
//                                   }
//                                 />
//                               </Stack>
//                             </>
//                           ) : (
//                             <></>
//                           )}
//                         </Grid>
//                         {name?.fieldPrimary &&
//                         values?.health_assesment?.cancer?.[name.titleSchema]?.[
//                           name.titleSchema
//                         ] ? (
//                           <>
//                             <Grid item xs={12} sm={8}>
//                               <TextField
//                                 sx={{
//                                   marginRight: 2,
//                                 }}
//                                 fullWidth
//                                 label={name?.fieldPrimary}
//                                 type="text"
//                                 {...register(
//                                   `health_assesment.cancer.${name.titleSchema}.${name.fieldPrimarySchema}`
//                                 )}
//                                 error={
//                                   !!errors?.respiratory_health?.[
//                                     name.titleSchema
//                                   ]?.[name.fieldPrimarySchema]
//                                 }
//                                 helperText={
//                                   errors?.respiratory_health?.[
//                                     name.titleSchema
//                                   ]?.[name.fieldPrimarySchema]?.message
//                                 }
//                               />
//                             </Grid>
//                           </>
//                         ) : (
//                           <></>
//                         )}
//                       </>
//                     ))}
//                   </Grid>
//                 </Card>
//               </Grid>
//             </Grid>

//             <Card sx={{ mt: 2, mb: 2, p: 2 }}>
//               <Grid container spacing={1}>
//                 <Grid item xs={12}>
//                   <Typography fontWeight={700} fontSize={18}>
//                     {t("bloodDisorders")}
//                   </Typography>
//                   <Divider sx={{ marginTop: 1 }} />
//                 </Grid>

//                 {bloodDisorderField.map((name, index) => (
//                   <>
//                     <Grid item key={index} xs={12} sm={12} md={6}>
//                       {name?.title ? (
//                         <>
//                           <Stack direction="row" alignItems="center">
//                             <FormCheck
//                               name={`health_assesment.blood_disorder.${name.titleSchema}.${name.titleSchema}`}
//                               control={control}
//                               // rules={}
//                               label={name.title}
//                               // @ts-ignore
//                               error={
//                                 errors?.health_assesment?.blood_disorder?.[
//                                   name.titleSchema
//                                 ]?.[name.titleSchema]
//                               }
//                             />
//                           </Stack>
//                         </>
//                       ) : (
//                         <></>
//                       )}
//                     </Grid>
//                   </>
//                 ))}

//                 <Grid item xs={12}>
//                   <Typography sx={{ fontWeight: 600, fontSize: 18, mt: 4 }}>
//                     {t("liver")}
//                   </Typography>
//                   <Divider sx={{ marginTop: 1 }} />
//                 </Grid>
//                 {liverField.map((name, index) => (
//                   <>
//                     <Grid item key={index} xs={12} sm={12} md={6}>
//                       {name?.title ? (
//                         <>
//                           <Stack direction="row" alignItems="center">
//                             <FormCheck
//                               name={`health_assesment.liver.${name.titleSchema}.${name.titleSchema}`}
//                               control={control}
//                               // rules={}
//                               label={name.title}
//                               // @ts-ignore
//                               error={
//                                 errors?.health_assesment?.liver?.[
//                                   name.titleSchema
//                                 ]?.[name.titleSchema]
//                               }
//                             />
//                           </Stack>
//                         </>
//                       ) : (
//                         <></>
//                       )}
//                     </Grid>
//                   </>
//                 ))}

//                 <Grid item xs={12}>
//                   <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 4 }}>
//                     {t("kidneys")}
//                   </Typography>
//                   <Divider sx={{ marginTop: 1 }} />
//                 </Grid>

//                 {kidneyField.map((name, index) => {
//                   return (
//                     <>
//                       <Grid
//                         item
//                         xs={12}
//                         sm={12}
//                         md={
//                           values?.health_assesment?.kidney?.[
//                             name.titleSchema
//                           ]?.[name.titleSchema] && name.fieldPrimary
//                             ? 12
//                             : 6
//                         }
//                         key={index}
//                       >
//                         {name.title ? (
//                           <Stack direction="row" alignItems="center">
//                             <FormCheck
//                               name={`health_assesment.kidney.${name.titleSchema}.${name.titleSchema}`}
//                               control={control}
//                               label={name.title}
//                               error={
//                                 errors?.health_assesment?.kidney?.[
//                                   name.titleSchema
//                                 ]?.[name.titleSchema]
//                               }
//                             />
//                           </Stack>
//                         ) : (
//                           <></>
//                         )}
//                       </Grid>
//                       {values?.health_assesment?.kidney?.[name.titleSchema]?.[
//                         name.titleSchema
//                       ] ? (
//                         <>
//                           {name.fieldPrimary ? (
//                             <Grid
//                               item
//                               xs={12}
//                               sm={name.fieldSecondary ? 6 : 8}
//                               style={{ marginLeft: 20 }}
//                             >
//                               <FormCheck
//                                 name={`health_assesment.kidney.${name.titleSchema}.${name.fieldPrimarySchema}`}
//                                 control={control}
//                                 label={name?.fieldPrimary}
//                                 error={
//                                   errors?.kidney?.[name.titleSchema]?.[
//                                     name.fieldPrimarySchema
//                                   ]
//                                 }
//                               />
//                             </Grid>
//                           ) : (
//                             <></>
//                           )}
//                           {name?.fieldSecondary &&
//                           values?.health_assesment?.kidney?.[
//                             name.titleSchema
//                           ]?.[name.fieldPrimarySchema] ? (
//                             <Grid
//                               item
//                               xs={12}
//                               sm={6}
//                               style={{ marginLeft: 30 }}
//                             >
//                               <FormCheck
//                                 name={`health_assesment.kidney.${name.titleSchema}.${name.fieldSecondarySchema}`}
//                                 control={control}
//                                 label={name?.fieldSecondary}
//                                 error={
//                                   errors?.kidney?.[name.titleSchema]?.[
//                                     name.fieldSecondarySchema
//                                   ]
//                                 }
//                               />
//                             </Grid>
//                           ) : (
//                             <></>
//                           )}
//                           {name?.fieldTertiary &&
//                           values?.health_assesment?.kidney?.[
//                             name.titleSchema
//                           ]?.[name.fieldPrimarySchema] ? (
//                             <Grid
//                               item
//                               xs={12}
//                               sm={6}
//                               style={{ marginLeft: 30 }}
//                             >
//                               <TextField
//                                 sx={{
//                                   marginRight: 2,
//                                 }}
//                                 fullWidth
//                                 label={name?.fieldTertiary}
//                                 type="text"
//                                 {...register(
//                                   `health_assesment.kidney.${name.titleSchema}.${name.fieldTertiarySchema}`
//                                 )}
//                                 error={
//                                   !!errors?.kidney?.[name.titleSchema]?.[
//                                     name.fieldTertiarySchema
//                                   ]
//                                 }
//                                 helperText={
//                                   errors?.kidney?.[name.titleSchema]?.[
//                                     name.fieldTertiarySchema
//                                   ]?.message
//                                 }
//                               />
//                             </Grid>
//                           ) : (
//                             <></>
//                           )}
//                         </>
//                       ) : (
//                         <></>
//                       )}
//                     </>
//                   );
//                 })}

//                 <Grid item xs={12}>
//                   <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 4 }}>
//                     {t("digestiveSystem")}
//                   </Typography>
//                   <Divider sx={{ marginTop: 1 }} />
//                 </Grid>
//                 {digestiveSystemField.map((name, index) => {
//                   return (
//                     <>
//                       <Grid item xs={12} sm={12} md={6} key={index}>
//                         {name.title ? (
//                           <Stack direction="row" alignItems="center">
//                             <FormCheck
//                               name={`health_assesment.digestive_system.${name.titleSchema}.${name.titleSchema}`}
//                               control={control}
//                               label={name.title}
//                               error={
//                                 errors?.health_assesment?.digestive_system?.[
//                                   name.titleSchema
//                                 ]?.[name.titleSchema]
//                               }
//                             />
//                           </Stack>
//                         ) : (
//                           <></>
//                         )}
//                       </Grid>
//                     </>
//                   );
//                 })}

//                 <Grid item xs={12}>
//                   <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 4 }}>
//                     {t("neurological")}
//                   </Typography>
//                   <Divider sx={{ marginTop: 1 }} />
//                 </Grid>

//                 {nerveMusclesField.map((name, index) => {
//                   return (
//                     <>
//                       <Grid
//                         item
//                         xs={12}
//                         sm={12}
//                         md={
//                           values?.health_assesment?.nerves_muscles?.[
//                             name.titleSchema
//                           ]?.[name.titleSchema] && name.fieldPrimary
//                             ? 12
//                             : 6
//                         }
//                         key={index}
//                       >
//                         {name.title ? (
//                           <Stack direction="row" alignItems="center">
//                             <FormCheck
//                               name={`health_assesment.nerves_muscles.${name.titleSchema}.${name.titleSchema}`}
//                               control={control}
//                               label={name.title}
//                               error={
//                                 errors?.health_assesment?.nerves_muscles?.[
//                                   name.titleSchema
//                                 ]?.[name.titleSchema]
//                               }
//                             />
//                           </Stack>
//                         ) : (
//                           <></>
//                         )}
//                       </Grid>
//                       {values?.health_assesment?.nerves_muscles?.[
//                         name.titleSchema
//                       ]?.[name.titleSchema] ? (
//                         <>
//                           {name.fieldPrimary ? (
//                             <Grid item xs={12} sm={name.dateSchema ? 6 : 8}>
//                               <TextField
//                                 sx={{
//                                   marginRight: 2,
//                                   "& .MuiInputBase-input": {
//                                     fontSize: "0.8rem", // Makes the placeholder and input text smaller
//                                   },
//                                   "& .MuiInputLabel-root": {
//                                     fontSize: "0.8rem", // Makes the label smaller
//                                   },
//                                 }}
//                                 fullWidth
//                                 label={name?.fieldPrimary}
//                                 type="text"
//                                 {...register(
//                                   `health_assesment.nerves_muscles.${name.titleSchema}.${name.fieldPrimarySchema}`
//                                 )}
//                                 error={
//                                   !!errors?.nerves_muscles?.[
//                                     name.titleSchema
//                                   ]?.[name.fieldPrimarySchema]
//                                 }
//                                 helperText={
//                                   errors?.nerves_muscles?.[name.titleSchema]?.[
//                                     name.fieldPrimarySchema
//                                   ]?.message
//                                 }
//                               />
//                             </Grid>
//                           ) : (
//                             <></>
//                           )}
//                           {name?.checkSchema ? (
//                             <Grid
//                               item
//                               xs={12}
//                               sm={8}
//                               style={{ marginLeft: 20 }}
//                             >
//                               <FormCheck
//                                 name={`health_assesment.nerves_muscles.${name.titleSchema}.${name.checkSchema}`}
//                                 control={control}
//                                 label={name.checkLabel}
//                                 error={
//                                   errors?.health_assesment?.nerves_muscles?.[
//                                     name.titleSchema
//                                   ]?.[name.checkSchema]
//                                 }
//                               />
//                             </Grid>
//                           ) : (
//                             <></>
//                           )}
//                           {name?.dateSchema ? (
//                             <Grid
//                               item
//                               xs={12}
//                               sm={name.fieldPrimary ? 4 : 8}
//                               sx={{ ml: 2 }}
//                             >
//                               <FormControl>
//                                 <DatePicker
//                                   disableFuture
//                                   value={
//                                     values?.health_assesment?.nerves_muscles?.[
//                                       name.titleSchema
//                                     ]?.[name.dateSchema]
//                                       ? parseISO(
//                                           values?.health_assesment
//                                             ?.nerves_muscles?.[
//                                             name.titleSchema
//                                           ]?.[name.dateSchema]
//                                         )
//                                       : null
//                                   }
//                                   // showYearDropdown
//                                   // showMonthDropdown
//                                   // placeholderText="MM-DD-YYYY"
//                                   // customInput={<CustomInput />}
//                                   // id={name.dateSchema}
//                                   onChange={(date) =>
//                                     handleDateChange(
//                                       date,
//                                       `health_assesment.nerves_muscles.${name.titleSchema}.${name.dateSchema}`
//                                     )
//                                   }
//                                 />
//                               </FormControl>
//                             </Grid>
//                           ) : (
//                             <></>
//                           )}
//                         </>
//                       ) : (
//                         <></>
//                       )}
//                     </>
//                   );
//                 })}

//                 <Grid item xs={12}>
//                   <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 4 }}>
//                     {t("other")}
//                   </Typography>
//                   <Divider sx={{ marginTop: 1 }} />
//                 </Grid>

//                 {backNeckJawField.map((name, index) => {
//                   return (
//                     <>
//                       <Grid
//                         item
//                         xs={12}
//                         sm={12}
//                         md={
//                           values?.health_assesment?.back_neck_jaw?.[
//                             name.titleSchema
//                           ]?.[name.titleSchema] && name.fieldPrimary
//                             ? 12
//                             : 6
//                         }
//                         key={index}
//                       >
//                         {name.title ? (
//                           <Stack direction="row" alignItems="center">
//                             <FormCheck
//                               name={`health_assesment.back_neck_jaw.${name.titleSchema}.${name.titleSchema}`}
//                               control={control}
//                               label={name.title}
//                               error={
//                                 errors?.health_assesment?.back_neck_jaw?.[
//                                   name.titleSchema
//                                 ]?.[name.titleSchema]
//                               }
//                             />
//                           </Stack>
//                         ) : (
//                           <></>
//                         )}
//                       </Grid>
//                       {values?.health_assesment?.back_neck_jaw?.[
//                         name.titleSchema
//                       ]?.[name.titleSchema] ? (
//                         <>
//                           {name.fieldPrimary ? (
//                             <Grid item xs={12} sm={9}>
//                               <TextField
//                                 sx={{
//                                   marginRight: 2,
//                                 }}
//                                 fullWidth
//                                 label={name?.fieldPrimary}
//                                 type="text"
//                                 {...register(
//                                   `health_assesment.back_neck_jaw.${name.titleSchema}.${name.fieldPrimarySchema}`
//                                 )}
//                                 error={
//                                   !!errors?.back_neck_jaw?.[name.titleSchema]?.[
//                                     name.fieldPrimarySchema
//                                   ]
//                                 }
//                                 helperText={
//                                   errors?.back_neck_jaw?.[name.titleSchema]?.[
//                                     name.fieldPrimarySchema
//                                   ]?.message
//                                 }
//                               />
//                             </Grid>
//                           ) : (
//                             <></>
//                           )}
//                         </>
//                       ) : (
//                         <></>
//                       )}
//                     </>
//                   );
//                 })}

//                 <Grid item xs={12} sx={{ mt: 2 }}>
//                   <TextField
//                     fullWidth
//                     multiline
//                     minRows={4}
//                     label={t("additionalMedicalIllnesses")}
//                     placeholder={t("additionalMedicalIllnesses")}
//                     sx={{
//                       "& .MuiOutlinedInput-root": { alignItems: "baseline" },
//                     }}
//                     {...register(
//                       "health_assesment.additional_medical_illnesses"
//                     )}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start"></InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormCheck
//                     name={"health_assesment.health_detail_have_any_questions"}
//                     control={control}
//                     // rules={}
//                     label={t("commentsQuestions")}
//                     // @ts-ignore
//                     error={
//                       errors?.health_assesment?.health_detail_have_any_questions
//                     }
//                   />
//                 </Grid>
//                 <div ref={inViewRef} />

//                 <Grid item xs={12} sx={{ mt: 2 }}>
//                   {values?.health_assesment
//                     ?.health_detail_have_any_questions ? (
//                     <TextField
//                       fullWidth
//                       multiline
//                       minRows={4}
//                       label={t("questionComment")}
//                       placeholder={t("questionComment")}
//                       {...register(
//                         `health_assesment.${"health_detail_write_any_questions"}`
//                       )}
//                       sx={{
//                         "& .MuiOutlinedInput-root": { alignItems: "baseline" },
//                       }}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start"></InputAdornment>
//                         ),
//                       }}
//                     />
//                   ) : (
//                     <></>
//                   )}
//                 </Grid>
//                 {formDetails?.images && (
//                   <Grid
//                     item
//                     display={{ xs: "flex" }}
//                     flexDirection={{ xs: "column" }}
//                     spacing={{ xs: 2, md: 0 }}
//                   >
//                     <h1>{t("uploadImage")}</h1>
//                     <Stack
//                       display={{ xs: "flex" }}
//                       flexDirection={{ xs: "column", sm: "row" }}
//                       spacing={{ xs: 2, md: 0 }}
//                     >
//                       <UploadImage
//                         type={t("teeth")}
//                         onChange={(base64) =>
//                           handleChangeImage("images[0]", base64)
//                         }
//                         placeholderImg="teeth"
//                       />
//                       <UploadImage
//                         type={t("face")}
//                         onChange={(base64) =>
//                           handleChangeImage("images[1]", base64)
//                         }
//                         placeholderImg="face"
//                       />
//                       <UploadImage
//                         type={t("throat")}
//                         onChange={(base64) =>
//                           handleChangeImage("images[2]", base64)
//                         }
//                         placeholderImg="throat"
//                       />
//                     </Stack>

//                     {/* <Stack
//                       display={{ xs: "flex" }}
//                       flexDirection='column'
//                       spacing={{ xs: 2, md: 1 }}
//                       mt={2}
//                     >
//                       <FormGroup>

//                       <FormLabel sx={{fontSize: 16, fontWeight: 700}}>{t("heart_auscultation")}</FormLabel>
//                       <FormCheck
//                         name={"health_assesment.heart_auscultation"}
//                         control={control}
//                         label={'Normal'}
//                         // @ts-ignore
//                         error={errors?.health_assesment?.heart_auscultation}
//                       />
//                       </FormGroup>


//                       <FormGroup>

//                       <FormLabel
//                       sx={{fontSize: 16, fontWeight: 700}}
//                       >{t("lung_auscultation")}</FormLabel>

//                       <FormCheck
//                         name={"health_assesment.lung_auscultation"}
//                         control={control}
//                         label={'Normal'}
//                         // @ts-ignore
//                         error={errors?.health_assesment?.lung_auscultation}
//                       />
//                       </FormGroup>

                     
//                     </Stack> */}
//                   </Grid>
//                 )}
//               </Grid>
//             </Card>
//           </FormBoxWrapper>
//         </Grid>
//       </Grid>
//     </>
//   );
// }

// export default HealthAssessmentDetails;

