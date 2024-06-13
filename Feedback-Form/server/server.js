const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Define a Feedback schema and model
const feedbackSchema = new mongoose.Schema({
    title: String,
    text: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes
app.post("/add", async (req, res) => {
    try {
        const newFeedback = new Feedback({
            title: req.body.title,
            text: req.body.content,
        });
        await newFeedback.save();
        res.send({ error: false });
    } catch (err) {
        res.send({ error: true });
    }
});

app.get("/feedback", async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.send({ feedback: feedback });
    } catch (err) {
        res.send({ error: true });
    }
});

app.put("/edit", async (req, res) => {
    try {
        await Feedback.updateOne({ _id: req.body.id }, {
            title: req.body.title,
            text: req.body.content,
        });
        res.send({ error: false });
    } catch (err) {
        res.send({ error: true });
    }
});

app.post("/delete", async (req, res) => {
    try {
        await Feedback.deleteOne({ _id: req.body.id });
        res.send({ error: false });
    } catch (err) {
        res.send({ error: true });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log("app is running on port : ", port);
});
