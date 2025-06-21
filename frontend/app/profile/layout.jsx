"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavsidePRofile from "@/components/NavsideProfile";
import { useParams } from "next/navigation";

const ProfileLayout = ({ children }) => {
  const { id } = useParams();

  return (
    <div className="">
      <Navbar id={id} />
      <NavsidePRofile> {children}</NavsidePRofile>
      <Footer />
    </div>
  );
};

export default ProfileLayout;
