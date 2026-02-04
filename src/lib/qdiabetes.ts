/**
 * QDiabetes-2018 Algorithm Implementation
 * 
 * Copyright 2017 ClinRisk Ltd.
 * 
 * This implementation faithfully follows the algorithm from https://qdiabetes.org
 * Licensed under GNU Affero General Public License v3.0
 * 
 * DISCLAIMER: The initial version of this file, to be found at http://qdiabetes.org, 
 * faithfully implements QDiabetes-2018. ClinRisk Ltd. have released this code under 
 * the GNU Affero General Public License to enable others to implement the algorithm faithfully.
 * However, the nature of the GNU Affero General Public License is such that we cannot prevent, 
 * for example, someone accidentally altering the coefficients, getting the inputs wrong, 
 * or just poor programming. ClinRisk Ltd. stress, therefore, that it is the responsibility 
 * of the end user to check that the source that they receive produces the same results as 
 * the original code found at http://qdiabetes.org.
 * Inaccurate implementations of risk scores can lead to wrong patients being given the wrong treatment.
 */

export interface QDiabetesInput {
  age: number;
  sex: 'male' | 'female';
  ethnicity: number; // 1-9
  smoking: number; // 0-4
  bmi: number;
  familyHistoryDiabetes: boolean;
  cardiovascularDisease: boolean;
  treatedHypertension: boolean;
  learningDisabilities: boolean;
  mentalIllness: boolean; // manic depression or schizophrenia
  corticosteroids: boolean;
  statins: boolean;
  atypicalAntipsychotics: boolean;
  // Female only
  polycysticOvaries?: boolean;
  gestationalDiabetes?: boolean;
  // Optional blood tests
  fastingBloodGlucose?: number;
  hba1c?: number;
  // Townsend score (default 0 if unknown)
  townsendScore?: number;
}

export interface QDiabetesResult {
  riskPercentage: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  model: 'A' | 'B' | 'C';
}

// Ethnicity coefficients for females
const FEMALE_ETHNICITY_A: number[] = [
  0, 0, 1.0695857881565456, 1.3430172097414006, 1.8029022579794518,
  1.1274654517708020, 0.4214631490239910, 0.2850919645908353,
  0.8815108797589199, 0.3660573343168487
];

const FEMALE_ETHNICITY_B: number[] = [
  0, 0, 0.9898906127239111, 1.2511504196326508, 1.4934757568196120,
  0.9673887434565966, 0.4844644519593178, 0.4784214955360102,
  0.7520946270805577, 0.4050880741541424
];

const FEMALE_ETHNICITY_C: number[] = [
  0, 0, 0.5990951599291540, 0.7832030965635389, 1.1947351247960103,
  0.7141744699168143, 0.1195328468388768, 0.0136688728784904,
  0.5709226537693945, 0.1709107628106929
];

// Smoking coefficients for females
const FEMALE_SMOKING_A: number[] = [0, 0.0656016901750590, 0.2845098867369837, 0.3567664381700702, 0.5359517110678775];
const FEMALE_SMOKING_B: number[] = [0, 0.0374156307236963, 0.2252973672514482, 0.3099736428023662, 0.4361942139496417];
const FEMALE_SMOKING_C: number[] = [0, 0.0658482585100006, 0.1458413689734224, 0.1525864247480118, 0.3078741679661397];

// Ethnicity coefficients for males
const MALE_ETHNICITY_A: number[] = [
  0, 0, 1.1000230829124793, 1.2903840126147210, 1.6740908848727458,
  1.1400446789147816, 0.4682468169065580, 0.6990564996301544,
  0.6894365712711156, 0.4172222846773820
];

const MALE_ETHNICITY_B: number[] = [
  0, 0, 1.0081475800686235, 1.3359138425778705, 1.4815419524892652,
  1.0384996851820663, 0.5202348070887524, 0.8579673418258558,
  0.6413108960765615, 0.4838340220821504
];

const MALE_ETHNICITY_C: number[] = [
  0, 0, 0.6757120705498780, 0.8314732504966345, 1.0969133802228563,
  0.7682244636456048, 0.2089752925910850, 0.3809159378197057,
  0.3423583679661269, 0.2204647785343308
];

// Smoking coefficients for males
const MALE_SMOKING_A: number[] = [0, 0.1638740910548557, 0.3185144911395897, 0.3220726656778343, 0.4505243716340953];
const MALE_SMOKING_B: number[] = [0, 0.1119475792364162, 0.3110132095412204, 0.3328898469326042, 0.4257069026941993];
const MALE_SMOKING_C: number[] = [0, 0.1159289120687865, 0.1462418263763327, 0.1078142411249314, 0.1984862916366847];

