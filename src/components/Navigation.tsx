import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-center mb-8">
      <div className="flex items-center gap-6 bg-white rounded-full px-6 py-3 shadow-sm border">
        <div className="flex items-center gap-2 text-blue-600">
          <Heart className="w-5 h-5" />
          <span className="font-semibold">First Aid Guide</span>
        </div>
        <div className="flex gap-4 text-sm">
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-3 py-1 rounded-full">Home</button>
          <button onClick={() => navigate("/cpr")} className="text-gray-600 hover:text-blue-600">CPR</button>
          <button onClick={() => navigate("/choking")} className="text-gray-600 hover:text-blue-600">Choking</button>
          <button onClick={() => navigate("/burns")} className="text-gray-600 hover:text-blue-600">Burns</button>
          <button onClick={() => navigate("/bleeding")} className="text-gray-600 hover:text-blue-600">Bleeding</button>
          <button onClick={() => navigate("/fractures")} className="text-gray-600 hover:text-blue-600">Fractures</button>
          <button onClick={() => navigate("/heart-stroke")} className="text-gray-600 hover:text-blue-600">Heart & Stroke</button>
          <button onClick={() => navigate("/poisoning")} className="text-gray-600 hover:text-blue-600">Poisoning</button>
          <button onClick={() => navigate("/seizures")} className="text-gray-600 hover:text-blue-600">Seizures</button>
          <button onClick={() => navigate("/crisis")} className="text-gray-600 hover:text-blue-600">Crisis Mode</button>
          <button onClick={() => navigate("/triage")} className="text-gray-600 hover:text-blue-600">Symptom Checker</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;