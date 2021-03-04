import { Message } from 'discord.js'

export interface Reminder {
	reminderNumber: number
	time: number
	user: string
	message: string
	channel: string
}

export interface Command {
	name: string
	execute(message: Message, args: string[]): Promise<string> | string
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
