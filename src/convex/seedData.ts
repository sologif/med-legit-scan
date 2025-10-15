import { internalMutation } from "./_generated/server";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existing = await ctx.db.query("medicines").first();
    if (existing) {
      return { message: "Data already seeded" };
    }

    // Seed sample medicines
    const medicines = [
      {
        code: "MED001234",
        name: "Paracetamol 500mg",
        manufacturer: "PharmaCorp Ltd.",
        batchNo: "PC2024-A156",
        mfgDate: "2024-03-15",
        expDate: "2026-03-14",
        licenseNo: "DL-12345",
        status: "legal" as const,
        country: "India",
        composition: "Paracetamol 500mg",
        warnings: [],
      },
      {
        code: "MED005678",
        name: "Amoxicillin 250mg",
        manufacturer: "MediLife Pharma",
        batchNo: "ML2023-B892",
        mfgDate: "2023-06-20",
        expDate: "2024-06-19",
        licenseNo: "DL-67890",
        status: "expired" as const,
        country: "India",
        composition: "Amoxicillin Trihydrate 250mg",
        warnings: ["Expired - Do not use"],
      },
      {
        code: "MED009999",
        name: "Fake Aspirin",
        manufacturer: "Unknown Source",
        batchNo: "FAKE-001",
        mfgDate: "2024-01-01",
        expDate: "2025-01-01",
        licenseNo: "INVALID",
        status: "counterfeit" as const,
        country: "Unknown",
        composition: "Unknown substances",
        warnings: ["COUNTERFEIT DETECTED", "Do not consume", "Report immediately"],
      },
      {
        code: "MED002468",
        name: "Ibuprofen 400mg",
        manufacturer: "HealthPlus Industries",
        batchNo: "HP2024-C234",
        mfgDate: "2024-01-10",
        expDate: "2026-01-09",
        licenseNo: "DL-24680",
        status: "recalled" as const,
        country: "India",
        composition: "Ibuprofen 400mg",
        warnings: ["Product recalled due to quality concerns", "Return to pharmacy"],
      },
      {
        code: "MED003579",
        name: "Cetirizine 10mg",
        manufacturer: "AllerCare Pharmaceuticals",
        batchNo: "AC2024-D567",
        mfgDate: "2024-02-28",
        expDate: "2026-02-27",
        licenseNo: "DL-35790",
        status: "legal" as const,
        country: "India",
        composition: "Cetirizine Hydrochloride 10mg",
        warnings: [],
      },
    ];

    for (const medicine of medicines) {
      await ctx.db.insert("medicines", medicine);
    }

    return { message: "Successfully seeded 5 medicines" };
  },
});
