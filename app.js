const { App } = require("@slack/bolt");
const { channel } = require("diagnostics_channel");
const fs = require('fs');
require("dotenv").config();


// Obtain data from json file
let raw = fs.readFileSync('db.json');
let faqs = JSON.parse(raw);

// Starts the app
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Find conversation ID using the conversations.list method
async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.conversations.list({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
    });

    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        // Print result
        console.log("Found conversation ID: " + conversationId);
        // Break from for loop
        break;
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}

// Find conversation with a specified channel `name`
findConversation("making-memes");

// Post your message
async function publishWednesday(id, blocks) {
  try {
    const result = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: "C04HE15K3V3",
      blocks: [
        {
          "type": "image",
          "image_url": "https://cdn-useast1.kapwing.com/collections/video_image-ivrEC4x7V7.jpeg",
          "alt_text": "It's a better day when it's Wednesday"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Looks like it's Wednesday"
          }
        },
        {
          "type": "image",
          "image_url": "https://ahseeit.com//king-include/uploads/2021/05/dqujxbapdg171-8737728689.jpg",
          "alt_text": "Don't ruin today, it's Wednesday my dudes"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "You guessed it"
          }
        },
        {
          "type": "image",
          "image_url": "https://i.redd.it/zofukaegglzz.jpg",
          "alt_text": "Frog Wednesday"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "This frog remembers, do you?"
          }
        }
        ]
    });
    console.log(result);
  } catch(err) {
    console.error(err);
  }
}
publishWednesday();

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

