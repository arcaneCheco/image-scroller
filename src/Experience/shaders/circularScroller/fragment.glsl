uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
    vec3 finalColor = texture2D(uTexture, vUv).rgb;
    gl_FragColor = vec4(finalColor, 1.);
}