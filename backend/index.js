const express = require('express');
const { generateFile } = require('./generateFile');


Port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/run', async (req, res) => {
    const { language = "cpp", code } = req.body;

    if (code === undefined) {
        return res.status(400).json({ success: false, error: "code are required" });
    }
    // need to generate a c++ file  
    const filepath = await generateFile(language, code);

    // we need to run the code now and send resp

    return res.json({ filepath });

});

app.listen(Port, () => {
    console.log(`App listening on port http://localhost:${Port}`);
});