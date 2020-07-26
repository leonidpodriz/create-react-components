#!/usr/bin/env node

const {Command} = require('commander');
const Structure = require("./components-structure")

const program = new Command();

program
    .version(require('./package.json').version)
    .command('create-all')
    .description('clone a repository into a newly created directory')
    .option('-c, --config <config>', 'components config file', './components.yml')
    .option('-f, --folder <folder>', 'output src folder', "./src")
    .action((source) => {
        const {config, folder} = source;
        const structure = new Structure(config, folder);
        structure.createComponents();
        structure.createComponents();
    });


program.parse(process.argv);
