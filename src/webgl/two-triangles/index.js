/* eslint import/no-webpack-loader-syntax: off */
import fragSrc from "!raw-loader!./shader.frag"
import vertSrc from "!raw-loader!./shader.vert"

let frameId = undefined

export default {
    /**
     * Creates a WebGL program that renders 2 triangles.
     * @param {WebGLRenderingContext} gl
     */
    start: gl => {
        const program = gl.createProgram()
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragShader, fragSrc)
        gl.compileShader(fragShader)
        gl.attachShader(program, fragShader)
        const vertShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertShader, vertSrc)
        gl.compileShader(vertShader)
        gl.attachShader(program, vertShader)
        gl.linkProgram(program)
        gl.validateProgram(program)
        gl.useProgram(program)
        gl.clearColor(0.6,0.3,0.6,1)
        const fillLoc = gl.getUniformLocation(program, 'uniforms.fill')
        gl.uniform4fv(fillLoc, new Float32Array([0.3, 0.7, 0.3, 1.0]))
        const timeLoc = gl.getUniformLocation(program, 'uniforms.time')

        const animFrame = (ts) => {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.uniform1f(timeLoc, ts / 1000.0)

            createTriangle(gl, program, new Float32Array([
                -0.9, -0.9,
                0.85, -0.9,
                -0.9, 0.85
            ]))
            gl.drawArrays(gl.TRIANGLES, 0, 3)

            createTriangle(gl, program, new Float32Array([
                0.9, -0.85,
                0.9, 0.9,
                -0.85, 0.9
            ]))
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            frameId = window.requestAnimationFrame(animFrame)
        };
        frameId = window.requestAnimationFrame(animFrame)
    },
    end: () => {
        window.cancelAnimationFrame(frameId)
    }
}

const createTriangle = (gl, program, vertices) => {
    const tri1VertBuff = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, tri1VertBuff)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)
    const tri1PosAttr = gl.getAttribLocation(program, 'position')
    gl.vertexAttribPointer(
        tri1PosAttr,
        2,
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    )
    gl.enableVertexAttribArray(tri1PosAttr)
}