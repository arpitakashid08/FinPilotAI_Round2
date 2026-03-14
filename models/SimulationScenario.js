import { mongoose } from "../config/db.js";

const { Schema } = mongoose;

const SimulationScenarioSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserFinancialProfile", required: true, index: true },
    scenarioName: {
      type: String,
      required: true,
      enum: ["corporate", "startup", "studyAbroad", "aggressiveInvestment"],
      index: true,
    },
    projectedNetWorth: { type: Number, required: true },
    yearlyProjection: { type: [Schema.Types.Mixed], default: [] },
    debtImpact: { type: Number, default: 0 },
    goalTimeline: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.SimulationScenario || mongoose.model("SimulationScenario", SimulationScenarioSchema);

