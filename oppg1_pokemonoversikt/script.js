async function catchRandomPokemons() {
	try {
		const request = await fetch("https://pokeapi.co/api/v2/generation/1");
		const randomPokemon = await request.json();

		const caughtPokemon = {bilde navn type1};

		// pokeball.unshift(caughtPokemon);

		console.log("Gotcha! The Pokémon was caught!", randomPokemon);
		return randomPokemon;
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

catchRandomPokemons();
