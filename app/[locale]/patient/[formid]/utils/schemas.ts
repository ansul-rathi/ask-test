import { z } from "zod";

// Cardiovascular Health Schema
const CardiovascularHealthSchema = z.object({
  heart_failure: z.object({
    heart_failure: z.boolean().optional(),
  }),
  heart_valve_problem: z.object({
    heart_valve_problem: z.boolean().optional(),
  }),
  heart_attack: z.object({
    heart_attack: z.boolean().optional(),
  }),
  heart_attack_date: z.string().datetime().optional(),
  irregular_heartbeat: z.object({
    irregular_heartbeat: z.boolean().optional(),
  }),
  artery_blockage: z.object({
    artery_blockage: z.boolean().optional(),
  }),
  peripheral_vascular_disease: z.object({
    peripheral_vascular_disease: z.boolean().optional(),
  }),
  chest_pain: z.object({
    chest_pain: z.boolean().optional(),
  }),
  blood_thinner: z.object({
    blood_thinner: z.boolean().optional(),
  }),
  stairs_trouble: z.object({
    stairs_trouble: z.boolean().optional(),
  }),
  physical_limitations: z.object({
    physical_limitations: z.boolean().optional(),
  }),

  diabetes: z.object({
    diabetes: z.boolean().optional(),
    diabetes_hba1c: z.string().optional(),
    heart_or_blood_vessel_surgery: z.boolean().optional(),
    heart_or_blood_vessel_surgery_type: z.string().optional(),
    heart_or_blood_vessel_surgery_date: z.string().datetime().optional(),
  }),

  implanted_device: z.object({
    implanted_device: z.boolean().optional(),
    implanted_device_manufacturer: z.string().optional(),
    implanted_device_last_interrogation: z.string().optional(),
    implanted_device_pacemaker_dependent: z.string().optional(),
  }),
});

// Respiratory Health Schema
const RespiratoryHealthSchema = z.object({
  shortness_of_breath: z.object({
    shortness_of_breath: z.boolean().optional(),
  }),
  cystic_fibrosis: z.object({
    cystic_fibrosis: z
      .boolean({ invalid_type_error: "please correct" })
      .optional(),
  }),
  high_blood_pressure_lungs: z.object({
    high_blood_pressure_lungs: z.boolean().optional(),
  }),
  pulmonary_fibrosis: z.object({
    pulmonary_fibrosis: z.boolean().optional(),
  }),
  tb: z.object({
    tb: z.boolean().optional(),
  }),
  sarcoidosis: z.object({
    sarcoidosis: z.boolean().optional(),
  }),
  use_supplemental_oxygen: z.object({
    use_supplemental_oxygen: z.boolean().optional(),
  }),
  do_you_snore: z.object({
    do_you_snore: z.boolean().optional(),
  }),
  feel_tired_daytime: z.object({
    feel_tired_daytime: z.boolean().optional(),
  }),
  stop_breathing_sleep: z.object({
    stop_breathing_sleep: z.boolean().optional(),
  }),
  sleep_apnea: z
    .object({
      cpap_settings_sleep_apnea: z.string().optional(),
    })
    .optional(),

  high_blood_pressure_treatment: z
    .object({
      cpap_settings_blood_pressure: z.string().optional(),
    })
    .optional(),

  smoke: z
    .object({
      packs_per_day: z.string().optional(),
    })
    .optional(),

  copd_emphysema: z
    .object({
      hospitalization_copd: z.string().optional(),
    })
    .optional(),

  asthma: z
    .object({
      hospitalization_asthma: z.string().optional(),
    })
    .optional(),

  ever_smoked: z
    .object({
      packs_per_day_smoked: z.string().optional(),
      // quit_smoking_date: z.string().datetime().optional(),
    })
    .optional(),
});

// Alcohol and Drug Use Schema
const AlcoholDrugSchema = z.object({
  alcohol: z.object({
    days_per_week: z.string().optional(),
    what_alcohol: z.string().optional(),
    quantity_alcohol: z.string().optional(),
  }),
  alcohol_withdrawal: z.boolean().optional(),
  illicit_drugs: z
    .object({
      list_of_drugs: z.string().optional(),
    })
    .optional(),
});

// Cancer Schema
const CancerSchema = z.object({
  have_you_ever_had_cancer: z.object({
    what_type_of_cancer: z.string().optional(),
  }),
  have_you_ever_been_treated_with_chemotherapy: z.object({
    name_of_treatment_for_chemotherapy: z.string().optional(),
    last_treatment_date_for_chemotherapy: z.string().datetime().optional(),
  }),
});

