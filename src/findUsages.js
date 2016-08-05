const dir = require('node-dir');
const path = require('path');
const async = require('async');

function createServiceTest (name) {
    // find "function" or "=> "
    // followed by anything, 
    // followed by {name} surrounded in whitespace or comma
    // followed by anything
    // followed by parenthesis end
    return new RegExp(`(function|=>\\s?)\\s?[\\s\\S]*[\\s,]${name}[\\s,][\\s\\S]*\\)`, 'g');
}

function getMatches (test, content) {
    let count = 0;
    let match = test.exec(content);

    while (match) {
        count++;
        match = test.exec(content);
    }
    return count;
}

function findServices (dirPath, matches) {
    const baseOptions = {
        match: /\.(js|es6|ts)$/,
        excludeDir: ['node_modules', 'bower']
    };

    const keys = Object.keys(matches);
    const remaining = Object.assign({}, matches);

    return new Promise(resolve => {
        const operations = keys.map(key => (cb => {
            const currentFilePath = matches[key];
            const opts = Object.assign({}, baseOptions);

            dir.readFiles(dirPath, opts, (err, content, fileName, next) => {
                if (err) { throw err; }

                if (fileName === currentFilePath) {
                    next();
                    return;
                }

                const test = createServiceTest(key);
                const count = getMatches(test, content);
                if (count) {
                    delete remaining[key];
                }
                next();
            }, cb);
        }));

        async.parallel(operations, err => {
            if (err) {
                throw err;
            }
            resolve(remaining);
        });
    });
}

function findFactories (dirPath, matches) {

}

function findDirectives (dirPath, matches) {

}

function findControllers (dirPath, mathces) {

}

module.exports = {
    findServices,
    findFactories,
    findDirectives,
    findControllers
};
