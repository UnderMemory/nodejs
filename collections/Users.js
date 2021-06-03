const mongoose = require('mongoose');
const Shema = mongoose.Schema;
const mongooseLeanId = require('mongoose-lean-id');

const schema = new mongoose.Schema(
    {
        login: {type: String, require: true, unique: true},
        password: {type : String, require: true},
        email: {type : String, require: true},
        last_date_connection: {type : Date, default: Date.now()},
        date_register: {type : Date, default: Date.now()}
    },
    {
        //toObject  //toJSON
        toObject: {
            transform: function(doc, ret) {
                ret.id = ret._id;
                delete ret.password;
                return ret;
            }
        },
        toJSON: {
            transform: function(doc, ret) {
                ret.id = ret._id;
                delete ret.password;
                return ret;
            }
        }
    },
);
schema.plugin(mongooseLeanId);

//propre a l'object instancié.
schema.methods.checkPassword = function(password){
    if(password === this.password){
        return true;
    }
    return false;
};

//propre à la collection
schema.statics.create = function(packet){
    const newUser = new Users(packet);

    return new Promise((res,rej) => {
        newUser.save()
        .then(() =>{
          return res(newUser);
        }).catch(e => {
          console.error('USERS.Create : DB Save error => ', e);
          return rej('DB_ERROR');
        })
    });
};
 
//
// 2e façon de l'écrire =
//
// schema.statics.create = async function(packet){
//     const newUser = new Users(packet);

//     try{
//         await newUser.save()
//         return newUser;
//     } catch(e) {
//         console.error('USERS.Create : DB Save error => ', e);
//         throw 'DB_ERROR';
//     }
// };

var Users;
function make(connection){
    if(Users) return Users;
    Users = connection.model('User', schema);
    return Users;
}

module.exports = make;