import React from "react";
import { motion } from "framer-motion";
import skylineImage from "./assets/nyc-skyline.png";

export default function FrontPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${skylineImage})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* CBRE Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center p-8 rounded-2xl bg-black bg-opacity-40 backdrop-blur-md shadow-lg"
      >
        <h1 className="text-7xl font-extrabold text-green-500 tracking-widest">
          CBRE
        </h1>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-gray-300">
        © 2025 CBRE
      </footer>
    </div>
  );
}
