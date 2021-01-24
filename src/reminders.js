import FileSystem from 'file-system'

// !reminders add 2[number] 3[minutes] 4[optional which channel] 5[message]
export function addReminder(message, commandsArray) {
	FileSystem.readFile('./assets/reminders.json', (error, data) => {
		const messageAuthor = message.author.id
		const content = message.content
		const reminderMessage = content.slice(
			content.indexOf('"') + 1,
			content.lastIndexOf('"')
		)
		let remindersJson
		let newReminder = {
			reminderNumber: 1,
			time: getTime(Number(commandsArray[2]), commandsArray[3]),
			user: messageAuthor,
			message: reminderMessage,
			channel: commandsArray[4].slice(2, 20)
		}

		if (error) {
			const tempArray = []
			tempArray.push(newReminder)
			remindersJson = tempArray
		} else {
			const parsedData = JSON.parse(data)
			newReminder.reminderNumber = getAvailableReminderNumber(
				parsedData,
				messageAuthor
			)
			parsedData.push(newReminder)
			remindersJson = parsedData
		}

		const remindersJsonString = JSON.stringify(remindersJson, null, 2)

		FileSystem.writeFile(
			'./assets/reminders.json',
			remindersJsonString,
			(error) => {
				if (error) {
					console.log(error)
				}
			}
		)
	})
	return 'Reminder added.'
}

export function removeReminder(message, commandsArray) {
	console.log('Remove')
	return 'remove'
}

export function viewReminders(message) {
	FileSystem.readFile('./assets/reminders.json', 'utf8', (error, data) => {
		if (error) {
			return 'f'
		}
		const blah = JSON.parse(data)
		console.log(blah)
	})
	return 'view'
}

// handle making sure number doesnt go past max
// if (reminderTime > Number.MAX_SAFE_INTEGER || reminderTime === 0) {
//     return 'fail'
// }
function getTime(amount, type) {
	const currentTime = Date.now()
	const amountConverted = amount * 1000 // so that adding 1 = adding 1 second not 1 ms
	switch (type) {
		case 'sec':
			return currentTime + amountConverted
		case 'min':
			return currentTime + amountConverted * 60
		case 'hour':
			return currentTime + amountConverted * 3600
		case 'day':
			return currentTime + amountConverted * 86400
		case 'week':
			return currentTime + amountConverted * 604800
		case 'month': // 30 days
			return currentTime + amountConverted * 2592000
		case 'year': // 365 days
			return currentTime + amountConverted * 31536000
		default:
			return 0
	}
}

// finds the lowest available number to set the reminderNumber as for the given user
function getAvailableReminderNumber(parsedData, messageAuthor) {
	let reminderNumberArray = []
	parsedData
		.filter((element) => {
			return element.user === messageAuthor
		})
		.forEach((element) => {
			reminderNumberArray.push(element.reminderNumber)
		})
	for (let x = 1; x < reminderNumberArray.length + 2; x++) {
		if (!reminderNumberArray.includes(x)) {
			return x
		}
	}
}
