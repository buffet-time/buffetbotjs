import { Client } from 'discord.js'
import config from '../config.js'
import { getAcronym } from './acronym.js'
import { addReminder, removeReminder, viewReminders } from './reminders.js'

const client = new Client()
let messageToSend = ''
let command = ''
let commandArray = []
let firstValue = ''
let secondValue = ''
let content = ''

client.once('ready', () => {
	client.user.setActivity('!help')
	console.log('Ready\n ')
})

client.on('message', async (message) => {
	content = message.content
	command = content.slice()
	commandArray = command.split(' ')
	firstValue = commandArray[0]
	secondValue = commandArray[1]

	switch (firstValue) {
		case '!help':
			messageToSend =
				`**Current commands**:\n!acronym [insert word here]\n` +
				`!reminders add [number] [seconds/ second, ..., year/years] [#channel] ["message in quotes"] \n` +
				`**Current modifiers**:\n**-d** deletes your message that invoked the command\n` +
				`**-o** omits the output from the bot\n` +
				`**Example:** !acronym meme -d`
			break
		case '!acronym': // !acronym [word]
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
			if (!secondValue) {
				messageToSend = 'Must pass **add** **remove** or **view**'
				break
			}
			switch (secondValue) {
				case 'add': {
					if (commandArray.length > 5 && !isNaN(Number(commandArray[2]))) {
						messageToSend = await addReminder(message, commandArray)
					} else {
						messageToSend =
							'Incorrect invocation of the add reminders command. See !help'
					}
					break
				}
				case 'remove':
					if (!isNaN(Number(commandArray[2]))) {
						messageToSend = await removeReminder(
							message.author.id,
							commandArray[2]
						)
					} else {
						messageToSend = 'You must pass a valid number.'
					}
					break
				case 'view':
					// need to scrub incorrect invocations
					messageToSend = await viewReminders(
						message.author.id,
						commandArray[2]
					)
					break
				default:
					messageToSend =
						'Incorrect invocation of the !reminders command. See !help'
			}
			break
		default:
			if (
				content.includes('<@!136494200391729152>') &&
				message.author.id !== '136494200391729152'
			) {
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
