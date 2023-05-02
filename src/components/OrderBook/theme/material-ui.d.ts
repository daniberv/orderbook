import { PaletteOptions } from '@mui/material/styles/createPalette'

declare module '@mui/material/styles/createPalette' {
	export interface PaletteOptions {
		labels: {
			legendColor: string
			bidColor: string
			askColor: string
		}
	}
}
