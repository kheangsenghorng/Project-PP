import SearchTour from "@/components/Search";
import Banner from "@/components/BannerHotel";
import Navbar from "@/components/Navbar";
import Carousal from "@/components/Carousal";
import Footer from "@/components/Footer";
import CardTour from "@/components/CardTour";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Carousal />
      <SearchTour />
      <Banner />
      <CardTour />
      <Footer />
    </div>
  );
}
