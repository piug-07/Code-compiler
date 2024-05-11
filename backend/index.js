const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const { executeJs } = require('./executeJs');
const Job = require("./models/Job");
mongoose.connect(
    "mongodb+srv://guptapiyush315:vYWZrmMtHp395W29@real-estate.esrb235.mongodb.net/?retryWrites=true&w=majority",
    {
        dbName: "Online_Compiler",
    }
).then(() => {
    console.log("Successfully connected to MongoDB Database");
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
    let job;
    try {
        // need to generate a c++ file  
        const filepath = await generateFile(language, code);

        job = await new Job({ language, filepath }).save();
        const jobId = job["_id"];
        console.log("🚀 ~ app.post ~ job:", job);

        res.status(201).json({ jobId });
        // we need to run the code now and send resp
        job["startedAt"] = new Date();
        let output;
        if (language == "cpp") {
            output = await executeCpp(filepath);
        } else {
            output = await executePy(filepath);
        }
        job["completedAt"] = new Date();
        job["status"] = "success";
        job["output"] = output;
        await job.save();
        console.log({ filepath, output });
        // return res.json({ filepath, output });
    } catch (error) {
        job["completedAt"] = new Date();
        job["status"] = "error";
        job["output"] = error;
        await job.save();
        return res.status(500).json({ success: false, error });

    }


});

app.get('/status', async (req, res) => {
    const jobId = req.query.id;
    if (jobId === undefined) {
        return res.status(400).json({ success: false, error: "missing id query in param" });
    }
    try {
        const job = await Job.findById(jobId); 
        if (!job) {
            return res.status(404).json({ success: false, error: "Job not found" });
        }
        return res.json({ success: true, job });
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
});

app.listen(Port, () => {
    console.log(`App listening on port http://localhost:${Port}`);
});