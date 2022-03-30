import { theme as baseTheme } from '@chakra-ui/theme'

export const colors = {
  ...baseTheme.colors,
  brand: baseTheme.colors.teal
}

export const theme = {
  ...baseTheme,
  colors
}
