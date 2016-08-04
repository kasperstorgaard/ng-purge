const dir = require('node-dir');

const defaultOptions = {
    match: /\.(js|es6|ts)$/,
    excludeDir: ['node_modules', 'bower']
};

function addMatches (content, test, matches) {
    let match = test.exec(content);
    while (match) {
        const type = match[1];
        const name = match[2];

        const obj = matches[type] || new Map();
        obj.set(name, true);

        if (!matches[type]) {
            Object.assign(matches, { [type]: obj });
        }

        // setup next
        match = test.exec(content);
    }

    return matches;
}

function find (dirPath, types, options = {}) {
    const typeStr = types.join('|');
    const test = new RegExp(`\\.(${typeStr})\\(\\s?['"](\\w+)['"]\\s?,`, 'g');
    let matches = {};

    return new Promise(resolve => {
        const opts = Object.assign({}, defaultOptions, options);
        dir.readFiles(dirPath, opts, (err, content, next) => {
            if (err) { throw err; }
            matches = addMatches(content, test, matches);
            next();
        }, () => {
            resolve(matches);
        });
    });
}

module.exports = { find };
