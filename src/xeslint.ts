/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/xeslint.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/07/2020
 * Description: 
 ******************************************************************/

import client from './client';

client.send( {
    args : process.argv.slice( 2 ),
    cwd : process.cwd()
} );
