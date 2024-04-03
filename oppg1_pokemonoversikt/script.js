let pokeArray = [];

async function catchKantoPokemons() {
	try {
		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
		const pokeData = generationOne.pokemon_species.map((pokemon) => pokemon.name, pokemon.id, pokemon.sprite);

		for (const species of pokeData) {
			const pokemonData = await (await fetch(species.url)).json();
			const spriteUrl = pokemonData.sprites.front_default;
			pokeArray.push({ name: species.name, sprite: spriteUrl });
		}

		console.log("Gotcha! Generation One was caught!", generationOne);
		return pokeData;
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

async function getPokeTypes(pokeData) {
	try {
		for (const name of pokeData) {
			const pokeTypeRequest = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)).json();
			const type = pokeTypeRequest.types[0].type.name;
			pokeArray.push({ name: name, type: type });
		}
		return pokeArray;
	} catch (error) {
		console.error("Error fetching Pokémon types:", error);
	}
}

catchKantoPokemons().then((pokeData) => {
	getPokeTypes(pokeData)
		.then((result) => {
			console.log("Pokémon Types:", result);
		})
		.catch((error) => {
			console.error("Error getting Pokémon types:", error);
		});
});
