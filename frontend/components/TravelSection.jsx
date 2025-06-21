import Image from "next/image"

export default function TravelSection({ title, image, description }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 overflow-hidden rounded-full w-64 h-64">
        <Image src={image || "/placeholder.svg"} alt={title} width={300} height={300} className="object-cover" />
      </div>
      <h3 className="font-medium text-center text-green-700 mb-4">{title}</h3>
      <p className="text-sm text-center">{description}</p>
    </div>
  )
}

