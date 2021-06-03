module.exports = function(app){
    app.get('/test', (req, res) => {
        console.log('Demande de la page test');
        res.send({
            user: {
                nickname: "Toto",
                age: 21,
                adress: "inconnue"
            }
        });
    });
    
    app.post('/test', (req, res) => {
        console.log('POST test', req.body);
        console.log('POST test', req.body.login);
    
        const email = req.body.email || '';
        const login = req.body.login || '';
        const pw = req.body.password || '';
        
        if(!email){
            return res.status(401).send('Email is required')
        }
        if(!login){
            return res.status(401).send('Login is required')
        }
        if(!pw){
            return res.status(401).send('Password is required')
        }
        if(email.length<10 || email.length>30){
            return res.status(401).send('Email incorrect')
        }
        if(login.length<6 || login.length>16){
            return res.status(401).send('Login incorrect')
        }
    
        res.send('ok');


    app.get('/books', (req, res) => {
        console.log('Datail du livre');
        res.send({
        });
    });
    });     
}