const app = require("./src/app");
const http = require("http");
const server = http.createServer(app);


server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});