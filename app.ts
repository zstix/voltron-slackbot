import fetch from "node-fetch";
import { App } from "@slack/bolt";
import { createEventAdapter } from "@slack/events-api";

require("dotenv").config();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const token = process.env.ACCESS_TOKEN;
const signingSecret = process.env.SIGNING_SECRET;

const app = new App({ token, signingSecret });
const slackEvents = createEventAdapter(signingSecret);

app.command("/voltron", async ({ ack, payload }) => {
  ack();

  try {
    const { text } = payload;
    const command = text.split(" ")[0];

    if (command !== "cat") {
      await app.client.chat.postEphemeral({
        token,
        user: payload.user_id,
        channel: payload.channel_id,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "I only provide cat pictures at the moment.",
            },
          },
        ],
        text: "Cat picture",
      });

      return;
    }

    const resp = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await resp.json();
    const image_url = data[0].url;

    await app.client.chat.postMessage({
      token,
      channel: payload.channel_id,
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: ":joy_cat: I found this cat for you:" },
        },
        {
          type: "image",
          image_url,
          alt_text: "Cat picture",
        },
      ],
      text: "Cat picture",
    });
  } catch (error) {
    console.log("[ERROR] Error responding to /helloworld");
    console.dir(error, { depth: 3 });
    console.error(error);
  }
});

slackEvents.on('message', (event) => {
  console.log('message event');
  console.log(event);
});

(async () => {
  // await app.start(port);
  await slackEvents.start(port);

  console.log(`[Voltron] App is running on port ${port}`);
})();
