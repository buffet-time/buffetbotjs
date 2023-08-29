import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import type { Command } from '../types/typings'
import {
	kissImages,
	parentsImages,
	leftistQuotes
} from '../assets/commandLinks'

const kissCommand: Command = {
	name: 'kiss',
	description: 'UwU Kiss',
	options: [
		{
			name: 'person',
			description: 'Whomstdve to kiss',
			type: ApplicationCommandOptionType.Mentionable,
			required: true
		}
	],
	execute(interaction: ChatInputCommandInteraction) {
		return {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			content: `${interaction.user} kissed ${interaction.options.getMentionable(
				'person'
			)}`,
			files: [kissImages[Math.floor(Math.random() * kissImages.length)]]
		}
	}
}

const parentsCommand: Command = {
	name: 'parents',
	description: 'Fuck parents aaaaa',
	execute() {
		return {
			content: 'MY PARENTS SUCK ASS',
			files: [parentsImages[Math.floor(Math.random() * parentsImages.length)]]
		}
	}
}

const crocCommand: Command = {
	name: 'croc',
	description: 'Posts exploding croc',
	execute(interaction: ChatInputCommandInteraction) {
		return {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			content: `${interaction.user} exploded`,
			files: [
				'https://cdn.discordapp.com/attachments/480969957438390273/819965221744803870/crocodile.mp4'
			]
		}
	}
}

const cheemsCommand: Command = {
	name: 'cheems',
	description: 'Posts Cheems',
	execute() {
		return {
			content:
				'<:cheems1:755465422555447336>' +
				'<:cheems2:755465429832433684>\n' +
				'<:cheems3:755465436199387216>' +
				'<:cheems4:755465442553888959>'
		}
	}
}

const macCommand: Command = {
	name: 'mac',
	description: 'Should be used whenever people talk about windows',
	execute() {
		return {
			content: 'Stop using Windows'
		}
	}
}

const leftistCommand: Command = {
	name: 'leftist',
	description: 'Leftist quotes.',
	execute() {
		return {
			content: leftistQuotes[Math.floor(Math.random() * leftistQuotes.length)]
		}
	}
}

const garyCommand: Command = {
	name: 'gary',
	description: 'The only solution to pedos: Gary Plauché',
	execute() {
		return {
			files: [
				'https://cdn.discordapp.com/attachments/280830527055855618/1034143513689985034/gary.png'
			]
		}
	}
}

export const SimpleCommands = [
	kissCommand,
	parentsCommand,
	crocCommand,
	cheemsCommand,
	macCommand,
	leftistCommand,
	garyCommand
]
