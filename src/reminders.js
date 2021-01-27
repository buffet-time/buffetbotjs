import FileSystem from 'fs/promises'
import IsEqual from 'lodash.isequal'

// TODO: clean up incorrect command passing to catch more
// handles the !reminders add command
export async function addReminder(message, commandsArray) {
	try {
		const messageAuthor = message.author.id
		const content = message.content
		const reminderMessage = content.slice(
			content.indexOf('"') + 1,
			content.lastIndexOf('"')
		)
		const timestamp = getTime(Number(commandsArray[2]), commandsArray[3])
		let newReminder = {
			reminderNumber: 1,
			time: timestamp,
			user: messageAuthor,
			message: reminderMessage,
			channel: commandsArray[4].slice(2, 20)
		}
		let remindersJson
		if (
			!newReminder.time &&
			!reminderMessage &&
			reminderMessage !== ('' || ' ') &&
			!newReminder.channel &&
			newreminder.channel !== ('' || ' ') &&
			timestamp === 0
		) {
			return 'Incorrect invocation of the add reminders command. See !help'
		}
		try {
			const data = await FileSystem.readFile('./assets/reminders.json', 'utf8')
			const parsedData = JSON.parse(data)
			newReminder.reminderNumber = getAvailableReminderNumber(
				parsedData,
				messageAuthor
			)
			parsedData.push(newReminder)
			remindersJson = parsedData
		} catch (error) {
			const tempArray = []
			tempArray.push(newReminder)
			remindersJson = tempArray
		}

		await FileSystem.writeFile(
			'./assets/reminders.json',
			JSON.stringify(remindersJson, null, 2),
			(error) => {}
		)
		return 'Reminder added.'
	} catch (error) {
		return 'Error in addReminder().'
	}
}

// handles the !reminders remove command
export async function removeReminder(messageAuthor, reminderNumberToRemove) {
	try {
		const data = await FileSystem.readFile('./assets/reminders.json', 'utf8')
		const parsedData = JSON.parse(data)
		const remindersArray = getRemindersByAuthor(parsedData, messageAuthor)
		const objectToRemoveArray = remindersArray.filter((reminder) => {
			return reminder.reminderNumber === Number(reminderNumberToRemove)
		})
		if (!objectToRemoveArray[0]) {
			return "The number passed doesn't exist."
		}
		const reminderToRemove = objectToRemoveArray[0]
		const indexToRemove = parsedData.findIndex((reminder) => {
			return IsEqual(reminder, reminderToRemove)
		})
		parsedData.splice(indexToRemove, 1)

		await FileSystem.writeFile(
			'./assets/reminders.json',
			JSON.stringify(parsedData, null, 2),
			(error) => {}
		)

		return 'Removed specified reminder.'
	} catch (error) {
		return 'Error in removeReminder().'
	}
}

// handles the !reminders view command
export async function viewReminders(messageAuthor, reminderToView) {
	try {
		const data = await FileSystem.readFile('./assets/reminders.json', 'utf8')
		const parsedData = JSON.parse(data)
		if (parsedData === [] || !parsedData.includes(messageAuthor)) {
			return 'You have no saved reminders.'
		} else if (!isNaN(Number(reminderToView))) {
			return remindersArrayToReturnString(
				getRemindersByAuthor(parsedData, messageAuthor).filter((reminder) => {
					return reminder.reminderNumber === Number(reminderToView)
				})
			)
		} else {
			return remindersArrayToReturnString(
				getRemindersByAuthor(parsedData, messageAuthor)
			)
		}
	} catch (error) {
		return 'Error in viewReminders().'
	}
}

// returns entire array of reminders
export async function getAllReminders() {
	try {
		const data = await FileSystem.readFile('./assets/reminders.json', 'utf8')
		return JSON.parse(data)
	} catch {
		return
	}
}

// TODO: handle making sure number doesnt go past max
// Gets the time the reminder should be sent
function getTime(amount, type) {
	// if (reminderTime > Number.MAX_SAFE_INTEGER || reminderTime === 0) {
	//     return 'fail'
	// }
	const currentTime = Date.now()
	const amountConverted = amount * 1000 // so that adding 1 = adding 1 second not 1 ms
	switch (type) {
		case 'minute':
		case 'minutes':
			return currentTime + amountConverted * 60
		case 'hour':
		case 'hours':
			return currentTime + amountConverted * 3600
		case 'day':
		case 'days':
			return currentTime + amountConverted * 86400
		case 'week':
		case 'weeks':
			return currentTime + amountConverted * 604800
		case 'month':
		case 'months': // 30 days
			return currentTime + amountConverted * 2592000
		case 'year':
		case 'years': // 365 days
			return currentTime + amountConverted * 31536000
		default:
			return 0
	}
}

// finds the lowest available number to set the reminderNumber as for the given user
function getAvailableReminderNumber(parsedData, messageAuthor) {
	const reminderNumberArray = getRemindersByAuthor(
		parsedData,
		messageAuthor
	).map((reminder) => {
		return reminder.reminderNumber
	})
	let n = 1
	const length = reminderNumberArray.length + 2
	while (n < length) {
		if (!reminderNumberArray.includes(n)) {
			return n
		}
		n++
	}
}

// Get all Reminder objects for given user
function getRemindersByAuthor(parsedData, messageAuthor) {
	return parsedData.filter((reminder) => {
		return reminder.user === messageAuthor
	})
}

// converts the array of reminders for a user to a Discord friendly message
function remindersArrayToReturnString(remindersArray) {
	return remindersArray.map((reminder) => {
		const date = new Date(reminder.time)
		return `Reminder ${reminder.reminderNumber}: "${reminder.message}" will be sent on: ${date} in <#${reminder.channel}>`
	})
}
