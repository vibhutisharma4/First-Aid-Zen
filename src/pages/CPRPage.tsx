import React from 'react';
import { Heart, AlertCircle } from 'lucide-react';

const instructions = [
  "Check responsiveness. Tap shoulders firmly and shout 'Are you okay?'",
  "Call for help. Call 102 and ask someone to find an AED if available.",
  "Begin chest compressions. Push hard and fast in the center of the chest, 100 to 120 compressions per minute."
];

const speak = (text: string) => {
  const synth = window.speechSynthesis;
  synth.cancel(); // Stop any ongoing speech before starting new
  const utter = new window.SpeechSynthesisUtterance(text);
  synth.speak(utter);
};

const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};

const CPRPage = () => {
  return (
    <div className="bg-white rounded-xl p-12 shadow-sm">
      <div className="flex items-center mb-10">
        <div className="p-5 bg-red-50 rounded-lg mr-6">
          <Heart className="w-12 h-12 text-red-600" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-gray-900">CPR</h1>
          <p className="text-2xl text-gray-600">Cardiopulmonary resuscitation for unresponsive victims</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-10">
        <div className="flex items-center">
          <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
          <p className="text-2xl text-red-800 font-semibold">Emergency Situation - Call 102 Immediately</p>
        </div>
      </div>

      <div className="space-y-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Steps:</h2>
          <div className="space-y-8">
            {instructions.map((step, idx) => (
              <div className="flex items-start" key={idx}>
                <span className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mr-6 mt-1 text-2xl">{idx + 1}</span>
                <div>
                  <h3 className="font-semibold text-2xl text-gray-900">{step.split('.')[0]}</h3>
                  <p className="text-xl text-gray-600">{step.slice(step.indexOf('.') + 1).trim()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-6 pt-8">
          <button
            className="bg-green-600 text-white py-4 px-8 rounded-lg hover:bg-green-700 transition-colors text-2xl"
            onClick={() => speak(instructions.join(' '))}
          >
            🎧 Listen
          </button>
          <button
            className="bg-yellow-500 text-white py-4 px-8 rounded-lg hover:bg-yellow-600 transition-colors text-2xl"
            onClick={stopSpeaking}
          >
            ⏹️ Stop
          </button>
          <button className="bg-red-600 text-white py-4 px-8 rounded-lg hover:bg-red-700 transition-colors text-2xl">
            📞 Call Emergency: 102
          </button>
        </div>
      </div>

      {/* YouTube video embed */}
      <div className="mt-16 flex justify-center">
        <div className="w-[40rem] h-[40rem]">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/IN68CoYIPhg"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default CPRPage;