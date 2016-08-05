const dir = require('node-dir');

const defaultOptions = {
    match: /\.(js|es6|ts)$/,
    excludeDir: ['node_modules', 'bower']
};

function getMatches (content, fileName, test) {
    const matches = {};

    let match = test.exec(content);

    while (match) {
        const type = match[1];
        const name = match[2];

        // ensure that the type is created
        if (!matches[type]) {
            matches[type] = {};
        }

        // add name as key, fileName as val
        matches[type][name] = fileName;

        // setup next
        match = test.exec(content);
    }

    return matches;
}

function mergeMatches (src = {}, target) {
    const types = Object.keys(src);

    types.forEach(type => {
        if (!target[type]) {
            Object.assign(target, { [type]: src[type] });
            return;
        }
        Object.assign(target[type], src[type]);
    });

    return target;
}

function createTest (types) {
    const typeStr = types.join('|');
    return new RegExp(`\\.(${typeStr})\\(\\s*['"](\\w+)['"]\\s*,`, 'g');
}

function find (dirPath, types, options = {}) {
    let matches = {};
    const test = createTest(types);

    return new Promise(resolve => {
        const opts = Object.assign({}, defaultOptions, options);
        dir.readFiles(dirPath, opts, (err, content, fileName, next) => {
            if (err) { throw err; }
            const fileMatches = getMatches(content, fileName, test, matches);
            matches = mergeMatches(fileMatches, matches);
            next();
        }, () => {
            resolve(matches);
        });
    });
}

module.exports = find;
