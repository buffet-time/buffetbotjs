import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import { Command } from '../types/typings'
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

export const SimpleCommands = [
	kissCommand,
	parentsCommand,
	crocCommand,
	cheemsCommand,
	macCommand,
	leftistCommand
]
