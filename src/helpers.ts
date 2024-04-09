export function getCurrentDate() {
	const currentTime = new Date(Date.now()).toString()
	return `The time is: ${currentTime}`
}
