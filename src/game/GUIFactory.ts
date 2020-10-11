import {AdvancedDynamicTexture, Control, Ellipse, Rectangle} from "@babylonjs/gui";

interface IVirtualJoystickControls { container: Control, inner: Control }

export default class GUIFactory {
    public static createVirtualJoystick = (ui: AdvancedDynamicTexture): IVirtualJoystickControls => {
        const DIAMETER = 120
        const container = new Ellipse()
        container.name = 'move-stick'
        container.thickness = 4
        container.background = 'grey'
        container.color = 'black'
        container.paddingLeft = '0px'
        container.paddingRight = '0px'
        container.paddingTop = '0px'
        container.paddingBottom = '0px'
        container.height = `${DIAMETER}px`
        container.width = `${DIAMETER}px`
        container.isPointerBlocker = true
        container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
        container.left = 30
        container.top = -30
        ui.addControl(container)
        const inner = new Ellipse()
        inner.name = 'move-stick'
        inner.thickness = 6
        inner.background = 'black'
        inner.color = 'black'
        inner.paddingLeft = '0px'
        inner.paddingRight = '0px'
        inner.paddingTop = '0px'
        inner.paddingBottom = '0px'
        inner.height = '50px'
        inner.width = '50px'
        inner.isPointerBlocker = true
        inner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
        inner.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        container.addControl(inner)
        return { container, inner }
    }

    public static createCrosshair = (ui: AdvancedDynamicTexture): Control[] => {
        return [
            {height: '4px', width: '25px'},
            {height: '25px', width: '4px'}
        ].map(({height, width}) => {
            const rect = new Rectangle()
            rect.background = 'white'
            rect.color = 'white'
            rect.alpha = 0.5
            rect.thickness = 0
            rect.height = height
            rect.width = width
            rect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
            rect.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
            ui.addControl(rect)
            return rect
        })
    }
}
