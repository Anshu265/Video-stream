const express = require('express');
const fs = require("fs");
const app = express();


app.get("/" , function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video" , function (req , res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range Header");
    }

    const videoPath = "bigbuck.mp4"; 
    const videoSize = fs.statSync("bigbuck.mp4").size;

    const CHUNK_SIZE = 10 ** 6;   //1Mb
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE , videoSize - 1);

    //Create Headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`, 
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    //HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    //create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, {start, end});

    //Stream the video chunk to the client:
    videoStream.pipe(res);

});

app.listen(5000, function(req, res) {
    console.log("Listening on port 5000!")
});