// Blood Disorders Schema
const BloodDisordersSchema = z
  .object({
    leukemia_lymphoma: z.object({
      leukemia_lymphoma: z.boolean().optional(),
    }),
    blood_clots: z.object({
      blood_clots: z.boolean().optional(),
    }),
    anemia: z.object({
      anemia: z.boolean().optional(),
    }),
    sickle_cell_disease: z.object({
      sickle_cell_disease: z.boolean().optional(),
    }),
    blood_transfusion_past: z.object({
      blood_transfusion_past: z.boolean().optional(),
    }),
    hiv_aids: z.object({
      hiv_aids: z.boolean().optional(),
    }),
    von_willebrand_disease: z.object({
      von_willebrand_disease: z.boolean().optional(),
    }),
    factor_v_leiden_mutation: z.object({
      factor_v_leiden_mutation: z.boolean().optional(),
    }),
  })
  .optional();

// Liver Schema
const LiverSchema = z.object({
  cirrhosis: z.object({
    cirrhosis: z.boolean().optional(),
  }),
  fatty_liver: z.object({
    fatty_liver: z.boolean().optional(),
  }),
  hepatitis_abc: z.object({
    hepatitis_abc: z.boolean().optional(),
  }),
  jaundice: z.object({
    jaundice: z.boolean().optional(),
  }),
});

// Kidneys Schema
const KidneysSchema = z
  .object({
    kidney_stones: z.boolean(),
    kidney_failure: z.object({
      dialysis: z.object({
        days_of_week_kidney_failure: z.array(z.string()),
        regularly_dialyzed: z.array(z.any()),
      }),
    }),
  })
  .optional();

// Digestive System Schema
const DigestiveSystemSchema = z.object({
  frequent_heartburn: z.object({
    frequent_heartburn: z.boolean().optional(),
  }),
  hiatal_hernia: z.object({
    hiatal_hernia: z.boolean().optional(),
  }),
  ulcers: z.object({
    ulcers: z.boolean().optional(),
  }),
}).optional();

// Back, Neck or Jaw Schema
const BackNeckJawSchema = z
  .object({
    tmj: z.object({
      tmj: z.boolean().optional(),
    }),
    rheumatoid_arthritis: z.object({
      rheumatoid_arthritis: z.boolean().optional(),
    }),
    thyroid_problems: z.object({
      thyroid_problems: z.boolean().optional(),
    }),
    herniated_disk_or_back_problems: z.object({
      location_for_herniated_disk_or_back_problems: z.string().optional(),
    }),
  })
  .optional();

// Nerves or Muscles Schema
const NervesMusclesSchema = z.object({
  seizures: z.object({
    muscular_disorder_last_seizure: z.string().optional(),
  }),
  facial_leg_arm_weakness: z.object({
    facial_leg_arm_weakness: z.boolean().optional(),
  }),
  // hearing_vision_memory_problems: z.object({
  //   hearing_vision_memory_problems: z.boolean().optional(),
  // }),
  severe_anxiety: z.object({
    severe_anxiety: z.boolean().optional(),
  }),
  severe_depression: z.object({
    severe_depression: z.boolean().optional(),
  }),
  chronic_pain: z.object({
    chronic_pain: z.boolean().optional(),
  }),
  glaucoma: z.object({
    glaucoma: z.boolean().optional(),
  }),
  muscular_disorder: z.object({
    which_muscular_disorder: z.string().optional(),
  }),
  neurologic_disorder: z.object({
    which_neurologic_disorder: z.string().optional(),
  }),
  tia_or_stroke: z.object({
    residual_symptoms_for_tia_or_stroke: z.string().optional(),
    date_for_tia_or_stroke: z.string().datetime().optional(),
  }),
}).optional();

export const healthAssessmentSchema = z.object({
  health_assesment: z.object({
    cardiovascular_health: CardiovascularHealthSchema,
    respiratory_health: RespiratoryHealthSchema,
    alcohol_drug_use: AlcoholDrugSchema,
    cancer: CancerSchema,
    blood_disorders: BloodDisordersSchema,
    liver: LiverSchema,
    kidneys: KidneysSchema,
    digestive_system: DigestiveSystemSchema,
    back_neck_jaw: BackNeckJawSchema,
    nerves_muscles: NervesMusclesSchema,
  }),
  images: z.array(z.string()).optional(),
});

