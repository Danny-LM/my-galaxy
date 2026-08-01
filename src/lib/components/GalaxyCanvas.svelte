<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import type { PlanetData } from "../data/words";

    interface Props {
        words: string[];
        planets: PlanetData[];
        randomNum: number;
        onSelectPlanet: (planet: PlanetData) => void;
    }

    let { words, planets, onSelectPlanet, randomNum }: Props = $props();

    let containerRef: HTMLDivElement;
    let animationFrameId: number;

    // 3D
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;

    let sunMesh: THREE.Mesh;
    let planetMeshes: { mesh: THREE.Mesh; data: PlanetData; angle: number }[] = [];
    let wordSprites: { sprite: THREE.Sprite; angle: number; radius: number; speed: number; yOffset: number }[] = [];

    // Raycaster for planets
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function createTextTexture(text: string): THREE.CanvasTexture {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = 256;
        canvas.height = 64;

        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "Bold 24px system-ui, sans-serif";
        ctx.fillStyle = "#f472b6";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#ec4899";
        ctx.shadowBlur = 8;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createHeartAlphaTexture(): THREE.CanvasTexture {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d")!;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(256, 160);
        ctx.bezierCurveTo(256, 120, 220, 80, 150, 80);
        ctx.bezierCurveTo(40, 80, 40, 220, 40, 220);
        ctx.bezierCurveTo(40, 310, 150, 390, 256, 460);
        ctx.bezierCurveTo(360, 390, 472, 310, 472, 220);
        ctx.bezierCurveTo(472, 220, 472, 80, 360, 80);
        ctx.bezierCurveTo(290, 80, 256, 120, 256, 160);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createGlowTexture(): THREE.CanvasTexture {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d")!;
        const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
        grad.addColorStop(0, "rgba(244, 63, 94, 0.7)");
        grad.addColorStop(1, "rgba(244, 63, 94, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createCardTexture(): THREE.CanvasTexture {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 160;
        const ctx = canvas.getContext("2d")!;

        ctx.fillStyle = "#ffe4e6"; 
        ctx.fillRect(0, 0, 256, 160);
        
        ctx.strokeStyle = "#fda4af"; 
        ctx.lineWidth = 8;
        ctx.strokeRect(0, 0, 256, 160);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(128, 80);
        ctx.lineTo(256, 0);
        ctx.stroke();
        
        ctx.fillStyle = "#e11d48";
        ctx.font = "bold 40px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("♥", 128, 80);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    onMount(() => {
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x05020a, 0.02);

        camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // camera.position.set(0, 10, 25);
        camera.position.set(0, 8, 22);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 50;
        controls.minDistance = 5;
        controls.target.set(0, 0, 0);
        controls.update();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xf43f5e, 3, 50);
        pointLight.position.set(0, 0, 0);
        scene.add(pointLight);

        const textureLoader = new THREE.TextureLoader();
        
        const randomImgPath = `./images/may${randomNum}.png`;
        const sunTexture = textureLoader.load(randomImgPath);
        const heartAlpha = createHeartAlphaTexture();

        const sunGeometry = new THREE.PlaneGeometry(6, 6);
        const sunMaterial = new THREE.MeshBasicMaterial({
            map: sunTexture,
            alphaMap: heartAlpha,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
        });

        sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sunMesh);

        const glowMaterial = new THREE.SpriteMaterial({
            map: createGlowTexture(),
            transparent: true,
            depthWrite: false,
        });
        const glowSprite = new THREE.Sprite(glowMaterial);
        glowSprite.scale.set(7, 7, 1);
        glowSprite.position.z = -0.5;
        sunMesh.add(glowSprite);

        // const haloGeo = new THREE.RingGeometry(2.1, 2.6, 32);
        // const haloMat = new THREE.MeshBasicMaterial({
        //     color: 0xf43f5e,
        //     side: THREE.DoubleSide,
        //     transparent: true,
        //     opacity: 0.6,
        // });
        // const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        // sunMesh.add(haloMesh);

        planets.forEach((p, index) => {
            const cardTexture = createCardTexture();
            const pGeo = new THREE.PlaneGeometry(2, 1.25);
            const pMat = new THREE.MeshBasicMaterial({
                map: cardTexture,
                side: THREE.DoubleSide,
                transparent: true,
            });

            // const pGeo = new THREE.SphereGeometry(0.8, 32, 32);
            // const pMat = new THREE.MeshStandardMaterial({
            //     color: 0xec4899,
            //     emissive: 0x831843,
            //     roughness: 0.3,
            //     metalness: 0.8,
            // });

            const mesh = new THREE.Mesh(pGeo, pMat);
            mesh.userData = p;

            const ringGeo = new THREE.RingGeometry(p.orbitRadius - 0.05, p.orbitRadius + 0.05, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0xf472b6,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.2,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            scene.add(ring);

            const angle = (index / planets.length) * Math.PI * 2;
            scene.add(mesh);

            planetMeshes.push({ mesh, data: p, angle });
        });

        words.forEach((word) => {
            const texture = createTextTexture(word);
            const spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
            });
            const sprite = new THREE.Sprite(spriteMaterial);

            const radius = 6 + Math.random() * 16;
            const angle = Math.random() * Math.PI * 2;
            const yOffset = (Math.random() - 0.5) * 8;
            const speed = (0.002 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1);

            sprite.scale.set(4, 1, 1);
            scene.add(sprite);

            wordSprites.push({ sprite, angle, radius, speed, yOffset });
        });

        const particlesCount = 300;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 80;
        }
        const particlesGeo = new THREE.BufferGeometry();
        particlesGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        const particlesMat = new THREE.PointsMaterial({
            size: 0.15,
            color: 0xfbcfe8,
            transparent: true,
            opacity: 0.8,
        });
        const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particlesMesh);

        let time = 0;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            time += 0.01;

            if (sunMesh) {
                sunMesh.lookAt(camera.position);
                const scale = 1 + Math.sin(time * 3) * 0.05;
                sunMesh.scale.set(scale, scale, scale);
            }

            planetMeshes.forEach((item) => {
                item.angle += item.data.speed;
                item.mesh.position.x = Math.cos(item.angle) * item.data.orbitRadius;
                item.mesh.position.z = Math.sin(item.angle) * item.data.orbitRadius;
                item.mesh.lookAt(camera.position);
                // item.mesh.rotation.y += 0.01;
            });

            wordSprites.forEach((item) => {
                item.angle += item.speed;
                item.sprite.position.x = Math.cos(item.angle) * item.radius;
                item.sprite.position.z = Math.sin(item.angle) * item.radius;
                item.sprite.position.y = item.yOffset + Math.sin(time + item.angle) * 0.5;
            });

            controls.update();
            renderer.render(scene, camera);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        handleResize();
        animate();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });
 
    onDestroy(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer) renderer.dispose();
    });

    function handlePointerDown(event: MouseEvent | TouchEvent) {
        let clientX = 0;
        let clientY = 0;

        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }

        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
            planetMeshes.map((p) => p.mesh)
        );

        if (intersects.length > 0) {
            const clickedPlanet = intersects[0].object.userData as PlanetData;
            onSelectPlanet(clickedPlanet);
        }
    }
</script>

<div
    bind:this={containerRef}
    onpointerdown={handlePointerDown}
    class="w-full h-screen cursor-grab active:cursor-grabbing overflow-hidden"
    role="presentation"
></div>
