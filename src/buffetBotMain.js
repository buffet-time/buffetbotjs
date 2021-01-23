const Discord = require('discord.js')
const config = require('../config.json')
const wordsArray = require('../assets/words.json')

const client = new Discord.Client()
let messageToSend = ''
let command = ''
let commandSender = ''
let commandArray = []
let firstWord = ''
let content = ''

client.once('ready', () => {
	client.user.setActivity('!help')
	console.log('Ready\n ')
})

client.on('message', (message) => {
	content = message.content
	command = content.slice()
	commandSender = message.author.username
	commandArray = command.split(' ')
	firstWord = commandArray[0]

	// !help
	if (firstWord === '!help') {
		messageToSend =
			`Current commands: !acronym [insert word here]\n` +
			`Current modifiers: /d\n` +
			`Example: !acronym meme /d`
		// console.log('!help command initiated by: ' + commandSender)
	}

	// !acronym
	else if (command.length > 10 && firstWord === '!acronym') {
		const word = command.slice(9, commandArray[1].length + 9)
		const lowercaseWord = word.toLowerCase()
		if (lowercaseWord === 'acab') {
			messageToSend = '**ALL** cops are bastards'
		} else if (lowercaseWord === 'mac') {
			messageToSend = 'Linux Stan'
		} else if (/^[a-zA-Z]+$/.test(word)) {
			messageToSend = acronym(word)
			// console.log('!acronym command initiated by: ' + commandSender)
		} else {
			messageToSend =
				'The word you want to become an acronym must only contain letters.'
		}
	}

	// !remindme command
	else if (firstWord === '!remindme') {
		//
	}

	// dont @ me
	else if (
		content.includes('<@!136494200391729152>') &&
		message.author.id !== '136494200391729152'
	) {
		messageToSend = `dont ever @ me again`
	}

	// no conditions met so stop execution
	else {
		return
	}

	// /d modifier
	if (command.includes('/d')) {
		try {
			message.delete()
		} catch (error) {
			// console.log('message.delete(): ' + error)
		}
	}

	// send the message
	try {
		message.channel.send(messageToSend)
	} catch (error) {
		try {
			message.channel.send('Command Failed: ' + error)
		} catch (error) {
			// console.log(error)
		}
		// console.log('message.channel.send(): ' + error)
	}
})

client.login(config.token)

//////////////////////
// Helper Functions //
//////////////////////

// Acronym functions
function acronym(word) {
	const generatedAcronym = getWordsFromProvidedAcronym(word)
		.toString()
		.replace(/,/g, '  ')
	if (generatedAcronym.length > 2000 || generatedAcronym === 'F') {
		return "Yo gamer, that acronym was too larnge for discord. When's hotline?"
	} else {
		return generatedAcronym
	}
}

function getWordsFromProvidedAcronym(acronym) {
	const wordsFromAcronym = []
	const acronymArray = acronym.toLowerCase().split('')
	let lengthOfWords = 0

	acronymArray.forEach((letter) => {
		if (lengthOfWords > 2000) {
			return 'F'
		} else {
			const wordsArray = getWordsStartingWith(letter)
			const generatedWord =
				wordsArray[Math.floor(Math.random() * wordsArray.length)]
			wordsFromAcronym.push(generatedWord)
			lengthOfWords += generatedWord.length + 1
		}
	})

	return wordsFromAcronym
}

function getWordsStartingWith(letter) {
	return wordsArray.filter((word) => {
		if (word.startsWith(letter)) {
			return word
		}
	})
}
