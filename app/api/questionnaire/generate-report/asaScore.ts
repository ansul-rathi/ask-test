import { isAfter, subMonths } from "date-fns";
import { calculateAge, calculateBMI } from "./utils";

export function calculateASAScore(healthData: any): number {
  let score = 1; // let's start with healthy person

  const patientHeightFeet = Number(healthData.patient_information?.height_feet);
  const patientHeightInches = Number(
    healthData.patient_information?.height_inches
  );
  const patientWeight = Number(healthData.patient_information?.weight);
  const { bmi } = calculateBMI(
    patientHeightFeet,
    patientHeightInches,
    patientWeight
  );

  // ASA SCORE 2---------------------------------------------------
  // to check if the asa score is 2:

  // BMI less than 18 or 30-39 = ASA 2
  if (bmi && (bmi < 18 || (bmi >= 30 && bmi < 40))) {
    score = Math.max(score, 2);
  }

  // If any Health assessment box other than the ASA1 listed above is selected then the ASA score will be 2
  const health_assesment = healthData?.health_assesment;

  const asa2_count = countTrueValues(health_assesment, [
    "physical_limitations",
    "do_you_snore",
    "feel_tired_daytime",
    "stop_breathing_sleep",
    "blood_transfusion_past",
    "kidney_stones",
    "esophagus_stricture_surgery",
    "psychiatric_illness",
    "fatty_liver",
    "tmj",
    "herniated_disk_or_back_problems",
  ]);
  if (asa2_count > 0) {
    score = Math.max(score, 2);
  }

  // If pseudocholinesterase deficiency is checked
  if (healthData?.medical_history?.pseudocholinesterase_deficiency) {
    score = Math.max(score, 2);
  }

  // Check medications
  // Any box clicked in  ‘do you take any of the following drugs’
  if (
    healthData.test_and_medication?.insulin?.insulin ||
    healthData.test_and_medication?.oral_diabetes?.oral_diabetes ||
    healthData.test_and_medication?.morphine?.morphine ||
    healthData.test_and_medication?.oxycodone?.oxycodone ||
    healthData.test_and_medication?.buprenorphine?.buprenorphine ||
    healthData.test_and_medication?.methadone?.methadone ||
    healthData.test_and_medication?.naltrexone?.naltrexone ||
    healthData.test_and_medication?.hiv_prep?.hiv_prep ||
    healthData.test_and_medication?.weight_loss_drugs?.weight_loss_drugs ||
    healthData.test_and_medication?.chronic_steroids?.chronic_steroids ||
    healthData.test_and_medication?.blood_thinners?.blood_thinners ||
    healthData.test_and_medication?.inhalers?.inhalers ||
    healthData.test_and_medication?.losartan?.losartan ||
    healthData.test_and_medication?.lisinopril?.lisinopril ||
    healthData.test_and_medication?.beta_blockers?.beta_blockers
  ) {
    score = Math.max(score, 2);
  }

  // ASA SCORE 3---------------------------------------------------

  // BMI > 40 = ASA3
  if (bmi && bmi > 40) {
    score = Math.max(score, 3);
  }

  //if patient checks the malignant hyperthermia box
  if (healthData?.medical_history?.malignant_hyperthermia) {
    score = Math.max(score, 3);
  }

  // Check cardiovascular conditions
  //  Heart failure, heart attack or stents, peripheral vascular disease,
  //  heart or blood vessel surgery, implanted device, congenital heart disease,
  //  high blood pressure 180/100

  if (
    healthData.health_assesment?.cardiovascular_health?.heart_failure
      ?.heart_failure ||
    healthData.health_assesment?.cardiovascular_health?.heart_attack
      ?.heart_attack ||
    healthData.health_assesment?.cardiovascular_health
      ?.peripheral_vascular_disease?.peripheral_vascular_disease ||
    healthData.health_assesment?.cardiovascular_health
      ?.heart_or_blood_vessel_surgery?.heart_or_blood_vessel_surgery ||
    healthData.health_assesment?.cardiovascular_health?.congenital_heart_disease
      ?.congenital_heart_disease ||
    healthData.health_assesment?.cardiovascular_health
      ?.high_blood_pressure_treatment?.high_blood_pressure_treatment ||
    healthData.health_assesment?.cardiovascular_health?.implanted_device
      ?.implanted_device
  ) {
    score = Math.max(score, 3);
  }

  // Checking disorders

  if (
    healthData.health_assesment?.nerves_muscles?.muscular_disorder
      ?.muscular_disorder ||
    healthData.health_assesment?.nerves_muscles?.neurologic_disorder
      ?.neurologic_disorder ||
    healthData?.health_assesment?.nerves_muscles?.seizures
      ?.is_last_seizure_within_3_months ||
    healthData.health_assesment?.nerves_muscles?.tia_or_stroke?.tia_or_stroke
  ) {
    score = Math.max(score, 3);
  }
  //checking kidney and liver
  if (
    healthData.health_assesment?.kidney?.kidney_failure?.kidney_failure ||
    healthData.health_assesment?.liver?.cirrhosis?.cirrhosis
  ) {
    score = Math.max(score, 3);
  }
  //checking blood disorders
  if (
    healthData.health_assesment?.blood_disorder?.hiv_aids?.hiv_aids ||
    healthData.health_assesment?.blood_disorder?.leukemia_lymphoma
      ?.leukemia_lymphoma
  ) {
    score = Math.max(score, 3);
  }
  //checking cancer
  if (
    healthData.health_assesment?.cancer
      ?.have_you_ever_been_treated_with_chemotherapy
      ?.have_you_ever_been_treated_with_chemotherapy
  ) {
    score = Math.max(score, 3);
  }

  //checking alcohol abuse
  if (
    healthData.health_assesment?.alcohol_drug_use
      ?.alcohol_withdrawal_symptoms_seizures
      ?.alcohol_withdrawal_symptoms_seizures
  ) {
    score = Math.max(score, 3);
  }

  // Check respiratory conditions
  if (
    (healthData.health_assesment?.respiratory_health?.copd_emphysema
      ?.copd_emphysema &&
      healthData.health_assesment?.respiratory_health?.copd_emphysema?.hospitalization_copd
        ?.toLowerCase()
        ?.includes("yes")) ||
    (healthData.health_assesment?.respiratory_health?.asthma?.asthma &&
      healthData.health_assesment?.respiratory_health?.asthma?.hospitalization_asthma
        ?.toLowerCase()
        ?.includes("yes"))
  ) {
    score = Math.max(score, 3);
  }

  // ASA SCORE 4---------------------------------------------------

  // not regularly dialyzed
  if (
    health_assesment?.kidney?.kidney_failure?.dialysis === true &&
    health_assesment?.kidney?.kidney_failure?.regularly_dialyzed === false
  ) {
    score = Math.max(score, 4);
  }

  // supplemental oxygen
  if (
    healthData.health_assesment?.respiratory_health?.use_supplemental_oxygen
      ?.use_supplemental_oxygen
  ) {
    score = Math.max(score, 4);
  }

  // heart attack within 3 months
  if (
    healthData.health_assesment?.cardiovascular_health?.heart_attack
      ?.heart_attack &&
    healthData.health_assesment?.cardiovascular_health?.heart_attack
      ?.heart_attack_date
  ) {
    const threeMonthsAgo = subMonths(new Date(), 3);
    const heartAttackDate = new Date(
      healthData.health_assesment?.cardiovascular_health?.heart_attack?.heart_attack_date
    );
    if (isAfter(heartAttackDate, threeMonthsAgo)) {
      score = Math.max(score, 4);
    }
  }

  // tia stoke within 3 months
  if (
    healthData.health_assesment?.nerves_muscles?.tia_or_stroke?.tia_or_stroke &&
    healthData.health_assesment?.nerves_muscles?.tia_or_stroke
      ?.date_for_tia_or_stroke
  ) {
    const threeMonthsAgo = subMonths(new Date(), 3);
    const strokeDate = new Date(
      healthData.health_assesment?.nerves_muscles?.tia_or_stroke?.date_for_tia_or_stroke
    );
    if (isAfter(strokeDate, threeMonthsAgo)) {
      score = Math.max(score, 4);
    }
  }

  return score;
}

