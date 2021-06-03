const collections = require('../collections');

module.exports = function(app){
    app.get('/products', async (req, res) => {
        try{
            //.lean => méthode de mongo -> donne moi le résultat brut de json.
            const products = await collections.Products.find().lean()
            res.send(products);
        } catch(e) {
            console.error('Failed get products, error: ', e);
            res.status(500).send('Oops an error occured');
        }
    });

    const AUTHORIZED_BASKET_FIELDS = {
        producID: {
            check: v => !isNaN(v),
            modifier: v => v >> 0,
        },
        quantity: {
            check: (v) => !isNaN(v),
            modifier: (v) => v >> 0,
        }, 
    };

    app.get('.basket', (req, res) =>{
        res.send(req.session.basket || [] );
    });
    app.post('/basket', (req, res) => {
        const userBasket = req.body.basket || [];

        if(!userBasket.forEach) {
            return res.status(401).send('Not an array');
        }

        var validBasket= [];
        for(var i = 0; i<userBasket.length; ++i) {
            var basketItem = userBasket[i];
            var isValid = false;

            for(var k in basketItem) {
                if(!AUTHORIZED_BASKET_FIELDS[k]){
                    delete basketItem[k];
                    break;
                }

                basketItem[k] = AUTHORIZED_BASKET_FIELDS[k].modifier(basketItem[k]);

                if(!AUTHORIZED_BASKET_FIELDS[k].check(basketItem[k])) {
                    isValid = true;
                }
            }

            if(isValid) {
                validBasket.push(basketItem);
            }
        }

        req.session.basket = validBasket;
        req.session.save(() => {
            res.send('ok');
        })
    });
}