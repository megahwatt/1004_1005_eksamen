// Global variables
let pokeArray = [];
const pokeNames = [];
const filterList = document.querySelector(".filter-list");
const filterBtns = document.querySelectorAll(".filter");
let masterballs = document.querySelectorAll(".masterball");

// Fetch API and data about each pokémon in Gen I, II, III and IV
/*
Very manual error-handling of the Pokémons that could not be fetched,
due to issues with the throw error function.
Proritised the exam as a whole over elegant error handling.
*/
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

		[dataGenI, dataGenII, dataGenIII, dataGenIV].forEach((data) => {
			data.pokemon_species.forEach((pokemon) => {
				pokeNames.push(pokemon.name);
			});
		});

		console.log("Gotcha! First four generations were caught!");
		return pokeNames;
	} catch (error) {
		console.error("Oh no, the Pokémons broke free!", error);
	}
}

async function getPokeData(pokeNames) {
	try {
		for (const name of pokeNames) {
			if (name.split("-").length > 1) {
				continue;
			}
			if (name === "deoxys" || name === "giratina" || name === "wormadam" || name === "shaymin") {
				continue;
			}

			const pokeData = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)).json();
			const pokeID = pokeData.id;
			const pokeTypeURL = pokeData.types[0].type.url;
			const typeData = await (await fetch(pokeTypeURL)).json();
			const pokeTypeID = typeData.id;
			const type = typeData.name;
			const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeID}.png`;
			pokeArray.push({ sprite, name, type, pokeID, pokeTypeID });
		}

		pokeArray.sort((a, b) => a.pokeID - b.pokeID);
		createMasterballs();

		return pokeArray;
	} catch (error) {
		console.error("getPokeData 404", error);
		throw error;
	}
}

gottaCatchEmAll().then((pokeNames) => {
	getPokeData(pokeNames)
		.then((result) => {
			console.log("getPokeData result", result);
		})
		.catch((error) => {
			console.error("call gottaCatchEmAll 404", error);
		});
});

// Buttons
function createSaveBtn(index) {
	const saveBtn = document.createElement("button");
	saveBtn.classList.add("save-btn");
	saveBtn.innerHTML = `SAVE`;

	return saveBtn;
}

function createDeleteBtn(index) {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.innerHTML = `DELETE`;

	return deleteBtn;
}

function createEditBtn(index) {
	const editBtn = document.createElement("button");
	editBtn.classList.add("edit-btn");
	editBtn.innerHTML = `EDIT`;

	return editBtn;
}

// Create pokémon-cards
function createMasterballs() {
	pokeArray.forEach((pokemon, index) => {
		const masterball = document.createElement("div");
		masterball.classList.add("masterball");
		masterball.dataset.typeId = pokemon.pokeTypeID;

		const pokecard = document.createElement("div");
		pokecard.classList.add("pokecard");

		const sprite = document.createElement("img");
		sprite.classList.add("sprite");
		sprite.src = pokemon.sprite;
		sprite.alt = `The official artwork of ${pokemon.name}`;

		const name = document.createElement("div");
		name.classList.add("name");
		name.innerHTML = pokemon.name;

		const type = document.createElement("div");
		type.classList.add("type");
		type.innerHTML = pokemon.type;

		const id = document.createElement("div");
		id.classList.add("id");
		id.innerHTML = `#${pokemon.pokeID}`;

		const btnContainer = document.createElement("div");
		btnContainer.classList.add("btn-container");

		const saveBtn = createSaveBtn(index);
		const deleteBtn = createDeleteBtn(index);
		const editBtn = createEditBtn(index);

		pokecard.append(sprite, name, type, id);
		btnContainer.append(saveBtn, deleteBtn, editBtn);

		masterball.append(pokecard, btnContainer);

		document.body.append(masterball);
	});
	masterballs = document.querySelectorAll(".masterball");
	filterByType();
}

// Filter -- the below function has an error code -- debug later
filterBtns.forEach((img) => {
	const filterBtn = img.getAttribute("data-type");
	img.dataset.type = filterBtn;
	img.addEventListener("click", filterByType);
});

function filterByType(event) {
	const selectedType = event.currentTarget.getAttribute("data-type");
	console.log("type", selectedType);

	masterballs.forEach((masterball) => {
		const type = masterball.dataset.typeId;
		console.log("masterball type", type);
		if (selectedType === "" || type === selectedType) {
			masterball.style.display = "block";
		} else {
			masterball.style.display = "none";
		}
	});
}

/*


0 all

1 normal
2 fighting
3 flying
4 poison
5 ground
6 rock
7 bug
8 ghost
9 steel
10 fire
11 water
12 grass
13 electric
14 psychic
15 ice
16 dragon
17 dark
18 fairy

function createMasterballs() {
    pokeArray.forEach((pokemon, index) => {
        const masterball = document.createElement("div");
        masterball.classList.add("masterball");
        masterball.dataset.typeId = pokemon.type.id; // Changed dataset key to typeId

        const pokecard = document.createElement("div");
        pokecard.classList.add("pokecard");

        const sprite = document.createElement("img");
        sprite.classList.add("sprite");
        sprite.src = pokemon.sprite;
        sprite.alt = `The official artwork of ${pokemon.name}`;

        const name = document.createElement("div");
        name.classList.add("name");
        name.innerHTML = pokemon.name;

        const type = document.createElement("div");
        type.classList.add("type");
        type.innerHTML = pokemon.type; // Changed to set innerHTML directly

        const id = document.createElement("div");
        id.classList.add("id");
        id.innerHTML = `#${pokemon.pokeID}`;

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("btn-container");

        const saveBtn = createSaveBtn(index);
        const deleteBtn = createDeleteBtn(index);
        const editBtn = createEditBtn(index);

        pokecard.append(sprite, name, type, id);
        btnContainer.append(saveBtn, deleteBtn, editBtn);

        masterball.append(pokecard, btnContainer);

        document.body.append(masterball);
    });
}

function filterByType(event) {
    const selectedType = event.currentTarget.getAttribute("data-type");
    console.log("type", selectedType);

    masterballs.forEach((masterball) => {
        const type = masterball.dataset.typeId;
        console.log("masterball type", type);
        if (selectedType === "" || type === selectedType) {
            masterball.style.display = "block";
        } else {
            masterball.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    createMasterballs();

    // Debug: Log masterballs NodeList
    const masterballs = document.querySelectorAll(".masterball");
    console.log("Masterballs NodeList:", masterballs);

    // Convert NodeList to array
    const masterballsArray = Array.from(masterballs);

    // Filter
    filterBtns.forEach((img) => {
        const filterBtn = img.getAttribute("data-type");
        img.dataset.type = filterBtn;
        img.addEventListener("click", filterByType);
    });
});

function filterByType(event) {
    const selectedType = event.currentTarget.getAttribute("data-type");
    console.log("Selected type:", selectedType);

    masterballsArray.forEach((masterball) => {
        const type = masterball.dataset.typeId;
        console.log("Masterball type:", type);
        if (selectedType === "" || type === selectedType) {
            masterball.style.display = "block";
        } else {
            masterball.style.display = "none";
        }
    });
}




*/
