import { format, intervalToDuration } from "date-fns";
import { HA_LABELS, PD_LABELS } from "./constants";

export function calculateBMI(heightFeet: any, heightInches: any, weightPounds: any) {
  // Convert height to inches
  if (!heightFeet || !heightInches || !weightPounds) {
    return { value: "" };
  }
  const totalHeightInches = heightFeet * 12 + heightInches;

  // Calculate BMI using the formula
  let bmi = (weightPounds / (totalHeightInches * totalHeightInches)) * 703;

  bmi = Math.round(bmi);
  return { label: `BMI: ${bmi}`, bmi };
}

export const calculateAge = (dob: string): number => {
  const interval = intervalToDuration({
    start: new Date(dob),
    end: new Date(),
  });
  console.log("Date for age : ", dob);
  console.log("Age : ", interval.years ? interval.years : 0);
  return interval.years ? interval.years : 0;
};

const recursiveObjCheck = (data: any, key: any) => {
  let objCheck = data || {};
  for (let i = 0; i < key.length; i++) {
    const interimObj = objCheck[key[i]];
    if (!interimObj) {
      return false;
    }
    objCheck = interimObj;
  }
  return true;
};

export function patientDetailsFn(watchAll: any) {
  const patientDetails = [
    [
      {
        key: PD_LABELS.patient_name,
        value: watchAll?.patient_information?.patient_name,
      },
      {
        key: PD_LABELS.dob,
        value: formatDate(watchAll?.patient_information?.dob),
      },
      { key: PD_LABELS.gender, value: watchAll?.patient_information?.gender },
      {
        key: PD_LABELS.height,
        value:
          watchAll?.patient_information?.height_feet +
          "ft " +
          watchAll?.patient_information?.height_inches + " in"
      },
      {
        key: PD_LABELS.weight,
        value: watchAll?.patient_information?.weight,
      },
    ],
    [
      {
        key: PD_LABELS.name_of_primary_care,
        value: watchAll?.patient_information?.name_of_primary_care,
      },
      {
        key: PD_LABELS.primary_care_phone_number,
        value: watchAll?.patient_information?.primary_care_phone_number,
      },
      {
        key: PD_LABELS.name_of_cardiologist,
        value: watchAll?.patient_information?.name_of_cardiologist,
      },
      {
        key: PD_LABELS.cardiologist_phone_number,
        value: watchAll?.patient_information?.cardiologist_phone_number,
      },
      {
        key: PD_LABELS.name_of_doctor,
        value: watchAll?.patient_information?.name_of_doctor,
      },
    ],
    [
      {
        key: PD_LABELS.surgical_procedure,
        value: watchAll?.patient_information?.surgical_procedure,
      },
    ],
  ];
  // console.log("patientDetails", patientDetails);
  return patientDetails;
}

export function allergiesListFn(watchAll: any) {
  const data = watchAll?.medical_history?.allergies;

  const allergies = data?.map((value: any) => {
    const { allergies, rash, breathing_or_swollen_lips, other } = value;

    const allergyEntry: any = {
      label: allergies,
    };
    if (rash) {
      allergyEntry.Rash = "Rash";
    }
    if (breathing_or_swollen_lips) {
      allergyEntry["Trouble Breathing or Swollen lips"] =
        "Trouble Breathing or Swollen lips";
    }
    if (other && other.trim() !== "") {
      allergyEntry.other = other;
    }
    return allergyEntry;
  });

  return allergies || [];
}

export function surgeryListFn(watchAll: any) {
  const data = watchAll?.medical_history?.surgery_or_procedure;
  const surgeries = data?.map((entry: any) => [
    { value: entry.value, width: 200 },
    {
      value: formatDate(entry.date),
      width: 80,
    },
  ]);
  return surgeries;
}

const DENTAL_ITEMS = [
  {
    key: "chipped_teeth",
    label: "Chipped Teeth",
  },
  {
    key: "loose_teeth",
    label: "Loose Teeth",
  },
  {
    key: "upper_denture",
    label: "Upper Denture",
  },
  {
    key: "lower_denture",
    label: "Lower Denture",
  },
  {
    key: "upper_partials",
    label: "Upper Partials",
  },
  {
    key: "lower_partials",
    label: "Lower Partials",
  },
  {
    key: "dental_implant_veneer",
    label: "Dental Implant / Veneer",
  },
  {
    key: "retainer",
    label: "Retainer",
  },
  {
    key: "braces",
    label: "Braces",
  }
]
function getTrueKeys(obj: {[key: string]: boolean}): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return [];
  }
  const trueKeys = Object.keys(obj).filter(key => obj[key]);
  return trueKeys.map(key => {
    const dentalItem = DENTAL_ITEMS.find(item => item.key === key);
    return dentalItem ? dentalItem.label : key;
  });
}

