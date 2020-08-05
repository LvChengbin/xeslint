/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/index.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/04/2020
 * Description: 
 ******************************************************************/

const path = require( 'path' );
const { spawnSync } = require( 'child_process' );
const { cosmiconfigSync } = require( 'cosmiconfig' );
const findUp = require( 'find-up' );
const pathExists = require( 'path-exists' );

const moduleName = 'xeslint';
const cwd = process.cwd();
const globalArgs = process.argv.slice( 2 );

const explorer = cosmiconfigSync( moduleName, {
    searchPlaces : [
        `.${moduleName}rc`,
        `.${moduleName}rc.yml`,
        `.${moduleName}rc.yaml`,
        `.${moduleName}rc.js`,
        `.${moduleName}rc.json`,
        'package.json'
    ]
} );

const { config = {} } = explorer.search() || {};

function main() {
    if( config.exec ) {
        if( typeof config.exec === 'function' ) {
            const command = config.exec( globalArgs );
            if( command !== false ) {
                execute( command );
            }
        } else if( typeof config.exec === 'string' ) {
            execute( config.exec ); 
        }
    } else {
        /**
         * arn berry
         */
        const yarnConfigDir = findUp.sync( '.yarn', {
            type : 'directory'
        } );

        if( yarnConfigDir ) {
            execute( 'yarn eslint' );
            return;
        }

        let packageJsonPath = findUp.sync( 'package.json' );

        while( packageJsonPath ) {
            const packageDir = path.dirname( packageJsonPath );
            const eslintPath = path.join( packageDir, 'node_moduels', '.bin', 'eslint' );
            if( pathExists.sync( eslintPath ) ) {
                execute( eslintPath );
                return;
            }
            packageJsonPath = findUp.sync( 'package.json', {
                cwd : path.dirname( packageDir )
            } );
        }

        /**
         * run global eslint command
         */
        execute( 'eslint' );
    }
}

function execute( command, args = [], options = {} ) {
    const [ exec, ...xargs ] = command.split( /\s+/ );
    const run = spawnSync( exec, [ ...xargs, ...args, ...globalArgs ], {
        cwd,
        env : process.env,
        stdio : [ 'ignore', 'inherit', 'inherit' ],
        encoding : 'utf-8',
        ...options
    } );

    return run;
}

main();
