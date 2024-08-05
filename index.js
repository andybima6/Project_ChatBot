const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

// Mengirimkan data dari html ke nodejs
const io = require("socket.io")(server);

// Inisialisasi konfigurasi OpenAI dengan API key dari .env
const config = new Configuration({
  apiKey: process.env.API_TOKEN,
});

const openai = new OpenAIApi(config);

// Log the API key to verify it's being read correctly
console.log("API Key:", process.env.API_TOKEN);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

// Basic route for testing
app.get("/test", (req, res) => {
  res.send("Server is working!");
});

// Port
server.listen(3000, () => console.log("Server berjalan di localhost:3000"));
