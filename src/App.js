/* eslint import/no-webpack-loader-syntax: off */

import React from 'react'
import {withStyles} from "@material-ui/core"
import { FaGithub as Github } from 'react-icons/fa'
import { AppBar, Button, IconButton, Tooltip } from '@material-ui/core'
import triColorBlendTriangle from './programs/tri-color-blend-triangle'
import twoTriangles from './programs/two-triangles'
import ProgramButton from "./ProgramButton";


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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 48,
        '& > div:first-child': {
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
        },
        '& > div:last-child': {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 700,
        }
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
    },
})

class App extends React.Component {
    /** @type {React.RefObject} */
    canvas = React.createRef()
    /** @type WebGLRenderingContext */
    gl = undefined

    state = {
        active: undefined
    }

    componentDidMount() {
        const canvas = this.canvas
        this.gl = canvas.current.getContext('webgl')
        this.startProgram('tri-color-blend-triangle', triColorBlendTriangle)()
    }

    startProgram = (key, func) => () => {
        if (key === this.state.active) return;
        this.setState({ active: key })
        func(this.gl)
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
                        <Tooltip title="Link to source code">
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
                    <div>
                        <ProgramButton
                            active={this.state.active === 'tri-color-blend-triangle'}
                            onClick={this.startProgram('tri-color-blend-triangle', triColorBlendTriangle)}
                        >
                            Tri-Color Blend Triangle
                        </ProgramButton>
                        <ProgramButton
                            active={this.state.active === 'two-triangles'}
                            onClick={this.startProgram('two-triangles', twoTriangles)}
                        >
                            Two Triangles
                        </ProgramButton>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default withStyles(styles, { withTheme: true })(App)
