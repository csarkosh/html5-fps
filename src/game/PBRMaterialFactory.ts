import {PBRMaterial, Scene, Texture} from "@babylonjs/core";
const basecolorTxr2 = require("../textures/Metal_Plate_041_basecolor2.jpg");
const normalDisplacementTxr2 = require("../textures/Metal_Plate_041_NRM_DSP.png");
const metallicRoughnessAoTxr2 = require("../textures/Metal_Plate_041_OCC_ROUGH_METAL.jpg");
const basecolorTxr = require("../textures/Metal_Plate_015_basecolor.jpg");
const normalDisplacementTxr = require("../textures/Metal_Plate_015_NRM_DSP.png");
const metallicRoughnessAoTxr = require("../textures/Metal_Plate_015_OCC_ROUGH_METAL.jpg");


interface IMaterialMap { [key: string]: PBRMaterial }

interface ITextureMap { [key: string]: { [key: string]: Texture } }

interface IPBRMaterialFactoryOptions {
    isDynamic?: boolean,
    pScale?: number,
    uScale?: number,
    vScale?: number,
}

export default class PBRMaterialFactory {
    private readonly scene: Scene = null

    private materialCache: IMaterialMap = {}

    private textureCache: ITextureMap = {}

    public constructor(scene: Scene) {
        this.scene = scene
    }

    /**
     * Returns the specified PBR texture
     */
    public create = (type: string, opts: IPBRMaterialFactoryOptions): PBRMaterial => {
        const {
            isDynamic = false,
            pScale = 0.1,
        } = opts
        if (!this.materialCache[type]) {
            const mat = new PBRMaterial(type, this.scene)
            this.setTextures(type, mat, opts)
            mat.useParallax = true
            mat.parallaxScaleBias = pScale
            isDynamic || mat.freeze()
            this.materialCache[type] = mat
        }
        return this.materialCache[type]
    }

    /**
     * Sets the PBR textures of a material (mutative)
     */
    private setTextures = (type: string, material: PBRMaterial, opts: IPBRMaterialFactoryOptions): void => {
        if (!this.textureCache[type]) {
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
            this.textureCache[type] = {
                albedoTexture: new Texture(albedoSrc, this.scene),
                bumpTexture: new Texture(bumpSrc, this.scene),
                metallicTexture: new Texture(metallicSrc, this.scene),
            }
        }
        const { albedoTexture, bumpTexture, metallicTexture }
            = this.textureCache[type]
        const { uScale = 1, vScale = 1 } = opts
        albedoTexture.uScale = uScale
        albedoTexture.vScale = vScale
        bumpTexture.uScale = uScale
        bumpTexture.vScale = vScale
        metallicTexture.uScale = uScale
        metallicTexture.vScale = vScale
        material.albedoTexture = albedoTexture
        material.bumpTexture = bumpTexture
        material.metallicTexture = metallicTexture
        material.useRoughnessFromMetallicTextureAlpha = false
        material.useMetallnessFromMetallicTextureBlue = true
        material.useRoughnessFromMetallicTextureGreen = true
        material.useAmbientOcclusionFromMetallicTextureRed = true
    }
}
