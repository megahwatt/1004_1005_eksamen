// ARRAYS
let pokemonNamesArray = [];
let pokemonDataArray = [];

let championArray = [];
let enemyArray = [];

let championBattleArray = [];
let enemyBattleArray = [];

// GLOBAL VARIABLES
var mainBattleContainer = document.querySelector(".main-battle-container");
var battleContainers = mainBattleContainer.querySelectorAll(".battle-container");

var mainPocketballContainer = document.querySelector(".main-pocketball-container");
var pocketballContainers = mainPocketballContainer.querySelectorAll(".pocketball-container");

var pocketballs = document.querySelectorAll(".pocketball");

var txtContainer = document.querySelectorAll(".txt-container");

const pocketballImg = document.querySelectorAll(".pocketball-img");

const pokeballImgs = ["assets/ball_bw.png", "assets/ball_rgb_closed.png", "assets/ball_rgb_open.png"];

// FETCH DATA FROM API AND MANIPULATE DATA TO START
const urlGenI = `https://pokeapi.co/api/v2/generation/1`;
const urlPokemonID = `https://pokeapi.co/api/v2/pokemon/`;
const pokemonsToFetch = [1, 18, 26, 27, 31, 43, 49, 63, 76, 80, 94, 148];

async function getPokemonNames() {
	try {
		const pokemonNames = await (await fetch(urlGenI)).json();
		pokemonNamesArray = pokemonNames.pokemon_species.map((pokemon) => pokemon.name);
	} catch (error) {
		console.error("404 getPokemonNames || Couldn't fetch", error.message);
	}
}

async function getPokemonData() {
	try {
		for (const id of pokemonsToFetch) {
			const pokemonData = await (await fetch(urlPokemonID + id)).json();

			const pokemonSprite = pokemonData.sprites.other["official-artwork"].front_default;

			const pokemonID = pokemonData.id;
			const pokemonName = pokemonData.name;

			const pokemonTypeOne = pokemonData.types[0].type.name;
			const pokemonTypeTwo = pokemonData.types[1]?.type.name || null;

			const pokemonStatsHP = pokemonData.stats[0].base_stat;
			const pokemonStatsAttack = pokemonData.stats[1].base_stat;
			const pokemonStatsDefense = pokemonData.stats[2].base_stat;
			const pokemonStatsSpeed = pokemonData.stats[5].base_stat;

			pokemonDataArray.push({
				sprite: pokemonSprite,
				id: pokemonID,
				name: pokemonName,
				currentHP: pokemonStatsHP,
				maxHP: pokemonStatsHP,
				attack: pokemonStatsAttack,
				defense: pokemonStatsDefense,
				speed: pokemonStatsSpeed,
				typeOne: pokemonTypeOne,
				typeTwo: pokemonTypeTwo,
			});
		}
		//outputArrayToConsole();
	} catch (error) {
		console.error("404 getPokemonData || Couldn't fetch", error);
	}
}

/*function outputArrayToConsole() {
	pokemonDataArray.forEach((pokemon) => {
		console.log("sprite", pokemon.sprite);
		console.log(`id #${pokemon.id}`);
		console.log(pokemon.name);
		console.log("HP", `${pokemon.currentHP} / ${pokemon.maxHP}`);
		console.log("attack", pokemon.attack);
		console.log("defense", pokemon.defense);
		console.log("speed", pokemon.speed);
		console.log("type", `${pokemon.typeOne}, ${pokemon.typeTwo}`);
		console.log("-----");
	});
}*/

function divideAndConquer(pokemonDataArray) {
	for (let i = pokemonDataArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pokemonDataArray[i], pokemonDataArray[j]] = [pokemonDataArray[j], pokemonDataArray[i]];
	}

	const split = Math.ceil(pokemonDataArray.length / 2);
	const championArray = pokemonDataArray.slice(0, split);
	const enemyArray = pokemonDataArray.slice(split);

	return [championArray, enemyArray];
}

getPokemonNames()
	.then(() => {
		return getPokemonData();
	})
	.then(() => {
		const [championArray, enemyArray] = divideAndConquer(pokemonDataArray);
		console.log("split champ", championArray);
		console.log("split enemy", enemyArray);

		sendChampionToPocketballs(championArray, championBattleArray);
		sendEnemyToPocketballs(enemyArray, enemyBattleArray);
	})
	.catch((error) => {
		console.error("404 getPokemonNames .then-block:", error.message);
	});

