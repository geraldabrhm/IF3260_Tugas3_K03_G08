// Canvas
const modelCanvas = document.getElementById("webgl-canvas");
const modelgl = new WebGLCanvas(modelCanvas, globalState);
const ssCanvas = document.getElementById("webgl-canvas-ss");
const ssgl = new WebGLCanvas(ssCanvas, ssGlobalState);

// Model Control
const selectedTextureType = document.getElementById("selectedTextureType");
const selectedTextureTypeCustom = document.getElementById("selectedTextureTypeCustomS");
const selectedTextureTypeBump = document.getElementById("selectedTextureTypeBumpS");
const rotateX = document.getElementById("rotateX");
const rotateY = document.getElementById("rotateY");
const rotateZ = document.getElementById("rotateZ");
const translateX = document.getElementById("translateX");
const translateY = document.getElementById("translateY");
const translateZ = document.getElementById("translateZ");
const scaleX = document.getElementById("scaleX");
const scaleY = document.getElementById("scaleY");
const scaleZ = document.getElementById("scaleZ");

// Subtree Control
const selectedTextureTypeSs = document.getElementById("selectedTextureTypeSs");
const selectedTextureTypeSsCustom = document.getElementById("selectedTextureTypeSsCustomS");
const selectedTextureTypeSsBump = document.getElementById("selectedTextureTypeSsBumpS");
const rotateXsubtree = document.getElementById("rotateXsubtree");
const rotateYsubtree = document.getElementById("rotateYsubtree");
const rotateZsubtree = document.getElementById("rotateZsubtree");
const translateXsubtree = document.getElementById("translateXsubtree");
const translateYsubtree = document.getElementById("translateYsubtree");
const translateZsubtree = document.getElementById("translateZsubtree");
const scaleXsubtree = document.getElementById("scaleXsubtree");
const scaleYsubtree = document.getElementById("scaleYsubtree");
const scaleZsubtree = document.getElementById("scaleZsubtree");

// Single Control
const selectedTextureTypeSingle = document.getElementById("selectedTextureTypeSingle");
const selectedTextureTypeSingleCustom = document.getElementById("selectedTextureTypeSingleCustomS");
const selectedTextureTypeSingleBump = document.getElementById("selectedTextureTypeSingleBumpS");
const rotateXsingle = document.getElementById("rotateXsingle");
const rotateYsingle = document.getElementById("rotateYsingle");
const rotateZsingle = document.getElementById("rotateZsingle");
const translateXsingle = document.getElementById("translateXsingle");
const translateYsingle = document.getElementById("translateYsingle");
const translateZsingle = document.getElementById("translateZsingle");
const scaleXsingle = document.getElementById("scaleXsingle");
const scaleYsingle = document.getElementById("scaleYsingle");
const scaleZsingle = document.getElementById("scaleZsingle");

// Animation Control
const animPlayPause = document.getElementById("animPlayPause");
const currentFrameSpan = document.getElementById("currentFrame");
const totalFramesSpan = document.getElementById("totalFrames");

// Model View
const selectedProjection = document.getElementById("selectedProjection");
const cameraAngle = document.getElementById("cameraAngle");
const cameraRadius = document.getElementById("cameraRadius");
const lightPositionX = document.getElementById("lightPositionX");
const lightPositionY = document.getElementById("lightPositionY");
const lightPositionZ = document.getElementById("lightPositionZ");
const lightCheckbox = document.getElementById("lightCheckbox");
const resetViewbtn = document.getElementById("reset-view-btn");

// Single / Subtree View
const selectedProjectionSs = document.getElementById("selectedProjectionSs");
const selectedViewSs = document.getElementById("selectedViewSs");
const cameraAngleSs = document.getElementById("cameraAngleSs");
const cameraRadiusSs = document.getElementById("cameraRadiusSs");
const lightPositionXSs = document.getElementById("lightPositionXSs");
const lightPositionYSs = document.getElementById("lightPositionYSs");
const lightPositionZSs = document.getElementById("lightPositionZSs");
const lightCheckboxSs = document.getElementById("lightCheckboxSs");
const resetViewbtnSs = document.getElementById("reset-view-btnSs");

