class WebGLCanvas {
  constructor(canvas, globalState) {
    /**
     * Initializes the WebGL context.
     */
    this.textures = [];
    this.bumpTextures = [];
    this.gl = WebGLUtils.setupWebGL(canvas, {
      preserveDrawingBuffer: true,
    });
    // this.gl.getExtension('OES_standard_derivatives');
    // const derivativeExt = this.gl.getExtension('OES_standard_derivatives');
    // this.gl.enable(derivativeExt);
    
    // const supportedExt = this.gl.getSupportedExtensions();
    // console.log(supportedExt);
    var ext = this.gl.getExtension("OES_standard_derivatives");

    if (!ext) {
      console.error("Extension not found");
    }

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
      attribute vec2 a_texcoord;
      attribute vec3 aNormal;

      varying vec4 fragColor;
      varying vec2 v_texcoord;
      varying vec3 vNormal;
      varying vec3 vNormalBump;

      uniform mat4 uMatrix;
      uniform mat4 projectionMatrix;
      uniform mat4 viewTransformMatrix;

      varying vec3 v_worldPosition;
      varying vec3 cameraPosition;

      void main()
      {
        fragColor = vertColor;
        gl_Position = projectionMatrix * viewTransformMatrix * uMatrix * vec4(vertPosition);
        vNormal = aNormal;
        
        vec3 transformedNormal = vec3(uMatrix * vec4(aNormal, 0.0));
        vNormalBump = normalize(transformedNormal);

        v_texcoord = a_texcoord;
        v_worldPosition = (uMatrix * vec4(vertPosition)).xyz;

        cameraPosition = vec3(viewTransformMatrix[3][0], viewTransformMatrix[3][1], viewTransformMatrix[3][2]);
      }
    `
    this.gl.shaderSource(vertexShader, vertexShaderText);

    const fragmentShaderText = `
      #extension GL_OES_standard_derivatives : enable
      precision mediump float;
      
      varying vec4 fragColor;
      varying vec2 v_texcoord;
      varying vec3 vNormal;
      varying vec3 vNormalBump;
      
      uniform vec3 uLightDirection;
      uniform bool uUseLighting;
      uniform bool uUseTextureCustom;
      uniform bool uUseTextureBump;
      uniform sampler2D u_texture;
      uniform sampler2D u_bump_texture;
      uniform samplerCube u_cube_texture;

      varying vec3 v_worldPosition;
      varying vec3 cameraPosition;

      void main()
      {
        if (uUseTextureCustom) {
          gl_FragColor = texture2D(u_texture, v_texcoord);
        } else if(uUseTextureBump) {
          float hllr = texture2D(u_texture, v_texcoord).r;
          float hllg = texture2D(u_texture, v_texcoord).g;
          float hllb = texture2D(u_texture, v_texcoord).b;
          float hll = (hllr + hllg + hllb) / 3.0;
          float hlrr = texture2D(u_texture, v_texcoord + vec2(dFdx(vec3(v_texcoord, 0.0)).x, 0.0)).r;
          float hlrg = texture2D(u_texture, v_texcoord + vec2(dFdx(vec3(v_texcoord, 0.0)).x, 0.0)).g;
          float hlrb = texture2D(u_texture, v_texcoord + vec2(dFdx(vec3(v_texcoord, 0.0)).x, 0.0)).b;
          float hlr = (hlrr + hlrg + hlrb) / 3.0;
          float hulr = texture2D(u_texture, v_texcoord + vec2(0.0, dFdy(vec3(v_texcoord, 0.0)).y)).r;
          float hulg = texture2D(u_texture, v_texcoord + vec2(0.0, dFdy(vec3(v_texcoord, 0.0)).y)).g;
          float hulb = texture2D(u_texture, v_texcoord + vec2(0.0, dFdy(vec3(v_texcoord, 0.0)).y)).b;
          float hul = (hulr + hulg + hulb) / 3.0;

          vec3 surface_gradient = vec3(hlr - hll, hul - hll, 0.8);
          vec3 perturb_normal = normalize(vNormal + surface_gradient);
          vec3 bump_normal = perturb_normal;

          gl_FragColor = texture2D(u_texture, v_texcoord);
          gl_FragColor.rgb *= dot(bump_normal, normalize(uLightDirection));
        } else {
          vec3 worldNormal = normalize(vNormal);
          vec3 eyeToSurfaceDir =  normalize(v_worldPosition - cameraPosition);
          vec3 reflection = reflect(eyeToSurfaceDir, worldNormal);

          gl_FragColor = textureCube(u_cube_texture, reflection);
        }
        float light = dot(vNormal, normalize(uLightDirection));
        if (uUseLighting && !uUseTextureBump) {
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

    this.images = 
    [
      "Images/Texture1.png",
      "Images/Texture2.png",
      "Images/Texture3.png",
      "Images/Texture4.png",
    ];

    for (var i = 0; i < this.images.length; i++) 
    {
      const texture = this.gl.createTexture();
      this.gl.activeTexture(this.gl.TEXTURE0 + i);
      // console.info(`Custom: ${this.gl.TEXTURE0 + i}`); // ! Debug
      this.textures.push(texture);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[i]);

      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        1,
        1,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255])
      );

