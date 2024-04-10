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
