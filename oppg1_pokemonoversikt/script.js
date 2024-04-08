// Global variables
let pokeArray = [];
const pokeNames = [];
let savedPokes = [];

const container = document.querySelector(".container");
const filterBtns = document.querySelectorAll(".filter");
let masterballs = document.querySelectorAll(".masterball");

// Fetch API and data about each pokémon in Gen I, II, III and IV
/*
Very manual error-handling of the Pokémons that could not be fetched,
due to issues with the throw error function.
Proritised the exam as a whole over elegant error handling.
*/
async function gottaCatchEmAll() {
	try {
		const [dataGenI, dataGenII, dataGenIII, dataGenIV] = await Promise.all([
			(await fetch("https://pokeapi.co/api/v2/generation/1")).json(),
			(await fetch("https://pokeapi.co/api/v2/generation/2")).json(),
			(await fetch("https://pokeapi.co/api/v2/generation/3")).json(),
			(await fetch("https://pokeapi.co/api/v2/generation/4")).json(),
		]);

		[dataGenI, dataGenII, dataGenIII, dataGenIV].forEach((data) => {
			data.pokemon_species.forEach((pokemon) => {
				pokeNames.push(pokemon.name);
			});
		});

		/*
		Utilizing the Fisher-Yates shuffle algorithm to scramble the Pokémon-generations,
		so we get a true random selection upon page load instead of Gen I's 1-49.
		*/
		for (let i = pokeNames.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pokeNames[i], pokeNames[j]] = [pokeNames[j], pokeNames[i]];
		}

		console.log("Gotcha! First four generations were caught!");
		return pokeNames;
	} catch (error) {
		console.error("Oh no, the Pokémons broke free!", error);
	}
}

