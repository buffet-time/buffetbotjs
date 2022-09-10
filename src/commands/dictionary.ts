/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import { rapidApiToken } from '../config/config'

import {
	type WordsApiTypes,
	type Command,
	type WordApiResponse,
	type UrbanDictionaryResponse
} from '../typings'

const wordsApiUrl = 'https://wordsapiv1.p.rapidapi.com/words/'
const urbanDictionaryUrl =
	'https://mashape-community-urban-dictionary.p.rapidapi.com/define'

async function wordsApiGetDefinition(
	word: string
): Promise<WordApiResponse | 'Error'> {
	try {
		const response = await fetch(`${wordsApiUrl}${word}/definitions`, {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': rapidApiToken,
				'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
			}
		})
		return (await response.json()) as WordApiResponse
	} catch (error) {
		console.log('Error getting definitions', error)
		return 'Error'
	}
}

async function urbanDictionaryGetDefinition(
	word: string
): Promise<UrbanDictionaryResponse | 'Error'> {
	try {
		const response = await fetch(`${urbanDictionaryUrl}?term=${word}`, {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': rapidApiToken,
				'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com'
			}
		})
		return (await response.json()) as UrbanDictionaryResponse
	} catch (error) {
		console.log('Error getting definitions', error)
		return 'Error'
	}
}

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

const definitionCommand: Command = {
	name: 'definition',
	description: 'Get the definition of a word.',
	options: [
		{
			name: 'word',
			description: 'The word you want the definition of',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: `definition`,
			description:
				'If there is more than 1 definition use this to get another definition',
			type: ApplicationCommandOptionType.Integer,
			required: false
		}
	],
	async execute(interaction: ChatInputCommandInteraction) {
		const word = interaction.options.getString('word')!
		const passedDefinitionNumber = interaction.options.getInteger('definition')
		const definintionNumber = passedDefinitionNumber
			? passedDefinitionNumber - 1
			: 0

		const definition = await wordsApiGetDefinition(word)

		if (definition === 'Error' || !definition || !definition.definitions) {
			const udDefinition = await urbanDictionaryGetDefinition(word)

			if (
				udDefinition &&
				udDefinition !== 'Error' &&
				udDefinition.list.length > definintionNumber
			) {
				return {
					content: `${capitalizeFirstLetter(word)} - ${udDefinition.list[
						definintionNumber
					].definition
						.replace(/(\r\n|\n|\r)/gm, ' ')
						.trim()}`
				}
			}

			return {
				content: `Error: Couldn't get the definition.`
			}
		}

		if (definition.definitions.length > definintionNumber) {
			return {
				content: `${capitalizeFirstLetter(word)} (${
					definition.definitions![definintionNumber].partOfSpeech
				}): ${definition.definitions![definintionNumber].definition}`
			}
		}

		return {
			content: `Error: there isn't that many definitions.`
		}
	}
}

async function getSynonymsOrAntonyms(type: WordsApiTypes, word: string) {
	try {
		const response = await fetch(`${wordsApiUrl}${word}/${type}`, {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': rapidApiToken,
				'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
			}
		})
		return (await response.json()) as WordApiResponse
	} catch (error) {
		console.log(`Error getting ${type}`, error)
		return 'Error'
	}
}

const antonymAndSynonymsArray: WordsApiTypes[] = ['synonyms', 'antonyms']
const antonymAndSynonymCommands: Command[] = antonymAndSynonymsArray.map(
	(type) => {
		return {
			name: type,
			description: `Get the ${type} of a word.`,
			options: [
				{
					name: 'word',
					description: `The word you want ${type} for`,
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			async execute(interaction: ChatInputCommandInteraction) {
				const word = interaction.options.getString('word')!
				const response = await getSynonymsOrAntonyms(type, word)

				if (response === 'Error') {
					console.log(word, response)
					return {
						content: `Error getting ${type}.`
					}
				}

				const responseStrings = response[type]!

				if (responseStrings.length === 0) {
					return {
						content: `Couldn't get any ${type}`
					}
				}

				// Take the string array, make it a string, and add a space after each comma
				const massagedSynonyms = responseStrings.toString().replace(/,/g, ', ')

				return {
					content: `${capitalizeFirstLetter(word)} ${type}: ${massagedSynonyms}`
				}
			}
		}
	}
)

export const DictionaryCommands = [
	definitionCommand,
	...antonymAndSynonymCommands
]
