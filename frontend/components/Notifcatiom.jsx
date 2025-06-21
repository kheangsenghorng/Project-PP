"use client"

import { useState, useEffect } from "react"
import { Bell, Calendar, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "upcoming",
    title: "Mountain Trek Tour starts tomorrow!",
    description: "Your tour starts at 8:00 AM. Don't forget to pack warm clothes!",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 2,
    type: "reminder",
    title: "City Explorer Tour in 3 days",
    description: "Get ready for your urban adventure. Meeting point: Central Station.",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Beach Resort booking confirmed",
    description: "Your booking for 2 guests on June 15 has been confirmed.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
]

export default function TourNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications)

  // Simulate receiving a new notification
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotification = {
        id: 4,
        type: "upcoming",
        title: "Wildlife Safari starts in 2 days!",
        description: "Final reminder for your safari tour. Check-in time: 7:30 AM.",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const getIcon = (type) => {
    switch (type) {
      case "upcoming":
        return <Bell className="h-4 w-4" />
      case "reminder":
        return <Calendar className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertVariant = (type) => {
    switch (type) {
      case "upcoming":
        return "destructive"
      case "reminder":
        return "default"
      case "info":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-muted-foreground">No notifications</p>
      ) : (
        notifications.map((notification) => (
          <Alert
            key={notification.id}
            variant={notification.read ? "outline" : getAlertVariant(notification.type)}
            className={cn("transition-all", notification.read ? "opacity-70" : "opacity-100")}
          >
            <div className="flex items-start gap-2">
              {getIcon(notification.type)}
              <div className="flex-1">
                <AlertTitle className="font-semibold">{notification.title}</AlertTitle>
                <AlertDescription className="mt-1 text-sm">{notification.description}</AlertDescription>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{notification.date.toLocaleDateString()}</span>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-7 px-2 text-xs"
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Alert>
        ))
      )}
    </div>
  )
}

