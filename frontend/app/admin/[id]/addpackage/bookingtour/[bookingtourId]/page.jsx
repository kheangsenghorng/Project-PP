"use client";

import React from "react";
import TourDetails from "@/components/ATourDetails";
import GuestTable from "@/components/GuestTable";
import AdditionalInfo from "@/components/AdditionalInfo";
import TourItinerary from "@/components/touritinerares";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, Calendar, Info, Map } from "lucide-react";

export default function App() {
  const { bookingtourId } = useParams();
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4 lg:p-6">
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-12 gap-6">
        {/* Main Content - Left Side (8 columns) */}
        <div className="col-span-8 space-y-6">
          <Card className="overflow-hidden border-0 shadow-md rounded-xl">
            <TourDetails bookingtourId={bookingtourId} id={id} />
          </Card>

          <Card className="overflow-hidden border-0 shadow-md rounded-xl">
            <GuestTable bookingtourId={bookingtourId} id={id} />
          </Card>
        </div>

        {/* Sidebar - Right Side (4 columns) */}
        <div className="col-span-4 space-y-6">
          <Card className="overflow-hidden border-0 shadow-md rounded-xl">
            <TourItinerary bookingtourId={bookingtourId} id={id} />
          </Card>

          <Card className="overflow-hidden border-0 shadow-md rounded-xl">
            <AdditionalInfo />
          </Card>
        </div>
      </div>

      {/* Mobile/Tablet Layout with Tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Guests</span>
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Itinerary</span>
            </TabsTrigger>
            <TabsTrigger value="additional" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0">
            <Card className="overflow-hidden border-0 shadow-md rounded-xl">
              <TourDetails bookingtourId={bookingtourId} id={id} />
            </Card>
          </TabsContent>

          <TabsContent value="guests" className="mt-0">
            <Card className="overflow-hidden border-0 shadow-md rounded-xl">
              <GuestTable />
            </Card>
          </TabsContent>

          <TabsContent value="itinerary" className="mt-0">
            <Card className="overflow-hidden border-0 shadow-md rounded-xl">
              <TourItinerary bookingtourId={bookingtourId} id={id} />
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="mt-0">
            <Card className="overflow-hidden border-0 shadow-md rounded-xl">
              <AdditionalInfo />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