export function medicalHistoryFamilyFn(watchAll: any) {
  
  const data = watchAll?.medical_history;

  const quesKeyValProblem = [
    { key: ["nose_bleed"], value: "Nose Bleed" },
    {
      key: ["bleeding_with_tooth_extractions"],
      value: "Bleeding with Tooth Extractions",
    },
    { key: ["bleeding_after_surgery"], value: "Bleeding After Surgery" },
  ];

  const quesKeyValAnesthesia = [
    { key: ["sever_nausea_vomiting"], value: "Severe Nausea or Vomiting" },
    {
      key: ["malignant_hyperthermia"],
      value: "Malignant Hyperthermia (in blood relatives or in yourself)",
    },
    { key: ["breathing_difficulties"], value: "Breathing Difficulties" },
    {
      key: ["placement_of_breathing_tube"],
      value: "Problems With Placement of a Breathing Tube",
    },
    {
      key: ["pseudocholinesterase_deficiency"],
      value: "Pseudocholinesterase Deficiency",
    },
    {
      key: ["motion_sickness"],
      value: "Motion Sickness",
    },
  ];

  // Only include awareness_under_anesthesia if it has been checked
  if (data?.awareness_under_anesthesia?.awareness_under_anesthesia) {
    quesKeyValAnesthesia.unshift(
      { key: ["awareness_under_anesthesia"], value: "Awareness under anesthesia" }
    );
    
    // Only include sub-fields if they are checked
    if (data?.awareness_under_anesthesia?.was_it_during_endoscopy) {
      quesKeyValAnesthesia.unshift(
        { key: ["awareness_under_anesthesia", "was_it_during_endoscopy"], value: "(Awareness during Endoscopy)" }
      );
    }
    if (data?.awareness_under_anesthesia?.was_it_during_dental_procedure) {
      quesKeyValAnesthesia.unshift(
        { key: ["awareness_under_anesthesia", "was_it_during_dental_procedure"], value: "(Awareness during Dental Procedure)" }
      );
    }
  }

  const quesKeyVal = [
    { key: ["problems_opening_mouth"], value: "Problems Opening Your Mouth" },
    {
      key: ["dental_damage_implants"],
      value: getTrueKeys(data?.dental_damage_implants),
    },
    { key: ["problems_moving_neck"], value: "Problems Moving Your Neck" },
    { key: ["hysterectomy_before"], value: "I had a hysterectomy before" },
    {
      key: ["menstrual_period"],
      value: "I had a menstrual period in the last 2 years",
    },
    {
      key: ["surgical_implants_in_body"],
      value: "I have surgical implants in my body",
    },
    {
      key: ["site_of_implant"],
      value: data?.metal_implant_site,
    },
    {
      key: ["nerve_stimulator"],
      value: "Implanted Nerve stimulator",
    },
  ];

  const medicalHistoryFamilProblemyArr: any = [];
  const medicalHistoryFamilAnesthesiayArr: any = [];
  const medicalHistoryFamilyArr: any = [];

  quesKeyValProblem.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      medicalHistoryFamilProblemyArr.push(ques.value);
    }
  });
  quesKeyValAnesthesia.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      medicalHistoryFamilAnesthesiayArr.push(ques.value);
    }
  });
  quesKeyVal.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      medicalHistoryFamilyArr.push(ques.value);
    }
  });

  const medicalHistoryFamilyObject = [
    [
      {
        key: "Patient or anyone in family had serious problems with",
        value: medicalHistoryFamilProblemyArr.join(", "),
      },
    ],
    [
      {
        key: "Problems with anesthesia or surgery.",
        value: medicalHistoryFamilAnesthesiayArr.join(", "),
        isBold: true,
      },
    ],
    [
      {
        key: "I have the following:",
        value: medicalHistoryFamilyArr.join(", "),
      },
    ],
    // [
    //   {
    //     key: "last menstrual period (Women)",
    //     value: formatDate(data?.menstrual_date),
    //   },
    // ],
  ];

  return medicalHistoryFamilyObject;
}

