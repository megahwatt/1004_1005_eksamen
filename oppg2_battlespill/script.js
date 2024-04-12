// ARRAYS
let pokemonNamesArray = [];
let pokemonDataArray = [];

let championArray = [];
let enemyArray = [];

let championBattleArray = [];
let enemyBattleArray = [];

const pokeballImgs = ["assets/ball_bw.png", "assets/ball_rgb_closed.png", "assets/ball_rgb_open.png"];
/*
sprite
id
name

currentHP
maxHP

currentXP
targetXP

attack
defense
speed

typeI
typeII

alive
battling
inpocketball
*/

// GLOBAL VARIABLES
var mainBattleContainer = document.querySelector(".main-battle-container");
var battleContainers = mainBattleContainer.querySelectorAll(".battle-container");

var mainPocketballContainer = document.querySelector(".main-pocketball-container");
var pocketballContainers = mainPocketballContainer.querySelectorAll(".pocketball-container");

var pocketballs = document.querySelectorAll(".pocketball");

var txtContainer = document.querySelectorAll(".txt-container");

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
		outputArrayToConsole();
	} catch (error) {
		console.error("404 getPokemonData || Couldn't fetch", error);
	}
}
/*
sprite
id
name

currentHP
maxHP

currentXP
targetXP

attack
defense
speed

typeI
typeII

alive
battling
inpocketball
*/
function outputArrayToConsole() {
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
}

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
		sendArraysToPocketballs(championArray, enemyArray, championBattleArray, enemyBattleArray);
	})
	.catch((error) => {
		console.error("404 getPokemonNames .then-block:", error.message);
	});

// PUSH ARRAYS TO DOM, AND DISPLAY IN UI
function sendArraysToPocketballs(championArray, enemyArray) {
	championArray.forEach((pokemon, index) => {
		const pocketball = createPocketball(pokemon);
		pocketballContainers[0].appendChild(pocketball);

		console.log("Creating event listener for", pokemon.name);

		pocketball.addEventListener("click", () => {
			console.log(`Clicked on pocketball for ${pokemon.name}`);

			champToBattle(index, championArray, championBattleArray, pokemon);

			pocketball.querySelector(".pocketball-img").src = "assets/ball_rgb_open.png";
		});
	});

	enemyArray.forEach((pokemon, index) => {
		const pocketball = createPocketball(pokemon);
		pocketballContainers[1].appendChild(pocketball);

		console.log("Creating event listener for", pokemon.name);

		pocketball.addEventListener("click", () => {
			console.log(`Clicked on pocketball for ${pokemon.name}`);

			enemyToBattle(index, enemyArray, enemyBattleArray, pokemon);

			pocketball.querySelector(".pocketball-img").src = "assets/ball_rgb_open.png";
		});
	});
}

function createPocketball(pokemon) {
	const pocketball = document.createElement("div");
	pocketball.classList.add("pocketball");

	const pocketballImg = document.createElement("img");
	pocketballImg.classList.add("pocketball-img");
	pocketballImg.src = "assets/ball_rgb_closed.png";

	const divider = document.createElement("div");
	divider.classList.add("divider");

	const txtContainer = document.createElement("div");
	txtContainer.classList.add("txt-container");
	txtContainer.innerHTML = `${pokemon.name}<br />${pokemon.currentHP} / ${pokemon.maxHP}<br />`;

	pocketball.append(pocketballImg, divider, txtContainer);
	return pocketball;
}

// TO BATTLE!
function champToBattle(index, championArray, championBattleArray, clickedPokemon) {
	if (index >= 0 && index < championArray.length && championBattleArray.length === 0) {
		championArray.splice(index, 1);
		championBattleArray.push(clickedPokemon);
		console.log("Champion to battle", championBattleArray);

		championStats(clickedPokemon);
	} else {
		console.log("You can only do battle with one pokémon at a time!");
	}
}

function enemyToBattle(index, enemyArray, enemyBattleArray, clickedPokemon) {
	if (index >= 0 && index < enemyArray.length && enemyBattleArray.length === 0) {
		enemyArray.splice(index, 1);
		enemyBattleArray.push(clickedPokemon);
		console.log("Enemy to battle", enemyBattleArray);

		enemyStats(clickedPokemon);
	} else {
		console.log("You can only do battle with one pokémon at a time!");
	}
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
	const txtContainer = document.createElement("div");
	txtContainer.classList.add("pokemon-stats");

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
const attacker = document.querySelectorAll("txtContainer");

attacker.forEach(function (attack) {
	attack.addEventListener("click", function () {
		executeAttack();
	});
});

function executeAttack() {}

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

const heroX = document.querySelectorAll(".img-container");

heroX.forEach(function (heroAttack, index) {
	heroAttack.addEventListener("click", function () {
		attackAlert(index);
	});
});

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

*/
