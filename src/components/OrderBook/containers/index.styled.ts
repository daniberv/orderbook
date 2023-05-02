import styled from '@emotion/styled'
import { Stack } from '@mui/material'

const CONTAINER_WIDTH = 320

export const Container = styled(Stack)(() => ({
	width: CONTAINER_WIDTH,
	justifyContent: 'center',
	padding: '0.5rem',
	fontFamily: 'monospace',
	background: '#101624',
	color: '#A1ACC0',
}))

export default {
	Container,
}
