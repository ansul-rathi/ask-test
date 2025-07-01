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

function PreOpAssessment() {
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
              <Heading label="Anesthesia Pre-op Assessment" />
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontWeight: 700 }}>
                Anesthesia History
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl>
                <FormLabel>
                  History of high fever after anesthesia in you or family member
                  ?(Malignant Hyperthermia)
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
                <FormLabel>
                  History of nausea/vomiting after anesthesia?
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
                <FormLabel>Any other known problems ith anesthesia?</FormLabel>
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
              <Typography sx={{ fontWeight: 700 }}>
                Patient Medical History
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>CARDIOVASCULAR</Typography>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex" }}>
              <FormControl sx={{ width: "25%" }}>
                <FormLabel>Heart Attack Date</FormLabel>
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

              <FormControl sx={{ width: "25%" }}>
                <FormLabel>Irregular heartbeat</FormLabel>
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
              <FormControl sx={{ width: "25%" }}>
                <FormLabel>Stress test-Date</FormLabel>
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
              <FormControl sx={{ width: "25%" }}>
                <FormLabel>
                  Heart catheterization to look for blockage
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

            <Grid item xs={12} sx={{ display: "flex" }}>
              <FormControl sx={{ width: "25%" }}>
                <FormLabel>History of congestive heart failure</FormLabel>
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

              <FormControl sx={{ width: "25%" }}>
                <FormLabel>Recent Chest pain</FormLabel>
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
              <FormControl sx={{ width: "25%" }}>
                <FormLabel>High Blood pressure</FormLabel>
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
              <FormControl sx={{ width: "25%" }}>
                <FormLabel>History of heart valve problem</FormLabel>
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
              <FormControl sx={{ width: "25%" }}>
                <FormLabel>
                  Ever had heart stents,angioplasty, or heart bypass surgery
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
              <FormControl sx={{ width: "25%" }}>
                <FormLabel>Pacemaker or Defibrillator</FormLabel>
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
              <Typography sx={{ fontWeight: 700 }}>RESPIRATORY</Typography>

              <Grid item xs={12}>
                <FormControl sx={{ width: "25%" }}>
                  <FormLabel>Asthma</FormLabel>
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
                <FormControl sx={{ width: "25%" }}>
                  <FormLabel>COPD</FormLabel>
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
                <FormControl sx={{ width: "25%" }}>
                  <FormLabel>Pneumonia or bronchitis,in past 6 wks</FormLabel>
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
                <FormControl sx={{ width: "25%" }}>
                  <FormLabel>Exposure to TB</FormLabel>
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
            </Grid>





            <Grid item xs={12}>
              <Typography sx={{ fontWeight: 700 }}>ENDOCRINE</Typography>

              <Grid item xs={12}>
                <FormControl sx={{ width: "25%" }}>
                  <FormLabel>
                    Diabetes on insulin /oral med./both(circle)
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
                <FormControl sx={{ width: "25%" }}>
                  <FormLabel>
                    Thyroid Disease
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
              
                <FormControl sx={{ width: "25%" }}>
                  <FormLabel>Exposure to TB</FormLabel>
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
        </FormBoxWrapper>
      </Grid>
    </Grid>
  );
}

export default PreOpAssessment;
