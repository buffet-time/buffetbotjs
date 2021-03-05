import { Message } from 'discord.js'
import { Command } from '../typings.js'
import { Words } from '../assets/words.js'

const words = Words

export { acronymCommand }

const acronymCommand: Command = {
	name: 'acronym',
	execute(_message: Message, args: string[]) {
		if (args.length < 1) {
			return 'Must pass a word.'
		}
		const word = args[0].toLowerCase()
		const lowercaseWord = word.toLowerCase()
		if (word.length < 2) {
			return 'Acronym must be more than one letter.'
		} else if (lowercaseWord === 'acab') {
			return '**ALL** cops are bastards'
		} else if (lowercaseWord === 'mac') {
			return 'Linux Stan'
		} else if (/^[a-zA-Z]+$/.test(word)) {
			return getAcronym(word)
		} else {
			return 'The word you want to become an acronym must only contain letters.'
		}
	}
}

function getAcronym(word: string): string {
	const generatedAcronym = getWordsFromProvidedAcronym(word)
		.toString()
		.replace(/,/g, '  ')
	if (generatedAcronym.length > 2000 || generatedAcronym === 'F') {
		return "Yo gamer, that acronym was too larnge for discord. When's hotline?"
	} else {
		return generatedAcronym
	}
}

// takes the word and returns an array of random words
// starting with each given letter
function getWordsFromProvidedAcronym(acronym: string): string[] {
	const acronymArray = acronym.toLowerCase().split('')
	let lengthOfWords = 0
	let wordsArray: string[]
	let generatedWord = ''

	return acronymArray.map((letter: string) => {
		if (lengthOfWords > 2000) {
			return 'F'
		} else {
			wordsArray = words[letter]
			generatedWord = wordsArray[Math.floor(Math.random() * wordsArray.length)]
			lengthOfWords += generatedWord.length + 1
			return generatedWord
		}
	})
}
