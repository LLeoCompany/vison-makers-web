const functions = require("firebase-functions");
const axios = require("axios");

exports.sendMessageToSlack = functions.https.onRequest(async (req, res) => {
  console.log("Received request:", req.method, req.body);

  if (req.method !== "POST") {
    console.log("Method not allowed");
    return res.status(405).send("Method Not Allowed");
  }

  const { text } = req.body;

  if (!text) {
    console.log("Text is required");
    return res.status(400).send("Text is required");
  }

  try {
    const response = await axios.post(
      "https://hooks.slack.com/services/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",
      {
        text: text,
      }
    );
    console.log("Message sent to Slack");
    res.status(200).send("Message sent to Slack");
  } catch (error) {
    console.error("Error sending message to Slack:", error);
    res.status(500).send("Error sending message to Slack");
  }
});

exports.sendMessageGolfToSlack = functions.https.onRequest(async (req, res) => {
  console.log("Received request:", req.method, req.body);

  if (req.method !== "POST") {
    console.log("Method not allowed");
    return res.status(405).send("Method Not Allowed");
  }

  const { text } = req.body;

  if (!text) {
    console.log("Text is required");
    return res.status(400).send("Text is required");
  }

  try {
    const response = await axios.post(
      "https://hooks.slack.com/services/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",
      {
        text: text,
      }
    );
    console.log("Message sent to Slack");
    res.status(200).send("Message sent to Slack");
  } catch (error) {
    console.error("Error sending message to Slack:", error);
    res.status(500).send("Error sending message to Slack");
  }
});
