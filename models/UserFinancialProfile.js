import { mongoose } from "../config/db.js";

const { Schema } = mongoose;

const UserFinancialProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    age: { type: Number, required: true, min: 0 },
    monthlyIncome: { type: Number, required: true, min: 0 },
    monthlyExpenses: { type: Number, required: true, min: 0 },
    currentSavings: { type: Number, required: true, min: 0 },
    investmentRate: { type: Number, required: true, min: 0 },
    salaryGrowthRate: { type: Number, required: true, min: 0 },
    inflationRate: { type: Number, required: true, min: 0 },
    riskTolerance: { type: String, required: true },
    goals: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.UserFinancialProfile || mongoose.model("UserFinancialProfile", UserFinancialProfileSchema);

