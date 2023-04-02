console.clear();
const { Command } = require('commander');
const chalk = require('chalk');
const prompts = require('prompts');
const URL = require("url").URL;
const fs = require('fs');
const youtube = require('ytdl-core');
const path = require('path');
const util = require('util');
const other = require('request');
const os = require('os');

function openExplorerin(path) {
    var cmd = ``;
    switch (os.platform().toLowerCase().replace(/[0-9]/g, ``).replace(`darwin`, `macos`)) {
        case `win`:
            path = path || '=';
            cmd = `explorer`;
            break;
        case `linux`:
            path = path || '/';
            cmd = `xdg-open`;
            break;
        case `macos`:
            path = path || '/';
            cmd = `open`;
            break;
    }
    let p = require(`child_process`).spawn(cmd, [path]);
    p.on('error', (err) => {
        p.kill();
    });
}

const stringIsAValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};

const program = new Command();

(async () => {
    console.clear();

    program.description('Video Downloader for the PixelNation')
        .action(async () => {

            while (true) {
                let { url } = await prompts({
                    type: 'text',
                    name: 'url',
                    message: `Video URL $ `
                });


                if (url?.trim() == '' || !url) {
                    console.log(chalk.yellow('No input given, goodbye!'))
                    process.exit(0);
                }

                if (!stringIsAValidUrl(url)) console.log(chalk.red('This is not a valid URL! Please try again.'))

                else {
                    await (util.promisify(require('child_process').exec))(`cd "${path.join(os.homedir(), 'Downloads')}" && mkdir VideoDownloads`).catch(() => { });
                    const parseURL = new URL(url);
                    let videoName = `${Math.round(Date.now() / 1000)}.mp4`;
                    let saveDir = path.resolve(path.join(os.homedir(), 'Downloads'), 'VideoDownloads', videoName);

                    console.log(chalk.yellow('Downloading...'));

                    async function download(parseURL, saveDir) {
                        return new Promise(async function (resolve) {

                            if (parseURL.host.includes('youtube.com')) {
                                youtube(url, { format: 'mp4', filter: 'audioandvideo' }).pipe(fs.createWriteStream(saveDir))
                                    .on('finish', () => resolve(true))
                                    .on('error', () => resolve(false))
                            }

                            else {
                                other(url).pipe(fs.createWriteStream(saveDir))
                                    .on('finish', () => resolve(true))
                                    .on('error', () => resolve(false))
                            }
                        })
                    }

                    let done = await download(parseURL, saveDir);

                    if (done) {
                        console.log(chalk.green('Done! Openning file explorer...'))
                        openExplorerin(path.resolve(path.join(os.homedir(), 'Downloads'), 'VideoDownloads'));
                    } else {
                        console.log(chalk.red('An error occurred. Please try again.'))
                    }

                    console.log('\n');
                }
            }
        });

    program.parse(process.argv);
})()