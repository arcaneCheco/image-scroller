uniform float uDecay;
uniform vec3 uStartColor;
uniform vec3 uEndColor;

varying vec2 vUv;

void main() {
    vec3 finalColor = mix(uStartColor, uEndColor, pow(vUv.y, uDecay));
    gl_FragColor = vec4(finalColor, 1.);
}