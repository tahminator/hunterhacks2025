import { createTheme, rem, MantineColorsTuple } from '@mantine/core'

/**
 * Defines the shades for the primary green
 * Base Color: Index 8
 */
const olivine: MantineColorsTuple = [
  '#fbfdec',
  '#f5fbd8',
  '#ebf7ab',
  '#e0f37a',
  '#d0ed3d',
  '#cdec32',
  '#718f10',
  '#55630d',
  '#253603',
  '#182902',
]

/**
 * Defines the shades for the neon Green
 * Base Color: Index 6
 */
const neonGreen: MantineColorsTuple = [
  '#fefee4',
  '#fbfdd0',
  '#f7f9a1',
  '#f2f66f',
  '#eff345',
  '#ecf22c',
  '#D4DA0D',
  '#ebf11c',
  '#b9be00',
  '#94B000',
]

/**

 * Defines the shades for the background off white
 * Base Color: Index 0
 */
const offWhite: MantineColorsTuple = [
  '#fdf4ed',
  '#f7e7d9',
  '#f1ccad',
  '#ebb07c',
  '#e79853',
  '#e4883a',
  '#e4802c',
  '#ca6e20',
  '#b4611a',
  '#9d5311',
]

/**
 * Defines the theming for Mantine & text scaling based off
 * viewport size breakpoints
 *
 * ---
 * Font Styling
 * ---
 * Heading Font: Inter
 * Weights: Regular (400), Bold (700)
 *
 * Text Font: Instrument Sans
 * Weights: Regular (400), Bold (700)
 *
 * ---
 * Other
 * ---
 * standardBorderRadius - The border radius to be
 *  used across cards, etc.
 */
export const AppTheme = createTheme({
  colors: {
    neonGreen,
    offWhite,
    olivine,
  },
  primaryColor: 'neonGreen',
  headings: {
    fontWeight: '700',
    fontFamily: 'Inter, sans-serif',

    sizes: {
      h1: {
        fontSize: rem(28),
        lineHeight: rem(32),
      },
      h2: {
        fontSize: rem(20),
        lineHeight: rem(22),
      },
    },
  },
  fontFamily: 'Instrument Sans, sans-serif',
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16), // Body text size
    lg: rem(20),
    xl: rem(24),
  },
})

export const appHeight = '600px'
export const appWidth = '350px'
