const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

// Inisialisasi socket.io
const io = require("socket.io")(server);

// Inisialisasi konfigurasi OpenAI dengan API key dari .env
const configuration = new Configuration({
  apiKey: process.env.API_TOKEN,
});

const openai = new OpenAIApi(configuration);

// Log API key untuk memverifikasi apakah sudah dibaca dengan benar
console.log("API Key:", process.env.API_TOKEN);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

// Rute dasar untuk pengujian
app.get("/test", (req, res) => {
  res.send("Server is working!");
});

// Pengaturan WebSocket antara index.js dan script.js
io.on("connection", function (socket) {
  // listener event "newuser" dari klien
  socket.on("newuser", function (username) {
    console.log(username);
  });

  // listener event "prompt" dari klien
  socket.on("prompt", function (data) {
    console.log(data);

    // Meminta respon dari model OpenAI
    const response = openai.createCompletion({
      model: "text-davinci-003",
      prompt: data,
      temperature: 0.7, // Kontrol seberapa acak jawaban (semakin tinggi nilai, semakin acak jawabannya)
      max_tokens: 256, // Jumlah maksimal token (kata atau fragmen kata) dalam jawaban
      top_p: 1, // Probabilitas kumulatif untuk sampling
      frequency_penalty: 0, // Penalti untuk mengurangi pengulangan frasa
      presence_penalty: 0, // Penalti untuk diversifikasi konten
      stop: ["Human:", "AI:", "Human:", "AI:"], // Sequens penghentian, berhenti setelah 4 step agar jawaban tidak menjadi tidak logis
    });

    // Mengirimkan respon dari OpenAI ke klien
    response.then((incomingData) => {
      const message = incomingData.data.choices[0].text;
      socket.emit("chatbot", {
        username: "bot",
        text: message,
      });
    }).catch((err) => {
      console.log(err);
    });
  });
});

// Menjalankan server
server.listen(3000, () => console.log("Server berjalan di localhost:3000"));