export function medicalHistory3(body: any){
  const data = body?.medical_history;
  const arr: any[] = []
  const quesKeyVal = [
    { key: ["problems_opening_mouth"], value: "Problems Opening Mouth" },
    { key: ["problems_moving_neck"], value: "Problems Moving Neck" },
    {
      key: ["dental_damage_implants"],
      value: getTrueKeys(data?.dental_damage_implants),
    },
  ];
  quesKeyVal.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      arr.push(ques.value);
    }
  });
  return arr;
}

export function formatDate(date: string): string {
  try {
  if (date === "" || !date) {
    return "";
  }
    return format(new Date(date), "MM-dd-yyyy");
  } catch (error) {
    console.log("INVALID DATE", error);
    return "";
  }
}

export function medicalTestsFn(watchAll: any) {
  const data = watchAll?.test_and_medication;
  const medicalData = [
    [
      { value: "EKG", width: 240 },
      { value: data?.ekg?.location_of_ekg, width: 230 },
      { value: formatDate(data?.ekg?.date_of_ekg), width: 80 },
    ],
    [
      { value: "Sleep Study", width: 240 },
      { value: data?.sleep_study?.location_of_sleep_study, width: 230 },
      {
        value: formatDate(data?.sleep_study?.date_of_sleep_study),
        width: 80,
      },
    ],
    [
      { value: "Blood Work", width: 240 },
      { value: data?.blood_work?.location_of_blood_work, width: 230 },
      {
        value: formatDate(data?.blood_work?.date_of_blood_work),
        width: 80,
      },
    ],
    [
      { value: "Stress Test", width: 240 },
      { value: data?.stress_test?.location_of_stress_test, width: 230 },
      {
        value: formatDate(data?.stress_test?.date_of_stress_test),
        width: 80,
      },
    ],
    [
      { value: "Echo", width: 240 },
      { value: data?.echo?.location_of_echo, width: 230 },
      { value: formatDate(data?.echo?.date_of_echo), width: 80 },
    ],
    [
      { value: "Pulmonary Function Test", width: 240 },
      {
        value: formatDate(
          data?.pulmonary_function_test?.location_of_pulmonary_function_test
        ),
        width: 230,
      },
      {
        value: formatDate(
          data?.pulmonary_function_test?.date_of_pulmonary_function_test
        ),
        width: 80,
      },
    ],
  ];
  const filteredMedicalData = medicalData.filter((row) => {
    const [col2, col3] = row.slice(1); // Extract second and third columns
    return col2.value || col3.value; // Keep rows where either column has a non-empty value
  });
  return filteredMedicalData;
}

