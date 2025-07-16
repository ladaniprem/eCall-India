import React from 'react';
import { Navigation, Phone } from 'lucide-react';

interface HospitalCardProps {
  hospital: {
    name: string;
    distance: string;
    status: string;
    type: string;
    eta: string;
    specialties: string[];
  };
  getStatusColor: (status: string) => string;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, getStatusColor }) => {
  return (
    <div
      className="glass-morph rounded-xl p-4 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 group border border-white/10 dark:border-gray-700/30"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(hospital.status)} animate-pulse`}></div>
            <div className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusColor(hospital.status)} animate-ping opacity-75`}></div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {hospital.name}
            </p>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hospital.type === 'Government'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                }`}
              >
                {hospital.type}
              </span>
              <span>{hospital.distance}</span>
              <span>•</span>
              <span className="text-green-600 dark:text-green-400 font-medium">ETA {hospital.eta}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors group">
            <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          </button>
          <button className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors group">
            <Phone className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-2">
        {hospital.specialties.map((specialty: string, idx: number) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300"
          >
            {specialty}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HospitalCard;