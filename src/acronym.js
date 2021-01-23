import { wordsArray } from '../assets/words.js'

export function getAcronym(word) {
	const generatedAcronym = getWordsFromProvidedAcronym(word)
		.toString()
		.replace(/,/g, '  ')
	if (generatedAcronym.length > 2000 || generatedAcronym === 'F') {
		return "Yo gamer, that acronym was too larnge for discord. When's hotline?"
	} else {
		return generatedAcronym
	}
}

function getWordsFromProvidedAcronym(acronym) {
	const wordsFromAcronym = []
	const acronymArray = acronym.toLowerCase().split('')
	let lengthOfWords = 0

	acronymArray.forEach((letter) => {
		if (lengthOfWords > 2000) {
			return 'F'
		} else {
			const wordsArray = getWordsStartingWith(letter)
			const generatedWord =
				wordsArray[Math.floor(Math.random() * wordsArray.length)]
			wordsFromAcronym.push(generatedWord)
			lengthOfWords += generatedWord.length + 1
		}
	})

	return wordsFromAcronym
}

function getWordsStartingWith(letter) {
	return wordsArray.filter((word) => {
		if (word.startsWith(letter)) {
			return word
		}
	})
}
