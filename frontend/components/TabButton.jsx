"use client"

import { Building2, Users } from "lucide-react"

export default function TabButton({ label, icon, active, onClick }) {
  const getIcon = () => {
    switch (icon) {
      case "building":
        return <Building2 size={16} />
      case "users":
        return <Users size={16} />
      default:
        return null
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
        active ? "bg-gray-800 text-white" : "bg-white border border-gray-300 text-gray-800"
      }`}
    >
      {getIcon()}
      <span>{label}</span>
    </button>
  )
}

