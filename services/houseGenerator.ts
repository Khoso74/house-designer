import { HouseFormData, HouseLayout, Room, Furniture, TourWaypoint } from '@/types/house';

/**
 * House Generation Service
 * Creates procedural 3D house layouts based on user specifications
 * Uses mathematical algorithms to generate realistic house structures
 */

export class HouseGenerator {
  private static readonly ROOM_HEIGHT = 3; // Standard room height in meters
  private static readonly WALL_THICKNESS = 0.2; // Wall thickness in meters
  private static readonly DOOR_WIDTH = 1; // Door width in meters
  private static readonly WINDOW_WIDTH = 1.5; // Window width in meters

  /**
   * Generate a complete house layout based on form data
   */
  static generateHouse(formData: HouseFormData): HouseLayout {
    try {
      // Parse plot size and calculate house dimensions
      const plotSize = this.parsePlotSize(formData.plotSize);
      const houseDimensions = this.calculateHouseDimensions(plotSize, formData);
      
      // Generate room layout
      const rooms = this.generateRooms(formData, houseDimensions);
      
      // Add furniture based on style
      const furnishedRooms = this.addFurniture(rooms, formData.locationType);
      
      // Generate tour waypoints
      const tourWaypoints = this.generateTourWaypoints(furnishedRooms, houseDimensions);
      
      return {
        width: houseDimensions.width,
        length: houseDimensions.length,
        height: houseDimensions.height,
        floors: formData.houseType === 'single' ? 1 : 2,
        rooms: furnishedRooms,
        style: formData.locationType === 'city' ? 'modern' : 'traditional'
      };
    } catch (error) {
      console.error('Error generating house:', error);
      throw new Error('Failed to generate house layout');
    }
  }

  /**
   * Parse plot size string to get dimensions
   */
  private static parsePlotSize(plotSize: string): { width: number; length: number } {
    // Handle different plot size formats
    const size = plotSize.toLowerCase().replace(/\s/g, '');
    
    if (size.includes('x')) {
      const [width, length] = size.split('x').map(s => parseFloat(s));
      return { width: width || 20, length: length || 30 };
    }
    
    const numericSize = parseFloat(size);
    if (!isNaN(numericSize)) {
      // Assume square plot if only one dimension provided
      return { width: numericSize, length: numericSize };
    }
    
    // Default plot size
    return { width: 20, length: 30 };
  }

  /**
   * Calculate house dimensions based on plot size and requirements
   */
  private static calculateHouseDimensions(
    plotSize: { width: number; length: number },
    formData: HouseFormData
  ): { width: number; length: number; height: number } {
    // Calculate house footprint (80% of plot size)
    const houseWidth = Math.min(plotSize.width * 0.8, 25);
    const houseLength = Math.min(plotSize.length * 0.8, 35);
    
    // Calculate height based on floors
    const floorHeight = this.ROOM_HEIGHT;
    const totalHeight = formData.houseType === 'single' ? floorHeight : floorHeight * 2;
    
    return {
      width: houseWidth,
      length: houseLength,
      height: totalHeight
    };
  }

  /**
   * Generate room layout based on requirements
   */
  private static generateRooms(formData: HouseFormData, dimensions: { width: number; length: number; height: number }): Room[] {
    const rooms: Room[] = [];
    let currentX = 0;
    let currentZ = 0;
    
    // Calculate room sizes based on house dimensions
    const roomWidth = dimensions.width / Math.max(2, Math.ceil(Math.sqrt(formData.bedrooms + 2)));
    const roomLength = dimensions.length / Math.max(2, Math.ceil(Math.sqrt(formData.bedrooms + 2)));
    
    // Add living room (always present)
    rooms.push({
      id: 'living-1',
      name: 'Living Room',
      type: 'living',
      position: { x: currentX, y: 0, z: currentZ },
      dimensions: { width: roomWidth * 1.5, length: roomLength * 1.5, height: this.ROOM_HEIGHT },
      furniture: []
    });
    
    currentX += roomWidth * 1.5;
    
    // Add kitchen
    for (let i = 0; i < formData.kitchens; i++) {
      rooms.push({
        id: `kitchen-${i + 1}`,
        name: `Kitchen ${i + 1}`,
        type: 'kitchen',
        position: { x: currentX, y: 0, z: currentZ },
        dimensions: { width: roomWidth, length: roomLength, height: this.ROOM_HEIGHT },
        furniture: []
      });
      currentX += roomWidth;
    }
    
    // Add dining room if space allows
    if (currentX + roomWidth <= dimensions.width) {
      rooms.push({
        id: 'dining-1',
        name: 'Dining Room',
        type: 'dining',
        position: { x: currentX, y: 0, z: currentZ },
        dimensions: { width: roomWidth, length: roomLength, height: this.ROOM_HEIGHT },
        furniture: []
      });
      currentX += roomWidth;
    }
    
    // Reset for next row
    currentX = 0;
    currentZ += roomLength * 1.5;
    
    // Add bedrooms
    for (let i = 0; i < formData.bedrooms; i++) {
      if (currentX + roomWidth > dimensions.width) {
        currentX = 0;
        currentZ += roomLength;
      }
      
      rooms.push({
        id: `bedroom-${i + 1}`,
        name: `Bedroom ${i + 1}`,
        type: 'bedroom',
        position: { x: currentX, y: 0, z: currentZ },
        dimensions: { width: roomWidth, length: roomLength, height: this.ROOM_HEIGHT },
        furniture: []
      });
      
      currentX += roomWidth;
    }
    
    // Add bathrooms
    for (let i = 0; i < formData.bathrooms; i++) {
      if (currentX + roomWidth > dimensions.width) {
        currentX = 0;
        currentZ += roomLength;
      }
      
      rooms.push({
        id: `bathroom-${i + 1}`,
        name: `Bathroom ${i + 1}`,
        type: 'bathroom',
        position: { x: currentX, y: 0, z: currentZ },
        dimensions: { width: roomWidth * 0.8, length: roomLength * 0.8, height: this.ROOM_HEIGHT },
        furniture: []
      });
      
      currentX += roomWidth;
    }
    
    // Add hallway
    rooms.push({
      id: 'hallway-1',
      name: 'Hallway',
      type: 'hallway',
      position: { x: 0, y: 0, z: -2 },
      dimensions: { width: dimensions.width, length: 2, height: this.ROOM_HEIGHT },
      furniture: []
    });
    
    return rooms;
  }

