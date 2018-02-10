'use strict';

module.exports = class Node {
    // A class to represent the nodes in SCRDR tree

    constructor(condition, conclusion, 
                father = null, exceptChild = null, elseChild = null, 
                cornerstoneCases = [], depth = 0){
        this.condition = condition;
        this.conclusion = conclusion;
        this.exceptChild = exceptChild;
        this.elseChild = elseChild;
        this.cornerstoneCases = cornerstoneCases;
        this.father = father;
        this.depth = depth;
    }
}
