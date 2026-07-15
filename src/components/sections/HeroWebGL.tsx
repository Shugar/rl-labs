import { useEffect, useRef } from "react";

const vertexShaderSource = `#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform float uTime;
uniform float uAspect;
uniform vec2 uPointer;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotation * p * 2.03 + 17.17;
    amplitude *= 0.5;
  }

  return value;
}

float gridLine(float value, float thickness) {
  float distanceToLine = abs(fract(value) - 0.5);
  return 1.0 - smoothstep(thickness, thickness * 2.0, distanceToLine);
}

float beamMask(vec2 p, vec2 origin, vec2 target, float spread) {
  vec2 axis = target - origin;
  float axisLength = length(axis);
  vec2 direction = axis / axisLength;
  vec2 delta = p - origin;
  float along = dot(delta, direction);
  float progress = clamp(along / axisLength, 0.0, 1.0);
  float side = abs(delta.x * direction.y - delta.y * direction.x);
  float coneWidth = spread * (0.08 + progress * 0.92);
  float cone = 1.0 - smoothstep(coneWidth * 0.50, coneWidth, side);
  float start = smoothstep(-0.015, 0.045, along);
  float end = 1.0 - smoothstep(1.0, 1.18, along / axisLength);
  return cone * start * end;
}

void main() {
  float t = uTime;
  vec2 pointer = (uPointer - 0.5) * vec2(0.075, 0.045);
  vec2 p = vUv - 0.5;
  p.x *= uAspect;
  p += pointer;

  float screenX = p.x / uAspect;

  vec3 ink = vec3(0.007, 0.011, 0.024);
  vec3 midnight = vec3(0.012, 0.035, 0.078);
  vec3 electricBlue = vec3(0.130, 0.540, 1.000);
  vec3 warmWhite = vec3(0.870, 0.910, 1.000);
  vec3 orange = vec3(1.000, 0.220, 0.045);
  vec3 signal = vec3(0.720, 1.000, 0.170);
  vec3 color = ink;

  // Low, rolling haze catches the light while the upper stadium remains
  // nearly black. Everything drifts laterally; nothing orbits a focal point.
  vec2 hazeWarp = vec2(
    fbm(p * 1.30 + vec2(t * 0.018, -t * 0.010)),
    fbm(p * 1.55 + vec2(-t * 0.013, t * 0.012) + 9.7)
  );
  float haze = fbm(p * 2.10 + (hazeWarp - 0.5) * 1.25 + vec2(t * 0.020, 0.0));
  float hazeMask = smoothstep(0.43, 0.78, haze) * (1.0 - smoothstep(0.08, 0.56, p.y));
  color += mix(orange, midnight * 2.2, smoothstep(-0.48, 0.52, screenX)) * hazeMask * 0.090;

  // Volumetric stadium floodlights. Their targets breathe a few pixels over
  // time instead of sweeping or rotating through the composition.
  float orangeBeam = beamMask(
    p,
    vec2(-0.40 * uAspect, 0.62),
    vec2((-0.17 + sin(t * 0.13) * 0.018) * uAspect, -0.60),
    0.17 * uAspect
  );
  float whiteBeam = beamMask(
    p,
    vec2(0.01 * uAspect, 0.64),
    vec2((0.02 + sin(t * 0.11 + 1.7) * 0.014) * uAspect, -0.62),
    0.12 * uAspect
  );
  float blueBeam = beamMask(
    p,
    vec2(0.42 * uAspect, 0.63),
    vec2((0.20 + sin(t * 0.15 + 3.1) * 0.018) * uAspect, -0.58),
    0.18 * uAspect
  );
  float beamTexture = 0.63 + 0.37 * fbm(p * 3.1 + vec2(t * 0.012, -t * 0.045));
  color += orange * orangeBeam * beamTexture * 0.145;
  color += warmWhite * whiteBeam * beamTexture * 0.058;
  color += electricBlue * blueBeam * beamTexture * 0.138;

  // A distant arc of lamps implies the stadium bowl without illustrating it.
  float bowlY = 0.275 - screenX * screenX * 0.24;
  float bowlDistance = abs(p.y - bowlY);
  float bowlLine = exp(-bowlDistance * 150.0) * (1.0 - smoothstep(0.28, 0.58, abs(screenX)));
  float lampCell = abs(fract((screenX + 0.5) * 19.0) - 0.5);
  float lamps = exp(-lampCell * 28.0) * exp(-bowlDistance * 260.0);
  color += midnight * bowlLine * 0.65;
  color += warmWhite * lamps * 0.24;

  // Perspective floor markings anchor the atmosphere in an arena.
  float floorDepth = 0.145 / max(0.055, 0.49 - vUv.y);
  float floorX = p.x * floorDepth * 3.2;
  float xWidth = max(fwidth(floorX) * 0.78, 0.012);
  float zWidth = max(fwidth(floorDepth) * 0.65, 0.014);
  float floorGrid = max(
    gridLine(floorX, xWidth),
    gridLine(floorDepth * 1.45, zWidth)
  );
  float floorFade = (1.0 - smoothstep(0.20, 0.49, vUv.y)) * smoothstep(0.0, 0.22, vUv.y);
  color += warmWhite * floorGrid * floorFade * 0.031;

  // Replay trajectories travel laterally like an analysis overlay. They are
  // concentrated in the lower half and use fragments rather than solid lines.
  float traceY1 = -0.155 + sin(screenX * 7.2 + 0.4) * 0.040 + sin(screenX * 16.0 - t * 0.10) * 0.014;
  float traceY2 = -0.285 + sin(screenX * 5.1 + 2.1) * 0.048 + sin(screenX * 12.0 + t * 0.08) * 0.012;
  float traceDistance1 = abs(p.y - traceY1);
  float traceDistance2 = abs(p.y - traceY2);
  float dash1 = smoothstep(-0.12, 0.52, sin(screenX * 92.0 - t * 0.48));
  float dash2 = smoothstep(-0.20, 0.58, sin(screenX * 75.0 - t * 0.36 + 2.2));
  float dataZone = 0.34 + 0.66 * smoothstep(-0.38, 0.30, screenX);
  float trace1 = exp(-traceDistance1 * 210.0) * dash1;
  float trace2 = exp(-traceDistance2 * 195.0) * dash2;
  float traceGlow1 = exp(-traceDistance1 * 38.0);
  float traceGlow2 = exp(-traceDistance2 * 34.0);
  color += orange * (trace1 * 0.34 + traceGlow1 * 0.020) * dataZone;
  color += electricBlue * (trace2 * 0.31 + traceGlow2 * 0.019) * dataZone;

  // Small playheads move along each replay trace—enough to communicate live
  // data, never large enough to become a new centerpiece.
  float packetX1 = -0.52 + fract(t * 0.036) * 1.04;
  float packetY1 = -0.155 + sin(packetX1 * 7.2 + 0.4) * 0.040 + sin(packetX1 * 16.0 - t * 0.10) * 0.014;
  float packetX2 = -0.52 + fract(t * 0.028 + 0.43) * 1.04;
  float packetY2 = -0.285 + sin(packetX2 * 5.1 + 2.1) * 0.048 + sin(packetX2 * 12.0 + t * 0.08) * 0.012;
  float packet1 = exp(-length(vec2((screenX - packetX1) * uAspect, p.y - packetY1)) * 150.0);
  float packet2 = exp(-length(vec2((screenX - packetX2) * uAspect, p.y - packetY2)) * 145.0);
  color += signal * packet1 * 0.46 * dataZone;
  color += warmWhite * packet2 * 0.28 * dataZone;

  // Suspended dust is only visible where a floodlight catches it.
  vec2 dustSpace = p * vec2(35.0, 29.0) + vec2(-t * 0.032, t * 0.085);
  vec2 dustCell = floor(dustSpace);
  vec2 dustPoint = fract(dustSpace) - 0.5;
  float dustSeed = hash21(dustCell);
  float dust = smoothstep(0.052, 0.0, length(dustPoint));
  dust *= step(0.935, dustSeed) * (0.25 + 0.75 * hash21(dustCell + 5.2));
  float dustLight = clamp(orangeBeam + whiteBeam + blueBeam, 0.0, 1.0);
  color += mix(orange, electricBlue, smoothstep(-0.36, 0.38, screenX)) * dust * (0.045 + dustLight * 0.23);

  float vignette = 1.0 - smoothstep(0.38, 1.05, length((vUv - 0.5) * vec2(0.78, 1.12)));
  color *= 0.44 + 0.44 * vignette;
  color *= 0.988 + 0.012 * sin(vUv.y * 920.0 + t * 0.34);
  color = pow(color, vec3(0.94));

  outColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Hero shader could not compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function HeroWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !hero) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      canvas.dataset.webgl = "unsupported";
      return;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Hero shader program could not link:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const aspectLocation = gl.getUniformLocation(program, "uAspect");
    const pointerLocation = gl.getUniformLocation(program, "uPointer");
    const positionBuffer = gl.createBuffer();
    if (!positionBuffer || positionLocation < 0) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targetPointer = [0.5, 0.5];
    const pointer = [0.5, 0.5];
    let frameId = 0;
    let inView = true;
    let disposed = false;
    let contextLost = false;
    let firstFrame = true;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dprLimit = window.innerWidth <= 680 ? 1.15 : 1.6;
      const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
      const width = Math.max(1, Math.round(bounds.width * dpr));
      const height = Math.max(1, Math.round(bounds.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (timestamp: number) => {
      frameId = 0;
      if (disposed || contextLost) return;

      resize();
      pointer[0] += (targetPointer[0] - pointer[0]) * 0.055;
      pointer[1] += (targetPointer[1] - pointer[1]) * 0.055;

      gl.useProgram(program);
      gl.uniform1f(timeLocation, motionQuery.matches ? 4.75 : timestamp * 0.001);
      gl.uniform1f(aspectLocation, canvas.width / canvas.height);
      gl.uniform2f(pointerLocation, pointer[0], pointer[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (firstFrame) {
        canvas.classList.add("is-ready");
        firstFrame = false;
      }

      if (!motionQuery.matches && inView && !document.hidden) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const requestRender = () => {
      if (!frameId && !disposed && !contextLost) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (motionQuery.matches) return;
      const bounds = hero.getBoundingClientRect();
      targetPointer[0] = (event.clientX - bounds.left) / bounds.width;
      targetPointer[1] = 1 - (event.clientY - bounds.top) / bounds.height;
    };

    const handlePointerLeave = () => {
      targetPointer[0] = 0.5;
      targetPointer[1] = 0.5;
    };

    const handleVisibility = () => {
      if (document.hidden && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (inView) {
        requestRender();
      }
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      canvas.classList.remove("is-ready");
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) requestRender();
      else if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    });
    const resizeObserver = new ResizeObserver(requestRender);

    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", requestRender);
    intersectionObserver.observe(hero);
    resizeObserver.observe(canvas);
    requestRender();

    return () => {
      disposed = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", requestRender);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-webgl" aria-hidden="true" />;
}