export interface AdditionalText {
  text: string;
  isBold?: boolean;
  type?: string;
}

export function generateAdditionalText(body: any): AdditionalText[] {
  const additionalText: AdditionalText[] = [];
  const asaScore = calculateASAScore(body);

  additionalText.push({
    text: `Patient has a likely ASA score of ${asaScore}`,
    isBold: asaScore >= 3,
  });

  // ASA Score Warning
  if (asaScore >= 3) {
    additionalText.push({
      text: "Patient is at an increased risk of complications (including adverse cardiac events).",
      isBold: true,
    });
  }

  // Check for malignant hyperthermia
  if (body?.medical_history?.malignant_hyperthermia) {
    additionalText.push({
      text: "Patient has history of malignant hyperthermia",
      isBold: true,
    });
  }

  // Check for pseudo-cholinesterase deficiency
  if (body?.medical_history?.pseudocholinesterase_deficiency) {
    additionalText.push({
      text: "Patient has pseudo-cholinesterase deficiency",
      isBold: true,
    });
  }

   // Check for implanted nerve stimulator
   if (body?.medical_history?.nerve_stimulator) {
    additionalText.push({
      text: "Evaluate for most recent lead interrogation & manufacturers' peri-operative management recommendations",
    });
  }

  const test_and_medication = body?.test_and_medication;
  // Review preoperative medications
  if (test_and_medication) {
    // List of keys to check in the test_and_medication object
    const medicationNames: any = {
      insulin: "Insulin",
      oral_diabetes: "Oral Diabetes Drug",
      morphine: "Morphine",
      oxycodone: "Oxycodone",
      buprenorphine: "Buprenorphine",
      methadone: "Methadone",
      hiv_prep: "HIV PrEP",
      weight_loss_drugs: "Weight Loss Drugs",
      chronic_steroids: "Chronic Steroids",
      blood_thinners: "Blood Thinners",
      inhalers: "Inhalers",
      losartan: "Losartan",
      lisinopril: "Lisinopril",
      beta_blockers: "Beta Blockers",
    };
    const medicationKeys = Object.keys(medicationNames);
    

    const checkedMedications = medicationKeys.filter(
      (key) => test_and_medication[key]?.[key]
    );

    if (checkedMedications.length > 0) {
      additionalText.push({
        text: "Review these preoperative medications:",
      });

      // Add specific medications that were checked
      checkedMedications.forEach((medication: any) => {
        additionalText.push({
          text: medicationNames[medication],
          type: "listitem",
        });
      });
    }
  }

  // Pregnancy test recommendation
  const age = calculateAge(body.patient_information?.dob);
  if (
    body.patient_information?.gender === "female" &&
    body.medical_history?.hysterectomy?.includes("no") &&
    age >= 10 &&
    age <= 65
  ) {
    additionalText.push({
      text: "Urine Pregnancy test on the morning of the procedure",
    });
  }

  // Lab work recommendations for moderate to high risk procedures
  additionalText.push({
    text: "If having a moderate to high risk, non-emergent, surgical procedure, would recommend:",
  });
  additionalText.push({
    text: "Review lab work from the last 6 months including:",
  });

  // Basic labs for all high-risk patients
  additionalText.push({
    text: "Sodium, potassium, blood urea nitrogen, creatinine, blood glucose",
    type: "listitem",
  });

  // Condition-specific labs
  if (
    body.health_assesment?.liver?.cirrhosis?.cirrhosis ||
    body.health_assesment?.liver?.hepatitis_abc?.hepatitis_abc ||
    body.health_assesment?.liver?.fatty_liver?.fatty_liver ||
    body.health_assesment?.liver?.jaundice?.jaundice ||
    body.health_assesment?.kidney?.kidney_failure?.kidney_failure
  ) {
    additionalText.push({
      text: "Liver transaminase levels, bilirubin, ",
      type: "listitem",
    });
  }

  additionalText.push({
    text: "Baseline hematocrit, platelet count, white blood count",
    type: "listitem",
  });

  if (body.health_assesment?.cardiovascular_health?.diabetes?.diabetes) {
    additionalText.push({
      text: "HbA1c",
      type: "listitem",
    });
  }

  additionalText.push({
    text: "International normalized ratio, prothrombin time, partial prothrombin time",
    type: "listitem",
  });

  additionalText.push({
    text: "Type & screen / cross",
  });

  // ECG recommendation
  if (
    age > 50 ||
    countTrueValues(body?.health_assesment?.cardiovascular_health) > 0 ||
    body.health_assesment?.respiratory_health?.shortness_of_breath
      ?.shortness_of_breath ||
    body.health_assesment?.respiratory_health?.smoke?.smoke ||
    body.health_assesment?.kidneys?.kidney_failure?.dialysis ||
    body.health_assesment?.blood_disorders?.sickle_cell_disease
      ?.sickle_cell_disease ||
    body.health_assesment?.blood_disorder?.anemia?.anemia ||
    body.health_assesment?.liver?.cirrhosis?.cirrhosis ||
    body.health_assesment?.liver?.cirrhosis?.cirrhosis ||
    body.health_assesment?.nerves_muscles?.tia_or_stroke?.tia_or_stroke ||
    body.health_assesment?.cardiovascular_health?.low_heart_rate?.low_heart_rate
  ) {
    additionalText.push({
      text: "Review electrocardiogram",
    });
  }

  // Chest X-Ray recommendation
  if (
    body.health_assesment?.respiratory_health?.copd_emphysema?.copd_emphysema ||
    (body.health_assesment.respiratory_health.asthma.asthma &&
      body.health_assesment?.respiratory_health?.athma?.hospitalization_asthma?.includes(
        "yes"
      )) ||
    body?.health_assesment.respiratory_health.pneumonia_last_month
      .pneumonia_last_month
  ) {
    additionalText.push({
      text: "Review Chest X-Ray",
    });
  }
  if (body?.health_assesment?.respiratory_health?.smoke?.smoke) {
    additionalText.push({
      text: "Smoking cessation",
    });
  }

  // Urinalysis recommendation
  if (body.health_assesment?.kidney?.urinary_pain?.urinary_pain) {
    additionalText.push({
      text: "Urinalysis",
    });
  }

  // Medical clearance recommendations
  const needsMedicalClearance =
    body.health_assesment?.nerves_muscles?.tia_or_stroke?.tia_or_stroke ||
    body.health_assesment?.nerves_muscles?.seizures?.seizures ||
    body.health_assesment?.kidneys?.kidney_failure?.dialysis ||
    Number(
      body.health_assesment?.cardiovascular_health?.diabetes?.diabetes_hba1c ||
        0
    ) > 9 ||
    body.health_assesment?.respiratory_health?.pulmonary_fibrosis
      ?.pulmonary_fibrosis ||
    body.health_assesment?.cardiovascular_health?.stairs_trouble
      ?.stairs_trouble ||
    body.health_assesment?.respiratory_health?.cystic_fibrosis
      ?.cystic_fibrosis ||
    body.health_assesment?.respiratory_health?.tb?.tb ||
    body.health_assesment?.respiratory_health?.sarcoidosis?.sarcoidosis ||
    body.health_assesment?.respiratory_health?.use_supplemental_oxygen
      ?.use_supplemental_oxygen ||
    body.health_assesment?.respiratory_health?.stop_breathing_sleep
      ?.stop_breathing_sleep;

  if (needsMedicalClearance) {
    additionalText.push({
      text: "Medical optimization recommended prior to procedure",
      isBold: true,
    });
  }

  // Cardiac clearance recommendations
  const needsCardiacClearance =
    body.health_assesment?.cardiovascular_health?.heart_attack?.heart_attack ||
    body.health_assesment?.cardiovascular_health?.heart_or_blood_vessel_surgery
      ?.heart_or_blood_vessel_surgery ||
    body.health_assesment?.cardiovascular_health?.congenital_heart_disease
      ?.congenital_heart_disease ||
    body.health_assesment?.cardiovascular_health?.implanted_device
      ?.implanted_device ||
    body.health_assesment?.cardiovascular_health?.heart_failure
      ?.heart_failure ||
    body.health_assesment?.cardiovascular_health?.blood_thinner?.blood_thinner;

  if (needsCardiacClearance) {
    additionalText.push({
      text: "Cardiac optimization recommended prior to procedure ",
      isBold: true,
    });
  }

  // Pulmonary follow-up recommendations
  if (
    body.health_assesment?.respiratory_health?.use_supplemental_oxygen
      ?.use_supplemental_oxygen ||
    body.health_assesment?.respiratory_health?.asthma?.hospitalization_asthma?.includes(
      "yes"
    ) ||
    body.health_assesment?.respiratory_health?.copd_emphysema?.hospitalization_copd?.includes(
      "yes"
    )
  ) {
    additionalText.push({
      text: "Pulmonary optimization recommended prior to procedure ",
    });
  }

  // Recent significant events
  // Check for recent significant cardiovascular/neurological events (within 1 year)
  const heartAttackDateStr = body.health_assesment?.cardiovascular_health?.heart_attack?.heart_attack_date;
  let recentHeartEvent = false;

  if (
    body.health_assesment?.cardiovascular_health?.heart_attack?.heart_attack &&
    heartAttackDateStr
  ) {
    const heartAttackDate = new Date(heartAttackDateStr);
    const oneYearAgo = subMonths(new Date(), 12);
    if (isAfter(heartAttackDate, oneYearAgo)) {
      recentHeartEvent = true;
    }
  }

  // Check for recent TIA/stroke event within 1 year
  let recentStrokeEvent = false;
  const strokeDateStr = body.health_assesment?.nerves_muscles?.tia_or_stroke?.date_for_tia_or_stroke;
  if (
    body.health_assesment?.nerves_muscles?.tia_or_stroke?.tia_or_stroke &&
    strokeDateStr
  ) {
    const strokeDate = new Date(strokeDateStr);
    const oneYearAgo = subMonths(new Date(), 12);
    if (isAfter(strokeDate, oneYearAgo)) {
      recentStrokeEvent = true;
    }
  }

  // Check for recent heart or blood vessel surgery within 1 year
  const heartSurgeryDateStr = body.health_assesment?.cardiovascular_health?.heart_or_blood_vessel_surgery?.heart_or_blood_vessel_surgery_date;
  let recentHeartSurgeryEvent = false;
  if (
    body.health_assesment?.cardiovascular_health?.heart_or_blood_vessel_surgery?.heart_or_blood_vessel_surgery &&
    heartSurgeryDateStr
  ) {
    const heartSurgeryDate = new Date(heartSurgeryDateStr);
    const oneYearAgo = subMonths(new Date(), 12);
    if (isAfter(heartSurgeryDate, oneYearAgo)) {
      recentHeartSurgeryEvent = true;
    }
  }

  // Check for recent heart stents within 1 year
  const heartStentsDateStr = body.health_assesment?.cardiovascular_health?.heart_stents?.heart_stents_date;
  if (
    body.health_assesment?.cardiovascular_health?.heart_stents?.heart_stents &&
    heartStentsDateStr
  ) {
    const heartStentsDate = new Date(heartStentsDateStr);
    const oneYearAgo = subMonths(new Date(), 12);
    if (isAfter(heartStentsDate, oneYearAgo)) {
      recentHeartSurgeryEvent = true;
    }
  }

  if (
    recentHeartEvent ||
    recentHeartSurgeryEvent ||
    recentStrokeEvent
  ) {
    additionalText.push({
      text: "Consider delaying procedure to optimize patient condition due to recent cardiovascular/neurological event",
      isBold: true,
    });
  }

  return additionalText;
}