async function getPokeData(pokeNames) {
	try {
		for (const name of pokeNames) {
			if (name.split("-").length > 1) {
				continue;
			}
			if (name === "deoxys" || name === "giratina" || name === "wormadam" || name === "shaymin") {
				continue;
			}

			const pokeData = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)).json();
			const pokeID = pokeData.id;
			const pokeTypeURL = pokeData.types[0].type.url;
			const typeData = await (await fetch(pokeTypeURL)).json();
			const pokeTypeID = typeData.id;
			const type = typeData.name;
			const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeID}.png`;
			pokeArray.push({ sprite, name, type, pokeID, pokeTypeID });
		}

		createMasterballs();

		return pokeArray;
	} catch (error) {
		console.error("getPokeData 404", error);
		throw error;
	}
}

gottaCatchEmAll().then((pokeNames) => {
	getPokeData(pokeNames)
		.then((result) => {
			console.log("getPokeData result", result);
		})
		.catch((error) => {
			console.error("call gottaCatchEmAll 404", error);
		});
});

// Filter and styling by typeID
const typeInfo = [
	{ id: 0, name: "All", light: "transparent", dark: "transparent" },
	{ id: 1, name: "Normal", light: "#d0d1d0", dark: "#9c9d9a" },
	{ id: 2, name: "Fighting", light: "#ffc53a", dark: "#fa7d00" },
	{ id: 3, name: "Flying", light: "#bad9f7", dark: "#7eb5e6" },
	{ id: 4, name: "Poison", light: "#cb7ce6", dark: "#8c3ec3" },
	{ id: 5, name: "Ground", light: "#ce925a", dark: "#8c4e1e" },
	{ id: 6, name: "Rock", light: "#d9d5c3", dark: "#ada57b" },
	{ id: 7, name: "Bug", light: "#cbd452", dark: "#8c9d19" },
	{ id: 8, name: "Ghost", light: "#b27cb2", dark: "#6e3e6b" },
	{ id: 9, name: "Steel", light: "#9accd6", dark: "#5d9db2" },
	{ id: 10, name: "Fire", light: "#f76868", dark: "#de2626" },
	{ id: 11, name: "Water", light: "#63c0f7", dark: "#267de6" },
	{ id: 12, name: "Grass", light: "#7ed263", dark: "#3f9d26" },
	{ id: 13, name: "Electric", light: "#fce03a", dark: "#f4bc00" },
	{ id: 14, name: "Psychic", light: "#f780ba", dark: "#e9457b" },
	{ id: 15, name: "Ice", light: "#7bebff", dark: "#3fd2f4" },
	{ id: 16, name: "Dragon", light: "#8c9eef", dark: "#505ed6" },
	{ id: 17, name: "Dark", light: "#8f7c7e", dark: "#503e3c" },
	{ id: 18, name: "Fairy", light: "#f7a9f7", dark: "#ec6de6" },
];

function refreshPokes() {
	window.location.reload();
}

filterBtns.forEach((img) => {
	img.addEventListener("click", filterClick);
});

function filterByType(selectedType) {
	masterballs.forEach((masterball) => {
		const typeID = parseInt(masterball.dataset.typeId);
		const buttons = masterball.querySelectorAll(".save-btn, .delete-btn, .edit-btn");
		const sprite = masterball.querySelector(".sprite");

		masterball.style.display = selectedType === "" || typeID === parseInt(selectedType) ? "block" : "none";

		if (selectedType === "") {
			sprite.style.backgroundColor = "transparent";
			buttons.forEach((button) => {
				button.style.backgroundColor = "transparent";
			});
		} else {
			sprite.style.backgroundColor = typeInfo[typeID].dark;
			buttons.forEach((button) => {
				button.style.backgroundColor = typeInfo[typeID].light;
			});
		}
	});
}

function filterClick(event) {
	selectedType = event.currentTarget.getAttribute("data-type");
	if (selectedType === "") {
		refreshPokes();
	} else {
		filterByType(selectedType);
	}
}

// Create pokémon-cards
function createMasterballs() {
	const maxFifty = pokeArray.slice(0, 50);
	maxFifty.forEach((pokemon, index) => {
		const masterball = document.createElement("div");
		masterball.classList.add("masterball");
		masterball.dataset.typeId = pokemon.pokeTypeID;

		const pokecard = document.createElement("div");
		pokecard.classList.add("pokecard");

		const sprite = document.createElement("img");
		sprite.classList.add("sprite");
		sprite.src = pokemon.sprite;
		sprite.alt = `The official artwork of ${pokemon.name}`;

		const name = document.createElement("div");
		name.classList.add("name");
		name.innerHTML = pokemon.name;

		const typeName = document.createElement("div");
		typeName.classList.add("type-name");
		typeName.innerHTML = pokemon.type;

		const id = document.createElement("div");
		id.classList.add("id");
		id.innerHTML = `#${pokemon.pokeID}`;

		const btnContainer = document.createElement("div");
		btnContainer.classList.add("btn-container");

		const saveBtn = createSaveBtn(index);
		const deleteBtn = createDeleteBtn(index);
		const editBtn = createEditBtn(index);

		pokecard.append(sprite, name, typeName, id);
		btnContainer.append(saveBtn, deleteBtn, editBtn);

		masterball.append(pokecard, btnContainer);

		container.append(masterball);
	});
	masterballs = document.querySelectorAll(".masterball");
	filterByType("");
}
createMasterballs();

// Save Pokémons to array and local storage
const caughtPokes = document.querySelector(".caught-pokes");

function createSaveBtn(index) {
	const saveBtn = document.createElement("button");
	saveBtn.classList.add("save-btn");
	saveBtn.innerHTML = "SAVE";

	saveBtn.addEventListener("click", function () {
		catchPokemon(index);
		updateSavedPokemons(index);
	});

	return saveBtn;
}

function tooManySaved() {
	const alertBubble = document.createElement("div");
	alertBubble.classList.add("alert-bubble");
	alertBubble.innerHTML = `<p>OH NO!<br/>You can only carry 5 Pokémons!</p>`;
	document.body.append(alertBubble);

	setTimeout(() => {
		document.body.removeChild(alertBubble);
	}, 5000);
}

function catchPokemon(index) {
	const selectedPokemon = pokeArray[index];

	const alreadyCaughtThis = savedPokes.some((pokemon) => pokemon.name === selectedPokemon.name);

	if (!alreadyCaughtThis) {
		if (savedPokes.length < 5) {
			savedPokes.push(selectedPokemon);
			localStorage.setItem("savedPokes", JSON.stringify(savedPokes));

			const cloakMasterball = masterballs[index];
			if (cloakMasterball) {
				cloakMasterball.classList.add("hide");
			}
		} else {
			tooManySaved();
			console.log("Oh no! You can only carry 5 Pokémons!");
		}
	} else {
		console.log("This Pokémon has already been caught!");
	}
}

