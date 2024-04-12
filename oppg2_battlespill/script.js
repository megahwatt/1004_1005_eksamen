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

			const pokemonTypes = pokemonData.types;
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
				types: pokemonTypes,
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
	championArray.forEach((pokemon, index) => {
		const pocketball = createPocketball(pokemon);
		pocketballContainers[0].appendChild(pocketball);

		pocketball.addEventListener("click", () => {
			champToBattle(pokemon, index, championArray, championBattleArray);
		});
	});
}

function sendEnemyToPocketballs(enemyArray, enemyBattleArray) {
	enemyArray.forEach((pokemon, index) => {
		const pocketball = createPocketball(pokemon, index);
		pocketballContainers[1].appendChild(pocketball);
		const pocketballIndex = index;

		pocketball.addEventListener("click", () => {
			enemyToBattle(pokemon, pocketballIndex, enemyArray, enemyBattleArray);
		});
	});
}

function createPocketball(pokemon, index) {
	const pocketball = document.createElement("div");
	pocketball.classList.add("pocketball");
	pocketball.dataset.index = index;

	const pocketballImg = document.createElement("img");
	pocketballImg.classList.add("pocketball-img");
	pocketballImg.src = "assets/ball_rgb_closed.png";

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

		const championContainer = document.querySelector(".pocketball-container.champion");
		const pocketballImg = championContainer.querySelectorAll(".pocketball-img")[index];
		pocketballImg.src = "assets/ball_rgb_open.png";
	} else if (championBattleArray.length > 0) {
		console.log("You can only do battle with one pokémon at a time!");
	}
}

function enemyToBattle(clickedPokemon, index, enemyArray, enemyBattleArray) {
	if (index >= 0 && index < enemyArray.length && enemyBattleArray.length === 0) {
		enemyArray.splice(index, 1);
		enemyBattleArray.push(clickedPokemon);

		console.log("Enemy to battle", enemyBattleArray);
		clickedPokemon.enemy = true;

		enemyStats(clickedPokemon);

		const enemyContainer = document.querySelector(".pocketball-container.enemy");
		const pocketballImg = enemyContainer.querySelectorAll(".pocketball-img")[index];
		pocketballImg.src = "assets/ball_rgb_open.png";
	} else if (enemyBattleArray.length > 0) {
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
	pokemon.alive = true;
	pokemon.battling = true;
	pokemon.inBall = false;

	const txtContainer = document.createElement("div");
	txtContainer.classList.add("pokemon-stats");
	txtContainer.addEventListener("click", function () {
		const champion = championBattleArray[0];
		const enemy = enemyBattleArray[0];
		championAttack(champion, enemy);
	});

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
function championAttack(champion, enemy) {
	const championAttack = champion.attack;
	console.log("championAttack:", championAttack);

	const enemyDefense = enemy.defense;
	console.log("enemyDefense:", enemyDefense);

	const damage = championAttack - enemyDefense;
	console.log("damage:", damage);

	if (championAttack === enemyDefense) {
		console.log("The attack had no effect!");
	} else if (championAttack > enemyDefense) {
		console.log("Damage dealt!");
		enemy.currentHP -= damage;
		console.log("enemy hp after attack:", enemy.currentHP);
	} else if (championAttack < enemyDefense) {
		const recoil = enemyDefense - championAttack;
		console.log("Ouch! Attacker was damaged by recoil!");
		champion.currentHP -= recoil;
		console.log("Champion HP after recoil:", champion.currentHP);
	}
	updateFilters(champion, enemy);
}

function updateFilters(champion, enemy) {
	if (champion.currentHP <= 0) {
		console.log("Champion fainted!");
		champion.alive = false;
		champion.battling = false;
		champion.inBall = true;
	}
	if (enemy.currentHP <= 0) {
		console.log("Enemy fainted!");
		enemy.alive = false;
		enemy.battling = false;
		enemy.inBall = true;
	}
}

/*function setupAttack(pokemon) {
	const championSpeed = parseInt(championBattleArray[0].map((pokemon) => pokemon.speed));
	const enemySpeed = parseInt(enemyBattleArray[0].map((pokemon) => pokemon.speed));

	let highestStatGoesFirst;

	if (championSpeed > enemySpeed) {
	} else if (enemySpeed > championSpeed) {
	} else {
		const randomGoesFirst = Math.random();
		highestStatGoesFirst = randomGoesFirst < 0.5 ? championSpeed : enemySpeed;
	}
	if (highestStatGoesFirst === championSpeed) {
		//championattack
	} else {
		//enemyattack
	}
}

// TYPE MATCHUP, chatGPT wrote this chart based off of the official matchup chart for gen I
function calculateAttackEffect() {
    const typeChart = {
        "grass": ["water", "ground", "rock"],
        "poison": ["grass"],
        "normal": [],
        "flying": ["grass", "bug"],
        "electric": ["water"],
        "ground": ["poison", "rock", "fire", "electric"],
        "bug": ["grass", "psychic"],
        "psychic": ["fighting", "poison"],
        "rock": ["flying", "bug", "fire", "ice"],
        "water": ["ground", "rock", "fire"],
        "ghost": ["psychic"],
        "dragon": ["dragon"]
    };

    let effect = 1;

    XXX.forEach(XXX => {
        if (typeChart[XXX].includes(XXX)) {
            effect *= 2
        } else if (typeChart[XXX].includes(XXX)) {
            effect *= 0.5;
        }
    });

    return effect;
}
*/
