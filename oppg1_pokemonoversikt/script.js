// GLOBAL VARIABLES
let pokeArray = [];
let pokeNames = [];
const savedPokes = [];
let cyoArray = [];

const caughtPokes = document.querySelector(".caught-pokes");
const container = document.querySelector(".container");
const filterBtns = document.querySelectorAll(".filter");
let masterballs = document.querySelectorAll(".masterball");
let savedMasterballs = document.querySelectorAll(".saved-masterball");

// INITIAL FETCH
async function gottaCatchEmAll() {
	try {
		const [dataGenI, dataGenII, dataGenIII, dataGenIV] = [
			await (await fetch("https://pokeapi.co/api/v2/generation/1")).json(),
			await (await fetch("https://pokeapi.co/api/v2/generation/2")).json(),
			await (await fetch("https://pokeapi.co/api/v2/generation/3")).json(),
			await (await fetch("https://pokeapi.co/api/v2/generation/4")).json(),
		];

		[dataGenI, dataGenII, dataGenIII, dataGenIV].forEach((data) => {
			data.pokemon_species.forEach((pokemon) => {
				pokeNames.push(pokemon.name);
			});
		});

		// Fisher-Yates algorithm: Scrambles fetched data
		for (let i = pokeNames.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pokeNames[i], pokeNames[j]] = [pokeNames[j], pokeNames[i]];
		}

		console.log("Gotcha! First four generations were caught!");
		return pokeNames;
	} catch {
		console.error("404 gottaCatchEmAll Oh no, the Pokémons broke free!", error.message);
		return [];
	}
}

async function getPokeData(pokeNames) {
	try {
		let pokeArray = [];
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

		return pokeArray;
	} catch {
		console.error("404 getPokeData couldn't call function", error.message);
		return [];
	}
}

gottaCatchEmAll().then((pokeNames) => {
	getPokeData(pokeNames)
		.then((result) => {
			pokeArray = result;
			createMasterballs();
		})
		.catch((error) => {
			console.error("404 gottaCatchEmAll couldn't call function", error.message);
			return [];
		});
});

// FILTER AND STYLING BY TYPE -- OPPG 1.2
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
	container.innerHTML = "";
	createMasterballs();
}

function refreshCaught() {
	caughtPokes.innerHTML = "";
	updateSavedPokemons();
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
	//const masterball = querySelector(".masterball");
	filterByType("");
}

// SAVE TO ARRAY AND LOCALSTORAGE -- OPPG 1.4
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

function updateAfterSave() {
	refreshPokes();
	updateSavedPokemons();
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

	const alreadyCaughtThis = savedPokes.findIndex((savedPoke) => savedPoke.pokeID === selectedPokemon.pokeID) !== -1;

	try {
		if (!alreadyCaughtThis) {
			if (savedPokes.length < 5) {
				savedPokes.push(selectedPokemon);
				pokeArray.splice(index, 1);
				localStorage.setItem("savedPokes", JSON.stringify(savedPokes));
				localStorage.setItem("pokeArray", JSON.stringify(pokeArray));
				updateAfterSave();
			} else {
				tooManySaved();
			}
		}
	} catch (error) {
		console.error("404 This Pokémon has already been caught!", error.message);
	}
}

function updateSavedPokemons(index) {
	caughtPokes.innerHTML = "";
	const savedPokeList = JSON.parse(localStorage.getItem("savedPokes")) || [];

	savedPokeList.forEach((pokemon) => {
		const savedMasterball = document.createElement("div");
		savedMasterball.classList.add("saved-masterball");
		savedMasterball.dataset.typeId = pokemon.pokeTypeID;

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

		savedMasterball.append(pokecard, btnContainer);

		caughtPokes.append(savedMasterball);
	});
}

// DELETE FROM ARRAY AND LOCALSTORAGE -- OPPG 1.5
function createDeleteBtn() {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.innerHTML = "DELETE";

	deleteBtn.addEventListener("click", function () {
		const masterball = deleteBtn.closest(".masterball") || deleteBtn.closest(".saved-masterball");
		try {
			if (masterball) {
				const masterballIndex = Array.from(masterball.parentNode.children).indexOf(masterball);
				releasePokemon(masterballIndex);
			}
		} catch (error) {
			console.error("404 createDeleteBtn no parent found:(", error.message);
		}
	});

	return deleteBtn;
}

