class WebGLCanvas {
  constructor(canvas, globalState) {
    /**
     * Initializes the WebGL context.
     */
    this.gl = WebGLUtils.setupWebGL(canvas, {
      preserveDrawingBuffer: true,
    });

    if (!this.gl) {
      alert("WebGL isn't available");
      throw new Error("WebGL isn't available");
    }

    this.globalState = globalState;

    /**
     * Sets the viewport and clears the canvas.
     */
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0.75, 0.85, 0.8, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    /**
     * Creates the vertex and fragment shaders.
     */
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    /**
     * Sets the source code for the shaders.
     */
    const vertexShaderText = `
      precision mediump float;
      
      attribute vec4 vertPosition;
      attribute vec4 vertColor;
      varying vec4 fragColor;
      uniform mat4 uMatrix;
      uniform mat4 projectionMatrix;
      uniform mat4 viewTransformMatrix;

      attribute vec3 aNormal;
      varying vec3 vNormal;

      attribute vec2 a_texcoord;
      varying vec2 v_texcoord;
      
      void main()
      {
        fragColor = vertColor;
        gl_Position = viewTransformMatrix * projectionMatrix * uMatrix * vec4(vertPosition);
        vNormal = aNormal;
        v_texcoord = a_texcoord;
      }
    `
    this.gl.shaderSource(vertexShader, vertexShaderText);

    const fragmentShaderText = `
      precision mediump float;

      uniform vec3 uLightDirection;
      uniform bool uUseLighting;
      
      varying vec4 fragColor;
      varying vec3 vNormal;

      varying vec2 v_texcoord;
      uniform sampler2D u_texture;

      void main()
      {
        float light = dot(vNormal, normalize(uLightDirection));
        gl_FragColor = fragColor;
        if (uUseLighting) {
          gl_FragColor.rgb *= light;
        }
      }
    `
    this.gl.shaderSource(fragmentShader, fragmentShaderText);

    /**
     * Compiles the shaders.
     */
    this.gl.compileShader(vertexShader);
    if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
      console.error(
        "ERROR compiling vertex shader!",
        this.gl.getShaderInfoLog(vertexShader)
      );
      throw new Error("ERROR compiling vertex shader!");
    }

