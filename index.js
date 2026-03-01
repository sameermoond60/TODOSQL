const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const mysql = require("mysql2");

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const connection = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    database: `project1`,
    password: `zxcasdqwe123@#$`

});
app.get("/", (req, res) => {
    res.render("interface.ejs");
})
app.get("/signup", (req, res) => {
    res.render("signuppage.ejs");
})
app.get("/forgot-password", (req, res) => {
    res.render("forgot-password.ejs");
})
app.post("/login", (req, res) => {
    let { username, password } = req.body;
    if (username === "sameer" && password === "123") {
        return res.redirect("/homepage");
    } else {
        res.send("YOUR PASSWORD IS WRONG PLEASE CHECK IT ");
    }
})

app.post("/tasks", (req, res) => {
    let task = req.body.task;

    if (task.trim() === "") {
        return res.redirect("/homepage");
    }

    let q = `INSERT INTO TASKS (task, is_done) VALUES (?, ?)`;

    connection.query(q, [task, 0], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        res.redirect("/homepage");
    });
});
app.get("/homepage", (req, res) => {
    let q = "SELECT * FROM tasks";

    connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        res.render("homepage.ejs", { tasks: result });
    });
});
app.delete("/tasks/:id", (req, res) => {
    let id = Number(req.params.id);
    let q = `DELETE FROM tasks WHERE id = ?`;

    connection.query(q, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        res.redirect("/homepage");
    });
});

app.listen(port, () => {
    console.log(`listening to the port ${port}`);
})