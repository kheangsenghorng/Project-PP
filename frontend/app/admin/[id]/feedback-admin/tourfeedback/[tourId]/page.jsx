"use client";

import TourBooking from "@/components/tour-booking";
import { useParams } from "next/navigation";


export default function Home() {
  const { tourId } = useParams();
  const { id } = useParams();
  const { userId } = useParams();
  return (
    <div className="container mx-auto py-8">
      <TourBooking id={id} tourId={tourId} />
    </div>
  );
}
