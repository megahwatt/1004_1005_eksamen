// Modify the createMasterballs function to include data attributes for Pokémon types
function createMasterballs() {
	pokeArray.forEach((pokemon, index) => {
		const masterball = document.createElement("div");
		masterball.classList.add("masterball");
		masterball.dataset.type = pokemon.type; // Add dataset attribute for type

		const pokecard = document.createElement("div");
		pokecard.classList.add("pokecard");

		// Add data-type attribute to sprite and type elements
		const sprite = document.createElement("img");
		sprite.classList.add("sprite");
		sprite.src = pokemon.sprite;
		sprite.alt = `The official artwork of ${pokemon.name}`;
		sprite.dataset.type = pokemon.type;

		const name = document.createElement("div");
		name.classList.add("name");
		name.innerHTML = pokemon.name;

		const type = document.createElement("div");
		type.classList.add("type");
		type.innerHTML = pokemon.type;
		type.dataset.type = pokemon.type;

		// Other code remains unchanged...
	});
}

// Attach event listeners to filter buttons using forEach and arrow function
filterBtns.forEach((btn) => {
	btn.addEventListener("click", filterByType);
});

// Filter by type function
function filterByType(event) {
	const selectedType = event.currentTarget.getAttribute("data-type"); // Get selected type from button
	const masterballs = document.querySelectorAll(".masterball");

	masterballs.forEach((masterball) => {
		const type = masterball.dataset.type;
		if (selectedType === "all" || type === selectedType) {
			masterball.style.display = "block"; // Show matching Pokémon cards
		} else {
			masterball.style.display = "none"; // Hide non-matching Pokémon cards
		}
	});
}

function filterByType(event) {
	const selectedType = event.currentTarget.getAttribute("data-type");
	console.log("type", selectedType);

	masterballs.forEach((masterball) => {
		const type = masterball.dataset.type;
		if (selectedType === "" || type === selectedType) {
			masterball.classList.remove("hide"); // Remove hide class to show matching Pokémon cards
		} else {
			masterball.classList.add("hide"); // Add hide class to hide non-matching Pokémon cards
		}
	});
}

function filterByType(event) {
	const selectedType = event.currentTarget.getAttribute("data-type");
	console.log("type", selectedType);

	masterballs.forEach((masterball) => {
		const type = masterball.dataset.type;
		if (selectedType === "" || type === selectedType) {
			masterball.classList.remove("hide"); // Remove hide class to show matching Pokémon cards
		} else {
			masterball.classList.add("hide"); // Add hide class to hide non-matching Pokémon cards
		}
	});
}
