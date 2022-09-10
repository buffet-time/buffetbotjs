import { Command } from '../typings'
import { siteEndpoint } from '../assets/endpoints'

export { femboyCommand }

const femboyCommand: Command = {
	name: 'femboy',
	description: 'Posts the latest femboy',
	async execute() {
		try {
			const returnedObject = (await (
				await fetch(`${siteEndpoint}/Reddit/Top/Femboy`)
			).json()) as { url: string }

			return {
				files: [returnedObject.url]
			}
		} catch (error) {
			return { content: `Error in /femboy command: ${error}` }
		}
	}
}
