// House design form data interface
export interface HouseFormData {
  plotSize: string;
  houseType: 'single' | 'double';
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  locationType: 'city' | 'village';
  extraNotes: string;
}

// House layout configuration
export interface HouseLayout {
  width: number;
  length: number;
  height: number;
  floors: number;
  rooms: Room[];
  style: 'modern' | 'traditional';
}

// Room configuration
export interface Room {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'hallway';
  position: {
    x: number;
    y: number;
    z: number;
  };
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  furniture: Furniture[];
}

// Furniture configuration
export interface Furniture {
  id: string;
  name: string;
  type: 'bed' | 'sofa' | 'table' | 'chair' | 'cabinet' | 'appliance';
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
}

// Camera tour waypoints
export interface TourWaypoint {
  position: [number, number, number];
  lookAt: [number, number, number];
  duration: number;
  roomName: string;
}

// House generation response
export interface HouseGenerationResponse {
  success: boolean;
  layout: HouseLayout;
  tourWaypoints: TourWaypoint[];
  error?: string;
}

// Form validation errors
export interface FormErrors {
  plotSize?: string;
  houseType?: string;
  bedrooms?: string;
  bathrooms?: string;
  kitchens?: string;
  locationType?: string;
}


