/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1020",
        surface: "#121A2F",
        card: "#172036",
        borderSubtle: "rgba(255,255,255,0.06)",
        textPrimary: "#F3F4F6",
        textSecondary: "#94A3B8",
        p1: "#EF4444",
        p2: "#F59E0B",
        p3: "#3B82F6",
        resolved: "#10B981",
        accentGlow: "#06b6d4",
      },
    },
  },
  plugins: [],
}
