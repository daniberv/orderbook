import { Stack } from '@mui/material'
import { styled } from '@mui/system'

export const Legend = styled(Stack)(({ theme }) => ({
	fontSize: 12,
	flexDirection: 'row',
	marginBottom: '0.5rem',
	color: theme.palette.labels.legendColor,
	'> div': {
		width: '33.3333%',
	},
}))

export default {
	Legend,
}
