import React from 'react'
import {Button, withStyles} from "@material-ui/core";
import classnames from 'classnames'

const styles = theme => ({
    root: {
        borderWidth: '2px !important',
        margin: 16,
        minHeight: 80,
        minWidth: 300,
        '&:hover': {
            '& span': {
                color: `${theme.palette.primary.main} !important`,
            }
        },
    },
    label: {
        color: theme.palette.primary.light,
        fontSize: 16,
        textTransform: 'none',
        transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    },
    activeRoot: {
        backgroundColor: 'rgba(63, 81, 181, 0.04) !important',
        borderColor: `${theme.palette.primary.main} !important`,
    },
    activeLabel: {
        color: theme.palette.primary.main,
    },
})

const ProgramButton = ({
    active,
    children,
    classes,
    ...props
}) => (
    <Button
        classes={{
            root: classnames(classes.root, { [classes.activeRoot]: active }),
            label: classnames(classes.label, { [classes.activeLabel]: active }),
        }}
        color="primary"
        variant="outlined"
        {...props}
    >
        {children}
    </Button>
)

export default withStyles(styles, { withTheme: true })(ProgramButton)
