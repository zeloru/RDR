'use strict';

const readFileSync = require('fs').readFileSync;
const Node = require('./Node');
const FWObject = require('./FWObject');

module.exports = class SCRDRTree {
    // Single Classification Ripple Down Rules tree for Part-of-Speech and morphological tagging

    constructor(root = null) {
        this.root = root;
    }

    // Build tree from file containing rules using FWObject
    constructSCRDRtreeFromRDRfile(rulesFilePath) {
        this.root = new Node(new FWObject(false), "NN", null, null, null, [], 0);
        let currentNode = this.root;
        let currentDepth = 0;

        let rulesContent = readFileSync(rulesFilePath, { encoding: 'utf-8' });
        let lines = rulesContent.split('\n');

        for (let i = 1; i < lines.length; i++) {
            let line = lines[i];
            let depth = 0;

            for (let c of line) {
                if (c === '\t') {
                    depth = depth + 1;
                }
                else {
                    break;
                }
            }

            line = line.trim();
            if (line.length === 0) {
                continue;
            }

            let temp = line.indexOf("cc");
            if (temp === 0) {
                continue;
            }

            let colonIndex = line.indexOf(':');
            let tokenLeft = line.slice(0, colonIndex - 1).trim();
            let tokenRight = line.slice(colonIndex + 2).trim();
            let condition = getCondition(tokenLeft);
            let conclusion = getConcreteValue(tokenRight);

            let node = new Node(condition, conclusion, null, null, null, [], depth);

            if (depth > currentDepth) {
                currentNode.exceptChild = node;
            }
            else if (depth === currentDepth) {
                currentNode.elseChild = node;
            }
            else {
                while (currentNode.depth !== depth) {
                    currentNode = currentNode.father;
                }
                currentNode.elseChild = node;
            }
            node.father = currentNode;
            currentNode = node;
            currentDepth = depth;
        }
    }

    findFiredNode(fwObject) {
        let currentNode = this.root;
        let firedNode = null;
        let obContext = fwObject.context;

        while (true) {
            // Check whether object satisfying the current node's condition
            let cnContext = currentNode.condition.context;
            let notNoneIds = currentNode.condition.notNoneIds;
            let satisfied = true;

            for (let i in notNoneIds) {
                if (cnContext[i] !== obContext[i]) {
                    satisfied = false;
                    break;
                }
            }

            if (satisfied) {
                firedNode = currentNode;
                let exChild = currentNode.exceptChild;
                if (exChild === null) {
                    break;
                }
                else {
                    currentNode = exChild;
                }
            }
            else {
                let elChild = currentNode.elseChild;
                if (elChild === null) {
                    break;
                }
                else {
                    currentNode = elChild;
                }
            }
        }
        return firedNode;
    }
}

function getConcreteValue(str) {
    if (str.indexOf('""') > 0) {
        if (str.indexOf("Word") > 0) {
            return "<W>";
        }
        else if (str.indexOf("suffixL") > 0) {
            return "<SFX>";

        } else {
            return "<T>";
        }
    }
    return str.slice(str.indexOf("\"") + 1, str.length - 1);
}

function getCondition(strCondition) {
    let condition = new FWObject(false);

    for (let rule of strCondition.split(" and ")) {
        rule = rule.trim()
        let key = rule.slice(rule.indexOf(".") + 1, rule.indexOf(" "))
        let value = getConcreteValue(rule);

        if (key === "prevWord2") {
            condition.context[0] = value;
        } else if (key === "prevTag2") {
            condition.context[1] = value;
        } else if (key === "prevWord1") {
            condition.context[2] = value;
        } else if (key === "prevTag1") {
            condition.context[3] = value;
        } else if (key === "word") {
            condition.context[4] = value;
        } else if (key === "tag") {
            condition.context[5] = value;
        } else if (key === "nextWord1") {
            condition.context[6] = value;
        } else if (key === "nextTag1") {
            condition.context[7] = value;
        } else if (key === "nextWord2") {
            condition.context[8] = value;
        } else if (key === "nextTag2") {
            condition.context[9] = value;
        } else if (key === "suffixL2") {
            condition.context[10] = value;
        } else if (key === "suffixL3") {
            condition.context[11] = value;
        } else if (key === "suffixL4") {
            condition.context[12] = value;
        }
    }
    for (let i = 0; i < 13; i++) {
        if (condition.context[i] !== null) {
            condition.notNoneIds.push(i)
        }
    }
    return condition;
}