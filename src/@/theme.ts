import { createTheme } from '@mui/material'
import * as muiColors from '@mui/material/colors'

const mode = 'dark'
export const theme = createTheme({
  palette: {
    mode,
    background: mode === 'dark'
      ? {
        default: 'hsl(200, 70%, 15%)'
      }
      : {
        default: 'hsl(150, 70%, 97%)'
      },
    primary: {
      ...muiColors.teal
    },
    secondary: {
      ...muiColors.orange
    },
  },
  typography: {
    fontFamily: `
      -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif
    `

  }
})

export const colors = {
  ...muiColors
}