export function drugHistoryFn(watchAll: any) {
  const data = watchAll?.test_and_medication;

  const drugHistory = [
    { label: "insulin", 
      Dose: data?.insulin?.insulin_dose ,
      "Which drug": data?.insulin?.insulin_dose_drug_option ,
      
    },
    { label: "Oral diabetes drug that ends in _agliflozin", 
      Dose: data?.oral_diabetes?.oral_diabetes_dose ,
      "Which drug": data?.oral_diabetes?.oral_diabetes_drug_option ,
    },
    { label: "morphine", Dose: data?.morphine?.morphine_dose },
    { label: "oxycodone", Dose: data?.oxycodone?.oxycodone_dose },
    {
      label: "Buprenorphine",
      Dose: data?.buprenorphine?.buprenorphine_dose,
    },
    {
      label: "Methadone",
      Dose: data?.methadone?.methadone_dose,
    },
    {
      label: "Naltrexone",
      Dose: data?.naltrexone?.naltrexone_dose,
    },
    { label: "HIV PrEP", 
      // Dose: data?.hiv_prep?.hiv_prep_dose 
    },
    { label: "Weight loss drugs" },
    {
      label: "Chronic-Steroid",
      "Drug Name": data?.chronic_steroids?.chronic_steroids_drug_name,
      Dose: data?.chronic_steroids?.chronic_steroids_dose,
      "How Long":
        data?.chronic_steroids?.how_long_have_you_been_on_chronic_steroids,
    },
    {
      label: "Blood Thinners",
      "Drug name": data?.blood_thinners?.blood_thinners_drug_name,
      Dose: data?.blood_thinners?.blood_thinners_dose,
      Frequency: data?.blood_thinners?.blood_thinners_frequency,
    },
    {
      label: "Inhalers",
      "Drug name": data?.inhalers?.inhalers_drug_name,
      Frequency: data?.inhalers?.inhalers_frequency,
    },
    {
      label: "Beta Blockers(Labetalol / Metoprolol / Atenolol)",
      // Dose: data?.beta_blockers?.beta_blockers,
    },
    { label: "Losartan",},
    { label: "Lisinopril", },
  ];
  let ans = [];
  for (let i = 0; i < drugHistory.length; i++) {
    const medication = drugHistory[i]?.label;
    if (medication === "insulin" && data?.insulin?.insulin) {
      ans.push(drugHistory[i]);
    } else if (
      medication === "Oral diabetes drug that ends in _agliflozin" &&
      data?.oral_diabetes?.oral_diabetes
    ) {
      ans.push(drugHistory[i]);
    } else if (medication === "Losartan" && data?.losartan?.losartan) {
      ans.push(drugHistory[i]);
    } else if (medication === "Lisinopril" && data?.lisinopril?.lisinopril) {
      ans.push(drugHistory[i]);
    } else if (
      medication === "Beta Blockers(Labetalol / Metoprolol / Atenolol)" &&
      data?.beta_blockers?.beta_blockers
    ) {
      ans.push(drugHistory[i]);
    } else if (medication === "morphine" && data?.morphine?.morphine) {
      ans.push(drugHistory[i]);
    } else if (medication === "oxycodone" && data?.oxycodone?.oxycodone) {
      ans.push(drugHistory[i]);
    } else if (
      medication === "Buprenorphine" &&
      data?.buprenorphine?.buprenorphine
    ) {
      ans.push(drugHistory[i]);
    } else if (medication === "Methadone" && data?.methadone?.methadone) {
      ans.push(drugHistory[i]);
    } else if (medication === "Naltrexone" && data?.naltrexone?.naltrexone) {
      ans.push(drugHistory[i]);
    } else if (medication === "HIV PrEP" && data?.hiv_prep?.hiv_prep) {
      ans.push(drugHistory[i]);
    } else if (
      medication === "Weight loss drugs" &&
      data?.weight_loss_drugs?.weight_loss_drugs
    ) {
      ans.push(drugHistory[i]);
    } else if (
      medication === "Chronic-Steroid" &&
      data?.chronic_steroids?.chronic_steroids
    ) {
      ans.push(drugHistory[i]);
    } else if (
      medication === "Blood Thinners" &&
      data?.blood_thinners?.blood_thinners
    ) {
      ans.push(drugHistory[i]);
    } else if (medication === "Inhalers" && data?.inhalers?.inhalers) {
      ans.push(drugHistory[i]);
    }
  }
  return ans;
}

export function pastMedicationFn(watchAll: any) {
  // const data = watchAll?.test_and_medication?.medicationsPast;
  const data = watchAll?.test_and_medication?.medicationsPast;
  const pastMedication: any = [];
  data?.forEach(({ value, date }: any) => {
    if (value || date) {
      pastMedication.push([
        { value, width: 440 },
        { value: formatDate(date), width: 100 },
      ]);
    }
  });
  // console.log({pastMedication: data, processed: JSON.stringify(pastMedication)})

  // console.log("medicationsLastMonth", medicationsLastMonth);
  return pastMedication;
}

