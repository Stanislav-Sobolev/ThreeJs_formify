import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import init from './init';
import './style.css';

const { sizes, camera, gui, parameters, scene, canvas, controls, renderer } =
	init();

camera.position.set(-1, 1, 2);

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);

const groundMaterial = new THREE.MeshStandardMaterial({
	color: parameters.color,
	wireframe: false,
});

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;

const spotLight = new THREE.SpotLight(0xffffff, 40, 6, 15);
spotLight.position.set(0, 4, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 1024 * 4;
spotLight.shadow.mapSize.height = 1024 * 4;

scene.add(spotLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 4);
scene.add(hemiLight);

gui.addColor(parameters, 'color')
	.name('Floor color')
	.onChange(() => groundMaterial.color.set(parameters.color));

const loader = new GLTFLoader().setPath('kitchen_cabinets/');

loader.load(
	'scene1.gltf',
	(gltf) => {
		const mesh = gltf.scene;
		mesh.scale.set(0.03, 0.03, 0.03);

		const sinkMesh = mesh.children.find((el) => el.name === 'sink');
		const topMesh = mesh.children.find((el) => el.name === 'top');
		const shelvesMesh = mesh.children.find((el) => el.name === 'shelves');

		if (topMesh) topMesh.visible = false;

		if (shelvesMesh)
			gui.add({ amount: 1 }, 'amount')
				.min(0)
				.max(3)
				.step(1)
				.name('Amount shelves')
				.onChange((value) => {
					shelvesMesh.children.forEach((shelfData, index) => {
						if (index < value) {
							shelfData.visible = true;
						} else {
							shelfData.visible = false;
						}
					});
				});

		if (sinkMesh)
			gui.add(sinkMesh, 'visible')
				.name('sink')
				.onChange((value) => {
					topMesh.visible = !value;
				});

		const woodTexture = [];

		mesh.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;

				if (child.material.map) {
					if (
						child.material.map.name === 'Wood09-basecolor_baseColor'
					) {
						woodTexture.push(child.material.map);
					}
					child.material.map.anisotropy = 16;
				}
			}
		});
		const woodOriginalTexture = new THREE.TextureLoader().load(
			'kitchen_cabinets/Wood09-basecolor_baseColor.jpg',
		);
		const woodLightTexture = new THREE.TextureLoader().load(
			'kitchen_cabinets/Wood_light-basecolor_baseColor.jpg',
		);
		const woodBlueTexture = new THREE.TextureLoader().load(
			'kitchen_cabinets/Wood_blue-basecolor_baseColor.jpg',
		);

		gui.add({ amount: 1 }, 'amount')
			.min(1)
			.max(3)
			.step(1)
			.name('Color')
			.onChange((value) => {
				woodTexture.forEach((woodData) => {
					switch (value) {
						case 1:
							woodData.image = woodOriginalTexture.image;
							woodData.needsUpdate = true;
							break;

						case 2:
							woodData.image = woodLightTexture.image;
							woodData.needsUpdate = true;
							break;

						case 3:
							woodData.image = woodBlueTexture.image;
							woodData.needsUpdate = true;
							break;

						default:
							woodData.image = woodOriginalTexture.image;
							woodData.needsUpdate = true;
							break;
					}
				});
			});

		mesh.position.set(0, 0, -1);
		scene.add(mesh);

		document.getElementById('progress-container').style.display = 'none';
	},
	(xhr) => {
		document.getElementById('progress').innerHTML = `LOADING ${
			Math.max(xhr.loaded / xhr.total, 1) * 100
		}/100`;
	},
);

scene.add(groundMesh);

const tick = () => {
	controls.update();

	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};
camera.position.set(-2, 0, 4);
tick();

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