export function renderAdditionalText(additionalText: AdditionalText[]) {
  let result = "";
  let isSublistOpen = false;

  for (let i = 0; i < additionalText.length; i++) {
    const text = additionalText[i];

    if (text.type === "listitem") {
      if (!isSublistOpen) {
        result += "<ul>";
        isSublistOpen = true;
      }
      result += `<li style="font-weight:${text.isBold ? 700 : 400};">${text.text}</li>`;
    } else {
      if (isSublistOpen) {
        result += "</ul>";
        isSublistOpen = false;
      }
      result += `<li style="font-weight:${text.isBold ? 700 : 400};">${text.text}</li>`;
    }
  }

  if (isSublistOpen) {
    result += "</ul>";
  }

  return `<ul>${result}</ul>`;
}

// --------UTILS--------
// this will be used to count the number of true values in the healthAssessment object except some excluded keys
function countTrueValues(healthAssessment: any, excludedKeys: string[] = []) {
  let count = 0;

  function traverse(obj: any) {
    if (typeof obj !== "object" || obj === null) return;

    for (const key in obj) {
      if (excludedKeys.includes(key)) continue;

      const value = obj[key];

      if (typeof value === "object") {
        traverse(value);
      } else if (value === true) {
        count++;
      }
    }
  }

  traverse(healthAssessment);
  return count;
}
