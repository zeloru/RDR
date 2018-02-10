'use strict';

module.exports = class FWObject {
    constructor(check = false) {
        this.notNoneIds = [];
        this.context = [null, null, null, null, null, null, null, null, null, null, null, null, null];
        if (check === true) {
            for (let i = 0; i < 10; i += 2) {
                this.context[i] = "<W>";
                this.context[i + 1] = "<T>";
            }
            this.context[10] = "<SFX>"; // suffix
            this.context[11] = "<SFX>";
            this.context[12] = "<SFX>";
        }
    }

    static getFWObject(startWordTags, index) {
        const object = new FWObject(true);
        let [ word, tag ] = getWordTag(startWordTags[index]);
        object.context[4] = word;
        object.context[5] = tag;

        if (word.length >= 4){
            object.context[10] = word.slice(-2);
            object.context[11] = word.slice(-3);
        }
        if (word.length >= 5){
            object.context[12] = word.slice(-4);
        }
        if (index > 0 ){
            let [ preWord1, preTag1 ] = getWordTag(startWordTags[index - 1])
            object.context[2] = preWord1;
            object.context[3] = preTag1;
        }
        if (index > 1){
            let [ preWord2, preTag2 ] = getWordTag(startWordTags[index - 2])
            object.context[0] = preWord2;
            object.context[1] = preTag2;
        }
        if (index < startWordTags.length - 1){
            let [ nextWord1, nextTag1 ] = getWordTag(startWordTags[index + 1])
            object.context[6] = nextWord1;
            object.context[7] = nextTag1;
        }
        if( index < startWordTags.length - 2){
            let [ nextWord2, nextTag2 ] = getWordTag(startWordTags[index + 2])
            object.context[8] = nextWord2;
            object.context[9] = nextTag2;
        }
        return object;
    }
}

function getWordTag(wordTag){
    if(wordTag === "///"){
        return [ "/", "/" ];
    }

    let index = wordTag.lastIndexOf("/");
    let word = wordTag.slice(0, index).trim();
    let tag = wordTag.slice(index + 1).trim();
    return [ word, tag ];
}