window.onload = function main() {
    // Model Control
    rotateX.addEventListener("input", function() {
        rootShapeNode.pivotRotate[0] = rotateX.value;
        refresh();
    });
    rotateY.addEventListener("input", function() {
        rootShapeNode.pivotRotate[1] = rotateY.value;
        refresh();
    });
    rotateZ.addEventListener("input", function() {
        rootShapeNode.pivotRotate[2] = rotateZ.value;
        refresh();
    });

    translateX.addEventListener("input", e => {
        rootShapeNode.pivotTranslate[0] = translateX.value;
        refresh();
    });
    translateY.addEventListener("input", e => {
        rootShapeNode.pivotTranslate[1] = translateY.value;
        refresh();
    });
    translateZ.addEventListener("input", e => {
        rootShapeNode.pivotTranslate[2] = translateZ.value;
        refresh();
    });

    scaleX.addEventListener("input", e => {
        rootShapeNode.pivotScale[0] = scaleX.value;
        refresh();
    });
    scaleY.addEventListener("input", e => {
        rootShapeNode.pivotScale[1] = scaleY.value;
        refresh();
    });
    scaleZ.addEventListener("input", e => {
        rootShapeNode.pivotScale[2] = scaleZ.value;
        refresh();
    });

    // Subtree Control
    rotateXsubtree.addEventListener("input", function() {
        selectedShapeNode.pivotRotate[0] = rotateXsubtree.value;
        refresh();
    });
    rotateYsubtree.addEventListener("input", function() {
        selectedShapeNode.pivotRotate[1] = rotateYsubtree.value;
        refresh();
    });
    rotateZsubtree.addEventListener("input", function() {
        selectedShapeNode.pivotRotate[2] = rotateZsubtree.value;
        refresh();
    });

    translateXsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotTranslate[0] = translateXsubtree.value;
        refresh();
    });
    translateYsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotTranslate[1] = translateYsubtree.value;
        refresh();
    });
    translateZsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotTranslate[2] = translateZsubtree.value;
        refresh();
    });

    scaleXsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotScale[0] = scaleXsubtree.value;
        refresh();
    });
    scaleYsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotScale[1] = scaleYsubtree.value;
        refresh();
    });
    scaleZsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotScale[2] = scaleZsubtree.value;
        refresh();
    });

    // Single Control
    rotateXsingle.addEventListener("input", function() {
        selectedShapeNode.objectRotate[0] = rotateXsingle.value;
        refresh();
    });
    rotateYsingle.addEventListener("input", function() {
        selectedShapeNode.objectRotate[1] = rotateYsingle.value;
        refresh();
    });
    rotateZsingle.addEventListener("input", function() {
        selectedShapeNode.objectRotate[2] = rotateZsingle.value;
        refresh();
    });

    translateXsingle.addEventListener("input", e => {
        selectedShapeNode.objectTranslate[0] = translateXsingle.value;
        refresh();
    });
    translateYsingle.addEventListener("input", e => {
        selectedShapeNode.objectTranslate[1] = translateYsingle.value;
        refresh();
    });
    translateZsingle.addEventListener("input", e => {
        selectedShapeNode.objectTranslate[2] = translateZsingle.value;
        refresh();
    });

    scaleXsingle.addEventListener("input", e => {
        selectedShapeNode.objectScale[0] = scaleXsingle.value;
        refresh();
    });
    scaleYsingle.addEventListener("input", e => {
        selectedShapeNode.objectScale[1] = scaleYsingle.value;
        refresh();
    });
    scaleZsingle.addEventListener("input", e => {
        selectedShapeNode.objectScale[2] = scaleZsingle.value;
        refresh();
    });

    // Animation Control
    animPlayPause.addEventListener("click", () => {
        if (!animationPlaying) {
            animPlayPause.innerHTML = "Pause";
            animationPlaying = true;
            animationInterval = setInterval(() => {
                currentAnimationFrame = ((currentAnimationFrame+1) % totalAnimationFrames)+1
                currentFrameSpan.innerHTML = currentAnimationFrame;
                refresh();
            }, timeBetweenFrames);
        } else {
            animPlayPause.innerHTML = "Play";
            animationPlaying = false;
            clearInterval(animationInterval);
            refresh();
        }
    });

    // Model View
    cameraAngle.addEventListener("input",  () => {
        globalState.cameraRotation = cameraAngle.value;
        refresh();
    });
    
    cameraRadius.addEventListener("input", () => {
        globalState.cameraRadius = cameraRadius.value;
        refresh();
    });

    lightPositionX.addEventListener("input", () => {
        globalState.lightPosition[0] = lightPositionX.value;
        refresh();
    });

    lightPositionY.addEventListener("input", () => {
        globalState.lightPosition[1] = lightPositionY.value;
        refresh();
    });

    lightPositionZ.addEventListener("input", () => {
        globalState.lightPosition[2] = lightPositionZ.value;
        refresh();
    });

    lightCheckbox.addEventListener("change", () => {
        if (lightCheckbox.checked) {
            modelgl.gl.clearColor(0.0, 0.0, 0.0, 0.8);
            globalState.isLight = 1;
        } else {       
            modelgl.gl.clearColor(0.75, 0.85, 0.8, 1.0);
            globalState.isLight = 0;
        }
        refresh();
    });

    const resetViewbtn = document.getElementById("reset-view-btn");
    resetViewbtn.addEventListener("click", function() {
        resetView();
    });

    // Single / Subtree View
    cameraAngleSs.addEventListener("input",  () => {
        ssGlobalState.cameraRotation = cameraAngleSs.value;
        refresh();
    });
    
    cameraRadiusSs.addEventListener("input", () => {
        ssGlobalState.cameraRadius = cameraRadiusSs.value;
        refresh();
    });

    lightPositionXSs.addEventListener("input", () => {
        ssGlobalState.lightPosition[0] = lightPositionXSs.value;
        refresh();
    });

    lightPositionYSs.addEventListener("input", () => {
        ssGlobalState.lightPosition[1] = lightPositionYSs.value;
        refresh();
    });

    lightPositionZSs.addEventListener("input", () => {
        ssGlobalState.lightPosition[2] = lightPositionZSs.value;
        refresh();
    });

    lightCheckboxSs.addEventListener("change", () => {
        if (lightCheckboxSs.checked) {
            ssgl.gl.clearColor(0.0, 0.0, 0.0, 0.8);
            ssGlobalState.isLight = 1;
        } else {       
            ssgl.gl.clearColor(0.75, 0.85, 0.8, 1.0);
            ssGlobalState.isLight = 0;
        }
        refresh();
    });

    resetViewbtnSs.addEventListener("click", function() {
        resetSsView();
    });

    // Export
    const exportbtn = document.getElementById("export-btn");
    exportbtn.addEventListener("click", function() {
        exportShape();
    });

    // Import
    const importbtn = document.getElementById("import-btn");
    importbtn.addEventListener("click", function() {
        importShape();
    });
}

