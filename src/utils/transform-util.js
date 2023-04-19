const mTransform = {
    translate: (shiftX, shiftY, shiftZ) => {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            shiftX, shiftY, shiftZ, 1,
        ];
    },

    rotateX: (angle) => {
        const cosVal = Math.cos(angle);
        const sinVal = Math.sin(angle);
        return [
            1, 0, 0, 0,
            0, cosVal, sinVal, 0,
            0, -sinVal, cosVal, 0,
            0, 0, 0, 1,
        ];
    },

    rotateY: (angle) => {
        const cosVal = Math.cos(angle);
        const sinVal = Math.sin(angle);
        return [
            cosVal, 0, -sinVal, 0,
            0, 1, 0, 0,
            sinVal, 0, cosVal, 0,
            0, 0, 0, 1,
        ];
    },

    rotateZ: (angle) => {
        const cosVal = Math.cos(angle);
        const sinVal = Math.sin(angle);
        return [
            cosVal, sinVal, 0, 0,
           -sinVal, cosVal, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

    rotate: (angleX, angleY, angleZ) => {
        const cosValX = Math.cos(angleX);
        const sinValX = Math.sin(angleX);
        const cosValY = Math.cos(angleY);
        const sinValY = Math.sin(angleY);
        const cosValZ = Math.cos(angleZ);
        const sinValZ = Math.sin(angleZ);

        const rotateX = [
            1, 0, 0, 0,
            0, cosValX, sinValX, 0,
            0, -sinValX, cosValX, 0,
            0, 0, 0, 1,
        ];

        const rotateY = [
            cosValY, 0, -sinValY, 0,
            0, 1, 0, 0,
            sinValY, 0, cosValY, 0,
            0, 0, 0, 1,
        ]

        const rotateZ = [
            cosValZ, sinValZ, 0, 0,
           -sinValZ, cosValZ, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];

        return mat4mult(mat4mult(rotateX, rotateY), rotateZ);
    },

    scale: (sx, sy, sz) => {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ];
    },
}

const mUtil = {
    identity: () => {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    },

    detMat2: (mat) => {
        try {
            const flattenMat = flatten(mat);
            if(flattenMat.length != 4) {
                throw "Input matrix invalid"
            }

            return (flattenMat[0] * flattenMat[3]) - (flattenMat[1] * flattenMat[2]);
        } catch(err) {
            console.error(err);
        }
    },
    
    detMat3: (mat) => {
        try {
            flattenMat = flatten(mat);
            if(flattenMat.length != 9) {
                throw "Input matrix invalid"
            }
            const [e1, e2, e3, e4, e5, e6, e7, e8, e9]= flattenMat;
            
            return (
                (e1 * mUtil.detMat2([e5, e6, e8, e9])) -
                (e2 * mUtil.detMat2([e4, e6, e7, e9])) +
                (e3 * mUtil.detMat2([e4, e5, e7, e8]))
            )
        } catch(err) {
            console.error(err);
        }
    },

    detMat4: (mat) => {
        try {
            flattenMat = flatten(mat);
            if(flattenMat.length != 16) {
                throw "Input matrix invalid"
            }
            const [ e1, e2, e3, e4,
                    e5, e6, e7, e8,
                    e9, e10, e11, e12,
                    e13, e14, e15, e16 ]= flattenMat;
            
            return (
                (e1 * mUtil.detMat3([
                    e6, e7, e8, 
                    e10, e11,e12,
                    e14, e15, e16
                ])) -
                (e2 * mUtil.detMat3([
                    e5, e7, e8,
                    e9, e11, e12,
                    e13, e15, e16
                ])) +
                (e3 * mUtil.detMat3([
                    e5, e6, e8,
                    e9, e10, e12,
                    e13, e14, e16
                ])) -
                (e4 * mUtil.detMat3([
                    e5, e6, e7,
                    e9, e10, e11,
                    e13, e14, e15
                ]))
            )
        } catch(err) {
            console.error(err);
        }
    },

    cofactorMat4: (mat) => {
        try {
            flattenMat = flatten(mat);
            if(flattenMat.length != 16) {
                throw "Input matrix invalid"
            }
            const [ e1, e2, e3, e4,
                    e5, e6, e7, e8,
                    e9, e10, e11, e12,
                    e13, e14, e15, e16 ]= flattenMat;
            
            return (
                [   [mUtil.detMat3([e6, e7, e8, e10, e11, e12, e14, e15, e16]), 
                    -mUtil.detMat3([e5, e7, e8, e9, e11, e12, e13, e15, e16]),
                    mUtil.detMat3([e5, e6, e8, e9, e10, e12, e13, e14, e16]),
                    -mUtil.detMat3([e5, e6, e7, e9, e10, e11, e13, e14, e15])],

                    [-mUtil.detMat3([e2, e3, e4, e10, e11, e12, e14, e15, e16]),
                    mUtil.detMat3([e1, e3, e4, e9, e11, e12, e13, e15, e16]),
                    -mUtil.detMat3([e1, e2, e4, e9, e10, e12, e13, e14, e16]),
                    mUtil.detMat3([e1, e2, e3, e9, e10, e11, e13, e14, e15])],

                    [mUtil.detMat3([e2, e3, e4, e6, e7, e8, e14, e15, e16]),
                    -mUtil.detMat3([e1, e3, e4, e5, e7, e8, e13, e15, e16]),
                    mUtil.detMat3([e1, e2, e4, e5, e6, e8, e13, e14, e16]),
                    -mUtil.detMat3([e1, e2, e3, e5, e6, e7, e13, e14, e15])],

                    [-mUtil.detMat3([e2, e3, e4, e6, e7, e8, e10, e11, e12]),
                    mUtil.detMat3([e1, e3, e4, e5, e7, e8, e9, e11, e12]),
                    -mUtil.detMat3([e1, e2, e4, e5, e6, e8, e9, e10, e12]),
                    mUtil.detMat3([e1, e2, e3, e5, e6, e7, e9, e10, e11])],
            ]
            )
        } catch(err) {
            console.error(err);
        }
    },

    transpose: (mat) => {
        return mat[0].map((col, i) => mat.map(row => row[i]));
    },

    inverseMat4: (mat) => {
        const det = mUtil.detMat4(mat);
        const factor = 1 / det;
        const adjoin = mUtil.transpose(mUtil.cofactorMat4(mat));
        let res = []

        for(let i = 0; i < adjoin.length; i++) {
            let newRow = [];
            for(let j = 0; j < adjoin[i].length; j++) {
                const elmt = factor * adjoin[i][j];
                newRow.push(elmt);
            }
            res.push(newRow);
        }
        return res;
    }
}