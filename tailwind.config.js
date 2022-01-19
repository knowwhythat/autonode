const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const selectorParser = require('postcss-selector-parser')

module.exports = {
  purge: ['./src/renderer/src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: colors.blue['500'],
        secondary: colors.blue['400'],
        accent: colors.gray['900'],
        gray: colors.gray,
        orange: colors.orange,
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
    },
  },
  plugins: [
    plugin(function ({ addVariant, prefix, e }) {
      addVariant('dark', ({ modifySelectors, separator }) => {
        modifySelectors(({ selector }) => {
          return selectorParser(selectors => {
            selectors.walkClasses(sel => {
              sel.value = `dark${separator}${sel.value}`
              sel.parent.insertBefore(sel, selectorParser().astSync(prefix('.dark-mode ')))
            })
          }).processSync(selector)
        })
      })
    }),
  ],
}
