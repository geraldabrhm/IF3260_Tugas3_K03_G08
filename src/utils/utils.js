function vec4(x, y, z, w) {
  return [x, y, z, w];
}

function flatten(arr) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}

function mat4mult(m1, m2) {
  let m3 = [];
  let currentElement = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      currentElement = 0;
      for (let k = 0; k < 4; k++) {
        currentElement += m1[4 * k + j] * m2[4 * i + k];
      }
      m3.push(currentElement);
    }
  }

  return m3;
}

function vec4multmat4(v, m) {
  let vRes = [];
  let currentElement = 0;

  for (let i = 0; i < 4; i++) {
    currentElement = 0;
    for (let j = 0; j < 4; j++) {
      currentElement += v[j] * m[4 * j + i];
    }
    vRes.push(currentElement);
  }

  return vRes;
}

function normal(m) {
    const [a, b, c] = m;

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

    return normal;
}

function generateTransformationMatrix(transformationState, centroid) {
  translation = transformationState.translation;
  rotation = transformationState.rotation;
  scale = transformationState.scale;

  const transformMat = mat4mult(
    translationMatrix(translation[0], translation[1], translation[2]),
    mat4mult(
      scaleMatrix(scale[0], scale[1], scale[2]),
      rotationMatrix(rotation[0], rotation[1], rotation[2], centroid)
    )
  );
  return transformMat;
}

function translationMatrix(x, y, z) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ];
}

function rotationMatrix(x, y, z, centroid) {
  let cx = Math.cos(x);
  let sx = Math.sin(x);

  let firstTranslationMatrix = translationMatrix(centroid[0],
    centroid[1], centroid[2]);

  let xRotationMatrix = [
    1, 0, 0, 0,
    0, cx, sx, 0,
    0, -sx, cx, 0,
    0, 0, 0, 1
  ];

  let cy = Math.cos(y);
  let sy = Math.sin(y);

  let yRotationMatrix = [
    cy, 0, sy, 0,
    0, 1, 0, 0,
    -sy, 0, cy, 0,
    0, 0, 0, 1
  ];

  let cz = Math.cos(z);
  let sz = Math.sin(z);

  let zRotationMatrix = [
    cz, -sz, 0, 0,
    sz, cz, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

  let secondTranslationMatrix = translationMatrix(-centroid[0],
    -centroid[1], -centroid[2]);

  return mat4mult(
      mat4mult(
        firstTranslationMatrix,
        mat4mult(mat4mult(xRotationMatrix, yRotationMatrix), zRotationMatrix)
      ), 
      secondTranslationMatrix
    );
}

function scaleMatrix(x, y, z) {
  return [
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ];
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}