function calculateFemaleModelA(input: QDiabetesInput): number {
  const survivor = 0.986227273941040;
  const town = (input.townsendScore ?? 0) - 0.391116052865982;
  
  const dage = input.age / 10;
  const age_1 = Math.pow(dage, 0.5) - 2.123332023620606;
  const age_2 = Math.pow(dage, 3) - 91.644744873046875;
  
  const dbmi = input.bmi / 10;
  const bmi_1 = dbmi - 2.571253299713135;
  const bmi_2 = Math.pow(dbmi, 3) - 16.999439239501953;
  
  let a = 0;
  
  // Conditional sums
  a += FEMALE_ETHNICITY_A[input.ethnicity] || 0;
  a += FEMALE_SMOKING_A[input.smoking] || 0;
  
  // Continuous values
  a += age_1 * 4.3400852699139278;
  a += age_2 * -0.0048771702696158879;
  a += bmi_1 * 2.9320361259524925;
  a += bmi_2 * -0.0474002058748434900;
  a += town * 0.0373405696180491510;
  
  // Boolean values
  a += (input.atypicalAntipsychotics ? 1 : 0) * 0.5526764611098438;
  a += (input.corticosteroids ? 1 : 0) * 0.2679223368067459;
  a += (input.cardiovascularDisease ? 1 : 0) * 0.1779722905458669;
  a += (input.gestationalDiabetes ? 1 : 0) * 1.5248871531467574;
  a += (input.learningDisabilities ? 1 : 0) * 0.2783514358717271;
  a += (input.mentalIllness ? 1 : 0) * 0.2618085210917905;
  a += (input.polycysticOvaries ? 1 : 0) * 0.3406173988206666;
  a += (input.statins ? 1 : 0) * 0.6590728773280821;
  a += (input.treatedHypertension ? 1 : 0) * 0.4394758285813711;
  a += (input.familyHistoryDiabetes ? 1 : 0) * 0.5313359456558733;
  
  // Interaction terms
  a += age_1 * (input.atypicalAntipsychotics ? 1 : 0) * -0.8031518398316395;
  a += age_1 * (input.learningDisabilities ? 1 : 0) * -0.8641596002882057;
  a += age_1 * (input.statins ? 1 : 0) * -1.9757776696583935;
  a += age_1 * bmi_1 * 0.6553138757562945;
  a += age_1 * bmi_2 * -0.0362096572016301;
  a += age_1 * (input.familyHistoryDiabetes ? 1 : 0) * -0.2641171450558896;
  a += age_2 * (input.atypicalAntipsychotics ? 1 : 0) * 0.0004684041181021;
  a += age_2 * (input.learningDisabilities ? 1 : 0) * 0.0006724968808953;
  a += age_2 * (input.statins ? 1 : 0) * 0.0023750534194347;
  a += age_2 * bmi_1 * -0.0044719662445263;
  a += age_2 * bmi_2 * 0.0001185479967753;
  a += age_2 * (input.familyHistoryDiabetes ? 1 : 0) * 0.0004161025828904;
  
  return 100.0 * (1 - Math.pow(survivor, Math.exp(a)));
}

