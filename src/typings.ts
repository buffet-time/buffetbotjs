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

export interface MusicSpreadsheetInfo {
	id: string
	range: string
}

export interface MediaSpreadsheetsUsers {
	personsName: string
	userId: string
	['Music']?: {
		id: string
		range: string
	}
	['Games']?: {
		id: string
		range: string
	}
	['Movies']?: {
		id: string
		range: string
	}
	['TV']?: {
		id: string
		range: string
	}
}

export type MediaChannels = 'Music' | 'Games' | 'Movies' | 'TV'

export type SpreadsheetLengths = {
	['Music']: number
	['Games']: number
	['Movies']: number
	['TV']: number
}[]
