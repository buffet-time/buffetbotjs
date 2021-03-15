// nah more like Wikipedia/discogs/rateyourmusic
// let it be from Youtube/Soundcloud/Bandcamp

import { Message } from 'discord.js'
import { Command } from '../typings.js'
// import { Client } from 'disconnect'

export { helpCommand }

const helpCommand: Command = {
	name: 'help',
	execute(message: Message, args: string[]) {
		console.log(message, args)
		return { content: 'cock' }
	}
}
