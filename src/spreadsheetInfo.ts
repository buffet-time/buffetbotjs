export interface MusicSpreadsheetInfo {
	id: string
	range: string
}

export interface MediaSpreadsheetInfo {
	personsName: string
	userId: string
	music?: MusicSpreadsheetInfo
	games?: {
		id: string
		range: string
	}
	movies?: {
		id: string
		range: string
	}
}

export const MediaSpreadsheetsInfo: MediaSpreadsheetInfo[] = [
	{
		personsName: 'Buffet',
		userId: '136494200391729152',
		music: {
			id: '1lyFD7uLMT0mRdGkKwvbIm_2pqk2YJU7rtRQVhHq-nwU',
			range: 'Main!A2:G'
		}
	},
	{
		personsName: 'Zach',
		userId: '134862353660379137',
		music: {
			id: '1gOQsBnd11bU-DkNUlAWoDub6t7eqKhUjy92M5kh2_TQ',
			range: 'Sheet1!A2:G'
		}
	},
	{
		personsName: 'Stone',
		userId: '130804955014627328',
		music: {
			id: '1ZAAtds78UsGh2yYfiyDuX7gqL_4ZEtC6_njco6t7F44',
			range: 'Main!A2:G'
		}
	},
	{
		personsName: 'Lilli',
		userId: '356928790565224460',
		music: {
			id: '1aLMe-scY_yqUcZ0qWuFh9LcE5NydrkOlAza23Ia-fzY',
			range: 'Main!A2:G'
		}
	}
]

export const currentPeople = 'Buffet, Zachohlic, Stonepaq, Lilli'

// export { MediaSpreadsheetsInfo, currentPeople }
