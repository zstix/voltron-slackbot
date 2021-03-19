import { App } from "@slack/bolt";

require("dotenv").config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new App({
  token: process.env.ACCESS_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
});

app.event("app_home_opened", async ({ event, client, context }) => {
  try {
    // view.publish is the method that your app uses to push a view to the Home tab
    await client.views.publish({
      // user that opened the app's home
      user_id: event.user,
      // the view object that appears in the app hom
      view: {
        type: "home",
        callback_id: "home_view",

        // body of the view
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text: "*Welcome* to _Voltron_ :tada:" },
          },
          { type: "divider" },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "A button that does nothing..._yet_:",
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Click me!" },
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.log("[ERROR] Error responding to app_home_opened event");
    console.error(error);
  }
});

app.command("/helloworld", async ({ ack, payload, context }) => {
  // acknowledge the command request
  ack();

  console.dir(payload, { depth: 4 });

  try {
    await app.client.chat.postMessage({
      token: process.env.ACCESS_TOKEN,
      channel: payload.channel_id,
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: "Hellooooo _world_ :robot_face:" },
        },
      ],
      text: "Message from Test App",
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
