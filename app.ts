import { App } from "@slack/bolt";
import fetch from "node-fetch";

require("dotenv").config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new App({
  token: process.env.ACCESS_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
});

app.command("/voltron", async ({ ack, payload }) => {
  ack();

  try {
    const { text } = payload;
    const command = text.split(" ")[0];

    if (command !== "cat") {
      await app.client.chat.postMessage({
        token: process.env.ACCESS_TOKEN,
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
      token: process.env.ACCESS_TOKEN,
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

(async () => {
  await app.start(PORT);

  console.log(`[Voltron] App is running on port ${PORT}`);
})();
