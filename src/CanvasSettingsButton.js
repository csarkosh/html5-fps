import React from 'react'
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    buttonLabel: {
        textTransform: 'none',
    },
    buttonRoot: {
        padding: '0 4px',
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginTop: -12,
    }
})

const CanvasSettingsButton = ({
    classes,
    icon,
    label,
    theme,
    ...props
}) => (
    <Button
        classes={{
            label: classes.buttonLabel,
        }}
        {...props}
    >
        <div className={classes.contentWrapper}>
            <div>{icon}</div>
            <div className={classes.label}>{label}</div>
        </div>
    </Button>
)

export default withStyles(styles, { withTheme: true })(CanvasSettingsButton)
