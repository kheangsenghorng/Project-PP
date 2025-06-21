"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";

const TourLayout = ({ children }) => {
  // past id to navbar
  const { id } = useParams();

  console.log(id);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar id={id} />
      <main className="mb-4">{children}</main>
      <Footer />
    </div>
  );
};

export default TourLayout;
