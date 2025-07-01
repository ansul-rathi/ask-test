import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
  } from "@mui/material";
  import { useTranslations } from "next-intl";
  
  interface ConsentSubmitDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
  }
  
  export default function ConsentSubmitDialog({
    open,
    onClose,
    onSubmit,
  }: ConsentSubmitDialogProps) {
    const t = useTranslations("Consent");
  
    const handleSubmit = () => {
      onClose();
      onSubmit();
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t("consentTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("contentText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary"
            variant="contained"
          >
            {t("agree")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }