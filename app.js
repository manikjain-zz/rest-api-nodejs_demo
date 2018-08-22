const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to the DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/apiModel', { useNewUrlParser: true })
    .then(() => { 
        console.log('Connected to the DB...');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

const category = require('./routes/category');
const product = require('./routes/product');

app.use(bodyParser.json());

// Middleware
app.use(logger('dev'));

// Routes
app.use('/api/category', category);
app.use('/api/product', product);

// Catch 404 errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

// this error middleware checks for invalid req body format like missing quotes etc. and throws a descriptive error
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(500).send({
        message: "Invalid Body Format"
    });
}
next();
});

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err: {};
    const status = err.status || 500;

    // Respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    });

    // Respond to ourselves
    console.error(err)

});

// Start the server
const port = app.get('port') || 4322;
app.listen(port, () => console.log(`Listening on port ${port}`));