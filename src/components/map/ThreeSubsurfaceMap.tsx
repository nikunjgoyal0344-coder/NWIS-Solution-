import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Well, Formation, DrillingIncident } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ThreeSubsurfaceMapProps {
  wells: Well[];
  activeWell: Well;
  formations: Formation[];
  incidents: DrillingIncident[];
  radiusKm: number;
  inspectedDepth: number; // Interactive depth navigator
  showTrajectories: boolean;
  showFormations: boolean;
  showIncidents: boolean;
  showTerrain: boolean;
  is2DView: boolean;
  onSelectWell: (well: Well) => void;
}

export const ThreeSubsurfaceMap: React.FC<ThreeSubsurfaceMapProps> = ({
  wells,
  activeWell,
  formations,
  incidents,
  radiusKm,
  inspectedDepth,
  showTrajectories,
  showFormations,
  showIncidents,
  showTerrain,
  is2DView,
  onSelectWell,
}) => {
  const { isDark } = useTheme();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const depthSliceMeshRef = useRef<THREE.Mesh | null>(null);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraDistanceRef = useRef(75);
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3 });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0F172A : 0xF1F5F9);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(50, 80, 50);
    scene.add(dirLight);

    rebuildScene();

    const animate = () => {
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    if (is2DView) {
      cameraAngleRef.current = { theta: 0, phi: 0.001 };
      cameraDistanceRef.current = 80;
    } else {
      cameraAngleRef.current = { theta: Math.PI / 4, phi: Math.PI / 3 };
      cameraDistanceRef.current = 75;
    }
    updateCameraPosition();
  }, [is2DView]);

  useEffect(() => {
    rebuildScene();
  }, [wells, activeWell, formations, incidents, radiusKm, inspectedDepth, showTrajectories, showFormations, showIncidents, showTerrain, isDark]);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    const { theta, phi } = cameraAngleRef.current;
    const d = cameraDistanceRef.current;

    camera.position.x = d * Math.sin(phi) * Math.sin(theta);
    camera.position.y = d * Math.cos(phi);
    camera.position.z = d * Math.sin(phi) * Math.cos(theta);
    camera.lookAt(0, -15, 0);
  };

  const rebuildScene = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Dynamically set scene background based on theme (Deep Charcoal in dark theme)
    scene.background = new THREE.Color(isDark ? 0x0F172A : 0xF1F5F9);

    const objectsToRemove: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.GridHelper || child instanceof THREE.Group) {
        objectsToRemove.push(child);
      }
    });
    objectsToRemove.forEach((obj) => scene.remove(obj));

    const depthScale = 0.01;
    const xyScale = 0.0035;

    // 1. Ground Surface Grid
    if (showTerrain) {
      const grid = new THREE.GridHelper(100, 20, isDark ? 0x334155 : 0x94A3B8, isDark ? 0x1E293B : 0xCBD5E1);
      grid.position.y = 0;
      scene.add(grid);

      const ringGeometry = new THREE.RingGeometry(radiusKm * 3.5 - 0.2, radiusKm * 3.5 + 0.2, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x3B82F6, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.05;
      scene.add(ringMesh);
    }

    // 2. 3D VERTICAL DEPTH RULER PILLAR
    const depthRulerGroup = new THREE.Group();
    const rulerX = -32;
    const rulerZ = -32;
    const totalDepthY = -36.5;

    const rulerSpineGeo = new THREE.CylinderGeometry(0.2, 0.2, Math.abs(totalDepthY), 8);
    const rulerSpineMat = new THREE.MeshBasicMaterial({ color: 0x64748B });
    const rulerSpine = new THREE.Mesh(rulerSpineGeo, rulerSpineMat);
    rulerSpine.position.set(rulerX, totalDepthY / 2, rulerZ);
    depthRulerGroup.add(rulerSpine);

    const depthMarkers = [0, 500, 1000, 1500, 2000, 2500, 2835, 3000, 3650];
    depthMarkers.forEach((depth) => {
      const tickY = -depth * depthScale;
      const isBit = depth === 2835;

      const tickGeo = new THREE.BoxGeometry(isBit ? 3.5 : 2.0, 0.15, 0.3);
      const tickMat = new THREE.MeshBasicMaterial({ color: isBit ? 0x16A34A : 0x475569 });
      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.set(rulerX + (isBit ? 1.5 : 0.8), tickY, rulerZ);
      depthRulerGroup.add(tick);
    });
    scene.add(depthRulerGroup);

    // 3. DYNAMIC INTERACTIVE DEPTH SLICE PLANE & RING
    const currentSliceY = -inspectedDepth * depthScale;
    const isAtHazard = inspectedDepth >= 2840 && inspectedDepth <= 2865;

    const sliceRingGeo = new THREE.RingGeometry(22, 22.4, 64);
    const sliceRingMat = new THREE.MeshBasicMaterial({
      color: isAtHazard ? 0xDC2626 : 0x2563EB,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const sliceRing = new THREE.Mesh(sliceRingGeo, sliceRingMat);
    sliceRing.rotation.x = Math.PI / 2;
    sliceRing.position.set(0, currentSliceY, 0);
    scene.add(sliceRing);

    // Subtle horizontal slice plane sheet
    const slicePlaneGeo = new THREE.PlaneGeometry(70, 70);
    const slicePlaneMat = new THREE.MeshBasicMaterial({
      color: isAtHazard ? 0xEF4444 : 0x3B82F6,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const slicePlane = new THREE.Mesh(slicePlaneGeo, slicePlaneMat);
    slicePlane.rotation.x = Math.PI / 2;
    slicePlane.position.set(0, currentSliceY, 0);
    scene.add(slicePlane);

    // 4. Stratigraphic Horizons
    if (showFormations) {
      formations.slice(2, 5).forEach((formation, idx) => {
        const horizonDepth = -formation.topDepth * depthScale;
        const horizonGeo = new THREE.PlaneGeometry(80, 80);
        
        const horizonColor = idx === 0 ? 0xE2E8F0 : idx === 1 ? 0xCBD5E1 : 0x94A3B8;
        const horizonMat = new THREE.MeshLambertMaterial({
          color: horizonColor,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
        horizonMesh.rotation.x = Math.PI / 2;
        horizonMesh.position.y = horizonDepth;
        scene.add(horizonMesh);
      });
    }

    // 5. Wells & Trajectories
    const visibleWells = wells.filter(w => {
      if (w.id === activeWell.id) return true;
      if ((w as any).isUploaded) return true; // Always display uploaded scanned sites
      return (w.distanceFromActiveKm || 0) <= radiusKm;
    });

    visibleWells.forEach((well) => {
      const isAct = well.id === activeWell.id;
      const isUploaded = (well as any).isUploaded;
      const wellGroup = new THREE.Group();
      (wellGroup as any).userData = { well };

      const surfaceX = (well.coordinates.surfaceX || 0) * xyScale;
      const surfaceZ = (well.coordinates.surfaceY || 0) * xyScale;

      const wellheadGeo = new THREE.CylinderGeometry(isUploaded ? 1.2 : 0.8, isUploaded ? 1.2 : 0.8, 0.45, 16);
      const wellheadMat = new THREE.MeshLambertMaterial({
        color: isAct ? 0x1E3A5F : isUploaded ? 0x059669 : well.riskLevel === 'high' ? 0xDC2626 : 0x64748B,
      });
      const wellhead = new THREE.Mesh(wellheadGeo, wellheadMat);
      wellhead.position.set(surfaceX, 0.22, surfaceZ);
      wellGroup.add(wellhead);

      // Prominent visual beacon for uploaded scanned sites
      if (isUploaded) {
        const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.5, 8);
        const poleMat = new THREE.MeshBasicMaterial({ color: 0x059669 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(surfaceX, 2.0, surfaceZ);
        wellGroup.add(pole);

        const beaconGeo = new THREE.SphereGeometry(0.7, 16, 16);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(surfaceX, 3.8, surfaceZ);
        wellGroup.add(beacon);
      }

      if (showTrajectories && well.trajectoryPoints && well.trajectoryPoints.length > 0) {
        const points = well.trajectoryPoints.map((pt) => {
          return new THREE.Vector3(
            surfaceX + (pt.dx || 0) * xyScale * 0.5,
            -pt.tvd * depthScale,
            surfaceZ + (pt.dy || 0) * xyScale * 0.5
          );
        });

        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, isAct ? 0.35 : isUploaded ? 0.3 : 0.2, 8, false);
        const tubeMat = new THREE.MeshLambertMaterial({
          color: isAct ? 0x2563EB : isUploaded ? 0x10B981 : well.riskLevel === 'high' ? 0xEF4444 : 0x94A3B8,
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        wellGroup.add(tubeMesh);

        if (isAct) {
          const bitDepth = -well.currentDepth * depthScale;
          const bitGeo = new THREE.ConeGeometry(0.7, 1.5, 12);
          const bitMat = new THREE.MeshBasicMaterial({ color: 0x16A34A });
          const bitMesh = new THREE.Mesh(bitGeo, bitMat);
          bitMesh.rotation.x = Math.PI;
          bitMesh.position.set(surfaceX, bitDepth, surfaceZ);
          wellGroup.add(bitMesh);
        }
      }

      scene.add(wellGroup);
    });

    // 6. Incident Pins in 3D Space
    if (showIncidents) {
      incidents.forEach((inc) => {
        const parentWell = wells.find(w => w.id === inc.wellId);
        if (!parentWell) return;
        if (parentWell.id !== activeWell.id && !(parentWell as any).isUploaded && (parentWell.distanceFromActiveKm || 0) > radiusKm) return;

        const pinX = (parentWell.coordinates.surfaceX || 0) * xyScale;
        const pinZ = (parentWell.coordinates.surfaceY || 0) * xyScale;
        const pinY = -inc.depth * depthScale;

        // Pulse pin if currently inspected depth is within 50m of it
        const isNearInspected = Math.abs(inspectedDepth - inc.depth) <= 40;
        const isUploadedInc = (parentWell as any).isUploaded;

        const pinGeo = new THREE.SphereGeometry(isNearInspected ? 1.2 : isUploadedInc ? 0.9 : 0.65, 16, 16);
        const pinMat = new THREE.MeshBasicMaterial({
          color: isNearInspected ? 0xFF0000 : isUploadedInc ? 0xDC2626 : inc.type === 'kick' ? 0x991B1B : inc.type === 'mud_loss' ? 0xDC2626 : 0xD97706,
        });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.set(pinX, pinY, pinZ);
        scene.add(pinMesh);

        // Highlight ring around uploaded incident
        if (isUploadedInc) {
          const haloGeo = new THREE.RingGeometry(1.2, 1.5, 32);
          const haloMat = new THREE.MeshBasicMaterial({ color: 0xEF4444, side: THREE.DoubleSide });
          const haloMesh = new THREE.Mesh(haloGeo, haloMat);
          haloMesh.rotation.x = Math.PI / 2;
          haloMesh.position.set(pinX, pinY, pinZ);
          scene.add(haloMesh);
        }
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || is2DView) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    cameraAngleRef.current.theta -= deltaX * 0.008;
    cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi - deltaY * 0.008));

    updateCameraPosition();
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    cameraDistanceRef.current = Math.max(20, Math.min(160, cameraDistanceRef.current + e.deltaY * 0.05));
    updateCameraPosition();
  };

  return (
    <div
      ref={mountRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="w-full h-full min-h-[520px] rounded-mild overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
    />
  );
};
