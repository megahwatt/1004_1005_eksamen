// Fetch API and data about each pokémon in Gen I, II, III and IV

let pokeArray = [];

async function gottaCatchEmAll() {
	try {
		const pokeNames = [];

		const [dataGenI, dataGenII, dataGenIII, dataGenIV] = await Promise.all([
			(await fetch("https://pokeapi.co/api/v2/generation/1")).json(),
			(await fetch("https://pokeapi.co/api/v2/generation/2")).json(),
			(await fetch("https://pokeapi.co/api/v2/generation/3")).json(),
			(await fetch("https://pokeapi.co/api/v2/generation/4")).json(),
		]);

		/*console.log("genI", dataGenI);
		console.log("genII", dataGenII);
		console.log("genIII", dataGenIII);
		console.log("genIV", dataGenIV);*/

		[dataGenI, dataGenII, dataGenIII, dataGenIV].forEach((data) => {
			data.pokemon_species.forEach((pokemon) => {
				pokeNames.push(pokemon.name);
			});
		});

		/*
        const pokeSpecies = caughtEmAll.pokemon_species;

        const pokeNames = pokeSpecies.map((pokemon) => pokemon.name);

		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
		const pokeSpecies = generationOne.pokemon_species;
*/

		console.log("Gotcha! First four generations were caught!");
		//console.log("pokenames", pokeNames);
		return pokeNames;
	} catch (error) {
		console.error("Oh no, the Pokémons broke free!", error);
	}
}
gottaCatchEmAll();

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
		console.error("getPokeData 404", error);
	}
}

gottaCatchEmAll().then((pokeNames) => {
	getPokeData(pokeNames)
		.then((result) => {
			console.log("pokeData", result);
		})
		.catch((error) => {
			console.error("call gottaCatchEmAll 404", error);
		});
});
