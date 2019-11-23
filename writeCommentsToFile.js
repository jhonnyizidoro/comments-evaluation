const request = require('request')
const fs = require('fs')

const writeCommentsToFile = () => {
	const links = fs.readFileSync('links.txt', {encoding: 'UTF-8'}).split(/\r?\n/)
	links.forEach((link, index) => {
		request(link, (error, response, body) => {
			if (error) {
				return console.log(error)
			}
			if (!body.match(/(?<=tooltip-full-body">)(.*)(?=<\/div>)/gm)) {
				return console.log(`Produto sem comentário: ${link}`)
			}
			const comments = []
			const commentsTitle = body.match(/(?<=tooltip-full-body">)(.*)(?=<\/div>)/gm).slice(0, 3)
			const commentsBody = body.match(/(?<=tooltip-title">)(.*)(?=<\/h4>)/gm).slice(0, 3)
			const commentsEvaluation = body.match(/star-container">([\s\S]*?)<\/span>/gm).slice(1, 4).map(evaluationHTML => evaluationHTML.match(/id="reviewFullStar/gm).length)
			comments.push(commentsTitle.map((title, index) => `${commentsTitle[index]} ${commentsBody[index]}|${commentsEvaluation[index]}\r\n`))
			fs.appendFile('./comments.txt', comments, err => err ?  console.log(err) : console.log(`Link ${index} done!`))
		})
	})
}

writeCommentsToFile()