function updateSavedPokemons(index) {
	caughtPokes.innerHTML = "";
	const savedPokeList = JSON.parse(localStorage.getItem("savedPokes")) || [];

	savedPokeList.forEach((pokemon) => {
		const masterball = document.createElement("div");
		masterball.classList.add("masterball");
		masterball.dataset.typeId = pokemon.pokeTypeID;

		const pokecard = document.createElement("div");
		pokecard.classList.add("pokecard");

		const sprite = document.createElement("img");
		sprite.classList.add("sprite");
		sprite.src = pokemon.sprite;
		sprite.alt = `The official artwork of ${pokemon.name}`;
		sprite.style.backgroundColor = typeInfo[pokemon.pokeTypeID].dark;

		const name = document.createElement("div");
		name.classList.add("name");
		name.innerHTML = pokemon.name;

		const typeName = document.createElement("div");
		typeName.classList.add("type-name");
		typeName.innerHTML = typeInfo[pokemon.pokeTypeID].name;

		const id = document.createElement("div");
		id.classList.add("id");
		id.innerHTML = `#${pokemon.pokeID}`;

		const btnContainer = document.createElement("div");
		btnContainer.classList.add("btn-container");

		const deleteBtn = createDeleteBtn(index);
		deleteBtn.style.backgroundColor = typeInfo[pokemon.pokeTypeID].light;

		const editBtn = createEditBtn(index);
		editBtn.style.backgroundColor = typeInfo[pokemon.pokeTypeID].light;

		pokecard.append(sprite, name, typeName, id);
		btnContainer.append(deleteBtn, editBtn);

		masterball.append(pokecard, btnContainer);

		caughtPokes.append(masterball);
	});
}

// Delete
function createDeleteBtn(index) {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.innerHTML = "DELETE";

	deleteBtn.addEventListener("click", function () {
		releasePokemon(index);
	});
	return deleteBtn;
}

function releasePokemon(index) {
	pokeArray.splice(index, 1);
	savedPokes.splice(index, 1);

	const releaseMasterball = masterballs[index];
	if (releaseMasterball && releaseMasterball.parentNode) {
		releaseMasterball.parentNode.removeChild(releaseMasterball);
	}

	localStorage.setItem("savedPokes", JSON.stringify(savedPokes));
	updateSavedPokemons();
}

// Edit
function createEditBtn(index) {
	const editBtn = document.createElement("button");
	editBtn.classList.add("edit-btn");
	editBtn.innerHTML = "EDIT";

	editBtn.addEventListener("click", function () {
		editPokemon(index);
	});

	return editBtn;
}

function updateShownPokes(index, newPokeName, newPokeType) {
	applyEdits(index, newPokeName, newPokeType, pokeArray);
	applyEdits(index, newPokeName, newPokeType, savedPokes);
}

function applyEdits(index, newPokeName, newPokeType) {
	if (masterballs && index >= 0 && index < masterballs.length) {
		const name = masterballs[index].querySelector(".name");
		const sprite = masterballs[index].querySelector(".sprite");
		const typeName = masterballs[index].querySelector(".type-name");
		const buttons = masterballs[index].querySelectorAll(".save-btn, .delete-btn, .edit-btn");

		name.innerHTML = newPokeName;
		typeName.innerHTML = typeInfo.find((type) => type.id === newPokeType).name;
		sprite.style.backgroundColor = typeInfo[newPokeType].dark;
		buttons.forEach((button) => {
			button.style.backgroundColor = typeInfo[newPokeType].light;
		});
	} else {
		console.error("Arrayet er tomt./Finner ikke index.");
	}
}