function calculateFemaleModelB(input: QDiabetesInput): number {
  const survivor = 0.990905702114105;
  const town = (input.townsendScore ?? 0) - 0.391116052865982;
  const fbs = input.fastingBloodGlucose!;
  
  const dage = input.age / 10;
  const age_1 = Math.pow(dage, 0.5) - 2.123332023620606;
  const age_2 = Math.pow(dage, 3) - 91.644744873046875;
  
  const dbmi = input.bmi / 10;
  const bmi_1 = dbmi - 2.571253299713135;
  const bmi_2 = Math.pow(dbmi, 3) - 16.999439239501953;
  
  const fbs_1 = Math.pow(fbs, -1) - 0.208309367299080;
  const fbs_2 = Math.pow(fbs, -1) * Math.log(fbs) - 0.326781362295151;
  
  let a = 0;
  
  a += FEMALE_ETHNICITY_B[input.ethnicity] || 0;
  a += FEMALE_SMOKING_B[input.smoking] || 0;
  
  a += age_1 * 3.7650129507517280;
  a += age_2 * -0.0056043343436614941;
  a += bmi_1 * 2.4410935031672469;
  a += bmi_2 * -0.0421526334799096;
  a += fbs_1 * -2.1887891946337308;
  a += fbs_2 * -69.9608419828660290;
  a += town * 0.0358046297663126;
  
  a += (input.atypicalAntipsychotics ? 1 : 0) * 0.4748378550253853;
  a += (input.corticosteroids ? 1 : 0) * 0.3767933443754728;
  a += (input.cardiovascularDisease ? 1 : 0) * 0.1967261568066525;
  a += (input.gestationalDiabetes ? 1 : 0) * 1.0689325033692647;
  a += (input.learningDisabilities ? 1 : 0) * 0.4542293408951034;
  a += (input.mentalIllness ? 1 : 0) * 0.1616171889084260;
  a += (input.polycysticOvaries ? 1 : 0) * 0.3565365789576717;
  a += (input.statins ? 1 : 0) * 0.5809287382718667;
  a += (input.treatedHypertension ? 1 : 0) * 0.2836632020122907;
  a += (input.familyHistoryDiabetes ? 1 : 0) * 0.4522149766206111;
  
  a += age_1 * (input.atypicalAntipsychotics ? 1 : 0) * -0.7683591642786522;
  a += age_1 * (input.learningDisabilities ? 1 : 0) * -0.7983128124297588;
  a += age_1 * (input.statins ? 1 : 0) * -1.9033508839833257;
  a += age_1 * bmi_1 * 0.4844747602404915;
  a += age_1 * bmi_2 * -0.0319399883071813;
  a += age_1 * fbs_1 * 2.2442903047404350;
  a += age_1 * fbs_2 * 13.0068388699783030;
  a += age_1 * (input.familyHistoryDiabetes ? 1 : 0) * -0.3040627374034501;
  a += age_2 * (input.atypicalAntipsychotics ? 1 : 0) * 0.0005194455624413;
  a += age_2 * (input.learningDisabilities ? 1 : 0) * 0.0003028327567161;
  a += age_2 * (input.statins ? 1 : 0) * 0.0024397111406018;
  a += age_2 * bmi_1 * -0.0041572976682154;
  a += age_2 * bmi_2 * 0.0001126882194204;
  a += age_2 * fbs_1 * 0.0199345308534312;
  a += age_2 * fbs_2 * -0.0716677187529306;
  a += age_2 * (input.familyHistoryDiabetes ? 1 : 0) * 0.0004523639671202;
  
  return 100.0 * (1 - Math.pow(survivor, Math.exp(a)));
}

function calculateFemaleModelC(input: QDiabetesInput): number {
  const survivor = 0.988788545131683;
  const town = (input.townsendScore ?? 0) - 0.391116052865982;
  const hba1c = input.hba1c!;
  
  const dage = input.age / 10;
  const age_1 = Math.pow(dage, 0.5) - 2.123332023620606;
  const age_2 = Math.pow(dage, 3) - 91.644744873046875;
  
  const dbmi = input.bmi / 10;
  const bmi_1 = dbmi - 2.571253299713135;
  const bmi_2 = Math.pow(dbmi, 3) - 16.999439239501953;
  
  const dhba1c = hba1c / 10;
  const hba1c_1 = Math.pow(dhba1c, 0.5) - 1.886751174926758;
  const hba1c_2 = dhba1c - 3.559829950332642;
  
  let a = 0;
  
  a += FEMALE_ETHNICITY_C[input.ethnicity] || 0;
  a += FEMALE_SMOKING_C[input.smoking] || 0;
  
  a += age_1 * 3.5655214891947722;
  a += age_2 * -0.0056158243572733;
  a += bmi_1 * 2.5043028874544841;
  a += bmi_2 * -0.0428758018926904;
  a += hba1c_1 * 8.7368031307362184;
  a += hba1c_2 * -0.0782313866699499;
  a += town * 0.0358668220563482;
  
  a += (input.atypicalAntipsychotics ? 1 : 0) * 0.5497633311042200;
  a += (input.corticosteroids ? 1 : 0) * 0.1687220550638970;
  a += (input.cardiovascularDisease ? 1 : 0) * 0.1644330036273934;
  a += (input.gestationalDiabetes ? 1 : 0) * 1.1250098105171140;
  a += (input.learningDisabilities ? 1 : 0) * 0.2891205831073965;
  a += (input.mentalIllness ? 1 : 0) * 0.3182512249068407;
  a += (input.polycysticOvaries ? 1 : 0) * 0.3380644414098174;
  a += (input.statins ? 1 : 0) * 0.4559396847381116;
  a += (input.treatedHypertension ? 1 : 0) * 0.4040022295023758;
  a += (input.familyHistoryDiabetes ? 1 : 0) * 0.4428015404826031;
  
  a += age_1 * (input.atypicalAntipsychotics ? 1 : 0) * -0.8125434197162131;
  a += age_1 * (input.learningDisabilities ? 1 : 0) * -0.9084665765269808;
  a += age_1 * (input.statins ? 1 : 0) * -1.8557960585560658;
  a += age_1 * bmi_1 * 0.6023218765235252;
  a += age_1 * bmi_2 * -0.0344950383968044;
  a += age_1 * (input.familyHistoryDiabetes ? 1 : 0) * -0.2727571351506187;
  a += age_1 * hba1c_1 * 25.4412033227367150;
  a += age_1 * hba1c_2 * -6.8076080421556107;
  a += age_2 * (input.atypicalAntipsychotics ? 1 : 0) * 0.0004665611306005;
  a += age_2 * (input.learningDisabilities ? 1 : 0) * 0.0008518980139928;
  a += age_2 * (input.statins ? 1 : 0) * 0.0022627250963352;
  a += age_2 * bmi_1 * -0.0043386645663133;
  a += age_2 * bmi_2 * 0.0001162778561671;
  a += age_2 * (input.familyHistoryDiabetes ? 1 : 0) * 0.0004354519795220;
  a += age_2 * hba1c_1 * -0.0522541355885925;
  a += age_2 * hba1c_2 * 0.0140548259061144;
  
  return 100.0 * (1 - Math.pow(survivor, Math.exp(a)));
}

