"use client";

import Gallery from "@/components/Gallery";
import Exlpore from "@/components/Explore";
import PhnomPenhTour from "@/components/PhnomPenhTour";
import BookingForm from "@/components/BookingForm";
import CardRoomType from "@/components/CardRoomType";
import Reviews from "@/components/Reviews";
import { useParams } from "next/navigation";
export default function PageTour() {
  const { tourId } = useParams();
  return (
    <div className="w-[1200px] mx-auto relative">
      <Gallery tourId={tourId} />
      <Exlpore />
      <div className="flex justify-between mx-auto w-[1200px]">
        <div className="w-[800px]">
          <PhnomPenhTour />
          <CardRoomType />
          <Reviews />
        </div>
        <div className="w-[500px] sticky top-20 h-screen overflow-y-auto">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