function refresh() {
    if (rootShapeNode != null) {
        modelgl.gl.clear(modelgl.gl.COLOR_BUFFER_BIT | modelgl.gl.DEPTH_BUFFER_BIT);
        rootShapeNode.draw(modelgl, "subtree", currentAnimationFrame-1, animationFramesBetween);
        ssgl.gl.clear(ssgl.gl.COLOR_BUFFER_BIT | ssgl.gl.DEPTH_BUFFER_BIT);
        selectedShapeNode.draw(ssgl, ssGlobalState.viewType, currentAnimationFrame-1, animationFramesBetween);
    }
}

function exportShape() {
    const data = JSON.stringify(rootShapeNode);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "test.json";
    document.body.appendChild(link);
    link.click();

}

function importShape() {
    const file = document.getElementById("file-input").files[0];
    if (file === undefined) {
        alert("no file selected");
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (evt) => {

        const shapeJSONstr = evt.target.result;
        const shapeJSON = JSON.parse(shapeJSONstr);

        rootShapeNode = new ShapeNode(shapeJSON);
        setSelectedShapeNode(rootShapeNode);

        setupAnimationControls();
        setupModelControls();
        setupSubtreeControls();
        setupSingleControls();
        refresh();
        document.getElementById("component-tree").innerHTML = "";
        document.getElementById("component-tree").appendChild(generateComponentTree(rootShapeNode));
    };
}

function generateComponentTree(shapeNode) {
    let liElement = document.createElement("li")

    let button = document.createElement("button");
    button.innerHTML = shapeNode.name;
    button.onclick = function() { setSelectedShapeNode(shapeNode) }

    liElement.appendChild(button);

    if (shapeNode.children.length > 0) {
        let ulElement = document.createElement("ul");
        for (let i = 0; i < shapeNode.children.length; i++) {
            ulElement.appendChild(generateComponentTree(shapeNode.children[i]))
        }
        liElement.appendChild(ulElement);
    }

    return liElement;
}

function setSelectedShapeNode(shapeNode) {
    selectedShapeNode = shapeNode;

    setupSubtreeControls();
    setupSingleControls();

    refresh();
}

function setupAnimationControls() {
    animPlayPause.removeAttribute("disabled");
    currentAnimationFrame = 1;
    totalAnimationFrames = (rootShapeNode.getMaximumNumberOfFrames()-1) * (animationFramesBetween+1);
    currentFrameSpan.innerHTML = currentAnimationFrame;
    totalFramesSpan.innerHTML = totalAnimationFrames;
}

function setupModelControls() {
    const allInput = document.querySelectorAll("#model-control > input");

    Array.from(allInput, input => input.removeAttribute("disabled"));

    selectedTextureType.removeAttribute("disabled");

    disableTextureTypeRoot();
    disableBumpTypeRoot();

    selectedTextureType.value = rootShapeNode.texture;
    rotateX.value = rootShapeNode.pivotRotate[0];
    rotateY.value = rootShapeNode.pivotRotate[1];
    rotateZ.value = rootShapeNode.pivotRotate[2];
    translateX.value = rootShapeNode.pivotTranslate[0];
    translateY.value = rootShapeNode.pivotTranslate[1];
    translateZ.value = rootShapeNode.pivotTranslate[2];
    scaleX.value = rootShapeNode.pivotScale[0];
    scaleY.value = rootShapeNode.pivotScale[1];
    scaleZ.value = rootShapeNode.pivotScale[2];
}

function setupSubtreeControls() {
    const allInput = document.querySelectorAll("#subtree-control > input");

    Array.from(allInput, input => input.removeAttribute("disabled"));

    selectedTextureTypeSs.removeAttribute("disabled");

    disableTextureTypeSs();
    disableBumpTypeSs();

    selectedTextureTypeSs.value = selectedShapeNode.texture;
    rotateXsubtree.value = selectedShapeNode.pivotRotate[0];
    rotateYsubtree.value = selectedShapeNode.pivotRotate[1];
    rotateZsubtree.value = selectedShapeNode.pivotRotate[2];
    translateXsubtree.value = selectedShapeNode.pivotTranslate[0];
    translateYsubtree.value = selectedShapeNode.pivotTranslate[1];
    translateZsubtree.value = selectedShapeNode.pivotTranslate[2];
    scaleXsubtree.value = selectedShapeNode.pivotScale[0];
    scaleYsubtree.value = selectedShapeNode.pivotScale[1];
    scaleZsubtree.value = selectedShapeNode.pivotScale[2];
}

function setupSingleControls() {
    const allInput = document.querySelectorAll("#single-control > input");

    Array.from(allInput, input => input.removeAttribute("disabled"));

    selectedTextureTypeSingle.removeAttribute("disabled");

    disableTextureTypeSingle();
    disableBumpTypeSingle();

    selectedTextureTypeSingle.value = selectedShapeNode.texture;
    rotateXsingle.value = selectedShapeNode.objectRotate[0];
    rotateYsingle.value = selectedShapeNode.objectRotate[1];
    rotateZsingle.value = selectedShapeNode.objectRotate[2];
    translateXsingle.value = selectedShapeNode.objectTranslate[0];
    translateYsingle.value = selectedShapeNode.objectTranslate[1];
    translateZsingle.value = selectedShapeNode.objectTranslate[2];
    scaleXsingle.value = selectedShapeNode.objectScale[0];
    scaleYsingle.value = selectedShapeNode.objectScale[1];
    scaleZsingle.value = selectedShapeNode.objectScale[2];
}

function setProjectionType() {
    globalState.projectionType = selectedProjection.value;
    refresh();
}

function setProjectionTypeSs() {
    ssGlobalState.projectionType = selectedProjectionSs.value;
    refresh();
}

function setViewTypeSs() {
    ssGlobalState.viewType = selectedViewSs.value;
    refresh();
}

function setTextureType() {
    rootShapeNode.updateAllChildrenTexture(selectedTextureType.value);
    selectedTextureTypeSs.value = selectedTextureType.value;
    selectedTextureTypeSingle.value = selectedTextureType.value;
    disableTextureTypeRoot();
    disableTextureTypeSs();
    disableTextureTypeSingle();
    disableBumpTypeRoot();
    disableBumpTypeSs();
    disableBumpTypeSingle();

    if(selectedTextureType.value == "custom") {
        selectedTextureTypeCustom.removeAttribute("disabled");
        selectedTextureTypeBump.setAttribute("disabled", "true");
        setTextureTypeCustom();
    } else if (selectedTextureType.value == "bump") {
        selectedTextureTypeBump.removeAttribute("disabled");
        selectedTextureTypeCustom.setAttribute("disabled", "true");
        setTextureTypeBump();
    }
    refresh();
}

function setTextureTypeSs() {
    selectedShapeNode.updateAllChildrenTexture(selectedTextureTypeSs.value);
    selectedTextureTypeSingle.value = selectedTextureTypeSs.value;
    disableTextureTypeSs();
    disableTextureTypeSingle();

    if(selectedTextureTypeSs.value == "custom") {
        selectedTextureTypeSsCustom.removeAttribute("disabled");
        selectedTextureTypeSsBump.setAttribute("disabled", "true");
        setTextureTypeSsCustom();
    } else if (selectedTextureTypeSs.value == "bump") {
        selectedTextureTypeSsBump.removeAttribute("disabled");
        selectedTextureTypeSsCustom.setAttribute("disabled", "true");
        setTextureTypeSsBump();
    }

    refresh();
}

function setTextureTypeSingle() {
    selectedShapeNode.texture = selectedTextureTypeSingle.value;
    disableTextureTypeSingle();

    if(selectedTextureTypeSingle.value == "custom") {
        selectedTextureTypeSingleCustom.removeAttribute("disabled");
        selectedTextureTypeSingleBump.setAttribute("disabled", "true");
        setTextureTypeSingleCustom();
    } else if (selectedTextureTypeSingle.value == "bump") {
        selectedTextureTypeSingleBump.removeAttribute("disabled");
        selectedTextureTypeSingleCustom.setAttribute("disabled", "true");
        setTextureTypeSingleBump();
    }
    
    refresh();
}

function setTextureTypeCustom() {
    rootShapeNode.updateAllChildrenTextureCustom(parseInt(selectedTextureTypeCustom.value));
    console.log(parseInt(selectedTextureTypeCustom.value));
    refresh();
}

function setTextureTypeSsCustom() {
    selectedShapeNode.updateAllChildrenTextureCustom(parseInt(selectedTextureTypeSsCustom.value));
    console.log(parseInt(selectedTextureTypeCustom.value));

    refresh();
}

function setTextureTypeSingleCustom() {
    selectedShapeNode.textureIndex= parseInt(selectedTextureTypeSingleCustom.value);
    console.log(selectedTextureTypeSingleCustom.value);

    refresh();
}

// Set displacement map
function setTextureTypeBump() {
    // rootShapeNode.updateAllChildrenTextureBump(parseInt(selectedTextureTypeBump.value));
    // console.log(parseInt(selectedTextureTypeBump.value));

    rootShapeNode.updateAllChildrenTextureCustom(parseInt(selectedTextureTypeBump.value));
    console.log(parseInt(selectedTextureTypeBump.value));

    refresh();
}

function setTextureTypeSsBump() {
    // selectedShapeNode.updateAllChildrenTextureBump(parseInt(selectedTextureTypeSsBump.value));
    // console.log(parseInt(selectedTextureTypeSsBump.value));

    selectedShapeNode.updateAllChildrenTextureCustom(parseInt(selectedTextureTypeSsBump.value));
    console.log(parseInt(selectedTextureTypeSsBump.value));

    refresh();
}

function setTextureTypeSingleBump() {
    // selectedShapeNode.bumpIndex= parseInt(selectedTextureTypeSingleBump.value);
    // console.log(selectedTextureTypeSingleBump.value);

    selectedShapeNode.textureIndex= parseInt(selectedTextureTypeSingleBump.value);
    console.log(selectedTextureTypeSingleBump.value);

    refresh();
}

function disableTextureTypeRoot() {
    if (rootShapeNode.texture === "custom") {
        const selectedTextureTypeCustom = document.querySelector("#selectedTextureTypeCustom");
        Array.from(selectedTextureTypeCustom.children, child => child.removeAttribute("disabled"));
    } else {
        const selectedTextureTypeCustom = document.querySelector("#selectedTextureTypeCustom");
        Array.from(selectedTextureTypeCustom.children, child => child.setAttribute("disabled", true));
    }
}

function disableTextureTypeSs() {
    if (selectedShapeNode.texture === "custom") {
        const selectedTextureTypeSsCustom = document.querySelector("#selectedTextureTypeSsCustom");
        Array.from(selectedTextureTypeSsCustom.children, child => child.removeAttribute("disabled"));
    } else {
        const selectedTextureTypeSsCustom = document.querySelector("#selectedTextureTypeSsCustom");
        Array.from(selectedTextureTypeSsCustom.children, child => child.setAttribute("disabled", true));
    }
}

function disableTextureTypeSingle() {
    if (selectedShapeNode.texture === "custom") {
        const selectedTextureTypeSingleCustom = document.querySelector("#selectedTextureTypeSingleCustom");
        Array.from(selectedTextureTypeSingleCustom.children, child => child.removeAttribute("disabled"));
    } else {
        const selectedTextureTypeSingleCustom = document.querySelector("#selectedTextureTypeSingleCustom");
        Array.from(selectedTextureTypeSingleCustom.children, child => child.setAttribute("disabled", true));
    }
}

// Disable texture type for bump map
function disableBumpTypeRoot() {
    const selectedTextureTypeBump = document.querySelector("#selectedTextureTypeBump");
    if (rootShapeNode.texture === "bump") {
        Array.from(selectedTextureTypeBump.children, child => child.removeAttribute("disabled"));
    } else {
        Array.from(selectedTextureTypeBump.children, child => child.setAttribute("disabled", true));
    }
}

function disableBumpTypeSs() {
    const selectedTextureTypeSsBump = document.querySelector("#selectedTextureTypeSsBump");
    if (selectedShapeNode.texture === "bump") {
        Array.from(selectedTextureTypeSsBump.children, child => child.removeAttribute("disabled"));
    } else {
        Array.from(selectedTextureTypeSsBump.children, child => child.setAttribute("disabled", true));
    }
}

function disableBumpTypeSingle() {
    const selectedTextureTypeSingleBump = document.querySelector("#selectedTextureTypeSingleBump");
    if (selectedShapeNode.texture === "bump") {
        Array.from(selectedTextureTypeSingleBump.children, child => child.removeAttribute("disabled"));
    } else {
        Array.from(selectedTextureTypeSingleBump.children, child => child.setAttribute("disabled", true));
    }
}

function setGlobalControls() {
    selectedProjection.value = globalState.projectionType;
    cameraAngle.value = globalState.cameraRotation;
    cameraRadius.value = globalState.cameraRadius;
    lightPositionX.value = globalState.lightPosition[0];
    lightPositionY.value = globalState.lightPosition[1];
    lightPositionZ.value = globalState.lightPosition[2];
    if (globalState.isLight == 0) {
        lightCheckbox.checked = false;
        modelgl.gl.clearColor(0.75, 0.85, 0.8, 1.0);
    }
    else {
        lightCheckbox.checked = true;
        modelgl.gl.clearColor(0.0, 0.0, 0.0, 0.8);
    }
}

function setSsGlobalControls() {
    selectedProjectionSs.value = ssGlobalState.projectionType;
    cameraAngleSs.value = ssGlobalState.cameraRotation;
    cameraRadiusSs.value = ssGlobalState.cameraRadius;
    lightPositionXSs.value = ssGlobalState.lightPosition[0];
    lightPositionYSs.value = ssGlobalState.lightPosition[1];
    lightPositionZSs.value = ssGlobalState.lightPosition[2];
    if (ssGlobalState.isLight == 0) {
        lightCheckboxSs.checked = false;
        ssgl.gl.clearColor(0.75, 0.85, 0.8, 1.0);
    }
    else {
        lightCheckboxSs.checked = true;
        ssgl.gl.clearColor(0.0, 0.0, 0.0, 0.8);
    }
}

function resetView() {
    globalState = defaultGlobalState();
    setGlobalControls();
    refresh();
}

function resetSsView() {
    ssGlobalState = defaultGlobalState();
    setSsGlobalControls();
    refresh();
}

function clearCanvas() {
    shapes.splice(0, shapes.length);
    transformedShapes.splice(0, transformedShapes.length);
    transformationStates.splice(0, transformationStates.length);
    currentShapeIndex = 0;
    setupModelControls();
    refresh();
}