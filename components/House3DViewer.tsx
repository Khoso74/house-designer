'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { HouseLayout, Room, Furniture, TourWaypoint } from '@/types/house';
import { motion } from 'framer-motion';

interface House3DViewerProps {
  houseLayout: HouseLayout;
  tourWaypoints: TourWaypoint[];
  onTourComplete?: () => void;
}

/**
 * Main 3D House Viewer Component
 * Renders the complete house with rooms, furniture, and interactive controls
 */
export default function House3DViewer({ houseLayout, tourWaypoints, onTourComplete }: House3DViewerProps) {
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [tourProgress, setTourProgress] = useState(0);

  const handleAutoTour = () => {
    setIsAutoTour(true);
    setCurrentTourIndex(0);
    setTourProgress(0);
  };

  const handleStopTour = () => {
    setIsAutoTour(false);
    setCurrentTourIndex(0);
    setTourProgress(0);
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gradient-to-b from-blue-50 to-indigo-100 rounded-xl overflow-hidden">
      {/* 3D Canvas */}
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} />
        
        {/* House Structure */}
        <HouseStructure houseLayout={houseLayout} />
        
        {/* Ground Plane */}
        <GroundPlane width={houseLayout.width} length={houseLayout.length} />
        
        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
        
        {/* Auto Tour Camera */}
        {isAutoTour && (
          <AutoTourCamera
            waypoints={tourWaypoints}
            currentIndex={currentTourIndex}
            progress={tourProgress}
            onProgressChange={setTourProgress}
            onIndexChange={setCurrentTourIndex}
            onComplete={() => {
              setIsAutoTour(false);
              onTourComplete?.();
            }}
          />
        )}
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isAutoTour ? handleStopTour : handleAutoTour}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
            isAutoTour 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {isAutoTour ? 'Stop Tour' : 'Auto Tour'}
        </motion.button>
        
        {isAutoTour && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-1">
              {tourWaypoints[currentTourIndex]?.roomName || 'Tour Complete'}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(tourProgress / tourWaypoints.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* House Info */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-2">House Details</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div>Style: {houseLayout.style}</div>
          <div>Floors: {houseLayout.floors}</div>
          <div>Rooms: {houseLayout.rooms.length}</div>
          <div>Size: {houseLayout.width.toFixed(1)}m × {houseLayout.length.toFixed(1)}m</div>
        </div>
      </div>
    </div>
  );
}

/**
 * House Structure Component
 * Renders the main house structure with walls and roof
 */
function HouseStructure({ houseLayout }: { houseLayout: HouseLayout }) {
  return (
    <group>
      {/* House Foundation */}
      <Box
        position={[houseLayout.width / 2, -0.1, houseLayout.length / 2]}
        args={[houseLayout.width + 0.2, 0.2, houseLayout.length + 0.2]}
      >
        <meshStandardMaterial color="#8B7355" />
      </Box>

      {/* House Walls */}
      <Box
        position={[houseLayout.width / 2, houseLayout.height / 2, houseLayout.length / 2]}
        args={[houseLayout.width, houseLayout.height, houseLayout.length]}
      >
        <meshStandardMaterial color="#F5F5DC" />
      </Box>

      {/* Roof */}
      <Box
        position={[houseLayout.width / 2, houseLayout.height + 0.5, houseLayout.length / 2]}
        args={[houseLayout.width + 0.4, 1, houseLayout.length + 0.4]}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Render all rooms */}
      {houseLayout.rooms.map((room) => (
        <RoomComponent key={room.id} room={room} style={houseLayout.style} />
      ))}
    </group>
  );
}

/**
 * Room Component
 * Renders individual rooms with furniture
 */
function RoomComponent({ room, style }: { room: Room; style: 'modern' | 'traditional' }) {
  const roomColor = getRoomColor(room.type, style);
  
  return (
    <group position={[room.position.x, room.position.y, room.position.z]}>
      {/* Room Floor */}
      <Box
        position={[room.dimensions.width / 2, 0.01, room.dimensions.length / 2]}
        args={[room.dimensions.width, 0.02, room.dimensions.length]}
      >
        <meshStandardMaterial color={roomColor.floor} />
      </Box>

      {/* Room Walls */}
      <Box
        position={[room.dimensions.width / 2, room.dimensions.height / 2, 0]}
        args={[room.dimensions.width, room.dimensions.height, 0.1]}
      >
        <meshStandardMaterial color={roomColor.walls} />
      </Box>

      <Box
        position={[0, room.dimensions.height / 2, room.dimensions.length / 2]}
        args={[0.1, room.dimensions.height, room.dimensions.length]}
      >
        <meshStandardMaterial color={roomColor.walls} />
      </Box>

      <Box
        position={[room.dimensions.width, room.dimensions.height / 2, room.dimensions.length / 2]}
        args={[0.1, room.dimensions.height, room.dimensions.length]}
      >
        <meshStandardMaterial color={roomColor.walls} />
      </Box>

      <Box
        position={[room.dimensions.width / 2, room.dimensions.height / 2, room.dimensions.length]}
        args={[room.dimensions.width, room.dimensions.height, 0.1]}
      >
        <meshStandardMaterial color={roomColor.walls} />
      </Box>

      {/* Room Label */}
      <Text
        position={[room.dimensions.width / 2, room.dimensions.height + 0.5, room.dimensions.length / 2]}
        fontSize={0.5}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>

      {/* Render furniture */}
      {room.furniture.map((item) => (
        <FurnitureComponent key={item.id} furniture={item} style={style} />
      ))}
    </group>
  );
}

