async function catchKantoPokemons() {
	try {
		const generationOne = await (await fetch("https://pokeapi.co/api/v2/generation/1")).json();
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
catchKantoPokemons(); */ /*

/*

/*
const pokeType = pokemon.types.map((type) => type.type.name);
	console.log(pokeType);
    
	const pokeTypes = pokemonData.types.map((type) => type.type.name);
	console.log("Types:", pokeTypes);
    
    
	const getPokemon = async (URI, text) => { 
		try {
		  const res = await fetch(URI)
		  //console.log(res)
		  if(!res.ok || !text || text <= 0 || text >= 650){ //} || isNaN(text)){
			/* the top number is 1010 but not all of them have nice images
			that's why I set limit to 650, so 649 is the las pokemon
			that has a nice image */ /*
			throw 'Please only numbers between 1 and 649 or type the name correctly'
		  }
		  const data = await res.json();
		  console.log(data)
		  const {id, name, sprites: {other: {dream_world: {front_default}}}} = data
		  //console.log(front_default) //src link for imgs pokemon
	  
		  /* string.padStart(length, string) 
		  The length of the resulting string.*/ /*
		  setTimeout(()=>{
			loading.classList.add('d-none')
			result.className = 'result active'
			result.innerHTML = `
			  <div class="pokebox found">
				<span class="closebox">x</span>
				<img src="${front_default}" alt="${name}" class="pokemon">
				<h3 class="pokename">${name}</h3>
				<p class="pokenumber">#${id.toString().padStart(3, '0')}</p>
			  </div>`;
			search.value = null;
		  }, 1600)
	  
		}
*/

// Function to fetch Pokemon details by name or ID
async function fetchPokemonDetails(pokemonNameOrId) {
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`);
	const data = await response.json();
	return data;
}

// Function to fetch Pokemon types by URL
async function fetchPokemonTypes(pokemonUrl) {
	const response = await fetch(pokemonUrl);
	const data = await response.json();
	return data.types.map((type) => type.type.name);
}

// Function to fetch Generation 1 Pokemon and their types
async function fetchGeneration1Pokemon() {
	const response = await fetch("https://pokeapi.co/api/v2/generation/1");
	const data = await response.json();
	const pokemonList = data.pokemon_species;
	const pokemonArray = [];

	for (const pokemon of pokemonList) {
		const pokemonDetails = await fetchPokemonDetails(pokemon.name);
		const pokemonTypes = await fetchPokemonTypes(pokemonDetails.species.url);

		pokemonArray.push({
			name: pokemon.name,
			types: pokemonTypes,
		});
	}

	return pokemonArray;
}

// Call the function to fetch Generation 1 Pokemon and their types
fetchGeneration1Pokemon().then((pokemonArray) => {
	console.log(pokemonArray); // Output the fetched data array
});
