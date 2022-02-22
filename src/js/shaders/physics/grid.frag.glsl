precision highp float;
precision highp int;

in float v_idx;

out vec4 gColor;


void main() {
    float idx = v_idx;
    if (idx == 0.0) {
        idx = .5;
    }
    gColor = vec4(idx, idx, idx, idx);
}
