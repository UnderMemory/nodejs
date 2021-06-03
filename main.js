// const express = require('express');
// const toto = require('./toto');

// console.log('coucou');
// toto();




// const { response } = require('express');
// const http = require('http');

// const server = http.createServer((req, response) => {
//     response.writeHead(200, { 'Content-Type': 'text/html' });
//     response.end(JSON.stringify({
//       data: 'Hello World!',
//       toto: {
//           test: 123
//       }
//     }));
//   });
  
//   const PORT = 1234;
//   const ERROR_CODES = {
//       EADDRINUSE: 'EADDRINUSE',
//   };

//   server.listen(PORT, (err) => {
//       console.log('server listening', PORT);
//   });

//   server.on('error', (e) => {
//     if (e.code === ERROR_CODES.EADDRINUSE) {
//       console.log('Address in use, retrying...');
//       setTimeout(() => {
//         server.close();
//         server.listen(PORT);
//       }, 1000);
//     }
//   });

const express = require('express');
const bodyParser =  require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const collections = require('./collections')

var expressSessionOptions = {
    secret: "clé secrète",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 10 * 60 * 60 * 1000, // durée de vie du cookie
    },
  };
  var cookieParserOptions = {
    httpOnly: false,
};

const app = express();
const PORT = 3000;

const sessionMiddleware = session(expressSessionOptions);
const cookieParserMiddleware = cookieParser(
    "clé secrète",

    cookieParserOptions,
);
app.use(cookieParserMiddleware);
app.use(sessionMiddleware);

app.use(express.static('./public'));
app.use(bodyParser.json());


// app.use((req, res, next) => {
// // if(!req.originalUrl.match('login') && !req.session.isLogged) {
// //         return res.redirect('/login')
// //     }
// //     console.log('Demande de l\'url', req.originalUrl);
//     console.log(req.session);
//     if(!req.session.numero){
//         req.session.numero = 0;
//     }
//     ++req.session.numero;
//     req.session.save(() => {
//         next();
//     });
// });
    
    
    require('./routes/test')(app);
    require('./routes/auth')(app);
    require('./routes/items')(app);  
    require('./routes/products')(app); 
 
app.listen(PORT, () => console.log('listening port', PORT));
