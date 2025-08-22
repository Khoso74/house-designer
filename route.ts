import { NextRequest, NextResponse } from 'next/server';
import { HouseGenerator } from '@/services/houseGenerator';
import { HouseFormData } from '@/types/house';

export async function POST(request: NextRequest) {
  try {
    const formData: HouseFormData = await request.json();

    // Validate form data
    if (!formData.plotSize || !formData.houseType || !formData.locationType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate house layout
    const layout = HouseGenerator.generateHouse(formData);

    // Generate tour waypoints
    const tourWaypoints = HouseGenerator.generateTourWaypoints(layout.rooms, {
      width: layout.width,
      length: layout.length,
      height: layout.height
    });

    return NextResponse.json({
      success: true,
      layout,
      tourWaypoints
    });

  } catch (error) {
    console.error('Error generating house:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate house' },
      { status: 500 }
    );
  }
}
