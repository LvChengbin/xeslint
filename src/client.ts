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
    args : string[];
    cwd : string;
}

export const send = ( options: SendOptions = {} ) => {

    const socket = net.connect( 7896, '127.0.0.1', () => {

        let data = '';

        socket.on( 'data', chunk => {
            data += chunk;
        } );

        socket.on( 'end', () => {
            output.write( data );
        } );

        socket.end( 'xxxx' );
    } );

}
