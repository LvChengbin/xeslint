/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/client.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/07/2020
 * Description: 
 ******************************************************************/

import net from 'net';
import output from './output';

export type SendOptions = {
    port: number;
    host?: string;
    args: string[];
    cwd?: string;
}

export const send = ( options: SendOptions ): void => {

    options = {
        host : '127.0.0.1',
        cwd : process.cwd(),
        ...options
    };

    const socket = net.connect( options.port, options.host, () => {
        let data = '';

        socket.on( 'data', chunk => {
            data += chunk;
        } );

        socket.on( 'end', () => {
            output.write( data );
        } );

        socket.end( JSON.stringify( {
        } ) );
    } );
}

export default { send };
