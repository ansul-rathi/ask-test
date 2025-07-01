"use client";
import React, { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import FormCheck from "../form/FormCheck";
import useNavigateLocale from "@/app/hooks/useNavigateLocale";
import { useTranslations } from "next-intl";
import { SubmitHandler } from 'react-hook-form';
import { useParams } from "next/navigation";
import QuestionnaireService from "@/app/services/questionnaire";
import { useUserStore } from "@/app/store/user.store";
import { useAuth } from "@/app/contexts/AuthContext";

const schema = z.object({
  senderEmail: z.string().email(),
  receiverEmail: z.string().email(),
  message: z.string(),
  consent: z.boolean(),
  images: z.boolean(),
});

export default function Hero() {
  const { user, isAuthenticated  } = useAuth();
  console.log("user:::", user)

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
    defaultValues: {
      consent: false,
      images: false,
      message: "",
      receiverEmail: "",
      senderEmail: user?.email || "",
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue('senderEmail', user.email);
    }
  }, [user?.email, setValue]);
  

  const navigateTo = useNavigateLocale();
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslations("Index");
  const routeParams: any = useParams();

  const { deductCredits } = useUserStore();

  const handleSubmitForm: SubmitHandler<any> = async (data) => {
    // return console.log("data:::", data)

    if (isAuthenticated) {
      setLoading(true);
      try {
        const response = await QuestionnaireService.sendQuestionnaire({
          senderEmail: data.senderEmail,
          receiverEmail: data.receiverEmail,
          message: data.message,
          images: data.images,
          consent: data.consent,
          locale: routeParams?.locale || 'en',
        }, (user?.email as string));

        console.log("response : ",response)
        if (response.isSuccess) {
          toast.success('Email sent successfully!');
          await deductCredits(user?.email as string, 1)
          reset();
          setValue('senderEmail', user?.email as string);
        } else {
          toast.error('Failed to send email: ' + response?.error);
        }
      }
      catch (error : any) {
        if(String(error) === "Error: Insufficient credits")
        {
          return toast.warn("Insufficient credits")
        }
        console.error('An error occurred while sending the email:', error);
        toast.error(""+error as String);
      } finally {
        setLoading(false);
      }
    } else {
      navigateTo('/auth/sign-in');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm as any)}>
      <Stack
        direction={{ xs: "column" }}
        alignSelf="right"
        spacing={1}
        useFlexGap
        sx={{
          pt: { xs: 0, sm: 2 },
          width: { xs: "100%" },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2 }}
          sx={{ mt: 3 }}
        >
          <TextField
            id="outlined-basic"
            hiddenLabel
            size="medium"
            fullWidth
            variant="outlined"
            aria-label="Enter your email address"
            placeholder={t("heroFacilityEmail")}
            error={!!errors.senderEmail}
            disabled={isAuthenticated}
            helperText={errors.senderEmail?.message as string}
            defaultValue={user?.email}
            inputProps={{
              autoComplete: "off",
              "aria-label": "Enter your email address",
            }}
            {...register("senderEmail")}
          />
          <TextField
            id="outlined-basic"
            hiddenLabel
            fullWidth
            size="medium"
            variant="outlined"
            aria-label="Enter your email address"
            placeholder={t("heroPatientEmail")}
            error={!!errors.receiverEmail}
            helperText={errors.receiverEmail?.message as string}
            inputProps={{
              autoComplete: "off",
            }}
            {...register("receiverEmail")}
          />
        </Stack>
        <TextField
          id="outlined-basic"
          hiddenLabel
          size="medium"
          variant="outlined"
          aria-label="Message"
          placeholder={t("heroMessage")}
          error={!!errors.message}
          helperText={errors.message?.message as string}
          inputProps={{
            autoComplete: "off",
            "aria-label": "Enter your email address",
          }}
          {...register("message")}
          style={{ marginTop: 20 }}
        />
        <Stack
          display={"flex"}
          flexDirection={{ xs: "column", sm: "row" }}
          marginLeft={{ xs: 1 }}
        >
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <FormCheck
              name={`consent`}
              control={control}
              label={t("heroCheckBox1")}
              // @ts-ignore
              error={""}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <FormCheck
              name={`images`}
              control={control}
              label={t("heroCheckBox2")}
              // @ts-ignore
              error={""}
            />
          </div>
        </Stack>
        <LoadingButton
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-start", marginTop: 2, width: "10vw" }}
          type="submit"
          loading={loading}
        >
          {t("heroSendButton")}
        </LoadingButton>
      </Stack>
    </form>
  );
}
