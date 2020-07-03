precision mediump float;

uniform struct Uniforms {
    vec4 fill;
    float time;
} uniforms;


void main() {
    gl_FragColor = uniforms.fill;
    gl_FragColor = vec4(
        uniforms.fill.xyz * abs(sin(uniforms.time)),
        1.0
    );
}