      function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
      }

      const image = new Image();
      image.src = this.images[i];
      image.i = i
      image.onload = () => {
        this.gl.activeTexture(this.gl.TEXTURE0 + image.i);
        // console.info(`Custom, image onload: ${this.gl.TEXTURE0 + image.i}`) // ! Debug
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[image.i]);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          this.gl.generateMipmap(this.gl.TEXTURE_2D);
        } else {
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        }
      }
    }

    // reflection texture
    const reflectionTexture = this.gl.createTexture();

    this.gl.activeTexture(this.gl.TEXTURE0 + this.images.length);
    // console.info(`Reflective: ${this.gl.TEXTURE0 + this.images.length}`) // ! Debug
    this.textures.push(reflectionTexture);
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textures[this.images.length]);

    const faceInfos = [
      {
        target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        url: 'Images/pos-x.jpg',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        url: 'Images/neg-x.jpg',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        url: 'Images/pos-y.jpg',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        url: 'Images/neg-y.jpg',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        url: 'Images/pos-z.jpg',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        url: 'Images/neg-z.jpg',
      },
    ];

    faceInfos.forEach((faceInfo) => {
      const {target, url} = faceInfo;

      const level = 0;
      const internalFormat = this.gl.RGBA;
      const width = 512;
      const height = 512;
      const format = this.gl.RGBA;
      const type = this.gl.UNSIGNED_BYTE;
      this.gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

      const image = new Image();
      image.src = url;
      image.onload = () => {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.images.length);
        // console.info(`Reflective onload: ${this.gl.TEXTURE0 + this.images.length}`); // ! Debug
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textures[this.images.length]);
        this.gl.texImage2D(target, level, internalFormat, format, type, image);
        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
      }
    });
    this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
    this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);

    // bump texture
    this.bumpMapImages = 
    [
      "Images/Displacement1.jpg",
      "Images/Displacement2.jpg",
      "Images/Displacement3.jpg",
      "Images/Displacement4.jpg",
    ];

    for (var i = 0; i < this.bumpMapImages.length; i++) 
    {
      const texture = this.gl.createTexture();
      this.gl.activeTexture(this.gl.TEXTURE0 + i + this.images.length + 1);
      // console.info(`Bump: ${this.gl.TEXTURE0 + i + this.images.length + 1}`); // ! Debug
      this.bumpTextures.push(texture);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.bumpTextures[i]);

      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        1,
        1,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255])
      );

      function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
      }

      const imageForBumpMap = new Image();
      imageForBumpMap.src = this.bumpMapImages[i];
      imageForBumpMap.i = i
      imageForBumpMap.onload = () => {
        this.gl.activeTexture(this.gl.TEXTURE0 + imageForBumpMap.i + this.images.length + 1);
        // console.info(`Bump onload: ${this.gl.TEXTURE0 + imageForBumpMap.i + this.images.length + 1}`); // ! Debug
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.bumpTextures[imageForBumpMap.i]);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageForBumpMap);
        if (isPowerOf2(imageForBumpMap.width) && isPowerOf2(imageForBumpMap.height)) {
          this.gl.generateMipmap(this.gl.TEXTURE_2D);
        } else {
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        }
      }
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  /**
     * function render(vertices)
     *
     * Renders the vertices to the canvas.
     */
  render(vertices, normals, colors, matrix, type, texture, textureIndex, bumpTextureIndex) {
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


    const textureCoordinate = [];

    // generate 2d texture coordinate form verticces
    const n = normal(vertices);

    let maxIndex = 0;
    for (let i = 0; i < n.length; i++) {
      if (Math.abs(n[i]) > Math.abs(n[maxIndex])) {
        maxIndex = i;
      }
    }

    // console.log(maxIndex); // ! Debug

    for (let i = 0; i < vertices.length; i++) {
      if (maxIndex === 0) {
        textureCoordinate.push([vertices[i][1], vertices[i][2]]);
      } else if (maxIndex === 1) {
        textureCoordinate.push([vertices[i][2], vertices[i][0]]);
      } else {
        textureCoordinate.push([vertices[i][0], vertices[i][1]]);
      }
    }

    const bufferTexture = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferTexture);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(flatten(textureCoordinate)),
      this.gl.STATIC_DRAW
    );

    const textureAttribLocation = this.gl.getAttribLocation(this.program, "a_texcoord");
    this.gl.enableVertexAttribArray(textureAttribLocation);

    this.gl.vertexAttribPointer(
      textureAttribLocation, 
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    
    const matrixUniLocation = this.gl.getUniformLocation(this.program, "uMatrix");
    const projectionMatrix = this.gl.getUniformLocation(this.program, "projectionMatrix");
    const viewTransformMatrix = this.gl.getUniformLocation(this.program, "viewTransformMatrix");
    const uTexture = this.gl.getUniformLocation(this.program, "u_texture");
    const uBumpTexture = this.gl.getUniformLocation(this.program, "u_bump_texture");
    const uCubeTexture = this.gl.getUniformLocation(this.program, "u_cube_texture");
    const uUseTextureCustom = this.gl.getUniformLocation(this.program, "uUseTextureCustom");
    const uUseTextureBump = this.gl.getUniformLocation(this.program, "uUseTextureBump");

    if (texture == "custom") 
    {
      this.gl.uniform1i(uUseTextureCustom, 1);
      this.gl.uniform1i(uUseTextureBump, 0);
    } else {
      this.gl.uniform1i(uUseTextureCustom, 0);
    }

    if (texture == "bump")
    {
      this.gl.uniform1i(uUseTextureBump, 1);
      this.gl.uniform1i(uUseTextureCustom, 0);
    } else {
      this.gl.uniform1i(uUseTextureBump, 0);
    }

    // console.info(`The bump texture index: ${bumpTextureIndex}`) // ! Debug
    // console.info(`The texture index: ${textureIndex}`) // ! Debug
    this.gl.uniform1i(uCubeTexture, 4);
    this.gl.uniform1i(uTexture, textureIndex);
    // this.gl.uniform1i(uBumpTexture, bumpTextureIndex);

    

    // Handle camera matrix transformation
    const translateRMatrix = mTransform.translate(0, 0, -this.globalState.cameraRadius); 
    cameraMatrix = mTransform.rotateY(degToRad(this.globalState.cameraRotation));
    cameraMatrix = mat4mult(cameraMatrix, translateRMatrix);
    
    const viewTransform = mUtil.inverseMat4(cameraMatrix);

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