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

export interface WordApiResponse {
	word: string
	antonyms?: string[]
	synonyms?: string[]
	definitions?: {
		definition: string
		partOfSpeech: string
	}[]
}

export type WordsApiTypes = 'synonyms' | 'antonyms'

export interface UrbanDictionaryResponse {
	list: {
		definition: string
		permalink: string
		thumbs_up: number
		sound_urls: string[]
		author: string
		word: string
		defid: number
		current_vote: string
		written_on: string
		example: string
		thumbs_down: number
	}[]
}
