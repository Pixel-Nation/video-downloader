const package = require('./package.json');
const { exec } = require('pkg');
const util = require('util');
const chalk = require('chalk');

(async () => {
    await (util.promisify(require('child_process').exec))('mkdir build').catch(() => {});

    for (let pkgI in package.pkg.targets) {
        let pkg = package.pkg.targets[pkgI];
        console.log(chalk.yellow(`Packaging ${chalk.bold(pkg)}...`));
        await exec([package.pkg.scripts, '--target', pkg, '--output', `${package.pkg.outputPath}/${pkg}`]);
        console.log(chalk.green(`Done!`) + '\n');
    }
})();