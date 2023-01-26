/** @format */

// const Configuration = require("openai");
// const OpenAIApi = require("openai");
const { Configuration, OpenAIApi } = require("openai");
const { writeFileSync } = require("fs");
require("dotenv").config();

const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

exports.generateAIImage = async (prompt) => {
	const result = await openai.createImage({
		prompt,
		n: 1,
		size: "1024x1024",
		user: "divyanshu2307",
	});

	const url = await result.data.data[0].url;

	//console.log(url);

	// const image = await fetch(url);
	// const blob = await image.blob();
	// const buffer = Buffer.from(await blob.arrayBuffer());
	// writeFileSync(`./img/${Date.now()}`, buffer);
	return url;
};

exports.chatgpt = async (prompt) => {
	console.log(prompt);
	const completion = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: prompt,
		temperature: 0,
		max_tokens: 1000,
		top_p: 1,
		frequency_penalty: 0.5,
		presence_penalty: 0,
	});
	console.log(completion.data.choices[0].text);
	return completion.data.choices[0].text;
};
