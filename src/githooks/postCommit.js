#! /usr/bin/env node

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
}