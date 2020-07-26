# Create React Components

This package created to simplify React components structure creation in new React project.

### Warning
Don't use this module in your old React projects, module can cause damage.
You are free to use this in new React project.

### How to use it?
1. Create new React project. Read a [official CRA docs](https://github.com/facebook/create-react-app#creating-an-app) to know how to do this. 
2. Install **cr-components** with the command:
    ```sh
    # using npm:
    npm install cr-components --save-dev
    ```
    Or, if you are use **yarn**:
    ```sh
    # using yarn:
    yarn add cr-components --dev
    ```
3. Create config with name `components.yml`. It can looks like:
    ```yaml
   # components.yml
    app: # it is the folder
      components: # it is the folder
        - App # it is the component
    client:
      Header:
        components:
          - Header
          - Navbar
          - NavbarMenu
    shared:
      components:
        - Button
        - Logo
    ```
4. Run `cr-components create-all` to parse and create components from a config.

Every component`s folder will be created with next files: _Component.jsx_, _Component.css_, _index.js_.

Example folder tree:
```
├───app
│   └───components
│       └───App
├───client
│   └───Header
│       └───components
│           ├───Header
│           ├───Navbar
│           └───NavbarMenu
└───shared
    └───components
        ├───Button
        └───Logo

```

### Advice
Run ```cr-components create-all -h``` to see more options.

##### To be continued...