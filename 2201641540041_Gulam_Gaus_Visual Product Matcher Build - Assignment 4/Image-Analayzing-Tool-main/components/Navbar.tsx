"use client";

import { useTheme } from "next-themes";
import { Package, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="w-full bg-gray-900 dark:bg-white py-4 px-6 flex items-center justify-between shadow-md transition-colors duration-300">
      {/* Left (Logo Icon) */}
      <div className="flex items-center gap-2">
        <Package className="text-yellow-400 w-7 h-7" />
      </div>

      {/* Center (Animated Title) */}
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xl font-bold tracking-tight text-white dark:text-gray-900 text-center"
      >
        Visual Product Matcher
      </motion.span>

      {/* Right (Admin + Theme Toggle) */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="text-sm text-yellow-400 hover:text-yellow-300 transition"
        >
          View All Matches
        </Link>

        {/* Dark/Light Mode Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-800 dark:bg-gray-200 transition"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
