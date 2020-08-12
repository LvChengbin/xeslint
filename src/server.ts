/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/server.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/07/2020
 * Description: 
 ******************************************************************/

import fs from 'fs';
import net, { AddressInfo } from 'net';
import yaml from 'yaml';
import { DaemonType } from './daemon';

export type ServerOptions = {
    port?: number;
    timeout?: number;
    daemonType: DaemonType;
    daemonId: string;
    daemonFile: string;
}

export type ServerStatus = {
    port?: number;
    timeout?: number;
    daemonType?: DaemonType;
    daemonId?: string;
    daemonFile?: string;
    lastActiveTime?: number;
};

const serverStatus: ServerStatus = {
};

export function start( options: ServerOptions ): void {

    options = {
        timeout : 600000,
        ...options
    }

    const server = net.createServer( { allowHalfOpen : true }, conn => {

        let data = '';

        conn.on( 'data', chunk => {
            data += chunk;
        } );

        conn.on( 'end', () => {
            const json = JSON.parse( data );
            switch( json.action ) {
                case 'ESLINT' :
                    break;
                case 'RESTART' :
                    break;
                case 'STOP' :
                    break;
                case 'STATUS' :
                    conn.end( JSON.stringify( serverStatus ) );
                    break;
            }
        } );
    } );

    server.listen( options.port || 0, '127.0.0.1', () => {
        const daemon = {
            pid : process.pid,
            type : options.daemonType,
            port : ( server.address() as AddressInfo ).port,
            mtime : +new Date
        };

        if( process.send ) {
            console.log( 'IPC is enabled' );
        } else {
            console.log( 'IPC is not enabled' );
        }
        process.send?.( ( process.versions as any ).pnp );
        process.disconnect?.();

        fs.writeFileSync( options.daemonFile, yaml.stringify( daemon ) ); 
    } );

    process.on( 'exit', () => {
        fs.unlinkSync( options.daemonFile );
    } );

    process.on( 'SIGTERM', () => {
        server.close();
    } );

    process.on( 'SIGINT', () => {
        server.close();
    } );
}

export function stop(): void {
}

export function restart(): void {
}
