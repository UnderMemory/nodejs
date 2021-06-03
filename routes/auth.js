const collections = require('../collections')
module.exports = function(app){

  app.get('/login', (req, res) => {
    res.send({ user: req.session.user || false});
  });

    const GENERIC_ERROR_MESSAGE = 'Login or password is incorect'
    app.post('/login', (req, res) => {
        console.log('POST test', req.body);
        console.log('POST test', req.body.login);
      
        const login = req.body.login || '';
        const pw = req.body.pw || '';
      
        if (!login) {
          return res.status(401).send('Login is required');
        }
        if (!pw) {
          return res.status(401).send('Password is required');
        }
        // if (login.length < 5 || login.length > 16 || pw.length<6){
        //   return res.status(401).send(GENERIC_ERROR_MESSAGE);
        // }
        
        //Une fois que c'est ok, on cherche en DB

        //En attendant on fait un test "en dur"

        collections.Users.findOne({
          login
        }).then(user => {
          if(!user || !user.checkPassword(pw)) {
            return res.status(401).send(GENERIC_ERROR_MESSAGE);
          }

          req.session.user = user.toObject();

          user.last_date_connection = Date.now();
          user.save().then(() => {
            req.session.save(() => {
              res.send({user: req.session.user});
            });
          });
        }).catch(err => {
          console.error('LOGIN server error', err);
          res.status(500).send('Server error unknow');
        });
    }); 

    app.post('/logout', (req, res) => {
      // TODO : pas de param
    });

    app.post('/register', (req, res) => {
      const login = (req.body.login || '').toString();
      const pw = (req.body.pw || '').toString();
      const email = (req.body.email || '').toString();

      if (!email || !login || !pw) {
        return res.status(401).send('Il manque un champs');
      };

      const newUser = collections.Users.create({
        login,
        password: pw,
        email
      }).then(newUser => {
        res.send('Welcome ' + newUser.login)
      }).catch(e => {
          console.error('Register error', e);
          res.status(500).send('Register error');
        })
    });
}