function calculateMaleModelA(input: QDiabetesInput): number {
  const survivor = 0.978732228279114;
  const town = (input.townsendScore ?? 0) - 0.515986680984497;
  
  const dage = input.age / 10;
  const age_1 = Math.log(dage) - 1.496392488479614;
  const age_2 = Math.pow(dage, 3) - 89.048171997070313;
  
  const dbmi = input.bmi / 10;
  const bmi_1 = Math.pow(dbmi, 2) - 6.817805767059326;
  const bmi_2 = Math.pow(dbmi, 3) - 17.801923751831055;
  
  let a = 0;
  
  a += MALE_ETHNICITY_A[input.ethnicity] || 0;
  a += MALE_SMOKING_A[input.smoking] || 0;
  
  a += age_1 * 4.4642324388691348;
  a += age_2 * -0.0040750108019255;
  a += bmi_1 * 0.9512902786712067;
  a += bmi_2 * -0.1435248827788547;
  a += town * 0.0259181820676787;
  
  a += (input.atypicalAntipsychotics ? 1 : 0) * 0.4210109234600543;
  a += (input.corticosteroids ? 1 : 0) * 0.2218358093292538;
  a += (input.cardiovascularDisease ? 1 : 0) * 0.2026960575629002;
  a += (input.learningDisabilities ? 1 : 0) * 0.2331532140798696;
  a += (input.mentalIllness ? 1 : 0) * 0.2277044952051772;
  a += (input.statins ? 1 : 0) * 0.5849007543114134;
  a += (input.treatedHypertension ? 1 : 0) * 0.3337939218350107;
  a += (input.familyHistoryDiabetes ? 1 : 0) * 0.6479928489936953;
  
  a += age_1 * (input.atypicalAntipsychotics ? 1 : 0) * -0.9463772226853415;
  a += age_1 * (input.learningDisabilities ? 1 : 0) * -0.9384237552649983;
  a += age_1 * (input.statins ? 1 : 0) * -1.7479070653003299;
  a += age_1 * bmi_1 * 0.4514759924187976;
  a += age_1 * bmi_2 * -0.1079548126277638;
  a += age_1 * (input.familyHistoryDiabetes ? 1 : 0) * -0.6011853042930119;
  a += age_2 * (input.atypicalAntipsychotics ? 1 : 0) * -0.0000519927442172;
  a += age_2 * (input.learningDisabilities ? 1 : 0) * 0.0007102643855968;
  a += age_2 * (input.statins ? 1 : 0) * 0.0013508364599531;
  a += age_2 * bmi_1 * -0.0011797722394560;
  a += age_2 * bmi_2 * 0.0002147150913931;
  a += age_2 * (input.familyHistoryDiabetes ? 1 : 0) * 0.0004914185594087;
  
  return 100.0 * (1 - Math.pow(survivor, Math.exp(a)));
}

