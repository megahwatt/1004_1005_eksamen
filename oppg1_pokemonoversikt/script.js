// Global variables

let pokeArray = [];
let pokeNames = [];

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
			const pokeType = pokeData.types[0].type.url;
			const typeData = await (await fetch(pokeType)).json();
			const type = typeData.name;
			const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeID}.png`;
			pokeArray.push({ sprite, name, type, pokeID });
		}

		//pokeArray.sort((a, b) => a.pokeID - b.pokeID);
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
