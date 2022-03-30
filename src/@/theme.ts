import { theme as baseTheme } from '@chakra-ui/theme'

export const colors = {
  ...baseTheme.colors,
  brand: baseTheme.colors.teal,
  teal: {
    ...baseTheme.colors.teal,
    hue: 200
  }
}

export const theme = {
  ...baseTheme,
  colors
}
export function hsl(hue: number, saturation: number, lightness: number) {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}