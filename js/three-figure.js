// AI Nexus Academy - Interactive 3D AI Hologram Background (Three.js)
// Optimized for Crisp Light / White Theme with Ultra High Performance on Mobile

const ThreeBackground = {
  scene: null,
  camera: null,
  renderer: null,
  canvas: null,
  animId: null,
  isPaused: false,
  
  // 3D Objects
  coreGroup: null,
  innerCore: null,
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

  init: function() {
    this.canvas = document.getElementById('bg-3d-canvas');
    if (!this.canvas) return;

    // Skip heavy 3D WebGL computation on mobile devices for smooth 120Hz/60Hz touch scrolling
    if (window.innerWidth <= 768) {
      if (this.canvas) this.canvas.style.display = 'none';
      return;
    }

    if (typeof THREE === 'undefined') {
      setTimeout(() => this.init(), 500);
      return;
    }

    // 1. Create Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 26;

    // 2. Create WebGL Renderer with performance budget
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power"
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } catch (e) {
      console.warn("WebGL initialization skipped:", e);
      return;
    }

    this.clock = new THREE.Clock();

    // 3. Build the 3D Holographic AI Figure
    this.build3DFigure();

    // 4. Build Surrounding Particle Constellation
    this.buildParticleConstellation();

    // 5. Add Lights for Light Theme
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const pointLightBlue = new THREE.PointLight(0x0284c7, 2.5, 50);
    pointLightBlue.position.set(12, 16, 18);
    this.scene.add(pointLightBlue);

    // 6. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize(), { passive: true });
    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
    
    // Pause rendering when tab is hidden or user scrolls deep to save GPU
    document.addEventListener('visibilitychange', () => {
      this.isPaused = document.hidden;
    });

    let scrollTimeout = null;
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight * 1.5) {
        this.isPaused = true;
      } else {
        this.isPaused = false;
      }
    }, { passive: true });

    // 7. Start Animation Loop
    this.animate();
  },

  build3DFigure: function() {
    this.coreGroup = new THREE.Group();
    this.scene.add(this.coreGroup);

    // A. Inner Glowing Core (Icosahedron Solid)
    const innerGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x0284c7,
      emissive: 0xbae6fd,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      shininess: 60
    });
    this.innerCore = new THREE.Mesh(innerGeo, innerMat);
    this.coreGroup.add(this.innerCore);

    // B. Outer Cyber Geometric Cage
    const outerGeo = new THREE.IcosahedronGeometry(7.5, 0);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    this.outerCage = new THREE.Mesh(outerGeo, outerMat);
    this.coreGroup.add(this.outerCage);

    // C. Glowing Node Vertices on Outer Cage
    const sphereGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7
    });

    const positionAttribute = outerGeo.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positionAttribute, i);
      const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeMesh.position.copy(vertex);
      this.coreGroup.add(nodeMesh);
    }

    // D. Orbital Rings
    const createRing = (radius, tube, color, rotX, rotY) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      return ring;
    };

    this.orbitalRing1 = createRing(10.5, 0.05, 0x0284c7, Math.PI / 3, 0);
    this.orbitalRing2 = createRing(12.0, 0.04, 0xdb2777, -Math.PI / 4, Math.PI / 6);
    this.orbitalRing3 = createRing(13.5, 0.04, 0x7c3aed, Math.PI / 2, -Math.PI / 4);

    this.coreGroup.add(this.orbitalRing1);
    this.coreGroup.add(this.orbitalRing2);
    this.coreGroup.add(this.orbitalRing3);

    this.coreGroup.position.set(0, 0, 0);
  },

  buildParticleConstellation: function() {
    const particleCount = 180; // Optimized from 600 for performance
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x0284c7);
    const color2 = new THREE.Color(0x6366f1);
    const color3 = new THREE.Color(0xdb2777);

    for (let i = 0; i < particleCount; i++) {
      const radius = 12 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() < 0.4 ? color1 : Math.random() < 0.7 ? color2 : color3;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.3
    });

    this.particleCloud = new THREE.Points(geometry, pMaterial);
    this.scene.add(this.particleCloud);
  },

  onMouseMove: function(e) {
    this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    this.targetRotationX = this.mouseY * 0.3;
    this.targetRotationY = this.mouseX * 0.3;
  },

  onWindowResize: function() {
    if (window.innerWidth <= 768) {
      if (this.canvas) this.canvas.style.display = 'none';
      this.isPaused = true;
      return;
    } else {
      if (this.canvas) this.canvas.style.display = 'block';
      this.isPaused = false;
    }

    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },

  animate: function() {
    this.animId = requestAnimationFrame(() => this.animate());

    if (this.isPaused) return;

    const delta = this.clock ? this.clock.getDelta() : 0.016;
    const elapsedTime = this.clock ? this.clock.getElapsedTime() : 0;

    if (this.coreGroup) {
      this.coreGroup.rotation.y += 0.005;
      this.coreGroup.rotation.x += 0.002;

      this.coreGroup.rotation.x += (this.targetRotationX - this.coreGroup.rotation.x) * 0.03;
      this.coreGroup.rotation.y += (this.targetRotationY - this.coreGroup.rotation.y) * 0.03;

      if (this.orbitalRing1) this.orbitalRing1.rotation.z += 0.01;
      if (this.orbitalRing2) this.orbitalRing2.rotation.y -= 0.012;
      if (this.orbitalRing3) this.orbitalRing3.rotation.x += 0.014;

      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
      if (this.innerCore) {
        this.innerCore.scale.set(scale, scale, scale);
      }
    }

    if (this.particleCloud) {
      this.particleCloud.rotation.y -= 0.001;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
};

// Auto-initialize when window loads
window.addEventListener('load', () => {
  ThreeBackground.init();
});
