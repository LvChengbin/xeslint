/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/server.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/07/2020
 * Description: 
 ******************************************************************/

import net, { AddressInfo } from 'net';

export type ServerOptions = {
    port?: number;
    lifetime?: number;
    dotfile?: string;
}

export function start( options: ServerOptions = {} ): void {
    const server = net.createServer( { allowHalfOpen : true }, conn => {

        let data = '';

        conn.on( 'data', chunk => {
            console.log( '===============', data );
            data += chunk;
        } );

        conn.on( 'end', () => {
            console.log( '..................', data );
        } );
    } );

    server.listen( options.port || 0, '127.0.0.1', () => {
        const port = ( server.address() as AddressInfo ).port;
        console.log( 'listening: ', port );
    } );
}

start( { port : 7896 } );