    this.gl.compileShader(fragmentShader);
    if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
      console.error(
        "ERROR compiling fragment shader!",
        this.gl.getShaderInfoLog(fragmentShader)
      );
      throw new Error("ERROR compiling fragment shader!");
    }

    /**
     * Creates the program and attaches the shaders.
     */
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error("ERROR linking program!", this.gl.getProgramInfoLog(this.program));
      throw new Error("ERROR linking program!");
    }

    /**
     * Validates the program.
     */
    this.gl.validateProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
      console.error("ERROR validating program!", this.gl.getProgramInfoLog(this.program));
      throw new Error("ERROR validating program!");
    }

    /**
     * Uses the program.
     */
    this.gl.useProgram(this.program);
  }

  /**
     * function render(vertices)
     *
     * Renders the vertices to the canvas.
     */
  render(vertices, normals, colors, matrix, type) {
    // * Position buffer
    const bufferObject = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferObject);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(flatten(vertices)),
      this.gl.STATIC_DRAW
    );

    const positionAttribLocation = this.gl.getAttribLocation(this.program, "vertPosition");


    this.gl.vertexAttribPointer(
      positionAttribLocation, // Attribute location
      4,
      this.gl.FLOAT,
      this.gl.FALSE,
      0,
      0
    );

    // * Normal buffer
    const bufferNormal = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferNormal);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(flatten(normals)),
      this.gl.STATIC_DRAW
    );

    const normalAttribLocation = this.gl.getAttribLocation(this.program, "aNormal");

    this.gl.vertexAttribPointer(
      normalAttribLocation, // Attribute location
      3,
      this.gl.FLOAT,
      this.gl.FALSE,
      0,
      0
    );

    // * Color buffer
    const bufferColor = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferColor);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(flatten(colors)),
      this.gl.STATIC_DRAW
    );


    const colorAttribLocation = this.gl.getAttribLocation(this.program, "vertColor");

    this.gl.vertexAttribPointer(
      colorAttribLocation, // Attribute location
      4,
      this.gl.FLOAT,
      this.gl.FALSE,
      0,
      0
    );

    // // * Texture buffer
    // const bufferTexture = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, bufferTexture);

    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
    //   new Float32Array(flatten(vertices)),
    //   gl.STATIC_DRAW
    // );

    // const textureAttribLocation = gl.getAttribLocation(program, "a_texcoord");
    // gl.enableVertexAttribArray(textureAttribLocation);

    // gl.vertexAttribPointer(
    //   textureAttribLocation, 
    //   4,
    //   gl.FLOAT,
    //   false,
    //   0,
    //   0
    // );

    // var texture = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, texture);

    // var level = 0;
    // var internalFormat = gl.RGBA;
    // var width = 1;
    // var height = 1;
    // var border = 0;
    // var srcFormat = gl.RGBA;
    // var srcType = gl.UNSIGNED_BYTE;
    // var pixel = new Uint8Array([0, 255, 0, 255]);
    // gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    // var image = new Image();
    // image.src = "Images/Free-Texture.png";
    
    const matrixUniLocation = this.gl.getUniformLocation(this.program, "uMatrix");
    const projectionMatrix = this.gl.getUniformLocation(this.program, "projectionMatrix");
    const viewTransformMatrix = this.gl.getUniformLocation(this.program, "viewTransformMatrix");

    // Handle camera matrix transformation
    const translateRMatrix = mTransform.translate(0, 0, this.globalState.cameraRadius); 
    cameraMatrix = mTransform.rotateY(degToRad(this.globalState.cameraRotation));
    cameraMatrix = mat4mult(cameraMatrix, translateRMatrix);
    
    const viewTransform = mUtil.inverseMat4(cameraMatrix);
    console.info(viewTransform);

    this.gl.uniformMatrix4fv(viewTransformMatrix, false, flatten(viewTransform));
    this.gl.uniformMatrix4fv(matrixUniLocation, false, matrix);
    // console.log(this.globalState.projectionType)

    if (this.globalState.projectionType == "perspective") {
      this.gl.uniformMatrix4fv(projectionMatrix, false, perspectiveMatrix());
    }
    else if (this.globalState.projectionType == "orthographic") {
      this.gl.uniformMatrix4fv(projectionMatrix, false, orthographicMatrix());
    } else {
      this.gl.uniformMatrix4fv(projectionMatrix, false, obliqueMatrix());
    }

    this.gl.enableVertexAttribArray(positionAttribLocation);
    this.gl.enableVertexAttribArray(normalAttribLocation);
    this.gl.enableVertexAttribArray(colorAttribLocation);

    var lightDirection =
        this.gl.getUniformLocation(this.program, "uLightDirection");
    
    this.gl.uniform3fv(lightDirection, this.globalState.lightPosition);
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, "uUseLighting"), this.globalState.isLight);

    // //texture
    // image.onload = function() {
    //   gl.bindTexture(gl.TEXTURE_2D, texture);
    //   gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    //   if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    //     gl.generateMipmap(gl.TEXTURE_2D);
    //   } else {
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //   }
    //   gl.drawArrays(type, 0, vertices.length);
    // };
    this.gl.drawArrays(type, 0, vertices.length);
  }

}

// /**
//  * Initializes the WebGL context.
//  */
// const gl = WebGLUtils.setupWebGL(canvas, {
//   preserveDrawingBuffer: true,
// });
// if (!gl) {
//   alert("WebGL isn't available");
//   throw new Error("WebGL isn't available");
// }

