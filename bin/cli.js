#! /usr/bin/env node

import { program } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import create from '../lib/create.js'; // 注意此处不能直接引入 json 文件。

program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exists')
  .action((name, options) => {
    create(name, options);
  });

program
  .version(`v${JSON.parse(fs.readFileSync(path.join(path.resolve(), './package.json'))).version}`)
  .usage('<command> [option]');

program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from options')
  .option('-s, --set <path>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, options);
  });

program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option);
  })

program
  .on('--help', () => {
    console.log('\r\n' + figlet.textSync('nat', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    }));
    console.log(`\r\nRun ${chalk.cyan(`nat <command> --help`)} for detailed usage of given command\r\n`)
  })

// 解析用户执行命令传入参数
program.parse(process.argv);

