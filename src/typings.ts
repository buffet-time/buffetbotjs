/* eslint-disable no-mixed-spaces-and-tabs */
import {
	ApplicationCommandOptionData,
	BufferResolvable,
	CommandInteraction,
	FileOptions,
	MessageAttachment
} from 'discord.js'
import { Stream } from 'stream'

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
	execute(options?: CommandInteraction):
		| Promise<{
				content?: string | null
				files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[]
		  }>
		| {
				content: string | null
				files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[]
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