export function cardiovascularHealthFn(watchAll: any) {
  const data = watchAll?.health_assesment?.cardiovascular_health;

  const quesKeyVal = [
    {
      key: ["heart_failure", "heart_failure"],
      value: { label: HA_LABELS.heart_failure },
    },
    {
      key: ["heart_valve_problem", "heart_valve_problem"],
      value: { label: HA_LABELS.heart_valve_problem },
    },
    {
      key: ["heart_attack", "heart_attack"],
      value: {
        label: HA_LABELS.heart_attack,
        Date: formatDate(data?.heart_attack?.heart_attack_date),
      },
    },
    {
      key: ["artery_blockage", "artery_blockage"],
      value: { label: HA_LABELS.artery_blockage },
    },
    {
      key: ["peripheral_vascular_disease", "peripheral_vascular_disease"],
      value: { label: HA_LABELS.peripheral_vascular_disease },
    },
    {
      key: ["chest_pain", "chest_pain"],
      value: { label: HA_LABELS.chest_pain },
    },
    {
      key: ["blood_thinner", "blood_thinner"],
      value: {
        label: HA_LABELS.blood_thinner,
      },
    },
    {
      key: ["stairs_trouble", "stairs_trouble"],
      value: {
        label: HA_LABELS.stairs_trouble,
      },
    },
    {
      key: ["physical_limitations", "physical_limitations"],
      value: {
        label: HA_LABELS.physical_limitations,
      },
    },
    {
      key: ["diabetes", "diabetes"],
      value: {
        label: HA_LABELS.diabetes,
        HbA1c: data?.diabetes?.diabetes_hba1c,
      },
    },
    {
      key: ["heart_or_blood_vessel_surgery", "heart_or_blood_vessel_surgery"],
      value: {
        label: HA_LABELS.heart_or_blood_vessel_surgery,
        Type: data?.heart_or_blood_vessel_surgery
          ?.heart_or_blood_vessel_surgery_type,
        Date: formatDate(
          data?.heart_or_blood_vessel_surgery
            ?.heart_or_blood_vessel_surgery_date
        ),
      },
    },
    {
      key: ["implanted_device", "implanted_device"],
      value: {
        label: HA_LABELS.implanted_device,
        Manufacturer: data?.implanted_device?.implanted_device_manufacturer,
        "Last Interrogation":
          data?.implanted_device?.implanted_device_last_interrogation,
        "Pacemaker dependent":
          data?.implanted_device?.implanted_device_pacemaker_dependent,
      },
    },
    {
      key: ["aortic_aneurysm", "aortic_aneurysm"],
      value: {
        label: HA_LABELS.aortic_aneurysm,
      },
    },
    {
      key: ["congenital_heart_disease", "congenital_heart_disease"],
      value: {
        label: HA_LABELS.congenital_heart_disease,
      },
    },
    {
      key: ["irregular_heartbeat", "irregular_heartbeat"],
      value: {
        label: HA_LABELS.irregular_heartbeat,
      },
    },
    {
      key: ["high_blood_pressure_treatment", "high_blood_pressure_treatment"],
      value: {
        label: HA_LABELS.high_blood_pressure_treatment,
        "At home (mmHg)":
        data?.high_blood_pressure_treatment?.cpap_settings_blood_pressure,
      },
    },
  ];

  const cardiovascularHealthArr: any = [];

  quesKeyVal.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      cardiovascularHealthArr.push(ques.value);
    }
  });

  // console.log("cardiovascularHealth", cardiovascularHealthArr);
  return cardiovascularHealthArr;
}

export function respiratoryHealthFn(watchAll: any) {
  const data = watchAll?.health_assesment?.respiratory_health;

  const quesKeyVal = [
    {
      key: ["shortness_of_breath", "shortness_of_breath"],
      value: { label: "Shortness of Breath" },
    },
    {
      key: ["cystic_fibrosis", "cystic_fibrosis"],
      value: { label: "Cystic fibrosis" },
    },
    {
      key: ["high_blood_pressure_lungs", "high_blood_pressure_lungs"],
      value: { label: "High Blood Pressure in the Lungs" },
    },
    {
      key: ["pulmonary_fibrosis", "pulmonary_fibrosis"],
      value: { label: "Pulmonary fibrosis" },
    },
    { key: ["tb", "tb"], value: { label: "TB (tuberculosis)" } },
    { key: ["sarcoidosis", "sarcoidosis"], value: { label: "Sarcoidosis" } },
    {
      key: ["use_supplemental_oxygen", "use_supplemental_oxygen"],
      value: { label: "Use supplemental oxygen." },
    },
    {
      key: ["do_you_snore", "do_you_snore"],
      value: { label: "I snore." },
    },
    {
      key: ["feel_tired_daytime", "feel_tired_daytime"],
      value: { label: "I feel tired during daytime." },
    },
    {
      key: ["stop_breathing_sleep", "stop_breathing_sleep"],
      value: { label: "I stop breathing during sleep." },
    },
    {
      key: ["sleep_apnea", "sleep_apnea"],
      value: {
        label: HA_LABELS.sleep_apnea,
        "CPAP Setting": data?.sleep_apnea?.cpap_settings_sleep_apnea,
      },
    },
    {
      key: ["smoke", "smoke"],
      value: {
        label: "I smoke.",
        "Packs Per Day": data?.smoke?.packs_per_day_smoked,
        "For how many years": data?.smoke?.how_many_years,
      },
    },
    {
      key: ["copd_emphysema", "copd_emphysema"],
      value: {
        label: "COPD or Emphysema",
        ...(data?.copd_emphysema?.hospitalization_copd ? { [HA_LABELS.hospitalization_required]: data?.copd_emphysema?.hospitalization_copd === "yes" ? "Yes" : "No" } : {}),
      },
    },
    {
      key: ["asthma", "asthma"],
      value: {
        label: "Asthma",
        [HA_LABELS.hospitalization_required]:
          data?.asthma?.hospitalization_asthma === "yes" ? "Yes" : data?.asthma?.hospitalization_asthma === "no" ? "No" : undefined,
      },
    },
    {
      key: ["ever_smoked", "ever_smoked"],
      value: {
        label: "Ever smoked.",
        "Packs Per Day": data?.ever_smoked?.packs_per_day_smoked,
        "For how many years": data?.ever_smoked?.how_many_years,
        // Date: formatDate(data?.ever_smoked?.quit_smoking_date),
      },
    },
  ];

  const respiratoryHealthArr: any = [];

  quesKeyVal.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      respiratoryHealthArr.push(ques.value);
    }
  });
  return respiratoryHealthArr;
}

