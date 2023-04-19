class Face {
  constructor() {
    this.vertices = [];
    this.colors = [];
  }

  getVertices() {
    return this.vertices;
  }

  addVertex(vertex) {
      this.vertices.push(vertex);
  }

  addColors(color) {
      this.colors.push(color);
  }

  generateNormal(transformationMatrix) {

  const cloneVertices = [...this.vertices];
    
  for (let i = 0; i < cloneVertices.length; i++) {
    cloneVertices[i] = vec4multmat4(cloneVertices[i], transformationMatrix);
  }

    const n = normal(cloneVertices)

    const normalMat = []

    for (let i = 0; i < cloneVertices.length; i++) {
      normalMat.push(n);
    }

    return normalMat;
  }

  draw(matrixTransformation, glCanvas, texture, textureIndex) {
      glCanvas.render(this.vertices, this.generateNormal(matrixTransformation), this.colors, matrixTransformation, glCanvas.gl.TRIANGLE_FAN, texture, textureIndex);
  }
}