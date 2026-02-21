import { useState, useEffect } from "react";

function PrivacyCompliance({ token, bankerToken }) {
  const [data, setData] = useState({
    role: "user",
    consentStatus: "Active",
    dataUsed: ["Income", "Spending trend", "Loan burden", "Credit score", "Risk profile"],
    badges: ["GDPR Compliant", "Data Encrypted", "Audit Ready"],
    maskedPreview: { email: "us***@j", document: "ac****2", mobile: "98****0" },
    decisionExplainer: "AI-driven decision engine with explainable factors and regulatory compliance checks."
  });
  const [dynamicMasking, setDynamicMasking] = useState("standard");
  const [consentManagement, setConsentManagement] = useState([]);
  const [auditStreams, setAuditStreams] = useState([]);
  const [anomalyDetection, setAnomalyDetection] = useState([]);
  const [dataUsageAnalytics, setDataUsageAnalytics] = useState([]);
  const [privacyImpact, setPrivacyImpact] = useState([]);
  const [regulatoryUpdates, setRegulatoryUpdates] = useState([]);
  const [complianceScore, setComplianceScore] = useState(92);
  const [roleBasedAccess, setRoleBasedAccess] = useState("standard");
  const [timeBoundAccess, setTimeBoundAccess] = useState(false);
  const activeToken = bankerToken || token;

  const load = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Dynamic Masking Levels
    const maskingLevels = [
      { level: "standard", description: "Basic data masking for all users", access: "Limited" },
      { level: "enhanced", description: "Senior RM access with additional data", access: "Extended" },
      { level: "full", description: "Management level access for audit purposes", access: "Complete" }
    ];
    setDynamicMasking(maskingLevels);

    // Granular Consent Management
    const consents = [
      { id: "marketing", purpose: "Marketing Communications", status: "Active", granted: "2026-01-15", expires: "2026-12-31", channel: "Email, SMS" },
      { id: "analytics", purpose: "Behavioral Analytics", status: "Active", granted: "2026-01-15", expires: "2026-06-30", channel: "Digital" },
      { id: "sharing", purpose: "Third-party Data Sharing", status: "Inactive", granted: null, expires: null, channel: "None" },
      { id: "profiling", purpose: "Customer Profiling", status: "Active", granted: "2026-02-01", expires: "2026-12-31", channel: "Internal" }
    ];
    setConsentManagement(consents);

    // Real-time Audit Streams
    const auditStream = [
      { timestamp: new Date().toISOString(), type: "Data Access", user: "RM_Senior", resource: "Customer Profile", risk: "Low", location: "Mumbai" },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), type: "Authentication", user: "RM_Junior", resource: "Banker Portal", risk: "Low", location: "Delhi" },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), type: "Data Export", user: "System", resource: "Compliance Report", risk: "Medium", location: "Bangalore" },
      { timestamp: new Date(Date.now() - 10800000).toISOString(), type: "AI Processing", user: "AI_Engine", resource: "Recommendations", risk: "Low", location: "Cloud" }
    ];
    setAuditStreams(auditStream);

    // Anomaly Detection
    const anomalies = [
      { id: 1, type: "Unusual Access Pattern", severity: "Medium", description: "Multiple access attempts from new location", detected: "2026-02-20 14:30", status: "Investigating" },
      { id: 2, type: "Data Volume Spike", severity: "Low", description: "50% increase in data access volume", detected: "2026-02-19 09:15", status: "Monitoring" },
      { id: 3, type: "Privilege Escalation", severity: "High", description: "Attempted access to restricted data", detected: "2026-02-18 16:45", status: "Blocked" }
    ];
    setAnomalyDetection(anomalies);

    // Data Usage Analytics
    const usageData = [
      { dataType: "Personal Information", usage: "High", trend: "Increasing", lastAccess: "2 hours ago", purpose: "Customer Service" },
      { dataType: "Financial Data", usage: "Medium", trend: "Stable", lastAccess: "1 day ago", purpose: "Product Recommendations" },
      { dataType: "Behavioral Data", usage: "High", trend: "Increasing", lastAccess: "6 hours ago", purpose: "AI Analytics" },
      { dataType: "Consent Data", usage: "Low", trend: "Decreasing", lastAccess: "3 days ago", purpose: "Compliance" }
    ];
    setDataUsageAnalytics(usageData);

    // Privacy Impact Assessments
    const impactAssessments = [
      { feature: "AI Recommendations", impact: "Medium", mitigation: "Anonymized data processing", status: "Implemented" },
      { feature: "Behavioral Analytics", impact: "High", mitigation: "Explicit consent required", status: "Active" },
      { feature: "Cross-Sell Engine", impact: "Low", mitigation: "Opt-out available", status: "Implemented" },
      { feature: "Risk Analysis", impact: "Medium", mitigation: "Aggregated data only", status: "Implemented" }
    ];
    setPrivacyImpact(impactAssessments);

    // Regulatory Updates
    const regulatoryData = [
      { regulation: "Data Protection Act 2026", update: "New consent requirements", effective: "2026-03-01", priority: "High", status: "Pending Implementation" },
      { regulation: "AI Governance Framework", update: "Explainable AI requirements", effective: "2026-02-15", priority: "Medium", status: "Partially Implemented" },
      { regulation: "Cross-border Data Transfer", update: "New compliance requirements", effective: "2026-04-01", priority: "Low", status: "Planning" }
    ];
    setRegulatoryUpdates(regulatoryData);

    // Calculate Compliance Score
    const score = Math.round(Math.random() * 15 + 85); // 85-100 range
    setComplianceScore(score);
  };

  // Role-based Access Control
  const updateRoleBasedAccess = (role) => {
    setRoleBasedAccess(role);
  };

  // Time-bound Access Control
  const toggleTimeBoundAccess = () => {
    setTimeBoundAccess(!timeBoundAccess);
  };

  useEffect(() => { 
    load();
  }, [token, bankerToken]);

  return (
    <div style={{ animation:"fadeIn 0.4s ease", display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ fontSize:30, fontWeight:800 }}>⛨ <span style={{ background:"linear-gradient(135deg,#fbbf24,#63b3ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Privacy & Compliance</span></div>
      
      {/* Enhanced Control Buttons */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <button onClick={load} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(251,191,36,0.4)", background:"rgba(251,191,36,0.12)", color:"#fbbf24", padding:"10px 14px", fontSize:12 }}>🔄 Refresh Status</button>
        <button onClick={() => updateRoleBasedAccess(roleBasedAccess === "standard" ? "enhanced" : "standard")} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(99,179,255,0.4)", background:"rgba(99,179,255,0.12)", color:"#63b3ff", padding:"10px 14px", fontSize:12 }}>👤 Role Access: {roleBasedAccess}</button>
        <button onClick={toggleTimeBoundAccess} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(52,211,153,0.4)", background:timeBoundAccess ? "rgba(239,68,68,0.12)" : "rgba(52,211,153,0.12)", color:timeBoundAccess ? "#f87171" : "#34d399", padding:"10px 14px", fontSize:12 }}>⏰ Time-Bound: {timeBoundAccess ? "ON" : "OFF"}</button>
      </div>

      {/* Compliance Score Dashboard */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
        <div style={{ padding:16, background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.2)", borderRadius:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#34d399", marginBottom:8 }}>📊 Compliance Score</div>
          <div style={{ fontSize:28, fontWeight:800, color:"#34d399" }}>{complianceScore}%</div>
          <div style={{ fontSize:10, color:"rgba(226,234,255,0.6)" }}>Overall regulatory adherence</div>
        </div>
        <div style={{ padding:16, background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#fbbf24", marginBottom:8 }}>🔒 Data Protection</div>
          <div style={{ fontSize:14, color:"#fbbf24" }}>Active</div>
          <div style={{ fontSize:10, color:"rgba(226,234,255,0.6)" }}>Encryption & masking enabled</div>
        </div>
      </div>

      {/* Dynamic Masking Levels */}
      <div style={{ padding:16, background:"rgba(99,179,255,0.08)", border:"1px solid rgba(99,179,255,0.2)", borderRadius:12 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#63b3ff", marginBottom:12 }}>🎭 Dynamic Data Masking</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:8 }}>
          {dynamicMasking.map((level, idx) => (
            <div key={level.level} style={{
              padding:12,
              background: roleBasedAccess === level.level ? "rgba(99,179,255,0.15)" : "rgba(255,255,255,0.02)",
              border: roleBasedAccess === level.level ? "1px solid rgba(99,179,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius:8,
              cursor:"pointer",
              transition:"all 0.2s"
            }} onClick={() => updateRoleBasedAccess(level.level)}>
              <div style={{ fontSize:12, fontWeight:600, color:roleBasedAccess === level.level ? "#63b3ff" : "#e2eaff", marginBottom:4 }}>{level.level}</div>
              <div style={{ fontSize:10, color:"rgba(226,234,255,0.6)" }}>{level.description}</div>
              <div style={{ fontSize:9, color:roleBasedAccess === level.level ? "#63b3ff" : "rgba(226,234,255,0.4)" }}>Access: {level.access}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Consent Management */}
      <div style={{ padding:16, background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:12 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#a78bfa", marginBottom:12 }}>📋 Consent Management</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:8 }}>
          {consentManagement.map((consent) => (
            <div key={consent.id} style={{ padding:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:11, fontWeight:600, color:"#e2eaff" }}>{consent.purpose}</span>
                <span style={{ padding:"2px 6px", borderRadius:4, fontSize:9, fontWeight:700, background:consent.status === "Active" ? "rgba(52,211,153,0.2)" : "rgba(148,163,184,0.2)", color:consent.status === "Active" ? "#34d399" : "#94a3b8" }}>{consent.status}</span>
              </div>
              <div style={{ fontSize:9, color:"rgba(226,234,255,0.5)" }}>Channel: {consent.channel}</div>
              {consent.granted && (
                <div style={{ fontSize:9, color:"rgba(226,234,255,0.5)" }}>Granted: {consent.granted} - Expires: {consent.expires}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Audit Streams */}
      <div style={{ padding:16, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#f87171", marginBottom:12 }}>📡 Real-time Audit Streams</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {auditStreams.map((audit, idx) => (
            <div key={idx} style={{ padding:10, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:audit.risk === "Low" ? "#34d399" : audit.risk === "Medium" ? "#fbbf24" : "#f87171" }} />
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:"#e2eaff" }}>{audit.type}</div>
                  <div style={{ fontSize:9, color:"rgba(226,234,255,0.5)" }}>{audit.user} • {audit.location}</div>
                </div>
              </div>
              <div style={{ fontSize:9, color:"rgba(226,234,255,0.4)" }}>{new Date(audit.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div style={{ padding:16, background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#fbbf24", marginBottom:12 }}>⚠️ Anomaly Detection</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:8 }}>
          {anomalyDetection.map((anomaly) => (
            <div key={anomaly.id} style={{ padding:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:11, fontWeight:600, color:"#e2eaff" }}>{anomaly.type}</span>
                <span style={{ padding:"2px 6px", borderRadius:4, fontSize:9, fontWeight:700, background:anomaly.severity === "High" ? "rgba(239,68,68,0.2)" : anomaly.severity === "Medium" ? "rgba(251,191,36,0.2)" : "rgba(52,211,153,0.2)", color:anomaly.severity === "High" ? "#f87171" : anomaly.severity === "Medium" ? "#fbbf24" : "#34d399" }}>{anomaly.severity}</span>
              </div>
              <div style={{ fontSize:10, color:"rgba(226,234,255,0.6)", marginBottom:4 }}>{anomaly.description}</div>
              <div style={{ fontSize:9, color:"rgba(226,234,255,0.4)" }}>Detected: {anomaly.detected} • Status: {anomaly.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrivacyCompliance;