  /**
   * Add furniture to rooms based on style
   */
  private static addFurniture(rooms: Room[], locationType: 'city' | 'village'): Room[] {
    return rooms.map(room => {
      const furniture: Furniture[] = [];
      
      switch (room.type) {
        case 'living':
          furniture.push(
            {
              id: 'sofa-1',
              name: 'Sofa',
              type: 'sofa',
              position: { x: room.dimensions.width * 0.2, y: 0, z: room.dimensions.length * 0.3 },
              rotation: 0,
              dimensions: { width: 2.5, length: 1, height: 0.8 }
            },
            {
              id: 'coffee-table-1',
              name: 'Coffee Table',
              type: 'table',
              position: { x: room.dimensions.width * 0.5, y: 0, z: room.dimensions.length * 0.5 },
              rotation: 0,
              dimensions: { width: 1.2, length: 0.8, height: 0.5 }
            },
            {
              id: 'tv-cabinet-1',
              name: 'TV Cabinet',
              type: 'cabinet',
              position: { x: room.dimensions.width * 0.8, y: 0, z: room.dimensions.length * 0.2 },
              rotation: 0,
              dimensions: { width: 2, length: 0.5, height: 0.6 }
            },
            {
              id: 'armchair-1',
              name: 'Armchair',
              type: 'chair',
              position: { x: room.dimensions.width * 0.7, y: 0, z: room.dimensions.length * 0.7 },
              rotation: Math.PI / 4,
              dimensions: { width: 0.8, length: 0.8, height: 0.9 }
            },
            {
              id: 'side-table-1',
              name: 'Side Table',
              type: 'table',
              position: { x: room.dimensions.width * 0.85, y: 0, z: room.dimensions.length * 0.75 },
              rotation: 0,
              dimensions: { width: 0.5, length: 0.5, height: 0.6 }
            }
          );
          break;
          
        case 'bedroom':
          furniture.push(
            {
              id: `bed-${room.id}`,
              name: 'Bed',
              type: 'bed',
              position: { x: room.dimensions.width * 0.3, y: 0, z: room.dimensions.length * 0.4 },
              rotation: 0,
              dimensions: { width: 1.6, length: 2, height: 0.6 }
            },
            {
              id: `wardrobe-${room.id}`,
              name: 'Wardrobe',
              type: 'cabinet',
              position: { x: room.dimensions.width * 0.1, y: 0, z: room.dimensions.length * 0.1 },
              rotation: 0,
              dimensions: { width: 1.5, length: 0.6, height: 2.2 }
            },
            {
              id: `nightstand-${room.id}`,
              name: 'Nightstand',
              type: 'table',
              position: { x: room.dimensions.width * 0.6, y: 0, z: room.dimensions.length * 0.3 },
              rotation: 0,
              dimensions: { width: 0.5, length: 0.4, height: 0.7 }
            },
            {
              id: `dresser-${room.id}`,
              name: 'Dresser',
              type: 'cabinet',
              position: { x: room.dimensions.width * 0.8, y: 0, z: room.dimensions.length * 0.7 },
              rotation: Math.PI / 2,
              dimensions: { width: 1.2, length: 0.5, height: 1.0 }
            }
          );
          break;
          
        case 'kitchen':
          furniture.push(
            {
              id: `counter-${room.id}`,
              name: 'Kitchen Counter',
              type: 'cabinet',
              position: { x: room.dimensions.width * 0.1, y: 0, z: room.dimensions.length * 0.2 },
              rotation: 0,
              dimensions: { width: room.dimensions.width * 0.8, length: 0.6, height: 0.9 }
            },
            {
              id: `stove-${room.id}`,
              name: 'Stove',
              type: 'appliance',
              position: { x: room.dimensions.width * 0.3, y: 0, z: room.dimensions.length * 0.25 },
              rotation: 0,
              dimensions: { width: 0.6, length: 0.6, height: 0.9 }
            },
            {
              id: `fridge-${room.id}`,
              name: 'Refrigerator',
              type: 'appliance',
              position: { x: room.dimensions.width * 0.8, y: 0, z: room.dimensions.length * 0.1 },
              rotation: 0,
              dimensions: { width: 0.7, length: 0.7, height: 1.8 }
            },
            {
              id: `sink-${room.id}`,
              name: 'Kitchen Sink',
              type: 'appliance',
              position: { x: room.dimensions.width * 0.5, y: 0, z: room.dimensions.length * 0.25 },
              rotation: 0,
              dimensions: { width: 0.8, length: 0.5, height: 0.9 }
            },
            {
              id: `island-${room.id}`,
              name: 'Kitchen Island',
              type: 'table',
              position: { x: room.dimensions.width * 0.5, y: 0, z: room.dimensions.length * 0.6 },
              rotation: 0,
              dimensions: { width: 1.5, length: 1.0, height: 0.9 }
            }
          );
          break;
          
        case 'bathroom':
          furniture.push(
            {
              id: `toilet-${room.id}`,
              name: 'Toilet',
              type: 'appliance',
              position: { x: room.dimensions.width * 0.2, y: 0, z: room.dimensions.length * 0.2 },
              rotation: 0,
              dimensions: { width: 0.4, length: 0.7, height: 0.8 }
            },
            {
              id: `sink-${room.id}`,
              name: 'Bathroom Sink',
              type: 'appliance',
              position: { x: room.dimensions.width * 0.7, y: 0, z: room.dimensions.length * 0.2 },
              rotation: 0,
              dimensions: { width: 0.6, length: 0.4, height: 0.8 }
            },
            {
              id: `shower-${room.id}`,
              name: 'Shower',
              type: 'appliance',
              position: { x: room.dimensions.width * 0.2, y: 0, z: room.dimensions.length * 0.7 },
              rotation: 0,
              dimensions: { width: 0.9, length: 0.9, height: 2.0 }
            },
            {
              id: `cabinet-${room.id}`,
              name: 'Bathroom Cabinet',
              type: 'cabinet',
              position: { x: room.dimensions.width * 0.7, y: 0, z: room.dimensions.length * 0.7 },
              rotation: 0,
              dimensions: { width: 0.6, length: 0.3, height: 1.8 }
            }
          );
          break;
          
        case 'dining':
          furniture.push(
            {
              id: `dining-table-${room.id}`,
              name: 'Dining Table',
              type: 'table',
              position: { x: room.dimensions.width * 0.5, y: 0, z: room.dimensions.length * 0.5 },
              rotation: 0,
              dimensions: { width: 1.8, length: 1.2, height: 0.75 }
            },
            {
              id: `dining-chairs-${room.id}`,
              name: 'Dining Chairs',
              type: 'chair',
              position: { x: room.dimensions.width * 0.5, y: 0, z: room.dimensions.length * 0.3 },
              rotation: 0,
              dimensions: { width: 0.5, length: 0.5, height: 0.9 }
            }
          );
          break;
      }
      
      return { ...room, furniture };
    });
  }