function editPokemon(index) {
	const newPokeName = prompt("Gi Pokémonen et kallenavn!");
	const newPokeType = parseInt(prompt("Skriv inn et tall fra 1-18 for å endre Pokémonen's type."));

	if (newPokeName && newPokeType >= 1 && newPokeType <= 18) {
		if (index >= 0 && index < pokeArray.length) {
			pokeArray[index].name = newPokeName;
			pokeArray[index].pokeTypeID = newPokeType;
			pokeArray[index].type = typeInfo.find((type) => type.id === newPokeType).name;
			localStorage.setItem("pokeArray", JSON.stringify(pokeArray));
			updateShownPokes(index, newPokeName, newPokeType);
		} else if (index >= 0 && index < savedPokes.length) {
			savedPokes[index].name = newPokeName;
			savedPokes[index].pokeTypeID = newPokeType;
			savedPokes[index].type = typeInfo.find((type) => type.id === newPokeType).name;
			localStorage.setItem("savedPokes", JSON.stringify(savedPokes));
			updateShownPokes(index, newPokeName, newPokeType);
		} else {
			console.error("Arrayet er tomt./Finner ikke index.");
		}
	} else {
		alert("Ugyldig input. Vennligst velg et tall fra 1 til 18.");
	}
}

// Create your own
function fetchEasteregg() {
	const eastereggs = [
		{ name: "img1", path: "assets/eastereggs/01_agumon.webp" },
		{ name: "img2", path: "assets/eastereggs/02_gabumon.webp" },
		{ name: "img3", path: "assets/eastereggs/03_biyomon.webp" },
		{ name: "img4", path: "assets/eastereggs/04_tentomon.webp" },
		{ name: "img5", path: "assets/eastereggs/05_palmon.webp" },
		{ name: "img6", path: "assets/eastereggs/06_gomamon.webp" },
		{ name: "img7", path: "assets/eastereggs/07_patamon.webp" },
		{ name: "img8", path: "assets/eastereggs/08_gatomon.webp" },
	];

	const randomIndex = Math.floor(Math.random() * eastereggs.length);
	return eastereggs[randomIndex].path;
}

function createPokemonBtn() {
	const createBtn = document.querySelector("#create-btn");

	createBtn.addEventListener("click", function () {
		const yourPokeType = document.querySelector("#type-selector").value;
		createPokemon(yourPokeType);
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			const yourPokeType = document.querySelector("#type-selector").value;
			createPokemon(yourPokeType);
		}
	});
}
createPokemonBtn();

function createPokemon(yourPokeType) {
	const yourPokemon = { yourPokeType, eastereggSprite: fetchEasteregg() };

	pokeArray.push(yourPokemon);
	localStorage.setItem("pokeArray", JSON.stringify(pokeArray));

	assemblePokemon(pokeArray.length - 1, yourPokemon, yourPokeType);
}

function assemblePokemon(index, yourPokemon, yourPokeType) {
	const newCard = document.createElement("div");
	newCard.classList.add("new-card");
	newCard.dataset.typeId = yourPokeType;

	const pokecard = document.createElement("div");
	pokecard.classList.add("pokecard");

	const eastereggSprite = document.createElement("img");
	eastereggSprite.classList.add("easteregg-sprite");
	eastereggSprite.src = yourPokemon.eastereggSprite;
	eastereggSprite.alt = `Sprite of ${yourPokemon.yourPokeName}`;
	//eastereggSprite.style.backgroundColor = yourPokeType.typeInfo.dark;

	const yourPokeName = document.createElement("div");
	yourPokeName.classList.add("your-pokename");
	yourPokeName.innerHTML = yourPokemon.yourPokeName;

	const yourPokeTypeElement = document.createElement("div");
	yourPokeTypeElement.classList.add("your-poke-type");
	//yourPokeTypeElement.innerHTML = typeInfo[yourPokeType].name;

	const btnContainer = document.createElement("div");
	btnContainer.classList.add("btn-container");

	const saveBtn = createSaveBtn(index);
	const deleteBtn = createDeleteBtn(index);
	const editBtn = createEditBtn(index);

	pokecard.append(eastereggSprite, yourPokeName, yourPokeTypeElement, btnContainer);

	btnContainer.append(saveBtn, deleteBtn, editBtn);

	newCard.append(pokecard, btnContainer);

	container.prepend(newCard);

	return newCard;
}
