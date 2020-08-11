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
    const daemon = require.resolve( './daemon' );
    const child = spawn( 'yarn', [ 'ts-node', daemon ], {
        detached : true,
        env : { ...process.env },
        stdio : 'ignore' 
    } );

    child.unref();
}

launch();
