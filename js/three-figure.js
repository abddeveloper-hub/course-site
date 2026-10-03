// NEXVION AI ACADEMY - Executive Alabaster Kinetic 3D Architectural Core (Three.js)
// Calibrated with Architectural Precision: Milled Obsidian Rings, Cobalt Royal Ticks, and Subtle Alabaster Ambience

const ThreeBackground = {
  scene: null,
  camera: null,
  renderer: null,
  canvas: null,
  animId: null,
  isPaused: false,
  initialized: false,

  // 3D Objects
  coreGroup: null,
  innerCore: null,
  innerSolid: null,
  outerCage: null,
  orbitalRing1: null,
  orbitalRing2: null,
  orbitalRing3: null,
  particleCloud: null,

  mouseX: 0,
  mouseY: 0,
  targetRotationX: 0,
  targetRotationY: 0,
  clock: null,

  init: function () {
    if (this.initialized) return;

    this.canvas = document.getElementById("bg-3d-canvas");
    if (!this.canvas) return;

    if (typeof THREE === "undefined") {
      setTimeout(() => this.init(), 300);
      return;
    }

    this.initialized = true;

    // 1. Create Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 2. Create WebGL Renderer with performance budget
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } catch (e) {
      console.warn("WebGL initialization skipped:", e);
      return;
    }

    this.updateCameraForScreen();
    this.clock = new THREE.Clock();

    // 3. Build the 3D Kinetic Architectural Neural Figure
    this.build3DFigure();

    // 4. Build Ambient Constellation
    this.buildParticleConstellation();

    // 5. Add Subtle Architectural Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    this.scene.add(ambientLight);

    this.pointLightCyan = new THREE.PointLight(0x0051d5, 1.5, 60);
    this.pointLightCyan.position.set(12, 16, 18);
    this.scene.add(this.pointLightCyan);

    this.pointLightViolet = new THREE.PointLight(0x09090b, 0.8, 60);
    this.pointLightViolet.position.set(-14, -10, 16);
    this.scene.add(this.pointLightViolet);

    this.pointLightMagenta = new THREE.PointLight(0x2563eb, 1.2, 50);
    this.pointLightMagenta.position.set(0, 18, 12);
    this.scene.add(this.pointLightMagenta);

    // 6. Event Listeners
    window.addEventListener("resize", () => this.onWindowResize(), { passive: true });
    window.addEventListener("mousemove", (e) => this.onMouseMove(e), { passive: true });
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches && e.touches[0]) {
          this.onMouseMove({
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
          });
        }
      },
      { passive: true }
    );

    // Pause rendering ONLY when tab is inactive to preserve battery
    document.addEventListener("visibilitychange", () => {
      this.isPaused = document.hidden;
    });

    // Apply active theme colors if theme manager is ready
    if (typeof ThemeManager !== "undefined" && ThemeManager.themes && ThemeManager.currentTheme) {
      const activeTheme = ThemeManager.themes[ThemeManager.currentTheme];
      if (activeTheme) this.setThemeColors(activeTheme);
    }

    // 7. Start Animation Loop
    this.animate();
  },

  build3DFigure: function () {
    this.coreGroup = new THREE.Group();
    this.scene.add(this.coreGroup);

    // A. Inner Architectural Titanium Core (Icosahedron Solid)
    const innerGeo = new THREE.IcosahedronGeometry(4.4, 1);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x334155,
      emissive: 0x09090b,
      emissiveIntensity: 0.15,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      shininess: 90,
    });
    this.innerCore = new THREE.Mesh(innerGeo, innerMat);
    this.coreGroup.add(this.innerCore);

    // B. Inner Translucent Cobalt Crystal Kernel
    const kernelGeo = new THREE.OctahedronGeometry(2.3, 0);
    const kernelMat = new THREE.MeshBasicMaterial({
      color: 0x0051d5,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    this.innerSolid = new THREE.Mesh(kernelGeo, kernelMat);
    this.coreGroup.add(this.innerSolid);

    // C. Outer Hairline Geometric Cage
    const outerGeo = new THREE.IcosahedronGeometry(7.6, 0);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });
    this.outerCage = new THREE.Mesh(outerGeo, outerMat);
    this.coreGroup.add(this.outerCage);

    // D. Node Vertices on Outer Cage
    const sphereGeo = new THREE.SphereGeometry(0.24, 8, 8);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0051d5,
    });

    const positionAttribute = outerGeo.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positionAttribute, i);
      const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeMesh.position.copy(vertex);
      this.coreGroup.add(nodeMesh);
    }

    // E. 3 Dynamic Milled Gyroscope Rings
    const createRing = (radius, tube, color, rotX, rotY, opacity = 0.5) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: opacity,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      return ring;
    };

    this.orbitalRing1 = createRing(10.6, 0.05, 0x09090b, Math.PI / 3, 0, 0.55); // Obsidian Ring
    this.orbitalRing2 = createRing(12.3, 0.04, 0x0051d5, -Math.PI / 4, Math.PI / 6, 0.6); // Cobalt Royal Ring
    this.orbitalRing3 = createRing(13.9, 0.04, 0x64748b, Math.PI / 2, -Math.PI / 4, 0.45); // Slate Platinum Ring

    this.coreGroup.add(this.orbitalRing1);
    this.coreGroup.add(this.orbitalRing2);
    this.coreGroup.add(this.orbitalRing3);

    this.coreGroup.position.set(0, 0, 0);
  },

  buildParticleConstellation: function () {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x334155); // Slate
    const color2 = new THREE.Color(0x0051d5); // Cobalt
    const color3 = new THREE.Color(0x94a3b8); // Titanium Platinum

    for (let i = 0; i < particleCount; i++) {
      const radius = 10 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() < 0.45 ? color1 : Math.random() < 0.75 ? color2 : color3;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
    });

    this.particleCloud = new THREE.Points(geometry, pMaterial);
    this.scene.add(this.particleCloud);
  },

  onMouseMove: function (e) {
    this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    this.targetRotationX = this.mouseY * 0.25;
    this.targetRotationY = this.mouseX * 0.25;
  },

  updateCameraForScreen: function () {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;

    if (width <= 480) {
      this.camera.position.z = 38;
    } else if (width <= 768) {
      this.camera.position.z = 30;
    } else {
      this.camera.position.z = 22;
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  },

  onWindowResize: function () {
    this.updateCameraForScreen();
  },

  animate: function () {
    this.animId = requestAnimationFrame(() => this.animate());

    if (this.isPaused) return;

    const delta = this.clock ? this.clock.getDelta() : 0.016;
    const elapsedTime = this.clock ? this.clock.getElapsedTime() : 0;

    if (this.coreGroup) {
      this.coreGroup.rotation.y += 0.003;
      this.coreGroup.rotation.x += 0.0015;

      this.coreGroup.rotation.x += (this.targetRotationX - this.coreGroup.rotation.x) * 0.03;
      this.coreGroup.rotation.y += (this.targetRotationY - this.coreGroup.rotation.y) * 0.03;

      if (this.orbitalRing1) this.orbitalRing1.rotation.z += 0.006;
      if (this.orbitalRing2) this.orbitalRing2.rotation.y -= 0.008;
      if (this.orbitalRing3) this.orbitalRing3.rotation.x += 0.009;

      const scale = 1 + Math.sin(elapsedTime * 1.2) * 0.03;
      if (this.innerCore) {
        this.innerCore.scale.set(scale, scale, scale);
      }
      if (this.innerSolid) {
        this.innerSolid.rotation.y -= 0.005;
        this.innerSolid.rotation.z += 0.004;
      }
    }

    if (this.particleCloud) {
      this.particleCloud.rotation.y -= 0.0006;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  },

  setThemeColors: function (theme) {
    if (!theme) return;
    if (this.innerCore && this.innerCore.material) {
      this.innerCore.material.color.setHex(theme.hexPrimary);
    }
    if (this.innerSolid && this.innerSolid.material) {
      this.innerSolid.material.color.setHex(theme.hexSecondary);
    }
    if (this.outerCage && this.outerCage.material) {
      this.outerCage.material.color.setHex(theme.hexAccent);
    }
    if (this.orbitalRing1 && this.orbitalRing1.material) {
      this.orbitalRing1.material.color.setHex(theme.hexPrimary);
    }
    if (this.orbitalRing2 && this.orbitalRing2.material) {
      this.orbitalRing2.material.color.setHex(theme.hexSecondary);
    }
    if (this.orbitalRing3 && this.orbitalRing3.material) {
      this.orbitalRing3.material.color.setHex(theme.hexAccent);
    }
    if (this.pointLightCyan) this.pointLightCyan.color.setHex(theme.hexSecondary);
    if (this.pointLightViolet) this.pointLightViolet.color.setHex(theme.hexPrimary);
    if (this.pointLightMagenta) this.pointLightMagenta.color.setHex(theme.hexAccent);
  },
};

// Immediate reliable auto-initialization across all lifecycles
if (document.readyState === "complete" || document.readyState === "interactive") {
  ThreeBackground.init();
} else {
  document.addEventListener("DOMContentLoaded", () => ThreeBackground.init());
  window.addEventListener("load", () => ThreeBackground.init());
}
