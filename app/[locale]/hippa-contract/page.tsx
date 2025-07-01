"use client";
import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
  Stack,
} from "@mui/material";
import useNavigateLocale from "@/app/hooks/useNavigateLocale";

import HippaDialog from "@/app/components/landing-page/HippaDialog";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import HippaContractService from "@/app/services/hippa-contract";
import AppHeader from "@/app/components/layout/AppHeader";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useUserStore } from "@/app/store/user.store";
import { useAuth } from "@/app/contexts/AuthContext";
import UploadImage from "../patient/[formid]/component/UploadImage";
import SignatureCanvas from "react-signature-canvas";

interface IFormInput {
  emailId: string;
  name: string;
  facilityEmail: string;
  city: string;
  country: string;
  facilityName: string;
  acceptHippa: boolean;
  submitted: boolean;
  profileImage: string;
  signature: string;
}
const SignaturePad = SignatureCanvas as any;

const HippaContract: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hippaContract, setHippaContract] = useState(false);
  const [showConcentDialog, setShowConcentDialog] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const signatureRef = useRef<SignatureCanvas>(null);
  const t = useTranslations("Index");
  const { userDetails } = useUserStore();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    register,
  } = useForm<IFormInput>({
    defaultValues: {
      emailId: String(userDetails?.email) || "",
      name: "",
      facilityEmail: user?.email || "",
      city: "",
      country: "",
      facilityName: "",
      acceptHippa: false,
      submitted: false,
      profileImage: "",
      signature: "",
    },
  });
  const router = useRouter();
  const navigateTo = useNavigateLocale();

  const routeParams = useParams()
  const locale = routeParams?.locale;

  const handleChangeImage = (type: string, base64: string) => {
    if (type === "profile") {
      setProfileImage(base64);
      setValue("profileImage", base64);
    }
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setValue("signature", "");
    }
  };

  const generateAndUploadPDF = async (formData: IFormInput): Promise<{ s3Key: string; accessUrl: string }> => {
    try {
      const response = await fetch('/api/upload-hipaa-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          emailId: formData.emailId,
          facilityEmail: formData.facilityEmail,
          city: formData.city,
          country: formData.country,
          facilityName: formData.facilityName,
          profileImage: formData.profileImage,
          signature: formData.signature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload PDF');
      }

      const result = await response.json();
      return {
        s3Key: result.s3Key,
        accessUrl: result.accessUrl
      };
    } catch (error) {
      console.error('Error generating or uploading PDF:', error);
      throw error;
    }
  };

  const onSubmit = async (data: IFormInput) => {
    // Get signature data if exists
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      data.signature = signatureRef.current.toDataURL();
    } else if (!data.signature) {
      // Show error if signature is required
      return toast.error(t("consentPleaseSign"));
    }

    // Add profile image if exists
    if (profileImage) {
      data.profileImage = profileImage;
    }

    setLoading(true);
    try {
      // Generate and upload PDF via API
      toast.info("Generating PDF...", { autoClose: 2000 });
      const { s3Key, accessUrl } = await generateAndUploadPDF(data);
      
      if (s3Key) {
        toast.success("PDF generated and uploaded successfully!");
        
        // Add S3 key to form data (store the key, not the temporary URL)
        const formDataWithPDF = { 
          ...data, 
          pdfS3Key: s3Key,  // Store the permanent S3 key
          pdfGeneratedAt: new Date().toISOString()
        };
        
        // Save form data (including S3 key) to your existing service
        // const response = await HippaContractService.saveHippaContract(formDataWithPDF);
        const response = await HippaContractService.saveHippaContract(data);
        
        toast.success("Your response has been submitted successfully : ",response);
        
        // Optional: Show user they can download the PDF
        // if (window.confirm("Would you like to download your HIPAA contract PDF?")) {
        //   // Open temporary access URL in new tab for download
        //   window.open(accessUrl, '_blank');
        // }
        
        navigateTo("/");
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Error submitting form");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "100%" },
        maxWidth: "600px",
        margin: "auto",
        paddingTop: 10,
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <AppHeader locale={String(locale) || "en"} />
      <Typography
        fontSize={24}
        fontWeight={800}
        marginLeft={1}
        marginBottom={2}
      >
        {t("hippaContractFormTitle")}
      </Typography>

      <Grid container spacing={2}>
        {/* Profile Image Upload */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'left', mt: 2, mb: 2 , ml: 1}}>
          <UploadImage
            // type={t("profile")}
            type={"Profile"}
            onChange={(base64) => handleChangeImage("profile", base64)}
            placeholderImg="face"
          />
        </Grid>

        {/* Name */}
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("hippaContractNameLabel")}
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name ? t("hippaContractNameRequired") : ""}
              />
            )}
            rules={{ required: true }}
          />
        </Grid>

        {/* Facility Email */}
        <Grid item xs={12}>
          <Controller
            name="facilityEmail"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("hippaContractFacilityEmailLabel")}
                variant="outlined"
                error={!!errors.facilityEmail}
                disabled={true}
                helperText={
                  errors.facilityEmail
                    ? t("hippaContractFacilityEmailRequired")
                    : ""
                }
              />
            )}
            rules={{ required: true }}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("hippaContractCityLabel")}
                variant="outlined"
                error={!!errors.city}
                helperText={errors.city ? t("hippaContractCityRequired") : ""}
              />
            )}
            rules={{ required: true }}
          />
        </Grid>

        {/* Country */}
        <Grid item xs={12}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("hippaContractCountryLabel")}
                variant="outlined"
                error={!!errors.country}
                helperText={
                  errors.country ? t("hippaContractCountryRequired") : ""
                }
              />
            )}
            rules={{ required: true }}
          />
        </Grid>

        {/* Facility Name */}
        <Grid item xs={12}>
          <Controller
            name="facilityName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("hippaContractFacilityNameLabel")}
                variant="outlined"
                error={!!errors.facilityName}
                helperText={
                  errors.facilityName
                    ? t("hippaContractFacilityNameRequired")
                    : ""
                }
              />
            )}
            rules={{ required: true }}
          />
        </Grid>

        {/* Signature Pad */}
        <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
          <Typography variant="body1" mb={1} ml={1}>
            {/* {t("signature")} */}
            Signature
          </Typography>
          <Box
            sx={{
              backgroundColor: "white",
              height: "150px",
              display: "flex",
              width: "100%",
              ml: 1,
            }}
          >
            <SignaturePad
              ref={signatureRef}
              penColor="black"
              dotSize={1}
              backgroundColor="white"
              canvasProps={{
                style: {
                  width: "100%", height: "100%", 
                  border: "1px solid black",
                  borderRadius: 10,
                },
              }}
            />
          </Box>
          {errors.signature && (
            <Typography color="error" variant="body1" sx={{ ml: 1 }}>
              {t("consentPleaseSign")}
            </Typography>
          )}
          <Stack
            direction="row"
            textAlign="center"
            alignItems="center"
            justifyContent="space-between"
            m={1}
          >
            <Typography>{t("consentPleaseSignAbove")}</Typography>
            <Button onClick={clearSignature}>{t("consentClear")}</Button>
          </Stack>
        </Grid>

        {/* Accept HIPAA */}
        <Grid item xs={12} marginLeft={1}>
          <Controller
            name="acceptHippa"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setHippaContract(e.target.checked);
                    }}
                  />
                }
                label={
                  <>
                    {t("hippaContractAcceptHippaLabel")}
                    <span
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => setShowConcentDialog(true)}
                    >
                      {t("hippaContractHippaContract")}
                    </span>
                  </>
                }
              />
            )}
            rules={{ required: true }}
          />
        </Grid>

        {/* Accept HIPAA Error */}
        {errors.acceptHippa && (
          <Grid item xs={12}>
            <Typography color="error">
              {t("hippaContractAcceptHippaRequired")}
            </Typography>
          </Grid>
        )}

        {/* Submit Button */}
        <Grid item xs={12} sx={{ ml: 1, mb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!hippaContract || loading}
            sx={{ width: '200px' }}
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: "white" }} />
            ) : (
              t("hippaContractSubmitButton")
            )}
          </Button>
        </Grid>
      </Grid>

      {/* HIPAA Dialog */}
      {showConcentDialog && (
        <HippaDialog
          key="hippa-dialog"
          open={showConcentDialog}
          setOpen={setShowConcentDialog}
          onSubmit={onSubmit}
        />
      )}
    </Box>
  );
};

