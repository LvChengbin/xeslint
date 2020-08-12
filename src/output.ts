/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/output.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 08/07/2020
 * Description: 
 ******************************************************************/

export const write = ( message: string ): void => {
    process.stdout.write( message );
}

export default { write };
