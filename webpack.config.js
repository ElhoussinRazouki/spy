const path = require('path');
module.exports = {
    entry: './src/index.js',
    output : {
        filename : 'script.js',
        path : path.join(__dirname,'public/js_for_victim')
    },
}