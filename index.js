const parseArgs = require('minimist');
const path = require('path');
const chalk = require('chalk');

const findDI = require('./src/findDI');
const findUsages = require('./src/findUsages');

const args = parseArgs(process.argv);

const findRoot = path.join(__dirname, args.dir || '');
const usageRoot = args.usageDir ? path.join(__dirname, args.usageDir) : findRoot;

function logger (obj, type, showKeys = false) {
    console.log(chalk.bold.blue(type));

    const keys = Object.keys(obj);
    if (showKeys) {
        console.log(keys.join('\n'));
        console.log('----------');
    }
    console.log(chalk.underline(keys.length));
}

console.log(chalk.yellow('processing...'));
console.log('----------');

const types = ['service'];
findDI(findRoot, types)
    .then(matches => {
        const { service } = matches;
        logger(service, 'services found:');
        return findUsages.findServices(usageRoot, service);
    })
    .then(remaining => {
        logger(remaining, 'unused service:', true);
        console.log('----------');
        console.log(chalk.bgGreen('done!'));
    });

// TODO:
// - usage detection
// - args options
//   - kill
//   - usage ext
//   - find ext
