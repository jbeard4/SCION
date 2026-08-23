# SCION SCXML System

[![Backers on Open Collective](https://opencollective.com/scion/backers/badge.svg)](#backers)
 [![Sponsors on Open Collective](https://opencollective.com/scion/sponsors/badge.svg)](#sponsors) 

This module is the lerna mono-repo for the SCION SCXML System (SCION). SCION provides a complete system for developing with SCXML. All submodule that are part of SCION are in `projects/{devtools,examples,libraries}` directories. 

This package (`scion`) is published to npm so that the bundled modules can be consumed and published by [[cdnjs]](https://cdnjs.com/) for use in the browser. The bundled modules are in the `dist/` directory: 

[core](https://github.com/jbeard4/scion/tree/main/projects/libraries/core) (Statecharts interpreter):

* core.js
* core.js.map
* core.min.js

[scxml](https://github.com/jbeard4/scion/tree/main/projects/libraries/scxml) (SCXML compiler and runtime):

* scxml.js
* scxml.min.js
* scxml.debug.js (SCXML compiler with sourcemaps enabled)

[schviz](https://github.com/jbeard4/scion/tree/main/projects/libraries/schviz) (visualization):

* dist/schviz.js
* dist/schviz.js.map
* dist/schviz.min.js
* dist/schviz.min.js.map

If you are using SCION in Node.js, you should use npm to install specific packages (e.g. [@scion-scxml/core](https://www.npmjs.com/package/@scion-scxml/core), [@scion-scxml/scxml](https://www.npmjs.com/package/@scion-scxml/scxml), [@scion-scxml/schviz](https://www.npmjs.com/package/@scion-scxml/schviz), etc.) rather than installing this module. 

For more information on specific modules that are published as a part of SCION, please check each individual project's README.

For more information on the SCION project, please visit [scion.scxml.io](https://scion.scxml.io).

## Developing

Clone this repository, then install nodejs modules:

```
npm install
```

Bootstrap lerna:

```
npx lerna bootstrap
```

Build all packages:

```
npm run build
```

## Contributors

This project exists thanks to all the people who contribute. 
<a href="graphs/contributors"><img src="https://opencollective.com/SCION/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/SCION#backer)]

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/SCION#sponsor)]

<a href="https://opencollective.com/SCION/sponsor/0/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/1/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/2/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/3/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/4/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/5/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/6/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/7/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/8/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/9/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/9/avatar.svg"></a>

# Support

To report a bug: [file an issue on GitHub](https://github.com/jbeard4/scion/issues).

For general questions: [![Join the chat at https://gitter.im/SCION-SCXML/Lobby](https://badges.gitter.im/SCION-SCXML/Lobby.svg)](https://gitter.im/SCION-SCXML/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

