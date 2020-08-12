/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/launcher.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/11/2020
 * Description: 
 ******************************************************************/

import { spawn } from 'child_process';

function launch() {
    console.log( '-----------' );
    const daemon = require.resolve( './daemon' );
    const child = spawn( 'yarn', [ 'node', daemon ], {
        detached : true,
        env : { ...process.env },
        stdio : [ 'inherit', 'inherit', 'inherit', 'ipc' ]
    } );

    child.on( 'message', ( ...args ) => {
        console.log( 'c-------mmmmmmmm-----', args );
    } )

    child.unref();
}

launch();
