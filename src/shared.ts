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
import debug from 'debug';
import findUp from 'find-up';
import pathExists from 'path-exists';
import { cosmiconfigSync } from 'cosmiconfig';

const HOME = process.env[ process.platform === 'win32' ? 'USERPROFILE' : 'HOME' ];
const CONFIGDIR = path.join( HOME as string, '.xeslint' );

const mkdir = util.promisify( fs.mkdir );
const writeFile = util.promisify( fs.writeFile );

const initXeslintDebug = debug( 'Init' );
const rcDebug = debug( 'Load RC' );
const findEslintDebug = debug( 'Find eslint' );

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
     * create $HOME/.xeslint/deamons.json if not exists.
     */
    const deamonsFile = path.join( CONFIGDIR, 'deamons.yml' );
    try {
        await writeFile( deamonsFile, '', { flag : 'wx' } );
        initXeslintDebug( `Created ${deamonsFile}` );
    } catch( e ) {
        initXeslintDebug( `Failed to create file ${deamonsFile}.` )
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

( async () => {
    await initXeslint();
    await rc();
    await findEslint();
} )();
