export const STANDARDS = [
  { id: "ISO 14971:2019", title: "Medical devices - Application of risk management", relevance: "Core risk management standard for all DFMEAs" },
  { id: "IEC 62304:2006+A1:2015", title: "Medical device software - Software life cycle processes", relevance: "Software failure modes, safety classification" },
  { id: "IEC 60601-1:2005+A1:2012", title: "Basic safety and essential performance", relevance: "Device-level safety requirements" },
  { id: "IEC 60601-1-2:2014+A1:2020", title: "Electromagnetic disturbances", relevance: "EMC and EMI failure modes" },
  { id: "IEC 60601-1-8:2006+A1:2012", title: "Alarm systems", relevance: "Alarm failure modes, prioritization" },
  { id: "IEC 60601-2-25:2011+A1:2015", title: "ECG equipment", relevance: "ECG-specific performance requirements" },
  { id: "IEC 60601-2-30:2009+A1:2013", title: "NIBP equipment", relevance: "Blood pressure monitoring requirements" },
  { id: "IEC 60601-2-61:2011+A1:2015", title: "Pulse oximeter equipment", relevance: "SpO2 module failure modes" },
  { id: "IEC 62133-2:2017", title: "Secondary lithium cells - Safety", relevance: "Battery safety requirements" },
  { id: "ISO 13485:2016", title: "Quality management systems - Medical devices", relevance: "Manufacturing and quality failure modes" },
  { id: "ISO 10993-5:2009", title: "Biological evaluation - Cytotoxicity", relevance: "Consumable and electrode biocompatibility" },
  { id: "FDA MDR Database", title: "Manufacturer and User Facility Device Experience", relevance: "Historical failure reports" },
];

export const ACTIVITY = [
  ["14:31", "R. Sharma", "accepted AI suggestion FM-0142 (Battery Pack, S=8)"],
  ["14:18", "P. Kaul", "edited failure mode FM-0089, changed O from 4 to 3"],
  ["13:55", "T. Iyer", "added mitigation MIT-0067 for FM-0067 (Enclosure seal failure)"],
  ["13:40", "A. Rodrigues", "rejected AI suggestion FM-AI-031 (Duplicate detected)"],
  ["13:22", "S. Mehta", "approved 6 DFMEA rows in Power Management subsystem"],
  ["12:58", "N. Pillai", "linked FM-0031 to verification test VT-0031"],
  ["12:41", "R. Sharma", "uploaded document: CardioGuard_SRS_v1.4.pdf (extracted 312 entities)"],
  ["11:30", "AI Analysis Agent", "completed batch run: 143 suggestions generated"],
  ["09:15", "P. Kaul", "created project DFMEA-2025-001 from CardioGuard 3000 BOM Rev C"],
] as const;

export const DOCUMENTS = [
  { name: "CardioGuard_3000_PRS_v2.1.pdf", type: "PRS", version: "v2.1", pages: 84, by: "R. Sharma", date: "2025-02-01", status: "Extracted", entities: "312 entities" },
  { name: "CardioGuard_3000_SRS_v1.4.pdf", type: "SRS", version: "v1.4", pages: 127, by: "P. Kaul", date: "2025-02-03", status: "Extracted", entities: "489 entities" },
  { name: "CardioGuard_3000_BOM_RevC.xlsx", type: "BOM", version: "Rev C", pages: null, by: "T. Iyer", date: "2025-02-05", status: "Extracted", entities: "214 components" },
  { name: "ECG_Software_SRS_v0.9.pdf", type: "Software SRS", version: "v0.9", pages: 56, by: "P. Kaul", date: "2025-02-07", status: "Extracted", entities: "178 entities" },
  { name: "Enclosure_CAD_BOM_RevA.xlsx", type: "CAD BOM", version: "Rev A", pages: null, by: "T. Iyer", date: "2025-02-08", status: "Extracted", entities: "89 components" },
  { name: "PowerManagement_Schematic_v1.2.pdf", type: "Schematic", version: "v1.2", pages: 22, by: "A. Rodrigues", date: "2025-02-10", status: "Extracted", entities: "67 entities" },
  { name: "Project_Neptune_DFMEA_2022.xlsx", type: "Prev. DFMEA", version: "2022", pages: null, by: "S. Mehta", date: "2025-02-12", status: "Extracted", entities: "341 FM records" },
  { name: "CardioGuard_2000_DFMEA_2021.xlsx", type: "Prev. DFMEA", version: "2021", pages: null, by: "S. Mehta", date: "2025-02-12", status: "Extracted", entities: "298 FM records" },
  { name: "CardioGuard_3000_UserManual_Draft.pdf", type: "User Manual", version: "Draft", pages: 112, by: "N. Pillai", date: "2025-02-15", status: "Extracted", entities: "203 entities" },
  { name: "Calibration_Protocol_v1.0.pdf", type: "Test Protocol", version: "v1.0", pages: 34, by: "T. Iyer", date: "2025-02-18", status: "Extracted", entities: "88 entities" },
  { name: "EMC_Test_Report_2025-03.pdf", type: "Test Report", version: "2025", pages: 41, by: "A. Rodrigues", date: "2025-03-05", status: "Extracted", entities: "52 entities" },
  { name: "IEC_60601-1_2024_Extract.pdf", type: "Standard", version: "2024", pages: 18, by: "N. Pillai", date: "2025-03-10", status: "Extracted", entities: "41 clauses" },
  { name: "ISO_14971_2019_RiskMgmt.pdf", type: "Standard", version: "2019", pages: 24, by: "N. Pillai", date: "2025-03-10", status: "Extracted", entities: "58 clauses" },
  { name: "CAPA_Records_Export_2025-04.xlsx", type: "CAPA", version: "2025", pages: null, by: "S. Mehta", date: "2025-04-01", status: "Extracted", entities: "89 records" },
];

