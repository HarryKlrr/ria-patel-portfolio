// Interactive viewer for STL models (e.g. parts exported from SolidWorks).
// Usage: <div class="viewer" data-stl="models/part.stl" data-title="Part name"></div>
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.viewer[data-stl]').forEach((host) => {
  host.classList.add('viewer--stl');
  host.setAttribute('role', 'img');
  host.setAttribute('aria-label', host.dataset.title || '3D model');
  host.innerHTML = '<div class="viewer__status">Loading 3D model…</div>';

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;          // turned on by clicking, so the page still scrolls
  controls.autoRotate = !reduced;
  controls.autoRotateSpeed = 1.2;

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
  resize();

  let home;
  new STLLoader().load(host.dataset.stl, (geometry) => {
    geometry.computeVertexNormals();
    geometry.center();

    // lay the part along its longest axis, horizontally
    geometry.computeBoundingBox();
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    if (size.y >= size.x && size.y >= size.z) geometry.rotateZ(Math.PI / 2);
    else if (size.z >= size.x && size.z >= size.y) geometry.rotateY(Math.PI / 2);
    geometry.computeBoundingSphere();
    const r = geometry.boundingSphere.radius;

    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      color: 0xc8ccd2, metalness: 0.85, roughness: 0.28,
    }));
    scene.add(mesh);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(1, 1.5, 1);
    scene.add(key);

    const dist = r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.72;
    camera.near = r / 100; camera.far = r * 100;
    camera.position.set(dist * 0.55, dist * 0.35, dist * 0.75);
    camera.updateProjectionMatrix();
    controls.minDistance = r * 0.6;
    controls.maxDistance = dist * 3;
    home = camera.position.clone();
    host.querySelector('.viewer__status').remove();
  }, undefined, () => {
    host.querySelector('.viewer__status').textContent = 'The 3D model couldn’t load. Refresh the page to try again.';
  });

  // click to enable zoom; leaving the model hands scrolling back to the page
  const hint = document.createElement('div');
  hint.className = 'viewer__hint';
  hint.textContent = 'Drag to rotate · click to zoom';
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'viewer__reset';
  reset.textContent = 'Reset view';
  host.append(hint, reset);

  renderer.domElement.addEventListener('pointerdown', () => {
    controls.autoRotate = false;
    controls.enableZoom = true;
    hint.textContent = 'Drag to rotate · scroll to zoom';
  });
  host.addEventListener('mouseleave', () => {
    controls.enableZoom = false;
    hint.textContent = 'Drag to rotate · click to zoom';
  });
  reset.addEventListener('click', () => {
    if (!home) return;
    camera.position.copy(home);
    controls.target.set(0, 0, 0);
    controls.autoRotate = !reduced;
  });

  // only draw while the viewer is on screen
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(host);
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    controls.update();
    renderer.render(scene, camera);
  });
});
