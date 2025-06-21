import Carousel from "@/components/Carousal";
import SearchTour from "@/components/SearchTour";
// import SearchLocation from "@/components/SearchLocation";
import TourList from "@/components/TourList";
import FilterSidebar from "@/components/FilterSidebar";
import { Suspense } from "react";

export default function PageTour() {
  return (
    <div>
      <Carousel />
      <Suspense fallback={<div>Loading Search...</div>}>
        <SearchTour />
      </Suspense>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <FilterSidebar />
        </div>
        <div className="col-span-3">
          <TourList />
        </div>
      </div>
    </div>
  );
}