export function alcoholDrugAndCancerFn(watchAll: any) {
  const alcoholData = watchAll?.health_assesment?.alcohol_drug_use;
  const cancerData = watchAll?.health_assesment?.cancer;

  const quesKeyValalcohol = [
    {
      key: ["alcohol", "alcohol"],
      value: {
        label: "I drink alcohol.",
        "Days Per Week": alcoholData?.alcohol?.days_per_week,
        "What Alcohol": alcoholData?.alcohol?.what_alcohol,
        Quantity: alcoholData?.alcohol?.quantity_alcohol,
      },
    },
    {
      key: [
        "alcohol_withdrawal_symptoms_seizures",
        "alcohol_withdrawal_symptoms_seizures",
      ],
      value: { label: "Alcohol withdrawal symptoms/seizures." },
    },
    {
      key: ["use_street_illicit_drugs", "use_street_illicit_drugs"],
      value: {
        label: "use street/illicit drugs, marijuana, opioids.",
        List: alcoholData?.use_street_illicit_drugs?.list_of_drugs,
      },
    },
  ];

  const quesKeyValCancer = [
    {
      key: ["have_you_ever_had_cancer", "have_you_ever_had_cancer"],
      value: {
        label: "I have had cancer.",
        Type: cancerData?.have_you_ever_had_cancer?.what_type_of_cancer,
      },
    },
    {
      key: [
        "have_you_ever_been_treated_with_chemotherapy",
        "have_you_ever_been_treated_with_chemotherapy",
      ],
      value: {
        label:
          "I have ever been treated with chemotherapy or radiation therapy.",
        "Name of Treatment":
          cancerData?.have_you_ever_been_treated_with_chemotherapy
            ?.name_of_treatment_for_chemotherapy,
        Date: formatDate(
          cancerData?.have_you_ever_been_treated_with_chemotherapy
            ?.last_treatment_date_for_chemotherapy
        ),
      },
    },
  ];

  const alcoholDrugAndCancerArr: any = [];

  quesKeyValalcohol.forEach((ques) => {
    if (recursiveObjCheck(alcoholData, ques.key)) {
      alcoholDrugAndCancerArr.push(ques.value);
    }
  });

  quesKeyValCancer.forEach((ques) => {
    if (recursiveObjCheck(cancerData, ques.key)) {
      alcoholDrugAndCancerArr.push(ques.value);
    }
  });
  return alcoholDrugAndCancerArr;
}

