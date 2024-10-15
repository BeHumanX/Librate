/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1B335E',
                primaryLight: '#2A4A8A',
                primaryDark: '#0D1C33',
                default: '#929DC2',
                cardDark: '#CCCEDA',
                background: '#E8E9EC',
                backgroundDark: '#AEB2C4',
            },
            fontFamily: {
                sans: ['Monofonto', 'sans-serif'],
                monofonto: ['Monofonto', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
