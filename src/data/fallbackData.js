import muskPhoto from "../assets/ceos/musk.svg";
import nadellaPhoto from "../assets/ceos/nadella.svg";
import pichaiPhoto from "../assets/ceos/pichai.svg";

export const fallbackData = {
  ceos: [
    {
      id: "musk",
      name: "Elon Musk",
      company: "Tesla / SpaceX",
      focus: "Autonomous systems and industrial AI",
      stat: "+6.2%",
      photo: muskPhoto,
      notes: "Pushing cross-domain automation with aggressive execution cycles.",
    },
    {
      id: "nadella",
      name: "Satya Nadella",
      company: "Microsoft",
      focus: "Enterprise copilots and cloud distribution",
      stat: "+4.9%",
      photo: nadellaPhoto,
      notes: "Operational AI integration through Azure and platform partnerships.",
    },
    {
      id: "pichai",
      name: "Sundar Pichai",
      company: "Google",
      focus: "AI-native search and multimodal interfaces",
      stat: "+5.4%",
      photo: pichaiPhoto,
      notes: "Scaling inference and model products across consumer touchpoints.",
    },
  ],
  sections: [
    {
      id: "overview",
      title: "Executive Signal Grid",
      subtitle: "Asymmetrical intelligence layout with real-time bias and momentum.",
    },
    {
      id: "market",
      title: "Market Motion",
      subtitle: "Live sentiment matrix and trend pressure visualized by sector.",
    },
    {
      id: "voice",
      title: "Voice Copilot",
      subtitle: "Ask by voice, stream transcript, and receive strategy-ready summaries.",
    },
  ],
  market: [
    { name: "AI Infrastructure", momentum: 78, change: "+1.25%" },
    { name: "Autonomous Mobility", momentum: 64, change: "+0.61%" },
    { name: "Cloud Productivity", momentum: 71, change: "+0.82%" },
    { name: "Semiconductor Demand", momentum: 83, change: "+1.84%" },
  ],
};
