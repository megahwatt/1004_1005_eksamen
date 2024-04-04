// Fetch API and data about each pokémon in Gen I, II, III and IV

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

		/*
        const pokeSpecies = caughtEmAll.pokemon_species;

        const pokeNames = pokeSpecies.map((pokemon) => pokemon.name);

		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
		const pokeSpecies = generationOne.pokemon_species;
*/

		console.log("Gotcha! First four generations were caught!");
		return pokeNames;
	} catch (error) {
		console.error("Oh no, the Pokémons broke free!", error);
	}
}
gottaCatchEmAll();
