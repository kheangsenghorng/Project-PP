"use client"; // eslint-disable-line

import Image from "next/image";
import TeamMember from "@/components/TeamMember";
import TravelSection from "@/components/TravelSection";
import { useParams } from "next/navigation";

export default function Home() {
  const { id } = useParams();
  const teamMembers = [
    {
      name: "Phon Sophana",
      image: "/placeholder.svg?height=200&width=200",
      socials: ["facebook", "twitter", "instagram"],
    },
    {
      name: "Chan Sreynet",
      image: "/placeholder.svg?height=200&width=200",
      socials: ["facebook", "twitter", "instagram"],
    },
    {
      name: "Kheang Senghong",
      image: "/image/about-image-4.png",
      socials: ["facebook", "twitter", "instagram"],
    },
    {
      name: "Phon Langheang",
      image: "/placeholder.svg?height=200&width=200",
      socials: ["facebook", "twitter", "instagram"],
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="py-4 px-6 text-center border-b">
        <h1 className="text-xl font-semibold">About Us</h1>
      </header>

      {/* Green Banner Section */}
      <section className="bg-green-700 text-white py-12 px-6 flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-400 flex items-center justify-center overflow-hidden border-4 border-blue-500">
          <Image
            src="/image/about-image-1.png"
            alt="Light bulb with plant"
            width={150}
            height={150}
            className="object-cover"
          />
        </div>
        <div className="max-w-md text-center md:text-left">
          <p className="text-sm md:text-base">
            Helping users make informed decisions while supporting media
            providers by giving them a platform to showcase their expertise.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-sm">
              Our mission is simple: to provide a seamless experience for users
              to search, compare, and choose the best services based on genuine
              user experiences and expert recommendations. We believe in
              creating a platform that connects users with providers while
              supporting service providers by giving them a platform to showcase
              their expertise.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
                src="/image/about-image-2.png"
              alt="Illustration"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Second Info Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center order-2 md:order-1">
            <Image
              src="/image/about-image-3.png"
              alt="Gear illustration"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="space-y-4 order-1 md:order-2">
            <p className="text-sm">
              At Travel With Us, we aim to make finding the perfect travel
              experiences easy and enjoyable. Our platform is designed to be
              user-friendly, transparent, and platform-ready to make range of
              service categories to meet all your travel needs, all while you
              enjoy a straightforward journey, every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Our team member
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Travel and Partner Sections */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <TravelSection
            title="Travel With Us"
            image="/placeholder.svg?height=300&width=300"
            description="No matter who you are or where you're headed, Travel With Us helps make it one of a lifetime. Find the perfect trip that suits your needs, and let us take care of the rest. Your worry-free travel awaits."
          />
          <TravelSection
            title="Partner With Us"
            image="/placeholder.svg?height=300&width=300"
            description="At Travel With Us, we connect partners of all sizes to a world of travelers, including agents to data, tools, and technology that help them manage their business and help build their business."
          />
        </div>
      </section>
    </main>
  );
}
