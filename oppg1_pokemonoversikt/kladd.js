function editPokemon(index) {
	const newPokeName = prompt("Gi Pokémonen et kallenavn!");
	const newPokeType = parseInt(prompt("Skriv inn et tall fra 1-18 for å endre Pokémonen's type."));

	if (newPokeName && newPokeType >= 1 && newPokeType <= 18) {
		if (index >= 0 && index < pokeArray.length) {
			pokeArray[index].name = newPokeName;
			pokeArray[index].pokeTypeID = newPokeType;
			pokeArray[index].type = typeInfo.find((type) => type.id === newPokeType).name;
			localStorage.setItem("pokeArray", JSON.stringify(pokeArray));
			updateShownPokes(index, newPokeName, newPokeType);
		} else if (index >= 0 && index < savedPokes.length) {
			savedPokes[index].name = newPokeName;
			savedPokes[index].pokeTypeID = newPokeType;
			savedPokes[index].type = typeInfo.find((type) => type.id === newPokeType).name;
			localStorage.setItem("savedPokes", JSON.stringify(savedPokes));
			updateShownPokes(index, newPokeName, newPokeType);
		} else {
			console.error("Arrayet er tomt./Finner ikke index.");
		}
	} else {
		alert("Ugyldig input. Vennligst velg et tall fra 1 til 18.");
	}
}

function applyEdits(index, newPokeName, newPokeType) {
	if (masterballs && index >= 0 && index < masterballs.length) {
		const name = masterballs[index].querySelector(".name");
		const typeName = masterballs[index].querySelector(".type-name");

		name.innerHTML = newPokeName;
		typeName.innerHTML = typeInfo.find((type) => type.id === newPokeType)?.name || "";
	} else {
		console.error("Arrayet er tomt./Finner ikke index.");
	}
}

function updateShownPokes(index, newPokeName, newPokeType) {
	applyEdits(index, newPokeName, newPokeType, pokeArray);
	applyEdits(index, newPokeName, newPokeType, savedPokes);
}