// PUSH ARRAYS TO DOM, AND DISPLAY IN UI
function sendChampionToPocketballs(championArray, championBattleArray) {
	if (championBattleArray.length === 0) {
		console.log("The field is empty. Go!");
	} else {
		console.log("You can only do battle with one Pokémon at a time!");
		return;
	}

	championArray.forEach((pokemon, index) => {
		const pocketball = createPocketball(pokemon);
		pocketballContainers[0].appendChild(pocketball);

		pocketball.addEventListener("click", () => {
			champToBattle(pokemon, index, championArray, championBattleArray);
		});
	});
}

function sendEnemyToPocketballs(enemyArray, enemyBattleArray) {
	if (enemyBattleArray.length === 0) {
		console.log("The field is empty. Go!");
	} else {
		console.log("You can only do battle with one Pokémon at a time!");
		return;
	}

	enemyArray.forEach((pokemon, index) => {
		const pocketball = createPocketball(pokemon);
		pocketballContainers[1].appendChild(pocketball);

		pocketball.addEventListener("click", () => {
			enemyToBattle(pokemon, index, enemyArray, enemyBattleArray);
		});
	});
}

function createPocketball(pokemon) {
	const pocketball = document.createElement("div");
	pocketball.classList.add("pocketball");

	const pocketballImg = document.createElement("img");
	pocketballImg.classList.add("pocketball-img");
	pocketballImg.src = "assets/ball_rgb_closed.png";
	//pocketballImg.setAttribute("pocketball-img-index", pokeballimgIndex);

	const divider = document.createElement("div");
	divider.classList.add("divider");

	const txtContainer = document.createElement("div");
	txtContainer.classList.add("txt-container");
	txtContainer.innerHTML = `${pokemon.name}<br />${pokemon.currentHP} / ${pokemon.maxHP}<br />`;

	pokemon.alive = true;
	pokemon.battling = false;
	pokemon.inBall = true;

	pocketball.append(pocketballImg, divider, txtContainer);
	return pocketball;
}

// TO BATTLE!
function champToBattle(clickedPokemon, index, championArray, championBattleArray) {
	if (index >= 0 && index < championArray.length && championBattleArray.length === 0) {
		championArray.splice(index, 1);
		championBattleArray.push(clickedPokemon);

		console.log("Champion to battle", championBattleArray);
		clickedPokemon.champion = true;

		championStats(clickedPokemon);
	} else if (championBattleArray.length > 0) {
		console.log("You can only do battle with one pokémon at a time!");
	}
}

function enemyToBattle(clickedPokemon, index, enemyArray, enemyBattleArray) {
	//if (index >= 0 && index < enemyArray.length && enemyBattleArray.length === 0) {
	enemyArray.splice(index, 1);
	enemyBattleArray.push(clickedPokemon);

	console.log("Enemy to battle", enemyBattleArray);
	clickedPokemon.enemy = true;

	enemyStats(clickedPokemon);
	/*} else {
		console.log("You can only do battle with one pokémon at a time!");
	}*/
}

// DISPLAY BATTLE STATS
function championStats(clickedPokemon) {
	battleContainers[0].innerHTML = "";
	const txtContainer = createStatDisplay(clickedPokemon);
	battleContainers[0].appendChild(txtContainer);
}

function enemyStats(clickedPokemon) {
	battleContainers[1].innerHTML = "";
	const txtContainer = createStatDisplay(clickedPokemon);
	battleContainers[1].appendChild(txtContainer);
}

function createStatDisplay(pokemon) {
	pokemon.alive = true;
	pokemon.battling = true;
	pokemon.inBall = false;

	const txtContainer = document.createElement("div");
	txtContainer.classList.add("pokemon-stats");
	/*txtContainer.addEventListener("click", function () {
		setUpAttack(clickedPokemon);
	});*/

	txtContainer.innerHTML = `<p><img src="${pokemon.sprite}" class="sprite-to-display" alt="The official artwork of ${
		pokemon.name
	}" />
	<br />
	#${pokemon.id} ${pokemon.name}<br />
    ${pokemon.currentHP} / ${pokemon.maxHP}</p>
    <br />
    <p>Attack: ${pokemon.attack}<br />
    Defense: ${pokemon.defense}<br />
    Speed: ${pokemon.speed}</p>
    <br />
    <p>Type: ${pokemon.typeOne}, ${pokemon.typeTwo || ""}</p>`;

	return txtContainer;
}

