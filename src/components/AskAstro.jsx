import { useState, useEffect, useRef } from "react";

function AskAstro({ updates, customerProfile }) {
  const [msgs, setMsgs] = useState([{ role:"ai", text:"Hi! I'm Astro, your FinPilot AI co-pilot. Ask me about your loans, risk profile, fraud alerts, or investment strategy." }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [chatErr, setChatErr] = useState("");
  const [lang, setLang] = useState("en"); // en, mr, hi
  const [bank, setBank] = useState("HDFC");
  const [bankSnap, setBankSnap] = useState(null);
  const [scanMsg, setScanMsg] = useState("");
  
  // Voice assistant states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  
  const ref = useRef(null);
  const knowledge = updates?.knowledge || [];
  
  // Language translation functions
  const translateText = (text, targetLang) => {
    const translations = {
      mr: {
        "Hi! I'm Astro, your FinPilot AI co-pilot. Ask me about your loans, risk profile, fraud alerts, or investment strategy.":
          "नमस्कार! मी ॲस्ट्रो आहे, तुमचा फिनपायलट एआय सहकारी. मला तुमच्या कर्ज, जोखीम प्रोफाइल, फसवणूक सूचना किंवा गुंतवणूक धोरणाबद्दल विचारा.",
        "I couldn't generate a response yet. Please try once more.": "मी अद्याप प्रतिसाद तयार करू शकलो नाही. कृपया पुन्हा एकदा प्रयत्न करा.",
        "Ask about loans, risk, fraud, investments…": "कर्ज, जोखीम, फसवणूक, गुंतवणुकीबद्दल विचारा…"
      },
      hi: {
        "Hi! I'm Astro, your FinPilot AI co-pilot. Ask me about your loans, risk profile, fraud alerts, or investment strategy.":
          "नमस्ते! मैं एस्ट्रो हूं, आपका फिनपायलट एआई सह-पायलट। मुझसे अपने ऋण, जोखिम प्रोफाइल, धोखाधड़ी अलर्ट, या निवेश रणनीति के बारे में पूछें।",
        "I couldn't generate a response yet. Please try once more.": "मैं अभी तक प्रतिक्रिया उत्पन्न नहीं कर सका। कृपया एक बार फिर प्रयास करें।",
        "Ask about loans, risk, fraud, investments…": "ऋण, जोखिम, धोखाधड़ी, निवेश के बारे में पूछें…"
      }
    };
    
    if (targetLang === "en") return text;
    return translations[targetLang]?.[text] || text;
  };
  
  // Update initial message when language changes or user name changes
  useEffect(() => {
    const userName = customerProfile?.name || "there";
    const welcomeMessage = `Hi ${userName}! I'm Astro, your FinPilot AI co-pilot. Ask me about your loans, risk profile, fraud alerts, or investment strategy.`;
    setMsgs([{ role:"ai", text:translateText(welcomeMessage, lang) }]);
  }, [lang, customerProfile?.name]);
  
  // Check browser support for voice features
  useEffect(() => {
    const speechSupported = 'speechSynthesis' in window;
    const recognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setVoiceSupported(speechSupported && recognitionSupported);
    
    if (recognitionSupported) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        
        // Auto-send the voice input
        if (transcript.trim()) {
          setTimeout(() => {
            handleVoiceSend(transcript);
          }, 500);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [lang]);
  
  useEffect(() => { ref.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  // Investment strategy generator
  const generateInvestmentStrategy = (emi, income) => {
    const monthlySavings = Math.max(0, income - emi - (income * 0.3)); // Assuming 30% for basic expenses
    const emergencyFund = monthlySavings * 6; // 6 months emergency fund
    const sipAmount = Math.max(500, monthlySavings * 0.4); // 40% for SIP
    const debtRepayment = Math.max(0, monthlySavings * 0.3); // 30% for debt
    
    let strategy = `Based on your current EMI of ₹${emi.toLocaleString("en-IN")} and income of ₹${income.toLocaleString("en-IN")}, I recommend the following investment strategy:\n\n`;

    if (monthlySavings < 2000) {
      strategy += `⚠️ Low savings detected. Focus on increasing income or reducing expenses first.\n\n`;
    }

    strategy += `💰 Emergency Fund: Build ₹${emergencyFund.toLocaleString("en-IN")} (6 months)\n`;
    strategy += `📈 SIP Investment: ₹${sipAmount.toLocaleString("en-IN")}/month in diversified funds\n`;
    strategy += `🏦 Debt Repayment: ₹${debtRepayment.toLocaleString("en-IN")}/month extra EMI\n`;
    strategy += `🎯 Long-term Growth: Consider equity funds for 10+ year goals\n\n`;

    strategy += `📊 Asset Allocation:\n`;
    strategy += `• 40% Equity (high growth)\n`;
    strategy += `• 30% Debt (stability)\n`;
    strategy += `• 20% Gold (inflation hedge)\n`;
    strategy += `• 10% Cash (liquidity)`;

    return strategy;
  };

  // Handle voice input sending
  const handleVoiceSend = (voiceText) => {
    if (!voiceText.trim() || thinking) return;
    const q = voiceText.trim(); 
    setInput("");
    
    setMsgs(m => [...m, { role:"user", text: q }]);
    setThinking(true);
    setChatErr("");
    
    // Simulate AI response for voice input
    setTimeout(() => {
      let response;
      
      // Check for investment strategy queries
      if (q.toLowerCase().includes("investment") || q.toLowerCase().includes("strategy") || q.toLowerCase().includes("where to invest")) {
        const emi = customerProfile?.loans || 24000;
        const income = customerProfile?.income || 92000;
        response = { reply: generateInvestmentStrategy(emi, income) };
      } else if (q.toLowerCase().includes("hello") || q.toLowerCase().includes("hi")) {
        const userName = customerProfile?.name || "there";
        response = { reply: `Hello ${userName}! I'm Astro, your FinPilot AI co-pilot. How can I help you today?` };
      } else if (q.toLowerCase().includes("name")) {
        const userName = customerProfile?.name || "User";
        response = { reply: `Your name is ${userName}. I'm here to help with your financial questions!` };
      } else {
        response = { reply: `I understand you're asking about: "${q}". Let me help you with that. This is a simulated response for voice input.` };
      }
      
      setMsgs(m => [...m, { role:"ai", text: response.reply || translateText("I couldn't generate a response yet. Please try once more.", lang) }]);
      setThinking(false);
      
      // Auto-speak the response for voice interaction
      setTimeout(() => {
        speakText(response.reply);
      }, 1000);
    }, 1500);
  };
  
  // Voice synthesis function
  const speakText = (text) => {
    if (!voiceSupported || !('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.0;
    utterance.rate = 0.9;
    utterance.volume = 0.8;
    utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  // Start voice recognition
  const startListening = () => {
    if (!recognition || isListening) return;
    
    setIsListening(true);
    recognition.start();
  };
  
  // Stop voice recognition
  const stopListening = () => {
    if (!recognition || !isListening) return;
    
    recognition.stop();
    setIsListening(false);
  };

  const send = async () => {
    if (!input.trim() || thinking) return;
    const q = input.trim(); setInput("");
    setChatErr("");
    setMsgs(m => [...m, { role:"user", text:q }]);
    setThinking(true);
    
    try {
      let response;
      
      // Check for investment strategy queries
      if (q.toLowerCase().includes("investment") || q.toLowerCase().includes("strategy") || q.toLowerCase().includes("where to invest")) {
        // Extract EMI and income from context or use defaults
        const emi = customerProfile?.loans || 24000;
        const income = customerProfile?.income || 92000;
        response = { reply: generateInvestmentStrategy(emi, income) };
      } else {
        // Simulate other responses
        const fallbackAstroReply = (message = "") => {
          const q = message.toLowerCase();
          if (q.includes("sip") || q.includes("mutual") || q.includes("invest") || q.includes("portfolio")) {
            return "For investments, split money into (1) emergency fund in liquid/FD, (2) 2–3 diversified equity index or large-cap funds via SIP, and (3) debt for near-term goals. Match horizon to product and avoid overlapping, high-cost schemes.";
          }
          if (q.includes("loan") || q.includes("emi") || q.includes("interest") || q.includes("personal loan")) {
            return "Keep all EMIs under ~40% of monthly income, prioritise closing high-interest personal/credit-card loans first, and avoid top-ups if utilisation or credit score is already stressed. Use surplus cash to pre-pay expensive debt before starting aggressive investments.";
          }
          if (q.includes("credit score") || q.includes("cibil") || q.includes("score")) {
            return "To improve credit score, avoid late payments, keep utilisation below ~30%, do not open/close many cards at once, and maintain a long, clean repayment track record. Even small on-time EMIs over 6–12 months can move your score meaningfully.";
          }
          if (q.includes("fraud") || q.includes("scam") || q.includes("upi") || q.includes("otp")) {
            return "Treat unknown payment links, OTP requests, and remote-access apps as red flags. Never share OTPs or PINs, lock limits on rarely used channels, and enable strong device + SIM security so suspicious transactions can be blocked quickly.";
          }
          return "Think in terms of cash flow: map income, essential spends, EMIs, and goals, then automate savings on salary day into 2–3 labelled buckets. This makes it easier to stay under a safe EMI limit, fund near-term goals, and still invest long term without surprises.";
        };
        response = { reply: fallbackAstroReply(q) };
      }
      
      setMsgs(m => [...m, { role:"ai", text: response.reply || translateText("I couldn't generate a response yet. Please try once more.", lang) }]);
    } catch {
      setChatErr(translateText("Ask Astro is temporarily unavailable. Please retry.", lang));
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 140px)", animation:"fadeIn 0.4s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:180 }}>
          <div style={{ fontSize:26, fontWeight:800 }}>✦ Ask <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Astro</span></div>
          <div style={{ color:"rgba(226,234,255,0.35)", fontFamily:"'JetBrains Mono', monospace", fontSize:11, marginTop:4 }}>// conversational AI — powered by your financial twin</div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(148,163,184,0.9)" }}>Language</div>
          {[
            { id:"en", label:"English" },
            { id:"mr", label:"Marathi" },
            { id:"hi", label:"Hindi" },
          ].map(l => {
            const active = lang === l.id;
            return (
              <button key={l.id} onClick={()=>setLang(l.id)} style={{
                padding:"6px 10px",
                fontSize:11,
                borderRadius:999,
                border: active ? "1px solid rgba(99,179,255,0.7)" : "1px solid rgba(148,163,184,0.5)",
                background: active ? "rgba(99,179,255,0.16)" : "rgba(15,23,42,0.9)",
                color: active ? "#e2eaff" : "rgba(226,234,255,0.7)",
              }}>
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:12, paddingRight:4 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", animation:"fadeUp 0.3s ease" }}>
            {m.role==="ai" && (
              <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1a3a8e,#2d1a8e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginRight:8, marginTop:2, boxShadow:"0 0 10px rgba(99,179,255,0.3)" }}>✦</div>
            )}
            <div style={{
              maxWidth:"72%", 
              padding:"13px 18px",
              borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              background:m.role==="user"?"linear-gradient(135deg,rgba(99,179,255,0.15),rgba(167,139,250,0.15))":"rgba(255,255,255,0.04)",
              border:m.role==="user"?"1px solid rgba(99,179,255,0.2)":"1px solid rgba(255,255,255,0.05)",
              fontSize:14, 
              lineHeight:1.6, 
              color:m.role==="user"?"#e2eaff":"rgba(226,234,255,0.8)",
              wordBreak:"break-word"
            }}>{m.text}</div>
          </div>
        ))}
        {thinking && (
          <div style={{ display:"flex", gap:4, paddingLeft:42 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#63b3ff", animation:`waveBar 0.9s ${i*0.15}s ease-in-out infinite` }} />)}
          </div>
        )}
        <div ref={ref} />
      </div>

      <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:8 }}>
        {/* Voice Assistant Controls */}
        {voiceSupported && (
          <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center", padding:"12px 16px", background:"rgba(99,179,255,0.05)", border:"1px solid rgba(99,179,255,0.2)", borderRadius:12 }}>
            {/* Voice Input Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              style={{
                padding:"10px 16px",
                background: isListening ? "rgba(248,113,113,0.2)" : "rgba(99,179,255,0.1)",
                border: isListening ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(99,179,255,0.3)",
                borderRadius:8,
                color: isListening ? "#f87171" : "#e2eaff",
                fontSize:12,
                fontWeight:600,
                cursor:"pointer",
                transition:"all 0.2s",
                display:"flex",
                alignItems:"center",
                gap:6
              }}
            >
              {isListening ? (
                <>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"#f87171", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(255,255,255,0.3)", margin:"0 auto" }}></div>
                  </div>
                  <span style={{ marginLeft:8 }}>🔴 Stop</span>
                </>
              ) : (
                <>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"#63b3ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(255,255,255,0.3)", margin:"0 auto" }}></div>
                  </div>
                  <span style={{ marginLeft:8 }}>🎤 Start Voice</span>
                </>
              )}
            </button>

            {/* Voice Output Button */}
            <button
              onClick={() => speakText(msgs[msgs.length - 1]?.text || "Welcome to FinPilot AI")}
              disabled={isSpeaking}
              style={{
                padding:"10px 16px",
                background: isSpeaking ? "rgba(148,163,184,0.2)" : "rgba(52,211,153,0.1)",
                border: isSpeaking ? "1px solid rgba(148,163,184,0.4)" : "1px solid rgba(52,211,153,0.3)",
                borderRadius:8,
                color: isSpeaking ? "#94a3b8" : "#34d399",
                fontSize:12,
                fontWeight:600,
                cursor: isSpeaking ? "not-allowed" : "pointer",
                transition:"all 0.2s",
                display:"flex",
                alignItems:"center",
                gap:6
              }}
            >
              {isSpeaking ? (
                <>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"#94a3b8", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(255,255,255,0.3)", margin:"0 auto" }}></div>
                  </div>
                  <span style={{ marginLeft:8 }}>🔊 Speaking...</span>
                </>
              ) : (
                <>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"#34d399", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(255,255,255,0.3)", margin:"0 auto" }}></div>
                  </div>
                  <span style={{ marginLeft:8 }}>🔊 Speak Response</span>
                </>
              )}
            </button>

            {/* Voice Status Indicator */}
            <div style={{ 
              fontSize:10, 
              color:"rgba(226,234,255,0.6)", 
              fontFamily:"'JetBrains Mono', monospace",
              textAlign:"center",
              padding:"6px 12px",
              background:"rgba(15,23,42,0.1)",
              border:"1px solid rgba(52,211,153,0.2)",
              borderRadius:6,
              minWidth:120
            }}>
              {isListening ? "🎤 Listening..." : isSpeaking ? "🔊 Speaking..." : "🎤 Voice Ready"}
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder={translateText("Ask about loans, risk, fraud, investments…", lang)}
            style={{ 
              flex:1, 
              minWidth:200,
              padding:"12px 16px", 
              background:"rgba(15,23,42,0.9)", 
              color:"#e2eaff", 
              border:"1px solid rgba(148,163,184,0.5)", 
              borderRadius:12, 
              fontSize:14,
              outline:"none"
            }}
          />
          <button onClick={send} disabled={thinking || !input.trim()}
            style={{
              padding:"12px 20px",
              background: thinking || !input.trim() ? "rgba(148,163,184,0.2)" : "rgba(99,179,255,0.15)",
              border: thinking || !input.trim() ? "1px solid rgba(148,163,184,0.4)" : "1px solid rgba(99,179,255,0.3)",
              borderRadius:12,
              color: thinking || !input.trim() ? "#94a3b8" : "#e2eaff",
              fontSize:12,
              fontWeight:600,
              cursor: thinking || !input.trim() ? "not-allowed" : "pointer",
              transition:"all 0.2s"
            }}
          >
            {thinking ? "..." : "Send"}
          </button>
        </div>
        {chatErr && <div style={{ color:"#f87171", fontSize:12, marginTop:4 }}>{chatErr}</div>}
      </div>
    </div>
  );
}

export default AskAstro;
