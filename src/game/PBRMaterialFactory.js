import basecolorTxr2 from "../textures/Metal_Plate_041_basecolor2.jpg";
import normalDisplacementTxr2 from "../textures/Metal_Plate_041_NRM_DSP.png";
import metallicRoughnessAoTxr2 from "../textures/Metal_Plate_041_OCC_ROUGH_METAL.jpg";
import basecolorTxr from "../textures/Metal_Plate_015_basecolor.jpg";
import normalDisplacementTxr from "../textures/Metal_Plate_015_NRM_DSP.png";
import metallicRoughnessAoTxr from "../textures/Metal_Plate_015_OCC_ROUGH_METAL.jpg";
import {PBRMaterial, Texture} from "@babylonjs/core";


export default class PBRMaterialFactory {
    /** @type {Scene1.js} */
    #scene = null

    /** @type {Object.<string, PBRMaterial>} */
    #materialCache = {}

    /** @type {Object.<string, Texture>} */
    #textureCache = {}

    /**
     * @param {Scene1.js} scene
     */
    constructor(scene) {
        this.#scene = scene
    }

    /**
     * @param {string} type
     * @param {Object<string, *>} opts
     * @return {PBRMaterial}
     */
    create = (type, opts = {}) => {
        const {
            isDynamic,
            pScale = 0.1,
            uScale = 1,
            vScale = 1
        } = opts
        if (!this.#materialCache[type]) {
            const mat = new PBRMaterial(type, this.#scene)
            this.#setTextures(type, mat)
            mat.albedoTexture.uScale = uScale
            mat.albedoTexture.vScale = vScale
            mat.bumpTexture.uScale = uScale
            mat.bumpTexture.vScale = vScale
            mat.metallicTexture.uScale = uScale
            mat.metallicTexture.vScale = vScale
            mat.useParallax = true
            mat.parallaxScaleBias = pScale
            isDynamic || mat.freeze()
            this.#materialCache[type] = mat
        }
        return this.#materialCache[type]
    }

    /**
     * Sets the PBR textures of a material (mutative)
     * @param {string} type
     * @param {PBRMaterial} material
     */
    #setTextures = (type, material) => {
        let albedoSrc = null, bumpSrc = null, metallicSrc = null
        switch (type) {
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
        if (!this.#textureCache[type]) {
            this.#textureCache[type] = {
                albedoTexture: new Texture(albedoSrc, this.#scene),
                bumpTexture: new Texture(bumpSrc, this.#scene),
                metallicTexture: new Texture(metallicSrc, this.#scene),
            }
        }
        const { albedoTexture, bumpTexture, metallicTexture }
            = this.#textureCache[type]
        material.albedoTexture = albedoTexture
        material.bumpTexture = bumpTexture
        material.metallicTexture = metallicTexture
        material.useRoughnessFromMetallicTextureAlpha = false
        material.useMetallnessFromMetallicTextureBlue = true
        material.useRoughnessFromMetallicTextureGreen = true
        material.useAmbientOcclusionFromMetallicTextureRed = true
    }
}
