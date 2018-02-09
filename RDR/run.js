const SCRDRTree = require('./SCRDRTree');
const FWObject = require('./FWObject');
const initializeSentence = require('./InitialTagger').initializeSentence;
const { getWordTag, readDictionary } = require('./Utils');

class RDRPOSTagger extends SCRDRTree {
    constructor() {
        super();
        this.root = null;
    }

    tagRawSentence(DICT, sentence) {
        let line = initializeSentence(DICT, sentence);
        let words = [];
        let wordTags = line.split(' ');
        for(let i  = 0; i < wordTags.length; i++){
            let fwObject = FWObject.getFWObject(wordTags, i);
            let { word, tag } = getWordTag(wordTags[i]);
            let node = this.findFiredNode(fwObject);
            if(node.depth > 0){
                words.push(word + "/" + node.conclusion);
            }
            else{
                // Fired at root, return initialized tag
                words.push(word + "/" + tag)
            }
        }

        return wordTags.join(' ');
    }
}

let text = "Chân sút dội bom nhất U23 Việt Nam Nguyễn Quang Hải nhận được lời đề nghị hấp dẫn từ Nhật Bản, thay cho những lời mời mọc, quyến rũ từ Thai League.";

let tagger = new RDRPOSTagger();
tagger.constructSCRDRtreeFromRDRfile('./Models/Vietnamese.RDR')
let DICT = readDictionary('./Models/Vietnamese.DICT')
let s = tagger.tagRawSentence(DICT, text)
console.log(s)
