const Component = require('./component-files');


const fs = require('fs');
const YAML = require('yaml');
const path = require('path');


class Structure {
    folder = "./src"

    static isArray(obj) {
        return obj.length !== undefined
    }

    constructor(configFile, folder) {
        const file = fs.readFileSync(configFile, 'utf8')
        this.structureConfig = YAML.parse(file);
        this.folder = folder;
    }
    
    _getComponentsPaths(structure, currentPath = this.folder) {
        let paths = [];

        if (Structure.isArray(structure)) {
            paths.push(...structure.map( item => path.join(currentPath, item) ));
        } else {
            Object.entries(structure).forEach( ([itemName, nextStructure]) => {
                paths.push(...this._getComponentsPaths(nextStructure, path.join(currentPath, itemName)));
            } )
        }

        return paths;
    }

    createComponents() {
        const paths = this._getComponentsPaths(this.structureConfig);
        paths.map(this.createComponentFiles);
    }

    createComponentFiles(path) {
        fs.mkdirSync(path, {recursive: true});
        const component = new Component(path);
        component.extrude();
    }
}

module.exports = Structure;
