/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/daemon.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/11/2020
 * Description: 
 ******************************************************************/

import { start } from './server';

export type DaemonType = 'LOCAL' | 'GLOBAL' | 'YARN';

export type DaemonInfo = {
    pid: number;
    type: DaemonType;
    port: number;
    config: string;
    mtime: number;
};


start( {
    daemonType : 'YARN',
    daemonId : '12345',
    daemonFile : '/Users/lvchengbin/.xeslint/daemons/12345'
} );

console.log( '--------------------' );
