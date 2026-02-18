import { useMemo, useState } from "react";
import { fetchVoiceReply } from "../services/api";

export function VoiceChatPanel() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  const recognition = useMemo(() => {
    const Api = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Api) {
      return null;
    }
    const instance = new Api();
    instance.lang = "en-US";
    instance.interimResults = true;
    instance.continuous = false;
    return instance;
  }, []);

  function startListening() {
    if (!recognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    setError("");
    setReply("");
    setTranscript("");
    setListening(true);

    recognition.onresult = async (event) => {
      const text = Array.from(event.results)
        .map((res) => res[0]?.transcript || "")
        .join(" ")
        .trim();
      setTranscript(text);
      if (event.results[0]?.isFinal && text) {
        try {
          const data = await fetchVoiceReply(text);
          setReply(data.reply);
        } catch {
          setReply("Voice captured. Backend response unavailable right now.");
        }
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setError("Could not capture audio. Please allow microphone access.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }

  return (
    <section className="bento-panel voice-panel" id="voice-chat">
      <header>
        <p>Voice Copilot</p>
      </header>
      <button className={`voice-button ${listening ? "is-listening" : ""}`} onClick={startListening}>
        {listening ? "Listening" : "Start Voice Query"}
      </button>
      <div className="voice-log">
        <p><strong>Transcript:</strong> {transcript || "No speech captured yet."}</p>
        <p><strong>Response:</strong> {reply || "Waiting for query."}</p>
        {error ? <p className="voice-error">{error}</p> : null}
      </div>
    </section>
  );
}
