require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
    // console.log(orgVal.JSON);
    orgVal = JSON.parse(orgVal);
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Mirzapur&units=metric&appid=2dea1be0259bc5efdb666cfc09839815"
        )
            .on("data", (chunk) => {
                // console.log(chunk);
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0][main][temp]);
                // const realTimeData = arrData
                //     .map((val) => replaceVal(homeFile, val))
                //     .join("");
                const realTimeData = replaceVal(homeFile, chunk);
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
    } else {
        res.end("File not found");
    }
});

server.listen(8000, "127.0.0.1");