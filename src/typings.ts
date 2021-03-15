/* eslint-disable no-mixed-spaces-and-tabs */
import {
	APIMessageContentResolvable,
	Message,
	MessageAdditions,
	MessageOptions
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
	execute(
		message: Message,
		args: string[]
	):
		| Promise<{
				content: MessageAdditions | APIMessageContentResolvable
				options?:
					| MessageAdditions
					| (MessageOptions & {
							split?: false | undefined
					  })
		  }>
		| {
				content: MessageAdditions | APIMessageContentResolvable
				options?:
					| MessageAdditions
					| (MessageOptions & {
							split?: false | undefined
					  })
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
