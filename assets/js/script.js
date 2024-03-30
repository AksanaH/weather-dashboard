const searchedEl = document.getElementById('searched-cities');



function init() {
    const searchedLocations = JSON.parse(localStorage.getItem('locations'));
    console.log(searchedLocations);
    if (searchedLocations === null) {
        return;
    }

    for (const location of searchedLocations) {
        
        

        const newRow = document.createElement("div");

        const nameOfSearchedLocation = document.createElement("h3");
        
        nameOfSearchedLocation.textContent = location.name;
        newRow.append(nameOfSearchedLocation);
        searchedEl.append(newRow);
    }   
}
//checking in local storage, in {} - object
localStorage.setItem("locations", JSON.stringify([{name:"John"}]));

init();


