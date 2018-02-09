'use strict';

const VNUPPERCHARS = ['Ă', 'Â', 'Đ', 'Ê', 'Ô', 'Ơ', 'Ư'];
const VNLOWERCHARS = ['ă', 'â', 'đ', 'ê', 'ô', 'ơ', 'ư'];

function isVnLowerChar( char ){
    if(char === char.toLowerCase() || VNLOWERCHARS.includes( char ) ){
        return true;
    }
    return false;
}

function isVnUpperChar( char ) {
    if(char === char.toUpperCase() || VNUPPERCHARS.includes( char ) ){
        return true;
    }
    return false;
}

function isAbbre( word ) {
    for( const c of word ) {
        if( isVnLowerChar( c ) || c === "_") {
            return false;
        }
    }
    return true;
}

function isVnProperNoun( word ) {
    if (isVnUpperChar(word[0])){
        let count = word.match(/_/g);
        if(count !== null && count.length >= 4) {
            return true;
        }
        let index = word.indexOf('_');
        while(index > 0 && index < len(word) - 1){
            if (isVnLowerChar(word[index + 1])){
                return false;
            }
            index = word.indexOf("_", index + 1);
        }
        return true;
    }
    return false;
}

function initializeSentence(FREQDICT, sentence) {
    const words = sentence.trim().split(' ');
    let taggedSen = [];

    for(const word of words){
        if(["“", "”", "\""].includes(word)){
            taggedSen.push("''/" + FREQDICT.get("''"));
            continue;
        }
        let tag = '';
        let lowerW = word.toLowerCase();
        if(FREQDICT.has(word)){
            tag = FREQDICT.get(word);
        }
        else if(FREQDICT.has(lowerW)){
            tag = FREQDICT.get(lowerW);
        }
        else {
            if (word.search(/[0-9]+/g) >= 0){
                tag = FREQDICT.get("TAG4UNKN-NUM");
            }
            else if(word.length === 1 && isVnUpperChar(word[0])){
                tag = "Y";
            }
            else if(isAbbre(word)){
                tag = "Ny";
            }
            else if(isVnProperNoun(word)){
                tag = "Np";
            }
            else{
                let suffixL2 = null,
                    suffixL3 = null,
                    suffixL4 = null,
                    suffixL5 = null;
                let wLength = word.length;
                
                if( wLength >= 4){
                    suffixL3 = ".*" + word.slice(-3);
                    suffixL2 = ".*" + word.slice(-2);
                }
                if( wLength >= 5){
                    suffixL4 = ".*" + word.slice(-4);
                }
                if (wLength >= 6){
                    suffixL5 = ".*" + word.slice(-5);
                }
                if (FREQDICT.has(suffixL5)){
                    tag = FREQDICT.get(suffixL5);
                }
                else if(FREQDICT.has(suffixL4)){
                    tag = FREQDICT.get(suffixL4);
                }
                else if(FREQDICT.has(suffixL3)){
                    tag = FREQDICT.get(suffixL3);
                }
                else if(FREQDICT.has(suffixL2)){
                    tag = FREQDICT.get(suffixL2);
                }
                else{
                    tag = FREQDICT.get("TAG4UNKN-WORD");
                }
            }
        }
        taggedSen.push(word + "/" + tag);
    }
    return taggedSen.join(' ');
}

module.exports = { initializeSentence };