import { icons, type AppIconComponent } from "@/components/icons/iconMap";

export type IntegrationStatus = "connected" | "syncing";

export type Integration = {
  name: string;
  vendor: string;
  category: string;
  icon: AppIconComponent;
  status: IntegrationStatus;
  lastSync: string;
  endpoint: string;
  feeds: string; // what data comes in
  into: string; // what part of the DFMEA it drives
  records: string; // headline record counts
};

/**
 * Systems PragnaAI is connected to. Each one pushes engineering / quality
 * data into the platform, which the AI agents turn into DFMEA content.
 */
export const INTEGRATIONS: Integration[] = [
  {
    name: "Siemens Teamcenter",
    vendor: "Siemens Digital Industries",
    category: "PLM",
    icon: icons.plm,
    status: "connected",
    lastSync: "Today 11:42",
    endpoint: "teamcenter.medicore.local/tc",
    feeds: "Product structure, BOM (Rev C), part master & Engineering Change Orders (ECOs)",
    into: "Product Hierarchy + failure-mode seeding",
    records: "214 parts · 37 ECOs · 6 levels",
  },
  {
    name: "Jama Connect",
    vendor: "Jama Software",
    category: "Requirements / ALM",
    icon: icons.requirements,
    status: "connected",
    lastSync: "Today 10:18",
    endpoint: "medicore.jamacloud.com",
    feeds: "Product & software requirements, functions and design inputs",
    into: "Functions, requirements & traceability",
    records: "489 requirements · 178 SW items",
  },
  {
    name: "Greenlight Guru",
    vendor: "Greenlight Guru",
    category: "QMS",
    icon: icons.qms,
    status: "connected",
    lastSync: "Today 09:55",
    endpoint: "medicore.greenlight.guru",
    feeds: "CAPA records, complaints and nonconformances from the field",
    into: "Occurrence rating + detection controls",
    records: "89 CAPA · 62 complaints",
  },
  {
    name: "FDA MAUDE / MDR",
    vendor: "U.S. FDA (public)",
    category: "Regulatory database",
    icon: icons.regulatory,
    status: "connected",
    lastSync: "Today 08:30",
    endpoint: "api.fda.gov/device/event",
    feeds: "Historical adverse-event & device-failure reports for similar cardiac monitors",
    into: "Known failure modes + occurrence evidence",
    records: "1,204 matched reports",
  },
  {
    name: "SAP S/4HANA",
    vendor: "SAP",
    category: "ERP",
    icon: icons.database,
    status: "syncing",
    lastSync: "Syncing now…",
    endpoint: "sap.medicore.local",
    feeds: "Supplier master, approved manufacturer list and part cost data",
    into: "Supplier risk + cost roll-ups",
    records: "312 suppliers · 214 SKUs",
  },
  {
    name: "Polarion Test Mgmt",
    vendor: "Siemens",
    category: "Verification / Test",
    icon: icons.verification,
    status: "connected",
    lastSync: "Today 07:12",
    endpoint: "polarion.medicore.local",
    feeds: "Verification & validation test cases and pass/fail results",
    into: "Detection rating + verification traceability",
    records: "171 traced · 67 gaps",
  },
];
