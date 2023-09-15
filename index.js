/*
	Name:			PPPxcy's new 2048
	Author:			PPPxcy
	Date:			Aug. 2nd, Thur., 2023	(Start)
					Sept. 14th, Thur., 2023	(Finish)
					?						(Change)
	Description:	A new 2048 framework with higher compatibility, but only 2-dimonsional.
*/

function Map2048(lawMoving, lawTile, lawMerging, lawMessage) {
	let that = this;
	this.movingLaw = lawMoving, this.tileLaw = lawTile, this.mergingLaw = lawMerging, this.messageLaw = lawMessage, this.map = [];
	for(let i = 0; i < this.movingLaw.height; i++) {
		this.map.push([]);
		for(let j = 0; j < this.movingLaw.width; j++)
			this.map[i].push(null);
	}
	if(document.getElementById('temp-style'))
		document.getElementById('temp-style').remove();
	let newStyle = document.createElement('style'), anitxt = '';
	for(let i = -this.movingLaw.height + 1; i < this.movingLaw.height; i++)
		for(let j = -this.movingLaw.width + 1; j < this.movingLaw.width; j++)
			anitxt += `@keyframes move-through_${i}_${j} { from { position: relative; top: calc(400px / var(--size-hor) * ${i}); left: calc(400px / var(--size-hor) * ${j}); } 20% { position: relative; top: calc(300px / var(--size-hor) * ${i}); left: calc(300px / var(--size-hor) * ${j}); } 50% { position: relative; top: calc(200px / var(--size-hor) * ${i}); left: calc(200px / var(--size-hor) * ${j}); } to { position: relative; top: 0; left: 0; } } .tile-move-through_${i}_${j} { animation: move-through_${i}_${j}; animation-duration: 50ms; }\n`;
	newStyle.id = 'temp-style', newStyle.innerHTML = this.tileLaw.css,
	document.getElementById('moving-ani').innerHTML = anitxt, document.body.appendChild(newStyle),
	document.getElementById('new-game').addEventListener('click', () => { that.restart(); });
}
Object.defineProperty(Map2048.prototype, 'constructor', { value: Map2048 });
Object.defineProperty(Map2048.prototype, 'printMap', {
	value: function() {
		let box = document.createElement('div'), back = document.createElement('div'), that = this;
		back.id = 'box-back';
		for(let i = 0; i < this.movingLaw.height; i++) {
			let row = document.createElement('div');
			row.classList.add('box-row');
			for(let j = 0; j < this.movingLaw.width; j++) {
				let col = document.createElement('div');
				col.classList.add('box-col', 'box-empty'), row.appendChild(col);
			}
			back.appendChild(row);
		}
		box.appendChild(back);
		for(let i = 0; i < this.movingLaw.height; i++) {
			let row = document.createElement('div');
			row.classList.add('box-row');
			for(let j = 0; j < this.movingLaw.width; j++) {
				let col = document.createElement('div');
				col.classList.add('box-col', ...(v => v === '' ? [] : v.split(' '))(this.tileLaw.className(this.map[i][j].value, this.movingLaw.mapping[i][j])), ...(v => v === '' ? [] : v.split(' '))(this.map[i][j].classMore));
				if(this.map[i][j].newSpawn) col.classList.add('new-spawn');
				if(this.map[i][j].newMerge) col.classList.add('merged');
				col.innerHTML = (!!this.map[i][j].value ? this.map[i][j].value : ''), this.map[i][j].HTMLElement = col, row.appendChild(col);
			}
			box.appendChild(row);
		}
		this.box.innerHTML = box.innerHTML, this.cur.innerText = this.score, this.hst.innerText = this.highest;
	}
});
Object.defineProperty(Map2048.prototype, 'gameStart', {
	value: function(box, cur, hst) {
		let that = this;
		this.box = box, this.cur = cur, this.hst = hst, this.score = 0, this.moveQueue = [],
		this.highest = (isNaN(Number(localStorage[this.storageName('highest')])) ? (localStorage[this.storageName('highest')] = 0) : Number(localStorage[this.storageName('highest')])),
		box.style = `--size-hor: ${this.movingLaw.width}; --size-ver: ${this.movingLaw.height}`;
		for(let i = 0; i < this.movingLaw.height; i++)
			for(let j = 0; j < this.movingLaw.width; j++)
					this.map[i][j] = {value: null, classMore: `tile-${this.movingLaw.mapping[i][j]}`};
		document.body.addEventListener('keydown', this.keybd = function(event) {
			let otherKey = event.altKey || event.ctrlKey || event.shiftKey || event.metaKey, keyCode = event.keyCode, flag = false;
			if(!otherKey)
				for(let i = 0; i < that.movingLaw.direction.length; i++)
					if(that.movingLaw.direction[i].indexOf(keyCode) !== -1) {
						that.moveQueue.push(i), flag = true;
						break;
					}
			if(flag)
				event.preventDefault();
			return true;
		});
		for(let i = 0; i < this.tileLaw.startTileCount; i++)
			this.addRandomTile();
		this.printMap(), this.execute();
	}
});
Object.defineProperty(Map2048.prototype, 'changeTile', {
	value: function(y, x, v) {
		this.map[y][x].newSpawn = true, this.map[y][x].value = v;
	}
});
Object.defineProperty(Map2048.prototype, 'addRandomTile', {
	value: function() {
		let empties = [];
		for(let i = 0; i < this.movingLaw.height; i++)
			for(let j = 0; j < this.movingLaw.width; j++)
				if(this.movingLaw.mapping[i][j] !== 'wall' && this.map[i][j].value === null)
					empties.push({x: j, y: i});
		if(empties.length) {
			let rnd = empties[Math.floor(Math.random() * empties.length)], value = this.tileLaw.newTileValue();
			this.map[rnd.y][rnd.x].newSpawn = true, this.map[rnd.y][rnd.x].value = value;
		}
	}
});
Object.defineProperty(Map2048.prototype, 'setHighestScore', {
	value: function(set) {
		localStorage[this.storageName('highest')] = this.highest = this.hst.innerText = set;
	}
});
Object.defineProperty(Map2048.prototype, 'plusScore', {
	value: function(add) {
		this.score += add, this.cur.innerText = this.score;
		if(this.score > this.highest)
			this.setHighestScore(this.score);
	}
});
Object.defineProperty(Map2048.prototype, 'canMove', {
	value: function(dir) {
		let map = this.map, nxpos = this.movingLaw.nextpos[dir];
		for(let i = 0; i < nxpos.order.length; i++) {
			let y = nxpos.order[i].y, x = nxpos.order[i].x;
			if(map[y][x].value === null)
				continue;
			let	toy = nxpos.movedPosition[y][x].y, tox = nxpos.movedPosition[y][x].x;
			if(y === toy && x === tox)
				continue;
			if(map[toy][tox].value === null)
				return true;
			else {
				let v1 = map[y][x].value, v2 = map[toy][tox].value;
				for(let j of this.mergingLaw.lawList)
					if((j[0] === v1 && j[1] === v2) || (j[0] === v2 && j[1] === v1))
						return true;
			}
		}
		return false;
	}
});
Object.defineProperty(Map2048.prototype, 'move', {
	value: function(dir) {
		if(!this.canMove(dir))
			return;
		let that = this, map = this.map, nxpos = this.movingLaw.nextpos[dir];
		for(let i = 0; i < this.movingLaw.height; i++)
			for(let j = 0; j < this.movingLaw.width; j++)
				this.map[i][j].newSpawn = this.map[i][j].newMerge = false,
				this.map[i][j].y = i, this.map[i][j].x = j;
		for(let i = 0; i < nxpos.order.length; i++) {
			let y = nxpos.order[i].y, x = nxpos.order[i].x;
			if(map[y][x].value === null)
				continue;
			let	toy = nxpos.movedPosition[y][x].y, tox = nxpos.movedPosition[y][x].x;
			if(y === toy && x === tox)
				continue;
			if(map[toy][tox].value === null) {
				map[toy][tox].y = map[y][x].y, map[toy][tox].x = map[y][x].x,
				map[toy][tox].value = map[y][x].value,
				delete map[y][x].y, delete map[y][x].x, map[y][x].value = null;
			} else if(map[toy][tox].newMerge === false && map[y][x].newMerge === false) {
				let v1 = map[y][x].value, v2 = map[toy][tox].value;
				for(let j of this.mergingLaw.lawList)
					if((j[0] === v1 && j[1] === v2) || (j[0] === v2 && j[1] === v1)) {
						map[toy][tox].y = map[y][x].y, map[toy][tox].x = map[y][x].x,
						map[toy][tox].value = j[2], map[toy][tox].newMerge = true,
						delete map[y][x].y, delete map[y][x].x, map[y][x].value = null,
						this.plusScore(j[3]);
						break;
					}
			}
		}
		for(let i = 0; i < this.movingLaw.height; i++)
			for(let j = 0; j < this.movingLaw.width; j++)
				if(map[i][j].classMore === 'tile-default' && map[i][j].value !== null)
					map[i][j].classMore = `tile-move-through_${map[i][j].y - i}_${map[i][j].x - j}`;
				else if(map[i][j].classMore.substr(0, 17) === 'tile-move-through')
					map[i][j].classMore = 'tile-default';
		this.addRandomTile(), that.printMap();
		let flag = false;
		for(let i = 0; i < this.movingLaw.direction.length; i++)
			flag ||= this.canMove(i);
		if(flag === false) {
			this.gameLosed();
			return;
		}
	}
});
Object.defineProperty(Map2048.prototype, 'execute', {
	value: function() {
		let that = this, interval = setInterval(function() {
			if(that.keybd === null)
				clearInterval(interval);
			if(that.moveQueue.length > 0) {
				let moveDir = that.moveQueue.shift();
				that.move(moveDir);
			}
		}, 0);
	}
});
Object.defineProperty(Map2048.prototype, 'endGame', {
	value: function() {
		if(this.keybd !== null)
			document.body.removeEventListener('keydown', this.keybd), this.keybd = null;
	}
});
Object.defineProperty(Map2048.prototype, 'gameLosed', {
	value: function() {
		this.endGame();
		let fbox = document.createElement('div');
		fbox.id = 'box-front', fbox.innerHTML = `<div class="lose-message">${this.messageLaw.lose}</div>`;
		setTimeout(() => { this.box.appendChild(fbox); }, 625);
	}
});
Object.defineProperty(Map2048.prototype, 'restart', {
	value: function() {
		this.endGame(), this.gameStart(this.box, this.cur, this.hst);
	}
});
Object.defineProperty(Map2048.prototype, 'id', {
	value: btoa(JSON.stringify({movingLaw: this.movingLaw, tileLaw: this.tileLaw, mergingLaw: this.mergingLaw, messageLaw: this.messageLaw}))
});
Object.defineProperty(Map2048.prototype, 'storageName', {
	value: type => `PPPxcy_new2048_${type}_ofid_` + this.id
});