export default HippaContract;
// "use client";
// import React, { useState, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   FormControlLabel,
//   Checkbox,
//   Grid,
//   CircularProgress,
//   Stack,
// } from "@mui/material";
// import useNavigateLocale from "@/app/hooks/useNavigateLocale";

// import HippaDialog from "@/app/components/landing-page/HippaDialog";
// import { useTranslations } from "next-intl";
// import { toast } from "react-toastify";
// import HippaContractService from "@/app/services/hippa-contract";
// import AppHeader from "@/app/components/layout/AppHeader";
// import { useRouter } from "@/i18n/routing";
// import { useParams } from "next/navigation";
// import { useUserStore } from "@/app/store/user.store";
// import { useAuth } from "@/app/contexts/AuthContext";
// import UploadImage from "../patient/[formid]/component/UploadImage";
// import SignatureCanvas from "react-signature-canvas";

// interface IFormInput {
//   emailId: string;
//   name: string;
//   facilityEmail: string;
//   city: string;
//   country: string;
//   facilityName: string;
//   acceptHippa: boolean;
//   submitted: boolean;
//   profileImage: string;
//   signature: string;
// }
// const SignaturePad = SignatureCanvas as any;

// const HippaContract: React.FC = () => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [hippaContract, setHippaContract] = useState(false);
//   const [showConcentDialog, setShowConcentDialog] = useState(false);
//   const [profileImage, setProfileImage] = useState<string>("");
//   const signatureRef = useRef<SignatureCanvas>(null);
//   const t = useTranslations("Index");
//   const { userDetails } = useUserStore();

