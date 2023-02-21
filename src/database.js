const moongose = require('mongoose');
const {database} = require('./keys');

moongose.connect(database.URI,{
    useNewUrlParser: true
})
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.log(err));