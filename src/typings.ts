/* eslint-disable no-mixed-spaces-and-tabs */
import {
	ApplicationCommandOptionData,
	ChatInputCommandInteraction
} from 'discord.js'

export interface Reminder {
	reminderNumber: number
	time: number
	user: string
	message: string
	channel: string
}

export interface Command {
	name: string
	description: string
	options?: ApplicationCommandOptionData[]
	execute(options?: ChatInputCommandInteraction):
		| Promise<{
				content?: string | null
				files?: string[]
		  }>
		| {
				content: string | null
				files?: string[]
		  }
}

export enum Release {
	artist,
	name,
	score,
	type,
	year,
	genre,
	comments
}

export interface MediaTypeInfoObject {
	id: string
	range: string
}

export interface MediaSpreadsheetsUsers {
	personsName: string
	userId: string
	['Music']?: MediaTypeInfoObject
	['Games']?: MediaTypeInfoObject
	['Movies']?: MediaTypeInfoObject
	['TV']?: MediaTypeInfoObject
}

export type MediaChannels = 'Music' | 'Games' | 'Movies' | 'TV'

export type SpreadsheetLengths = {
	['Music']: number
	['Games']: number
	['Movies']: number
	['TV']: number
}[]

export interface DictionaryResponse {
	word: string
	phonetic: string
	origin: string
	phonetics: [
		{
			text: string
			audio?: string
			sourceUrl?: string
			license?: {
				name: string
				url: string
			}
		}
	]
	meanings: [
		{
			partOfSpeech: string
			definitions: [
				{
					definition: string
					example: string
					synonyms: string[]
					antonyms: string[]
				}
			]
			synonyms: string[]
			antonyms: string[]
		}
	]
	license?: {
		name: string
		url: string
	}
	sourceUrls: string[]
}

export interface WordApiResponse {
	word: string
	antonyms?: string[]
	synonyms?: string[]
}

export type WordsApiTypes = 'synonyms' | 'antonyms'
