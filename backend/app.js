const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/authDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const noteSchema = new mongoose.Schema({
    email: { type: String, required: true },
    text: { type: String, required: true }
})

const User = mongoose.model("User", userSchema);
const Note = mongoose.model("Note", noteSchema);

app.post("/api/register", async (req, res) => {
    if (!await User.findOne({ email: req.body.email })){
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(req.body.password, salt);
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashed_password
        })
        res.json({ status: "ok" });
    } else{
        res.json({ status: "error" });
    }
})

app.post("/api/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    console.log("Logs");
    console.log(user);

    if (!user){
        return res.json({ status: "error", user: false });
    }

    console.log(req.body.password);
    console.log(user.password);
    const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);

    console.log(isCorrectPassword);

    if (isCorrectPassword){
        const token = jwt.sign({
            name: user.name,
            email: user.email
        }, "secret");
        
        res.json({ status: "ok", user: token })
    } else{
        res.json({ status: "error", user: false })
    }

})

app.post("/api/home", async (req, res) => {
    const token = req.headers["x-access-token"];
    console.log(`Token: ${token}`);

    try{
        const decoded = jwt.verify(token, "secret");
        const email = decoded.email;

        const notesRaw = await Note.find({ email });
        let notes = [];

        notesRaw.map((elem) => {
            notes.push(elem.text);
        })

        res.json({ status: "ok", notes });

    } catch(e){
        res.json({ status: "error" });
    }
})

app.listen(1000, () => {
    console.log("Server running at port 1000");
})