const express = require('express');
const config = require('./server/config');

// DATABASE
require('./database');

const app = config(express());

// ESCUCHANDO EL SEVIDOR
app.listen(app.get('port'), () =>{
    console.log('Servidor corriendo en el puerto',app.get('port'));
})