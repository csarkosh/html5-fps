precision highp float;

uniform struct Uniforms {
    vec4 fill;
    float time;
} uniforms;


void main() {
    gl_FragColor = uniforms.fill;
}
