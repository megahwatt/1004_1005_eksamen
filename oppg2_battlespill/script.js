// ARRAYS
let pokemonNamesArray = [];
let pokemonDataArray = [];

let championArray = [];
let enemyArray = [];
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

// FETCH DATA FROM API
const urlGenI = `https://pokeapi.co/api/v2/generation/1`;
const urlPokemonID = `https://pokeapi.co/api/v2/pokemon/`;
const pokemonsToFetch = [1, 18, 26, 27, 31, 43, 49, 63, 76, 80, 94, 148];

async function getPokemonNames() {
	try {
		const pokemonNames = await (await fetch(urlGenI)).json();
		pokemonNamesArray = pokemonNames.pokemon_species.map((pokemon) => pokemon.name);
		console.log("pokemonnamesarray", pokemonNamesArray);
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

function outputArrayToConsole() {
	pokemonDataArray.forEach((pokemon) => {
		console.log("sprite", pokemon.sprite);
		console.log("id", pokemon.id);
		console.log("name", pokemon.name);
		console.log("maxHP", pokemon.maxHP);
		console.log("attack", pokemon.attack);
		console.log("defense", pokemon.defense);
		console.log("speed", pokemon.speed);
		console.log("typeOne", pokemon.typeOne);
		console.log("typeTwo", pokemon.typeTwo);
	});
}

function divideAndConquer(pokemonDataArray) {
	for (let i = pokemonDataArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pokemonDataArray[i], pokemonDataArray[j]] = [pokemonDataArray[j], pokemonDataArray[i]];
	}

	const split = Math.ceil(pokemonDataArray.length / 2);
	const championArray = pokemonDataArray.slice(0, split);
	const enemyArray = pokemonDataArray.slice(0, split);

	pokemonDataArray.length = 0;

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
	})
	.catch((error) => {
		console.error("Error:", error.message);
	});

/*
let championArray = [
	{
		id: 0,
		name: "XX",
		hp: 0,
		currenthp: 0,
		xp: 0,
		targetxp: 0,
		attack: 0,
		defense: 0,
		speed: 0,
		alive: true,
		battling: false,
		inpockeball: true,
	},
];

let enemyArray = [
	{
		id: 0,
		name: "XX",
		hp: 0,
		currenthp: 0,
		xp: 0,
		targetxp: 0,
		attack: 0,
		defense: 0,
		alive: true,
		battling: false,
		inpockeball: true,
	},
];
*/
/*
var healerNameTxt = document.getElementById("healer-name-txt");
healerNameTxt.innerHTML = "Henriette Healer";

var healerHealthTxt = document.getElementById("healer-health-txt");
healerHealthTxt.innerHTML = `${heroesArray[0].currentHP} / ${heroesArray[0].maxHP} HP`;

var archerNameTxt = document.getElementById("archer-name-txt");
archerNameTxt.innerHTML = "Ariana Archer";

var archerHealthTxt = document.getElementById("archer-health-txt");
archerHealthTxt.innerHTML = `${heroesArray[1].currentHP} / ${heroesArray[1].maxHP} HP`;

var warriorNameTxt = document.getElementById("warrior-name-txt");
warriorNameTxt.innerHTML = "Wyona Warrior";

var warriorHealthTxt = document.getElementById("warrior-health-txt");
warriorHealthTxt.innerHTML = `${heroesArray[2].currentHP} / ${heroesArray[2].maxHP} HP`;

var dragonNameTxt = document.getElementById("dragon-name-txt");
dragonNameTxt.innerHTML = "Daar Dragon";

var dragonHealthTxt = document.querySelector(".dragon-health-txt");
dragonHealthTxt.innerHTML = `${dragonObject.currentHP} / ${dragonObject.maxHP} HP`;

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

function attackAlert(index) {
	const heroX = heroesArray[index];
	if (heroX && heroX.alive) {
		if (index === 0) {
			alert(`${heroesArray[0].name} har gjort ${heroesArray[0].damage} skade på ${dragonObject.name}`);
			dragonObject.currentHP -= heroesArray[0].damage;
			updateDragonHP();
		} else if (index === 1) {
			alert(`${heroesArray[1].name} har gjort ${heroesArray[1].damage} skade på ${dragonObject.name}`);
			dragonObject.currentHP -= heroesArray[1].damage;
			updateDragonHP();
		} else if (index === 2) {
			alert(`${heroesArray[2].name} har gjort ${heroesArray[2].damage} skade på ${dragonObject.name}`);
			dragonObject.currentHP -= heroesArray[2].damage;
			updateDragonHP();
		}
		dragonAttack();
	}
}
*/
