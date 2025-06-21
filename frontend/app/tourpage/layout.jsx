import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TourLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main  className="mb-4" >{children}</main>
      <Footer />
    </div>
  );
};

export default TourLayout;
