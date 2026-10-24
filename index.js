const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/mathman-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

// Keep your original mathman-help handler here.
app.command("/mathman-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `Mathman Commands:
/mathman-ping
/mathman-help
/mathman-catfact
/mathman-derive
/mathman-factor
/mathman-integrate
/mathman-zeroes
/mathman-simplify`
  });
});

app.command("/mathman-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: response.data.fact });
  } catch (err) {
    console.error(err);
    await respond({ text: "Failed to get a cat fact." });
  }
});

app.command("/mathman-derive", async ({ ack, command, respond }) => {
  await ack();

  try {
    const expression = encodeURIComponent(command.text.trim());
    const response = await axios.get(
      `https://newton.vercel.app/api/v2/derive/${expression}`
    );

    await respond({ text: `Derivative:\n${response.data.result}` });
  } catch (err) {
    console.error(err);
    await respond({ text: "Failed to calculate the derivative." });
  }
});

//factor command
app.command("/mathman-factor", async ({ ack, command, respond }) => {
  await ack();

  try {
    const expression = encodeURIComponent(command.text.trim());
    const response = await axios.get(
      `https://newton.vercel.app/api/v2/factor/${expression}`
    );

    await respond({ text: `Factorised:\n${response.data.result}` });
  } catch (err) {
    console.error(err);
    await respond({ text: "Failed to factorise the expression." });
  }
});

app.command("/mathman-integrate", async ({ ack, command, respond }) => {
  await ack();

  try {
    const expression = encodeURIComponent(command.text.trim());

    const response = await axios.get(
      `https://newton.vercel.app/api/v2/integrate/${expression}`
    );

    const result = String(response.data.result).trim();

    console.log("Integration result:", result);

    await respond({
      text: `Integrated:\n${result}${/\+\s*C\b/.test(result) ? "" : " + C"}`
    });
  } catch (err) {
    console.error(err);
    await respond({ text: "Failed to calculate the integral." });
  }
});

app.command("/mathman-zeroes", async ({ ack, command, respond }) => {
  await ack();

  try {
    const expression = encodeURIComponent(command.text.trim());
    const response = await axios.get(
      `https://newton.vercel.app/api/v2/zeroes/${expression}`
    );

    await respond({ text: `Zeroes:\n${response.data.result}` });
  } catch (err) {
    console.error(err);
    await respond({ text: "Failed to find the zeroes." });
  }
});

app.command("/mathman-simplify", async ({ ack, command, respond }) => {
  await ack();

  try {
    const expression = encodeURIComponent(command.text.trim());
    const response = await axios.get(
      `https://newton.vercel.app/api/v2/simplify/${expression}`
    );

    await respond({ text: `Simplified:\n${response.data.result}` });
  } catch (err) {
    console.error(err);
    await respond({ text: "Failed to simplify the expression." });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();