function calculateMaleModelB(input: QDiabetesInput): number {
  const survivor = 0.985019445419312;
  const town = (input.townsendScore ?? 0) - 0.515986680984497;
  const fbs = input.fastingBloodGlucose!;
  
  const dage = input.age / 10;
  const age_1 = Math.log(dage) - 1.496392488479614;
  const age_2 = Math.pow(dage, 3) - 89.048171997070313;
  
  const dbmi = input.bmi / 10;
  const bmi_1 = Math.pow(dbmi, 2) - 6.817805767059326;
  const bmi_2 = Math.pow(dbmi, 3) - 17.801923751831055;
  
  const fbs_1 = Math.pow(fbs, -0.5) - 0.448028832674026;
  const fbs_2 = Math.pow(fbs, -0.5) * Math.log(fbs) - 0.719442605972290;
  
  let a = 0;
  
  a += MALE_ETHNICITY_B[input.ethnicity] || 0;
  a += MALE_SMOKING_B[input.smoking] || 0;
  
  a += age_1 * 4.1149143302364717;
  a += age_2 * -0.0047593576668505;
  a += bmi_1 * 0.8169361587644297;
  a += bmi_2 * -0.1250237740343336;
  a += fbs_1 * -54.8417881280971070;
  a += fbs_2 * -53.1120784984813600;
  a += town * 0.0253741755198943;
  
  a += (input.atypicalAntipsychotics ? 1 : 0) * 0.4417934088889577;
  a += (input.corticosteroids ? 1 : 0) * 0.3413547348339454;
  a += (input.cardiovascularDisease ? 1 : 0) * 0.2158977454372756;
  a += (input.learningDisabilities ? 1 : 0) * 0.4012885027585300;
  a += (input.mentalIllness ? 1 : 0) * 0.2181769391399779;
  a += (input.statins ? 1 : 0) * 0.5147657600111734;
  a += (input.treatedHypertension ? 1 : 0) * 0.2467209287407037;
  a += (input.familyHistoryDiabetes ? 1 : 0) * 0.5749437333987512;
  
  a += age_1 * (input.atypicalAntipsychotics ? 1 : 0) * -0.9502224313823126;
  a += age_1 * (input.learningDisabilities ? 1 : 0) * -0.8358370163090045;
  a += age_1 * (input.statins ? 1 : 0) * -1.8141786919269460;
  a += age_1 * bmi_1 * 0.3748482092078384;
  a += age_1 * bmi_2 * -0.0909836579562487;
  a += age_1 * fbs_1 * 21.0117301217643340;
  a += age_1 * fbs_2 * 23.8244600447469740;
  a += age_1 * (input.familyHistoryDiabetes ? 1 : 0) * -0.6780647705291665;
  a += age_2 * (input.atypicalAntipsychotics ? 1 : 0) * 0.0001472972077162;
  a += age_2 * (input.learningDisabilities ? 1 : 0) * 0.0006012919264966;
  a += age_2 * (input.statins ? 1 : 0) * 0.0016393484911405;
  a += age_2 * bmi_1 * -0.0010774782221531;
  a += age_2 * bmi_2 * 0.0001911048730458;
  a += age_2 * fbs_1 * -0.0390046079223835;
  a += age_2 * fbs_2 * -0.0411277198058959;
  a += age_2 * (input.familyHistoryDiabetes ? 1 : 0) * 0.0006257588248859;
  
  return 100.0 * (1 - Math.pow(survivor, Math.exp(a)));
}

