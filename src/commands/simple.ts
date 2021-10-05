import { CommandInteraction } from 'discord.js'
import { Command } from '../typings.js'

export { kissCommand, parentsCommand, crocCommand, cheemsCommand }

const kissCommand: Command = {
	name: 'kiss',
	description: 'UwU Kiss',
	options: [
		{
			name: 'person',
			description: 'Whomstdve to kiss',
			type: 'MENTIONABLE',
			required: true
		}
	],
	execute(interaction: CommandInteraction) {
		const arrayOfImages = [
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
		const imageToSend =
			arrayOfImages[Math.floor(Math.random() * arrayOfImages.length)]

		return {
			// content: `${message.author} kissed ${args[0]}`,
			content: `${interaction.user} kissed ${interaction.options.getMentionable(
				'person'
			)}`,
			files: [imageToSend]
		}
	}
}

const parentsCommand: Command = {
	name: 'parents',
	description: 'Fuck parents aaaaa',
	execute() {
		const arrayOfImages = [
			'https://drjamesgjohnson.org/wp-content/uploads/2016/10/when-anger-seperates-family.jpg',
			'https://echomag.com/wp-content/uploads/2019/03/AdobeStock_164401349_feature.jpg',
			'https://st2.depositphotos.com/1010613/5514/i/950/depositphotos_55140239-stock-photo-angry-upset-family-having-argument.jpg',
			'https://www.parent4success.com/site/wp-content/uploads/2020/08/Bitmapangry-family-300x200.png',
			'https://smolenplevy.com/wp-content/uploads/2018/05/bigstock-Family-Quarrel-Angry-Young-Pe-240511408.jpg',
			'https://as1.ftcdn.net/jpg/00/71/39/38/500_F_71393859_UTsSdesbUSQBuLRNB1T3aJ4GLa5feVYy.jpg'
		]
		const imageToSend =
			arrayOfImages[Math.floor(Math.random() * arrayOfImages.length)]

		return {
			content: 'MY PARENTS SUCK ASS',
			files: [imageToSend]
		}
	}
}

const crocCommand: Command = {
	name: 'croc',
	description: 'Posts exploding croc',
	execute(interaction: CommandInteraction) {
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
