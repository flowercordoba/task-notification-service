import * as shell from 'shelljs';
// import fs from 'fs-extra';
// import * as fse from 'fs-extra';

shell.cp('-R', 'src/emails', 'build/src/');

// fs.copySync('src/emails', 'build/src/emails');
// fse.copySync('src/emails', 'build/src/emails');
