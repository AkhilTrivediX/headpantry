'use client'

import { colors } from "@mui/material";
import { alpha, createTheme } from "@mui/material/styles"

const theme = createTheme({
    typography:{
        fontFamily: '"Zain", "Helvetica", "Arial", sans-serif',
    },
    palette:{
      primary: {main:'#00e3b2'},
      secondary: {main: '#28389a', dark:'#050714', light:'#3d56f0'},
      mode: 'dark',
    },
    components:{
      MuiButton:{
        styleOverrides:{
          root:{
            borderRadius: '50px'
          },
          outlined: ({theme }) => ({
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            borderColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.8),
              borderColor: theme.palette.primary.main,
              color: theme.palette.secondary.dark,
            },
            }),
        }
      },
    }
  })
  
export default theme;