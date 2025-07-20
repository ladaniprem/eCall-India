// import React, { useState, useEffect } from 'react';
// import {  MapPin, Phone, Zap, AlertTriangle, Activity, Navigation, Car, Users } from 'lucide-react';
// import AnimatedSOS from './AnimatedSOS';
// import CrashDetectionSystem from './CrashDetectionSystem';
// import { DarkModeToggle } from './DarkModeProvider';
// import Map from './Map';

// interface EmergencyContact {
//   name: string;
//   relation: string;
//   phone: string;
// }

// interface UserData {
//   name?: string;
//   vehicleModel?: string;
//   vehicleNumber?: string;
//   emergencyContacts?: EmergencyContact[];
// }

// interface DashboardProps {
//   onEmergency: (severity?: 'minor' | 'moderate' | 'severe') => void;
//   userData?: UserData;
// }

// const Dashboard: React.FC<DashboardProps> = ({ onEmergency, userData }) => {
//   const [currentSpeed, setCurrentSpeed] = useState(0);
//   const [lastSync, setLastSync] = useState(new Date());
//   const [nearbyAlerts] = useState(2);
//   const [batteryLevel, setBatteryLevel] = useState(85);
//   const [crashSeverity, setCrashSeverity] = useState<'minor' | 'moderate' | 'severe' | null>(null);
//   const [isEmergencyMode, setIsEmergencyMode] = useState(false);
//   const [tripData, setTripData] = useState({
//     distance: 12.5,
//     duration: 45,
//     avgSpeed: 35,
//     impactPoints: 0
//   });

//   useEffect(() => {
//     // Simulate real-time updates
//     const interval = setInterval(() => {
//       setCurrentSpeed(prev => Math.max(0, prev + (Math.random() - 0.5) * 10));
//       setBatteryLevel(prev => Math.max(20, prev - (Math.random() * 0.1)));
//       setLastSync(new Date());
      
//       // Update trip data
//       setTripData(prev => ({
//         ...prev,
//         distance: prev.distance + (Math.random() * 0.1),
//         duration: prev.duration + 1/60, // Add 1 second
//         avgSpeed: (prev.avgSpeed + currentSpeed) / 2
//       }));
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [currentSpeed]);

//   const handleCrashDetected = (severity: 'minor' | 'moderate' | 'severe') => {
//     setCrashSeverity(severity);
//     setIsEmergencyMode(true);
//     setTripData(prev => ({ ...prev, impactPoints: prev.impactPoints + 1 }));
//     onEmergency(severity);
//   };

//   const handleVoiceTrigger = () => {
//     onEmergency();
//   };

//   const hospitals = [
//     { 
//       name: "AIIMS Delhi", 
//       distance: "2.3 km", 
//       status: "available", 
//       type: "Government",
//       eta: "8 mins",
//       specialties: ["Trauma", "Emergency", "ICU"]
//     },
//     { 
//       name: "Max Hospital", 
//       distance: "3.1 km", 
//       status: "busy", 
//       type: "Private",
//       eta: "12 mins",
//       specialties: ["Cardiology", "Neurology", "Emergency"]
//     },
//     { 
//       name: "Fortis Healthcare", 
//       distance: "4.2 km", 
//       status: "available", 
//       type: "Private",
//       eta: "15 mins",
//       specialties: ["Orthopedics", "Emergency", "Surgery"]
//     },
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'available': return 'bg-green-500';
//       case 'busy': return 'bg-yellow-500';
//       case 'unavailable': return 'bg-red-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//       {/* Enhanced Header with User Info */}
//       <div className="glass-morph shadow-lg px-6 py-8 slide-up-fade border-b border-white/20 dark:border-gray-700/50">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               eCall Dashboard
//             </h1>
//             <p className="text-gray-600 dark:text-gray-300 font-medium">
//               Welcome back, {userData?.name || 'User'}
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <DarkModeToggle />
//             <div className="flex items-center space-x-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-sm text-green-600 dark:text-green-400 font-medium">Protected</span>
//             </div>
//           </div>
//         </div>

//         {/* Vehicle Info */}
//         {userData?.vehicleModel && (
//           <div className="glass-morph rounded-xl p-4 mb-4">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-900 dark:text-white">
//                   {userData.vehicleModel}
//                 </p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   {userData.vehicleNumber}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Status Bar */}
//         <div className="flex items-center justify-between text-sm">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-green-600 dark:text-green-400 font-medium">System Active</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//               <span className="text-gray-600 dark:text-gray-400">{batteryLevel.toFixed(0)}%</span>
//             </div>
//           </div>
//           <div className="text-xs text-gray-500 dark:text-gray-400">
//             Last sync: {lastSync.toLocaleTimeString()}
//           </div>
//         </div>
//       </div>

//       <div className="p-6 space-y-6">
//         {/* Add Map component here */}
//         <div className="glass-morph rounded-2xl p-4 h-96">
//           <Map 
//             latitude={null} 
//             longitude={null} 
//             hospitals={hospitals} 
//           />
//         </div>

