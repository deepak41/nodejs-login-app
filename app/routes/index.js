var changeCase = require('change-case');
var routes = require('require-dir')();
var path = require('path');

module.exports = function (app) {
    'use strict';

    // Initialize all routes
    Object.keys(routes).forEach(function (routeName) {
        var router = express.Router();

        // Initialize the route to add its functionality to router
        require('./' + routeName)(router);

        // Add router to the speficied route name in the app
        app.use('/api/' + changeCase.paramCase(routeName), router);
    });
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../../config/helpers/html/index.html'));
    });
    app.use('/public', express.static(path.join(__dirname, '../../public')));
};
