import dotenv from "dotenv";
import OpenAI, { Configuration, OpenAIApi } from "openai";

dotenv.config();
export const ChatBot = async (req, res) => {
  const configuration = new Configuration({
    organization: "org-xRx1KtETkf7By6FYejMDAGuz",
    apiKey: process.env.API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  let messages = [
    {
      role: "system",
      content:
        "You are a cool code assistant you provide only code for all the questions asked for particular answer",
    },
  ];
  const { message } = req.body;
  try {
    messages.push({ role: "system", content: message });
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    console.log(response.data.choices[0].message);
    if (response.data.choices[0].message) {
      res.status(200).json({ message: response.data.choices[0].message });
    }
  } catch (error) {}
};
