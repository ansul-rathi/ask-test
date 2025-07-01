// import React, { useState, useRef } from "react";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import { Box, Stack, Typography } from "@mui/material";
// import SignatureCanvas from "react-signature-canvas";
// import { format } from "date-fns";

// export default function ConsentDialog({
//   open,
//   setOpen,
//   setValue,
//   onSubmit = () => {},
// }: any) {
//   const signatureRef = useRef<any>();

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const [consent, setConsent] = useState({
//     name: "",
//     sign: "",
//   });

//   const [errors, setErrors] = useState({
//     name: "",
//     sign: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setConsent((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     setErrors((prev) => ({ ...prev, [e.target.name]: "" }));

//     if (e.target.name === "name") {
//       setValue("consent.name", e.target.value);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!consent.name) {
//       setErrors((prev) => ({ ...prev, name: "Please fill the value" }));
//       return;
//     } else if (signatureRef.current?.isEmpty()) {
//       setErrors((prev) => ({ ...prev, sign: "Please Sign" }));
//       return;
//     }
//     handleChangeImage(
//       signatureRef.current.getTrimmedCanvas().toDataURL("image/png")
//     ).then(() => {
//       onSubmit();
//       handleClose();
//     });
//   };

//   const clearSignature = () => {
//     if (signatureRef.current) {
//       signatureRef.current.clear();
//     }
//   };

//   const handleChangeImage = async (base64: string) => {
//     setConsent((prev) => ({ ...prev, sign: base64 }));
//     setValue("consent.sign", base64);
//   };
//   return (
//     <React.Fragment>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         // PaperProps={{
//         //   component: "form",
//         // }}
//         fullScreen
//       >
//         <DialogTitle>Anesthesia Consent Form</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             <p>
//               Although rare, unexpected severe complications with anesthesia can
//               occur and include the possibility of:
//             </p>
//             <ul>
//               <li>Dental damage</li>
//               <li>Sore throat</li>
//               <li>Hoarse voice</li>
//               <li>Nerve damage</li>
//               <li>Drug reactions</li>
//               <li>Blood clots</li>
//               <li>Loss of sensation</li>
//               <li>Loss of limb function</li>
//               <li>Paralysis</li>
//               <li>Infection</li>
//               <li>Lung aspiration</li>
//               <li>Headaches</li>
//               <li>Seizures</li>
//               <li>Stroke</li>
//               <li>Brain damage</li>
//               <li>Bleeding</li>
//               <li>Blood vessel damage</li>
//               <li>Awareness under anesthesia</li>
//               <li>Heart attack or death</li>
//               <li>Vision disturbance</li>
//               <li>Organ damage / dysfunction</li>
//             </ul>

//             <p>These risks are higher based on:</p>
//             <ul>
//               <li>Patient’s baseline medical condition</li>
//               <li>If the patient withholds pertinent medical information</li>
//               <li>
//                 Does not follow medical instructions of when to stop medications
//               </li>
//               <li>If the patient eats food within 8 hours of the procedure</li>
//             </ul>

//             <p>Anesthetic technique is determined by many factors including:</p>
//             <ul>
//               <li>My physical condition</li>
//               <li>The type of procedure</li>
//               <li>My doctor’s preference</li>
//               <li>My own preference</li>
//             </ul>

//             <p>Types of anesthesia include:</p>
//             <ul>
//               <li>
//                 General Anesthesia – unconscious, may require airway
//                 intervention
//               </li>
//               <li>
//                 Regional Anesthesia – utilizing local anesthetics to numb a
//                 certain area of the body, will result in decreased sensation /
//                 movement of the affected area
//               </li>
//               <li>
//                 Monitored Anesthesia – sedated, but conscious. Reduced anxiety,
//                 reduced pain, may result in partial amnesia
//               </li>
//             </ul>

//             <p>
//               All forms of anesthesia will require intravenous access. You will
//               have an opportunity prior to the procedure to have any remaining
//               questions answered.
//             </p>

//             <TextField
//               required
//               margin="dense"
//               id="name"
//               name="name"
//               label="Your Name"
//               placeholder="Enter your name"
//               value={consent.name || ""}
//               onChange={handleChange}
//               fullWidth
//               variant="filled"
//               error={!!errors.name}
//               helperText={errors.name}
//             />
//             <ul>
//               <li>
//                 I,{" "}
//                 <span
//                   style={{
//                     minWidth: 80,
//                     display: "inline-block",
//                     borderBottom: "1px solid gray",
//                   }}
//                 >
//                   {consent.name}
//                 </span>{" "}
//                 certify and acknowledge that I have read this form.{" "}
//               </li>
//               <li>
//                 I,{" "}
//                 <span
//                   style={{
//                     minWidth: 80,
//                     display: "inline-block",
//                     borderBottom: "1px solid gray",
//                   }}
//                 >
//                   {consent.name}
//                 </span>
//                 , understand the risks of the procedure.
//               </li>
//               <li>
//                 I,{" "}
//                 <span
//                   style={{
//                     minWidth: 80,
//                     display: "inline-block",
//                     borderBottom: "1px solid gray",
//                   }}
//                 >
//                   {consent.name}
//                 </span>
//                 , consent to anesthesia services and authorize that it be
//                 administered as deemed appropriate by them.
//               </li>
//             </ul>
//             <Box
//               sx={{
//                 backgroundColor: "white",
//                 border: "1px solid black",
//                 height: "150px",
//                 // width: "100vw", // Using vw for the Box
//                 display: "flex", // Flex display to make canvas take full width
//               }}
//             >
//               <SignatureCanvas
//                 ref={signatureRef}
//                 penColor="black"
//                 dotSize={1}
//                 backgroundColor="white"
//                 canvasProps={{
//                   style: { width: "100%", height: "100%" }, // Make canvas take full width and height of Box
//                 }}
//               />
//               {/* <UploadImage
//           type="Signature"
//           onChange={(base64) => handleChangeImage(base64)}
//         /> */}
//             </Box>
//             {errors.sign && !consent.sign ? (
//               <Typography color="error" variant="body1">
//                 Please sign
//               </Typography>
//             ) : (
//               <></>
//             )}
//             <Stack
//               direction="row"
//               textAlign="center"
//               alignItems="center"
//               justifyContent="space-between"
//               m={0.5}
//             >
//               <Typography>(Please Sign above:)</Typography>
//               <Button onClick={clearSignature}>Clear</Button>
//             </Stack>
//             <Stack direction="row" justifyContent="end">
//               <Typography>Date: {format(new Date(), "MM/dd/yyyy")}</Typography>
//             </Stack>
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button onClick={handleSubmit}>Continue</Button>
//         </DialogActions>
//       </Dialog>
//     </React.Fragment>
//   );
// }

import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack, Typography } from "@mui/material";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

const SignaturePad = SignatureCanvas as any;


export default function ConsentDialog({
  open,
  setOpen,
  setValue,
  onSubmit = () => {},
}: any) {
  const t = useTranslations("Index");
  const signatureRef = useRef<any>();

  const handleClose = () => {
    setOpen(false);
  };

  const [consent, setConsent] = useState({
    name: "",
    sign: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    sign: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsent((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));

    if (e.target.name === "name") {
      setValue("consent.name", e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (!consent.name) {
      setErrors((prev) => ({ ...prev, name: t("consentPleaseFillValue") }));
      return;
    } else if (signatureRef.current?.isEmpty()) {
      setErrors((prev) => ({ ...prev, sign: t("consentPleaseSign") }));
      return;
    }
    handleChangeImage(
      signatureRef.current.getTrimmedCanvas().toDataURL("image/png")
    ).then(() => {
      onSubmit();
      handleClose();
    });
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleChangeImage = async (base64: string) => {
    setConsent((prev) => ({ ...prev, sign: base64 }));
    setValue("consent.sign", base64);
  };
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} fullScreen>
        <DialogTitle>{t("consentDialogTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>{t("consentDialogContentText1")}</p>
            <ul>
              <li>{t("consentDentalDamage")}</li>
              <li>{t("consentSoreThroat")}</li>
              <li>{t("consentHoarseVoice")}</li>
              <li>{t("consentNerveDamage")}</li>
              <li>{t("consentDrugReactions")}</li>
              <li>{t("consentBloodClots")}</li>
              <li>{t("consentLossOfSensation")}</li>
              <li>{t("consentLossOfLimbFunction")}</li>
              <li>{t("consentParalysis")}</li>
              <li>{t("consentInfection")}</li>
              <li>{t("consentLungAspiration")}</li>
              <li>{t("consentHeadaches")}</li>
              <li>{t("consentSeizures")}</li>
              <li>{t("consentStroke")}</li>
              <li>{t("consentBrainDamage")}</li>
              <li>{t("consentBleeding")}</li>
              <li>{t("consentBloodVesselDamage")}</li>
              <li>{t("consentAwarenessUnderAnesthesia")}</li>
              <li>{t("consentHeartAttackOrDeath")}</li>
              <li>{t("consentVisionDisturbance")}</li>
              <li>{t("consentOrganDamageDysfunction")}</li>
            </ul>
            <p>{t("consentRisksAreHigherBasedOn")}</p>
            <ul>
              <li>{t("consentPatientsBaselineMedicalCondition")}</li>
              <li>
                {t("consentIfPatientWithholdsPertinentMedicalInformation")}
              </li>
              <li>{t("consentDoesNotFollowMedicalInstructions")}</li>
              <li>{t("consentIfPatientEatsFoodWithin8Hours")}</li>
            </ul>
            <p>{t("consentAnestheticTechniqueDeterminedBy")}</p>
            <ul>
              <li>{t("consentMyPhysicalCondition")}</li>
              <li>{t("consentTypeOfProcedure")}</li>
              <li>{t("consentMyDoctorsPreference")}</li>
              <li>{t("consentMyOwnPreference")}</li>
            </ul>
            <p>{t("consentTypesOfAnesthesiaInclude")}</p>
            <ul>
              <li>{t("consentGeneralAnesthesia")}</li>
              <li>{t("consentRegionalAnesthesia")}</li>
              <li>{t("consentMonitoredAnesthesia")}</li>
            </ul>
            <p>{t("consentAllFormsOfAnesthesiaRequireIV")}</p>
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              label={t("consentYourName")}
              placeholder={t("consentEnterYourName")}
              value={consent.name || ""}
              onChange={handleChange}
              fullWidth
              variant="filled"
              error={!!errors.name}
              helperText={errors.name}
            />
            <ul>
              <li>
                {t("consentCertifyAndAcknowledge")}{" "}
                <span
                  style={{
                    minWidth: 80,
                    display: "inline-block",
                    borderBottom: "1px solid gray",
                  }}
                >
                  {consent.name}
                </span>{" "}
                {t("consentReadForm")}
              </li>
              <li>
                {t("consentUnderstandRisks")}{" "}
                <span
                  style={{
                    minWidth: 80,
                    display: "inline-block",
                    borderBottom: "1px solid gray",
                  }}
                >
                  {consent.name}
                </span>
              </li>
              <li>
                {t("consentConsentToAnesthesia")}{" "}
                <span
                  style={{
                    minWidth: 80,
                    display: "inline-block",
                    borderBottom: "1px solid gray",
                  }}
                >
                  {consent.name}
                </span>
              </li>
            </ul>
            <Box
              sx={{
                backgroundColor: "white",
                border: "1px solid black",
                height: "150px",
                display: "flex",
              }}
            >
              <SignaturePad
                ref={signatureRef as any}
                penColor="black"
                dotSize={1}
                backgroundColor="white"
                canvasProps={{
                  style: { width: "100%", height: "100%" },
                }}
              />
            </Box>
            {errors.sign && !consent.sign ? (
              <Typography color="error" variant="body1">
                {t("consentPleaseSign")}
              </Typography>
            ) : (
              <></>
            )}
            <Stack
              direction="row"
              textAlign="center"
              alignItems="center"
              justifyContent="space-between"
              m={0.5}
            >
              <Typography>{t("consentPleaseSignAbove")}</Typography>
              <Button onClick={clearSignature}>{t("consentClear")}</Button>
            </Stack>
            <Stack direction="row" justifyContent="end">
              <Typography>
                {t("consentDate")}: {format(new Date(), "MM/dd/yyyy")}
              </Typography>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("consentCancel")}</Button>
          <Button onClick={handleSubmit}>{t("consentContinue")}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
