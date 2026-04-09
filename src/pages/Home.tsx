import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  AlertTriangle,
  Flame,
  Droplet,
  Bone,
  Activity,
  Skull,
  Zap,
  Stethoscope,
} from "lucide-react";

const FONT_FAMILY = "font-['Inter','Roboto','Open_Sans',sans-serif]";
const NAVY = "#14213d";

const isRedCard = (title: string) =>
  ["CPR", "Heart Attack & Stroke", "Seizures", "Poisoning"].includes(title);

export const emergencyData = [
  {
    icon: <Heart className="w-16 h-16" />,
    title: "CPR",
    subtitle: "Cardiopulmonary resuscitation for unresponsive victims",
    steps: ["Check responsiveness", "Call for help", "Begin chest compressions"],
    link: "/cpr",
    danger: true,
  },
  {
    icon: <AlertTriangle className="w-16 h-16" />,
    title: "Choking",
    subtitle: "Clear airway blockage in adults and children",
    steps: ["Encourage coughing", "Give back blows", "Perform abdominal thrusts"],
    link: "/choking",
    danger: true,
  },
  {
    icon: <Flame className="w-16 h-16" />,
    title: "Burns & Scalds",
    subtitle: "Immediate care for thermal injuries",
    steps: ["Cool with running water", "Cover with sterile cloth", "Avoid ice or ointments"],
    link: "/burns",
    danger: false,
  },
  {
    icon: <Droplet className="w-16 h-16" />,
    title: "Heavy Bleeding",
    subtitle: "Control severe bleeding and prevent shock",
    steps: ["Apply firm pressure", "Elevate the wound", "Use clean cloth/bandage"],
    link: "/bleeding",
    danger: true,
  },
  {
    icon: <Bone className="w-16 h-16" />,
    title: "Fractures",
    subtitle: "Manage broken bones and prevent further injury",
    steps: ["Immobilize the limb", "Apply splint if possible", "Avoid movement"],
    link: "/fractures",
    danger: false,
  },
  {
    icon: <Activity className="w-16 h-16" />,
    title: "Heart Attack & Stroke",
    subtitle: "Recognize and respond to cardiovascular emergencies",
    steps: ["Recognize symptoms", "Call emergency immediately", "Give aspirin if available"],
    link: "/heart-stroke",
    danger: true,
  },
  {
    icon: <Skull className="w-16 h-16" />,
    title: "Poisoning",
    subtitle: "Emergency response for poisoning incidents",
    steps: ["Remove from source", "Call poison control", "Follow expert guidance"],
    link: "/poisoning",
    danger: false,
  },
  {
    icon: <Zap className="w-16 h-16" />,
    title: "Seizures",
    subtitle: "Keep person safe during seizure episodes",
    steps: ["Stay calm and time it", "Clear area of hazards", "Turn to side"],
    link: "/seizures",
    danger: false,
  },
  {
    icon: <Stethoscope className="w-16 h-16" />,
    title: "Symptom Checker",
    subtitle: "ML-powered triage to estimate emergency severity level",
    steps: ["Enter your symptoms", "Get a KTAS severity level", "Follow recommended action"],
    link: "/triage",
    danger: false,
  },
];

const speak = (text: string) => {
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new window.SpeechSynthesisUtterance(text);
  synth.speak(utter);
};

const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};

export default function Home() {
  const allSteps = emergencyData
    .map((item) => `${item.title}. ${item.steps.join(". ")}`)
    .join(". ");

  return (
    <div className={`min-h-screen w-full flex flex-col bg-blue-50 ${FONT_FAMILY}`}>
      {/* Banner */}
      <div
        className="w-full py-12 px-4 flex flex-col md:flex-row items-center justify-between shadow-lg gap-4"
        style={{ background: NAVY }}
      >
        <h1
          className="text-5xl md:text-6xl font-extrabold text-white tracking-tight text-center"
          style={{ textShadow: "0 2px 16px #22305a, 0 0px 8px #fff2", letterSpacing: "0.01em" }}
        >
          Emergency Procedures
        </h1>
        <div className="flex gap-4">
          <Link
            to="/triage"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg transition"
          >
            🩺 Symptom Checker
          </Link>
          <Link
            to="/crisis"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg transition"
          >
            🚨 Crisis
          </Link>
        </div>
      </div>

      {/* Cards Grid */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
          {emergencyData.map((item, idx) => {
            const red = isRedCard(item.title);
            const isTriage = item.title === "Symptom Checker";
            return (
              <div
                key={idx}
                className={`
                  flex flex-col justify-between
                  rounded-3xl shadow-xl
                  min-h-[32rem] h-full px-14 py-12
                  border transition hover:shadow-2xl
                  ${isTriage
                    ? "bg-gradient-to-br from-purple-50 to-white border-purple-200"
                    : red
                    ? "bg-gradient-to-br from-red-50 to-white border-red-200"
                    : "bg-gradient-to-br from-blue-50 to-white border-blue-200"}
                `}
              >
                <div>
                  <div className="flex items-center gap-8 mb-8">
                    <div className={`rounded-full p-6 shadow ${isTriage ? "bg-purple-100" : red ? "bg-red-100" : "bg-blue-100"}`}>
                      {React.cloneElement(item.icon, {
                        className: `w-16 h-16 ${isTriage ? "text-purple-600" : red ? "text-red-600" : "text-blue-700"}`,
                      })}
                    </div>
                    <h3 className={`font-bold text-3xl md:text-4xl ${isTriage ? "text-purple-700" : red ? "text-red-700" : "text-[#14213d]"}`}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[#22305a] text-xl mb-3 font-medium">{item.subtitle}</p>
                  <h4 className={`font-semibold mb-3 ${isTriage ? "text-purple-700" : red ? "text-red-700" : "text-[#14213d]"}`}>
                    Quick Steps:
                  </h4>
                  <ul className="list-disc list-inside text-[#22305a] text-lg mb-8 space-y-1">
                    {item.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <Link
                    to={item.link}
                    className={`
                      w-full text-white text-center py-4 rounded-xl font-semibold shadow transition text-xl
                      ${isTriage
                        ? "bg-purple-600 hover:bg-purple-700"
                        : red
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-[#14213d] hover:bg-blue-900"}
                    `}
                  >
                    {isTriage ? "Check Symptoms" : "View Full Guide"}
                  </Link>
                  {!isTriage && (
                    <button
                      className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold shadow hover:bg-green-700 transition text-xl"
                      onClick={() => speak(`${item.title}. ${item.steps.join(". ")}`)}
                    >
                      🎧 Listen
                    </button>
                  )}
                  {item.danger && (
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold shadow hover:from-red-700 hover:to-red-800 transition text-xl">
                      📞 Call Emergency: 102
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Voice Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-16 max-w-2xl mx-auto">
          <button
            className="flex-1 bg-[#14213d] text-white py-5 rounded-xl font-semibold shadow hover:bg-[#22305a] transition text-xl"
            onClick={() => speak(allSteps)}
          >
            🎧 Voice All
          </button>
          <button
            className="flex-1 bg-green-600 text-white py-5 rounded-xl font-semibold shadow hover:bg-green-700 transition text-xl"
            onClick={stopSpeaking}
          >
            ⏹️ Stop Voice
          </button>
        </div>
      </main>

      <footer className="mt-12 mb-4 text-center text-[#a3b8d8] text-lg">
        &copy;{new Date().getFullYear()} First Aid Zen. For emergencies, always call your local emergency number.
      </footer>
    </div>
  );
}