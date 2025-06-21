import Image from "next/image"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function TeamMember({ member }) {
  const { name, image, socials } = member

  const getSocialIcon = (social) => {
    switch (social) {
      case "facebook":
        return <Facebook size={16} className="text-blue-600" />
      case "twitter":
        return <Twitter size={16} className="text-blue-400" />
      case "instagram":
        return <Instagram size={16} className="text-pink-600" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 overflow-hidden rounded-lg">
        <Image src={image || "/placeholder.svg"} alt={name} width={200} height={200} className="object-cover" />
      </div>
      <h3 className="font-medium text-center mb-2">{name}</h3>
      <div className="flex space-x-2 mt-2">
        {socials.map((social, index) => (
          <div key={index} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            {getSocialIcon(social)}
          </div>
        ))}
      </div>
    </div>
  )
}

