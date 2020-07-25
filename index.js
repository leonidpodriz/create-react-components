#!/usr/bin/env node

const fs = require('fs')
const YAML = require('yaml')
const {Command} = require('commander');


class BaseGetComponentContent {
    content = "";
    file_name = "<component>";
    file_extension = "js";

    constructor(path) {
        this.path = path;
        this.componentName = path.split("/").pop();
    }

    __processText(text) {
        return text.replace(/<component>/g, this.componentName).trim();
    }

    getContent() {
        return this.__processText(this.content)
    }

    getFileName() {
        return this.__processText(this.file_name + "." + this.file_extension)
    }

    getFullPath() {
        return this.path + "/" + this.getFileName();
    }
}

class GetJSXComponentContent extends BaseGetComponentContent {
    file_extension = "jsx";
    content = `
import React from "react";

const <component> = (props) => {
    return (
        <div>

        </div>
    )
}

export default <component>;
    `;
}

class GetCSSComponentContent extends BaseGetComponentContent {
    file_extension = "css";
    content = `/* Styles for <component> */`;
}

class GetIndexComponentContent extends BaseGetComponentContent {
    file_name = "index";
    content = `
import <component> from "./<component>";
export default <component>;`;
}

class Structure {
    componentsPaths = [];
    folder = "./src"

    constructor(configFile, folder) {
        const file = fs.readFileSync(configFile, 'utf8')
        this.structureConfig = YAML.parse(file);
        this.folder = folder;
    }

    getPaths() {
        this.__getComponentsPaths();
        return this.componentsPaths;
    }

    __getComponentsPaths(structure, currentPath = "/") {
        structure = structure ? structure : this.structureConfig;

        if (structure.length !== undefined) {
            structure.forEach(item => {
                this.componentsPaths.push(this.folder + currentPath + item);
            })
        } else {
            Object.entries(structure).forEach((item) => {
                const [path, nextObjects] = item;
                this.__getComponentsPaths(nextObjects, currentPath + path + "/")
            })
        }
    }

    createComponents() {
        const paths = this.getPaths();
        paths.map(this.createComponentFiles)
    }

    createComponentFiles(path) {
        fs.mkdirSync(path, {recursive: true});

        const jsx = new GetJSXComponentContent(path)
        const css = new GetCSSComponentContent(path)
        const index = new GetIndexComponentContent(path)
        fs.writeFileSync(jsx.getFullPath(), jsx.getContent())
        fs.writeFileSync(css.getFullPath(), css.getContent())
        fs.writeFileSync(index.getFullPath(), index.getContent())
    }
}

const program = new Command();

program
    .version('0.0.2')
    .command('run')
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