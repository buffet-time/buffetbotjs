/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import fetch from 'node-fetch'
import { rapidApiToken } from '../config/config.js'
import {
	type WordsApiTypes,
	type Command,
	type DictionaryResponse,
	type WordApiResponse
} from '../typings.js'

const dictionaryApi = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

async function getDefinition(
	word: string
): Promise<DictionaryResponse | undefined> {
	return (await fetch(`${dictionaryApi}${word}`)) as any as
		| DictionaryResponse
		| undefined
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
			? passedDefinitionNumber
			: 1

		const definition = await getDefinition(word)

		if (!definition) {
			return {
				content: `Error: Couldn't get the definition.`
			}
		}

		if (definition.meanings.length >= definintionNumber) {
			return {
				content: `${definition.word}: ${definition.meanings[definintionNumber].definitions[0]}`
			}
		}

		return {
			content: `Error: there isn't that many definitions.`
		}
	}
}

const wordsApiUrl = 'https://wordsapiv1.p.rapidapi.com/words/'
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
	(current) => {
		return {
			name: current,
			description: `Get the ${current} of a word.`,
			options: [
				{
					name: 'word',
					description: `The word you want ${current} for`,
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			async execute(interaction: ChatInputCommandInteraction) {
				const word = interaction.options.getString('word')!
				const response = await getSynonymsOrAntonyms(current, word)

				if (response === 'Error') {
					console.log(word, response)
					return {
						content: `Error getting ${current}.`
					}
				}

				return {
					content: `${word} ${current}: ${
						(response[current]!.reduce(
							(previous, current) => `${previous}, ${current}`
						),
						'')
					}`
				}
			}
		}
	}
)

export const DictionaryCommands = [
	definitionCommand,
	...antonymAndSynonymCommands
]
