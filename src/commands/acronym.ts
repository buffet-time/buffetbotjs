import { CommandInteraction } from 'discord.js'
import { Command } from '../typings.js'
import Words from '../assets/acronymWords.json'

const words: { [key: string]: string[] } = Words

export { acronymCommand }

const acronymCommand: Command = {
	name: 'acronym',
	description: 'Creates a randomized acronym from what you enter',
	options: [
		{
			name: 'acronym',
			description: 'Word to create an ancronym from.',
			type: 'STRING',
			required: true
		}
	],
	execute(interaction: CommandInteraction) {
		const word = interaction.options.getString('acronym')
		if (!word) {
			return { content: 'Must pass a word.' }
		}
		const lowercaseWord = word.toLowerCase()
		if (lowercaseWord.length < 2) {
			return { content: 'Acronym must be more than one letter.' }
		} else if (lowercaseWord === 'acab') {
			return { content: '**ALL** cops are bastards' }
		} else if (lowercaseWord === 'mac') {
			return { content: 'Linux Stan' }
		} else if (/^[a-zA-Z]+$/.test(word)) {
			return { content: getAcronym(word) }
		} else {
			return {
				content:
					'The word you want to become an acronym must only contain letters.'
			}
		}
	}
}

function getAcronym(word: string): string {
	const generatedAcronym = getWordsFromProvidedAcronym(word)
		.toString()
		.replace(/,/g, '  ')
	if (generatedAcronym.length > 2000 || generatedAcronym === 'F')
		return "Yo gamer, that acronym was too larnge for discord. When's hotline?"
	else return generatedAcronym
}

// takes the word and returns an array of random words
// starting with each given letter
function getWordsFromProvidedAcronym(acronym: string): string[] {
	const acronymArray = acronym.toLowerCase().split('')
	let lengthOfWords = 0,
		wordsArray: string[],
		generatedWord = ''

	return acronymArray.map((letter: string) => {
		if (lengthOfWords > 2000) return 'F'
		else {
			wordsArray = words[letter]
			generatedWord = wordsArray[Math.floor(Math.random() * wordsArray.length)]
			lengthOfWords += generatedWord.length + 1
			return generatedWord
		}
	})
}