/**
 * Furniture Component
 * Renders individual furniture items
 */
function FurnitureComponent({ furniture, style }: { furniture: Furniture; style: 'modern' | 'traditional' }) {
  const furnitureColor = getFurnitureColor(furniture.type, style);
  
  return (
    <group
      position={[
        furniture.position.x,
        furniture.position.y,
        furniture.position.z
      ]}
      rotation={[0, furniture.rotation, 0]}
    >
      <Box
        args={[
          furniture.dimensions.width,
          furniture.dimensions.height,
          furniture.dimensions.length
        ]}
      >
        <meshStandardMaterial color={furnitureColor} />
      </Box>
    </group>
  );
}

/**
 * Ground Plane Component
 * Renders the ground surface
 */
function GroundPlane({ width, length }: { width: number; length: number }) {
  return (
    <Box
      position={[width / 2, -0.5, length / 2]}
      args={[width + 10, 1, length + 10]}
    >
      <meshStandardMaterial color="#90EE90" />
    </Box>
  );
}

/**
 * Auto Tour Camera Component
 * Handles automatic camera movement through the house
 */
function AutoTourCamera({ 
  waypoints, 
  currentIndex, 
  progress, 
  onProgressChange, 
  onIndexChange, 
  onComplete 
}: {
  waypoints: TourWaypoint[];
  currentIndex: number;
  progress: number;
  onProgressChange: (progress: number) => void;
  onIndexChange: (index: number) => void;
  onComplete: () => void;
}) {
  const { camera } = useThree();
  const currentWaypoint = waypoints[currentIndex];
  
  useFrame((state, delta) => {
    if (!currentWaypoint) {
      onComplete();
      return;
    }

    const targetPosition = currentWaypoint.position;
    const targetLookAt = currentWaypoint.lookAt;
    
    // Smooth camera movement
    camera.position.lerp(new THREE.Vector3(...targetPosition), delta * 2);
    
    // Smooth look-at movement
    const lookAtVector = new THREE.Vector3(...targetLookAt);
    camera.lookAt(lookAtVector);
    
    // Update progress
    const newProgress = progress + delta / currentWaypoint.duration;
    onProgressChange(newProgress);
    
    // Move to next waypoint
    if (newProgress >= 1) {
      if (currentIndex < waypoints.length - 1) {
        onIndexChange(currentIndex + 1);
        onProgressChange(0);
      } else {
        onComplete();
      }
    }
  });

  return null;
}

/**
 * Utility Functions
 */
function getRoomColor(roomType: string, style: 'modern' | 'traditional') {
  const colors = {
    modern: {
      living: { floor: '#E5E7EB', walls: '#F9FAFB' },
      bedroom: { floor: '#F3F4F6', walls: '#FFFFFF' },
      kitchen: { floor: '#FEF3C7', walls: '#FEFCE8' },
      bathroom: { floor: '#DBEAFE', walls: '#EFF6FF' },
      dining: { floor: '#E5E7EB', walls: '#F9FAFB' },
      hallway: { floor: '#F3F4F6', walls: '#FFFFFF' }
    },
    traditional: {
      living: { floor: '#8B7355', walls: '#F5DEB3' },
      bedroom: { floor: '#DEB887', walls: '#F5F5DC' },
      kitchen: { floor: '#CD853F', walls: '#F0E68C' },
      bathroom: { floor: '#B8860B', walls: '#F0F8FF' },
      dining: { floor: '#8B7355', walls: '#F5DEB3' },
      hallway: { floor: '#DEB887', walls: '#F5F5DC' }
    }
  };
  
  return colors[style][roomType as keyof typeof colors.modern] || colors[style].living;
}

function getFurnitureColor(furnitureType: string, style: 'modern' | 'traditional') {
  const colors = {
    modern: {
      bed: '#2C3E50',
      sofa: '#34495E',
      table: '#95A5A6',
      chair: '#7F8C8D',
      cabinet: '#BDC3C7',
      appliance: '#ECF0F1'
    },
    traditional: {
      bed: '#8B4513',
      sofa: '#A0522D',
      table: '#CD853F',
      chair: '#DEB887',
      cabinet: '#D2B48C',
      appliance: '#F5DEB3'
    }
  };
  
  return colors[style][furnitureType as keyof typeof colors.modern] || colors[style].cabinet;
}
