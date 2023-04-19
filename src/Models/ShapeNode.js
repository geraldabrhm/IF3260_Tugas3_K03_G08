class ShapeNode {
    constructor(obj) {
        this.name = obj.name;

        this.faces = [];
        this.loadFaces(obj.faces);

        this.objectTranslate = obj.objectTranslate;
        this.objectRotate = obj.objectRotate;
        this.objectScale = obj.objectScale;
        this.pivotTranslate = obj.pivotTranslate;
        this.pivotRotate = obj.pivotRotate;
        this.pivotScale = obj.pivotScale;
        this.texture = obj.texture;

        this.animation = [];
        this.loadAnimationFrames(obj.animation);

        this.children = [];
        for (let i = 0; i < obj.children.length; i++) {
            this.children.push(new ShapeNode(obj.children[i]));
        }
    }

    loadFaces(faces) {
        for (const vertcol of faces) {
            const face = new Face();
            for (const vert of vertcol.vertices) {
                face.addVertex(vert);
            }
            for (const col of vertcol.colors) {
                face.addColors(col);
            }
            this.faces.push(face);
        }
    }

    loadAnimationFrames(frames) {
        for (const frame of frames) {
            const f = new AnimationFrame(frame);
            this.animation.push(f);
        }
    }

    draw() {
        this.drawWithSubtrees(new TransformationStack());
    }

    drawSingle(stack) {
        // Generate transformation matrix from stack
        stack.push("scale", this.objectScale);
        stack.push("rotate", this.objectRotate);
        stack.push("translate", this.objectTranslate);

        let transformationMatrix = stack.generateTransformationMatrix();

        console.log(stack.generateTransformationMatrix());

        this.faces.forEach(face => face.draw(transformationMatrix));

        stack.pop3();
    }

    drawWithSubtrees(stack) {
        stack.push("scale", this.pivotScale);
        stack.push("rotate", this.pivotRotate);
        stack.push("translate", this.pivotTranslate);

        this.drawSingle(stack);
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].drawWithSubtrees(stack);
        }

        stack.pop3();
    }
}

