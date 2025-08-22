import { NextRequest, NextResponse } from 'next/server';
import { HouseGenerator } from '@/services/houseGenerator';
import { HouseFormData } from '@/types/house';

export async function POST(request: NextRequest) {
  console.log('API route called');
  try {
    const formData: HouseFormData = await request.json();
    console.log('Form data received:', formData);

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

    // Return simple JSON response
    const response = {
      success: true,
      layout,
      tourWaypoints
    };
    console.log('Sending response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating house:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate house' },
      { status: 500 }
    );
  }
}
