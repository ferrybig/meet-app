import React, { ReactNode, useMemo, useDebugValue } from 'react';

interface Tile {
	width: number,
	height: number,
	left: number,
	top: number,
}

interface HalfTile {
	x: number,
	y: number,
}


const ASPECT_RATIO = 1200/800;
const ASPECT_WIDTH = 1 * ASPECT_RATIO;
const ASPECT_HEIGHT = 1;

function calculateTiles(
	width: number,
	height: number,
	x: number,
	y: number,
	numberOfTiles: number
): Tile[] {
	if (width <= 0 || height <= 0) {
		return [];
	}
	console.group('calculateTiles');
	let gridWidth = 1;
	let gridHeight = 1;
	while(gridWidth * gridHeight < numberOfTiles) {
		// We don't have enough space in our existing grid to layout all tiles, increase the grid
		const tileWidthNormalizedPerTile = width / gridWidth / ASPECT_WIDTH;
		const tileHeightNormalizedPerTile = height / gridHeight / ASPECT_HEIGHT;
		if (tileWidthNormalizedPerTile > tileHeightNormalizedPerTile) {
			gridWidth++;
		} else if (tileWidthNormalizedPerTile < tileHeightNormalizedPerTile) {
			gridHeight++;
		} else if (gridWidth > gridHeight) {
			gridHeight++;
		} else {
			gridWidth++;
		}
	}
	// We have selected the following grid:
	console.log('Dim: ', gridWidth, gridHeight);
	const halfTiles: HalfTile[] = [];
	for (let i = 0; i < gridWidth; i++) {
		for (let j = 0; j < gridHeight; j++) {
			halfTiles.push({
				x: i,
				y: j,
			});
		}
	}
	console.log('Halftiles: ', [...halfTiles]);
	const middleX = gridWidth / 2;
	const middleY = gridHeight / 2;
	halfTiles.sort((a, b) => {
		const ad = Math.pow(a.x - middleX, 2) + Math.pow(a.y - middleY, 2);
		const bd = Math.pow(b.x - middleX, 2) + Math.pow(b.y - middleY, 2);
		if (ad > bd) {
			return -1;
		} else if (ad < bd) {
			return 1;
		} else {
			return 0;
		}
	});
	halfTiles.length = numberOfTiles;
	console.log('Halftiles after sort & slice: ', [...halfTiles]);
	let reorganisationState: 'x-axis' | 'y-axis' | 'done' = 'x-axis';
	for (let counter = 0; counter < 4 && reorganisationState !== 'done'; counter++) {
		switch(reorganisationState) {
			case 'x-axis':
				reorganisationState = 'y-axis';
				for (let y = 0; y < gridHeight; y++) {
					const subTiles = halfTiles.filter(t => t.y === y);
					if (subTiles.length < gridWidth) {
						const missing = gridWidth - subTiles.length;
						const shift = missing / 2;
						for (let i = 0; i < subTiles.length; i++) {
							subTiles[i].x = i + shift;
						}
						if (shift % 1 !== 0) {
							// We performed a "half" shift, abort now
							reorganisationState = 'done';
						}
					}
				}
			break;
			case 'y-axis':
				reorganisationState = 'x-axis';
				for (let x = 0; x < gridWidth; x++) {
					const subTiles = halfTiles.filter(t => t.x === x);
					if (subTiles.length < gridHeight) {
						const missing = gridHeight - subTiles.length;
						const shift = missing / 2;
						for (let i = 0; i < subTiles.length; i++) {
							subTiles[i].y = i + shift;
						}
						if (shift % 1 !== 0) {
							// We performed a "half" shift, abort now
							reorganisationState = 'done';
						}
					}
				}
			break;
		}
	}
	console.log('Halftiles repositioning: ', [...halfTiles]);
	const tileWidthNormalizedPerTile = width / gridWidth / ASPECT_WIDTH;
	const tileHeightNormalizedPerTile = height / gridHeight / ASPECT_HEIGHT;
	const tileSizeNormalized = Math.min(tileHeightNormalizedPerTile, tileWidthNormalizedPerTile);
	const tileWidth = tileSizeNormalized * ASPECT_WIDTH;
	const tileHeight = tileSizeNormalized * ASPECT_HEIGHT;
	const paddingX = (width - (tileWidth * gridWidth)) / 2;
	const paddingY = (height - (tileHeight * gridHeight)) / 2;
	console.log('Positioning parameters: ', {
		tileWidthNormalizedPerTile,
		tileHeightNormalizedPerTile,
		tileSizeNormalized,
		tileWidth,
		tileHeight,
		paddingX,
		paddingY,
		baseX: x,
		baseY: y,
	});
	const fullTiles = halfTiles.map(tile => ({
		left: Math.floor(x + paddingX + tile.x * tileWidth),
		top: Math.floor(y + paddingY + tile.y * tileHeight),
		width: Math.floor(tileWidth),
		height: Math.floor(tileHeight),
	}));
	console.log('Done: ', fullTiles);
	console.groupEnd();
	return fullTiles;
}

export default function useRenderEngine<T>(
	items: T[],
	width: number,
	height: number,
	baseX: number,
	baseY: number,
	render: (item: T, position: Tile, index: number) => ReactNode,
	deps: any[] = [],
) {

	const length = items.length;
	const tiles = useMemo(() => calculateTiles(width, height, baseX, baseY, length), [width, height, baseX, baseY, length]);
	const jsx = useMemo(() => (
		<>
			{tiles.length > 0 ? items.map((item, index) => render(item, tiles[index], index)) : null}
		</>
		// eslint-disable-next-line react-hooks/exhaustive-deps
	), [items, tiles, ...deps]);
	useDebugValue([tiles, jsx]);
	return jsx;
};


