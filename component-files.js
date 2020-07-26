const fs = require("fs");


class BaseComponentFile {
    content = "";
    file_name = "ComponentName";
    component_name = "ComponentName";
    file_extension = "js";

    constructor(path, name) {
        this.path = path;
        this.component_name = name;
    }

    _processComponentName(text) {
        return text.replace(/ComponentName/g, this.component_name).trim();
    }

    getContent() {
        return this._processComponentName(this.content)
    }

    getFileName() {
        return this._processComponentName(this.file_name + "." + this.file_extension)
    }

    getFullPath() {
        return this.path + "/" + this.getFileName();
    }

    createFile() {
        fs.writeFileSync(this.getFullPath(), this.getContent())
    }
}

class JSXComponentFile extends BaseComponentFile {
    file_extension = "jsx";
    content = fs.readFileSync("./component-files-templates/ComponentName.jsx", "utf8");
}

class CSSComponentFile extends BaseComponentFile {
    file_extension = "css";
    content = fs.readFileSync("./component-files-templates/ComponentName.css", "utf8");
}

class IndexComponentFile extends BaseComponentFile {
    file_name = "index";
    content = fs.readFileSync("./component-files-templates/index.js", "utf8");
}

class Component {
    static filesTypes = {
        "css": CSSComponentFile,
        "jsx": JSXComponentFile,
    }

    static defaultComponentOptions = {
        files: ["css", "jsx"]
    }

    _filesClasses = [IndexComponentFile];

    constructor(componentPath, componentName, componentOptions) {
        this.path = componentPath;
        this.name = componentName ? componentName : this.getComponentNameByPath(this.path);
        this.options = componentOptions ? componentOptions : Component.defaultComponentOptions;
    }

    getComponentNameByPath(path) {
        return path.split("/").pop();
    }

    _getFileClass = (file_type) => {
        const class_ = Component.filesTypes[file_type];
        return class_ ? class_ : null;
    }

    _getFilesClasses = (files_types) => {
        return files_types.map(this._getFileClass);
    }

    createFileByClass = (class_) => {
        if (class_ !== null) {
            const file = new class_(this.path, this.name);
            file.createFile();
        }
    }

    extrude() {
        const files_types = this.options.files;
        this._filesClasses.push(...this._getFilesClasses(files_types));
        this._filesClasses.forEach(this.createFileByClass.bind(this));
    }
}

module.exports = Component;