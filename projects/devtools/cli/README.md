# SCION CLI

The SCION command-line tool allows you to visualize, lint, compile and
interactively run SCXML files. You can install this module globally, and run it
with the command `scion`:

```
scion [command]

Commands:
  scion init [filename]     initialize a new SCXML file
  scion viz [filename]      visualize an SCXML file
  scion compile [filename]  compile an SCXML file to JSON or JavaScript
  scion run [filename]      run an SCXML file, and connect a repl to send it
                            events
  scion execute [filename]  execute an SCXML file (without the repl)
  scion lint                lint an SCXML file (this is an alias for "eslint
                            --plugin @scion-scxml/eslint-plugin-scharpie")
  scion monitor             start a monitor server

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

Here is a video of the SCION cli in action:

[![Link to video](https://img.youtube.com/vi/GbP3_b8GVbM/0.jpg)](https://www.youtube.com/watch?v=GbP3_b8GVbM)