function updateAfterDelete() {
	refreshPokes();
	refreshCaught();
}

function releasePokemon(index) {
	try {
		if (index !== undefined && index >= 0 && index < savedPokes.length) {
			savedPokes.splice(index, 1);
			localStorage.setItem("savedPokes", JSON.stringify(savedPokes));

			const savedMasterballDelete = caughtPokes.querySelector(`.saved-masterball:nth-child(${index + 1})`);
			if (savedMasterballDelete) {
				savedMasterballDelete.remove();
			}
			updateAfterDelete();
		} else if (index !== undefined && index >= 0 && index < pokeArray.length) {
			pokeArray.splice(index, 1);
			localStorage.setItem("pokeArray", JSON.stringify(pokeArray));

			const masterballDelete = container.querySelector(`.masterball:nth-child(${index + 1})`);
			if (masterballDelete) {
				masterballDelete.remove();
			}
			updateAfterDelete();
		}
	} catch (error) {
		console.error("404 releasePokemon invalid index", error.message);
	}
}

// EDIT MASTERBALLS TO DISPLAY ACROSS THE ENTIRE UI AND LOCALSTORAGE -- OPPG 1.6
function createEditBtn(index) {
	const editBtn = document.createElement("button");
	editBtn.classList.add("edit-btn");
	editBtn.innerHTML = "EDIT";

	editBtn.addEventListener("click", function () {
		editPokemon(index);
	});

	return editBtn;
}

function applyEdits(index, newPokeName, newPokeType, pokeArray, savedPokes) {
	try {
		const masterballs = container.children;
		const applyToArray = pokeArray || savedPokes;

		if (applyToArray && index >= 0 && index < applyToArray.length) {
			const masterball = masterballs[index];
			if (masterball) {
				const name = masterball.querySelector(".name");
				const sprite = masterball.querySelector(".sprite");
				const typeName = masterball.querySelector(".type-name");
				const buttons = masterball.querySelectorAll(".save-btn, .delete-btn, .edit-btn");

				name.innerHTML = newPokeName;
				typeName.innerHTML = typeInfo.find((type) => type.id === newPokeType).name;
				sprite.style.backgroundColor = typeInfo[newPokeType].dark;
				buttons.forEach((button) => {
					button.style.backgroundColor = typeInfo[newPokeType].light;
				});
			} else {
				console.log("404 applyEdits no children:(", masterballs);
			}
		} else {
			console.log("404 applyEdits no target", index, applyToArray);
		}
	} catch (error) {
		console.error("404 applyEdits couldn't execute function", error.message);
	}
}

function editPokemon(index) {
	const newPokeName = prompt("Gi Pokémonen et kallenavn!");
	const newPokeType = parseInt(prompt("Skriv inn et tall fra 1-18 for å endre Pokémonen's type."));
	try {
		if (newPokeName && newPokeType >= 1 && newPokeType <= 18) {
			if (index >= 0 && index < pokeArray.length) {
				pokeArray[index].name = newPokeName;
				pokeArray[index].pokeTypeID = newPokeType;
				pokeArray[index].type = typeInfo.find((type) => type.id === newPokeType).name;
				localStorage.setItem("pokeArray", JSON.stringify(pokeArray));
				applyEdits(index, newPokeName, newPokeType, pokeArray, typeInfo);
			} else if (index >= 0 && index < savedPokes.length) {
				savedPokes[index].name = newPokeName;
				savedPokes[index].pokeTypeID = newPokeType;
				savedPokes[index].type = typeInfo.find((type) => type.id === newPokeType).name;
				localStorage.setItem("savedPokes", JSON.stringify(savedPokes));
				applyEdits(index, newPokeName, newPokeType, savedPokes, typeInfo);
			} else {
				alert("Ugyldig input. Vennligst velg et tall fra 1 til 18.");
			}
		}
	} catch (error) {
		console.error("404 editPokemon empty array/invalid index", error.message);
	}
}

// CREATE YOUR OWN POCKET MONSTER -- OPPG 1.3
const cyoContainer = document.querySelector(".cyo-container");

