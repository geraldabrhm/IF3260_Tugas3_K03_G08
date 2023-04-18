class TransformationStack {
    constructor() {
        this.contents = [];
    }

    push(type, value) {
        this.contents.push(new Transformation(type, value))
    }

    pop() {
        return this.contents.pop();
    }
}

class Transformation {
    constructor(type, value) {
        this.type = type;   // translate / rotate / scale
        this.value = value; // [x, y, z]
    }
}