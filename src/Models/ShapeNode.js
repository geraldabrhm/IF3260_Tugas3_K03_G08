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
        this.textureIndex = obj.textureIndex? obj.textureIndex : 0;
        // this.bumpIndex = obj.bumpIndex ? obj.bumpIndex : 0;

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

    updateAllChildrenTexture(texture) {
        this.texture = texture;
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].updateAllChildrenTexture(texture);
        }
    }

    updateAllChildrenTextureCustom(Index) {
        this.textureIndex = Index;
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].updateAllChildrenTextureCustom(Index);
        }
    }

    // ! Unused
    // updateAllChildrenTextureBump(Index) {
    //     this.bumpIndex = Index; 
    //     for (let i = 0; i < this.children.length; i++) {
    //         this.children[i].updateAllChildrenTextureBump(Index);
    //     }
    // }

    loadAnimationFrames(frames) {
        for (const frame of frames) {
            const f = new AnimationFrame(frame);
            this.animation.push(f);
        }
    }

    draw(glCanvas, type, curFrame, framesBetween) {
        if (type == "subtree"){
            this.drawWithSubtrees(new TransformationStack(), glCanvas, curFrame, framesBetween);
        } else {
            this.drawSingle(new TransformationStack(), glCanvas);
        }
    }

    drawSingle(stack, glCanvas) {
        // Generate transformation matrix from stack
        stack.push("translate", this.objectTranslate);
        stack.push("rotate", this.objectRotate);
        stack.push("scale", this.objectScale);

        let transformationMatrix = stack.generateTransformationMatrix();

        this.faces.forEach(face => face.draw(transformationMatrix, glCanvas, this.texture, this.textureIndex, this.bumpIndex));

        stack.pop3();
    }

    drawWithSubtrees(stack, glCanvas, curFrame, framesBetween) { 
        stack.push("translate", this.pivotTranslate);
        stack.push("rotate", this.pivotRotate);
        stack.push("scale", this.pivotScale);

        let animationTransformation = this.smoothenTransformation(curFrame, framesBetween);

        stack.push("translate", animationTransformation.translate);
        stack.push("rotate", animationTransformation.rotate);
        stack.push("scale", animationTransformation.scale);

        this.drawSingle(stack, glCanvas);
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].drawWithSubtrees(stack, glCanvas, curFrame, framesBetween);
        }

        stack.pop3();
        stack.pop3();
    }

    smoothenTransformation(curFrame, numOfFramesBetween) {
        if (curFrame % (numOfFramesBetween+1) == 0) {
            return this.animation[curFrame / (numOfFramesBetween+1)];
        }
        else {
            let preFrame = this.animation[Math.floor(curFrame / (numOfFramesBetween+1))];
            let postFrame = this.animation[Math.ceil(curFrame / (numOfFramesBetween+1))];

            let order = curFrame % (numOfFramesBetween+1);

            let translate = [
                this.calculateSmoothValue(preFrame.translate[0], postFrame.translate[0], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.translate[1], postFrame.translate[1], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.translate[2], postFrame.translate[2], order, numOfFramesBetween+1),
            ]

            let rotate = [
                this.calculateSmoothValue(preFrame.rotate[0], postFrame.rotate[0], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.rotate[1], postFrame.rotate[1], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.rotate[2], postFrame.rotate[2], order, numOfFramesBetween+1),
            ]

            let scale = [
                this.calculateSmoothValue(preFrame.scale[0], postFrame.scale[0], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.scale[1], postFrame.scale[1], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.scale[2], postFrame.scale[2], order, numOfFramesBetween+1),
            ]

            return new AnimationFrame({
                "translate": translate,
                "rotate": rotate,
                "scale": scale
            });
        }
    }

    calculateSmoothValue(valuePre, valuePost, order, total) {
        return (valuePre * (total-order) + valuePost * order) / total
    }

    getMaximumNumberOfFrames() {
        let max = this.animation.length;
        for (let i = 0; i < this.children.length; i++) {
            max = Math.max(max, this.children[i].getMaximumNumberOfFrames());
        }
        return max;
    }

    smoothenTransformation(curFrame, numOfFramesBetween) {
        if (curFrame % (numOfFramesBetween+1) == 0) {
            return this.animation[curFrame / (numOfFramesBetween+1)];
        }
        else {
            let preFrame = this.animation[Math.floor(curFrame / (numOfFramesBetween+1))];
            let postFrame = this.animation[Math.ceil(curFrame / (numOfFramesBetween+1))];

            let order = curFrame % (numOfFramesBetween+1);

            let translate = [
                this.calculateSmoothValue(preFrame.translate[0], postFrame.translate[0], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.translate[1], postFrame.translate[1], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.translate[2], postFrame.translate[2], order, numOfFramesBetween+1),
            ]

            let rotate = [
                this.calculateSmoothValue(preFrame.rotate[0], postFrame.rotate[0], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.rotate[1], postFrame.rotate[1], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.rotate[2], postFrame.rotate[2], order, numOfFramesBetween+1),
            ]

            let scale = [
                this.calculateSmoothValue(preFrame.scale[0], postFrame.scale[0], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.scale[1], postFrame.scale[1], order, numOfFramesBetween+1),
                this.calculateSmoothValue(preFrame.scale[2], postFrame.scale[2], order, numOfFramesBetween+1),
            ]

            return new AnimationFrame({
                "translate": translate,
                "rotate": rotate,
                "scale": scale
            });
        }
    }

    calculateSmoothValue(valuePre, valuePost, order, total) {
        return (valuePre * (total-order) + valuePost * order) / total
    }

    getMaximumNumberOfFrames() {
        let max = this.animation.length;
        for (let i = 0; i < this.children.length; i++) {
            max = Math.max(max, this.children[i].getMaximumNumberOfFrames());
        }
        return max;
    }
}

