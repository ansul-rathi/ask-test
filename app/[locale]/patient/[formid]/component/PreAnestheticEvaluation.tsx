import {
  Grid,
  TextField,
  FormControl,
  InputAdornment,
  RadioGroup,
  Stack,
  FormLabel,
  FormControlLabel,
  Radio,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import { FormBoxWrapper } from "./CustomFormWrapper";
import Heading from "@/app/components/Heading";

import { useFormContext } from "react-hook-form";

function PreAnestheticEvaluation() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={2} sx={{ mt: 3 }}>
      <Grid item xs={12}>
        <FormBoxWrapper>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Heading label="Please complete this form prior to your Pre-Anesthehtic Evaluation" />
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontWeight: 700 }}>
                I AGREE TO HAVE NOTHING BY MOUTH AFTER MIDNIGHT THE NIGHT BEFORE
                MY SURGERY UNLESS INSTRUCTED TO DO SO
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Height"
                type="text"
                fullWidth
                error={!!errors.senderEmail}
                helperText={errors.senderEmail?.message as any}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Weight"
                type="text"
                fullWidth
                error={!!errors.senderEmail}
                helperText={errors.senderEmail?.message as any}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                type="text"
                fullWidth
                error={!!errors.senderEmail}
                helperText={errors.senderEmail?.message as any}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Allergies (Medication,Latex,Food,Other)"
                placeholder="Kind of Surgery ..."
                sx={{
                  "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* <Icon icon='mdi:message-outline' /> */}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Is this your first Anesthetic?</FormLabel>
                <RadioGroup
                  row
                  // value={brokenBone}
                  // onChange={(e) => setBrokenBone(e.target.value)}
                  defaultValue="yesBleedDisea"
                  aria-label="address type"
                  name="form-layouts-collapsible-address-radio"
                >
                  <FormControlLabel
                    value="yesBrokenBone"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="noBrokenBone"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>
                  Have you ever had problems with aneshetic ?
                </FormLabel>
                <RadioGroup
                  row
                  // value={brokenBone}
                  // onChange={(e) => setBrokenBone(e.target.value)}
                  defaultValue="yesBleedDisea"
                  aria-label="address type"
                  name="form-layouts-collapsible-address-radio"
                >
                  <FormControlLabel
                    value="yesBrokenBone"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="noBrokenBone"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Specify"
                placeholder="If Yes, please specify..."
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

            <Grid item xs={12}>
              <FormControl>
                <FormLabel>
                  If female,date of last menstrual period?(If menopausal include
                  year of last period)
                </FormLabel>
                <RadioGroup
                  row
                  // value={brokenBone}
                  // onChange={(e) => setBrokenBone(e.target.value)}
                  defaultValue="yesBleedDisea"
                  aria-label="address type"
                  name="form-layouts-collapsible-address-radio"
                >
                  <FormControlLabel
                    value="yesBrokenBone"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="noBrokenBone"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Specify"
                placeholder="If Yes, please specify..."
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

            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Are you or could you be pregnant ?</FormLabel>
                <RadioGroup
                  row
                  // value={brokenBone}
                  // onChange={(e) => setBrokenBone(e.target.value)}
                  defaultValue="yesBleedDisea"
                  aria-label="address type"
                  name="form-layouts-collapsible-address-radio"
                >
                  <FormControlLabel
                    value="yesBrokenBone"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="noBrokenBone"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Are you currently taking any prescription /over-the-countermedications,herbal, and/or dietarysupplements; listedication & dosage"
                placeholder="Are you currently taking any prescription /over-the-countermedications,herbal, and/or dietarysupplements; listedication & dosage."
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

            <Grid item xs={12}>
              <Typography sx={{ fontWeight: 700 }}>
                DO YOU HAVE OR HAVE YOU HAD:
              </Typography>

              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>
                    Heart Disease ( including: heart murmur, pacemaker ,
                    catheterizaion, stents,surgery, mitral valve prolapse)
                  </FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Specify"
                  placeholder="If Yes, please specify..."
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

              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>Chest pain</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Specify"
                  placeholder="If Yes, please specify..."
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

              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>Do you exercise regularly</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="What type"
                  placeholder="If Yes, please specify..."
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

              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>
                    Previous EKG/stress test/echocardiogram Date(s)
                  </FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>High blood pressure</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Asthma Hospitalizations</FormLabel>
                  <RadioGroup
                    row
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="How many"
                  type="text"
                  fullWidth
                  error={!!errors.senderEmail}
                  helperText={errors.senderEmail?.message as any}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Lung Disease</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Specify"
                  placeholder="If Yes, please specify..."
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

              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Chronic cough</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Shortness of breath</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Sleep Apnea</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Crap</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Abnormal chest x-ray</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Kidney Disease</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Specify"
                  placeholder="If Yes, please specify..."
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
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Difficulty voiding</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Liver Disease/Hepatitis/Jaundice</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Specify"
                  placeholder="If Yes, please specify..."
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
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Diabetes</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Year diagonised"
                  type="text"
                  fullWidth
                  error={!!errors.senderEmail}
                  helperText={errors.senderEmail?.message as any}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Do you take insulin</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Are you on special diet</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Specify"
                  placeholder="If Yes, please specify..."
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
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Recent weight loss</FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="How much"
                  type="text"
                  fullWidth
                  error={!!errors.senderEmail}
                  helperText={errors.senderEmail?.message as any}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel>
                    Epilepsy/Seizures/Stroke/Neurological problems
                  </FormLabel>
                  <RadioGroup
                    row
                    // value={brokenBone}
                    // onChange={(e) => setBrokenBone(e.target.value)}
                    defaultValue="yesBleedDisea"
                    aria-label="address type"
                    name="form-layouts-collapsible-address-radio"
                  >
                    <FormControlLabel
                      value="yesBrokenBone"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="noBrokenBone"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Specify"
                  type="text"
                  fullWidth
                  error={!!errors.senderEmail}
                  helperText={errors.senderEmail?.message as any}
                />
              </Grid>
            </Grid>
          </Grid>
        </FormBoxWrapper>
      </Grid>
    </Grid>
  );
}

export default PreAnestheticEvaluation;
