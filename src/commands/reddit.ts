import type { Command } from '../types/typings'
import { siteEndpoint } from '../assets/endpoints'
import { ProperFetch } from '../properFetch'

export { femboyCommand }

const femboyCommand: Command = {
	name: 'femboy',
	description: 'Posts the latest femboy',
	async execute() {
		try {
			const returnedObject = (await ProperFetch(
				`${siteEndpoint}/Reddit/Top/Femboy`
			)) as { url: string }

			return {
				files: [returnedObject.url]
			}
		} catch (error) {
			return { content: `Error in /femboy command: ${error}` }
		}
	}
}
