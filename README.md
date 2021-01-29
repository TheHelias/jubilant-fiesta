# Validation rule API

An api that validates data in it's payload based on a set of rules in the payload

## How to run

Before anything else, you must have node installed on your machine.

Open the project directory and do an 'npm install'

### Running Dev Server

Run on your terminal `npm run watch:dev`, the server will restart everytime you make a change in your code.

### Running Production Server

For stuff like heroku deployment, aws elasticbeanstalk, run `npm run start`

### Other scripts

* `transpile` - convert es6 and beyond code to es5 to a folder named `dist-server`
* `clean` - delete transpiled folder
* `build` - clean and transpile

### Techs Used
NodeJs

Express

Standard for linting(No semi-colons)