export function bloodDisordersFn(watchAll: any) {
  const data = watchAll?.health_assesment?.blood_disorder;

  const quesKeyVal = [
    {
      key: ["leukemia_lymphoma", "leukemia_lymphoma"],
      value: { label: "Leukemia or Lymphoma" },
    },
    { key: ["blood_clots", "blood_clots"], value: { label: "Blood Clots" } },
    { key: ["anemia", "anemia"], value: { label: "Anemia" } },
    {
      key: ["sickle_cell_disease", "sickle_cell_disease"],
      value: { label: "Sickle Cell Disease" },
    },
    {
      key: ["blood_transfusion_past", "blood_transfusion_past"],
      value: { label: "Blood transfusion in the past" },
    },
    { key: ["hiv_aids", "hiv_aids"], value: { label: "HIV/AIDS" } },
    {
      key: ["von_willebrand_disease", "von_willebrand_disease"],
      value: { label: "Von Willebrand disease" },
    },
    {
      key: ["factor_v_leiden_mutation", "factor_v_leiden_mutation"],
      value: { label: "Factor V Leiden mutation" },
    },
  ];

  const bloodDisordersArr: any = [];

  quesKeyVal.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      bloodDisordersArr.push(ques.value);
    }
  });

  // console.log("bloodDisordersArr", bloodDisordersArr);
  return bloodDisordersArr;
}

export function liverAndKidneyFn(watchAll: any) {
  const liverData = watchAll?.health_assesment?.liver;
  const kidneyData = watchAll?.health_assesment?.kidney;

  const quesKeyValLiver = [
    { key: ["cirrhosis", "cirrhosis"], value: { label: "Cirrhosis" } },
  { key: ["fatty_liver", "fatty_liver"], value: { label: "Fatty Liver" } },
    {
      key: ["hepatitis_abc", "hepatitis_abc"],
      value: { label: "Hepatitis A, B, or C" },
    },
    { key: ["jaundice", "jaundice"], value: { label: "Jaundice" } },
  ];

  const quesKeyValKidney = [
    {
      key: ["kidney_stones", "kidney_stones"],
      value: { label: "Kidney Stones" },
    },
    {
      key: ["kidney_failure", "kidney_failure"],
      value: {
        label: HA_LABELS.kidney_failure,
        Dialysis: kidneyData?.kidney_failure?.dialysis === true && "Yes",
        "Days of week": kidneyData?.kidney_failure?.days_of_week_kidney_failure,
        ...(kidneyData?.kidney_failure?.regularly_dialyzed === true ? { "Regularly Dialyzed": "Yes" } : {})
      },
    },
  ];

  const liverAndKidneyArr: any = [];

  quesKeyValLiver.forEach((ques) => {
    if (recursiveObjCheck(liverData, ques.key)) {
      liverAndKidneyArr.push(ques.value);
    }
  });

  quesKeyValKidney.forEach((ques) => {
    if (recursiveObjCheck(kidneyData, ques.key)) {
      liverAndKidneyArr.push(ques.value);
    }
  });

  // console.log("alcoholDrugAndCancer", liverAndKidneyArr);
  return liverAndKidneyArr;
}

// Digestive System is replaced with Gastrointestinal
export function digestiveSystemFn(watchAll: any) {
  const data = watchAll?.health_assesment?.digestive_system;

  const quesKeyVal = [
    {
      key: ["frequent_heartburn", "frequent_heartburn"],
      value: { label: "Frequent Heartburn" },
    },
    {
      key: ["hiatal_hernia", "hiatal_hernia"],
      value: { label: "Hiatal Hernia" },
    },
    { key: ["ulcers", "ulcers"], value: { label: "Ulcers" } },
    {
      key: ["pancreatitis_history", "pancreatitis_history"],
      value: { label: "Pancreatitis History" },
    },
    {
      key: ["esophagus_stricture_surgery", "esophagus_stricture_surgery"],
      value: { label: "Esophagus stricture/ surgery" },
    },
  ];

  const digestiveSystemArr: any = [];

  quesKeyVal.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      digestiveSystemArr.push(ques.value);
    }
  });

  // console.log("digestiveSystemArr", digestiveSystemArr);
  return digestiveSystemArr;
}