  /**
   * Generate camera tour waypoints for auto tour feature
   */
  static generateTourWaypoints(rooms: Room[], dimensions: { width: number; length: number; height: number }): TourWaypoint[] {
    const waypoints: TourWaypoint[] = [];
    
    // Start from outside the house
    waypoints.push({
      position: [dimensions.width / 2, dimensions.height + 5, -10],
      lookAt: [dimensions.width / 2, dimensions.height / 2, dimensions.length / 2],
      duration: 3,
      roomName: 'Exterior View'
    });
    
    // Tour through each room
    rooms.forEach(room => {
      if (room.type !== 'hallway') {
        waypoints.push({
          position: [
            room.position.x + room.dimensions.width / 2,
            room.dimensions.height / 2,
            room.position.z + room.dimensions.length / 2
          ],
          lookAt: [
            room.position.x + room.dimensions.width / 2,
            room.dimensions.height / 2,
            room.position.z + room.dimensions.length / 2
          ],
          duration: 2,
          roomName: room.name
        });
      }
    });
    
    // End tour back outside
    waypoints.push({
      position: [dimensions.width / 2, dimensions.height + 3, -8],
      lookAt: [dimensions.width / 2, dimensions.height / 2, dimensions.length / 2],
      duration: 2,
      roomName: 'Final View'
    });
    
    return waypoints;
  }
}


