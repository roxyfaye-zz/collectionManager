const express = require('express');
const mustache = require('mustache');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mustacheExpress = require('mustache-express');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/coinsdb');

const Coins = require('./models/coin');

const application = express();

application.set('views', './views');
application.set('view engine', 'mustache');

application.engine('mustache', mustacheExpress());

application.use('/public', express.static('./public'));
application.use(bodyParser.urlencoded({ extended: false}));
application.use(bodyParser.json());


application.get('/', async (request, response) => {
    var coins = await Coins.find();
    var model = {coins: coins};
    console.log('in the get');
    response.render('index', model)
});
application.post('/', (request, response) => {
    console.log('in the post');
    console.log(request.body.name);
    console.log(request.body.city);
    var newCoin = new Coins({
        name: request.body.name,
        year: request.body.year,
        location: [{
            city: request.body.city,
            state: request.body.state,
        }],
        color: request.body.color,
    })
        console.log('in the post');

    newCoin.save(function(err, savedCoin) {
        if (err) console.log ('error!')
            console.log("This is the saved coins!!", savedCoin), err;
        });
        response.redirect('/');
});

application.get('/:id', async(request, response) => {
    var id = request.params.id;
    var coin = await Coins.find({_id:id});
    var model = {coin: coin, id:id};
    
    response.render('view', model);
});

application.get('/edit/:id', async(request, response) => {
    var id = request.params.id;
    var coin = await Coins.find({_id:id});
    var model = {coin: coin, id:id};
    
response.render('edit', model);
});

application.post('/edit/:id', async(request, response) => {
    var id = request.params.id;
    var colorplits = /, | |,/
    await Coins.findOneAndUpdate({_id:id},
    {
        name: request.body.name,
        year: request.body.year,
        location: {
            city: request.body.city,
            state: request.body.state,
        },
        color: colorplits[Symbol.split](request.body.color)
    })
        console.log(request.body);

        response.redirect('/')
});
console.log('app started')
application.listen(3000);