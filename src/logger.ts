export default () => {
	if (process.env.NODE_ENV === 'production') {
		console.log = () => {}
		console.error = () => {}
		console.debug = () => {}
	}
}
