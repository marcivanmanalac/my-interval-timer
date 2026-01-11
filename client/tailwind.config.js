/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-dark': '#0f172a',
                'brand-primary': '#3b82f6',
                'brand-accent': '#f43f5e',
            }
        },
    },
    plugins: [],
}
