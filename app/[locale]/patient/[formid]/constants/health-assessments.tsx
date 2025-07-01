import { useTranslations } from "next-intl";

export const useTranslatedFields = () => {
  const t = useTranslations("Index");

  const cardiovascularFields = [
    {
      title: t("cardiovascularHeartFailure"),
      titleSchema: "heart_failure",
    },
    {
      title: t("cardiovascularHeartValveProblem"),
      titleSchema: "heart_valve_problem",
    },
    {
      title: t("cardiovascularHeartAttack"),
      titleSchema: "heart_attack",
      dateSchema: "heart_attack_date",
    },
    {
      title: t("cardiovascularIrregularHeartbeat"),
      titleSchema: "irregular_heartbeat",
    },
    {
      title: t("cardiovascularLowHeartRate"),
      titleSchema: "low_heart_rate",
      // fieldPrimary: t("cardiovascularLowHeartRateType"),
      // fieldPrimarySchema: "low_heart_rate_type",
      // triggerTest: "electrocardiogram",
    },
    {
      title: t("cardiovascularArteryBlockage"),
      titleSchema: "artery_blockage",
    },
    {
      title: t("cardiovascularPeripheralVascularDisease"),
      titleSchema: "peripheral_vascular_disease",
    },
    {
      title: t("cardiovascularChestPain"),
      titleSchema: "chest_pain",
    },
    {
      title: t("cardiovascularBloodThinner"),
      titleSchema: "blood_thinner",
    },
    {
      title: t("cardiovascularStairsTrouble"),
      titleSchema: "stairs_trouble",
    },
    {
      title: t("cardiovascularPhysicalLimitations"),
      titleSchema: "physical_limitations",
    },
    {
      title: t("cardiovascularDiabetes"),
      titleSchema: "diabetes",
      fieldPrimary: t("cardiovascularHbA1c"),
      fieldPrimarySchema: "diabetes_hba1c",
    },
    {
      title: t("cardiovascularHeartSurgery"),
      titleSchema: "heart_or_blood_vessel_surgery",
      fieldPrimary: t("cardiovascularSurgeryType"),
      fieldPrimarySchema: "heart_or_blood_vessel_surgery_type",
      dateSchema: "heart_or_blood_vessel_surgery_date",
    },
    {
      title: t("cardiovascularImplantedDevice"),
      titleSchema: "implanted_device",
      fieldPrimary: t("cardiovascularDeviceManufacturer"),
      fieldPrimarySchema: "implanted_device_manufacturer",
      fieldSecondary: t("cardiovascularLastInterrogation"),
      fieldSecondarySchema: "implanted_device_last_interrogation",
      fieldTertiary: t("cardiovascularPacemakerDependent"),
      fieldTertiarySchema: "implanted_device_pacemaker_dependent",
    },
    {
      title: t("cardiovascularCongenitalHeartDisease"),
      titleSchema: "congenital_heart_disease",
    },
    {
      title: t("cardiovascularAorticAneurysm"),
      titleSchema: "aortic_aneurysm",
    },
    {
      title: t("respiratoryHighBloodPressureTreatment"),
      titleSchema: "high_blood_pressure_treatment",
      fieldOptions: [
        "90/60",
        "120/80",
        "150/90",
        "180/100"
      ],
      fieldOptionsTitle: t("respiratoryBloodPressureRead"),
      fieldOptionsSchema: 'cpap_settings_blood_pressure',
    },
    {
      title: t("cardiovascularHeartStents"),
      titleSchema: "heart_stents",
      dateSchema: "heart_stents_date",
      fieldOptionsTitle: t("cardiovascularStentType"),
      fieldOptions: [
        "bare metal",
        "drug eluting",],
      fieldOptionsSchema: "stent_type",
    },
    
    {
      title: t("cardiovascularRaynaud"),
      titleSchema: "raynauds_syndrome",
    },
  ];

  const respiratoryFields = [
    {
      title: t("respiratoryShortnessOfBreath"),
      titleSchema: "shortness_of_breath",
    },
    {
      title: t("respiratoryCysticFibrosis"),
      titleSchema: "cystic_fibrosis",
    },
    {
      title: t("respiratoryHighBloodPressureLungs"),
      titleSchema: "high_blood_pressure_lungs",
    },
    {
      title: t("respiratoryPulmonaryFibrosis"),
      titleSchema: "pulmonary_fibrosis",
    },
    { title: t("respiratoryTB"), titleSchema: "tb" },
    { title: t("respiratorySarcoidosis"), titleSchema: "sarcoidosis" },
    {
      title: t("respiratorySupplementalOxygen"),
      titleSchema: "use_supplemental_oxygen",
    },
    { title: t("respiratorySnore"), titleSchema: "do_you_snore" },
    {
      title: t("respiratoryDaytimeTiredness"),
      titleSchema: "feel_tired_daytime",
    },
    {
      title: t("respiratoryStopBreathingSleep"),
      titleSchema: "stop_breathing_sleep",
    },
    {
      title: t("respiratorySleepApnea"),
      titleSchema: "sleep_apnea",
      fieldPrimary: t("respiratoryCPAPSettings"),
      fieldPrimarySchema: "cpap_settings_sleep_apnea",
    },
    {
      title: t("respiratorySmoke"),
      titleSchema: "smoke",
      fieldPrimary: t("respiratoryPacksPerDay"),
      fieldPrimarySchema: "packs_per_day_smoked",
      fieldSecondary: t("respiratoryHowManyYears"),
      fieldSecondarySchema: "how_many_years",
    },
    {
      title: t("respiratoryEverSmoked"),
      titleSchema: "ever_smoked",
      fieldPrimary: t("respiratoryPacksPerDay"),
      fieldPrimarySchema: "packs_per_day_smoked",
      fieldSecondary: t("respiratoryHowManyYears"),
      fieldSecondarySchema: "how_many_years",
    },
    {
      title: t("respiratoryCOPD"),
      titleSchema: "copd_emphysema",
      fieldRadio: t("respiratoryHospitalizationRequired"),
      fieldRadioSchema: "hospitalization_copd",
    },
    {
      title: t("respiratoryAsthma"),
      titleSchema: "asthma",
      fieldRadio: t("respiratoryHospitalizationRequired"),
      fieldRadioSchema: "hospitalization_asthma",
    },
    
    {
      title: t("respiratoryPneumoniaLastMonth"),
      titleSchema: "pneumonia_last_month",
    },
  ];

  const alcoholDrugFields = [
    {
      title: t("alcoholDrugAlcohol"),
      titleSchema: "alcohol",
      fieldPrimary: t("alcoholDrugDaysPerWeek"),
      fieldPrimarySchema: "days_per_week",
      fieldSecondary: t("alcoholDrugWhatAlcohol"),
      fieldSecondarySchema: "what_alcohol",
      fieldTertiary: t("alcoholDrugQuantity"),
      fieldTertiarySchema: "quantity_alcohol",
    },
    {
      title: t("alcoholDrugWithdrawalSymptoms"),
      titleSchema: "alcohol_withdrawal_symptoms_seizures",
    },
    {
      title: t("alcoholDrugUseDrugs"),
      titleSchema: "use_street_illicit_drugs",
      fieldPrimary: t("alcoholDrugListOfDrugs"),
      fieldPrimarySchema: "list_of_drugs",
    },
  ];

  const cancerFields = [
    {
      title: t("cancerHadCancer"),
      titleSchema: "have_you_ever_had_cancer",
      fieldPrimary: t("cancerType"),
      fieldPrimarySchema: "what_type_of_cancer",
    },
    {
      title: t("cancerChemotherapy"),
      titleSchema: "have_you_ever_been_treated_with_chemotherapy",
      fieldPrimary: t("cancerTreatmentName"),
      fieldPrimarySchema: "name_of_treatment_for_chemotherapy",
      dateSchema: "last_treatment_date_for_chemotherapy",
    },
  ];

  const bloodDisorderField = [
    {
      title: t("bloodDisorderLeukemia"),
      titleSchema: "leukemia_lymphoma",
    },
    { title: t("bloodDisorderClots"), titleSchema: "blood_clots" },
    { title: t("bloodDisorderAnemia"), titleSchema: "anemia" },
    {
      title: t("bloodDisorderSickleCell"),
      titleSchema: "sickle_cell_disease",
    },
    {
      title: t("bloodDisorderTransfusion"),
      titleSchema: "blood_transfusion_past",
    },
    {
      title: t("bloodDisorderHIVAIDS"),
      titleSchema: "hiv_aids",
    },
    {
      title: t("bloodDisorderVonWillebrand"),
      titleSchema: "von_willebrand_disease",
    },
    {
      title: t("bloodDisorderFactorVLeiden"),
      titleSchema: "factor_v_leiden_mutation",
    },
    {
      title: t("bloodDisorderThrombocytopenia"),
      titleSchema: "low_platelet_count",
    },
  ];

  const liverField = [
    { title: t("liverCirrhosis"), titleSchema: "cirrhosis" },
    { title: t("liverFattyLiver"), titleSchema: "fatty_liver" },
    { title: t("liverHepatitis"), titleSchema: "hepatitis_abc" },
    { title: t("liverJaundice"), titleSchema: "jaundice" },
  ];

  const kidneyField = [
    { title: t("kidneyStones"), titleSchema: "kidney_stones" },
    {
      title: t("kidneyFailure"),
      titleSchema: "kidney_failure",
      fieldPrimary: t("kidneyDialysis"),
      fieldPrimarySchema: "dialysis",
      fieldSecondary: t("regularlyDialyzed"),
      fieldSecondarySchema: "regularly_dialyzed",
      fieldTertiary: t("daysOfWeekKidneyFailure"),
      fieldTertiarySchema: "days_of_week_kidney_failure",
    },
    {
      title: t("kidneyUrinaryPain"),
      titleSchema: "urinary_pain",
      triggerTest: "urinalysis",
    },
  ];

  //Gastrointestinal Gastrointestinal = Digestive System
  const digestiveSystemField = [
    {
      title: t("digestiveHeartburn"),
      titleSchema: "frequent_heartburn",
    },
    { title: t("digestiveHernia"), titleSchema: "hiatal_hernia" },
    { title: t("digestiveUlcers"), titleSchema: "ulcers" },
    { title: t("pancreatitisHistory"), titleSchema: "pancreatitis_history" },
    {
      title: t("esophagusStricture"),
      titleSchema: "esophagus_stricture_surgery",
    },
    {
      title: t("digestiveIBD"),
      titleSchema: "inflammatory_bowel_disorder",
    },
  ];

  // back neck jaw is replaced with other
  const backNeckJawField = [
    { title: t("backNeckJawTMJ"), titleSchema: "tmj" },
    {
      title: t("backNeckJawArthritis"),
      titleSchema: "rheumatoid_arthritis",
    },
    {
      title: t("backNeckJawThyroid"),
      titleSchema: "thyroid_problems",
    },
    {
      title: t("backNeckJawHerniatedDisk"),
      titleSchema: "herniated_disk_or_back_problems",
      fieldPrimary: t("backNeckJawLocation"),
      fieldPrimarySchema: "location_for_herniated_disk_or_back_problems",
    },
    {
      title: t("backNeckJawHistoryOfDrug"),
      titleSchema: "history_of_drug",
    },
    {
      title: t("backNeckJawAnkylosingSpondylitis"),
      titleSchema: "ankylosing_Spondylitis",
    },
  ];

  //nerves and muscles = Neurological
  const nerveMusclesField = [
    {
      title: t("nerveMusclesSeizures"),
      titleSchema: "seizures",
      checkLabel: t("nerveMusclesIsLastSeizureWithin3Months"),
      checkSchema: "is_last_seizure_within_3_months",
      dateSchema: "date_for_muscular_disorder_last_seizure",
      // fieldSecondary: t("nerveMusclesLastSeizure"),
      // fieldSecondarySchema: "muscular_disorder_last_seizure",
      

    },
    {
      title: t("nerveMusclesWeakness"),
      titleSchema: "facial_leg_arm_weakness",
    },
    // {
    //   title: t("nerveMusclesHearingVisionMemory"),
    //   titleSchema: "hearing_vision_memory_problems",
    //   fieldPrimary: t("nerveMusclesWhichHearingVisionMemory"),
    //   fieldPrimarySchema: "which_nerveM_muscle",
    // },
    {
      title: t("nerveMusclesProblemsWithHearing"),
      titleSchema: "⁠problems_with_hearing",
      fieldPrimary: t("which"),
      fieldPrimarySchema: "which_problems_with_hearing",
    },
    {
      title: t("nerveMusclesAnxiety"),
      titleSchema: "severe_anxiety",
    },
    {
      title: t("nerveMusclesDepression"),
      titleSchema: "severe_depression",
    },
    {
      title: t("nerveMusclesChronicPain"),
      titleSchema: "chronic_pain",
    },
    { title: t("nerveMusclesGlaucoma"), titleSchema: "glaucoma" },
    {
      title: t("nerveMusclesMuscularDisorder"),
      titleSchema: "muscular_disorder",
      fieldPrimary: t("nerveMusclesWhichMuscularDisorder"),
      fieldPrimarySchema: "which_muscular_disorder",
    },
    {
      title: t("nerveMusclesNeurologicDisorder"),
      titleSchema: "neurologic_disorder",
      fieldPrimary: t("nerveMusclesWhichNeurologicDisorder"),
      fieldPrimarySchema: "which_neurologic_disorder",
    },
    {
      title: t("nerveMusclesTIAStroke"),
      titleSchema: "tia_or_stroke",
      fieldPrimary: t("nerveMusclesResidualSymptoms"),
      fieldPrimarySchema: "residual_symptoms_for_tia_or_stroke",
      dateSchema: "date_for_tia_or_stroke",
    },
    {
      title: t("historyOfMentalHealthConditions"),
      titleSchema: "psychiatric_illness",
      fieldPrimary: t("which"),
      fieldPrimarySchema: "history_of_mental_health_conditions",
    },
  ];

  return {
    cardiovascularFields,
    respiratoryFields,
    alcoholDrugFields,
    cancerFields,
    bloodDisorderField,
    liverField,
    kidneyField,
    digestiveSystemField,
    backNeckJawField,
    nerveMusclesField,
  };
};
