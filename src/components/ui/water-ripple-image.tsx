'use client';

import React, { useEffect, useRef } from 'react';

export type WaterRippleImageProps = {
  /** Image source URL */
  src: string;
  /** Blue tint intensity (0–1) */
  blueish?: number;
  /** Noise scale factor */
  scale?: number;
  /** Surface illumination strength */
  illumination?: number;
  /** How much the surface warps the image */
  surfaceDistortion?: number;
  /** How much the water warps the image */
  waterDistortion?: number;
  /** Extra class on the canvas wrapper */
  className?: string;
};

const VERT = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_blueish;
uniform float u_scale;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float surface_noise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 10; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.2;
  }
  return (N.x + N.y + .1);
}

void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;

  float t = .002 * u_time;
  vec3 color = vec3(0.);
  float opacity = 0.;

  float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
  vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

  float surf = surface_noise(surface_noise_uv, t, u_scale);
  surf *= pow(uv.y, .3);
  surf = pow(surf, 2.);

  vec2 img_uv = vUv;
  img_uv -= .5;
  if (u_ratio > u_img_ratio) {
    img_uv.x = img_uv.x * u_ratio / u_img_ratio;
  } else {
    img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  }
  img_uv += .5;
  img_uv.y = 1. - img_uv.y;

  img_uv += (u_water_distortion * outer_noise);
  img_uv += (u_surface_distortion * surf);

  vec4 img = texture2D(u_image_texture, img_uv);
  img *= (1. + u_illumination * surf);

  color += img.rgb;
  color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surf;
  opacity += img.a;

  gl_FragColor = vec4(color, opacity);
}
`;

function compileShader(gl: WebGLRenderingContext, src: string, type: number) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile error: ${info || 'unknown'}`);
  }
  return sh;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compileShader(gl, vs, gl.VERTEX_SHADER);
  const f = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(`Program link error: ${info || 'unknown'}`);
  }
  return prog;
}

export default function WaterRippleImage({
  blueish = 0.6,
  scale = 7,
  illumination = 0.15,
  surfaceDistortion = 0.07,
  waterDistortion = 0.03,
  src,
  className = '',
}: WaterRippleImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const texRef = useRef<WebGLTexture | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number | null>(null);

  const paramsRef = useRef({ blueish, scale, illumination, surfaceDistortion, waterDistortion });
  paramsRef.current = { blueish, scale, illumination, surfaceDistortion, waterDistortion };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl =
      canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false }) ||
      (canvas.getContext('experimental-webgl', { alpha: true }) as WebGLRenderingContext | null);

    if (!gl) return;
    glRef.current = gl;

    // program
    const program = createProgram(gl, VERT, FRAG);
    programRef.current = program;
    gl.useProgram(program);

    // uniforms map
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      uniformsRef.current[info.name] = gl.getUniformLocation(program, info.name);
    }

    // full-screen quad buffer
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // push initial uniform values
    const u = uniformsRef.current;
    const p = paramsRef.current;
    gl.uniform1f(u['u_blueish'], p.blueish);
    gl.uniform1f(u['u_scale'], p.scale);
    gl.uniform1f(u['u_illumination'], p.illumination);
    gl.uniform1f(u['u_surface_distortion'], p.surfaceDistortion);
    gl.uniform1f(u['u_water_distortion'], p.waterDistortion);

    // load image into texture
    const loadImage = (srcUrl: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imgRef.current = img;
        if (texRef.current) gl.deleteTexture(texRef.current);
        const texture = gl.createTexture()!;
        texRef.current = texture;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.uniform1i(u['u_image_texture'], 0);
        const imgRatio = img.naturalWidth / img.naturalHeight;
        gl.uniform1f(u['u_img_ratio'], imgRatio);
      };
      img.src = srcUrl;
    };

    loadImage(src);

    // sizing (capped at 1.5 DPR — the 10-iteration surface_noise loop is the GPU bottleneck, not pixel clarity)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = Math.floor(container.clientWidth * dpr);
      const h = Math.floor(container.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(u['u_ratio'], canvas.width / canvas.height);
      if (imgRef.current) {
        gl.uniform1f(u['u_img_ratio'], imgRef.current.naturalWidth / imgRef.current.naturalHeight);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Visibility gating — pause the render loop when off-screen to save GPU cycles.
    // IntersectionObserver fires immediately when the element re-enters the viewport,
    // so it reactivates seamlessly when navigating back to the home page.
    let isVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(container);

    // render loop
    const render = () => {
      animRef.current = requestAnimationFrame(render);
      if (!isVisible) return; // Skip GPU work when off-screen

      // sync params every frame (cheap float writes)
      const cp = paramsRef.current;
      gl.uniform1f(u['u_blueish'], cp.blueish);
      gl.uniform1f(u['u_scale'], cp.scale);
      gl.uniform1f(u['u_illumination'], cp.illumination);
      gl.uniform1f(u['u_surface_distortion'], cp.surfaceDistortion);
      gl.uniform1f(u['u_water_distortion'], cp.waterDistortion);

      gl.uniform1f(u['u_time'], performance.now());
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    animRef.current = requestAnimationFrame(render);

    return () => {
      io.disconnect();
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (texRef.current) gl.deleteTexture(texRef.current);
      gl.useProgram(null);
      if (programRef.current) gl.deleteProgram(programRef.current);
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

export { WaterRippleImage };
