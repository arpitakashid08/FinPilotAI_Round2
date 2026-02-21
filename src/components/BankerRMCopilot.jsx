import { useState, useEffect } from "react";

function BankerRMCopilot({ token, bankerToken, setBankerToken, customerProfile, setCustomerProfile }) {
  const [summary, setSummary] = useState(null);
  const [decision, setDecision] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("Secured Credit Card");
  const [err, setErr] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionSecure, setSessionSecure] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [customerJourney, setCustomerJourney] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const fallbackRmSummary = {
    customer: { customerId: "CUST-7721", name: "Arjun Sharma", phoneMasked: "98****10", income: 92000, spending: 51000, loans: 24000, creditScore: 734, riskLevel: "medium" },
    flags: [
      { label: "EMI Burden", value: "26%", color: "green" },
      { label: "Credit Score", value: "734", color: "green" },
      { label: "Risk Score", value: "52", color: "yellow" },
    ],
    recommendation: "Eligible for secured credit card. Avoid unsecured top-up loan this month.",
    reason: "Moderate EMI burden and healthy score suggest controlled product exposure.",
  };

  const fallbackRmDecision = {
    allowed: true,
    recommendation: "Eligible for secured credit card",
    reason: "Customer profile passes affordability and policy checks.",
    riskFlag: "yellow",
  };

  const delay = ms => new Promise(r => setTimeout(r, ms));

  async function callApi(path, opts = {}, fallback) {
    try {
      const res = await fetch(`${API_BASE}${path}`, opts);
      if (!res.ok) throw new Error("request_failed");
      return await res.json();
    } catch {
      await delay(350);
      return typeof fallback === "function" ? fallback() : fallback;
    }
  }

  const enableBanker = async () => {
    try {
      const res = await callApi("/auth/banker-token", { method: "POST" }, { bankerToken: "demo-banker-token" });
      setBankerToken(res.bankerToken);
      setIsAuthenticated(true);
      setSessionSecure(true);
      setErr("");
    } catch (e) {
      setErr("Failed to enable banker role");
    }
  };

  const loadSummary = async () => {
    if (!bankerToken) {
      setErr("Banker token required");
      return;
    }
    try {
      const qs = customerProfile
        ? `?${new URLSearchParams({
            customerId: `${customerProfile.customerId || ""}`,
            name: `${customerProfile.name || ""}`,
            phone: `${customerProfile.phone || ""}`,
            income: `${customerProfile.income ?? ""}`,
            spending: `${customerProfile.spending ?? ""}`,
            loans: `${customerProfile.loans ?? ""}`,
            creditScore: `${customerProfile.creditScore ?? ""}`,
            riskLevel: `${customerProfile.riskLevel || ""}`,
          }).toString()}`
        : "";
      const res = await callApi(`/rm/customer-summary${qs}`, {
        headers: bankerToken ? { Authorization: `Bearer ${bankerToken}` } : {},
      }, fallbackRmSummary);
      setSummary(res);
      setErr("");
    } catch (e) {
      setErr("Failed to load customer summary");
    }
  };

  const generateAIRecommendations = async () => {
    if (!bankerToken) {
      setErr("Banker token required");
      return;
    }
    
    // Simulate AI recommendations
    const recommendations = [
      {
        product: "Wealth Plus SIP",
        reasoning: "Customer has high income and low credit utilization, making them ideal for wealth management products",
        confidence: 88,
        riskLevel: "Low",
        expectedRevenue: "₹2,400/year",
        nextAction: "Schedule wealth consultation"
      },
      {
        product: "Secured Credit Card",
        reasoning: "Strong credit score and stable income make customer eligible for premium credit products",
        confidence: 82,
        riskLevel: "Medium",
        expectedRevenue: "₹1,800/year",
        nextAction: "Send pre-approved offer"
      },
      {
        product: "Home Loan Top-up",
        reasoning: "Customer property value suggests capacity for additional secured borrowing",
        confidence: 75,
        riskLevel: "Low",
        expectedRevenue: "₹3,600/year",
        nextAction: "Verify property documents"
      }
    ];
    
    setAiRecommendations(recommendations);
  };

  const generateRiskAnalysis = async () => {
    if (!bankerToken) {
      setErr("Banker token required");
      return;
    }
    
    // Simulate risk analysis
    const riskData = {
      overallRisk: "Medium",
      creditRisk: "Low",
      marketRisk: "Medium",
      operationalRisk: "Low",
      liquidityRisk: "Low",
      complianceRisk: "Low",
      riskFactors: [
        { factor: "Credit Score", value: "734", status: "Excellent" },
        { factor: "EMI Burden", value: "26%", status: "Healthy" },
        { factor: "Income Stability", value: "Stable", status: "Good" },
        { factor: "Loan History", value: "Clean", status: "Excellent" },
        { factor: "Account Age", value: "3.2 years", status: "Good" }
      ],
      recommendations: [
        "Proceed with secured credit card recommendation",
        "Consider wealth management products",
        "Monitor spending patterns for cross-sell opportunities",
        "Maintain current risk exposure levels"
      ]
    };
    
    setRiskAnalysis(riskData);
  };

  const generateCustomerJourney = async () => {
    // Simulate customer journey data
    const journey = [
      {
        stage: "Initial Contact",
        date: "2026-01-15",
        interaction: "Customer opened savings account",
        sentiment: "Positive",
        nextAction: "Welcome call completed"
      },
      {
        stage: "First Product",
        date: "2026-02-01",
        interaction: "Applied for and received credit card",
        sentiment: "Positive",
        nextAction: "Product education provided"
      },
      {
        stage: "Relationship Building",
        date: "2026-02-20",
        interaction: "Scheduled financial review meeting",
        sentiment: "Neutral",
        nextAction: "Comprehensive needs analysis"
      },
      {
        stage: "Cross-sell Opportunity",
        date: "2026-03-05",
        interaction: "Discussed investment options",
        sentiment: "Positive",
        nextAction: "SIP recommendation pending"
      }
    ];
    
    setCustomerJourney(journey);
  };

  const getDecision = async () => {
    if (!bankerToken) {
      setErr("Banker token required");
      return;
    }
    try {
      const payload = {
        product: selectedProduct,
        customer: summary?.customer || customerProfile,
      };
      const res = await callApi("/rm/product-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(bankerToken ? { Authorization: `Bearer ${bankerToken}` } : {}) },
        body: JSON.stringify(payload),
      }, fallbackRmDecision);
      setDecision(res);
      setErr("");
    } catch (e) {
      setErr("Failed to get decision");
    }
  };

  useEffect(() => {
    if (bankerToken) {
      setIsAuthenticated(true);
      setSessionSecure(true);
      generateCustomerJourney();
    }
  }, [bankerToken]);

  return (
    <div style={{ animation:"fadeIn 0.4s ease", display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ fontSize:30, fontWeight:800 }}>⌁ <span style={{ background:"linear-gradient(135deg,#63b3ff,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Banker / RM Co-Pilot</span></div>
      
      {/* Enhanced Action Buttons */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <button onClick={enableBanker} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(99,179,255,0.4)", background:"rgba(99,179,255,0.12)", color:"#63b3ff", padding:"10px 14px", fontSize:12 }}>Enable Banker Role</button>
        <button onClick={loadSummary} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(52,211,153,0.4)", background:"rgba(52,211,153,0.12)", color:"#34d399", padding:"10px 14px", fontSize:12 }}>GET /rm/customer-summary</button>
        <button onClick={generateAIRecommendations} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(167,139,250,0.4)", background:"rgba(167,139,250,0.12)", color:"#a78bfa", padding:"10px 14px", fontSize:12 }}>🤖 AI Recommendations</button>
        <button onClick={generateRiskAnalysis} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(251,191,36,0.4)", background:"rgba(251,191,36,0.12)", color:"#fbbf24", padding:"10px 14px", fontSize:12 }}>📊 Risk Analysis</button>
      </div>
      {!bankerToken && <div style={{ color:"rgba(226,234,255,0.7)", fontSize:12 }}>Enable banker role to access RM-protected APIs.</div>}
      {!!err && <div style={{ color:"#f87171", fontSize:12 }}>{err}</div>}
      
      {/* Interactive Tabs */}
      {isAuthenticated && (
        <div style={{ display:"flex", gap:8, borderBottom:"1px solid rgba(255,255,255,0.1)", paddingBottom:8 }}>
          {["overview", "recommendations", "journey", "risk"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding:"8px 16px",
                background: activeTab === tab ? "rgba(99,179,255,0.2)" : "transparent",
                border: activeTab === tab ? "1px solid rgba(99,179,255,0.3)" : "1px solid transparent",
                borderRadius:8,
                color: activeTab === tab ? "#63b3ff" : "rgba(226,234,255,0.6)",
                fontSize:12,
                fontWeight:600,
                cursor:"pointer",
                transition:"all 0.3s ease"
              }}
            >
              {tab === "overview" ? "📊 Overview" : tab === "recommendations" ? "🤖 AI Recs" : tab === "journey" ? "🛤️ Journey" : "⚠️ Risk"}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {isAuthenticated && activeTab === "overview" && (
        <div style={{
          clipPath:"polygon(4% 0, 96% 0, 100% 12%, 100% 88%, 96% 100%, 4% 100%, 0 88%, 0 12%)",
          border:"1px solid rgba(99,179,255,0.25)",
          background:"rgba(99,179,255,0.06)",
          padding:"16px 18px",
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
          gap:12,
        }}>
          <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(99,179,255,0.85)", fontWeight:800, gridColumn:"1 / -1" }}>
            Live Customer Inputs (shared with Cross‑Sell)
          </div>
          <label style={{ fontSize:12 }}>Name
            <input value={customerProfile.name} onChange={e=>setCustomerProfile(p=>({...p, name:e.target.value}))} style={{ width:"100%", marginTop:6, background:"rgba(3,7,18,0.7)", color:"#e2eaff", border:"1px solid rgba(255,255,255,0.14)", borderRadius:10, padding:"10px 12px" }} />
          </label>
          <label style={{ fontSize:12 }}>Income ₹{customerProfile.income.toLocaleString("en-IN")}
            <input type="range" min={25000} max={220000} step={1000} value={customerProfile.income} onChange={e=>setCustomerProfile(p=>({...p, income:Number(e.target.value)}))} style={{ width:"100%" }} />
          </label>
          <label style={{ fontSize:12 }}>Spending ₹{customerProfile.spending.toLocaleString("en-IN")}
            <input type="range" min={8000} max={160000} step={1000} value={customerProfile.spending} onChange={e=>setCustomerProfile(p=>({...p, spending:Number(e.target.value)}))} style={{ width:"100%" }} />
          </label>
          <label style={{ fontSize:12 }}>Loans ₹{customerProfile.loans.toLocaleString("en-IN")}
            <input type="range" min={0} max={120000} step={1000} value={customerProfile.loans} onChange={e=>setCustomerProfile(p=>({...p, loans:Number(e.target.value)}))} style={{ width:"100%" }} />
          </label>
          <label style={{ fontSize:12 }}>Credit {customerProfile.creditScore}
            <input type="range" min={500} max={900} step={1} value={customerProfile.creditScore} onChange={e=>setCustomerProfile(p=>({...p, creditScore:Number(e.target.value)}))} style={{ width:"100%" }} />
          </label>
          <label style={{ fontSize:12 }}>Risk Level
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["low","medium","high"].map((r)=>(
                <button key={r} onClick={()=>setCustomerProfile(p=>({...p, riskLevel:r}))} style={{ clipPath:"polygon(14% 0,100% 0,86% 100%,0 100%)", border:`1px solid ${customerProfile.riskLevel===r?"rgba(52,211,153,0.6)":"rgba(255,255,255,0.2)"}`, color:customerProfile.riskLevel===r?"#34d399":"rgba(226,234,255,0.7)", padding:"7px 10px", fontSize:11 }}>{r}</button>
              ))}
            </div>
          </label>
        </div>
      )}

      {/* AI Recommendations Tab */}
      {isAuthenticated && activeTab === "recommendations" && aiRecommendations.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#a78bfa" }}>🤖 AI-Powered Product Recommendations</div>
          {aiRecommendations.map((rec, idx) => (
            <div key={idx} style={{
              padding:16,
              background:"rgba(167,139,250,0.08)",
              border:"1px solid rgba(167,139,250,0.2)",
              borderRadius:12,
              display:"grid",
              gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
              gap:12
            }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#a78bfa", marginBottom:4 }}>{rec.product}</div>
                <div style={{ fontSize:11, color:"rgba(226,234,255,0.7)", lineHeight:1.4 }}>{rec.reasoning}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
                  <span style={{ color:"rgba(226,234,255,0.6)" }}>Confidence:</span>
                  <span style={{ color:"#a78bfa", fontWeight:700 }}>{rec.confidence}%</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
                  <span style={{ color:"rgba(226,234,255,0.6)" }}>Risk Level:</span>
                  <span style={{ color: rec.riskLevel === "Low" ? "#34d399" : "#fbbf24", fontWeight:700 }}>{rec.riskLevel}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
                  <span style={{ color:"rgba(226,234,255,0.6)" }}>Revenue:</span>
                  <span style={{ color:"#34d399", fontWeight:700 }}>{rec.expectedRevenue}</span>
                </div>
                <div style={{ fontSize:10, color:"#63b3ff", fontWeight:600, marginTop:4 }}>Next: {rec.nextAction}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Journey Tab */}
      {isAuthenticated && activeTab === "journey" && customerJourney.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#34d399" }}>🛤️ Customer Journey Timeline</div>
          <div style={{ position:"relative", paddingLeft:20 }}>
            <div style={{ position:"absolute", left:8, top:0, bottom:0, width:2, background:"linear-gradient(to bottom, #34d399, #63b3ff)" }} />
            {customerJourney.map((step, idx) => (
              <div key={idx} style={{ position:"relative", marginBottom:16, display:"flex", gap:12 }}>
                <div style={{ position:"absolute", left:-12, top:4, width:8, height:8, borderRadius:"50%", background:"#34d399", border:"2px solid rgba(52,211,153,0.3)" }} />
                <div style={{ flex:1, padding:12, background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.2)", borderRadius:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#34d399" }}>{step.stage}</span>
                    <span style={{ fontSize:10, color:"rgba(226,234,255,0.6)" }}>{step.date}</span>
                  </div>
                  <div style={{ fontSize:11, color:"#e2eaff", marginBottom:4 }}>{step.interaction}</div>
                  <div style={{ fontSize:10, color: step.sentiment === "Positive" ? "#34d399" : "#fbbf24" }}>Sentiment: {step.sentiment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Analysis Tab */}
      {isAuthenticated && activeTab === "risk" && riskAnalysis && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#fbbf24" }}>⚠️ Comprehensive Risk Analysis</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
            <div style={{ padding:16, background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#fbbf24", marginBottom:8 }}>Overall Risk</div>
              <div style={{ fontSize:20, fontWeight:800, color:riskAnalysis.overallRisk === "Low" ? "#34d399" : "#fbbf24" }}>{riskAnalysis.overallRisk}</div>
            </div>
            {Object.entries(riskAnalysis).filter(([key]) => key.endsWith('Risk')).map(([key, value]) => (
              <div key={key} style={{ padding:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8 }}>
                <div style={{ fontSize:11, color:"rgba(226,234,255,0.6)", marginBottom:4 }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div style={{ fontSize:14, fontWeight:600, color: value === "Low" ? "#34d399" : value === "Medium" ? "#fbbf24" : "#f87171" }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:16, background:"rgba(15,23,42,0.1)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#fbbf24", marginBottom:12 }}>Risk Factors</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:8 }}>
              {riskAnalysis.riskFactors.map((factor, idx) => (
                <div key={idx} style={{ display:"flex", justifyContent:"space-between", padding:8, background:"rgba(255,255,255,0.02)", borderRadius:6 }}>
                  <span style={{ fontSize:11, color:"rgba(226,234,255,0.8)" }}>{factor.factor}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:factor.status === "Healthy" || factor.status === "Excellent" ? "#34d399" : "#fbbf24" }}>{factor.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:16, background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.2)", borderRadius:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#34d399", marginBottom:12 }}>Recommendations</div>
            <ul style={{ margin:0, paddingLeft:16, color:"rgba(226,234,255,0.8)", fontSize:11, lineHeight:1.6 }}>
              {riskAnalysis.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Original Overview Content */}
      {summary?.customer && activeTab === "overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ padding:16, background:"rgba(99,179,255,0.08)", border:"1px solid rgba(99,179,255,0.2)", borderRadius:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#63b3ff", marginBottom:8 }}>Customer Snapshot</div>
            {Object.entries(summary.customer).map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11 }}>
                <span style={{ color:"rgba(226,234,255,0.6)" }}>{k}:</span>
                <span style={{ color:"#e2eaff" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:16, background:summary.allowed ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border:`1px solid ${summary.allowed ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`, borderRadius:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:summary.allowed ? "#34d399" : "#f87171", marginBottom:8 }}>Decision Reasoning</div>
            <div style={{ fontSize:11, color:"#e2eaff", marginBottom:4 }}>{summary.allowed ? "Allowed" : "Blocked"}: {summary.recommendation}</div>
            <div style={{ fontSize:10, color:"rgba(226,234,255,0.6)" }}>{summary.reason}</div>
          </div>
        </div>
      )}
      
      <div style={{ clipPath:"polygon(7% 0,100% 0,93% 100%,0 100%)", border:"1px solid rgba(52,211,153,0.35)", background:"rgba(52,211,153,0.08)", padding:"16px 20px", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
        <select value={selectedProduct} onChange={(e)=>setSelectedProduct(e.target.value)} style={{ background:"rgba(3,7,18,0.8)", color:"#e2eaff", border:"1px solid rgba(255,255,255,0.2)", padding:"8px 10px" }}>
          <option>Secured Credit Card</option>
          <option>Instant Personal Loan</option>
          <option>Wealth Plus SIP</option>
        </select>
        <button onClick={getDecision} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(99,179,255,0.4)", background:"rgba(99,179,255,0.12)", color:"#e2eaff", padding:"9px 14px", fontSize:12 }}>POST /rm/product-decision</button>
      </div>
      
      {decision && (
        <div style={{ padding:16, background:decision.allowed ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border:`1px solid ${decision.allowed ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`, borderRadius:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:decision.allowed ? "#34d399" : "#f87171", marginBottom:8 }}>Decision Reasoning</div>
          <div style={{ fontSize:11, color:"#e2eaff", marginBottom:4 }}>{decision.allowed ? "Allowed" : "Blocked"}: {decision.recommendation}</div>
          <div style={{ fontSize:10, color:"rgba(226,234,255,0.6)" }}>Why {decision.allowed ? "allowed" : "blocked"}: {decision.reason}</div>
        </div>
      )}
    </div>
  );
}

export default BankerRMCopilot;
