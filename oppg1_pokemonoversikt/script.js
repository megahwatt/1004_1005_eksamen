// Global variables
let pokeArray = [];
const pokeNames = [];
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

		/*
		console.log("genI", dataGenI);
		console.log("genII", dataGenII);
		console.log("genIII", dataGenIII);
		console.log("genIV", dataGenIV);
		*/

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
function createSaveBtn(index) {
	const saveBtn = document.createElement("button");
	saveBtn.classList.add("save-btn");
	saveBtn.innerHTML = `SAVE`;

	return saveBtn;
}

function createDeleteBtn(index) {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.innerHTML = `DELETE`;

	return deleteBtn;
}

function createEditBtn(index) {
	const editBtn = document.createElement("button");
	editBtn.classList.add("edit-btn");
	editBtn.innerHTML = `EDIT`;

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

// Filter and styling by typeName
const typeColours = {
	normal: { light: "#d0d1d0", dark: "#9c9d9a" },
	fighting: { light: "#ffc53a", dark: "#fa7d00" },
	flying: { light: "#bad9f7", dark: "#7eb5e6" },
	poison: { light: "#cb7ce6", dark: "#8c3ec3" },
	ground: { light: "#ce925a", dark: "#8c4e1e" },
	rock: { light: "#d9d5c3", dark: "#ada57b" },
	bug: { light: "#cbd452", dark: "#8c9d19" },
	ghost: { light: "#b27cb2", dark: "#6e3e6b" },
	steel: { light: "#9accd6", dark: "#5d9db2" },
	fire: { light: "#f76868", dark: "#de2626" },
	water: { light: "#63c0f7", dark: "#267de6" },
	grass: { light: "#7ed263", dark: "#3f9d26" },
	electric: { light: "#fce03a", dark: "#f4bc00" },
	psychic: { light: "#f780ba", dark: "#e9457b" },
	ice: { light: "#7bebff", dark: "#3fd2f4" },
	dragon: { light: "#8c9eef", dark: "#505ed6" },
	dark: { light: "#8f7c7e", dark: "#503e3c" },
	fairy: { light: "#f7a9f7", dark: "#ec6de6" },
};

function refreshPokes() {
	window.location.reload();
}

filterBtns.forEach((img) => {
	img.addEventListener("click", filterClick);
});

function filterByType(selectedType) {
	masterballs.forEach((masterball) => {
		const type = masterball.dataset.typeId;
		masterball.style.display = selectedType === "" || type === selectedType ? "block" : "none";
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

/*
0 all

1 normal d0d1d0 / 9c9d9a
2 fighting ffc53a / fa7d00
3 flying bad9f7 / 7eb5e6
4 poison cb7ce6 / 8c3ec3
6 rock d9d5c3 / ada57b
5 ground ce925a / 8c4e1e 
7 bug cbd452 / 8c9d19
8 ghost b27cb2 / 6e3e6b
9 steel 9accd6 / 5d9db2
10 fire f76868 / de2626
11 water 63c0f7 / 267de6
12 grass 7ed263 / 3f9d26
13 electric fce03a / f4bc00
14 psychic f780ba / e9457b
15 ice 7bebff / 3fd2f4
16 dragon 8c9eef / 505ed6
17 dark 8f7c7e / 503e3c
18 fairy f7a9f7 / ec6de6
*/