// EXECUTE ATTACK
/*
function setUpAttack(pokemon) {
	let highestStatGoesFirst;

	if (championBattleArray[0].speed > enemyBattleArray[0].speed) {
		highestStatGoesFirst = championBattleArray[0];
	} else if (enemyBattleArray[0].speed > championBattleArray[0].speed) {
		highestStatGoesFirst = enemyBattleArray[0];
	} else {
		const randomGoesFirst = Math.random();
		highestStatGoesFirst = randomGoesFirst < 0.5 ? championBattleArray[0] : enemyBattleArray[0];
	}
	if (highestStatGoesFirst === championBattleArray[0]) {
		//championAttack();
		//enemyAttack();
		console.log("this triggers the champion attack");
	} else {
		//enemyAttack();
		//championAttack();
		console.log("this triggers the enemy attack");
	}
}
*/
/*


function attackAlert(index) {
	const heroX = heroesArray[index];
	if (heroX && heroX.alive) {
		if (index === 0) {
			
			dragonObject.currentHP -= heroesArray[0].damage;
			
		} else if (index === 1) {
			
			dragonObject.currentHP -= heroesArray[1].damage;
			
		} else if (index === 2) {
			
			dragonObject.currentHP -= heroesArray[2].damage;
			
		}
		
	}
}

function dragonAttack() {
	let heroAlive = heroesArray.filter((hero) => hero.alive);

	if (heroAlive.length > 0) {
		let randomTarget = Math.floor(Math.random() * heroAlive.length);
		let targetHero = heroAlive[randomTarget];

		alert(`${dragonObject.name} har angrepet ${targetHero.name}!`);
		targetHero.currentHP -= dragonObject.damage;
		updateHeroesHP();

		if (targetHero.currentHP <= 0) {
			targetHero.alive = false;
		}
		if (youLost()) {
			setTimeout(function () {
				alert(`Spillet er tapt! ${dragonObject.name} har vunnet!`);
			}, 500);
		}
	}
}

function youLost() {
	return heroesArray.every((hero) => !hero.alive);
}

function updateDragonHP() {
	dragonHealthTxt.innerHTML = `${dragonObject.currentHP} / ${dragonObject.maxHP} HP`;

	if (dragonObject.currentHP <= 0) {
		let daarDragon = document.querySelector(".enemy-container");
		if (daarDragon) {
			daarDragon.remove();

			setTimeout(function () {
				alert("Gratulerer, du har vunnet spillet!");
			}, 500);
		}
	}
}

function updateHeroesHP() {
	healerHealthTxt.innerHTML = `${heroesArray[0].currentHP} / ${heroesArray[0].maxHP} HP`;
	archerHealthTxt.innerHTML = `${heroesArray[1].currentHP} / ${heroesArray[1].maxHP} HP`;
	warriorHealthTxt.innerHTML = `${heroesArray[2].currentHP} / ${heroesArray[2].maxHP} HP`;

	if (heroesArray[0].currentHP <= 0) {
		let heroHealer = document.querySelector(".img-container.healer");
		if (heroHealer) {
			heroHealer.remove();
			setTimeout(function () {
				alert(`${heroesArray[0].name} er ute av kampen!`);
			}, 250);
		}
	}
	if (heroesArray[1].currentHP <= 0) {
		let heroArcher = document.querySelector(".img-container.archer");
		if (heroArcher) {
			heroArcher.remove();
			setTimeout(function () {
				alert(`${heroesArray[1].name} er ute av kampen!`);
			}, 250);
		}
	}
	if (heroesArray[2].currentHP <= 0) {
		let heroWarrior = document.querySelector(".img-container.warrior");
		if (heroWarrior) {
			heroWarrior.remove();
			setTimeout(function () {
				alert(`${heroesArray[2].name} er ute av kampen!`);
			}, 250);
		}
	}
}


*/
