/* eslint import/no-webpack-loader-syntax: off */
import fragSrc from "!raw-loader!./shader.frag"
import vertSrc from "!raw-loader!./shader.vert"

const randomInt = () => 2 * Math.random() - 1


export default {
    /**
     * @param {WebGLRenderingContext} gl
     */
    start: gl => {
        const program = gl.createProgram()
        const vertShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertShader, vertSrc)
        gl.compileShader(vertShader)
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vertShader))
        }
        gl.attachShader(program, vertShader)
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragShader, fragSrc)
        gl.compileShader(fragShader)
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fragShader))
        }
        gl.attachShader(program, fragShader)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program))
        }
        gl.validateProgram(program)
        gl.useProgram(program)
        gl.clearColor(0, 0, 0, 1)
        const colorLoc = gl.getUniformLocation(program, 'color')
        gl.clear(gl.COLOR_BUFFER_BIT)
        for (let i = 0; i < 50; i++) {
            const width = randomInt()
            const height = randomInt()
            const x1 = randomInt()
            const x2 = x1 + width
            const y1 = randomInt()
            const y2 = y1 + height
            const posBuff = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuff)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2
            ]), gl.STATIC_DRAW)
            const posBuffLoc = gl.getAttribLocation(program, 'position')
            gl.vertexAttribPointer(
                posBuffLoc,
                2,
                gl.FLOAT,
                false,
                2 * Float32Array.BYTES_PER_ELEMENT,
                0
            )
            gl.enableVertexAttribArray(posBuffLoc)
            gl.uniform4f(colorLoc, Math.random(), Math.random(), Math.random(), 1)
            gl.drawArrays(gl.TRIANGLES, 0, 6)
        }
    },
    end: () => {}
}