// Back Neck is replaced with Others
export function backNeckJawFn(watchAll: any) {
  const data = watchAll?.health_assesment?.back_neck_jaw;

  const quesKeyVal = [
    { key: ["tmj", "tmj"], value: { label: "TMJ" } },
    {
      key: ["rheumatoid_arthritis", "rheumatoid_arthritis"],
      value: { label: "Rheumatoid Arthritis" },
    },
    {
      key: ["thyroid_problems", "thyroid_problems"],
      value: { label: "Thyroid Problems" },
    },
    {
      key: [
        "herniated_disk_or_back_problems",
        "herniated_disk_or_back_problems",
      ],
      value: {
        label: "Herniated Disk or Back Problems",
        Location:
          data?.herniated_disk_or_back_problems
            ?.location_for_herniated_disk_or_back_problems,
      },
    },
    {
      key: ["history_of_drug", "history_of_drug"],
      value: { label: "History of drug resistant infection (MRSA, VRE etc)" },
    },
    {
      key: ["ankylosing_Spondylitis", "ankylosing_Spondylitis"],
      value: { label: "Ankylosing Spondylitis" },
    },
  ];

  const backNeckJawArr: any = [];

  quesKeyVal.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      backNeckJawArr.push(ques.value);
    }
  });

  // console.log("backNeckJawArr", backNeckJawArr);
  return backNeckJawArr;
}

// Nerves Muscles is replaced with Neurological
export function nervesMusclesFn(watchAll: any) {
  const data = watchAll?.health_assesment?.nerves_muscles;
  const additionalData = watchAll?.health_assesment;

  const quesKeyVal = [
    {
      key: ["seizures", "seizures"],
      value: {
        label: "Seizures",
        "Last seizure": data?.seizures?.muscular_disorder_last_seizure,
      },
    },
    {
      key: ["facial_leg_arm_weakness", "facial_leg_arm_weakness"],
      value: { label: "Facial, Leg or Arm Weakness" },
    },
    // {
    //   key: ["hearing_vision_memory_problems", "hearing_vision_memory_problems"],
    //   value: { label: "Problems With Hearing, Vision or Memory",
    //     Which: data?.hearing_vision_memory_problems?.which_muscular_disorder,
    //    },
    // },
    {
      key: ["severe_anxiety", "severe_anxiety"],
      value: { label: "Severe Anxiety" },
    },
    {
      key: ["severe_depression", "severe_depression"],
      value: { label: "Severe Depression" },
    },
    { key: ["chronic_pain", "chronic_pain"], value: { label: "Chronic Pain" } },
    { key: ["glaucoma", "glaucoma"], value: { label: "Glaucoma" } },
    {
      key: ["muscular_disorder", "muscular_disorder"],
      value: {
        label:
          "Muscular Disorder",
        Which: data?.muscular_disorder?.which_muscular_disorder,
      },
    },
    {
      key: ["neurologic_disorder", "neurologic_disorder"],
      value: {
        label:
          "Neurologic Disorder",
        Which: data?.neurologic_disorder?.which_neurologic_disorder,
      },
    },
    {
      key: ["tia_or_stroke", "tia_or_stroke"],
      value: {
        label: "TIA or Stroke",
        "Residual symptoms:":
          data?.tia_or_stroke?.residual_symptoms_for_tia_or_stroke,
        Date: formatDate(data?.tia_or_stroke?.date_for_tia_or_stroke),
      },
    },
    {
      key: ["problems_with_hearing", "problems_with_hearing"],
      value: {
        label: "Problems with hearing, vision or memory",
        Which: data?.problems_with_hearing?.which_problems_with_hearing,
      },
    },
    {
      key: ["psychiatric_illness", "psychiatric_illness"],
      value: {
        label: "History of hallucinations/manic episodes/schizophrenia",
        History: data?.psychiatric_illness.history_of_mental_health_conditions,
      },
    },
    // {key: ['health_detail_write_any_questions'], value:  { label: "Comments or questions for the anesthesiologist?",List: additionalData?.health_detail_write_any_questions }},
    // {key: ['chronic_pain', 'chronic_pain'], value:  { label: "Chronic Pain" }},
  ];

  const nervesMusclesArr = [];

  quesKeyVal.forEach((ques) => {
    if (recursiveObjCheck(data, ques.key)) {
      nervesMusclesArr.push(ques.value);
    }
  });
  // if (additionalData?.additional_medical_illnesses) {
  //   nervesMusclesArr.push({
  //     label: "Additional medical illnesses that were not noted above",
  //     List: additionalData?.additional_medical_illnesses,
  //   });
  // }
  if (additionalData?.health_detail_write_any_questions) {
    nervesMusclesArr.push({
      label: "Comments or questions for the anesthesiologist:",
      Query: additionalData?.health_detail_write_any_questions,
    });
  }

  // console.log("nervesMusclesArr", nervesMusclesArr);
  return nervesMusclesArr;
} 