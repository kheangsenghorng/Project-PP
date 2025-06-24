"use client";

import { motion } from "framer-motion";
import { Plane, Globe, Camera, Star } from "lucide-react";

export default function TourCreatorLoading({
  message = "Loading your tour creator...",
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      <motion.div
        className="flex flex-col items-center space-y-10 p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Main Loading Animation - Orbiting Elements */}
        <div className="relative w-32 h-32">
          {/* Central Hub */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Orbiting Elements */}
          {[
            { icon: Plane, color: "from-green-500 to-emerald-500", delay: 0 },
            { icon: Camera, color: "from-teal-500 to-cyan-500", delay: 2 },
            { icon: Star, color: "from-lime-500 to-green-500", delay: 4 },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: item.delay,
              }}
            >
              <motion.div
                className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: item.delay,
                }}
              >
                <item.icon className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>
          ))}

          {/* Pulsing Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-200"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {message}
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-sm text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Crafting your perfect adventure experience
          </motion.p>
        </motion.div>

        {/* Animated Progress Bar */}
        <motion.div
          className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 256 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-3 gap-4 mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {[
            { label: "Destinations", icon: Globe },
            { label: "Experiences", icon: Camera },
            { label: "Memories", icon: Star },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-300 rounded-full opacity-40"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3 + i,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
