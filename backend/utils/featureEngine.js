function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function buildCustomerProfile(input = {}) {
  const income = Number(input.income || 0);
  const spending = Number(input.spending || 0);
  const loans = Number(input.loans || 0);
  const creditScore = Number(input.creditScore || 650);
  const riskLevel = `${input.riskLevel || "medium"}`.toLowerCase();

  const utilization = income > 0 ? spending / income : 1;
  const emiBurden = income > 0 ? loans / income : 1;

  const riskBase = riskLevel === "high" ? 75 : riskLevel === "low" ? 30 : 55;
  const riskScore = clamp(
    Math.round(riskBase + utilization * 25 + emiBurden * 35 + (700 - creditScore) * 0.08),
    5,
    95,
  );

  return { income, spending, loans, creditScore, riskLevel, utilization, emiBurden, riskScore };
}

function reasonFor(product, p) {
  if (product.id === "secured_card") {
    return p.creditScore >= 700
      ? "Recommended because strong credit score and controlled spending pattern."
      : "Recommended because secured format keeps risk low while improving credit profile.";
  }
  if (product.id === "personal_loan") {
    return "Recommended because salary increased and EMI burden is within safe threshold.";
  }
  if (product.id === "wealth_sip") {
    return "Recommended because salary surplus is healthy and credit utilization is low.";
  }
  if (product.id === "fixed_deposit") {
    return "Recommended for capital safety due to medium-to-high risk profile.";
  }
  return "Recommended based on profile fit and eligibility checks.";
}

export function recommendProducts(input = {}) {
  const p = buildCustomerProfile(input);

  const catalog = [
    {
      id: "wealth_sip",
      productName: "Wealth Plus SIP",
      ctaPrimary: "Apply",
      ctaSecondary: "Save",
      eligible: p.income >= 60000 && p.utilization <= 0.72 && p.riskScore <= 60,
      confidence: clamp(0.6 + (p.creditScore - 650) / 500 + (1 - p.utilization) * 0.3, 0.5, 0.97),
      riskTag: "Low",
    },
    {
      id: "secured_card",
      productName: "Secured Credit Card",
      ctaPrimary: "Apply",
      ctaSecondary: "Save",
      eligible: p.creditScore >= 580 && p.riskScore <= 80,
      confidence: clamp(0.62 + (p.creditScore - 600) / 700, 0.52, 0.94),
      riskTag: p.riskScore <= 55 ? "Low" : "Medium",
    },
    {
      id: "personal_loan",
      productName: "Instant Personal Loan",
      ctaPrimary: "Apply",
      ctaSecondary: "Save",
      eligible: p.income >= 50000 && p.creditScore >= 700 && p.emiBurden < 0.45 && p.riskScore < 62,
      confidence: clamp(0.58 + (1 - p.emiBurden) * 0.28 + (p.creditScore - 700) / 500, 0.5, 0.92),
      riskTag: "Medium",
    },
    {
      id: "fixed_deposit",
      productName: "Safety Fixed Deposit",
      ctaPrimary: "Apply",
      ctaSecondary: "Save",
      eligible: p.income >= 25000,
      confidence: clamp(0.6 + p.riskScore / 220, 0.55, 0.9),
      riskTag: "Low",
    },
  ];

  const safe = catalog
    .filter((x) => x.eligible)
    .map((x) => ({
      productName: x.productName,
      reason: reasonFor(x, p),
      confidence: Math.round(x.confidence * 100) / 100,
      riskTag: x.riskTag,
      ctaPrimary: x.ctaPrimary,
      ctaSecondary: x.ctaSecondary,
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  return {
    profile: p,
    recommendations: safe,
    filteredUnsafe: catalog.length - safe.length,
  };
}

export function rmDecision(input = {}) {
  const p = buildCustomerProfile(input);
  const product = `${input.product || ""}`.toLowerCase();

  if (product.includes("loan") && p.emiBurden > 0.45) {
    return {
      allowed: false,
      recommendation: "Avoid new loan",
      reason: "High EMI burden detected. Additional credit can increase repayment stress.",
      riskFlag: "red",
    };
  }

  if (product.includes("credit card") && p.creditScore >= 620) {
    return {
      allowed: true,
      recommendation: "Eligible for secured credit card",
      reason: "Credit profile and risk score pass minimum policy checks.",
      riskFlag: p.riskScore <= 55 ? "green" : "yellow",
    };
  }

  if (p.riskScore >= 75) {
    return {
      allowed: false,
      recommendation: "Offer low-risk savings product",
      reason: "Customer risk is elevated; avoid unsecured credit offers.",
      riskFlag: "red",
    };
  }

  return {
    allowed: true,
    recommendation: "Eligible for moderated offer",
    reason: "Policy checks passed with medium risk guardrails.",
    riskFlag: p.riskScore <= 55 ? "green" : "yellow",
  };
}
