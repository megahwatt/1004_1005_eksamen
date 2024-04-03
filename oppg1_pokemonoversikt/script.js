let pokemon = [];

async function catchKantoPokemons() {
	try {
		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1?type")).json();
		const randomPokemon =
			generationOne.pokemon_species[Math.floor(Math.random() * generationOne.pokemon_species.length)];
		const pokemonData = await (await fetch(randomPokemon.url)).json();
		console.log(generationOne);
		console.log(randomPokemon);
		console.log(pokemonData);

		mapPokemonData(pokemonData);
		console.log("Gotcha! The Pokémon was caught!", generationOne);
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

function mapPokemonData(pokemonData) {
	const pokeName = pokemonData.name;
	console.log(pokeName);
}
catchKantoPokemons();

/*
const pokeType = pokemon.types.map((type) => type.type.name);
	console.log(pokeType);
    
	const pokeTypes = pokemonData.types.map((type) => type.type.name);
	console.log("Types:", pokeTypes);
    
    */
