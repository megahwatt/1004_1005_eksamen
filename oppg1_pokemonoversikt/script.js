let pokeArray = [];

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
			pokeArray.push({ pokeID, name, sprite, type });
		}

		pokeArray.sort((a, b) => a.pokeID - b.pokeID);
		return pokeArray;
	} catch (error) {
		console.error("Error fetching Pokémon data:", error);
	}
}

catchKantoPokemons().then((pokeNames) => {
	getPokeData(pokeNames)
		.then((result) => {
			console.log("Pokémon Data:", result);
		})
		.catch((error) => {
			console.error("Error getting Pokémon data:", error);
		});
});
