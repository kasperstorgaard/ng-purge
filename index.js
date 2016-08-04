const finder = require('./src/finder');
const parseArgs = require('minimist');
const path = require('path');

const args = parseArgs(process.argv);

const fullPath = path.join(__dirname, args.dir || '');

const types = ['service', 'controller', 'factory'];
finder.find(fullPath, types)
    .then(matches => {
        let val;
        let count = 0;
        for (val of matches.factory.values()) {
            console.log(val);
            count++;
        }
        console.log('-------------- \ncount', count);
    });