// /**
//  * Sets the viewport and clears the canvas.
//  */
// gl.viewport(0, 0, canvas.width, canvas.height);
// gl.clearColor(0.75, 0.85, 0.8, 1.0);
// gl.clearDepth(1.0);
// gl.enable(gl.DEPTH_TEST);
// gl.depthFunc(gl.LEQUAL);
// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// /**
//  * Creates the vertex and fragment shaders.
//  */
// const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

// /**
//  * Sets the source code for the shaders.
//  */
// const vertexShaderText = `
//   precision mediump float;
  
//   attribute vec4 vertPosition;
//   attribute vec4 vertColor;
//   varying vec4 fragColor;
//   uniform mat4 uMatrix;
//   uniform mat4 projectionMatrix;
//   uniform mat4 viewTransformMatrix;

//   attribute vec3 aNormal;
//   varying vec3 vNormal;

//   attribute vec2 a_texcoord;
//   varying vec2 v_texcoord;
  
//   void main()
//   {
//     fragColor = vertColor;
//     gl_Position = viewTransformMatrix * projectionMatrix * uMatrix * vec4(vertPosition);
//     vNormal = aNormal;
//     v_texcoord = a_texcoord;
//   }
// `
// gl.shaderSource(vertexShader, vertexShaderText);

// const fragmentShaderText = `
//   precision mediump float;

//   uniform vec3 uLightDirection;
//   uniform bool uUseLighting;
  
//   varying vec4 fragColor;
//   varying vec3 vNormal;

//   varying vec2 v_texcoord;
//   uniform sampler2D u_texture;

//   void main()
//   {
//     float light = dot(vNormal, normalize(uLightDirection));
//     gl_FragColor = fragColor;
//     if (uUseLighting) {
//       gl_FragColor.rgb *= light;
//     }
//   }
// `
// gl.shaderSource(fragmentShader, fragmentShaderText);

// /**
//  * Compiles the shaders.
//  */
// gl.compileShader(vertexShader);
// if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
//   console.error(
//     "ERROR compiling vertex shader!",
//     gl.getShaderInfoLog(vertexShader)
//   );
//   throw new Error("ERROR compiling vertex shader!");
// }

// gl.compileShader(fragmentShader);
// if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
//   console.error(
//     "ERROR compiling fragment shader!",
//     gl.getShaderInfoLog(fragmentShader)
//   );
//   throw new Error("ERROR compiling fragment shader!");
// }

// /**
//  * Creates the program and attaches the shaders.
//  */
// const program = gl.createProgram();
// gl.attachShader(program, vertexShader);
// gl.attachShader(program, fragmentShader);
// gl.linkProgram(program);
// if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//   console.error("ERROR linking program!", gl.getProgramInfoLog(program));
//   throw new Error("ERROR linking program!");
// }

// /**
//  * Validates the program.
//  */
// gl.validateProgram(program);
// if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
//   console.error("ERROR validating program!", gl.getProgramInfoLog(program));
//   throw new Error("ERROR validating program!");
// }

// /**
//  * Uses the program.
//  */
// gl.useProgram(program);

// /**
//  * function render(vertices)
//  *
//  * Renders the vertices to the canvas.
//  */
// function render(vertices, normals, colors, matrix, type) {
//   // * Position buffer
//   const bufferObject = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, bufferObject);
//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array(flatten(vertices)),
//     gl.STATIC_DRAW
//   );

//   const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");


//   gl.vertexAttribPointer(
//     positionAttribLocation, // Attribute location
//     4,
//     gl.FLOAT,
//     gl.FALSE,
//     0,
//     0
//   );

//   // * Normal buffer
//   const bufferNormal = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormal);
//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array(flatten(normals)),
//     gl.STATIC_DRAW
//   );

//   const normalAttribLocation = gl.getAttribLocation(program, "aNormal");

//   gl.vertexAttribPointer(
//     normalAttribLocation, // Attribute location
//     3,
//     gl.FLOAT,
//     gl.FALSE,
//     0,
//     0
//   );

