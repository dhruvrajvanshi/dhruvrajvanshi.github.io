import { createTheme } from '@mui/material'
import * as muiColors from '@mui/material/colors'

export const theme = createTheme({
  palette: {
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
