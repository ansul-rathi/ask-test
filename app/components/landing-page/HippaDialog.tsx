// import React from "react";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import { Typography } from "@mui/material";

// export default function HippaDialog({
//   open,
//   setOpen,
//   onSubmit = () => {},
// }: any) {
//   const handleClose = () => {
//     setOpen(false);
//   };

//   function getCurrentDate() {
//     const date = new Date();
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
//     const year = date.getFullYear();

//     return `${day}-${month}-${year}`;
//   }

//   return (
//     <React.Fragment>
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Business Associate Agreement (BAA)</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             <p>
//               This BAA is entered into between [Covered Entity] and [Business
//               Associate] on {getCurrentDate()}.
//             </p>
//             <Typography variant="h6">1. Definition of PHI:</Typography>
//             <p>
//               For the purposes of this BAA, PHI refers to patient health data
//               transmitted directly to the facility via emailed PDFs, but not
//               stored by the Business Associate.
//             </p>
//             <Typography variant="h6">
//               2. Permitted Uses and Disclosures:
//             </Typography>
//             <p>
//               The Business Associate will only disclose PHI to the registered
//               facility email.
//             </p>
//             <Typography variant="h6">3. Safeguards:</Typography>
//             <p>
//               The Business Associate has implemented administrative, technical,
//               and physical safeguards to protect PHI.
//             </p>
//             <Typography variant="h6">4. Breach Notification:</Typography>
//             <p>
//               Business Associate does not & will not store patient data.
//               Regardless, procedures are in place for reporting and handling
//               breaches of PHI. The Covered Entity is responsible for disclosing
//               any reported breaches of unsecured PHI, within 10 business days of
//               becoming aware of the incident, via electronic mail.
//             </p>
//             <Typography variant="h6">5. Accountability:</Typography>
//             <p>
//               Both the Covered Entity & Business Associate are accountable for
//               protecting PHI and adhering to HIPAA regulations. Covered Entity
//               agrees to notify Business Associate of any limitation to adhere to
//               HIPAA privacy requirements. Each party agrees to comply with
//               applicable provisions of the HITECH Act.
//             </p>
//             <Typography variant="h6">6. Obligations:</Typography>
//             <p>
//               Both the Covered Entity and Business Associate have obligations to
//               report any security incidents or breaches.
//             </p>
//             <Typography variant="h6">7. Term and Termination:</Typography>
//             <p>
//               This BAA will remain in effect throughout the duration of service
//               & will continue until all obligations are met as outlined in this
//               BAA.
//             </p>
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//         </DialogActions>
//       </Dialog>
//     </React.Fragment>
//   );
// }

import React from "react";
import { useTranslations } from "next-intl";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import { useAuth } from "@/app/contexts/AuthContext";

export default function HippaDialog({
  open,
  setOpen,
  onSubmit = () => {},
}: any) {
  const t = useTranslations("Index");
  const { user, isAuthenticated  } = useAuth();

  const handleClose = () => {
    setOpen(false);
  };

  function getCurrentDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("hippaTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>
              {t("hippaEntryText")} {user?.name} {t("hippaEntryTextSecond")} {getCurrentDate()} .
            </p>
            <Typography variant="h6">{t("hippaDefinitionOfPhi")}</Typography>
            <p>{t("hippaDefinitionOfPhiText")}</p>
            <Typography variant="h6">
              {t("hippaPermittedUsesAndDisclosures")}
            </Typography>
            <p>{t("hippaPermittedUsesAndDisclosuresText")}</p>
            <Typography variant="h6">{t("hippaSafeguards")}</Typography>
            <p>{t("hippaSafeguardsText")}</p>
            <Typography variant="h6">{t("hippaBreachNotification")}</Typography>
            <p>{t("hippaBreachNotificationText")}</p>
            <Typography variant="h6">{t("hippaAccountability")}</Typography>
            <p>{t("hippaAccountabilityText")}</p>
            <Typography variant="h6">{t("hippaObligations")}</Typography>
            <p>{t("hippaObligationsText")}</p>
            <Typography variant="h6">{t("hippaTermAndTermination")}</Typography>
            <p>{t("hippaTermAndTerminationText")}</p>
            <p>{t("hippaBottomText")}</p>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("hippaButtonCancel")}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
