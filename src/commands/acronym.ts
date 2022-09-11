import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import { Command } from '../types/typings'

const words: { [key: string]: string[] } = await import(
	'../assets/acronymWords'
)

export { acronymCommand }

const acronymCommand: Command = {
	name: 'acronym',
	description: 'Creates a randomized acronym from what you enter',
	options: [
		{
			name: 'acronym',
			description: 'Word to create an ancronym from.',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	execute(interaction: ChatInputCommandInteraction) {
		const word = interaction.options.getString('acronym')?.toLocaleLowerCase()
		if (!word) {
			return { content: 'Must pass a word.' }
		}

		switch (true) {
			case word.length < 2:
				return { content: 'Acronym must be more than one letter.' }
			case word === 'acab':
				return { content: '**ALL** cops are bastards' }
			case word === 'mac':
				return { content: 'Linux Stan' }
			case /^[a-zA-Z]+$/.test(word):
				return { content: getAcronym(word) }
			default:
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
	if (generatedAcronym.length > 2000 || generatedAcronym === 'F') {
		return 'That acronym was too large for discord.'
	}

	return generatedAcronym
}

// takes the word and returns an array of random words
// starting with each given letter
function getWordsFromProvidedAcronym(acronym: string): string[] {
	let lengthOfWords = 0
	let wordsArray: string[]
	let generatedWord = ''

	return acronym
		.toLowerCase()
		.split('')
		.map((letter: string) => {
			if (lengthOfWords > 2000) {
				return 'f'
			}

			wordsArray = words[letter]
			generatedWord = wordsArray[Math.floor(Math.random() * wordsArray.length)]
			lengthOfWords += generatedWord.length + 1
			return generatedWord
		})
}
