const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const { executeJs } = require('./executeJs');

mongoose.connect(
    "mongodb+srv://guptapiyush315:vYWZrmMtHp395W29@real-estate.esrb235.mongodb.net/?retryWrites=true&w=majority",
    {
        dbName: "Online_Compiler",
    }
).then(() => {
    console.log("Successfully connected to MongoDB: compilerdb");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


Port = 5000;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.get('/', (req, res) => {
    res.send('Welcome to the Code-Compiler!');
});

app.post('/run', async (req, res) => {
    const { language = "cpp", code } = req.body;

    console.log(language, "Length:", code.length);

    if (code === undefined) {
        return res.status(400).json({ success: false, error: "code are required" });
    }
    try {
        // need to generate a c++ file  
        const filepath = await generateFile(language, code);

        // we need to run the code now and send resp
        let output;
        if (language == "cpp") {
             output = await executeCpp(filepath);
        }else{
             output = await executePy(filepath);
        }
        return res.json({ filepath, output });
    } catch (error) {
        return res.status(500).json({ success: false, error });

    }


});

app.listen(Port, () => {
    console.log(`App listening on port http://localhost:${Port}`);
});