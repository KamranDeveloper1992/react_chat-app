const express = require("express");
const cors = require("cors");
const http = require("http");
const mysql2 = require("mysql2");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("chat message", (message) => {
    io.emit("chat message", { id: socket.id, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// MySQL bağlantısı
const con = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Yeni kullanıcı ekleme
app.post("/insert", (req, res) => {
  const { NickName, Gmail, Password } = req.body;

  if (!NickName || !Gmail || !Password) {
    return res.status(400).json({ error: "Boş alan bırakmayın." });
  }
  if (Password.length < 8) {
    return res.status(400).json({ error: "Şifre en az 8 karakter olmalıdır." });
  }

  con.query(
    "SELECT * FROM `chat_user` WHERE user_lastname = ?",
    [Gmail],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Veritabanı hatası." });
      }
      if (result.length > 0) {
        return res
          .status(400)
          .json({ error: "Bu e-posta ile daha önce kayıt olmuşsunuz." });
      }

      con.query(
        "INSERT INTO `chat_user` (uer_name, user_lastname, user_password) VALUES (?, ?, ?)",
        [NickName, Gmail, Password],
        (error) => {
          if (error) {
            return res.status(500).json({ error: "Veritabanı hatası." });
          }
          res.status(200).json({ success: "Kayıt başarılı." });
        }
      );
    }
  );
});

app.post("/login", (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({ error: "Boş alan bırakmayın." });
  }

  con.query(
    "SELECT * FROM chat_user WHERE uer_name = ? AND user_password = ?",
    [nickname, password],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Veritabanı hatası." });
      }
      if (result.length > 0) {
        res.status(200).json({ success: "Giriş başarılı." });
      } else {
        res.status(401).json({
          error: "Böyle bir hesap yok, lütfen kayıt olun.",
        });
      }
    }
  );
});

app.get("/contact", (req, res) => {
  con.query("SELECT * FROM chat_user", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Veritabanı hatası." });
    }
    res.status(200).json({ ContactList: result });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