function calculateMaleModelC(input: QDiabetesInput): number {
  const survivor = 0.981181740760803;
  const town = (input.townsendScore ?? 0) - 0.515986680984497;
  const hba1c = input.hba1c!;
  
  const dage = input.age / 10;
  const age_1 = Math.log(dage) - 1.496392488479614;
  const age_2 = Math.pow(dage, 3) - 89.048171997070313;
  
  const dbmi = input.bmi / 10;
  const bmi_1 = Math.pow(dbmi, 2) - 6.817805767059326;
  const bmi_2 = Math.pow(dbmi, 3) - 17.801923751831055;
  
  const dhba1c = hba1c / 10;
  const hba1c_1 = Math.pow(dhba1c, 0.5) - 1.900265336036682;
  const hba1c_2 = dhba1c - 3.611008167266846;
  
  let a = 0;
  
  a += MALE_ETHNICITY_C[input.ethnicity] || 0;
  a += MALE_SMOKING_C[input.smoking] || 0;
  
  a += age_1 * 4.0193435623978031;
  a += age_2 * -0.0048396442306278;
  a += bmi_1 * 0.8182916890534932;
  a += bmi_2 * -0.1255880870135964;
  a += hba1c_1 * 8.0511642238857934;
  a += hba1c_2 * -0.1465234689391449;
  a += town * 0.0252299651849007;
  
  a += (input.atypicalAntipsychotics ? 1 : 0) * 0.4554152522017330;
  a += (input.corticosteroids ? 1 : 0) * 0.1381618768682392;
  a += (input.cardiovascularDisease ? 1 : 0) * 0.1454698889623951;
  a += (input.learningDisabilities ? 1 : 0) * 0.2596046658040857;
  a += (input.mentalIllness ? 1 : 0) * 0.2852378849058589;
  a += (input.statins ? 1 : 0) * 0.4255195190118552;
  a += (input.treatedHypertension ? 1 : 0) * 0.3316943000645931;
  a += (input.familyHistoryDiabetes ? 1 : 0) * 0.5661232594368061;
  
  a += age_1 * (input.atypicalAntipsychotics ? 1 : 0) * -1.0013331909079835;
  a += age_1 * (input.learningDisabilities ? 1 : 0) * -0.8916465737221592;
  a += age_1 * (input.statins ? 1 : 0) * -1.7074561167819817;
  a += age_1 * bmi_1 * 0.4507452747267244;
  a += age_1 * bmi_2 * -0.1085185980916560;
  a += age_1 * (input.familyHistoryDiabetes ? 1 : 0) * -0.6141009388709716;
  a += age_1 * hba1c_1 * 27.6705938271465650;
  a += age_1 * hba1c_2 * -7.4006134846785434;
  a += age_2 * (input.atypicalAntipsychotics ? 1 : 0) * 0.0002245597398574;
  a += age_2 * (input.learningDisabilities ? 1 : 0) * 0.0006604436076569;
  a += age_2 * (input.statins ? 1 : 0) * 0.0013873509357389;
  a += age_2 * bmi_1 * -0.0012224736160287;
  a += age_2 * bmi_2 * 0.0002266731010346;
  a += age_2 * (input.familyHistoryDiabetes ? 1 : 0) * 0.0005060258289477;
  a += age_2 * hba1c_1 * -0.0592014581247543;
  a += age_2 * hba1c_2 * 0.0155920894851499;
  
  return 100.0 * (1 - Math.pow(survivor, Math.exp(a)));
}

function getRiskLevel(percentage: number): 'low' | 'moderate' | 'high' | 'very-high' {
  if (percentage < 5.6) return 'low';
  if (percentage < 10) return 'moderate';
  if (percentage < 20) return 'high';
  return 'very-high';
}

export function calculateQDiabetesRisk(input: QDiabetesInput): QDiabetesResult {
  let riskPercentage: number;
  let model: 'A' | 'B' | 'C';
  
  // Determine which model to use based on available data
  if (input.hba1c && input.hba1c > 0) {
    model = 'C';
    riskPercentage = input.sex === 'female' 
      ? calculateFemaleModelC(input) 
      : calculateMaleModelC(input);
  } else if (input.fastingBloodGlucose && input.fastingBloodGlucose > 0) {
    model = 'B';
    riskPercentage = input.sex === 'female' 
      ? calculateFemaleModelB(input) 
      : calculateMaleModelB(input);
  } else {
    model = 'A';
    riskPercentage = input.sex === 'female' 
      ? calculateFemaleModelA(input) 
      : calculateMaleModelA(input);
  }
  
  return {
    riskPercentage: Math.max(0, Math.min(100, riskPercentage)),
    riskLevel: getRiskLevel(riskPercentage),
    model
  };
}

export const ETHNICITY_OPTIONS = [
  { value: 1, label: 'White or not stated' },
  { value: 2, label: 'Indian' },
  { value: 3, label: 'Pakistani' },
  { value: 4, label: 'Bangladeshi' },
  { value: 5, label: 'Other Asian' },
  { value: 6, label: 'Black Caribbean' },
  { value: 7, label: 'Black African' },
  { value: 8, label: 'Chinese' },
  { value: 9, label: 'Other ethnic group' }
];

export const SMOKING_OPTIONS = [
  { value: 0, label: 'Non-smoker' },
  { value: 1, label: 'Ex-smoker' },
  { value: 2, label: 'Light smoker (less than 10/day)' },
  { value: 3, label: 'Moderate smoker (10-19/day)' },
  { value: 4, label: 'Heavy smoker (20+/day)' }
];
