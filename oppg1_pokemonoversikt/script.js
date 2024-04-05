// Global variables
let pokeArray = [];
const pokeNames = [];
const filterBtns = document.querySelectorAll(".filter");
let masterballs = document.querySelectorAll(".masterball");
let savedPokes = [];

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

// Buttons
function createDeleteBtn(index) {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.innerHTML = "DELETE";

	return deleteBtn;
}

function createEditBtn(index) {
	const editBtn = document.createElement("button");
	editBtn.classList.add("edit-btn");
	editBtn.innerHTML = "EDIT";

	return editBtn;
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

		document.body.append(masterball);
	});
	masterballs = document.querySelectorAll(".masterball");
	filterByType("");
}

// Filter and styling by typeID
const typeColours = [
	{ light: "transparent", dark: "transparent" }, // all
	{ light: "#d0d1d0", dark: "#9c9d9a" }, // normal
	{ light: "#ffc53a", dark: "#fa7d00" }, // fighting
	{ light: "#bad9f7", dark: "#7eb5e6" }, // flying
	{ light: "#cb7ce6", dark: "#8c3ec3" }, // poison
	{ light: "#ce925a", dark: "#8c4e1e" }, // ground
	{ light: "#d9d5c3", dark: "#ada57b" }, // rock
	{ light: "#cbd452", dark: "#8c9d19" }, // bug
	{ light: "#b27cb2", dark: "#6e3e6b" }, // ghost
	{ light: "#9accd6", dark: "#5d9db2" }, // steel
	{ light: "#f76868", dark: "#de2626" }, // fire
	{ light: "#63c0f7", dark: "#267de6" }, // water
	{ light: "#7ed263", dark: "#3f9d26" }, // grass
	{ light: "#fce03a", dark: "#f4bc00" }, // electric
	{ light: "#f780ba", dark: "#e9457b" }, // psychic
	{ light: "#7bebff", dark: "#3fd2f4" }, // ice
	{ light: "#8c9eef", dark: "#505ed6" }, // dragon
	{ light: "#8f7c7e", dark: "#503e3c" }, // dark
	{ light: "#f7a9f7", dark: "#ec6de6" }, // fairy
];

function refreshPokes() {
	window.location.reload();
}

filterBtns.forEach((img) => {
	img.addEventListener("click", filterClick);
});

function filterByType(selectedType) {
	masterballs.forEach((masterball) => {
		const typeID = masterball.dataset.typeId;
		const buttons = masterball.querySelectorAll(".save-btn, .delete-btn, .edit-btn");

		masterball.style.display = selectedType === "" || typeID === selectedType ? "block" : "none";

		if (selectedType === "") {
			masterball.querySelector(".sprite").style.backgroundColor = "transparent";
			buttons.forEach((button) => {
				button.style.backgroundColor = "transparent";
			});
		} else {
			masterball.querySelector(".sprite").style.backgroundColor = typeColours[typeID].dark;
			buttons.forEach((button) => {
				button.style.backgroundColor = typeColours[typeID].light;
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
		sprite.style.backgroundColor = typeColours[pokemon.pokeTypeID].dark;

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

		const deleteBtn = createDeleteBtn(index);
		deleteBtn.style.backgroundColor = typeColours[pokemon.pokeTypeID].light;

		const editBtn = createEditBtn(index);
		editBtn.style.backgroundColor = typeColours[pokemon.pokeTypeID].light;

		pokecard.append(sprite, name, typeName, id);
		btnContainer.append(deleteBtn, editBtn);

		masterball.append(pokecard, btnContainer);

		caughtPokes.append(masterball);
	});
}
