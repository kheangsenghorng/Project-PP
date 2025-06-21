import React from 'react';
import { Pencil } from 'lucide-react'; // Make sure to install it

export default function Itinerary() {
  const itinerary = [
    {
      date: '17 Feb 2025',
      title: 'Arrival and City Orientation',
      description: 'Explore Wat Phnom, the Royal Palace, and the Silver Pagoda, then enjoy an evening stroll along the Riverside.',
      isCompleted: true,
    },
    {
      date: '18 Feb 2025',
      title: 'Historical and Cultural Insights',
      description: 'Visit Tuol Sleng Genocide Museum and Choeung Ek Killing Fields for a somber look at Cambodia\'s history, followed by shopping at the Russian Market.',
      isCompleted: false,
    },
    {
      date: '19 Feb 2025',
      title: 'Mekong River Adventure',
      description: 'Take a day trip to Koh Dach (Silk Island) to experience village life, silk weaving, and a relaxing Mekong sunset cruise.',
      isCompleted: false,
    },
    {
      date: '19 Feb 2025',
      title: 'Mekong River Adventure',
      description: 'Take a day trip to Koh Dach (Silk Island) to experience village life, silk weaving, and a relaxing Mekong sunset cruise.',
      isCompleted: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Itinerary</h3>
        <div className="flex items-center gap-2 text-blue-500 text-sm">
          <Pencil className="w-4 h-4" />
          <span>Phnom Penh - Kompot</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-gray-300 border-dotted border-l-2 border-gray-300" />

        {/* Timeline Steps */}
        <div className="flex flex-col space-y-10 ml-10">
          {itinerary.map((item, index) => (
            <div key={index} className="relative">
              {/* Circle */}
              <div className="absolute -left-10 top-0 flex items-center justify-center w-8 h-8 rounded-full 
                text-sm font-bold
                z-10
                bg-white border-2
                border-gray-300
                text-gray-600
                "
              >
                {item.isCompleted ? (
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white text-sm">
                    ✓
                  </div>
                ) : (
                  <span>{String(index + 1).padStart(2, '0')}</span>
                )}
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 mb-1">{item.date}</p>

              {/* Title */}
              <h4 className="font-semibold text-gray-800">{item.title}</h4>

              {/* Description */}
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
