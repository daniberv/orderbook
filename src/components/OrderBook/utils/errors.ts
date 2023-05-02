const errors = {
	0: `Invalid params: check TOKEN or URLS`,
	1: `At least 1 valid WEBSOCKET URL must be provided`,
	2: `JWT must be provided`,
	3: (args: string[]): string =>
		`Connection error for specified WEBSOCKET URLs | ${args[0]}`,
	4: (args: string[]): string => `Subscription connection failed | ${args[0]}`,
	5: `Missing sequence detected`,
}

const getError = (
	errorNum: keyof typeof errors,
	note?: string,
	...args: string[]
): string => {
	const errorItem = errors[errorNum]
	let errorDisplay = errorItem
	if (typeof errorItem === 'function') {
		errorDisplay = errorItem([...args])
	}
	return String(note ? `${note} :: ${errorDisplay}` : errorDisplay)
}

export default getError
