const fs = require('fs')

const sanitize = words => {
	return words.map(word => {
		word = word.toLowerCase()
		word = word.replace(/[-°!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/gm, ' ')
		word = word.replace(/[ ]{2,}/gm, ' ')
		word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
		word = word.replace(/ $/gm, '')
		return word
	})
}

const writeUnclassifiedCommentsMetaDataToFile = () => {

	const comments = fs.readFileSync('unclassified-comments.txt', {encoding: 'UTF-8'}).split(/\r?\n/).slice(0, -1)
	const positiveWords = sanitize(fs.readFileSync('positive-words.txt', {encoding: 'UTF-8'}).split(/\r?\n/))
	const negativeWords = sanitize(fs.readFileSync('negative-words.txt', {encoding: 'UTF-8'}).split(/\r?\n/))
	const commentsMetaData = []
	comments.forEach(comment => {

		const sanitizedComment = sanitize([comment.split('|')[0]])[0]
		const commentAsArray = sanitizedComment.split(' ')
		const positiveWordsMatches = []
		const negativeWordsMatches = []

		commentAsArray.forEach(commentWord => {
			if (positiveWords.includes(commentWord)) {
				positiveWordsMatches.push(commentWord)
			}
			if (negativeWords.includes(commentWord)) {
				negativeWordsMatches.push(commentWord)
			}
		})
		commentsMetaData.push({
			comment: sanitizedComment,
			letters_count: sanitizedComment.length,
			word_count: commentAsArray.length,
			positive_words: positiveWordsMatches,
			negative_words: negativeWordsMatches,
			positive_words_count: positiveWordsMatches.length,
			negative_words_count: negativeWordsMatches.length,
		})
	})

	fs.writeFileSync('./unclassified-comments_tr.dat', '')
	commentsMetaData.forEach(metaData => {
		fs.appendFile('./unclassified-comments_tr.dat', `${metaData.letters_count} ${metaData.word_count} ${metaData.positive_words_count} ${metaData.negative_words_count}\r\n`, err => err && console.log(err))
	})

}

writeUnclassifiedCommentsMetaDataToFile()