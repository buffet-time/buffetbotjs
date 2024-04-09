import type { RequestInfo, RequestInit, Response } from 'undici/types/fetch'
import { getCurrentDate } from './helpers'

// Currently need to manually define Fetch for use in node 18+ global fetch
// Nodes global fetch was pulled from undici.
declare global {
	function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
}

// This is a wrapper around the Fetch WebAPI to handle errors without any fuss
export async function ProperFetch(
	input: RequestInfo,
	init?: RequestInit | undefined
): Promise<any> {
	try {
		const response = init ? await fetch(input, init) : await fetch(input)

		if (response.ok) {
			return await response.json()
		}

		console.error(
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			`Responded with an error: ${await response.json()} ~ ${getCurrentDate()}`
		)
		return null
	} catch (error: any) {
		console.error(`Error in fetch call: ${error} ~ ${getCurrentDate()}`)
		return null
	}
}