//         {/* Crash Detection System */}
//         <CrashDetectionSystem 
//           onCrashDetected={handleCrashDetected}
//           onVoiceTrigger={handleVoiceTrigger}
//         />

//         {/* Trip Statistics */}
//         <div className="glass-morph rounded-2xl p-6 slide-up-fade border border-white/20 dark:border-gray-700/50">
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
//             Current Trip
//           </h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                 {tripData.distance.toFixed(1)} km
//               </p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//                 {Math.floor(tripData.duration)} min
//               </p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
//                 {tripData.avgSpeed.toFixed(0)} km/h
//               </p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Avg Speed</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
//                 {tripData.impactPoints}
//               </p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Impact Points</p>
//             </div>
//           </div>
//         </div>

//         {/* Real-time Metrics */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="glass-morph rounded-2xl p-6 slide-up-fade border border-white/20 dark:border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
//                 <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div className="text-right">
//                 <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
//                   {currentSpeed.toFixed(0)}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">km/h</p>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Speed</span>
//               <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-blue-500 rounded-full transition-all duration-500"
//                   style={{ width: `${Math.min(currentSpeed / 120 * 100, 100)}%` }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="glass-morph rounded-2xl p-6 slide-up-fade border border-white/20 dark:border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
//                 <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
//               </div>
//               <div className="text-right">
//                 <p className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">
//                   {batteryLevel.toFixed(0)}%
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Battery</p>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Power Level</span>
//               <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full rounded-full transition-all duration-500 ${
//                     batteryLevel > 50 ? 'bg-green-500' : batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
//                   }`}
//                   style={{ width: `${batteryLevel}%` }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Interactive Map */}
//         <div className="glass-morph rounded-2xl shadow-lg overflow-hidden slide-up-fade border border-white/20 dark:border-gray-700/50">
//           <div className="h-80 bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-purple-800/30 relative">
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="relative mb-4">
//                   <MapPin className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto animate-bounce" />
//                   <div className="absolute inset-0 w-16 h-16 bg-blue-500/20 rounded-full animate-ping mx-auto"></div>
//                 </div>
//                 <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
//                   Your Current Location
//                 </p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Connaught Place, New Delhi
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                   GPS Accuracy: ±3 meters
//                 </p>
//               </div>
//             </div>
            
//             {/* Floating Status Badges */}
//             <div className="absolute top-4 left-4 glass-morph rounded-full px-4 py-2 shadow-lg border border-white/30">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GPS Active</span>
//               </div>
//             </div>

//             <div className="absolute top-4 right-4 glass-morph rounded-full px-4 py-2 shadow-lg border border-white/30">
//               <div className="flex items-center space-x-2">
//                 <AlertTriangle className="w-4 h-4 text-yellow-500" />
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{nearbyAlerts} Alerts</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Emergency SOS Button */}
//         <div className="flex justify-center py-8">
//           <AnimatedSOS 
//             onEmergency={() => onEmergency()}
//             isEmergencyMode={isEmergencyMode}
//             crashSeverity={crashSeverity}
//           />
//         </div>

//         {/* Enhanced Hospital List */}
//         <div className="glass-morph rounded-2xl shadow-lg slide-up-fade border border-white/20 dark:border-gray-700/50">
//           <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-bold text-gray-900 dark:text-white">
//                 Nearby Hospitals
//               </h3>
//               <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
//                 View All
//               </button>
//             </div>
//           </div>
//           <div className="p-6 space-y-4">
//             {hospitals.map((hospital, index) => (
//               <div 
//                 key={index} 
//                 className="glass-morph rounded-xl p-4 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 group border border-white/10 dark:border-gray-700/30"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center space-x-4">
//                     <div className="relative">
//                       <div className={`w-3 h-3 rounded-full ${getStatusColor(hospital.status)} animate-pulse`}></div>
//                       <div className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusColor(hospital.status)} animate-ping opacity-75`}></div>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                         {hospital.name}
//                       </p>
//                       <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           hospital.type === 'Government' 
//                             ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
//                             : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
//                         }`}>
//                           {hospital.type}
//                         </span>
//                         <span>{hospital.distance}</span>
//                         <span>•</span>
//                         <span className="text-green-600 dark:text-green-400 font-medium">ETA {hospital.eta}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors group">
//                       <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
//                     </button>
//                     <button className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors group">
//                       <Phone className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Specialties */}
//                 <div className="flex flex-wrap gap-2">
//                   {hospital.specialties.map((specialty, idx) => (
//                     <span 
//                       key={idx} 
//                       className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
//                     >
//                       {specialty}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Emergency Contacts Quick Access */}
//         {userData?.emergencyContacts && (
//           <div className="glass-morph rounded-2xl p-6 slide-up-fade border border-white/20 dark:border-gray-700/50">
//             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
//               Emergency Contacts
//             </h3>
//             <div className="space-y-3">
//               {userData.emergencyContacts.slice(0, 2).map((contact: any, index: number) => (
//                 <div key={index} className="flex items-center justify-between p-3 glass-morph rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
//                       <Users className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relation}</p>
//                     </div>
//                   </div>
//                   <button className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
//                     <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;