//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     setValue,
//     register,
//   } = useForm<IFormInput>({
//     defaultValues: {
//       emailId: String(userDetails?.email) || "",
//       name: "",
//       facilityEmail: user?.email || "",
//       city: "",
//       country: "",
//       facilityName: "",
//       acceptHippa: false,
//       submitted: false,
//       profileImage: "",
//       signature: "",
//     },
//   });
//   const router = useRouter();
//   const navigateTo = useNavigateLocale();

//   const routeParams = useParams()
//   const locale = routeParams?.locale;

//   const handleChangeImage = (type: string, base64: string) => {
//     if (type === "profile") {
//       setProfileImage(base64);
//       setValue("profileImage", base64);
//     }
//   };

//   const clearSignature = () => {
//     if (signatureRef.current) {
//       signatureRef.current.clear();
//       setValue("signature", "");
//     }
//   };

//   const onSubmit = async (data: IFormInput) => {
//     // Get signature data if exists
//     if (signatureRef.current && !signatureRef.current.isEmpty()) {
//       data.signature = signatureRef.current.toDataURL();
//     } else if (!data.signature) {
//       // Show error if signature is required
//       return toast.error(t("consentPleaseSign"));
//     }

//     // Add profile image if exists
//     if (profileImage) {
//       data.profileImage = profileImage;
//     }

//     setLoading(true);
//     try {
//       const response = await HippaContractService.saveHippaContract(data);
//       toast.success("Your response has been submitted successfully");
//       navigateTo("/");
//     } catch (error) {
//       toast.error("Error submitting form");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <Box
//       component="form"
//       sx={{
//         "& .MuiTextField-root": { m: 1, width: "100%" },
//         maxWidth: "600px",
//         margin: "auto",
//         paddingTop: 10,
//       }}
//       noValidate
//       autoComplete="off"
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       <AppHeader locale={String(locale) || "en"} />
//       <Typography
//         fontSize={24}
//         fontWeight={800}
//         marginLeft={1}
//         marginBottom={2}
//       >
//         {t("hippaContractFormTitle")}
//       </Typography>

//       <Grid container spacing={2}>
//         {/* Profile Image Upload */}
//         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'left', mt: 2, mb: 2 , ml: 1}}>
//           <UploadImage
//             // type={t("profile")}
//             type={"Profile"}
//             onChange={(base64) => handleChangeImage("profile", base64)}
//             placeholderImg="face"
//           />
//         </Grid>

//         {/* Name */}
//         <Grid item xs={12}>
//           <Controller
//             name="name"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label={t("hippaContractNameLabel")}
//                 variant="outlined"
//                 error={!!errors.name}
//                 helperText={errors.name ? t("hippaContractNameRequired") : ""}
//               />
//             )}
//             rules={{ required: true }}
//           />
//         </Grid>

