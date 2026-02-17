export class PerlinNoise {
    constructor() {
        this.p = new Uint8Array(512);
        this.permutation = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = i;
        }
        // Shuffle
        for (let i = 0; i < 256; i++) {
            const j = Math.floor(Math.random() * 256);
            [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
        }
        for (let i = 0; i < 512; i++) {
            this.p[i] = this.permutation[i & 255];
        }
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y, z) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);

        const A = this.p[X] + Y;
        const AA = this.p[A] + Z;
        const AB = this.p[A + 1] + Z;
        const B = this.p[X + 1] + Y;
        const BA = this.p[B] + Z;
        const BB = this.p[B + 1] + Z;

        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z),
            this.grad(this.p[BA], x - 1, y, z)),
            this.lerp(u, this.grad(this.p[AB], x, y - 1, z),
                this.grad(this.p[BB], x - 1, y - 1, z))),
            this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1),
                this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1),
                    this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))));
    }
}

export class OreGenerator {
    constructor(width, height, options = {}) {
        this.width = width;
        this.height = height;
        this.scale = options.scale ?? 0.05;  // 기본값: 더 낮은 scale (0.05 = 1/20)
        this.threshold = options.threshold ?? 0.5;
        this.targetCount = options.targetCount;     // 목표 개수 (optional)
        this.maxCount = options.maxCount;           // 최대 개수 (optional)
        this.minDistance = options.minDistance ?? 0; // 최소 거리 (optional)
        this.noise = new PerlinNoise();
        this.offsetX = Math.random() * 1000;
        this.offsetY = Math.random() * 1000;
    }

    /**
     * 주어진 threshold로 생성되는 개수를 예측
     */
    countWithThreshold(threshold, oreTypes) {
        let count = 0;
        const sampleStep = Math.max(1, Math.floor(Math.sqrt((this.width * this.height) / 1000)));

        for (let y = 0; y < this.height; y += sampleStep) {
            for (let x = 0; x < this.width; x += sampleStep) {
                const nx = (x + this.offsetX) * this.scale;
                const ny = (y + this.offsetY) * this.scale;
                const noiseValue = this.noise.noise(nx, ny, 0);
                const normalizedNoise = (noiseValue + 1) / 2;
                if (normalizedNoise > threshold) count++;
            }
        }
        // 샘플링 비율로 보정
        return Math.floor(count * sampleStep * sampleStep);
    }

    /**
     * 목표 개수에 맞는 최적의 threshold를 이진 탐색으로 찾음
     */
    findOptimalThreshold(targetCount, oreTypes) {
        let low = 0.0, high = 1.0;
        let bestThreshold = 0.5;
        let bestDiff = Infinity;

        for (let iter = 0; iter < 15; iter++) {
            const mid = (low + high) / 2;
            const estimatedCount = this.countWithThreshold(mid, oreTypes);
            const diff = Math.abs(estimatedCount - targetCount);

            if (diff < bestDiff) {
                bestDiff = diff;
                bestThreshold = mid;
            }

            if (estimatedCount > targetCount) {
                low = mid;  // 개수가 많으면 threshold를 높임
            } else {
                high = mid; // 개수가 적으면 threshold를 낮춤
            }
        }

        return bestThreshold;
    }

