import { useState } from "react";

interface TriageResult {
  ktas_level: number;
  label: string;
  color: string;
  message: string;
  action: string;
  confidence: number;
  disclaimer: string;
}

const colorMap: Record<string, string> = {
  red:    "bg-red-50 border-red-500 text-red-800",
  orange: "bg-orange-50 border-orange-500 text-orange-800",
  yellow: "bg-yellow-50 border-yellow-500 text-yellow-800",
  blue:   "bg-blue-50 border-blue-500 text-blue-800",
  green:  "bg-green-50 border-green-500 text-green-800",
};

const badgeColorMap: Record<string, string> = {
  red:    "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  blue:   "bg-blue-500",
  green:  "bg-green-500",
};

const COMPLAINT_OPTIONS = [
  "chest pain", "difficulty breathing / dyspnea", "abdominal pain",
  "headache", "dizziness", "fever", "bleeding", "burn",
  "fracture / bone pain", "choking", "seizure",
  "loss of consciousness / syncope", "vomiting",
  "allergic reaction / rash", "laceration / wound",
  "poisoning", "stroke symptoms / weakness", "back pain", "other",
];

const TriagePage = () => {
  const [form, setForm] = useState({
    chief_complaint: "",
    Age: "",
    pain_score: "0",
    Injury: "0",
    Mental: "1",
  });
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    if (!form.chief_complaint || !form.Age) {
      setError("Please fill in at least the complaint and age.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chief_complaint: form.chief_complaint,
          Age: parseFloat(form.Age),
          pain_score: parseFloat(form.pain_score),
          Injury: parseInt(form.Injury),
          Mental: parseInt(form.Mental),
        }),
      });
      if (!res.ok) throw new Error("Server error. Is the backend running?");
      const data: TriageResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ chief_complaint: "", Age: "", pain_score: "0", Injury: "0", Mental: "1" });
    setResult(null);
    setError("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Symptom Severity Checker</h1>
        <p className="text-gray-500 text-sm">
          Enter patient details to get an ML-estimated triage level.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main symptom / complaint *
          </label>
          <select
            name="chief_complaint"
            value={form.chief_complaint}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Select a complaint...</option>
            {COMPLAINT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
          <input
            type="number"
            name="Age"
            value={form.Age}
            onChange={handleChange}
            placeholder="e.g. 35"
            min={0}
            max={120}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pain Level (0–10)
          </label>
          <input
            type="range"
            name="pain_score"
            min={0} max={10} step={1}
            value={form.pain_score}
            onChange={handleChange}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 - No pain</span>
            <span className="font-semibold text-gray-600">{form.pain_score}</span>
            <span>10 - Severe</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Physical injury?
          </label>
          <div className="flex gap-4">
            {[["0", "No"], ["1", "Yes"]].map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="Injury"
                  value={val}
                  checked={form.Injury === val}
                  onChange={handleChange}
                  className="accent-red-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mental / Consciousness Status
          </label>
          <select
            name="Mental"
            value={form.Mental}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="1">Alert and conscious</option>
            <option value="2">Confused / disoriented</option>
            <option value="3">Responds to voice only</option>
            <option value="4">Unresponsive</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Check Severity"}
        </button>
      </div>

      {result && (
        <div className={`mt-6 border-2 rounded-2xl p-6 space-y-4 ${colorMap[result.color] || colorMap["blue"]}`}>
          <div className="flex items-center gap-3">
            <span className={`text-white text-sm font-bold px-3 py-1 rounded-full ${badgeColorMap[result.color]}`}>
              KTAS Level {result.ktas_level}
            </span>
            <span className="text-lg font-bold">{result.label}</span>
            <span className="ml-auto text-sm font-medium opacity-75">
              Confidence: {result.confidence}%
            </span>
          </div>
          <p className="font-medium">{result.message}</p>
          <div className="bg-white bg-opacity-60 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-60">
              Recommended Action
            </p>
            <p className="font-medium">{result.action}</p>
          </div>
          <p className="text-xs opacity-60 italic">{result.disclaimer}</p>
          <button onClick={handleReset} className="text-sm underline opacity-70 hover:opacity-100 transition">
            Check another patient
          </button>
        </div>
      )}
    </div>
  );
};

export default TriagePage;