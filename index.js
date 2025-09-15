const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const mysql = require("mysql2");
const multer = require('multer');
const port = 9000;

const connection = mysql.createConnection({
    host: "localhost",
    user: "testuser",
    database: "ChatApp",
    password: "testpassword"
});

const dpStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "public/uploads/profilePhotos/"); }
});
const bgStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "public/uploads/background/"); }
});
const dpUpload = multer({ storage: dpStorage });
const bgUpload = multer({ storage: bgStorage });

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

const users = {};
io.on("connection", (socket) => {
    socket.on("register", ({ email }) => {
        users[email] = socket.id;
    });

    socket.on("chat message", (msg) => {
        let sender = msg.sender;
        let receiver = msg.receiver;
        let content = msg.content;

        let q = `INSERT INTO Messages(sender, receiver, content) VALUES(?, ?, ?)`;
        try {
            connection.query(q, [sender, receiver, content], (err, result) => {
                if (err) throw err;
                const target = users[receiver];

                if (target) {
                    io.to(target).emit("then message", { sender: sender, receiver: receiver, content: content });
                }
            });
        } catch (e) {
            console.log(e);
        }
    });

    socket.on("disconnect", () => {
        for (let email in users) {
            if (users[email] === socket.id) {
                delete users[email];
                break;
            }
        }
    });
});

app.post("/signup", (req, res) => {
    let { name: name, email: email, password: password } = req.body;
    let q = `INSERT INTO Users(name, email, password) VALUES(?, ?, ?)`;

    try {
        connection.query(q, [name, email, password], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') { return res.json("This account already exists."); }
                else {
                    return res.json("An error occurred!");
                }
            }
            return res.json("Sign Up successful");
        });
    } catch (e) {
        console.log(e);
    }
});

app.post("/login", (req, res) => {
    let { email: email, password: password } = req.body;
    let q = `SELECT * FROM Users WHERE email=?`;

    try{
        connection.query(q, [email], (err, result) => {
            if (err) throw err;
            if (password.length === 0) {
                return res.json({success: false, message: "User not found"});
            }
            if (password !== result[0].password) { return res.json({success: false, message: "Password incorrect"}); }
            res.json({success: true, email: result[0].email});
            });
    } catch(e){
        res.json({success: false, message: "User not found"});
    }
});

app.post("/loadTheme", (req, res) => {
    let { userEmail } = req.body;
    let q = `SELECT theme FROM Users WHERE email = ?`;

    try {
        connection.query(q, [userEmail], (err, result) => {
            if (err) return res.status(400).json("An error occurred");
            res.json(result[0].theme);
        });
    } catch (e) {
        console.log(e);
    }
});

app.post("/search", (req, res) => {
    let query = req.body.query;
    let q = `SELECT * FROM Users WHERE name LIKE ? OR email LIKE ?`;

    connection.query(q, [`%${query}%`, `%${query}%`], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post("/getContacts", (req, res) => {
    let { userEmail } = req.body;
    let q = `SELECT DISTINCT U.name, U.email, U.dp FROM Users U WHERE U.email IN(
    SELECT C.contact FROM Contacts C WHERE C.user = ?
    UNION
    SELECT M.sender FROM Messages M WHERE M.receiver = ?
    UNION
    SELECT M.receiver FROM Messages M WHERE M.sender = ?) AND U.email != ?`;

    try {
        connection.query(q, [userEmail, userEmail, userEmail, userEmail], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    } catch (e) {
        console.log(e);
    }
});

app.post("/contacts", (req, res) => {
    let { userEmail, contactEmail } = req.body;
    let q = `INSERT INTO Contacts(user, contact, time) VALUES(?, (SELECT email FROM Users WHERE email = ?), NOW())`;

    try {
        connection.query(q, [userEmail, contactEmail], (err, result) => {
            if (err) {
                return res.json({
                    success: false,
                    code: err.code
                });
            }
            res.json(result);
        });
    } catch (e) {
        res.send("An error occurred.")
    }
});

app.post("/getMessages", (req, res) => {
    let { userEmail, currentChat } = req.body;
    let q = `SELECT * FROM Messages WHERE (sender=? AND receiver=?) OR (sender=? AND receiver=?)`;

    try {
        connection.query(q, [userEmail, currentChat, currentChat, userEmail], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    } catch (e) {
        console.log(e);
    }
});

app.post("/deleteMessage", (req, res) => {
    let { messg } = req.body;
    let q = `UPDATE Messages SET content = NULL WHERE id = ?`;

    try {
        connection.query(q, [messg], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    } catch (e) {
        console.log(e);
    }
});

app.post("/changeName", (req, res) => {
    let { userEmail, newName } = req.body;
    let q = `UPDATE Users SET name = ? WHERE email = ?`;

    try {
        connection.query(q, [newName, userEmail], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    } catch (e) {
        console.log(e);
    }
});

app.post("/uploadDp", dpUpload.single("dp image"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let { userEmail } = req.body;
    let filePath = `/uploads/profilePhotos/${req.file.filename}`;
    let q = `UPDATE Users SET dp = ? WHERE email = ?`;

    try {
        connection.query(q, [filePath, userEmail], (err, result) => {
            if (err) return res.status(400).json({ message: "An error occurred" });

            res.status(200).json({
                message: "File uploaded successfully",
                filePath: filePath
            });
        });
    } catch (e) {
        console.log(e);
    }
});

app.post("/bgUpload", bgUpload.single("Image"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let { userEmail } = req.body;
    let filePath = `/uploads/background/${req.file.filename}`;
    let q = `UPDATE Users SET bgImage = ? WHERE email = ?`;

    try {
        connection.query(q, [filePath, userEmail], (err, result) => {
            if (err) return res.status(400).json({ message: "An error occurred" });

            res.status(200).json({
                message: "File uploaded successfully",
                filePath: filePath
            });
        });
    } catch (e) {
        console.log(e);
    }
});

app.post("/setTheme", (req, res) => {
    let { name, userEmail } = req.body;
    let q = `UPDATE Users SET theme = ? WHERE email = ?`;

    connection.query(q, [name, userEmail], (err, result) => {
        if (err) return res.status(400).json({ message: "An error occurred" });
        res.json(result);
    });
});

app.get("/chat", (req, res) => {
    let { email } = req.query;
    let q = `SELECT * FROM Users WHERE email=?`;

    connection.query(q, [email], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.send("<h1>User not found</h1>");
        }
        res.render("chat.ejs", { result: result[0] });
    });
});

app.get("/logout", (req, res) => {
    res.redirect("/");
});

server.listen(port, () => {
    const link = "http://localhost:9000/";
    console.log(`Server is listening on port ${port}. You can view it through this link: "${link}".`);
});