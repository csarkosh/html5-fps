import {PBRMaterial, Texture} from "@babylonjs/core";
import basecolorTxr from "../textures/Metal_Plate_015_basecolor.jpg";
import normalDisplacementTxr from "../textures/Metal_Plate_015_NRM_DSP.png";
import metallicRoughnessAoTxr from "../textures/Metal_Plate_015_OCC_ROUGH_METAL.jpg";
import basecolorTxr2 from "../textures/Metal_Plate_041_basecolor2.jpg";
import normalDisplacementTxr2 from "../textures/Metal_Plate_041_NRM_DSP.png";
import metallicRoughnessAoTxr2 from "../textures/Metal_Plate_041_OCC_ROUGH_METAL.jpg";


/** @type {Object.<string, Texture>} */
const textureMap = {}


/**
 *
 * @param {string} src
 * @param {Scene} scene
 * @return {Texture}
 */
const getTexture = (src, scene) => {
    if (textureMap[src]) {
        return textureMap[src]
    }
    textureMap[src] = new Texture(src, scene)
    return textureMap[src]
}


/**
 * Creates and returns a PBR material.
 *
 * If an instance of the material already exists,
 * then that material is returned instead.
 *
 * @param {string} texture
 * @param {string} name
 * @param {Scene} scene
 * @param {Object.<string, *>} opts
 * @return {PBRMaterial}
 */
export default (texture, name, scene, {
    uScale = 1,
    vScale = 1,
    parallaxScaleBias = 0.1
}) => {
    let albedoSrc = null, bumpSrc = null, metallicSrc = null
    switch (texture) {
        case 'Metal_Plate_41':
            albedoSrc = basecolorTxr2
            bumpSrc = normalDisplacementTxr2
            metallicSrc = metallicRoughnessAoTxr2
            break;
        case 'Metal_Plate_15':
        default:
            albedoSrc = basecolorTxr
            bumpSrc = normalDisplacementTxr
            metallicSrc = metallicRoughnessAoTxr
            break;
    }
    const pbrm = new PBRMaterial(name, scene)
    pbrm.albedoTexture = getTexture(albedoSrc, scene)
    pbrm.bumpTexture = getTexture(bumpSrc, scene)
    pbrm.metallicTexture = getTexture(metallicSrc, scene)
    pbrm.useRoughnessFromMetallicTextureAlpha = false
    pbrm.useMetallnessFromMetallicTextureBlue = true
    pbrm.useRoughnessFromMetallicTextureGreen = true
    pbrm.useAmbientOcclusionFromMetallicTextureRed = true
    pbrm.albedoTexture.uScale = uScale
    pbrm.albedoTexture.vScale = vScale
    pbrm.bumpTexture.uScale = uScale
    pbrm.bumpTexture.vScale = vScale
    pbrm.metallicTexture.uScale = uScale
    pbrm.metallicTexture.vScale = vScale
    pbrm.useRoughnessFromMetallicTextureAlpha = false
    pbrm.useMetallnessFromMetallicTextureBlue = true
    pbrm.useRoughnessFromMetallicTextureGreen = true
    pbrm.useAmbientOcclusionFromMetallicTextureRed = true
    pbrm.useParallax = true
    pbrm.parallaxScaleBias = parallaxScaleBias
    return pbrm
}