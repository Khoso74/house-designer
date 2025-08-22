import { NextResponse } from 'next/server';
import { HouseGenerator } from '@/services/houseGenerator';
import { HouseFormData } from '@/types/house';

export async function GET() {
  return NextResponse.json({ message: 'House API is working' });
}

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate required fields
    const formData: HouseFormData = {
      plotSize: body.plotSize || '20x30',
      houseType: body.houseType || 'single',
      bedrooms: parseInt(body.bedrooms) || 2,
      bathrooms: parseInt(body.bathrooms) || 1,
      kitchens: parseInt(body.kitchens) || 1,
      locationType: body.locationType || 'city',
      extraNotes: body.extraNotes || ''
    };

    // Validate form data
    if (!formData.plotSize.trim()) {
      return NextResponse.json(
        { success: false, error: 'Plot size is required' },
        { status: 400 }
      );
    }

    if (formData.bedrooms < 1 || formData.bedrooms > 10) {
      return NextResponse.json(
        { success: false, error: 'Bedrooms must be between 1 and 10' },
        { status: 400 }
      );
    }

    if (formData.bathrooms < 1 || formData.bathrooms > 5) {
      return NextResponse.json(
        { success: false, error: 'Bathrooms must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (formData.kitchens < 1 || formData.kitchens > 3) {
      return NextResponse.json(
        { success: false, error: 'Kitchens must be between 1 and 3' },
        { status: 400 }
      );
    }

    // Generate house layout using the HouseGenerator service
    const houseLayout = HouseGenerator.generateHouse(formData);
    
    // Generate tour waypoints
    const tourWaypoints = HouseGenerator.generateTourWaypoints(
      houseLayout.rooms, 
      {
        width: houseLayout.width,
        length: houseLayout.length,
        height: houseLayout.height
      }
    );

    const response = {
      success: true,
      layout: houseLayout,
      tourWaypoints: tourWaypoints
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