const default2048 = {
	lawMoving: {
		width: 4, height: 4,
		direction: [[38, 75, 87], [37, 72, 65], [40, 74, 83], [39, 76, 68]],
		mapping: [
			['default', 'default', 'default', 'default'],
			['default', 'default', 'default', 'default'],
			['default', 'default', 'default', 'default'],
			['default', 'default', 'default', 'default']
		], nextpos: [{order: [
			{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0},
			{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1},
			{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0},
			{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2},
			{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1},
			{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0},
			{x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3},
			{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2},
			{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1},
			{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}
		], movedPosition: [
			[{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}],
			[{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}],
			[{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}],
			[{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}]
		]}, {order: [
			{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3},
			{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},
			{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3},
			{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3},
			{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},
			{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3},
			{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3},
			{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3},
			{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},
			{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}
		], movedPosition: [
			[{x: 0, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
			[{x: 0, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
			[{x: 0, y: 2}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}],
			[{x: 0, y: 3}, {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}]
		]}, {order: [
			{x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3},
			{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2},
			{x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3},
			{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1},
			{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2},
			{x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3},
			{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0},
			{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1},
			{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2},
			{x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}
		], movedPosition: [
			[{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}],
			[{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}],
			[{x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}],
			[{x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]
		]}, {order: [
			{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3},
			{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3},
			{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3},
			{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},
			{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3},
			{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3},
			{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3},
			{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},
			{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3},
			{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}
		], movedPosition: [
			[{x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 3, y: 0}],
			[{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 3, y: 1}],
			[{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 3, y: 2}],
			[{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 3, y: 3}]
		]}]
	}, lawTile: {
		className: function(tileValue, tileWall) {
			tileValue = Number(String(tileValue));
			if(isNaN(tileValue))
				return `not-set`;
			else
				return `tile-${tileValue < 4096 ? tileValue : 'super'}`;
		}, newTileValue: function() {
			return Math.random() < 0.9 ? '2' : '4';
		}, startTileCount: 2, css: `
html { background-color: #faf8ef; }
#new-game { background-color: #8f7a66; }
#box-back, .score-box { background-color: #bbada0; }
#new-game button:focus { outline: black solid 3px; }
#box-front .lose-message, #box-content { color: #776e65; }
#box-front { background-color: rgba(238, 228, 218, 0.73); }
#new-game :focus, #new-game :hover { background-color: #776e65; }
#current-score, #highest-score, #new-game button { color: white; }
#box-back .box-row .box-col.box-empty { background-color: #cdc1b4; }
.score-box:has(#current-score)::before, .score-box:has(#highest-score)::before { color: #eee4da; }
#box-2048 .box-row .box-col {
	&.tile-2, &.tile-4, &.tile-8, &.tile-16, &.tile-32, &.tile-64 { font-size: 54px; }
	&.tile-8, &.tile-16, &.tile-32, &.tile-64, &.tile-128, &.tile-256, &.tile-512, &.tile-1024, &.tile-2048, &.tile-super { color: #f9f6f2; }
	&.tile-2 { color: #776e65; background: #eee4da; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0); }
	&.tile-4 { color: #776e65; background: #eee1c9; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0); }
	&.tile-8 { background: #f3b27a; }
	&.tile-16 { background: #f69664; }
	&.tile-32 { background: #f77c5f; }
	&.tile-64 { background: #f75f3b; }
	&.tile-128 { font-size: 45px; background: #edd073; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.238095), inset 0 0 0 1px rgba(255, 255, 255, 0.142857); }
	&.tile-256 { font-size: 45px; background: #edcc62; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31746), inset 0 0 0 1px rgba(255, 255, 255, 0.190476); }
	&.tile-512 { font-size: 45px; background: #edc950; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.396825), inset 0 0 0 1px rgba(255, 255, 255, 0.238095); }
	&.tile-1024 { font-size: 35px; background: #edc53f; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619), inset 0 0 0 1px rgba(255, 255, 255, 0.285714); }
	&.tile-2048 { font-size: 35px; background: #edc22e; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.555556), inset 0 0 0 1px rgba(255, 255, 255, 0.333333); }
	&.tile-super { font-size: 30px; background: #edbd07; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.634921), inset 0 0 0 1px rgba(255, 255, 255, 0.380952); }
}`
	}, lawMerging: {
		lawList: [
		//	The Order of them is:
		//	[<tile>, <tile>, <new-tile>, <score>]
			['2', '2', '4', 4],
			['4', '4', '8', 8],
			['8', '8', '16', 16],
			['16', '16', '32', 32],
			['32', '32', '64', 64],
			['64', '64', '128', 128],
			['128', '128', '256', 256],
			['256', '256', '512', 512],
			['512', '512', '1024', 1024],
			['1024', '1024', '2048', 2048],
			['2048', '2048', '4096', 4096],
			['4096', '4096', '8192', 8192],
			['8192', '8192', '16384', 16384],
			['16384', '16384', '32768', 32768],
			['32768', '32768', '65536', 65536],
			['65536', '65536', '131072', 131072]
		]
	}, lawMessage: {
		win: '',
		lose: 'You lose'
	}
};
