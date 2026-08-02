/**
 * CARDLY - THREE.JS 3D HERO CANVAS & CARD ANIMATION SYSTEM
 * Professional Physical NFC Card Layout across all 3 cards:
 * - Card 1: NFC Business Card (SAJEC / unnamed.jpg layout)
 * - Card 2: Luxury Black & Gold Restaurant QR Menu Card ("Chef's Special Menu")
 * - Card 3: Google 5-Star Review NFC Card
 * - Perfectly Aligned CARDLY.IN Logo (x: 940, y: 520) & Bottom NFC Bar across all cards
 * - 100% Opaque Cards with Printed CARDLY.IN Back Side Artwork
 * - True 3D Rounded Geometry Shape (THREE.ExtrudeGeometry)
 */

(function () {
  'use strict';

  let scene, camera, renderer, particlesMesh;
  let currentCardMesh = null;
  let activeCardIndex = 0; // 0: NFC Business Card, 1: QR Restaurant Menu, 2: Google Review Card
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let isDragging = false, previousMousePosition = { x: 0, y: 0 };
  let clock = new THREE.Clock();

  const container = document.getElementById('three-canvas-wrapper');
  const canvas = document.getElementById('three-canvas');

  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js or canvas element not found.');
    return;
  }

  // --- 3D Rounded Geometry Shape Generator ---
  function createRoundedCardGeometry(width, height, depth, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.018,
      bevelThickness: 0.006
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const pos = geometry.attributes.position;
    const uvs = geometry.attributes.uv;
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }
    
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;

    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) - minX) / rangeX;
      const v = (pos.getY(i) - minY) / rangeY;
      uvs.setXY(i, u, v);
    }
    uvs.needsUpdate = true;

    return geometry;
  }

  // Helper to draw rounded rectangle on 2D canvas texture
  function drawRoundRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle, strokeWidth) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = strokeWidth || 2;
      ctx.stroke();
    }
  }

  // Helper to draw QR Code Badge with Central NFC Wave Logo
  function drawQRCodeBadge(ctx, x, y, size, accentColor) {
    drawRoundRect(ctx, x, y, size, size, 20, '#FFFFFF', accentColor || null, accentColor ? 3 : 0);

    const pad = 16;
    const innerSize = size - pad * 2;
    const cellSize = innerSize / 15;

    ctx.fillStyle = '#000000';

    function drawFinder(fx, fy) {
      ctx.fillRect(x + pad + fx * cellSize, y + pad + fy * cellSize, 4.5 * cellSize, 4.5 * cellSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + pad + (fx + 0.8) * cellSize, y + pad + (fy + 0.8) * cellSize, 2.9 * cellSize, 2.9 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + pad + (fx + 1.5) * cellSize, y + pad + (fy + 1.5) * cellSize, 1.5 * cellSize, 1.5 * cellSize);
    }

    drawFinder(0, 0);
    drawFinder(10.5, 0);
    drawFinder(0, 10.5);

    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        if ((r < 5 && c < 5) || (r < 5 && c > 9) || (r > 9 && c < 5)) continue;
        if ((r > 5 && r < 9 && c > 5 && c < 9)) continue;
        if ((r + c * 3) % 2 === 0) {
          ctx.fillRect(x + pad + c * cellSize, y + pad + r * cellSize, cellSize * 0.9, cellSize * 0.9);
        }
      }
    }

    const centerX = x + size / 2;
    const centerY = y + size / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = accentColor || '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = accentColor || '#000000';
    ctx.lineWidth = 3;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX - 4, centerY, i * 5, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();
    }
  }

  // Draw 100% Opaque Solid Card Background with Organic Patterns
  function drawCardBackgroundWithCorners(ctx, width, height, type, radius) {
    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(0, 0, width, height, radius);
    } else {
      ctx.rect(0, 0, width, height);
    }
    ctx.clip();

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (type === 'nfc') {
      gradient.addColorStop(0, '#1c1c22');
      gradient.addColorStop(0.5, '#26262e');
      gradient.addColorStop(1, '#141418');
    } else if (type === 'menu') {
      gradient.addColorStop(0, '#0c0c0e');
      gradient.addColorStop(0.5, '#16161a');
      gradient.addColorStop(1, '#08080a');
    } else {
      gradient.addColorStop(0, '#111827');
      gradient.addColorStop(0.5, '#1F2937');
      gradient.addColorStop(1, '#0d1117');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (type === 'menu') {
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.08)';
      ctx.lineWidth = 1.5;
      for (let i = -width; i < width * 2; i += 36) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.bezierCurveTo(i + 220, height * 0.35, i - 120, height * 0.75, i + 320, height);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = -width + 18; i < width * 2; i += 36) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.bezierCurveTo(i + 180, height * 0.45, i - 80, height * 0.65, i + 280, height);
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1.5;
      for (let i = -width; i < width * 2; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.bezierCurveTo(i + 200, height * 0.4, i - 100, height * 0.7, i + 300, height);
        ctx.stroke();
      }
    }
  }

  // --- Dynamic FRONT Canvas Textures Generator ---
  function createCardTexture(type) {
    const canvasTex = document.createElement('canvas');
    canvasTex.width = 1024;
    canvasTex.height = 600;
    const ctx = canvasTex.getContext('2d');

    const cornerRadius = 60;
    drawCardBackgroundWithCorners(ctx, 1024, 600, type, cornerRadius);

    if (type === 'nfc') {
      // ==========================================
      // CARD 1: NFC BUSINESS CARD (unnamed.jpg)
      // ==========================================
      drawRoundRect(ctx, 16, 16, 992, 568, cornerRadius - 8, null, 'rgba(255, 255, 255, 0.15)', 3);

      const avatarX = 140;
      const avatarY = 240;
      const avatarRadius = 80;

      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius + 5, 0, Math.PI * 2);
      ctx.fillStyle = '#E2E8F0';
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.clip();
      
      const avatarGrad = ctx.createLinearGradient(avatarX - 80, avatarY - 80, avatarX + 80, avatarY + 80);
      avatarGrad.addColorStop(0, '#fef08a');
      avatarGrad.addColorStop(0.5, '#eab308');
      avatarGrad.addColorStop(1, '#ca8a04');
      ctx.fillStyle = avatarGrad;
      ctx.fillRect(avatarX - 80, avatarY - 80, 160, 160);

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(avatarX, avatarY - 18, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY + 70, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 54px "Outfit", sans-serif';
      ctx.fillText('SAJEC', 250, 225, 450);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Star Creations Vithura', 250, 275, 450);

      drawQRCodeBadge(ctx, 730, 150, 210, null);

      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 5;
      const nfcX = 75;
      const nfcY = 510;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(nfcX, nfcY, i * 10, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
      }

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '600 30px "Space Mono", monospace';
      ctx.fillText('+91 949 5152 850', 125, 520);

      ctx.fillStyle = '#F97316';
      ctx.font = '800 32px "Outfit", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('CARDLY.IN', 940, 520);
      ctx.textAlign = 'left';

      ctx.restore();

    } else if (type === 'menu') {
      // ==========================================
      // CARD 2: LUXURY BLACK & GOLD RESTAURANT QR MENU
      // ==========================================
      drawRoundRect(ctx, 16, 16, 992, 568, cornerRadius - 8, null, 'rgba(234, 179, 8, 0.65)', 3);

      const iconX = 140;
      const iconY = 240;
      ctx.beginPath();
      ctx.arc(iconX, iconY, 80, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.18)';
      ctx.fill();
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#EAB308';
      ctx.font = 'bold 56px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍽️', iconX, iconY + 18);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 46px "Outfit", sans-serif';
      ctx.fillText('LUMINA BISTRO', 250, 225, 450);

      ctx.fillStyle = '#FEF08A';
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Gourmet QR Menu & Bar', 250, 275, 450);

      drawRoundRect(ctx, 70, 345, 610, 120, 16, 'rgba(255, 255, 255, 0.04)', 'rgba(234, 179, 8, 0.3)', 2);

      // CHEF'S SPECIAL MENU (Tasting removed)
      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('✦ Chef\'s Special Menu', 95, 390, 560);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('• Craft Cocktails  • Vegan Options  • Live Pricing', 95, 430, 560);

      drawQRCodeBadge(ctx, 730, 150, 210, '#EAB308');

      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 5;
      const nfcX = 75;
      const nfcY = 510;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(nfcX, nfcY, i * 10, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
      }

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '600 28px "Space Mono", monospace';
      ctx.fillText('TAP / SCAN FOR MENU', 125, 520);

      ctx.fillStyle = '#EAB308';
      ctx.font = '800 32px "Outfit", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('CARDLY.IN', 940, 520);
      ctx.textAlign = 'left';

      ctx.restore();

    } else if (type === 'review') {
      // ==========================================
      // CARD 3: GOOGLE 5-STAR REVIEW NFC CARD
      // ==========================================
      drawRoundRect(ctx, 16, 16, 992, 568, cornerRadius - 8, null, 'rgba(245, 158, 11, 0.65)', 3);

      const iconX = 140;
      const iconY = 240;
      ctx.beginPath();
      ctx.arc(iconX, iconY, 80, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 44px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ 5.0', iconX, iconY + 16);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 46px "Outfit", sans-serif';
      ctx.fillText('GOOGLE REVIEWS', 250, 225, 450);

      ctx.fillStyle = '#F59E0B';
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Instant 5-Star Feedback', 250, 275, 450);

      drawRoundRect(ctx, 70, 345, 610, 120, 16, 'rgba(245, 158, 11, 0.12)', '#F59E0B', 2);

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('★ ★ ★ ★ ★  BOOST GOOGLE RATING', 95, 390, 560);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('• Tap phone to open Google Review page instantly', 95, 430, 560);

      drawQRCodeBadge(ctx, 730, 150, 210, '#F59E0B');

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 5;
      const nfcX = 75;
      const nfcY = 510;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(nfcX, nfcY, i * 10, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
      }

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '600 28px "Space Mono", monospace';
      ctx.fillText('TAP / SCAN TO REVIEW', 125, 520);

      ctx.fillStyle = '#F59E0B';
      ctx.font = '800 32px "Outfit", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('CARDLY.IN', 940, 520);
      ctx.textAlign = 'left';

      ctx.restore();
    }

    return new THREE.CanvasTexture(canvasTex);
  }

  // --- Dynamic BACK Canvas Texture Generator ---
  function createBackCardTexture(type) {
    const canvasTex = document.createElement('canvas');
    canvasTex.width = 1024;
    canvasTex.height = 600;
    const ctx = canvasTex.getContext('2d');

    const cornerRadius = 60;
    drawCardBackgroundWithCorners(ctx, 1024, 600, type, cornerRadius);

    const borderColor = type === 'menu' ? 'rgba(234, 179, 8, 0.65)' : (type === 'review' ? 'rgba(245, 158, 11, 0.65)' : 'rgba(255, 255, 255, 0.15)');
    drawRoundRect(ctx, 16, 16, 992, 568, cornerRadius - 8, null, borderColor, 3);

    const centerX = 512;
    const centerY = 240;
    ctx.strokeStyle = type === 'menu' ? '#EAB308' : (type === 'review' ? '#F59E0B' : '#38BDF8');
    ctx.lineWidth = 7;
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(centerX - 10, centerY, i * 16, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();
    }

    ctx.fillStyle = type === 'menu' ? '#EAB308' : (type === 'review' ? '#F59E0B' : '#F97316');
    ctx.font = 'bold 72px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CARDLY.IN', 512, 380);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DIGITAL IDENTITY & NFC SOLUTIONS', 512, 435);

    ctx.textAlign = 'left';
    ctx.restore();

    return new THREE.CanvasTexture(canvasTex);
  }

  // --- 3D Card Mesh Creation ---
  function createCardMesh(type) {
    const cardGroup = new THREE.Group();

    const width = 3.6;
    const height = 2.15;
    const depth = 0.03;
    const radius = 0.24;

    const geometry = createRoundedCardGeometry(width, height, depth, radius);

    const frontTexture = createCardTexture(type);
    frontTexture.anisotropy = 16;

    const backTexture = createBackCardTexture(type);
    backTexture.anisotropy = 16;

    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.12,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95,
      transparent: false,
      opacity: 1.0,
      side: THREE.FrontSide
    });

    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.15,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95,
      transparent: false,
      opacity: 1.0,
      side: THREE.FrontSide
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: type === 'menu' ? 0xEAB308 : (type === 'review' ? 0xF59E0B : 0x38BDF8),
      roughness: 0.25,
      metalness: 0.85,
      emissive: type === 'menu' ? 0x854D0E : (type === 'review' ? 0x78350F : 0x0284C7),
      emissiveIntensity: 0.4
    });

    const frontMesh = new THREE.Mesh(geometry, [frontMaterial, edgeMaterial]);
    frontMesh.position.z = 0.001;
    cardGroup.add(frontMesh);

    const backMesh = new THREE.Mesh(geometry, [backMaterial, edgeMaterial]);
    backMesh.rotation.y = Math.PI;
    backMesh.position.z = -0.001;
    cardGroup.add(backMesh);

    const wireframeGeo = new THREE.EdgesGeometry(geometry, 20);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: type === 'menu' ? 0xEAB308 : (type === 'review' ? 0xF59E0B : 0x38BDF8),
      linewidth: 2,
      transparent: true,
      opacity: 0.65
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    cardGroup.add(wireframe);

    return cardGroup;
  }

  // --- Initialize Three.js Scene ---
  function initThree() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const cyanSpotlight = new THREE.SpotLight(0x38BDF8, 3.2);
    cyanSpotlight.position.set(5, 5, 5);
    cyanSpotlight.castShadow = true;
    scene.add(cyanSpotlight);

    const goldSpotlight = new THREE.SpotLight(0xEAB308, 3.2);
    goldSpotlight.position.set(-5, -3, 4);
    scene.add(goldSpotlight);

    const whiteLight = new THREE.DirectionalLight(0xffffff, 1.25);
    whiteLight.position.set(0, 4, 6);
    scene.add(whiteLight);

    const particlesCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 8 - 2;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    loadCard(0);
    setupEvents();
    animate();
  }

  function loadCard(index) {
    activeCardIndex = index;
    const types = ['nfc', 'menu', 'review'];

    if (currentCardMesh) {
      const oldMesh = currentCardMesh;
      let scale = 1;
      const fadeOut = setInterval(() => {
        scale -= 0.15;
        if (scale <= 0) {
          clearInterval(fadeOut);
          scene.remove(oldMesh);
        } else {
          oldMesh.scale.set(scale, scale, scale);
        }
      }, 20);
    }

    setTimeout(() => {
      currentCardMesh = createCardMesh(types[index]);
      currentCardMesh.scale.set(0.01, 0.01, 0.01);
      scene.add(currentCardMesh);

      let scale = 0.01;
      const fadeIn = setInterval(() => {
        scale += 0.1;
        if (scale >= 1) {
          scale = 1;
          clearInterval(fadeIn);
        }
        currentCardMesh.scale.set(scale, scale, scale);
      }, 20);
    }, 150);
  }

  function setupEvents() {
    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
    });

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !currentCardMesh) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      currentCardMesh.rotation.y += deltaX * 0.01;
      currentCardMesh.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !currentCardMesh || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      currentCardMesh.rotation.y += deltaX * 0.01;
      currentCardMesh.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    const switcherBtns = document.querySelectorAll('.switcher-btn');
    switcherBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        switcherBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadCard(idx);
      });
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (currentCardMesh && !isDragging) {
      currentCardMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
      
      targetRotationY = Math.sin(elapsedTime * 0.6) * 0.3 + (mouseX * 0.4);
      targetRotationX = Math.cos(elapsedTime * 0.6) * 0.15 - (mouseY * 0.3);

      currentCardMesh.rotation.y += (targetRotationY - currentCardMesh.rotation.y) * 0.05;
      currentCardMesh.rotation.x += (targetRotationX - currentCardMesh.rotation.x) * 0.05;
    }

    if (particlesMesh) {
      particlesMesh.rotation.y = elapsedTime * 0.03;
      particlesMesh.rotation.x = elapsedTime * 0.02;
    }

    renderer.render(scene, camera);
  }

  document.addEventListener('DOMContentLoaded', initThree);
})();
