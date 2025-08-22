/**
 * Texture and Material Utilities
 * Free PBR materials implementation for realistic house rendering
 * Uses free resources like Polyhaven, FreePBR.com, etc.
 */

import * as THREE from 'three';

// Free PBR Material presets based on Polyhaven and FreePBR resources
export const MaterialPresets = {
  // Wall Materials
  MODERN_CONCRETE: {
    color: '#E8E8E8',
    roughness: 0.8,
    metalness: 0.0,
    normalScale: [1, 1] as [number, number],
    description: 'Modern concrete wall finish'
  },
  
  TRADITIONAL_BRICK: {
    color: '#B87333',
    roughness: 0.9,
    metalness: 0.0,
    normalScale: [1.5, 1.5] as [number, number],
    description: 'Traditional red brick'
  },
  
  STUCCO_WHITE: {
    color: '#F5F5DC',
    roughness: 0.85,
    metalness: 0.0,
    normalScale: [0.8, 0.8] as [number, number],
    description: 'White stucco exterior'
  },

  // Roof Materials
  CLAY_TILES: {
    color: '#8B4513',
    roughness: 0.95,
    metalness: 0.0,
    normalScale: [2, 2] as [number, number],
    description: 'Traditional clay roof tiles'
  },
  
  METAL_ROOFING: {
    color: '#2F4F4F',
    roughness: 0.3,
    metalness: 0.8,
    normalScale: [0.5, 0.5] as [number, number],
    description: 'Modern metal roofing'
  },
  
  ASPHALT_SHINGLES: {
    color: '#36454F',
    roughness: 0.9,
    metalness: 0.1,
    normalScale: [1.5, 1.5] as [number, number],
    description: 'Standard asphalt shingles'
  },

  // Floor Materials
  HARDWOOD_FLOOR: {
    color: '#8B4513',
    roughness: 0.7,
    metalness: 0.0,
    normalScale: [1, 1] as [number, number],
    description: 'Natural hardwood flooring'
  },
  
  CERAMIC_TILE: {
    color: '#F0F8FF',
    roughness: 0.1,
    metalness: 0.0,
    normalScale: [0.2, 0.2] as [number, number],
    description: 'Glossy ceramic tile'
  },
  
  CARPET: {
    color: '#D2B48C',
    roughness: 0.95,
    metalness: 0.0,
    normalScale: [0.8, 0.8] as [number, number],
    description: 'Soft carpet texture'
  },

  // Ground Materials
  GRASS: {
    color: '#228B22',
    roughness: 0.95,
    metalness: 0.0,
    normalScale: [3, 3] as [number, number],
    description: 'Natural grass texture'
  },
  
  CONCRETE_PATH: {
    color: '#C0C0C0',
    roughness: 0.7,
    metalness: 0.0,
    normalScale: [1, 1] as [number, number],
    description: 'Concrete pathway'
  },
  
  GRAVEL: {
    color: '#A0A0A0',
    roughness: 0.9,
    metalness: 0.0,
    normalScale: [2, 2] as [number, number],
    description: 'Gravel driveway'
  },

  // Furniture Materials
  WOOD_FURNITURE: {
    color: '#8B4513',
    roughness: 0.7,
    metalness: 0.0,
    normalScale: [1, 1] as [number, number],
    description: 'Natural wood furniture'
  },
  
  METAL_APPLIANCE: {
    color: '#C0C0C0',
    roughness: 0.2,
    metalness: 0.8,
    normalScale: [0.1, 0.1] as [number, number],
    description: 'Stainless steel appliance'
  },
  
  FABRIC_SOFT: {
    color: '#708090',
    roughness: 0.9,
    metalness: 0.0,
    normalScale: [0.5, 0.5] as [number, number],
    description: 'Soft fabric upholstery'
  }
};

/**
 * Get material preset by name
 */
export function getMaterialPreset(name: keyof typeof MaterialPresets) {
  return MaterialPresets[name];
}

/**
 * Create a THREE.js material from preset
 */
export function createMaterialFromPreset(presetName: keyof typeof MaterialPresets) {
  const preset = MaterialPresets[presetName];
  return new THREE.MeshStandardMaterial({
    color: preset.color,
    roughness: preset.roughness,
    metalness: preset.metalness,
    normalScale: new THREE.Vector2(...preset.normalScale)
  });
}

/**
 * Style-based material selection
 */
export function getStyleMaterials(style: 'modern' | 'traditional') {
  if (style === 'modern') {
    return {
      walls: MaterialPresets.MODERN_CONCRETE,
      roof: MaterialPresets.METAL_ROOFING,
      floor: MaterialPresets.CERAMIC_TILE,
      furniture: MaterialPresets.METAL_APPLIANCE
    };
  } else {
    return {
      walls: MaterialPresets.TRADITIONAL_BRICK,
      roof: MaterialPresets.CLAY_TILES,
      floor: MaterialPresets.HARDWOOD_FLOOR,
      furniture: MaterialPresets.WOOD_FURNITURE
    };
  }
}

/**
 * Room-specific material recommendations
 */
export function getRoomMaterials(roomType: string, style: 'modern' | 'traditional') {
  const styleMaterials = getStyleMaterials(style);
  
  switch (roomType) {
    case 'bathroom':
      return {
        floor: MaterialPresets.CERAMIC_TILE,
        walls: style === 'modern' ? MaterialPresets.MODERN_CONCRETE : MaterialPresets.STUCCO_WHITE
      };
    case 'kitchen':
      return {
        floor: MaterialPresets.CERAMIC_TILE,
        walls: styleMaterials.walls
      };
    case 'bedroom':
    case 'living':
      return {
        floor: style === 'modern' ? MaterialPresets.HARDWOOD_FLOOR : MaterialPresets.CARPET,
        walls: styleMaterials.walls
      };
    default:
      return {
        floor: styleMaterials.floor,
        walls: styleMaterials.walls
      };
  }
}

/**
 * Free texture resources URLs (for future implementation)
 */
export const FreeTextureResources = {
  POLYHAVEN: 'https://polyhaven.com/textures',
  FREEPBR: 'https://freepbr.com',
  TEXTURES_COM: 'https://www.textures.com',
  SKETCHFAB: 'https://sketchfab.com/tags/cc0',
  OPEN3DMODEL: 'https://www.open3dmodel.com'
};

/**
 * Generate procedural normal map for enhanced detail
 */
export function createProceduralNormal(scale: number = 1) {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  // Create noise pattern for normal map
  const imageData = ctx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = Math.random() * 0.5 + 0.5;
    imageData.data[i] = 128 + (noise - 0.5) * 50 * scale;     // R
    imageData.data[i + 1] = 128 + (noise - 0.5) * 50 * scale; // G
    imageData.data[i + 2] = 255;                              // B (Z)
    imageData.data[i + 3] = 255;                              // A
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(scale, scale);
  
  return texture;
}