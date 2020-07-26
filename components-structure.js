const Component = require('./component-files');


const fs = require('fs')
const YAML = require('yaml')


class Structure {
    componentsPaths = [];
    folder = "./src"

    static isArray(obj) {
        return obj.length !== undefined
    }

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

        if (Structure.isArray(structure)) {
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
        const component = new Component(path);
        component.extrude();
    }
}

module.exports = Structure;
