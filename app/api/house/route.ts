import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'House API is working' });
}

export async function POST() {
  // Simple test house data
  const testLayout = {
    width: 20,
    length: 30,
    height: 3,
    floors: 1,
    rooms: [
      {
        id: 'living-1',
        name: 'Living Room',
        type: 'living',
        position: { x: 0, y: 0, z: 0 },
        dimensions: { width: 8, length: 6, height: 3 },
        furniture: []
      },
      {
        id: 'bedroom-1',
        name: 'Bedroom 1',
        type: 'bedroom',
        position: { x: 8, y: 0, z: 0 },
        dimensions: { width: 6, length: 4, height: 3 },
        furniture: []
      }
    ],
    style: 'modern'
  };

  const testTourWaypoints = [
    {
      position: [10, 5, -10],
      lookAt: [10, 1.5, 15],
      duration: 3,
      roomName: 'Exterior View'
    }
  ];

  return NextResponse.json({
    success: true,
    layout: testLayout,
    tourWaypoints: testTourWaypoints
  });
}
