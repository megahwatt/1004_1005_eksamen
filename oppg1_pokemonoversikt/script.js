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
			const sprite = await fetchSprite(pokeData.sprites.other["official-artwork"].front_default);
			pokeArray.push({ pokeID, name, sprite, type });
		}

		pokeArray.sort((a, b) => a.pokeID - b.pokeID);
		return pokeArray;
	} catch (error) {
		console.error("Error fetching Pokémon data:", error);
	}
}

async function fetchSprite(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("Sprite not found");
		}
		return url;
	} catch (error) {
		console.error("Error fetching sprite:", error);
		return null;
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
