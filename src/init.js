import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as dat from 'lil-gui';

const init = () => {
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	const parameters = {
		color: 0xffffff,
	};

	const scene = new THREE.Scene();
	const canvas = document.querySelector('.canvas');
	const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height);
	camera.position.set(0, 1.5, 10);

	const gui = new dat.GUI({ closeFolders: true });

	scene.add(camera);

	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;
	controls.enablePan = false;
	controls.minDistance = 2;
	controls.maxDistance = 5;
	controls.minPolarAngle = 1;
	controls.maxPolarAngle = 1.5;
	controls.autoRotate = false;
	controls.target.set(1, 1.5, -1);
	controls.minAzimuthAngle = -Math.PI / 2;
	controls.maxAzimuthAngle = Math.PI / 20;

	controls.update();

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.toneMapping = THREE.ReinhardToneMapping;
	renderer.toneMappingExposure = 2.1;

	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0xffffff);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.render(scene, camera);

	return {
		sizes,
		gui,
		parameters,
		scene,
		canvas,
		camera,
		renderer,
		controls,
	};
};

export default init;
