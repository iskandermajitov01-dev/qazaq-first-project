/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          mint: "#34d399",
          rose: "#fb7185",
          bean: "#1f2937",
          cream: "#f8fafc",
          blush: "#fff1f2",
          500: "#34d399",
          600: "#22c55e",
        },
      },
      boxShadow: {
        neon: "0 0 30px rgba(56, 189, 248, 0.2)",
        puffy: "0 10px 30px rgba(31, 41, 55, 0.12)",
      },
    },
  },
  plugins: [],
};
