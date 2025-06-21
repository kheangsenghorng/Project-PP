"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

// Mock itinerary data
const getMockItinerary = (tourId) => {
  // In a real app, this would be fetched from an API based on the tourId
  return [
    {
      day: 1,
      title: "Arrival & Welcome",
      description:
        "Arrive at the destination, check into your accommodation, and attend a welcome dinner to meet your fellow travelers and tour guide.",
      activities: ["Airport transfer", "Hotel check-in", "Welcome dinner"],
      location: "Base Camp Hotel",
    },
    {
      day: 2,
      title: "Mountain Exploration",
      description:
        "Begin your adventure with a guided hike through scenic mountain trails, enjoying panoramic views and learning about local flora and fauna.",
      activities: ["Guided hiking tour", "Picnic lunch", "Photography session"],
      location: "Alpine Trails",
    },
    {
      day: 3,
      title: "Cultural Experience",
      description:
        "Immerse yourself in local culture with visits to traditional villages, craft workshops, and a chance to sample authentic regional cuisine.",
      activities: ["Village tour", "Craft workshop", "Traditional dinner"],
      location: "Mountain Village",
    },
    {
      day: 4,
      title: "Adventure Day",
      description:
        "Challenge yourself with thrilling activities such as zip-lining, rock climbing, or white-water rafting, depending on the season and weather conditions.",
      activities: ["Adventure activities", "Packed lunch", "Evening relaxation"],
      location: "Adventure Center",
    },
    {
      day: 5,
      title: "Departure Day",
      description:
        "Enjoy a leisurely breakfast, check out of your accommodation, and transfer to the airport for your departure flight.",
      activities: ["Breakfast", "Hotel check-out", "Airport transfer"],
      location: "Base Camp Hotel",
    },
  ]
}

export default function TourItinerary({ tourId }) {
  const [itinerary] = useState(getMockItinerary(tourId))

  return (
    <div className="space-y-6">
      {itinerary.map((day) => (
        <div key={day.day} className="relative border-l pl-6 pb-6">
          <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {day.day}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Day {day.day}: {day.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{day.location}</span>
            </div>
            <p className="text-sm">{day.description}</p>
            <div className="mt-2">
              <h4 className="text-sm font-medium">Activities:</h4>
              <ul className="mt-1 space-y-1">
                {day.activities.map((activity, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

