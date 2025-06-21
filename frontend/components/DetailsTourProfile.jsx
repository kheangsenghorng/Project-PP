import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TourItinerary from "@/components/tour-itinerary"

// Mock tour data - in a real app, this would come from an API or database
const getTourData = (id) => {
  // This is just a mock function - in a real app, you'd fetch this data from an API
  return {
    id: Number.parseInt(id),
    name: "Mountain Trek Adventure",
    description:
      "Experience the breathtaking beauty of the Swiss Alps on this 5-day mountain trek adventure. Perfect for nature lovers and hiking enthusiasts.",
    location: "Swiss Alps",
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    guests: 2,
    image: "/placeholder.svg?height=400&width=800",
    status: "upcoming",
    price: 1299,
    includes: [
      "Professional guide",
      "All accommodations",
      "Meals as specified in the itinerary",
      "Transportation during the tour",
      "All activities and entrance fees",
      "Emergency support",
    ],
    excludes: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Optional activities not in the itinerary",
      "Gratuities",
    ],
  }
}

export default function TourDetailPage({ params }) {
  const tour = getTourData(params.id)

  const formatDateRange = (startDate, endDate) => {
    const options = { month: "long", day: "numeric", year: "numeric" }
    return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`
  }

  const getTourDuration = (startDate, endDate) => {
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} days`
  }

  const getDaysUntilStart = (startDate) => {
    const today = new Date()
    const diffTime = startDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/bookings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{tour.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="relative rounded-lg overflow-hidden">
            <img src={tour.image || "/placeholder.svg"} alt={tour.name} className="w-full h-[300px] object-cover" />
            <Badge
              className="absolute right-4 top-4"
              variant={getDaysUntilStart(tour.startDate) <= 1 ? "destructive" : "secondary"}
            >
              {getDaysUntilStart(tour.startDate) <= 0
                ? "Today"
                : getDaysUntilStart(tour.startDate) === 1
                  ? "Tomorrow"
                  : `In ${getDaysUntilStart(tour.startDate)} days`}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <CalendarDays className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Start Date</span>
              <span className="text-xs text-muted-foreground">{tour.startDate.toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <Clock className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Duration</span>
              <span className="text-xs text-muted-foreground">{getTourDuration(tour.startDate, tour.endDate)}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <MapPin className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Location</span>
              <span className="text-xs text-muted-foreground">{tour.location}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
              <Users className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Guests</span>
              <span className="text-xs text-muted-foreground">{tour.guests} people</span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tour Overview</CardTitle>
                  <CardDescription>{formatDateRange(tour.startDate, tour.endDate)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{tour.description}</p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-medium">What's Included</h4>
                      <ul className="space-y-1">
                        {tour.includes.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">What's Not Included</h4>
                      <ul className="space-y-1">
                        {tour.excludes.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-destructive"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itinerary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tour Itinerary</CardTitle>
                  <CardDescription>
                    Day-by-day schedule for your {getTourDuration(tour.startDate, tour.endDate)} tour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading itinerary...</div>}>
                    <TourItinerary tourId={tour.id} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Important information about your booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Booking Reference</h4>
                      <p className="text-sm text-muted-foreground">
                        TOUR-{tour.id}-{new Date().getFullYear()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Payment Status</h4>
                      <Badge variant="outline" className="text-xs">
                        Paid in Full
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Meeting Point</h4>
                      <p className="text-sm text-muted-foreground">Central Station, 8:00 AM</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Tour Guide</h4>
                      <p className="text-sm text-muted-foreground">John Smith (Contact: +1234567890)</p>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 font-medium">Important Notes</h4>
                    <ul className="space-y-2 text-sm">
                      <li>Please arrive 15 minutes before the scheduled departure time.</li>
                      <li>Bring comfortable walking shoes and weather-appropriate clothing.</li>
                      <li>Don't forget your camera, water bottle, and any personal medications.</li>
                      <li>Emergency contact: +1234567890 (available 24/7)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Your tour package details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Tour Package</span>
                <span>${tour.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Guests</span>
                <span>
                  {tour.guests} × ${tour.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Taxes & Fees</span>
                <span>${Math.round(tour.price * tour.guests * 0.1)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${tour.price * tour.guests + Math.round(tour.price * tour.guests * 0.1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Contact our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">Contact Support</Button>
              <Button variant="outline" className="w-full">
                Download Itinerary
              </Button>
              <Button variant="outline" className="w-full">
                Cancel Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