export const REQUIREMENTS = [
  ["REQ-PWR-001", "Device shall operate for minimum 8hr on battery alone"],
  ["REQ-PWR-002", "Device shall detect and alarm on mains power loss within 3 seconds"],
  ["REQ-PWR-003", "Battery shall maintain >= 80% rated capacity for 500 charge cycles"],
  ["REQ-ECG-001", "Device shall acquire 12-lead ECG with <= 25 microV resolution"],
  ["REQ-ECG-002", "Device shall detect and alarm ST elevation within 5 seconds"],
  ["REQ-ECG-003", "ECG signal shall meet IEC 60601-2-25 accuracy requirements"],
  ["REQ-ALM-001", "Device shall generate audible alarm at >= 65 dB at 1m for critical alarms"],
  ["REQ-ALM-002", "Device shall implement alarm prioritization per IEC 60601-1-8"],
  ["REQ-ALM-003", "Alarm latency for critical events shall not exceed 2 seconds"],
  ["REQ-SAFE-001", "Patient leakage current shall not exceed 10 microA (normal condition)"],
  ["REQ-SAFE-002", "Protective earth continuity shall be verified at installation"],
  ["REQ-SAFE-003", "Device shall meet IEC 60601-1 basic safety requirements"],
  ["REQ-SW-001", "Software shall comply with IEC 62304 Safety Class B"],
  ["REQ-SW-002", "Software shall implement watchdog timer for critical processes"],
  ["REQ-ENV-001", "Device shall operate within 0-40C, 15-90% RH, non-condensing"],
  ["REQ-ENV-002", "Device shall carry minimum IP44 rating"],
] as const;

export const KB_RESULTS = [
  { source: "Previous DFMEA", similarity: 94, title: "CardioGuard 2000 DFMEA 2021 - FM-CG2-088", body: "\"Battery overtemperature during fast charge due to NTC sensor drift\"\nSeverity: 9 | Occurrence: 3 | RPN: 81 | Status: Mitigated\nMitigation applied: Dual-NTC cross-validation; charge halt on disagreement > 5C" },
  { source: "FDA MDR database", similarity: 91, title: "MDR Report 3006712 - 2022-11-03", body: "Manufacturer: Apex Medical Devices | Device: PortaCard II (Class II)\nEvent: Battery thermal event during charging in ICU. Root cause: NTC calibration drift causing BMS to underestimate pack temperature by 12C. No patient injury reported." },
  { source: "Medical standards", similarity: 88, title: "IEC 62133-2:2017 - Section 7.3.5", body: "\"Thermal protection requirements for secondary lithium cells in portable applications\"\nRelevant clause: Cells shall incorporate thermal protection that activates before cell temperature exceeds manufacturer-specified maximum operating temperature." },
  { source: "CAPA records", similarity: 85, title: "CAPA-2023-0041 - CardioGuard 2000 Field Issue", body: "Root cause: Battery health indicator algorithm did not account for cold-temperature capacity derating. 34 units returned with \"short battery life\" complaint in Nordic region. Corrective action: SoC algorithm updated to include temperature-compensated capacity table." },
  { source: "Lessons learned", similarity: 82, title: "LL-2023-012 - Power Management Design Review", body: "\"Always validate BMS IC trip time against worst-case inrush current at startup. BMS false trips caused by startup inrush were the most common field return reason for the PulseCheck 100 product line (2019-2022). Recommend inrush limiter on all new designs from PMS Rev 2 onwards.\"" },
  { source: "FDA MDR database", similarity: 79, title: "MDR Report 3004521 - 2023-02-17", body: "Manufacturer: MedCore Innovations | Device: VitalWatch III (Class II)\nEvent: Thermal event during overnight charging. Charging IC failed short, bypassing BMS protection. Device rendered non-functional. No patient harm." },
];

export const RECENT_REPORTS = [
  ["DFMEA_CardioGuard3000_Full_20250514.xlsx", "Full DFMEA", "All levels", "R. Sharma", "2025-05-14 14:00"],
  ["RiskSummary_CG3000_Critical_20250512.pdf", "Risk Summary", "Critical", "S. Mehta", "2025-05-12 10:30"],
  ["Traceability_CG3000_Full_20250510.xlsx", "Traceability", "All levels", "N. Pillai", "2025-05-10 16:45"],
  ["RegulatoryPackage_CG3000_v1_20250508.zip", "Reg Package", "All levels", "S. Mehta", "2025-05-08 11:00"],
  ["OpenItems_CG3000_20250506.pdf", "Open Items", "All levels", "R. Sharma", "2025-05-06 09:15"],
  ["AISuggestions_CG3000_20250505.pdf", "AI Suggestions", "All levels", "P. Kaul", "2025-05-05 17:30"],
] as const;