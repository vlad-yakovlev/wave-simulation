import { getDrawShader, getShader } from './utils'

export const TEXTURE_NAMES = [
  'acceleration',
  'height',
  'accumulated',
  'velocity',
] as const

export const VERTEX_SHADER = `#version 300 es
  in vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`

export const INIT_SHADER = getShader(`
  void main() {
    o_acceleration = DEFAULT_ACCELERATION;
    o_height = vec4(0);
    o_accumulated = vec4(0);
    o_velocity = vec4(0);
  }
`)

export const ITERATE_SHADER = getShader(`
  vec4 getForce() {
    ivec2 texelCoord = ivec2(gl_FragCoord.xy);
    vec4 sides = step(1.0, vec4(gl_FragCoord.xy, u_resolution.xy - gl_FragCoord.xy));
    vec4 angles = sides * sides.yzwx * 0.3;

    float weight = 1.0 / (dot(sides, vec4(1)) + dot(angles, vec4(1)));
    sides *= weight;
    angles *= weight;

    return
      angles.x * (texelFetch(u_height, texelCoord + ivec2(-1, -1), 0) + texelFetch(u_velocity, texelCoord + ivec2(-1, -1), 0)) +
      sides.y  * (texelFetch(u_height, texelCoord + ivec2( 0, -1), 0) + texelFetch(u_velocity, texelCoord + ivec2( 0, -1), 0)) +
      angles.y * (texelFetch(u_height, texelCoord + ivec2( 1, -1), 0) + texelFetch(u_velocity, texelCoord + ivec2( 1, -1), 0)) +
      sides.x  * (texelFetch(u_height, texelCoord + ivec2(-1,  0), 0) + texelFetch(u_velocity, texelCoord + ivec2(-1,  0), 0)) +
      -1.0     * (texelFetch(u_height, texelCoord                , 0) + texelFetch(u_velocity, texelCoord                , 0)) +
      sides.z  * (texelFetch(u_height, texelCoord + ivec2( 1,  0), 0) + texelFetch(u_velocity, texelCoord + ivec2( 1,  0), 0)) +
      angles.w * (texelFetch(u_height, texelCoord + ivec2(-1,  1), 0) + texelFetch(u_velocity, texelCoord + ivec2(-1,  1), 0)) +
      sides.w  * (texelFetch(u_height, texelCoord + ivec2( 0,  1), 0) + texelFetch(u_velocity, texelCoord + ivec2( 0,  1), 0)) +
      angles.z * (texelFetch(u_height, texelCoord + ivec2( 1,  1), 0) + texelFetch(u_velocity, texelCoord + ivec2( 1,  1), 0));
  }

  void main() {
    ivec2 texelCoord = ivec2(gl_FragCoord.xy);
    vec4 nextHeight = texelFetch(u_height, texelCoord, 0) + texelFetch(u_velocity, texelCoord, 0);

    o_acceleration = texelFetch(u_acceleration, texelCoord, 0);
    o_height = nextHeight;
    o_accumulated = texelFetch(u_accumulated, texelCoord, 0) + abs(nextHeight);
    o_velocity = texelFetch(u_velocity, texelCoord, 0) + getForce() * texelFetch(u_acceleration, texelCoord, 0);
  }
`)

export const DRAW_SHADER = getDrawShader(`
  void main() {
    o_color = vec4(abs(texelFetch(u_height, ivec2(gl_FragCoord.xy), 0)).rgb, 1);
  }
`)
