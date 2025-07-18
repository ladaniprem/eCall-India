import axios from 'axios';

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;
const SEARCH_API_URL = 'https://api.tomtom.com/search/2/poiSearch/hospital.json';

export interface Hospital {
    id: string;
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
    type: 'government' | 'private';
    status: 'available' | 'busy' | 'full';
    rating: number;
    estimatedTime: number;
    specialties: string[];
}

export const getHospitals = async (lat: number, lng: number, radius: number = 10000): Promise<Hospital[]> => {
    try {
        const response = await axios.get(SEARCH_API_URL, {
            params: {
                key: TOMTOM_API_KEY,
                lat,
                lon: lng,
                radius,
                limit: 1000
            }
        });

        return response.data.results.map((result: {
            id: string;
            poi: {
                name: string;
                phone?: string;
            };
            address: {
                freeformAddress: string;
            };
            position: {
                lat: number;
                lon: number;
            };
        }) => ({
            id: result.id,
            name: result.poi.name,
            address: result.address.freeformAddress,
            phone: result.poi.phone || 'N/A',
            lat: result.position.lat,
            lng: result.position.lon,
            // Simulated data - in a real app, these would come from your backend
            type: Math.random() > 0.5 ? 'government' : 'private',
            status: ['available', 'busy', 'full'][Math.floor(Math.random() * 3)] as 'available' | 'busy' | 'full',
            rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
            estimatedTime: Math.floor(Math.random() * 30) + 5, // Random time between 5 and 35 minutes
            specialties: [
                'Emergency Care',
                'Trauma Center',
                'Cardiology',
                'Neurology',
                'Orthopedics',
                'Pediatrics'
            ].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 2) // Random 2-5 specialties
        }));
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return [];
    }
};

export const getHospitalById = async (id: string): Promise<Hospital | null> => {
    try {
        const response = await axios.get(`${SEARCH_API_URL}/${id}`, {
            params: {
                key: TOMTOM_API_KEY
            }
        });
        const result = response.data;
        
        return {
            id: result.id,
            name: result.poi.name,
            address: result.address.freeformAddress,
            phone: result.poi.phone || 'N/A',
            lat: result.position.lat,
            lng: result.position.lon,
            type: Math.random() > 0.5 ? 'government' : 'private',
            status: ['available', 'busy', 'full'][Math.floor(Math.random() * 3)] as 'available' | 'busy' | 'full',
            rating: Number((Math.random() * 2 + 3).toFixed(1)),
            estimatedTime: Math.floor(Math.random() * 30) + 5,
            specialties: [
                'Emergency Care',
                'Trauma Center',
                'Cardiology',
                'Neurology',
                'Orthopedics',
                'Pediatrics'
            ].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 2)
        };
    } catch (error) {
        console.error('Error fetching hospital:', error);
        return null;
    }
};