export const basicAndSurgicalSchema = z.object({
  patient_information: z.object({
    patient_name: z
      .string({ required_error: "Patient name is required" })
      .trim()
      .min(1, { message: "This field is required" }),
    dob: z.string().datetime().optional(),
    height_feet: z
      .string({ required_error: "Height(feet) is required" })
      .trim()
      .min(1, { message: "Height(feet) is required" }),
    height_inches: z
      .string({ required_error: "Height(inches) is required" })
      .trim()
      .min(1, { message: "Height(inches) is required" }),
    weight: z
      .string({ required_error: "Weight is required" })
      .min(1, { message: "Weight is required" }),
    gender: z.string().min(1, { message: "Biological Sex is required" }),
    name_of_primary_care: z
      .string()
      .min(1, { message: "This field is required" })
      .max(50, { message: "This field is required" }),
    primary_care_phone_number: z
      .string()
      .max(11, { message: "Phone number should be 11 digits" }),
    name_of_cardiologist: z.string().max(50).optional(),
    cardiologist_phone_number: z
      .string()
      .max(11, { message: "Phone number should be 11 digits" }),
    name_of_doctor: z
      .string()
      .min(1, { message: "This field is required" })
      .max(50, { message: "Name should be between 2 and 50 characters" }),
    surgical_procedure: z.string().min(2).max(30, {
      message: "Procedure name should be between 2 and 30 characters",
    }),
  }),
});

export const medicalHistorySchema = z.object({
  medical_history: z.object({
    nose_bleed: z.boolean().optional(),
    bleeding_with_tooth_extractions: z.boolean().optional(),
    bleeding_after_surgery: z.boolean().optional(),

    sever_nausea_vomiting: z.boolean().optional(),
    awareness_under_anesthesia: z.object({
      was_it_during_endoscopy: z.boolean().optional(),
      was_it_during_dental_procedure: z.boolean().optional(),
    }).optional(),
    malignant_hyperthermia: z.boolean().optional(),
    breathing_difficulties: z.boolean().optional(),
    placement_of_breathing_tube: z.boolean().optional(),

    problems_opening_mouth: z.boolean().optional(),
    dental_damage_implants: z.object({
      dental_damage_implants: z.boolean().optional(),
    }).optional(),
    problems_moving_neck: z.boolean().optional(),
    could_you_be_pregnant: z.boolean().optional(),
  }),
});

export const testsAndMedicationSchema = z.object({
  location_of_ekg: z
    .string({ required_error: "This field is required" })
    .max(50)
    .optional(),
  date_of_ekg: z.string().max(50).optional(),
  location_of_sleep_study: z.string().max(50).optional(),
  date_of_sleep_study: z.string().max(50).optional(),
  location_of_blood_work: z.string().max(50).optional(),
  date_of_blood_work: z.string().max(50).optional(),
  location_of_stress_test: z.string().max(50).optional(),
  date_of_stress_test: z.string().max(50).optional(),
  location_of_echo: z.string().max(50).optional(),
  date_of_echo: z.string().max(50).optional(),
  location_of_pulmonary_function_test: z.string().max(50).optional(),
  date_of_pulmonary_function_test: z.string().max(50).optional(),
  insulin: z.boolean().optional(),
  losartan: z.boolean().optional(),
  lisinopril: z.boolean().optional(),
  naltrexone: z.boolean().optional(),
  beta_blockers: z.boolean().optional(),
  morphine: z.boolean().optional(),
  oxycodone: z.boolean().optional(),
  buprenorphine: z.boolean().optional(),
  methadone: z.boolean().optional(),
  hiv_prep: z.boolean().optional(),
  // hiv_prep_dose: z.string().max(50).optional(),
  weight_loss_drugs: z.boolean().optional(),
  chronic_steroids: z.boolean().optional(),
  chronic_steroids_drug_name: z.string().max(50).optional(),
  chronic_steroids_dose: z.string().max(50).optional(),
  how_long_have_you_been_on_chronic_steroids: z.string().max(50).optional(),
  blood_thinners: z.boolean().optional(),
  blood_thinners_drug_name: z.string().max(50).optional().optional(),
  blood_thinners_dose: z.string().max(50).optional(),
  blood_thinners_frequency: z.string().max(50).optional(),
  inhalers: z.boolean().optional(),
  inhalers_drug_name: z.string().max(50).optional(),
  inhalers_frequency: z.string().max(50).optional(),
});

export const mainSchema = z.object({
  health_assesment: healthAssessmentSchema,
  patient_information: basicAndSurgicalSchema,
  medical_history: medicalHistorySchema,
  test_and_medication: testsAndMedicationSchema,
});
