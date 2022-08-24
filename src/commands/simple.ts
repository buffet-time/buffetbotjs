import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import { Command } from '../typings.js'

const kissImages = [
	'https://www.daysoftheyear.com/wp-content/uploads/international-kissing-day.jpg',
	'https://previews.123rf.com/images/auremar/auremar1201/auremar120105074/11947172-kiss-on-the-cheek.jpg',
	'https://st4.depositphotos.com/13194036/26679/i/1600/depositphotos_266795594-stock-photo-attractive-girl-kissing-cheek-handsome.jpg',
	'https://healthmad.com/wp-content/uploads/2020/04/kissing-on-a-cheek-1300x731.jpg',
	'https://bodylanguagecentral.com/wp-content/uploads/2019/10/woman-kissing-mans-cheek.jpg',
	'https://reductress.com/wp-content/uploads/2017/10/man-kiss-forehead-couple-820x500.jpg',
	'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/romantic-lesbian-kissing-on-girlfriends-forehead-royalty-free-image-1571951475.jpg?crop=0.408xw:0.306xh;0.290xw,0.378xh&resize=640:*',
	'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/love-always-kiss-a-lot-royalty-free-image-1028766984-1548438446.jpg?crop=0.64052xw:1xh;center,top&resize=480:*',
	'https://freedesignfile.com/upload/2017/07/Happy-forehead-kiss-HD-picture.jpg'
]
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

const parentsImages = [
	'https://drjamesgjohnson.org/wp-content/uploads/2016/10/when-anger-seperates-family.jpg',
	'https://echomag.com/wp-content/uploads/2019/03/AdobeStock_164401349_feature.jpg',
	'https://st2.depositphotos.com/1010613/5514/i/950/depositphotos_55140239-stock-photo-angry-upset-family-having-argument.jpg',
	'https://www.parent4success.com/site/wp-content/uploads/2020/08/Bitmapangry-family-300x200.png',
	'https://smolenplevy.com/wp-content/uploads/2018/05/bigstock-Family-Quarrel-Angry-Young-Pe-240511408.jpg',
	'https://as1.ftcdn.net/jpg/00/71/39/38/500_F_71393859_UTsSdesbUSQBuLRNB1T3aJ4GLa5feVYy.jpg'
]
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

const leftistQuotes = [
	'"Social progress can be measured by the social position of the female sex." - Karl Marx',
	'"From each according to his abilities, to each according to his needs." - Karl Marx',
	'"The need of a constantly expanding market for its products chases the bourgeoisie over the whole surface of the globe. It must nestle everywhere, settle everywhere, establish connexions everywhere." - Friedrich Engels',
	'"An ounce of action is worth a ton of theory." - Friedrich Engels',
	'"It is only those who do nothing who makes no mistake." - Pyotr Kropotkin',
	'"variety is life; uniformity is death" - Pyotr Kropotkin',
	'"Lenin is not comparable to any revolutionary figure in history. Revolutionaries have had ideals. Lenin has none." - Pyotr Kropotkin',
	'"Don\'t compete! — competition is always injurious to the species, and you have plenty of resources to avoid it!" - Pyotr Kropotkin',
	'"Well-being for all is not a dream." - Pyotr Kropotkin',
	'"When deeds speak, words are nothing." - Pierre-Joseph Proudhon',
	'"Property is theft!" - Pierre-Joseph Proudhon',
	'"As man seeks justice in equality, so society seeks order in anarchy." - Pierre-Joseph Proudhon',
	'"The urge to destroy is also a creative urge." - Mikahil Bakunin',
	'"If God really existed, it would be necessary to abolish Him." - Mikhail Bakunin',
	'"People go to church for the same reasons they go to a tavern: to stupefy themselves, to forget their misery, to imagine themselves, for a few minutes anyway, free and happy." - Mikhail Bakunin',
	'"The freedom of all is essential to my freedom." - Mikahil Bakunin',
	'"If I can\'t dance to it, it\'s not my revolution." - Emma Goldman',
	'"The strongest bulwark of authority is uniformity; the least divergence from it is the greatest crime" - Emma Goldman',
	'"The Communist dogma that the end justifies all means was also doing much harm. It had thrown the door wide open to the worst human passions, and discredited the ideals of the Revolution." - Emma Goldman',
	'"There is no greater fallacy than the belief that aims and purposes are one thing, while methods and tactics are another. This conception is a potent menace to social regeneration. All human experience teaches that methods and means cannot be separated from the ultimate aim. The means employed become, through individual habit and social practice, part and parcel of the final purpose; they influence it, modify it, and presently the aims and means become identical." - Emma Goldman',
	'"To be GOVERNED is to be watched, inspected, spied upon, directed, law-driven, numbered, regulated, enrolled, indoctrinated, preached at, controlled, checked, estimated, valued, censured, commanded, by creatures who have neither the right nor the wisdom nor the virtue to do so. To be GOVERNED is to be at every operation, at every transaction noted, registered, counted, taxed, stamped, measured, numbered, assessed, licensed, authorized, admonished, prevented, forbidden, reformed, corrected, punished. It is, under pretext of public utility, and in the name of the general interest, to be placed under contribution, drilled, fleeced, exploited, monopolized, extorted from, squeezed, hoaxed, robbed; then, at the slightest resistance, the first word of complaint, to be repressed, fined, vilified, harassed, hunted down, abused, clubbed, disarmed, bound, choked, imprisoned, judged, condemned, shot, deported, sacrificed, sold, betrayed; and to crown all, mocked, ridiculed, derided, outraged, dishonored. That is government; that is its justice; that is its morality." - Pierre-Joseph Proudhon',
	'"Authority, when first detecting chaos at its heels, will entertain the vilest schemes to save its orderly facade." - Alan Moore',
	'"Anarchism is democracy taken seriously." - Edward Abbey',
	'"If you took the most ardent revolutionary, vested him in absolute power, within a year he would be worse than the Tsar himself." - Mikhail Bakunin',
	'"Love is it\'s own protection." - Emma Goldman',
	'"I love men too — not merely individuals, but every one. But I love them with the consciousness of egoism; I love them because love makes me happy, I love because loving is natural to me, because it pleases me. I know no “commandment of love.” I have a fellow-feeling with every feeling being, and their torment torments, their refreshment refreshes me too; I can kill them, not torture them." - Max Stirner',
	'"People shouldn\'t be afraid of their government. Governments should be afraid of their people." - Alan Moore',
	'"Love your rage, not your cage." - Alan Moore',
	'"The problems we face, did not come down from the heavens. They are made, they are made by bad human decisions, and good human decisions can change them." - Bernie Sanders',
	'"We are living in a nation which worships wealth rather than caring for the poor. I don’t think that is the nation we should be living in." - Bernie Sanders',
	'"You show me a capitalist, and I\'ll show you a bloodsucker" - Malcolm X',
	'"The greatest purveyor of violence in the world : My own Government, I can not be Silent." - Martin Luther King Jr.',
	"\"We've got to face the fact that some people say you fight fire best with fire, but we say you put fire out best with water. We say you don't fight racism with racism. We're gonna fight racism with solidarity.\" - Fred Hampton",
	'"If you walk through life and don\'t help anybody, you haven\'t had much of a life" - Fred Hampton',
	'"Nothing is more important than stopping fascism, because fascism is gonna stop us all." - Fred Hampton'
]
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
