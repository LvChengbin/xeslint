/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/shared.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/10/2020
 * Description: 
 ******************************************************************/

import fs from 'fs';
import util from 'util';
import path from 'path'
import crypto from 'crypto';
import { spawnSync } from 'child_process';
import yaml from 'yaml';
import debug from 'debug';
import findUp from 'find-up';
import pathExists from 'path-exists';
import { cosmiconfigSync } from 'cosmiconfig';

const HOME = process.env[ process.platform === 'win32' ? 'USERPROFILE' : 'HOME' ];
const CONFIGDIR = path.join( HOME as string, '.xeslint' );
const DAEMONSDIR = path.join( CONFIGDIR, 'daemons' );

const mkdir = util.promisify( fs.mkdir );
const writeFile = util.promisify( fs.writeFile );

const initXeslintDebug = debug( 'Init' );
const rcDebug = debug( 'Load RC' );
const findEslintDebug = debug( 'Find eslint' );
const findExistsDaemonDebug = debug( 'Find exists daemon' );

export async function initXeslint(): Promise<any> {
    /**
     * create $HOME/.xeslint directory
     */
    try {
        await mkdir( CONFIGDIR, { recursive : true } );
        initXeslintDebug( `Finish creating directory: ${CONFIGDIR}.` );
    } catch( e ) {
        initXeslintDebug( `Failed to create directory: ${CONFIGDIR}.` );
    }

    /**
     * create $HOME/.xeslint/daemons.json if not exists.
     */
    const daemonsFile = path.join( CONFIGDIR, 'daemons.yml' );
    try {
        await writeFile( daemonsFile, '', { flag : 'wx' } );
        initXeslintDebug( `Created ${daemonsFile}` );
    } catch( e ) {
        initXeslintDebug( `Failed to create file ${daemonsFile}.` )
        initXeslintDebug( e.message );
    }
}

export async function rc( cwd = process.cwd() ): Promise<Record<string, any> | null> {

    /**
     * look for rc file from cwd
     */
    const moduleName = 'xeslint';
    const explorer = cosmiconfigSync( moduleName, {
        searchPlaces : [
            `.${moduleName}rc`,
            `.${moduleName}rc.yml`,
            `.${moduleName}rc.yaml`,
            `.${moduleName}rc.js`,
            '.${moduleName}rc.json',
            'package.json'
        ]
    } ); 

    let result = await explorer.search( cwd );

    if( !result ) {

        /**
         * if rc file cannot be found in the hierarchy path,
         * try loading rc file from $HOME
         */
        result = await explorer.search( HOME as string );
    }

    if( result ) {
        rcDebug( `Loaded rc file ${result.filepath}` );
        rcDebug( result.config );
    }
    return result;
}

export async function findEslint( cwd = process.cwd() ): Promise<any> {

    const result: Record<string, any> = {};

    /**
     * Look for the directory has node_modules or .yarn init.
     */
    const target = [ 'node_modules', '.yarn' ];

    let cursor = findUp.sync( [ 'node_modules', '.yarn' ], {
        type : 'directory',
        cwd
    } );

    while( cursor ) {

        const dir = path.dirname( cursor );
        const eslintPath = path.join( dir, 'node_modules', '.bin', 'eslint' );

        if( pathExists.sync( eslintPath ) ) {
            result.execType = 'LOCAL';
            result.eslintPath = eslintPath;
            result.dir = dir;
            break;
        }

        const yarnPath = path.join( dir, '.yarn' );

        if( pathExists.sync( yarnPath ) ) {
            result.execType = 'YARN';
            result.dir = dir;
            break;
        }

        cursor = findUp.sync( target, {
            type : 'directory',
            cwd : path.dirname( dir )
        } );
    }

    if( !result.execType ) {
        result.execType = 'GLOBAL';
    }

    findEslintDebug( result );

    return result;
}

export async function findExistsDaemon( options: Record<string, any> ): Promise<any | null> {
    const md5 = crypto.createHash( 'md5' ).update( JSON.stringify( options ) ).digest( 'hex' );

    try {
        const text = fs.readFileSync( path.join( DAEMONSDIR, md5 ) ).toString();
        const info = yaml.parse( text );

        findExistsDaemonDebug( `Find match exists daemon: ${md5}` );
        findExistsDaemonDebug( info );
        return info;
    } catch( e ) {
        findExistsDaemonDebug( 'No matched daemon.' );
        return null;
    }
}

export async function runCommand( command: string, args = [], options = {} ): Promise<any> {
    const [ exec, ...xargs ] = command.split( /\s+/ );

    options = {
        cwd : process.cwd,
        env : process.env,
        stdio : [ 'ignore', 'inherit', 'inherit' ],
        encoding : 'utf-8',
        ...options
    };

    const run = spawnSync( exec, [ ...xargs, ...args ], options );

    return run;
}

( async () => {
    await initXeslint();
    await rc();
    await findEslint();
    await findExistsDaemon( {} );
} )();
