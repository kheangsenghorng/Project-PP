"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock bookings data
const mockBookings = [
  {
    id: 1,
    name: "Mountain Trek Adventure",
    location: "Swiss Alps",
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    guests: 2,
    image: "/placeholder.svg?height=150&width=300",
    status: "upcoming",
  },
  {
    id: 2,
    name: "City Explorer Tour",
    location: "Paris, France",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    guests: 4,
    image: "/placeholder.svg?height=150&width=300",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Beach Resort Getaway",
    location: "Maldives",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    guests: 2,
    image: "/placeholder.svg?height=150&width=300",
    status: "completed",
  },
  {
    id: 4,
    name: "Historical City Tour",
    location: "Rome, Italy",
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    guests: 3,
    image: "/placeholder.svg?height=150&width=300",
    status: "completed",
  },
]

export default function BookingsList() {
  const [bookings] = useState(mockBookings)

  const formatDateRange = (startDate, endDate) => {
    const options = { month: "short", day: "numeric", year: "numeric" }
    return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`
  }

  const getTourDuration = (startDate, endDate) => {
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} days`
  }

  const upcomingBookings = bookings.filter((booking) => booking.status === "upcoming")
  const completedBookings = bookings.filter((booking) => booking.status === "completed")

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-2">
        <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-6">
        {upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No upcoming bookings</p>
            </CardContent>
          </Card>
        ) : (
          upcomingBookings.map((booking) => (
            <Card key={booking.id}>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="relative">
                  <img
                    src={booking.image || "/placeholder.svg"}
                    alt={booking.name}
                    className="h-full w-full object-cover"
                  />
                  <Badge className="absolute right-2 top-2" variant="secondary">
                    Upcoming
                  </Badge>
                </div>
                <div className="col-span-3 p-6">
                  <h3 className="text-2xl font-semibold">{booking.name}</h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      <span>{formatDateRange(booking.startDate, booking.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{getTourDuration(booking.startDate, booking.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href={`/tours/${booking.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline">Download Itinerary</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-6">
        {completedBookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No completed bookings</p>
            </CardContent>
          </Card>
        ) : (
          completedBookings.map((booking) => (
            <Card key={booking.id} className="opacity-80">
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="relative">
                  <img
                    src={booking.image || "/placeholder.svg"}
                    alt={booking.name}
                    className="h-full w-full object-cover grayscale"
                  />
                  <Badge className="absolute right-2 top-2" variant="outline">
                    Completed
                  </Badge>
                </div>
                <div className="col-span-3 p-6">
                  <h3 className="text-2xl font-semibold">{booking.name}</h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      <span>{formatDateRange(booking.startDate, booking.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{getTourDuration(booking.startDate, booking.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="outline" asChild>
                      <Link href={`/tours/${booking.id}`}>View Details</Link>
                    </Button>
                    <Button variant="secondary">Write a Review</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}

