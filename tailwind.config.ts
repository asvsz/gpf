import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-green': '#2A5C4E', // Adicione suas cores aqui
        'custom-light-green': '#6EA85E',
        'custom-yellow': '#E6B52B',
      },
    },
  },
  plugins: [],
};
export default config;
