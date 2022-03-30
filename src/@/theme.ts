import { createTheme } from '@mui/material'
import * as muiColors from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    primary: {
      ...muiColors.teal
    },
    secondary: {
      ...muiColors.orange
    }
  },
})

export const colors = {
  ...muiColors
}
