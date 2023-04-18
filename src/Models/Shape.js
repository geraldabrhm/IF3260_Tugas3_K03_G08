class Shape {
    constructor() {
      this.faces = [];
    }

    load(faces) {
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
  
    getFaces() {
      return this.faces;
    }

    addFace(face) {
        this.faces.push(face);
    }

    getCentroid() {
        let centroid = [0, 0, 0];
        let totalVertices = 0;
        this.faces.forEach(face => {
            totalVertices += face.vertices.length;
            for (let i = 0; i < face.vertices.length; i++) {
                const [x, y, z, w] = face.getVertices()[i];
                centroid[0] += x;
                centroid[1] += y;
                centroid[2] += z;
            }
        });
        
        centroid[0] /= totalVertices;
        centroid[1] /= totalVertices;
        centroid[2] /= totalVertices;

        return centroid;
    }

    generateTransformedShape(transformationState) {
        let transformedShape = new Shape();
        let transformationMatrix = generateTransformationMatrix(transformationState, this.getCentroid());
        
        transformedShape.load(this.getFaces());
        transformedShape.faces.forEach(face => {
            for (let i = 0; i < face.vertices.length; i++) {
                face.getVertices()[i] = vec4multmat4(face.getVertices()[i], transformationMatrix);
            }
        });

        return transformedShape;
    }

    draw() {
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.faces.forEach(face => face.draw(mUtil.identity()));
    }
  }