const request = require('request')
const fs = require('fs')

const fetchComments = () => new Promise(resolve => {
	request({
		uri: 'https://produto.mercadolivre.com.br/MLB-1227336288-calcas-masculina-jogger-elastico-exercito-camuflada-_JM?quantity=1&onAttributesExp=true#reco_item_pos=1&reco_backend=navigation_trend&reco_backend_type=function&reco_client=home_navigation-trend-recommendations&reco_id=0d4b0930-7ab7-45e6-a1c0-951c49ef2988&c_id=/home/navigation-trends-recommendations/element&c_element_order=2&c_uid=41c761ad-e300-4e80-a012-d5911ac69394',
	},  (error, response, body) => {
		const commentsContent = body.match(/(?<=tooltip-full-body">)(.*)(?=<\/div>)/gm).slice(0, 3)
		const commentsTitle = body.match(/(?<=tooltip-title">)(.*)(?=<\/h4>)/gm).slice(0, 3)
		const fullComments = []
		for (let i = 0; i < 3; i++) {
			fullComments.push(`${commentsTitle[i]} ${commentsContent[i]}`)
		}
		resolve(fullComments)
	})
})

const sanitizeComments = comments => {
	return comments.map(comment => {
		comment = comment.toLowerCase()
		comment = comment.replace(/[-°!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/gm, ' ')
		comment = comment.replace(/[ ]{2,}/gm, ' ')
		comment = comment.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
		return comment
	})
}

const getMetaData = comments => {
	const commentsMetaData = []
	const positiveWords = fs.readFileSync('positive-words.txt', {encoding: 'UTF-8'}).split(/\r?\n/)
	const negativeWords = fs.readFileSync('negative-words.txt', {encoding: 'UTF-8'}).split(/\r?\n/)
	comments.forEach(comment => {
		const commentAsArray = comment.split(' ')
		let positiveWordsCount = 0
		let negativeWordsCount = 0
		commentAsArray.forEach(commentWord => {
			if (positiveWords.includes(commentWord)) {
				positiveWordsCount++
			}
			if (negativeWords.includes(commentWord)) {
				negativeWordsCount++
			}
		})
		commentsMetaData.push({
			comment,
			letters_count: comment.length,
			word_count: commentAsArray.length,
			positive_words: positiveWordsCount,
			negative_words: negativeWordsCount
		})
	})
	return commentsMetaData
}

const getComments = async () => {
	let comments = await fetchComments()
	comments = sanitizeComments(comments)
	comments = getMetaData(comments)
	console.log(comments)
}

getComments()