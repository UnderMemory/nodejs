const items = require('../data/items.json');

module.exports = function(app){
    app.get('/items', (req, res) => {
        res.send( items );
    });
}