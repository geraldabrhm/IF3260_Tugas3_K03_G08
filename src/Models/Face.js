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

  generateNormal() {
    const [a, b, c] = this.vertices;
    const [x1, y1, z1] = a;
    const [x2, y2, z2] = b;
    const [x3, y3, z3] = c;

    const v1 = [x2 - x1, y2 - y1, z2 - z1];
    const v2 = [x3 - x1, y3 - y1, z3 - z1];

    const normal = [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0]
    ];

    const magnitude = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
    normal[0] /= magnitude;
    normal[1] /= magnitude;
    normal[2] /= magnitude;

    const normalMat = []

    for (let i = 0; i < this.vertices.length; i++) {
      normalMat.push(normal);
    }

    return normalMat;
  }

  draw(matrixTransformation) {
      render(this.vertices, this.generateNormal(), this.colors, matrixTransformation, gl.TRIANGLE_FAN);
  }
}