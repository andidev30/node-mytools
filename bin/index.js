#!/usr/bin/env node

const cli = require('commander')

const { promisify } = require('util');
const { access, chmod, exists, open, close, readFile, writeFile } = require("fs");

const accessExec = promisify(access)
const readFileExec = promisify(readFile)
const chmodExec = promisify(chmod)
// TODO deprecated
const existsExec = promisify(exists)
const writeFileExec = promisify(writeFile)

// TODO show help first
// TODO usage information
// TODO type text/json only

cli
  .version('1.0.0')
  .name('mylogging')
  .description('view log from systems linux')
  .option('-t, --tag [text|json] ', 'print in text or json', 'text')
  .option('-o, --output [file] ', 'print in folder')
  .parse(process.argv)

const main = async() =>{
    const { args } = cli
    const { tag, output } = cli.opts()

    const fileLog = args[0]

    const folderLog = fileLog.slice(0, 8)
    if(folderLog === "/var/log"){
        const isAccessFile = await existsExec(fileLog)
        if(isAccessFile){
            let fileContent = await (await readFileExec(fileLog)).toString()
            if(tag === "JSON") {
                // TODO: json format log
                return console.log("json doesn't support")
            }

            if(output){
                console.log(output)
                writeFileExec(output, fileContent).then(() => {
                    console.log('success write in file')
                }).catch(() => {
                    console.log('failed write file')
                })
            }else{
                console.log(fileContent)
            }
        }
    }else{
        console.log('Error: a logger only show in folder /var/log')
    }
}

main()