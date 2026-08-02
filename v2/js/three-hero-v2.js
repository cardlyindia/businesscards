/* ==========================================================================
   CARDLY INDEX2 - THREE.JS 3D CANVAS STAGE SCRIPT
   ========================================================================== */

(function () {
  'use strict';

  let scene, camera, renderer;
  let cardGroup;
  let currentCardIndex = 0;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0.1, y: -0.2 };
  let currentRotation = { x: 0.1, y: -0.2 };

  const textures = [];
  let backTexture;

  function initThreeStage() {
    const canvas = document.getElementById('index2-three-canvas');
    const container = document.getElementById('index2-canvas-container');
    if (!canvas || !container) return;

    // Scene
    scene = new THREE.Scene();

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    updateCameraPosition();

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 1.2);
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf355da, 0.8);
    dirLight2.position.set(-5, -5, -4);
    scene.add(dirLight2);

    // Build Textures & Mesh
    createProceduralTextures();
    build3DCardMesh();

    // Event Listeners
    setupEventListeners(canvas, container);

    // Animation Loop
    animate();
  }

  function updateCameraPosition() {
    if (!camera) return;
    const w = window.innerWidth;
    if (w < 480) {
      camera.position.z = 7.8;
    } else if (w < 768) {
      camera.position.z = 6.6;
    } else {
      camera.position.z = 5.2;
    }
  }

  function createProceduralTextures() {
    const width = 1024;
    const height = 640;

    // --- Texture 0: NFC Business Card (SAJEC) ---
    const canvas0 = document.createElement('canvas');
    canvas0.width = width;
    canvas0.height = height;
    const ctx0 = canvas0.getContext('2d');
    
    // Background Dark Holographic Gradient
    const grad0 = ctx0.createLinearGradient(0, 0, width, height);
    grad0.addColorStop(0, '#0a0f1d');
    grad0.addColorStop(0.5, '#111827');
    grad0.addColorStop(1, '#05070c');
    ctx0.fillStyle = grad0;
    ctx0.fillRect(0, 0, width, height);

    // Holographic Accent Lines
    ctx0.strokeStyle = 'rgba(0, 242, 254, 0.15)';
    ctx0.lineWidth = 2;
    for (let i = -height; i < width; i += 40) {
      ctx0.beginPath();
      ctx0.moveTo(i, 0);
      ctx0.lineTo(i + height, height);
      ctx0.stroke();
    }

    // Avatar Circle
    ctx0.fillStyle = '#00F2FE';
    ctx0.beginPath();
    ctx0.arc(150, 240, 75, 0, Math.PI * 2);
    ctx0.fill();
    ctx0.fillStyle = '#05070c';
    ctx0.beginPath();
    ctx0.arc(150, 215, 30, 0, Math.PI * 2);
    ctx0.fill();
    ctx0.beginPath();
    ctx0.arc(150, 290, 50, 0, Math.PI);
    ctx0.fill();

    // Name & Subhead
    ctx0.fillStyle = '#FFFFFF';
    ctx0.font = '900 68px "Outfit", sans-serif';
    ctx0.fillText('SAJEC', 260, 220);

    ctx0.fillStyle = '#38BDF8';
    ctx0.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx0.fillText('Star Creations Vithura', 260, 275);

    // Phone & Contact Info
    ctx0.fillStyle = '#94A3B8';
    ctx0.font = '500 26px "Plus Jakarta Sans", sans-serif';
    ctx0.fillText('))) NFC Smart Identity', 150, 480);
    ctx0.fillText('+91 949 5152 850', 150, 525);

    // Right QR Badge
    ctx0.fillStyle = '#FFFFFF';
    ctx0.beginPath();
    ctx0.roundRect(700, 140, 240, 240, 24);
    ctx0.fill();

    // Simulated QR Blocks
    ctx0.fillStyle = '#05070c';
    ctx0.fillRect(730, 170, 60, 60);
    ctx0.fillRect(850, 170, 60, 60);
    ctx0.fillRect(730, 290, 60, 60);
    ctx0.fillRect(820, 260, 40, 40);
    ctx0.fillRect(870, 300, 30, 30);

    // Brand Logo Right Bottom
    ctx0.fillStyle = '#00F2FE';
    ctx0.font = '900 36px "Outfit", sans-serif';
    ctx0.fillText('CARDLY.IN', 720, 520);

    textures.push(new THREE.CanvasTexture(canvas0));

    // --- Texture 1: QR Restaurant Menu Card ---
    const canvas1 = document.createElement('canvas');
    canvas1.width = width;
    canvas1.height = height;
    const ctx1 = canvas1.getContext('2d');

    const grad1 = ctx1.createLinearGradient(0, 0, width, height);
    grad1.addColorStop(0, '#12100e');
    grad1.addColorStop(0.5, '#2b2318');
    grad1.addColorStop(1, '#0c0a08');
    ctx1.fillStyle = grad1;
    ctx1.fillRect(0, 0, width, height);

    // Gold Pattern
    ctx1.strokeStyle = 'rgba(234, 179, 8, 0.12)';
    ctx1.lineWidth = 1.5;
    for (let r = 50; r < 800; r += 70) {
      ctx1.beginPath();
      ctx1.arc(width / 2, height / 2, r, 0, Math.PI * 2);
      ctx1.stroke();
    }

    ctx1.fillStyle = '#EAB308';
    ctx1.font = '900 48px "Outfit", sans-serif';
    ctx1.fillText('✦ Chef\'s Special Menu', 100, 180);

    ctx1.fillStyle = '#FFFFFF';
    ctx1.font = '500 28px "Plus Jakarta Sans", sans-serif';
    ctx1.fillText('Tap or Scan QR code to view live digital menu', 100, 240);
    ctx1.fillText('Real-Time Prices & Daily Specials', 100, 290);

    // Gold QR Badge
    ctx1.fillStyle = '#EAB308';
    ctx1.beginPath();
    ctx1.roundRect(700, 140, 240, 240, 24);
    ctx1.fill();

    ctx1.fillStyle = '#0c0a08';
    ctx1.fillRect(730, 170, 60, 60);
    ctx1.fillRect(850, 170, 60, 60);
    ctx1.fillRect(730, 290, 60, 60);
    ctx1.fillRect(820, 260, 40, 40);

    ctx1.fillStyle = '#FDE047';
    ctx1.font = '900 36px "Outfit", sans-serif';
    ctx1.fillText('CARDLY.IN', 720, 520);

    textures.push(new THREE.CanvasTexture(canvas1));

    // --- Texture 2: Google Review Card ---
    const canvas2 = document.createElement('canvas');
    canvas2.width = width;
    canvas2.height = height;
    const ctx2 = canvas2.getContext('2d');

    const grad2 = ctx2.createLinearGradient(0, 0, width, height);
    grad2.addColorStop(0, '#0b1329');
    grad2.addColorStop(0.5, '#1e293b');
    grad2.addColorStop(1, '#0f172a');
    ctx2.fillStyle = grad2;
    ctx2.fillRect(0, 0, width, height);

    // 5-Star Crest
    ctx2.fillStyle = '#F59E0B';
    ctx2.font = '700 70px "Outfit", sans-serif';
    ctx2.fillText('★ 5.0 Instant Rating', 100, 180);

    ctx2.fillStyle = '#FFFFFF';
    ctx2.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx2.fillText('Tap to leave Google Business Review', 100, 250);

    ctx2.fillStyle = '#38BDF8';
    ctx2.font = '500 26px "Plus Jakarta Sans", sans-serif';
    ctx2.fillText('Boost local ranking & customer trust in 5 seconds', 100, 310);

    // White QR Badge
    ctx2.fillStyle = '#FFFFFF';
    ctx2.beginPath();
    ctx2.roundRect(700, 140, 240, 240, 24);
    ctx2.fill();

    ctx2.fillStyle = '#0f172a';
    ctx2.fillRect(730, 170, 60, 60);
    ctx2.fillRect(850, 170, 60, 60);
    ctx2.fillRect(730, 290, 60, 60);

    ctx2.fillStyle = '#38BDF8';
    ctx2.font = '900 36px "Outfit", sans-serif';
    ctx2.fillText('CARDLY.IN', 720, 520);

    textures.push(new THREE.CanvasTexture(canvas2));

    // --- Back Texture ---
    const canvasB = document.createElement('canvas');
    canvasB.width = width;
    canvasB.height = height;
    const ctxB = canvasB.getContext('2d');

    const gradB = ctxB.createLinearGradient(0, 0, width, height);
    gradB.addColorStop(0, '#05070c');
    gradB.addColorStop(1, '#0d111a');
    ctxB.fillStyle = gradB;
    ctxB.fillRect(0, 0, width, height);

    // NFC Symbol Center
    ctxB.strokeStyle = '#00F2FE';
    ctxB.lineWidth = 8;
    ctxB.beginPath();
    ctxB.arc(width / 2, height / 2 - 30, 80, -Math.PI / 3, Math.PI / 3);
    ctxB.stroke();
    ctxB.beginPath();
    ctxB.arc(width / 2, height / 2 - 30, 120, -Math.PI / 3, Math.PI / 3);
    ctxB.stroke();

    ctxB.fillStyle = '#FFFFFF';
    ctxB.font = '900 72px "Outfit", sans-serif';
    ctxB.textAlign = 'center';
    ctxB.fillText('CARDLY.IN', width / 2, height / 2 + 120);

    ctxB.fillStyle = '#94A3B8';
    ctxB.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctxB.fillText('DIGITAL IDENTITY & NFC SOLUTIONS', width / 2, height / 2 + 175);

    backTexture = new THREE.CanvasTexture(canvasB);
  }

  function build3DCardMesh() {
    cardGroup = new THREE.Group();

    // Custom Rounded Card Extrude Geometry
    const w = 3.3;
    const h = 2.05;
    const r = 0.22;
    const shape = new THREE.Shape();

    shape.moveTo(-w/2 + r, -h/2);
    shape.lineTo(w/2 - r, -h/2);
    shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
    shape.lineTo(w/2, h/2 - r);
    shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
    shape.lineTo(-w/2 + r, h/2);
    shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
    shape.lineTo(-w/2, -h/2 + r);
    shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);

    const extrudeSettings = {
      depth: 0.03,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Front & Back Materials
    const frontMat = new THREE.MeshStandardMaterial({
      map: textures[0],
      roughness: 0.25,
      metalness: 0.35,
      side: THREE.FrontSide
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.25,
      metalness: 0.35,
      side: THREE.FrontSide
    });

    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.8,
      roughness: 0.2
    });

    const frontMesh = new THREE.Mesh(geometry, frontMat);
    frontMesh.position.z = 0.001;

    const backMesh = new THREE.Mesh(geometry, backMat);
    backMesh.rotation.y = Math.PI;
    backMesh.position.z = -0.001;

    cardGroup.add(frontMesh);
    cardGroup.add(backMesh);

    cardGroup.rotation.x = currentRotation.x;
    cardGroup.rotation.y = currentRotation.y;

    scene.add(cardGroup);
  }

  function setupEventListeners(canvas, container) {
    window.addEventListener('resize', () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      updateCameraPosition();
      renderer.setSize(w, h);
    });

    // Pointer Interaction
    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging || !cardGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.008;
      targetRotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    // Card Switcher Buttons
    const switcherBtns = document.querySelectorAll('.index2-switcher-btn');
    switcherBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(btn.getAttribute('data-card'), 10);
        if (isNaN(index) || index < 0 || index >= textures.length) return;

        switcherBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        currentCardIndex = index;
        if (cardGroup && cardGroup.children[0]) {
          cardGroup.children[0].material.map = textures[index];
          cardGroup.children[0].material.needsUpdate = true;
        }

        // Trigger gentle spin
        targetRotation.y += Math.PI * 2;
      });
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    if (cardGroup) {
      if (!isDragging) {
        targetRotation.y += 0.004;
      }

      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

      cardGroup.rotation.x = currentRotation.x;
      cardGroup.rotation.y = currentRotation.y;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeStage);
  } else {
    initThreeStage();
  }
})();
