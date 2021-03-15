import { Message } from 'discord.js'
import FileSystem from 'fs/promises'
import IsEqual from 'lodash.isequal'
import { updateReminders } from '../buffetBotMain.js'
import { Command, Reminder } from '../typings.js'

export { remindersCommand }
const remindersFilePath = 'reminders.json'

const remindersCommand: Command = {
	name: 'reminders',
	async execute(message: Message, args: string[]) {
		if (args.length < 1) {
			return { content: 'Incorrect invocation of the reminders command.' }
		}
		const firstArg = args[0].toLowerCase()
		const secondArg = args[1]
		if (!firstArg) {
			return { content: 'Must pass **add** **remove** or **view**' }
		}
		switch (firstArg) {
			case 'add': {
				const content = message.content
				if (
					args.length > 4 &&
					!isNaN(Number(secondArg)) &&
					content.indexOf("'") !== -1 &&
					content.indexOf("'") !== content.lastIndexOf("'")
				) {
					const returnText = await addReminder(message, args)
					updateReminders(await getAllReminders())
					return { content: returnText }
				} else {
					return {
						content:
							'Incorrect invocation of the add reminders command. See !help'
					}
				}
			}
			case 'remove':
				if (secondArg && !isNaN(Number(secondArg))) {
					const returnText = await removeReminder(
						message.author.id,
						Number(secondArg)
					)
					updateReminders(await getAllReminders())
					return { content: returnText }
				} else {
					return { content: 'Must pass a number to remove.' }
				}
			case 'view':
				if (
					secondArg &&
					(!isNaN(Number(secondArg)) || secondArg.toLowerCase() === 'all')
				) {
					const reminderView = await viewReminders(
						message.author.id,
						Number(secondArg)
					)
					return {
						content: reminderView
					}
				} else {
					return {
						content: 'Incorrect invocation of the !reminders command. See !help'
					}
				}
			default:
				return {
					content: 'Incorrect invocation of the !reminders command. See !help'
				}
		}
	}
}

// TODO: clean up incorrect command passing to catch more
// handles the !reminders add command
async function addReminder(message: Message, args: string[]): Promise<string> {
	try {
		const messageAuthor = message.author.id
		const content = message.content
		const reminderMessage = content.slice(
			content.indexOf("'") + 1,
			content.lastIndexOf("'")
		)
		const timestamp = getTime(Number(args[1]), args[2])
		const newReminder: Reminder = {
			reminderNumber: 1,
			time: timestamp,
			user: messageAuthor,
			message: reminderMessage,
			channel: args[3].slice(2, 20)
		}
		let remindersJson: Reminder[]
		if (
			!newReminder.time &&
			!reminderMessage &&
			reminderMessage !== ('' || ' ') &&
			!newReminder.channel &&
			newReminder.channel !== ('' || ' ') &&
			timestamp === 0
		) {
			return 'Incorrect invocation of the add reminders command. See !help'
		}
		try {
			const data = await FileSystem.readFile(remindersFilePath, 'utf8')
			const parsedData: Reminder[] = JSON.parse(data)
			const availableReminderNumber = getAvailableReminderNumber(
				parsedData,
				messageAuthor
			)
			if (availableReminderNumber) {
				newReminder.reminderNumber = availableReminderNumber
				parsedData.push(newReminder)
				remindersJson = parsedData
			} else {
				const tempArray = []
				tempArray.push(newReminder)
				remindersJson = tempArray
			}
		} catch (error) {
			return 'Error 2 in addReminder().'
		}

		await FileSystem.writeFile(
			remindersFilePath,
			JSON.stringify(remindersJson, null, 2)
		)
		return 'Reminder added.'
	} catch (error) {
		return 'Error 1 in addReminder().'
	}
}

// handles the !reminders remove command
export async function removeReminder(
	messageAuthor: string,
	reminderNumberToRemove: number
): Promise<string> {
	try {
		const data = await FileSystem.readFile(remindersFilePath, 'utf8')
		const parsedData: Reminder[] = JSON.parse(data)
		const remindersArray = getRemindersByAuthor(parsedData, messageAuthor)
		const objectToRemoveArray = remindersArray.filter((reminder) => {
			return reminder.reminderNumber === reminderNumberToRemove
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
			remindersFilePath,
			JSON.stringify(parsedData, null, 2)
		)

		return 'Removed specified reminder.'
	} catch (error) {
		return 'Error in removeReminder().'
	}
}

// handles the !reminders view command
async function viewReminders(
	messageAuthor: string,
	reminderToView: number
): Promise<string> {
	try {
		const data = await FileSystem.readFile(remindersFilePath, 'utf8')
		const parsedData: Reminder[] = JSON.parse(data)
		if (parsedData === []) {
			return 'You have no saved reminders.'
		}
		const arrayOfUsers = parsedData.filter((reminder) => {
			return reminder.user === messageAuthor
		})
		if (!arrayOfUsers[0]) {
			return 'You have no saved reminders.'
		} else if (reminderToView) {
			return remindersArrayToReturnString(
				getRemindersByAuthor(parsedData, messageAuthor).filter((reminder) => {
					return reminder.reminderNumber === reminderToView
				})
			).join(`\n`)
		} else {
			return remindersArrayToReturnString(
				getRemindersByAuthor(parsedData, messageAuthor)
			).join(`\n`)
		}
	} catch (error) {
		return 'Error in viewReminders().'
	}
}

// returns entire array of reminders
export async function getAllReminders(): Promise<Reminder[]> {
	try {
		const data = await FileSystem.readFile(remindersFilePath, 'utf8')
		return JSON.parse(data)
	} catch {
		return []
	}
}

// TODO: handle making sure number doesnt go past max
// Gets the time the reminder should be sent
function getTime(amount: number, type: string) {
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
function getAvailableReminderNumber(
	parsedData: Reminder[],
	messageAuthor: string
) {
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
function getRemindersByAuthor(parsedData: Reminder[], messageAuthor: string) {
	return parsedData.filter((reminder) => {
		return reminder.user === messageAuthor
	})
}

// converts the array of reminders for a user to a Discord friendly message
function remindersArrayToReturnString(remindersArray: Reminder[]) {
	return remindersArray.map((reminder) => {
		const date = new Date(reminder.time)
		return `Reminder ${reminder.reminderNumber}: "${reminder.message}" will be sent on: ${date} in <#${reminder.channel}>`
	})
}