    generate(oreTypes) {
        // 목표 개수가 설정된 경우 최적의 threshold 찾기
        let effectiveThreshold = this.threshold;
        if (this.targetCount !== undefined && this.targetCount > 0) {
            effectiveThreshold = this.findOptimalThreshold(this.targetCount, oreTypes);
        }

        const grid = [];
        const placed = []; // 최소 거리 확인용

        for (let y = 0; y < this.height; y++) {
            grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                const nx = (x + this.offsetX) * this.scale;
                const ny = (y + this.offsetY) * this.scale;

                const noiseValue = this.noise.noise(nx, ny, 0);
                const normalizedNoise = (noiseValue + 1) / 2;

                if (normalizedNoise > effectiveThreshold) {
                    // 최소 거리 확인
                    if (this.minDistance > 0) {
                        const tooClose = placed.some(p => {
                            const dx = p.x - x;
                            const dy = p.y - y;
                            return Math.sqrt(dx * dx + dy * dy) < this.minDistance;
                        });
                        if (tooClose) {
                            grid[y][x] = null;
                            continue;
                        }
                    }

                    const oreType = oreTypes[Math.floor(Math.random() * oreTypes.length)];
                    grid[y][x] = oreType;
                    placed.push({ x, y });

                    // 최대 개수 제한
                    if (this.maxCount !== undefined && placed.length >= this.maxCount) {
                        // 남은 셀은 null로 채우고 종료
                        for (let ry = y; ry < this.height; ry++) {
                            for (let cx = (ry === y ? x + 1 : 0); cx < this.width; cx++) {
                                if (!grid[ry]) grid[ry] = [];
                                grid[ry][cx] = null;
                            }
                        }
                        return grid;
                    }
                } else {
                    grid[y][x] = null;
                }
            }
        }
        return grid;
    }

    /**
     * 단순한 랜덤 샘플링으로 지정된 개수만큼 위치 생성
     * (noise 기반 배치가 아닌 균등 분포가 필요할 때 사용)
     */
    static generateRandomPositions(count, width, height, minDistance = 0) {
        const positions = [];
        let attempts = 0;
        const maxAttempts = count * 100;

        while (positions.length < count && attempts < maxAttempts) {
            attempts++;
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);

            if (minDistance > 0) {
                const tooClose = positions.some(p => {
                    const dx = p.x - x;
                    const dy = p.y - y;
                    return Math.sqrt(dx * dx + dy * dy) < minDistance;
                });
                if (tooClose) continue;
            }

            positions.push({ x, y });
        }

        return positions;
    }

    /**
     * Minecraft 스타일 광맥(Vein) 생성
     * - 각 광맥은 시작점에서 여러 방향으로 뻗어나감
     * - 광맥 간 최소 거리 보장
     * - 광맥 내 gem 간 최소 거리 보장
     * - 자연스러운 굴곡과 분기
     *
     * @param {number} targetCount - 목표 광물 개수
     * @param {number} width - 영역 너비
     * @param {number} height - 영역 높이
     * @param {Object|number} options - 설정 객체 또는 minVeinDistance (하위 호환)
     * @returns {Array<{x: number, y: number}>} 광물 위치 배열
     */
    static generateVeins(targetCount, width, height, options = {}) {
        // 하위 호환: options가 숫자면 minVeinDistance로 처리
        const config = typeof options === 'number'
            ? { minVeinDistance: options }
            : options;

        const {
            minVeinDistance = 20,    // 광맥 시작점 간 최소 거리
            veinLength = 8,          // 각 광맥의 길이 (gem 개수)
            branchChance = 0.25,     // 분기 확률 (0-1)
            gemSpacing = 4,          // 광맥 내 gem 간 최소 거리 (그리드 셀)
            stepSize = 3,            // 광맥 이동 간격
        } = config;

        const positions = [];
        const veinStarts = [];

        // 더 많은 광맥 시작점 계산 (여유 있게)
        const estimatedVeins = Math.ceil(targetCount * 1.5 / veinLength);

        for (let i = 0; i < estimatedVeins * 5; i++) {
            const x = Math.floor(Math.random() * (width - 10)) + 5;
            const y = Math.floor(Math.random() * (height - 10)) + 5;

            // 다른 광맥 시작점과 충분히 떨어져 있는지 확인
            const tooClose = veinStarts.some(p => {
                const dx = p.x - x;
                const dy = p.y - y;
                return Math.sqrt(dx * dx + dy * dy) < minVeinDistance;
            });

            if (!tooClose) {
                veinStarts.push({ x, y });
                if (veinStarts.length >= estimatedVeins) break;
            }
        }

        // 헬퍼: gem 배치 가능 여부 체크 (최소 거리 + 영역 내)
        const canPlaceGem = (gx, gy) => {
            if (gx < 2 || gx >= width - 2 || gy < 2 || gy >= height - 2) return false;

            const tooClose = positions.some(p => {
                const dx = p.x - gx;
                const dy = p.y - gy;
                return Math.sqrt(dx * dx + dy * dy) < gemSpacing;
            });
            return !tooClose;
        };

        // 각 광맥 생성
        for (const start of veinStarts) {
            if (positions.length >= targetCount) break;

            // 광맥 방향 (랜덤 각도)
            let angle = Math.random() * Math.PI * 2;
            let x = start.x;
            let y = start.y;

            // 광맥을 따라 광물 배치
            for (let step = 0; step < veinLength * 2 && positions.length < targetCount; step++) {
                const gemX = Math.floor(x);
                const gemY = Math.floor(y);

                // 최소 거리 체크 후 배치
                if (canPlaceGem(gemX, gemY)) {
                    positions.push({ x: gemX, y: gemY });
                }

                // 방향 약간 랜덤하게 변경 (자연스러운 굴곡)
                angle += (Math.random() - 0.5) * 0.5;

                // 다음 위치로 이동 (간격)
                x += Math.cos(angle) * (stepSize + Math.random() * stepSize * 0.5);
                y += Math.sin(angle) * (stepSize + Math.random() * stepSize * 0.5);

                // 분기 (가끔 광맥이 갈라짐)
                if (Math.random() < branchChance && positions.length < targetCount - 2) {
                    const branchAngle = angle + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.4);
                    let bx = x;
                    let by = y;
                    const branchLen = Math.max(2, Math.floor(veinLength * 0.5));

                    for (let b = 0; b < branchLen && positions.length < targetCount; b++) {
                        const bGemX = Math.floor(bx);
                        const bGemY = Math.floor(by);

                        if (canPlaceGem(bGemX, bGemY)) {
                            positions.push({ x: bGemX, y: bGemY });
                        }

                        bx += Math.cos(branchAngle) * (stepSize * 0.8 + Math.random() * stepSize * 0.4);
                        by += Math.sin(branchAngle) * (stepSize * 0.8 + Math.random() * stepSize * 0.4);
                    }
                }
            }
        }

        return positions.slice(0, targetCount);
    }

    /**
     * Poisson Disc Sampling을 사용한 자연스러운 분포
     * Blue noise 패턴 - 최소 거리를 보장하면서도 균등 분포
     *
     * @param {number} count - 목표 개수
     * @param {number} width - 영역 너비
     * @param {number} height - 영역 높이
     * @param {number} minDistance - 최소 거리
     * @param {number} maxDistance - 최대 거리 (기본: minDistance * 2.5)
     * @returns {Array<{x: number, y: number}>} 위치 배열
     */
    static generatePoissonDisc(count, width, height, minDistance = 10, maxDistance = null) {
        if (maxDistance === null) maxDistance = minDistance * 2.5;

        const positions = [];
        const active = [];
        const cellSize = minDistance / Math.sqrt(2);
        const gridW = Math.ceil(width / cellSize);
        const gridH = Math.ceil(height / cellSize);
        const grid = new Array(gridW * gridH).fill(-1);

        // 헬퍼 함수: 그리드 인덱스 계산
        const gridIndex = (x, y) => {
            const gx = Math.floor(x / cellSize);
            const gy = Math.floor(y / cellSize);
            if (gx < 0 || gx >= gridW || gy < 0 || gy >= gridH) return -1;
            return gy * gridW + gx;
        };

        // 헬퍼 함수: 주변 점들과 거리 확인
        const isValid = (x, y) => {
            if (x < 2 || x >= width - 2 || y < 2 || y >= height - 2) return false;

            const gx = Math.floor(x / cellSize);
            const gy = Math.floor(y / cellSize);

            // 주변 5x5 그리드 셀 확인
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const nx = gx + dx;
                    const ny = gy + dy;
                    if (nx < 0 || nx >= gridW || ny < 0 || ny >= gridH) continue;

                    const idx = ny * gridW + nx;
                    const posIdx = grid[idx];
                    if (posIdx >= 0) {
                        const pos = positions[posIdx];
                        const dist = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
                        if (dist < minDistance) return false;
                    }
                }
            }
            return true;
        };

        // 초기 점 배치
        const x0 = width / 2 + (Math.random() - 0.5) * width * 0.8;
        const y0 = height / 2 + (Math.random() - 0.5) * height * 0.8;
        positions.push({ x: x0, y: y0 });
        active.push(0);
        grid[gridIndex(x0, y0)] = 0;

        // Poisson Disc Sampling 실행
        while (active.length > 0 && positions.length < count) {
            const randIdx = Math.floor(Math.random() * active.length);
            const pointIdx = active[randIdx];
            const point = positions[pointIdx];
            let found = false;

            // 주변에서 새로운 점 찾기 (30회 시도)
            for (let attempt = 0; attempt < 30; attempt++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = minDistance + Math.random() * (maxDistance - minDistance);
                const nx = point.x + Math.cos(angle) * dist;
                const ny = point.y + Math.sin(angle) * dist;

                if (isValid(nx, ny)) {
                    positions.push({ x: nx, y: ny });
                    active.push(positions.length - 1);
                    grid[gridIndex(nx, ny)] = positions.length - 1;
                    found = true;
                    break;
                }
            }

            // 새로운 점을 찾지 못하면 active에서 제거
            if (!found) {
                active.splice(randIdx, 1);
            }
        }

        // 정수 좌표로 변환
        return positions.slice(0, count).map(p => ({
            x: Math.floor(p.x),
            y: Math.floor(p.y)
        }));
    }

    /**
     * Scattered gem distribution with depth bias and Perlin noise density zones.
     * Replaces vein-based placement for even, natural-feeling distribution.
     *
     * Phase 1: Depth-weighted Poisson Disc Sampling (~85% of gems)
     * Phase 2: Outlier spawns (~12% of gems) — far from all others
     * Phase 3: Gap filling fallback if target not reached
     *
     * @param {number} targetCount - 목표 gem 개수
     * @param {number} width - 영역 너비
     * @param {number} height - 영역 높이
     * @param {Object} options - 설정
     * @returns {Array<{x: number, y: number}>} gem 위치 배열
     */
    static generateScattered(targetCount, width, height, options = {}) {
        if (targetCount === 0) return [];

        const {
            minDistance = 5,
            depthBias = 0.6,
            noiseScale = 0.04,
            densityContrast = 0.35,
            outlierRatio = 0.12,
            margin = 2,
        } = options;

        // For very small counts, skip the complex algorithm
        if (targetCount <= 3) {
            return OreGenerator.generateRandomPositions(
                targetCount, width, height, minDistance
            );
        }

        // Auto-reduce minDistance if area is too small
        const maxPossible = (width - 2 * margin) * (height - 2 * margin);
        const idealArea = Math.PI * (minDistance / 2) ** 2;
        let effectiveMinDist = minDistance;
        if (targetCount * idealArea > maxPossible * 0.8) {
            effectiveMinDist = Math.max(1, Math.sqrt(maxPossible * 0.8 / (targetCount * Math.PI)) * 2);
        }

        const positions = [];
        const rejectedCandidates = []; // Save for Phase 3

        // Spatial grid for fast neighbor lookup
        const cellSize = effectiveMinDist / Math.sqrt(2);
        const gridW = Math.ceil(width / cellSize);
        const gridH = Math.ceil(height / cellSize);
        const grid = new Array(gridW * gridH).fill(-1);

        const gridIndex = (x, y) => {
            const gx = Math.floor(x / cellSize);
            const gy = Math.floor(y / cellSize);
            if (gx < 0 || gx >= gridW || gy < 0 || gy >= gridH) return -1;
            return gy * gridW + gx;
        };

        const checkMinDistance = (x, y, minDist) => {
            const gx = Math.floor(x / cellSize);
            const gy = Math.floor(y / cellSize);
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const nx = gx + dx;
                    const ny = gy + dy;
                    if (nx < 0 || nx >= gridW || ny < 0 || ny >= gridH) continue;
                    const idx = ny * gridW + nx;
                    const posIdx = grid[idx];
                    if (posIdx >= 0) {
                        const p = positions[posIdx];
                        if ((p.x - x) ** 2 + (p.y - y) ** 2 < minDist * minDist) return false;
                    }
                }
            }
            return true;
        };

        const addPoint = (x, y) => {
            const idx = gridIndex(x, y);
            if (idx < 0) return false;
            positions.push({ x, y });
            grid[idx] = positions.length - 1;
            return true;
        };

        const inBounds = (x, y) =>
            x >= margin && x < width - margin && y >= margin && y < height - margin;

        // Perlin noise for density zones
        const noise = new PerlinNoise();
        const noiseOffX = Math.random() * 1000;
        const noiseOffY = Math.random() * 1000;

        // Depth weight: probability increases toward bottom
        const depthWeight = (y) =>
            (1 - depthBias) + depthBias * Math.pow(y / height, 0.8);

        // Density zone modifier from Perlin noise
        const densityZone = (x, y) => {
            const n = (noise.noise((x + noiseOffX) * noiseScale, (y + noiseOffY) * noiseScale, 0) + 1) / 2;
            // Map noise [0,1] to acceptance modifier, with floor of 0.15
            return Math.max(0.15, 1 - densityContrast + densityContrast * n);
        };

        // ── Phase 1: Generate-then-select with Poisson Disc ──
        // Step 1a: Fill entire area with Poisson Disc (no bias yet)
        const phase1Target = Math.ceil(targetCount * (1 - outlierRatio));
        const idealSpacing = Math.sqrt((width * height) / targetCount) * 0.9;
        const maxDist = Math.max(effectiveMinDist * 2.5, idealSpacing * 1.5);
        const overgenerate = Math.max(phase1Target * 3, targetCount * 4);

        const candidates = []; // All Poisson Disc points before selection
        const candidateActive = [];

        // Poisson Disc with central seed (no depth bias)
        const seedX = width / 2 + (Math.random() - 0.5) * width * 0.4;
        const seedY = height / 2 + (Math.random() - 0.5) * height * 0.4;
        const seed = {
            x: Math.max(margin, Math.min(width - margin - 1, seedX)),
            y: Math.max(margin, Math.min(height - margin - 1, seedY)),
        };
        candidates.push(seed);
        candidateActive.push(0);

        // Temp grid for candidate generation
        const candGrid = new Array(gridW * gridH).fill(-1);
        candGrid[gridIndex(seed.x, seed.y)] = 0;

        const candCheckDist = (x, y) => {
            const gx = Math.floor(x / cellSize);
            const gy = Math.floor(y / cellSize);
            for (let ddy = -2; ddy <= 2; ddy++) {
                for (let ddx = -2; ddx <= 2; ddx++) {
                    const nx = gx + ddx;
                    const ny = gy + ddy;
                    if (nx < 0 || nx >= gridW || ny < 0 || ny >= gridH) continue;
                    const idx = ny * gridW + nx;
                    const posIdx = candGrid[idx];
                    if (posIdx >= 0) {
                        const p = candidates[posIdx];
                        if ((p.x - x) ** 2 + (p.y - y) ** 2 < effectiveMinDist * effectiveMinDist) return false;
                    }
                }
            }
            return true;
        };

        while (candidateActive.length > 0 && candidates.length < overgenerate) {
            const randIdx = Math.floor(Math.random() * candidateActive.length);
            const pointIdx = candidateActive[randIdx];
            const point = candidates[pointIdx];
            let found = false;

            for (let attempt = 0; attempt < 30; attempt++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = effectiveMinDist + Math.random() * (maxDist - effectiveMinDist);
                const nx = point.x + Math.cos(angle) * dist;
                const ny = point.y + Math.sin(angle) * dist;

                if (!inBounds(nx, ny)) continue;
                if (!candCheckDist(nx, ny)) continue;

                candidates.push({ x: nx, y: ny });
                candidateActive.push(candidates.length - 1);
                const ci = gridIndex(nx, ny);
                if (ci >= 0) candGrid[ci] = candidates.length - 1;
                found = true;
                break;
            }

            if (!found) {
                candidateActive.splice(randIdx, 1);
            }
        }

        // Step 1b: Score candidates by depth weight × density zone, then select
        const scored = candidates.map((p, i) => ({
            ...p,
            score: depthWeight(p.y) * densityZone(p.x, p.y),
            idx: i,
        }));

        // Weighted random selection without replacement
        const selected = new Set();
        const selectCount = Math.min(phase1Target, scored.length);

        for (let i = 0; i < selectCount; i++) {
            // Build cumulative weights from remaining candidates
            let totalWeight = 0;
            for (let j = 0; j < scored.length; j++) {
                if (!selected.has(j)) totalWeight += scored[j].score;
            }
            let pick = Math.random() * totalWeight;
            for (let j = 0; j < scored.length; j++) {
                if (selected.has(j)) continue;
                pick -= scored[j].score;
                if (pick <= 0) {
                    selected.add(j);
                    addPoint(scored[j].x, scored[j].y);
                    break;
                }
            }
        }

        // Save unselected candidates for Phase 3
        for (let i = 0; i < scored.length; i++) {
            if (!selected.has(i)) {
                rejectedCandidates.push(candidates[i]);
            }
        }

        // ── Phase 2: Outlier Spawns ──
        const outlierTarget = Math.floor(targetCount * outlierRatio);
        const outlierMinDist = Math.max(idealSpacing * 1.5, effectiveMinDist * 3);

        for (let pass = 0; pass < 2 && positions.length < phase1Target + outlierTarget; pass++) {
            const requiredDist = pass === 0 ? outlierMinDist : outlierMinDist * 0.7;
            const maxAttempts = 200;

            for (let attempt = 0; attempt < maxAttempts && positions.length < phase1Target + outlierTarget; attempt++) {
                const ox = margin + Math.random() * (width - 2 * margin);
                const oy = margin + Math.random() * (height - 2 * margin);

                if (!checkMinDistance(ox, oy, effectiveMinDist)) continue;

                // Check outlier distance: must be far from ALL existing points
                let nearestDist = Infinity;
                for (const p of positions) {
                    const d = Math.sqrt((p.x - ox) ** 2 + (p.y - oy) ** 2);
                    if (d < nearestDist) nearestDist = d;
                }
                if (nearestDist < requiredDist) continue;

                addPoint(ox, oy);
            }
        }

        // ── Phase 3: Gap Filling ──
        if (positions.length < targetCount) {
            // Try rejected candidates first (already spatially valid positions)
            for (const cand of rejectedCandidates) {
                if (positions.length >= targetCount) break;
                if (!inBounds(cand.x, cand.y)) continue;
                if (checkMinDistance(cand.x, cand.y, effectiveMinDist)) {
                    addPoint(cand.x, cand.y);
                }
            }
        }

        if (positions.length < targetCount) {
            // Random positions with relaxed minDistance
            const relaxedDist = effectiveMinDist * 0.7;
            const maxAttempts = (targetCount - positions.length) * 100;
            for (let i = 0; i < maxAttempts && positions.length < targetCount; i++) {
                const rx = margin + Math.random() * (width - 2 * margin);
                const ry = margin + Math.random() * (height - 2 * margin);
                if (checkMinDistance(rx, ry, relaxedDist)) {
                    addPoint(rx, ry);
                }
            }
        }

        // Convert to integer coordinates
        return positions.slice(0, targetCount).map(p => ({
            x: Math.floor(p.x),
            y: Math.floor(p.y)
        }));
    }
}
