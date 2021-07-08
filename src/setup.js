#! /usr/bin/env node

/**
 * Author: Carl Schader
 * GitHub: https://github.com/CarlSchader
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const process = require('process');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const gitHooksPath = path.join(process.cwd(), 'git-hooks');

if (!fs.existsSync(gitHooksPath)) {
    fs.mkdirSync(gitHooksPath);
}

execSync(`git config core.hooksPath ${gitHooksPath}`);

const postCommitData = `#! /usr/bin/env node

/**
 * Author: Carl Schader
 * GitHub: https://github.com/CarlSchader
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const process = require('process');

var packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'))
);

const commitMessagePath = path.join(process.cwd(), '.git', 'COMMIT_EDITMSG');
const commitMessage = fs.readFileSync(commitMessagePath).toString();

function getCommitType(message) {
    const regex = /^(fix|feat|BREAKING CHANGE):[\s\S]*/;
    
    if (regex.test(message)) {
        return message.substring(0, message.indexOf(':'));
    } else {
        return false;
    }
}

if (getCommitType(commitMessage)) {
    execSync('git tag ' + packageJson.version);
}`;

const commitMsgData = `#! /usr/bin/env node

/**
 * Author: Carl Schader
 * GitHub: https://github.com/CarlSchader
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const process = require('process');

const commitMessagePath = process.argv[2];
const commitMessage = fs.readFileSync(commitMessagePath).toString();

try {
    execSync('npm run test');
} catch {
    console.log('failed tests');
    process.exit(1);
}

function getCommitType(message) {
    const regex = /^(fix|feat|BREAKING CHANGE):[\s\S]*/;

    if (regex.test(message)) {
        return message.substring(0, message.indexOf(':'));
    } else {
        return false;
    }
}

const commitType = getCommitType(commitMessage);
if (commitType) {
    var packageJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'))
    );
    const [major, minor, patch] = packageJson.version.split('.');
    
    switch (commitType) {
        case 'fix':
            packageJson.version = major + '.' + minor + '.' + (parseInt(patch) + 1).toString();
            break;
        case 'feat':
            packageJson.version = major + '.' + (parseInt(minor) + 1).toString() + '.0';
            break;
        case 'BREAKING CHANGE':
            packageJson.version = (parseInt(major) + 1).toString() + '.0.0';
            break;
        default:
            console.error('error when handling commit type (fix, feat, BREAKING CHANGE');
            process.exit(1);
    }

    fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(packageJson, null, 2));
}

execSync('git add .');`;

try {
    fs.writeFileSync(path.join(gitHooksPath, 'post-commit'), postCommitData);
    fs.writeFileSync(path.join(gitHooksPath, 'commit-msg'), commitMsgData);
} catch (error) {
    console.error(error);
    execSync(`rm -r ${gitHooksPath}`);
}

execSync(`chmod +x ${path.join(gitHooksPath, 'post-commit')}`);

execSync(`chmod +x ${path.join(gitHooksPath, 'commit-msg')}`);

readline.question('Add prepare script to automatically set git-hooks folder on npm install (recommended)? (enter "no" for no, anything else for yes): ', answer => {
    if (answer !== 'no') {
        let packageJson = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), 'package.json'))
        );

        if (!packageJson.hasOwnProperty('scripts')) {
            packageJson['scripts'] = { prepare: `git config core.hooksPath ./git-hooks/` };
        } else {
            packageJson.scripts['prepare'] = `git config core.hooksPath ./git-hooks/`;
        }

        fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    }

    readline.close();
});