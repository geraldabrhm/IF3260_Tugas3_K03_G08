class TransformationStack {
    constructor() {
        this.contents = [];
    }

    push(type, value) {
        // Adds a new transformation
        if (type == "translate") {
            this.contents.push(mTransform.translate(value[0], value[1], value[2]));
        }
        else if (type == "rotate") {
            this.contents.push(mTransform.rotate(value[0], value[1], value[2]));
        }
        else if (type == "scale") {
            this.contents.push(mTransform.scale(value[0], value[1], value[2]));
        }
        else {
            console.log("Invalid transformation type");
        }
    }

    pop() {
        // Return matrix for the upper most transformation
        return this.contents.pop();
    }

    pop3() {
        this.contents.pop();
        this.contents.pop();
        this.contents.pop();
    }

    generateTransformationMatrix() {
        let res = mUtil.identity();

        for (let i = this.contents.length-1; i >= 0; i--) {
            res = mat4mult(this.contents[i], res);
        }

        return res;
    }
}