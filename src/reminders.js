import FileSystem from 'fs/promises'
import IsEqual from 'lodash.isequal'

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
			const data = await FileSystem.readFile('./assets/reminders.json')
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

		const remindersJsonString = JSON.stringify(remindersJson, null, 2)

		await FileSystem.writeFile(
			'./assets/reminders.json',
			remindersJsonString,
			(error) => {}
		)
		return 'Reminder added.'
	} catch (error) {
		return 'Failed adding reminder.'
	}
}

export async function removeReminder(messageAuthor, reminderToRemove) {
	try {
		const data = await FileSystem.readFile('./assets/reminders.json')
		const parsedData = JSON.parse(data)
		const remindersArray = getRemindersByAuthor(parsedData, messageAuthor)
		const objectToRemoveArray = remindersArray.filter((object) => {
			return object.reminderNumber === Number(reminderToRemove)
		})
		const objectToRemove = objectToRemoveArray[0]
		if (objectToRemove) {
			const indexToRemove = parsedData.findIndex((object) => {
				return IsEqual(object, objectToRemove)
			})
			parsedData.splice(indexToRemove, 1)
			const remindersJsonString = JSON.stringify(parsedData, null, 2)

			await FileSystem.writeFile(
				'./assets/reminders.json',
				remindersJsonString,
				(error) => {}
			)

			return 'Removed specified reminder.'
		} else {
			return 'You have no saved reminders.'
		}
	} catch (error) {
		return 'You have no saved reminders.'
	}
}

export async function viewReminders(messageAuthor, reminderToView) {
	try {
		const data = await FileSystem.readFile('./assets/reminders.json')
		const parsedData = JSON.parse(data)
		if (reminderToView) {
			return getRemindersByAuthor(parsedData, messageAuthor).filter(
				(object) => {
					return object.reminderNumber === Number(reminderToView)
				}
			)
		} else {
			return getRemindersByAuthor(parsedData, messageAuthor)
		}
	} catch (error) {
		return 'You have no saved reminders.'
	}
}

// TODO: handle making sure number doesnt go past max
// if (reminderTime > Number.MAX_SAFE_INTEGER || reminderTime === 0) {
//     return 'fail'
// }
function getTime(amount, type) {
	const currentTime = Date.now()
	const amountConverted = amount * 1000 // so that adding 1 = adding 1 second not 1 ms
	switch (type) {
		case 'second':
		case 'seconds':
			return currentTime + amountConverted
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
	let reminderNumberArray = []
	getRemindersByAuthor(parsedData, messageAuthor).forEach((element) => {
		reminderNumberArray.push(element.reminderNumber)
	})
	for (let x = 1; x < reminderNumberArray.length + 2; x++) {
		if (!reminderNumberArray.includes(x)) {
			return x
		}
	}
}

function getRemindersByAuthor(parsedData, messageAuthor) {
	return parsedData.filter((element) => {
		return element.user === messageAuthor
	})
}
