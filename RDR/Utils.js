'use strict';

const readFileSync = require('fs').readFileSync;

function getWordTag(wordTag){
    if(wordTag === "///"){
        return [ "/", "/" ];
    }

    let index = wordTag.lastIndexOf("/");
    let word = wordTag.slice(0, index).trim();
    let tag = wordTag.slice(index + 1).trim();
    return [ word, tag ];
}

function readDictionary(inputFile){
    const dictionary = new Map();
    
    let dictContent = readFileSync(inputFile, { encoding: 'utf-8' });
    let lines = dictContent.split('\n');
    
    for (let line of lines){
        let wordtag = line.trim().split(' ');
        dictionary.set(wordtag[0], wordtag[1]);
    }
    return dictionary;
}

module.exports = { getWordTag, readDictionary };