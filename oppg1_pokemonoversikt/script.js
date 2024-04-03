/*






async function catchRandomPokemons() {
	try {
		const request = await fetch("https://pokeapi.co/api/v2/generation/1");
		const result = await request.json();
        let pokemon = result.results;

		let caughtPokemon = { name: ${pokemon.name}, type: ${pokemon.type: slot: 1}, };

		// pokeball.unshift(caughtPokemon);

		console.log("Gotcha! The Pokémon was caught!", result);
		return result;
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

catchRandomPokemons();


async function catchRandomPokemons() {
    try {
        const request = await fetch("https://pokeapi.co/api/v2/generation/1");
        const result = await request.json();
        const onePokemon = result.onePokemon;
        
        // Get a random Pokémon from the list
        const randomIndex = Math.floor(Math.random() * onePokemon.length);
        const randomPokemon = onePokemon[randomIndex];
        
        // Fetch data for the selected Pokémon
        const pokemonResponse = await fetch(randomPokemon.url);
        const pokemonData = await pokemonResponse.json();
        
        // Extract name and type of the Pokémon
        const name = pokemonData.name;
        const type = pokemonData.types[0].type.name;

        const caughtPokemon = { 
            name: name, 
            type: type 
        };

        console.log("Gotcha! The Pokémon was caught!", caughtPokemon);
        return caughtPokemon;
    } catch (error) {
        console.error("Oh no, the Pokémon broke free!", error);
    }
}

catchRandomPokemons();

async function catchRandomPokemons() {
	try {
		// Fetch data for the first generation of Pokémon
		const genOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();

		// Select a random Pokémon from the list
		const choosePokemon = Math.floor(Math.random() * genOne.pokemon_species.length);
		const randomPokemon = genOne.pokemon_species[choosePokemon];

		// Fetch detailed data for the selected Pokémon
		const pokemonData = await (await fetch(randomPokemon.url)).json();

		// Extract name and type of the Pokémon
		const caughtPokemon = {
			name: pokemonData.name,
			type: pokemonData.types[0].type.name,
		};

		console.log("Gotcha! The Pokémon was caught!", caughtPokemon);

		return caughtPokemon;
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

catchRandomPokemons();

async function catchRandomPokemons() {
	try {
		// Fetch data for the first generation of Pokémon
		const genOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();

		// Pause execution to inspect genOne data
		console.log("genone", genOne);

		// Select a random Pokémon from the list
		const choosePokemon = Math.floor(Math.random() * genOne.pokemon_species.length);
		const randomPokemon = genOne.pokemon_species[choosePokemon];

		console.log("choosepokemon", choosePokemon);
		console.log("randompoke", randomPokemon);

		// Fetch detailed data for the selected Pokémon
		const pokemonData = await (await fetch(randomPokemon.url)).json();

		// Pause execution to inspect pokemonData
		console.log("pokedata", pokemonData);

		// Extract name and type of the Pokémon
		let type = "Unknown";
		if (pokemonData.types && pokemonData.types.length > 0) {
			type = pokemonData.types[0].type.name;
		}

		//console.log("caughtpoke", caughtPokemon);

		// Log the caught Pokémon
		console.log("Gotcha! The Pokémon was caught!");
	} catch (error) {
		// Log error if any
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

catchRandomPokemons();
*/ /*
async function catchRandomPokemons() {
	try {
		// Fetch data for the first generation of Pokémon
		const genOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();

		// Select a random Pokémon from the list
		const choosePokemon = Math.floor(Math.random() * genOne.pokemon_species.length);
		const randomPokemon = genOne.pokemon_species[choosePokemon];

		// Fetch detailed data for the selected Pokémon
		const pokemonData = await (await fetch(randomPokemon.url)).json();

		// Extract name and type of the Pokémon
		const caughtPokemon = {
			name: pokemonData.name,
			type: pokemonData.types[0].slot.name,
		};

		// Log the caught Pokémon
		console.log("Gotcha! The Pokémon was caught!", caughtPokemon);

		return caughtPokemon;
	} catch (error) {
		// Log error if any
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

catchRandomPokemons();

async function catchRandomPokemons() {
	try {
		const genOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
		const randomPokemon = genOne.pokemon_species[Math.floor(Math.random() * genOne.pokemon_species.length)];
		const pokemonData = await (await fetch(randomPokemon.url)).json();
		const caughtPokemon = {
			name: pokemonData.name,
			type: pokemonData.types.types((type) => type.slot === 1).type.name,
		};
		console.log("Gotcha! The Pokémon was caught!", caughtPokemon);
		return caughtPokemon;
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}

catchRandomPokemons();

*/ /*
const fetchPokemon = async () => {
	const url = `https://pokeapi.co/api/v2/pokemon?limit=150`;
	const res = await fetch(url);
	const data = await res.json();
	const pokemon = data.results.map((data, index) => ({
		name: data.name,
		id: index + 1,
		image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
	}));

	console.log(pokemon);
};

fetchPokemon();

async function catchRandomPokemons() {
	try {
		const request = await fetch("https://pokeapi.co/api/v2/generation/1");
		const result = await request.json();
		const onePokemon = result.onePokemon;

		// Get a random Pokémon from the list
		const randomIndex = Math.floor(Math.random() * onePokemon.length);
		const randomPokemon = onePokemon[randomIndex];

		// Fetch data for the selected Pokémon
		const pokemonResponse = await fetch(randomPokemon.url);
		const pokemonData = await pokemonResponse.json();

		// Extract name and type of the Pokémon
		const name = pokemonData.name;
		const type = pokemonData.types[0].type.name;

		const caughtPokemon = {
			name: name,
			type: type,
		};

		console.log("Gotcha! The Pokémon was caught!", caughtPokemon);
		return caughtPokemon;
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}
*/ /*
async function catchRandomPokemons() {
	try {
		const generationOne = await fetch("https://pokeapi.co/api/v2/generation/1");
		const data = await generationOne.json();
		//const data = await result.json();
		const onePokemon = data.results.map((data) => ({
			name: data.name,
			type: data.types.map((type) => type.type.name),
		}));
		console.log(onePokemon);
	} catch (error) {
		console.error(error);
	}
}
catchRandomPokemons();
*/ /*

async function fetchPokeapi() {
	try {
		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
		const randomPokemon =
			generationOne.pokemon_species[Math.floor(Math.random() * generationOne.pokemon_species.length)];
		const pokemonData = await (await fetch(randomPokemon.url)).json();
		const type = pokemonData.types.map((type) => types.slot === 1.type.name);
		const caughtPokemon = { name: pokemonData.name, type };
		return caughtPokemon;
	} catch (error) {
		console.error(error);
        return null;
	}
}
fetchPokeapi();*/
/*
async function fetchPokeapi() {
	try {
		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
		const randomPokemon =
			generationOne.pokemon_species[Math.floor(Math.random() * generationOne.pokemon_species.length)];
		const pokemonData = await (await fetch(randomPokemon.url)).json();
		const type = pokemonData.types.map((type) => (type.slot === 1 ? type.type.name : null)); // Assuming you want the type with slot 1
		const caughtPokemon = { name: pokemonData.name, type };
		return caughtPokemon;
	} catch (error) {
		console.error(error);
		return null;
	}
}

// You can call fetchPokeapi and handle the returned promise
fetchPokeapi().then((caughtPokemon) => {
	if (caughtPokemon) {
		console.log(caughtPokemon);
	} else {
		console.log("Failed to fetch Pokémon data.");
	}
});
*/ /*
async function fetchPokeapi() {
	const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
	const randomPokemon = generationOne.pokemon_species[Math.floor(Math.random() * generationOne.pokemon_species.length)];
	const pokemonData = await (await fetch(randomPokemon.url)).json();
}
fetchPokeapi();
*/
async function catchKantoPokemons() {
	try {
		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
		//const randomPokemon = generationOne.pokemon_species[Math.floor(Math.random() * generationOne.pokemon_species.length)];
		console.log("Gotcha! The Pokémon was caught!", generationOne);
	} catch (error) {
		console.error("Oh no, the Pokémon broke free!", error);
	}
}
catchKantoPokemons();

function mapKantoPokemons() {}
