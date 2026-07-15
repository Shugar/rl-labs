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
    p = rotation * p * 2.03 + 13.7;
    amplitude *= 0.5;
  }

  return value;
}

float segmentDistance(vec2 p, vec2 start, vec2 end) {
  vec2 segment = end - start;
  float projection = clamp(dot(p - start, segment) / dot(segment, segment), 0.0, 1.0);
  return length(p - (start + segment * projection));
}

float tacticalNode(vec2 p, vec2 position, float radius) {
  float distanceToNode = length(p - position);
  float ring = exp(-abs(distanceToNode - radius) * 470.0);
  float core = exp(-distanceToNode * 150.0);
  float glow = exp(-distanceToNode * 46.0);
  return ring * 0.62 + core * 0.42 + glow * 0.08;
}

void main() {
  float t = uTime;
  vec2 pointer = (uPointer - 0.5) * vec2(0.010, 0.006);
  vec2 p = vUv - 0.5;
  p.x *= uAspect;
  p += pointer;
  float screenX = p.x / uAspect;

  vec3 ink = vec3(0.006, 0.010, 0.021);
  vec3 deepBlue = vec3(0.020, 0.100, 0.205);
  vec3 blue = vec3(0.090, 0.480, 1.000);
  vec3 orange = vec3(1.000, 0.205, 0.045);
  vec3 boostGold = vec3(1.000, 0.660, 0.120);
  vec3 white = vec3(0.900, 0.940, 1.000);
  vec3 lime = vec3(0.720, 1.000, 0.170);
  vec3 color = ink;

  // A soft pressure field hints at possession zones without drawing a pitch.
  vec2 flowWarp = vec2(
    fbm(p * 1.35 + vec2(t * 0.018, -t * 0.012)),
    fbm(p * 1.55 + vec2(-t * 0.014, t * 0.010) + 8.1)
  );
  float pressure = fbm(p * 2.25 + (flowWarp - 0.5) * 1.30);
  float pressureMask = smoothstep(0.44, 0.80, pressure)
    * (0.30 + 0.70 * smoothstep(-0.34, 0.34, screenX));
  color += mix(orange, deepBlue * 1.8, smoothstep(-0.38, 0.42, screenX))
    * pressureMask * 0.052;

  // Flowing analysis contours replace literal sidelines and penalty boxes.
  float flowCoordinate = (
    p.y
    + sin(p.x * 2.1 + t * 0.080) * 0.055
    + (flowWarp.x - 0.5) * 0.105
  ) * 13.0;
  float contourDistance = abs(fract(flowCoordinate) - 0.5);
  float contours = 1.0 - smoothstep(0.035, 0.105, contourDistance);
  float contourFade = smoothstep(-0.42, -0.04, screenX)
    * (1.0 - smoothstep(0.28, 0.58, abs(p.y)));
  vec3 contourColor = mix(orange, blue, smoothstep(-0.20, 0.34, screenX));
  color += contourColor * contours * contourFade * 0.045;

  // Player positions form evolving passing triangles—an abstract playbook
  // rather than an illustrated field diagram.
  vec2 orange1 = vec2(uAspect * (-0.10 + sin(t * 0.23) * 0.010), 0.17);
  vec2 orange2 = vec2(uAspect * (0.02 + sin(t * 0.19 + 1.3) * 0.014), -0.23);
  vec2 orange3 = vec2(uAspect * (0.17 + sin(t * 0.17 + 2.5) * 0.012), 0.08);
  vec2 blue1 = vec2(uAspect * (0.11 + sin(t * 0.21 + 0.7) * 0.012), 0.27);
  vec2 blue2 = vec2(uAspect * (0.29 + sin(t * 0.18 + 2.1) * 0.010), -0.20);
  vec2 blue3 = vec2(uAspect * (0.44 + sin(t * 0.16 + 3.2) * 0.008), 0.14);

  float orangeNetwork = exp(-segmentDistance(p, orange1, orange2) * 150.0)
    + exp(-segmentDistance(p, orange2, orange3) * 150.0)
    + exp(-segmentDistance(p, orange3, orange1) * 150.0);
  float blueNetwork = exp(-segmentDistance(p, blue1, blue2) * 145.0)
    + exp(-segmentDistance(p, blue2, blue3) * 145.0)
    + exp(-segmentDistance(p, blue3, blue1) * 145.0);
  float networkPulse = 0.48 + 0.52 * sin(t * 0.54 + screenX * 12.0) * 0.5 + 0.26;
  float networkZone = 0.32 + 0.68 * smoothstep(-0.34, 0.18, screenX);
  color += orange * min(orangeNetwork, 1.0) * networkPulse * networkZone * 0.095;
  color += blue * min(blueNetwork, 1.0) * networkPulse * networkZone * 0.082;

  float nodeRadius = 0.0095;
  float orangeNodes = tacticalNode(p, orange1, nodeRadius)
    + tacticalNode(p, orange2, nodeRadius)
    + tacticalNode(p, orange3, nodeRadius);
  float blueNodes = tacticalNode(p, blue1, nodeRadius)
    + tacticalNode(p, blue2, nodeRadius)
    + tacticalNode(p, blue3, nodeRadius);
  color += orange * min(orangeNodes, 1.0) * networkZone * 0.31;
  color += blue * min(blueNodes, 1.0) * networkZone * 0.29;

  // Two ghosted routes suggest a coached passing sequence and counter-read.
  float orangeRouteY = -0.12
    + sin((screenX + 0.20) * 5.2) * 0.062
    + sin(screenX * 12.0 - t * 0.08) * 0.018;
  float blueRouteY = 0.19
    + sin((screenX - 0.05) * 4.4 + 1.6) * 0.052
    + sin(screenX * 10.0 + t * 0.07) * 0.014;
  float orangeRouteDistance = abs(p.y - orangeRouteY);
  float blueRouteDistance = abs(p.y - blueRouteY);
  float routeRange = smoothstep(-0.34, -0.22, screenX)
    * (1.0 - smoothstep(0.46, 0.54, screenX));
  float orangeDashes = 0.24 + 0.76 * smoothstep(-0.18, 0.55, sin(screenX * 78.0 - t * 0.72));
  float blueDashes = 0.22 + 0.78 * smoothstep(-0.20, 0.58, sin(screenX * 69.0 + t * 0.56 + 2.1));
  float orangeRoute = exp(-orangeRouteDistance * 220.0) * orangeDashes * routeRange;
  float blueRoute = exp(-blueRouteDistance * 205.0) * blueDashes * routeRange;
  color += orange * orangeRoute * 0.23;
  color += blue * blueRoute * 0.17;

  // The bright playhead is the only literal ball cue; it moves through the
  // abstract route and disappears softly before the sequence resets.
  float progress = fract(t * 0.052);
  float ballXNormalized = mix(-0.30, 0.49, progress);
  float ballY = -0.12
    + sin((ballXNormalized + 0.20) * 5.2) * 0.062
    + sin(ballXNormalized * 12.0 - t * 0.08) * 0.018;
  vec2 ballPosition = vec2(ballXNormalized * uAspect, ballY);
  float ballVisibility = smoothstep(0.01, 0.07, progress)
    * (1.0 - smoothstep(0.94, 0.995, progress));
  float ballDistance = length(p - ballPosition);
  float ball = exp(-ballDistance * 180.0) * ballVisibility;
  float ballGlow = exp(-ballDistance * 44.0) * ballVisibility;
  color += white * ball * 0.74;
  color += lime * ballGlow * 0.14;

  // Sparse boost fragments travel laterally through the pressure map.
  vec2 particleSpace = vec2(screenX * 31.0 + t * 0.17, p.y * 23.0 - t * 0.035);
  vec2 particleCell = floor(particleSpace);
  vec2 particlePoint = fract(particleSpace) - 0.5;
  float particleSeed = hash21(particleCell);
  float particle = smoothstep(0.060, 0.0, length(particlePoint * vec2(0.32, 1.0)));
  particle *= step(0.944, particleSeed);
  color += boostGold * particle * contourFade * 0.14;

  // A quiet broadcast texture prevents the empty ink areas from feeling flat.
  float grain = noise(p * vec2(135.0, 92.0) + t * 0.018) - 0.5;
  color += vec3(grain * 0.008);
  float vignette = 1.0 - smoothstep(0.34, 1.02, length((vUv - 0.5) * vec2(0.78, 1.12)));
  color *= 0.52 + 0.44 * vignette;
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
    console.warn("Final CTA shader could not compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function FinalCtaWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest<HTMLElement>(".final-cta");
    if (!canvas || !section) return;

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
      console.warn("Final CTA shader program could not link:", gl.getProgramInfoLog(program));
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
    let inView = false;
    let disposed = false;
    let contextLost = false;
    let firstFrame = true;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dprLimit = window.innerWidth <= 680 ? 1.1 : 1.45;
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
      pointer[0] += (targetPointer[0] - pointer[0]) * 0.025;
      pointer[1] += (targetPointer[1] - pointer[1]) * 0.025;

      gl.useProgram(program);
      gl.uniform1f(timeLocation, motionQuery.matches ? 7.25 : timestamp * 0.001);
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
      const bounds = section.getBoundingClientRect();
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

    section.addEventListener("pointermove", handlePointerMove, { passive: true });
    section.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", requestRender);
    intersectionObserver.observe(section);
    resizeObserver.observe(canvas);
    resize();
    render(performance.now());

    return () => {
      disposed = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
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

  return <canvas ref={canvasRef} className="cta-webgl" aria-hidden="true" />;
}
