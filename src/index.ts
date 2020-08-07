/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/07/2020
 * Description: 
 ******************************************************************/

import { ESLint } from 'eslint';

( async () => {
    const eslint = new ESLint( {} );
    const result = await eslint.lintFiles( 'test/index.ts' )
    const formatter = await eslint.loadFormatter( 'stylish' );
    const text = formatter.format( result );
    console.log( text );
} )();
