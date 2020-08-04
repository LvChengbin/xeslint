# xeslint

A tiny command line tool for executing local eslint in your project directory.

The `xeslint` will try using the `eslint` which was installed in the project directory by `npm` or `yarn` before using the global one.

## Installation

```sh
$ npm i -g xeslint
```

## Usage

Just use `xeslint` like the original `eslint` command, and it will help you to find out the correct way to run.

```sh
$ xeslint --version
$ xeslint 
```

## Config

A simple config file can be provided, and it will be loaded while running `xeslint` in current directory. The `exec` property will tell `xeslint` which command should be used.

```yml
exec: "npm run eslint --"
```

or in a json file:

```json
{
    "exec" : "npm run eslint --"
}
```

or use a js file:

```js
module.exports = {
    exec( args ) {
        if( args.length ) {
            return 'yarn lint';
        }
        return false; // return false means to stop xeslint executing eslint command
    }
}
```

or add config item in `package.json` directly:

```json
{
    "xeslint" : {
        "exec" : "yarn lint"
    }
}
```

### Syntastic Vim

If you are using `yarn 2.x` as your pacakge management tool, `syntastic` won't be able to run `eslint` to check your code style. Install `xeslint` globally and edit the `.vimrc` file:

```
" for javascript
let g:syntastic_javascript_checkers = [ 'eslint' ]
let g:syntastic_javascript_eslint_exec = 'xeslint'
" for typescript
let g:syntastic_typescript_checkers = [ 'eslint' ]
let g:syntastic_typescript_eslint_exec = 'xeslint'
```