//         {/* Facility Email */}
//         <Grid item xs={12}>
//           <Controller
//             name="facilityEmail"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label={t("hippaContractFacilityEmailLabel")}
//                 variant="outlined"
//                 error={!!errors.facilityEmail}
//                 disabled={true}
//                 helperText={
//                   errors.facilityEmail
//                     ? t("hippaContractFacilityEmailRequired")
//                     : ""
//                 }
//               />
//             )}
//             rules={{ required: true }}
//           />
//         </Grid>

//         {/* City */}
//         <Grid item xs={12}>
//           <Controller
//             name="city"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label={t("hippaContractCityLabel")}
//                 variant="outlined"
//                 error={!!errors.city}
//                 helperText={errors.city ? t("hippaContractCityRequired") : ""}
//               />
//             )}
//             rules={{ required: true }}
//           />
//         </Grid>

//         {/* Country */}
//         <Grid item xs={12}>
//           <Controller
//             name="country"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label={t("hippaContractCountryLabel")}
//                 variant="outlined"
//                 error={!!errors.country}
//                 helperText={
//                   errors.country ? t("hippaContractCountryRequired") : ""
//                 }
//               />
//             )}
//             rules={{ required: true }}
//           />
//         </Grid>

//         {/* Facility Name */}
//         <Grid item xs={12}>
//           <Controller
//             name="facilityName"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label={t("hippaContractFacilityNameLabel")}
//                 variant="outlined"
//                 error={!!errors.facilityName}
//                 helperText={
//                   errors.facilityName
//                     ? t("hippaContractFacilityNameRequired")
//                     : ""
//                 }
//               />
//             )}
//             rules={{ required: true }}
//           />
//         </Grid>

//         {/* Signature Pad */}
//         <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
//           <Typography variant="body1" mb={1} ml={1}>
//             {/* {t("signature")} */}
//             Signature
//           </Typography>
//           <Box
//             sx={{
//               backgroundColor: "white",
//               height: "150px",
//               display: "flex",
//               width: "100%",
//               ml: 1,
//             }}
//           >
//             <SignaturePad
//               ref={signatureRef}
//               penColor="black"
//               dotSize={1}
//               backgroundColor="white"
//               canvasProps={{
//                 style: {
//                   width: "100%", height: "100%", 
//                   border: "1px solid black",
//                   borderRadius: 10,
//                 },
//               }}
//             />
//           </Box>
//           {errors.signature && (
//             <Typography color="error" variant="body1" sx={{ ml: 1 }}>
//               {t("consentPleaseSign")}
//             </Typography>
//           )}
//           <Stack
//             direction="row"
//             textAlign="center"
//             alignItems="center"
//             justifyContent="space-between"
//             m={1}
//           >
//             <Typography>{t("consentPleaseSignAbove")}</Typography>
//             <Button onClick={clearSignature}>{t("consentClear")}</Button>
//           </Stack>
//         </Grid>

//         {/* Accept HIPAA */}
//         <Grid item xs={12} marginLeft={1}>
//           <Controller
//             name="acceptHippa"
//             control={control}
//             render={({ field }) => (
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       setHippaContract(e.target.checked);
//                     }}
//                   />
//                 }
//                 label={
//                   <>
//                     {t("hippaContractAcceptHippaLabel")}
//                     <span
//                       style={{ textDecoration: "underline", cursor: "pointer" }}
//                       onClick={() => setShowConcentDialog(true)}
//                     >
//                       {t("hippaContractHippaContract")}
//                     </span>
//                   </>
//                 }
//               />
//             )}
//             rules={{ required: true }}
//           />
//         </Grid>

//         {/* Accept HIPAA Error */}
//         {errors.acceptHippa && (
//           <Grid item xs={12}>
//             <Typography color="error">
//               {t("hippaContractAcceptHippaRequired")}
//             </Typography>
//           </Grid>
//         )}

//         {/* Submit Button */}
//         <Grid item xs={12} sx={{ ml: 1, mb: 3 }}>
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={!hippaContract || loading}
//             sx={{ width: '200px' }}
//           >
//             {loading ? (
//               <CircularProgress size={20} style={{ color: "white" }} />
//             ) : (
//               t("hippaContractSubmitButton")
//             )}
//           </Button>
//         </Grid>
//       </Grid>

//       {/* HIPAA Dialog */}
//       {showConcentDialog && (
//         <HippaDialog
//           key="hippa-dialog"
//           open={showConcentDialog}
//           setOpen={setShowConcentDialog}
//           onSubmit={onSubmit}
//         />
//       )}
//     </Box>
//   );
// };

// export default HippaContract;