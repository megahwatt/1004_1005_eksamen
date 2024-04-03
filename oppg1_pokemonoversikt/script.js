let pokeArray = [];

async function catchKantoPokemons() {
	try {
		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
		const pokeNames = generationOne.pokemon_species.map((pokemon) => pokemon.name);
		console.log("Gotcha! Generation One was caught!", generationOne);
		return pokeNames;
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

async function getPokeTypes(pokeNames) {
	try {
		let pokeTypes = [];
		for (const name of pokeNames) {
			const pokeTypeRequest = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)).json();
			const type = pokeTypeRequest.types[0].type.name;
			pokeTypes.push({ name: name, type: type });
		}
		return pokeTypes;
	} catch (error) {
		console.error("Error fetching Pokémon types:", error);
	}
}

catchKantoPokemons().then((pokeNames) => {
	getPokeTypes(pokeNames)
		.then((result) => {
			console.log("Pokémon Types:", result);
		})
		.catch((error) => {
			console.error("Error getting Pokémon types:", error);
		});
});