//   // * Color buffer
//   const bufferColor = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);

//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array(flatten(colors)),
//     gl.STATIC_DRAW
//   );


//   const colorAttribLocation = gl.getAttribLocation(program, "vertColor");

//   gl.vertexAttribPointer(
//     colorAttribLocation, // Attribute location
//     4,
//     gl.FLOAT,
//     gl.FALSE,
//     0,
//     0
//   );

//   // // * Texture buffer
//   // const bufferTexture = gl.createBuffer();
//   // gl.bindBuffer(gl.ARRAY_BUFFER, bufferTexture);

//   // gl.bufferData(
//   //   gl.ARRAY_BUFFER,
//   //   new Float32Array(flatten(vertices)),
//   //   gl.STATIC_DRAW
//   // );

//   // const textureAttribLocation = gl.getAttribLocation(program, "a_texcoord");
//   // gl.enableVertexAttribArray(textureAttribLocation);

//   // gl.vertexAttribPointer(
//   //   textureAttribLocation, 
//   //   4,
//   //   gl.FLOAT,
//   //   false,
//   //   0,
//   //   0
//   // );

//   // var texture = gl.createTexture();
//   // gl.bindTexture(gl.TEXTURE_2D, texture);

//   // var level = 0;
//   // var internalFormat = gl.RGBA;
//   // var width = 1;
//   // var height = 1;
//   // var border = 0;
//   // var srcFormat = gl.RGBA;
//   // var srcType = gl.UNSIGNED_BYTE;
//   // var pixel = new Uint8Array([0, 255, 0, 255]);
//   // gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

//   // var image = new Image();
//   // image.src = "Images/Free-Texture.png";
  
//   const matrixUniLocation = gl.getUniformLocation(program, "uMatrix");
//   const projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
//   const viewTransformMatrix = gl.getUniformLocation(program, "viewTransformMatrix");

//   // Handle camera matrix transformation
//   const translateRMatrix = mTransform.translate(0, 0, globalState.cameraRadius); 
//   cameraMatrix = mTransform.rotateY(degToRad(globalState.cameraRotation));
//   cameraMatrix = mat4mult(cameraMatrix, translateRMatrix);
  
//   const viewTransform = mUtil.inverseMat4(cameraMatrix);
//   console.info(viewTransform);

//   gl.uniformMatrix4fv(viewTransformMatrix, false, flatten(viewTransform));
//   gl.uniformMatrix4fv(matrixUniLocation, false, matrix);
//   // console.log(globalState.projectionType)

//   if (globalState.projectionType == "perspective") {
//     gl.uniformMatrix4fv(projectionMatrix, false, perspectiveMatrix());
//   }
//   else if (globalState.projectionType == "orthographic") {
//     console.log("AAAA")
//     gl.uniformMatrix4fv(projectionMatrix, false, orthographicMatrix());
//   } else {
//     console.log("BBBB")
//     gl.uniformMatrix4fv(projectionMatrix, false, obliqueMatrix());
//   }

//   gl.enableVertexAttribArray(positionAttribLocation);
//   gl.enableVertexAttribArray(normalAttribLocation);
//   gl.enableVertexAttribArray(colorAttribLocation);

//   var lightDirection =
//       gl.getUniformLocation(program, "uLightDirection");
  
//   gl.uniform3fv(lightDirection, globalState.lightPosition);
//   gl.uniform1i(gl.getUniformLocation(program, "uUseLighting"), globalState.isLight);

//   // //texture
//   // image.onload = function() {
//   //   gl.bindTexture(gl.TEXTURE_2D, texture);
//   //   gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
//   //   if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
//   //     gl.generateMipmap(gl.TEXTURE_2D);
//   //   } else {
//   //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//   //   }
//   //   gl.drawArrays(type, 0, vertices.length);
//   // };
//   gl.drawArrays(type, 0, vertices.length);
// }

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}