import { Client } from 'discord.js'
import config from '../config.js'
import { getAcronym } from './acronym.js'
import {
	addReminder,
	removeReminder,
	viewReminders,
	getAllReminders
} from './reminders.js'

const client = new Client()
let allReminders = await getAllReminders()

client.once('ready', () => {
	console.log('Ready')
	client.user.setActivity('!help')

	// variables pulled out to be slightly more efficient
	let currentTime = 1
	let x = 0

	// Reminder Handling
	setInterval(async () => {
		// TODO have the repo by default have reminders.json with []
		if (allReminders[0]) {
			currentTime = Date.now()
			x = allReminders.length
			while (x--) {
				if (currentTime >= allReminders[x].time) {
					const channelToSendTo = await client.channels.fetch(
						allReminders[x].channel
					)
					channelToSendTo.send(
						`<@!${allReminders[x].user}>: ${allReminders[x].message}`
					)
					await removeReminder(
						allReminders[x].user,
						allReminders[x].reminderNumber
					)
					allReminders = await getAllReminders()
				}
			}
		}
	}, 15000) // 10000 = 10 seconds
})

// variables pulled out to be slightly more efficient
let content = ''
let command = ''
let commandArray = []
let firstValue = ''
let secondValue = ''
let messageToSend = ''

client.on('message', async (message) => {
	content = message.content
	command = content.slice()
	commandArray = command.split(' ')
	firstValue = commandArray[0].toLowerCase()

	switch (firstValue) {
		case '!help':
			messageToSend =
				`**Current commands**:\n!acronym [insert word here]\n` +
				`!reminders add [number] [minute/ minutes, ..., year/years] [#channel] ["message in quotes"] \n` +
				`!reminders remove [number to remove] \n` +
				`!reminders view [number to view or the word all] \n` +
				`**Current modifiers**:\n**-d** deletes your message that invoked the command\n` +
				`**-o** omits the output from the bot\n` +
				`**Example:** !acronym meme -d`
			break
		case '!acronym': // !acronym [word]
			secondValue = commandArray[1].toLowerCase()
			if (!secondValue) {
				messageToSend = 'Must pass a word.'
				break
			}
			const word = command.slice(9, secondValue.length + 9)
			const lowercaseWord = word.toLowerCase()
			if (secondValue.length < 2) {
				messageToSend = 'Acronym must be more than one letter.'
				break
			} else if (lowercaseWord === 'acab') {
				messageToSend = '**ALL** cops are bastards'
				break
			} else if (lowercaseWord === 'mac') {
				messageToSend = 'Linux Stan'
				break
			} else if (/^[a-zA-Z]+$/.test(word)) {
				messageToSend = getAcronym(word)
			} else {
				messageToSend =
					'The word you want to become an acronym must only contain letters.'
			}
			break
		case '!reminders': // !reminders [add, remove, view]
			const thirdValue = commandArray[2]
			secondValue = commandArray[1].toLowerCase()
			if (!secondValue) {
				messageToSend = 'Must pass **add** **remove** or **view**'
				break
			}
			switch (secondValue) {
				case 'add': {
					if (commandArray.length > 5 && !isNaN(Number(thirdValue))) {
						messageToSend = await addReminder(message, commandArray)
						allReminders = await getAllReminders()
					} else {
						messageToSend =
							'Incorrect invocation of the add reminders command. See !help'
					}
					break
				}
				case 'remove':
					if (thirdValue || !isNaN(Number(thirdValue))) {
						messageToSend = await removeReminder(message.author.id, thirdValue)
						allReminders = await getAllReminders()
					} else {
						messageToSend = 'Must pass a number to remove.'
					}
					break
				case 'view':
					if (
						!isNaN(Number(thirdValue)) ||
						thirdValue.toLowerCase() === 'all'
					) {
						messageToSend = await viewReminders(message.author.id, thirdValue)
					} else {
						messageToSend =
							'Incorrect invocation of the !reminders command. See !help'
					}
					break
				default:
					messageToSend =
						'Incorrect invocation of the !reminders command. See !help'
			}
			break
		default:
			// doesn't send the below message if Myself or the Bot @ me
			if (
				content.includes('<@!136494200391729152>') &&
				message.author.id !== '136494200391729152' &&
				message.author.id !== '357236531083083778'
			) {
				console.log(message.author.id)
				messageToSend = `dont ever @ me again`
			} else {
				return
			}
			break
	}

	// -d modifier = deletes the message that invoked the command
	if (command.includes('-d')) {
		try {
			message.delete()
		} catch (error) {}
	}

	// -o modifier = omits the bots response
	else if (command.includes('-o')) {
		try {
			return
		} catch (error) {}
	}

	// send the message
	try {
		message.channel.send(messageToSend)
	} catch (e) {
		try {
			message.channel.send('Command Failed: ' + e)
		} catch (e) {}
	}
})

client.login(config.token)
