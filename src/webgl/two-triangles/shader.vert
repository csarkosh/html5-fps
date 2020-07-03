precision mediump float;

attribute vec2 position;
uniform struct Uniforms {
    vec4 fill;
    float time;
} uniforms;

void main() {
    gl_Position = vec4(position, 0, 1.0);
}
