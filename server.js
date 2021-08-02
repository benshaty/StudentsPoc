// File dependencies
const express = require('express');
const session = require('express-session');
const apiRouter = require('./models/apiRouter');
const pages = require('./models/pages');
const db = require('./models/db');
const app = express();

// setup local application data
app.use(function (req, res, next) {
    res.locals = {
        name : "Grade Managment System",
        title : "P.O.C"
    };
    next();
 });


// set the port for the webserver
const port = (process.env.PORT) ? process.env.PORT : 4500;

// set the view engine
app.set('view engine', 'ejs');

// Return static page - index.html
//app.use(express.static(__dirname));

// access the public folder as root
app.use(express.static('public'));

// Use middlewares (app level - not controller level):
// this middleware takes the content of the request`s body, 
//and parses it to json format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// this middleware takes care of the sessions
// cookie maxAge set in miliseconds 
// Ex. for 1 day
// 1 * 24 * 60 * 60 * 1000
// day * hour * minutes * seconds * miliseconds

app.use(session({
	secret: 'SampleSecretForEduOnly!!!!',
	resave: true,
	saveUninitialized: true,
    rolling: true, // <-- Set `rolling` to `true`
    cookie: {
        maxAge: Date.now() +  (20 * 1000)
      }
}));

// error reporting
app.use(function (err, req, res, next) {
    console.log('This is the invalid field ->', err.field)
    next(err)
});

// add the models routes
app.use("/", pages);
app.use("/api", apiRouter);

// all other requests that not resolve any model
app.all('*', (req,res, next) => {
    res.status(403).render("pages/error403.ejs");
});

// connect and start webserver
db.connect()
.then(()=>{
        app.listen(port, () => { console.log(`Server is running in port ${port}`) });
    }
)
.catch((err)=>{
    console.log(err);
    process.exit();
});