function fetchEasteregg() {
	const eastereggs = [
		{ name: "img1", path: "//assets/eastereggs/01_agumon.webp" },
		{ name: "img2", path: "/assets/eastereggs/02_gabumon.webp" },
		{ name: "img3", path: "/assets/eastereggs/03_biyomon.webp" },
		{ name: "img4", path: "/assets/eastereggs/04_tentomon.webp" },
		{ name: "img5", path: "/assets/eastereggs/05_palmon.webp" },
		{ name: "img6", path: "/assets/eastereggs/06_gomamon.webp" },
		{ name: "img7", path: "/assets/eastereggs/07_patamon.webp" },
		{ name: "img8", path: "/assets/eastereggs/08_gatomon.webp" },
	];

	const randomIndex = Math.floor(Math.random() * eastereggs.length);
	return eastereggs[randomIndex].path;
}

const typeSelector = document.querySelector("#type-selector").value;

const typeSelectorIndex = parseInt(typeSelector);

function createPokemonBtn() {
	const createBtn = document.querySelector("#create-btn");

	createBtn.addEventListener("click", function () {
		const typeSelectorIndex = document.querySelector("#type-selector").value;
		createPokemon(typeSelectorIndex);
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			const typeSelectorIndex = document.querySelector("#type-selector").value;
			createPokemon(typeSelectorIndex);
		}
	});
}
createPokemonBtn();

function createPokemon(typeSelectorIndex) {
	const newName = document.querySelector("#your-pokename").value;

	const cyoMonster = { eastereggSprite: fetchEasteregg(), newName, typeSelectorIndex };

	pokeArray.push(cyoMonster);
	cyoArray.push(cyoMonster);
	localStorage.setItem("pokeArray", JSON.stringify(pokeArray));
	localStorage.setItem("cyoArray", JSON.stringify(cyoArray));

	assemblePokemon(pokeArray.length - 1, cyoMonster, typeSelectorIndex);
}

function assemblePokemon(cyoMonster, typeSelectorIndex) {
	const newCard = document.createElement("div");
	newCard.classList.add("new-card");
	newCard.dataset.typeId = typeSelectorIndex;

	const pokecard = document.createElement("div");
	pokecard.classList.add("pokecard");

	const eastereggSprite = document.createElement("img");
	eastereggSprite.classList.add("easteregg-sprite");
	eastereggSprite.src = cyoMonster.eastereggSprite;
	eastereggSprite.alt = `Sprite of ${cyoMonster.newName}`;
	//eastereggSprite.style.backgroundColor = typeInfo[typeSelectorIndex].dark;

	const newName = document.createElement("div");
	newName.classList.add("new-pokename");
	newName.innerHTML = cyoMonster.newName;

	const newPoketype = document.createElement("div");
	newPoketype.classList.add("new-poketype");
	//newPoketype.innerHTML = typeInfo[typeSelectorIndex].name;

	pokecard.append(eastereggSprite, newName, newPoketype);

	newCard.append(pokecard);

	container.prepend(newCard);
	cyoContainer.prepend(newCard);

	return newCard;
}

function refreshCyo() {
	const cyoList = JSON.parse(localStorage.getItem("cyoArray")) || [];

	cyoContainer.innerHTML = "";
	cyoList.forEach((cyoMonster) => {
		const newCard = document.createElement("div");
		newCard.classList.add("new-card");
		newCard.dataset.typeId = typeSelectorIndex;

		const pokecard = document.createElement("div");
		pokecard.classList.add("pokecard");

		const eastereggSprite = document.createElement("img");
		eastereggSprite.classList.add("easteregg-sprite");
		eastereggSprite.src = cyoMonster.eastereggSprite;
		eastereggSprite.alt = `Sprite of ${cyoMonster.newName}`;
		//eastereggSprite.style.backgroundColor = typeInfo[typeSelectorIndex].dark;

		const newName = document.createElement("div");
		newName.classList.add("new-pokename");
		newName.innerHTML = cyoMonster.newName;

		const newPoketype = document.createElement("div");
		newPoketype.classList.add("new-poketype");
		//newPoketype.innerHTML = typeInfo[typeSelectorIndex].name;

		pokecard.append(eastereggSprite, newName, newPoketype);

		newCard.append(pokecard);

		container.prepend(newCard);

		return newCard;
	});
}
