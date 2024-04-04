// Global variables
let pokeArray = [];
/*
// Fetch API and data about each pokémon in gen one
async function catchKantoPokemons() {
	try {
		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
		const pokeSpecies = generationOne.pokemon_species;

		const pokeNames = pokeSpecies.map((pokemon) => pokemon.name);

		console.log("Gotcha! Generation One was caught!");
		return pokeNames;
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

async function getPokeData(pokeNames) {
	try {
		for (const name of pokeNames) {
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
		console.error("getopkedata 404", error);
	}
}

catchKantoPokemons().then((pokeNames) => {
	getPokeData(pokeNames)
		.then((result) => {
			console.log("pokedata", result);
		})
		.catch((error) => {
			console.error("call catchkantopokemons 404", error);
		});
});
*/
// Create pokémon-cards
function createMasterballs() {
	const masterball = document.createElement("div");
	masterball.classList.add("masterball");

	pokeArray.forEach((pokemon) => {
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

		pokecard.appendChild(sprite);
		pokecard.appendChild(name);
		pokecard.appendChild(type);

		masterball.appendChild(pokecard);
	});

	document.body.appendChild(masterball);
}
