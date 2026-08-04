export type NodeStatus = "Not Started" | "In Progress" | "Under Review" | "Approved";
export type HierarchyNode = {
  id: string;
  name: string;
  kind: string;
  status: NodeStatus;
  children?: HierarchyNode[];
};

export const HIERARCHY: HierarchyNode = {
  id: "cg3000",
  name: "CardioGuard 3000",
  kind: "Product",
  status: "In Progress",
  children: [
    {
      id: "patient-interface", name: "Patient Interface System", kind: "System", status: "In Progress",
      children: [
        { id: "electrode", name: "Electrode Assembly", kind: "Subsystem", status: "Approved", children: [
          { id: "snap-connector", name: "Snap Electrode Connector", kind: "Element", status: "Approved" },
          { id: "lead-harness", name: "Lead Wire Harness (4-lead)", kind: "Part", status: "Approved" },
          { id: "ecg-protection", name: "ECG Input Protection Circuit", kind: "Part", status: "In Progress" },
        ]},
        { id: "spo2", name: "SpO2 Module", kind: "Subsystem", status: "In Progress", children: [
          { id: "photodiode", name: "Photodiode Sensor Array", kind: "Part", status: "Approved" },
          { id: "led-driver", name: "LED Driver Circuit", kind: "Part", status: "Not Started" },
          { id: "spo2-sw", name: "SpO2 Signal Processor", kind: "Software Element", status: "In Progress" },
        ]},
        { id: "nibp", name: "NIBP Module", kind: "Subsystem", status: "Not Started", children: [
          { id: "cuff-sensor", name: "Cuff Pressure Sensor", kind: "Part", status: "Not Started" },
          { id: "pump", name: "Pneumatic Pump Assembly", kind: "Part", status: "Not Started" },
        ]},
      ],
    },
    {
      id: "power", name: "Power Management System", kind: "System", status: "In Progress",
      children: [
        { id: "battery-pack", name: "Battery Pack", kind: "Subsystem", status: "In Progress", children: [
          { id: "li-ion", name: "Li-Ion Cell Array (3S2P)", kind: "Part", status: "Approved" },
          { id: "bms", name: "Battery Management IC (BQ40Z80)", kind: "Part", status: "In Progress" },
          { id: "ntc", name: "Thermal Sensor (NTC)", kind: "Part", status: "In Progress" },
          { id: "balancing", name: "Cell Balancing Circuit", kind: "Part", status: "Approved" },
          { id: "xt60", name: "Pack Connector (XT60)", kind: "Part", status: "Approved" },
        ]},
        { id: "acdc", name: "AC/DC Power Converter", kind: "Subsystem", status: "Approved", children: [
          { id: "mains-filter", name: "Mains Input Filter", kind: "Part", status: "Approved" },
          { id: "sw-reg", name: "Switching Regulator (12V)", kind: "Part", status: "Approved" },
          { id: "sec-reg", name: "Secondary Regulator (3.3V/5V)", kind: "Part", status: "Approved" },
        ]},
        { id: "pdb", name: "Power Distribution Board", kind: "Subsystem", status: "Under Review" },
      ],
    },
    {
      id: "signal", name: "Signal Processing System", kind: "System", status: "Approved",
      children: [
        { id: "afe", name: "Analog Front End (AFE)", kind: "Subsystem", status: "Approved", children: [
          { id: "instr-amp", name: "Instrumentation Amplifier", kind: "Part", status: "Approved" },
          { id: "adc", name: "ADC (ADS1299)", kind: "Part", status: "Approved" },
          { id: "emi", name: "EMI Filter Network", kind: "Part", status: "Approved" },
        ]},
        { id: "ecg-sw", name: "ECG Processing Software", kind: "Software Element", status: "Approved" },
        { id: "sq-mon", name: "Signal Quality Monitor", kind: "Software Element", status: "In Progress" },
      ],
    },
    {
      id: "display", name: "Display and Alarm System", kind: "System", status: "Under Review",
      children: [
        { id: "lcd", name: "LCD Display Module (7-inch)", kind: "Subsystem", status: "Approved" },
        { id: "audible-alarm", name: "Audible Alarm Assembly", kind: "Subsystem", status: "Approved" },
        { id: "visual-alarm", name: "Visual Alarm LEDs", kind: "Part", status: "Approved" },
        { id: "display-sw", name: "Display Driver Software", kind: "Software Element", status: "Under Review" },
        { id: "alarm-sw", name: "Alarm Management Software", kind: "Software Element", status: "Under Review" },
      ],
    },
    {
      id: "comm", name: "Communication Module", kind: "System", status: "In Progress",
      children: [
        { id: "bluetooth", name: "Bluetooth 5.2 Module", kind: "Subsystem", status: "In Progress" },
        { id: "wifi", name: "Wi-Fi / Ethernet Module", kind: "Subsystem", status: "Not Started" },
        { id: "usb", name: "USB Interface", kind: "Part", status: "In Progress" },
        { id: "encryption", name: "Data Encryption Module", kind: "Software Element", status: "Not Started" },
      ],
    },
    {
      id: "enclosure", name: "Enclosure and Mechanical", kind: "System", status: "In Progress",
      children: [
        { id: "housing", name: "Main Housing (IP44)", kind: "Part", status: "In Progress" },
        { id: "control-panel", name: "Control Panel Assembly", kind: "Subsystem", status: "In Progress" },
        { id: "mount", name: "Mounting System", kind: "Part", status: "Approved" },
        { id: "thermal-mgmt", name: "Thermal Management Assembly", kind: "Subsystem", status: "In Progress" },
      ],
    },
    {
      id: "accessories", name: "Accessories", kind: "Level", status: "In Progress",
      children: [
        { id: "patient-cable", name: "Patient Cable Set (10-lead)", kind: "Accessory", status: "In Progress" },
        { id: "case", name: "Carrying and Transport Case", kind: "Accessory", status: "Not Started" },
        { id: "cal-tool", name: "Calibration Verification Tool", kind: "Accessory", status: "Not Started" },
        { id: "ac-adapter", name: "AC Power Adapter (24V/5A)", kind: "Accessory", status: "Approved" },
        { id: "bracket", name: "Mounting Bracket (Pole/Wall)", kind: "Accessory", status: "Not Started" },
      ],
    },
    {
      id: "consumables", name: "Consumables", kind: "Level", status: "Not Started",
      children: [
        { id: "electrodes", name: "Disposable ECG Electrodes (Ag/AgCl)", kind: "Consumable", status: "Not Started" },
        { id: "spo2-probe", name: "SpO2 Finger Probe (Disposable)", kind: "Consumable", status: "Not Started" },
        { id: "printer-paper", name: "Thermal Printer Paper Roll", kind: "Consumable", status: "Not Started" },
        { id: "cuff", name: "NIBP Cuff (Adult/Pediatric)", kind: "Consumable", status: "Not Started" },
      ],
    },
    {
      id: "super", name: "Super System", kind: "Level", status: "In Progress",
      children: [
        { id: "hospital-power", name: "Hospital Power Infrastructure", kind: "External", status: "In Progress" },
        { id: "icu-nurse", name: "Clinical User (ICU Nurse)", kind: "User", status: "In Progress" },
        { id: "biomed", name: "Clinical User (Biomedical Technician)", kind: "User", status: "Not Started" },
        { id: "patient", name: "Patient", kind: "Subject", status: "In Progress" },
        { id: "emr", name: "Hospital Network / EMR System", kind: "External", status: "Not Started" },
        { id: "environment", name: "Physical Environment (Temp, Humidity, EMI)", kind: "External", status: "In Progress" },
        { id: "adjacent", name: "Adjacent Medical Devices", kind: "External", status: "Not Started" },
      ],
    },
  ],
};

export const BATTERY_FUNCTIONS = [
  { id: "F-BAT-01", text: "Supply regulated 11.1V DC at rated capacity for minimum 8hr continuous operation" },
  { id: "F-BAT-02", text: "Maintain safe operating temperature within 0-45 degrees C during charge and discharge" },
  { id: "F-BAT-03", text: "Communicate state-of-charge and health status to device firmware via SMBus" },
  { id: "F-BAT-04", text: "Provide overcurrent, overvoltage, and short-circuit protection" },
];