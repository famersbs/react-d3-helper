import express from 'express';
import path from 'path';

const APP_PORT = 3000;

// The server is just a simple Express app
var app = express();

// Serve HTML
app.get('/', (req, res, next) => {
    res.render(path.resolve(__dirname, '..', 'views', 'index.ejs'), {});
});

// Resources
app.use("/", express.static( __dirname + "/../public/"));

app.listen( APP_PORT, function() { 
	console.log('Listening on '+APP_PORT+'...');
});