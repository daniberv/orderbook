import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
	palette: {
		primary: {
			main: '#556cd6',
		},
		secondary: {
			main: '#19857b',
		},
		error: {
			main: red.A400,
		},
		labels: {
			legendColor: '#ffffff',
			bidColor: '#4DE9AE',
			askColor: '#CD3C50',
		},
	},
})

export default theme
