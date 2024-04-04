// Global variables

let pokeArray = [];
let savedPokes = [];
const pokeNames = [];

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

		console.log("genI", dataGenI);
		console.log("genII", dataGenII);
		console.log("genIII", dataGenIII);
		console.log("genIV", dataGenIV);

		[dataGenI, dataGenII, dataGenIII, dataGenIV].forEach((data) => {
			data.pokemon_species.forEach((pokemon) => {
				pokeNames.push(pokemon.name);
			});
		});

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
			const pokeType = pokeData.types[0].type.url;
			const typeData = await (await fetch(pokeType)).json();
			const type = typeData.name;
			const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeID}.png`;
			pokeArray.push({ sprite, name, type, pokeID });
		}

		pokeArray.sort((a, b) => a.pokeID - b.pokeID);
		createMasterballs();
	} catch (error) {
		console.error("getPokeData 404", error);
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

// SAVE
function createSaveBtn(index) {
	const saveBtn = document.createElement("button");
	saveBtn.classList.add("save-btn");
	saveBtn.dataset.index = index;
	saveBtn.innerHTML = `SAVE`;

	saveBtn.addEventListener("click", () => {
		const throwPokeball = savedPokes[index];
		savePoke(throwPokeball);
	});

	return saveBtn;
}

function savePoke(pokemon) {
	let savedPokes = JSON.parse(localStorage.getItem("savedPokes")) || [];

	if (savedPokes.length < 5) {
		savedPokes.push(pokemon);
		localStorage.setItem("savedPokes", JSON.stringify(savedPokes));
		console.log(`Gotcha! ${pokemon.name} was caught!`);
	} else {
		console.log("Oh no, you can only carry five Pokémon at a time! Realse one into the wild to catch another.");
	}
}
savePoke();

// Buttons
function createDeleteBtn(index) {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.dataset.index = index;
	deleteBtn.innerHTML = `DELETE`;

	return deleteBtn;
}

function createEditBtn(index) {
	const editBtn = document.createElement("button");
	editBtn.classList.add("edit-btn");
	editBtn.dataset.index = index;
	editBtn.innerHTML = `EDIT`;

	return editBtn;
}

// Create Pokémon-cards
function createMasterballs() {
	pokeArray.forEach((pokemon, index) => {
		const masterball = document.createElement("div");
		masterball.classList.add("masterball");

		const pokecard = document.createElement("div");
		pokecard.classList.add("pokecard");

		const sprite = document.createElement("img");
		sprite.classList.add("sprite");
		sprite.src = pokemon.sprite;
		sprite.alt = `The official artwork of ${pokemon.name}`;

		const name = document.createElement("div");
		name.classList.add("name");
		name.textContent = pokemon.name;

		const type = document.createElement("div");
		type.classList.add("type");
		type.textContent = pokemon.type;

		const btnContainer = document.createElement("div");
		btnContainer.classList.add("btn-container");

		const saveBtn = createSaveBtn(index);

		const deleteBtn = createDeleteBtn(index);

		const editBtn = createEditBtn(index);

		pokecard.append(sprite, name, type);
		btnContainer.append(saveBtn, deleteBtn, editBtn);

		masterball.append(pokecard, btnContainer);

		document.body.append(masterball);
	});
}
