/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#08080A",
                secondary: "#0E0E11",
                accent: "#22c55e", // Green-500
                brandPurple: "#a855f7", // Purple-500
                muted: "#94A3B8",
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
