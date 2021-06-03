const collections = require('../collections');
const mongoose = require('mongoose');
const data_products = require('../data/products.json').products;

const data = {
    Products: data_products
}

function make(type){
    //res = resolve ; rej = reject
    return new Promise((res, rej) => {
        console.log('make' + type);
        collections[type].find({}, (err, models) => {
            if(err) {
                console.error('Cannot find' + type + '. Aborting');
                throw err;
            }

            console.log('now delete many');
            collections[type].deleteMany().then(() => {
                console.log(
                    'trying to fill ' + type + ' with data length = ' + data[type].length,
                );

                const chunks = [];
                for(var i =0; i<data[type].length; i+= 50) {
                    chunks.push(data[type].slice(i, i+50));
                }
                if(chunks.length === 0 ) return res();
                insertChunk(type, chunks, 0)
                    .then(() => {
                        console.log('next type');
                        return res();
                    })
                    .catch((err) => {
                        console.error('Error append on add ' + type + ' -- err: '.err);
                        return rej(err);
                    });
            });
        });
    });
};

function insertChunk(type, chunks, currentChuck) {
    console.log(
        type,
        'now insert many chunks',
        currentChuck,
        '/',
        chunks.length -1,
        'quantity',
        chunks[currentChuck].length,
    );
    return new Promise((res, rej) => {
        collections[type]
            .insertMany(chunks[currentChuck])
            .then(() => {
                if(currentChuck + 1 >= chunks.length) {
                    console.log(type, 'chunk insert over');
                    return res();
                } else {
                    insertChunk(type, chunks, currentChuck +1).then(() => res());
                }
            })
            .catch((e) => rej(e));
    });
}

console.log('fillDB starting in 2 secondes');
setTimeout(function() {
    make('Products')
        .then(() => {
            console.log('end on the import, succes');
            mongoose.disconnect().then(() => {
                process.exit();
            });
        })
        .catch((e) => {
            console.error('script failed', e);
        });
}, 2000);