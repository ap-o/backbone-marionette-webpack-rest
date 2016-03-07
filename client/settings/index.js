var api = require('./api');

// Override the exports to load/merge different configurations depending on some condition (such as environment variables)
module.exports = {
    API : api
};
