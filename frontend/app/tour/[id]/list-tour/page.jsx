"use client";

import Carousel from "@/components/Carousal";
import SearchTour from "@/components/SearchTour";
import SearchLocation from "@/components/SearchLocation";
import TourList from "@/components/TourList";
import FilterSidebar from "@/components/FilterSidebar";
import { useParams } from "next/navigation";

export default function PageTour() {
  const param = useParams();
  return (
    <div>
      <Carousel />
      <SearchTour />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
         
          <FilterSidebar />
        </div>

        <div className="col-span-3">
          <TourList id={param.id} />
        </div>
      </div>
    </div>
  );
}
