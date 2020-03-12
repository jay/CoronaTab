module.exports = {
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1440px',
      '3xl': '1920px',
      '4xl': '2260px'
    },
    container: {
      padding: '1rem'
    },
    fontFamily: {
      main: [
        'Hanken Grotesk',
        'system-ui',
        'BlinkMacSystemFont',
        '-apple-system',
        'Helvetica Neue',
        'sans-serif'
      ],
      monospace: [
        'monaco',
        'Consolas',
        'Lucida Console',
        'monospace'
      ]
    },
    colors: {
      transparent: 'transparent',
      black: '#000000',
      success: '#00F2A9',
      fail: '#fd5c63',
      white: '#FFFFFF'
    },
    fill: theme => ({
      current: 'currentColor',
      ...theme('colors')
    }),
    borderRadius: {
      none: '0',
      xs: '.2rem',
      sm: '.5rem',
      default: '.8rem',
      lg: '1rem',
      xl: '1.5rem',
      full: '9999px'
    },
    letterSpacing: {
      tight: '-.005em',
      normal: '0',
      wide: '.1em'
    },
    extend: {
      height: {
        'line-sm': '0.66em',
        line: '1em',
        'line-lg': '1.5em',
        'line-xl': '2em',
        'line-2xl': '3em'
      },
      width: {
        'line-sm': '0.66em',
        line: '1em',
        'line-lg': '1.5em',
        'line-xl': '2em',
        'line-2xl': '3em'
      }
    }
  },
  plugins: [],
  variants: {
    backgroundImage: ['responsive'],
    opacity: ['responsive', 'hover']
  }
}
