const { config } = require("dotenv");
const app = require("./app");
config({ path: "./config.env" });

app.listen("3000", (err) => {
  if (err) {
    console.log("App can not run", err);
    process.exit(1);
  }
  console.log("Server Listening at http://localhost:3000");
});
