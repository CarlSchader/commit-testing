# commit-testing
Tool to help automate unit testing, versioning, and tagging of commits for node projects using git.

# Installation
To set up git-hooks for automated testing, versioning, and tagging:
```
npm install --save-dev commit-testing
npx commit-testing
```

# Automated Testing
In your package.json, set the "test" script under "scripts" to whatever you want to use for testing.
(example assuming jest is installed):
```
scripts: {
    "test": "jest"
}
```

Then just commit like normal!
```
git add .
git commit -m "auto testing"
```

If the tests pass, the commit will go through, else it will be rejected.

If you want to skip testing, just commit using the --no-verify flag:
```
git commit --no-verify -m "no testing please"
```

# Automated Versioning and Tagging
If you want to automatically increment your version number (major.minor.patch) and tag your commit, just add one of the conventional prefixes to your commit message followed by a colon(:)

    fix: increment patch 1.2.3 -> 1.2.4
    feat: increment minor 1.2.3 -> 1.3.0
    BREAKING CHANGE: increment major 1.2.3 -> 2.0.0

examples:
```
git commit -m "fix: small bugfix"
git commit -m "feat: new feature!"
git commit -m "BREAKING CHANGE: massive update that could break old code!!!"
```

# Note on Automated Versioning and Tagging
If you use the --no-verify on a commit that has one of the three prefixes it will still try to tag the commit but it won't increment the version number automatically. You will need to manually update the version number yourself or don't include the prefix in the commit message then tag the commit yourself.