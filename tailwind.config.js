const defaultConfig = require('tailwindcss/stubs/defaultConfig.stub')

/**@type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
    mode: 'jit',
    important: false,
    purge: [
        './pages/**/*.{js,jsx,ts,tsx,scss,sass,css}',
        './components/**/*.{js,jsx,ts,tsx,scss,sass,css}',
        './styles/**/*.{scss,sass,css}',
    ],
    darkMode: false,
    theme: {
        extend: {},
        colors: {
            primary: '#00ffff',
            'primary-dark': '#306778',
            ...defaultConfig.theme.colors,
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('tailwindcss-children')],
}
module.exports = config
