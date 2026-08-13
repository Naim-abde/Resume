(function () {
  var hero = document.getElementById("hero-canvas");
  if (!hero || typeof THREE === "undefined") return;

  var parent = hero.parentElement;
  var isMobile = window.innerWidth < 768;
  var count = isMobile ? 700 : 1800;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  var renderer = new THREE.WebGLRenderer({
    canvas: hero,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var group = new THREE.Group();
  scene.add(group);

  // Particle cloud (terracotta -> amber -> olive)
  var geometry = new THREE.BufferGeometry();
  var positions = new Float32Array(count * 3);
  var base = new Float32Array(count);
  var colors = new Float32Array(count * 3);
  var c1 = new THREE.Color("#b5512e");
  var c2 = new THREE.Color("#b9791f");
  var c3 = new THREE.Color("#6f7d4f");

  for (var i = 0; i < count; i++) {
    var i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 16;
    positions[i3 + 1] = (Math.random() - 0.5) * 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 6;
    base[i] = Math.random() * Math.PI * 2;

    var t = Math.random();
    var col = c1.clone();
    if (t < 0.5) col.lerp(c3, t * 2);
    else col = c2.clone().lerp(c1, (t - 0.5) * 2);
    colors[i3] = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  var pMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.07 : 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  });
  var points = new THREE.Points(geometry, pMaterial);
  group.add(points);

  // Central wireframe shapes
  var knotGeo = new THREE.TorusKnotGeometry(2.6, 0.75, 140, 18);
  var knotMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#b5512e"),
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  var knot = new THREE.Mesh(knotGeo, knotMat);
  group.add(knot);

  var ringGeo = new THREE.RingGeometry(3.6, 3.75, 90);
  var ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#b9791f"),
    wireframe: true,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide
  });
  var ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  // Mouse parallax
  var mouse = { x: 0, y: 0 };
  var smooth = { x: 0, y: 0 };
  window.addEventListener("mousemove", function (e) {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    var w = parent.offsetWidth;
    var h = parent.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  var clock = new THREE.Clock();
  var posAttr = geometry.attributes.position;
  var running = true;

  function animate() {
    requestAnimationFrame(animate);
    if (!running) return;

    var t = clock.getElapsedTime();

    // Gentle wave drift on particles
    var arr = posAttr.array;
    for (var i = 0; i < count; i++) {
      var i3 = i * 3;
      arr[i3 + 1] += Math.sin(t * 0.6 + base[i]) * 0.0004;
    }
    posAttr.needsUpdate = true;

    knot.rotation.x = t * 0.18;
    knot.rotation.y = t * 0.12;
    ring.rotation.z = t * 0.08;
    points.rotation.y = t * 0.03;

    smooth.x += (mouse.x - smooth.x) * 0.05;
    smooth.y += (mouse.y - smooth.y) * 0.05;
    camera.position.x = smooth.x * 0.9;
    camera.position.y = -smooth.y * 0.7;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  // Slow down when tab hidden
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
  });
})();
