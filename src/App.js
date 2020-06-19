/* eslint import/no-webpack-loader-syntax: off */

import React from 'react';
import {withStyles} from "@material-ui/core";
import { FaGithub as Github } from 'react-icons/fa'
import vertShader from '!raw-loader!./shader.vert'
import fragShader from '!raw-loader!./shader.frag'
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";


const styles = theme => ({
    appBarRoot: {
        padding: '6px 8px',
        '& > div': {
            display: 'flex',
            justifyContent: 'space-between',
        },
    },
    titleButtonRoot: {
        padding: '0 6px',
    },
    titleButtonLabel: {
        color: 'white',
        fontSize: 21,
        fontWeight: 600,
        textTransform: 'none',
    },
    body: {
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 48,
    },
    canvas: {
        maxWidth: 640,
        maxHeight: 480,
        width: '100%'
    },
    ghButtonRoot: {
        color: 'white',
        padding: 0,
        '& svg': {
            fontSize: 28,
            marginRight: 8,
        }
    }
})

class App extends React.Component {
    /** @type {React.RefObject} */
    canvas = React.createRef()
    /** @type WebGLRenderingContext */
    gl = undefined

    /**
     *
     * @param {WebGLProgram} program
     * @param {string} vertSrc
     * @param {string} fragSrc
     */
    addShaders = (program, vertSrc, fragSrc) => {
        const gl = this.gl
        if (!gl) {
            return
        }
        const vertShader = gl.createShader(gl.VERTEX_SHADER)
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(vertShader, vertSrc)
        gl.shaderSource(fragShader, fragSrc)
        gl.compileShader(vertShader)
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vertShader))
        }
        gl.compileShader(fragShader)
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fragShader))
        }
        gl.attachShader(program, vertShader)
        gl.attachShader(program, fragShader)
    }

    addRainbowTriangle = (program) => {
        const gl = this.gl
        const triangleVertices = new Float32Array([
             // xy         rgb
             0.0,  0.5,    1.0, 1.0, 0.0,
            -0.5, -0.5,    0.7, 0.0, 1.0,
             0.5, -0.5,    0.1, 1.0, 0.6
        ]);
        const triangleVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
        const positionAttribLocation = gl.getAttribLocation(program, 'position');
        const colorAttribLocation = gl.getAttribLocation(program, 'color');
        gl.vertexAttribPointer(
            positionAttribLocation,
            2,
            gl.FLOAT,
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.vertexAttribPointer(
            colorAttribLocation,
            3,
            gl.FLOAT,
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT,
            2 * Float32Array.BYTES_PER_ELEMENT
        );

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
    }


    componentDidMount() {
        const canvas = this.canvas
        this.gl = canvas.current.getContext('webgl')
        const gl = this.gl

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



        const program = gl.createProgram()
        this.addShaders(program, vertShader, fragShader)



        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(program));
            return;
        }
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', gl.getProgramInfoLog(program));
            return;
        }

        this.addRainbowTriangle(program)

        gl.useProgram(program);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
                <AppBar
                    classes={{ root: classes.appBarRoot }}
                    color="primary"
                    position="fixed"
                >
                    <div>
                        <Button
                            classes={{
                                root: classes.titleButtonRoot,
                                label: classes.titleButtonLabel,
                            }}
                            component="a"
                            href="/"
                        >
                            webgl.csarko.sh
                        </Button>
                        <Tooltip
                            title="Link to source code"
                        >
                            <IconButton
                                aria-label="Link to source code"
                                classes={{ root: classes.ghButtonRoot }}
                                component="a"
                                href="https://github.com/csarkosh/webgl-react"
                                target="_blank"
                            >
                                <Github />
                            </IconButton>
                        </Tooltip>
                    </div>
                </AppBar>
                <div className={classes.body}>
                    <div>
                        <canvas
                            height={480}
                            width={640}
                            className={classes.canvas}
                            ref={this.canvas}
                            id="glcanvas"
                        >
                        </canvas>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default withStyles(styles, { withTheme: true })(App)
