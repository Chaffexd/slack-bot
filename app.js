const { App } = require("@slack/bolt");
const fs = require('fs');
require("dotenv").config();

// Obtain data from json file
let raw = fs.readFileSync('db.json');
let faqs = JSON.parse(raw);

// Helper functions
let userMessage = ["hi", "hello", "hey"];

// Starts the app
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Commands to listen to
app.command("/help", async ({ command, ack, say }) => {
    try {
      await ack();
      let message = { blocks: [] };
      faqs.data.map((faq) => {
        message.blocks.push(
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Question ❓*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.question,
            },
          },
          {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Answer ✔️*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: faq.answer,
              },
            }
        );
      });
      say(message);
    } catch (error) {
      console.log("err");
      console.error(error);
    }
});

app.message(/meme/, async ({ command, say }) => {
    try {
      let message = { blocks: [] };
      const productsFAQs = faqs.data.filter((faq) => faq.keyword === "meme");
  
      productsFAQs.map((faq) => {
        message.blocks.push(
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Question ❓*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.question,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Answer ✔️*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.answer,
            },
          }
        );
      });
  
      say(message);
    } catch (error) {
      console.log("err");
      console.error(error);
    }
});

app.command("/update", async ({ command, ack, say }) => {
    try {
      await ack();
      const data = command.text.split("|");
      const newFAQ = {
        keyword: data[0].trim(),
        question: data[1].trim(),
        answer: data[2].trim(),
      };
      // save data to db.json
      fs.readFile("db.json", function (err, data) {
        const json = JSON.parse(data);
        json.data.push(newFAQ);
        fs.writeFile("db.json", JSON.stringify(json), function (err) {
          if (err) throw err;
          console.log("Successfully saved to db.json!");
        });
      });
      say(`You've added a new FAQ with the keyword *${newFAQ.keyword}.*`);
    } catch (error) {
      console.log("err");
      console.error(error);
    }
});

app.message(/\b(?:hey|hello|hi)\b/, async ({ command, say }) => {
    try {
      say("Yaaay! that command works!");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

(async() => {
    const port = 3000;
    await app.start(process.env.port || port);
    console.log(`Slack Bolt App is running on ${port}`)
})();

