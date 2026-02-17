import { OreGenerator } from './ore-generator.js';
import { test } from 'node:test';
import assert from 'node:assert';

test('OreGenerator generates grid of correct size', () => {
    const width = 20;
    const height = 10;
    const generator = new OreGenerator(width, height, 10, 0.5);
    const grid = generator.generate(['ruby']);

    assert.strictEqual(grid.length, height);
    assert.strictEqual(grid[0].length, width);
});

test('OreGenerator places allowed ores', () => {
    const width = 20;
    const height = 10;
    // Low threshold to ensure some ores are generated
    const generator = new OreGenerator(width, height, 10, 0.1); 
    const grid = generator.generate(['ruby', 'emerald']);

    let oreCount = 0;
    for(let y=0; y<height; y++) {
        for(let x=0; x<width; x++) {
            if (grid[y][x]) {
                assert.ok(['ruby', 'emerald'].includes(grid[y][x]));
                oreCount++;
            }
        }
    }
    // With 0.1 threshold (noise is ~0.5 avg), we expect many ores
    assert.ok(oreCount > 0);
});

// ── generateScattered() tests ──

test('generateScattered returns exact target count', () => {
    const count = 30;
    const result = OreGenerator.generateScattered(count, 100, 80, { minDistance: 4 });
    assert.strictEqual(result.length, count);
});

test('generateScattered enforces minimum distance between all gems', () => {
    const minDistance = 5;
    const result = OreGenerator.generateScattered(20, 100, 80, { minDistance });

    for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
            const dx = result[i].x - result[j].x;
            const dy = result[i].y - result[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            assert.ok(
                dist >= minDistance * 0.7 - 1, // Allow relaxed distance from Phase 3
                `Points ${i} and ${j} too close: ${dist.toFixed(2)} < ${(minDistance * 0.7 - 1).toFixed(2)}`
            );
        }
    }
});

test('generateScattered keeps all positions within bounds', () => {
    const margin = 2;
    const width = 100;
    const height = 80;
    const result = OreGenerator.generateScattered(25, width, height, { minDistance: 4, margin });

    for (const pos of result) {
        assert.ok(pos.x >= 0, `x=${pos.x} below 0`);
        assert.ok(pos.x < width, `x=${pos.x} >= width ${width}`);
        assert.ok(pos.y >= 0, `y=${pos.y} below 0`);
        assert.ok(pos.y < height, `y=${pos.y} >= height ${height}`);
    }
});

test('generateScattered shows depth bias (median Y below midpoint)', () => {
    // Run multiple times and check average median
    let medianSum = 0;
    const trials = 5;
    const height = 100;

    for (let t = 0; t < trials; t++) {
        const result = OreGenerator.generateScattered(40, 120, height, {
            minDistance: 3, depthBias: 0.6,
        });
        const ys = result.map(p => p.y).sort((a, b) => a - b);
        medianSum += ys[Math.floor(ys.length / 2)];
    }

    const avgMedian = medianSum / trials;
    assert.ok(
        avgMedian > height / 2,
        `Average median Y (${avgMedian.toFixed(1)}) should be below midpoint (${height / 2})`
    );
});

test('generateScattered produces at least one outlier', () => {
    const result = OreGenerator.generateScattered(30, 120, 100, {
        minDistance: 4, outlierRatio: 0.12,
    });

    const idealSpacing = Math.sqrt((120 * 100) / 30) * 0.9;
    const outlierThreshold = idealSpacing * 1.2;
    let hasOutlier = false;

    for (const pos of result) {
        let nearest = Infinity;
        for (const other of result) {
            if (pos === other) continue;
            const d = Math.sqrt((pos.x - other.x) ** 2 + (pos.y - other.y) ** 2);
            if (d < nearest) nearest = d;
        }
        if (nearest > outlierThreshold) {
            hasOutlier = true;
            break;
        }
    }

    assert.ok(hasOutlier, `No outlier found with nearest-neighbor > ${outlierThreshold.toFixed(1)}`);
});

test('generateScattered returns empty array for zero count', () => {
    const result = OreGenerator.generateScattered(0, 100, 80);
    assert.deepStrictEqual(result, []);
});

test('generateScattered handles small counts (1-3) without crash', () => {
    for (const count of [1, 2, 3]) {
        const result = OreGenerator.generateScattered(count, 100, 80, { minDistance: 4 });
        assert.strictEqual(result.length, count, `Expected ${count} positions, got ${result.length}`);
    }
});
