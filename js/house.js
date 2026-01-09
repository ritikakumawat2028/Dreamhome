
document.getElementById("filter-button").addEventListener("click", () => {
    const maxPrice = document.getElementById("price").value;
    const state = document.getElementById("state").value.toLowerCase();
    const city = document.getElementById("city").value.toLowerCase();

    fetch("..//pages/house.json")
        .then(response => response.json())
        .then(data => {
            const filteredHouses = data.filter(house => {
                return (
                    (!maxPrice || house.price <= maxPrice) &&
                    (!state || house.state.toLowerCase().includes(state)) &&
                    (!city || house.city.toLowerCase().includes(city))
                );
            });

            const houseList = document.getElementById("house-list");
            houseList.innerHTML = "";

            filteredHouses.forEach(house => {
                const houseItem = document.createElement("div");
                houseItem.className = "house-item";
                houseItem.innerHTML = `
                    <div class="housesection">
                    <img src="${house.image}" alt="House" class = "imagehouse">
                    <div class="description">
                        <p class = "housedesc">${house.description}</p>
                        <p class = "housepric"><strong>Price:</strong> $${house.price}</p>
                        <p class = "houselocate"><strong>Location:</strong> ${house.city}, ${house.state}</p>
                    </div>
                    </div>
                `;
                 // Add event listener for clicking a house item
                 houseItem.addEventListener("click", () => {
                    showHouseDetails(house);
                });

                houseList.appendChild(houseItem);
            });
        });
});
function showHouseDetails(house) {
    // Create a modal container
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" tabindex="0">&times;</span>
            <div class="modal-images">
                <img src="${house.image}" alt="House Image">
            </div>
            <div class="modal-description">
                <h2>${house.description}</h2>
                <p><strong>Price:</strong> $${house.price}</p>
                <p><strong>Location:</strong> ${house.city}, ${house.state}</p>
                <p><strong>Additional Info:</strong> ${house.additionals}</p>
                <button id="order-now">Order Now</button>
            </div>
        </div>
    `;

    // Add close button functionality
    modal.querySelector(".close-button").addEventListener("click", () => {
        document.body.removeChild(modal);
    });

    // Ensure the escape key can close the modal
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.body.removeChild(modal);
        }
    });

    // Append modal to the body and focus on it for better UX
    document.body.appendChild(modal);
    modal.querySelector('.modal-content').focus(); // Focus on the modal content initially

    // Ensure clicking outside the modal also closes it
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}
//the state and city stuff
const stateCityMap = {
    Rajasthan: ["Ajmer", "Churu", "Jaipur","Bikaner","Dholpur","Bundi","Jhunjhunu","Kota","Pali","Pratapgarh"],
    Gujarat: ["Ahmedabad", "Surat", "Dahod","Dang","Junagadh","Kheda","Patan","Rajkot","Tapi","Vyara"],
    Punjab: ["Amritsar", "Barnala", "Faridkot","Firozpur","Ludhiana","Mansa"],
    Newdelhi: ["ChandniChok", "NationalPark", "Sardarnagar","Sabarmati"], 
    Haryana: ["Ambala", "Faridabad", "Hisar","Palwa","Rewari","Nuh"], 
    Goa: ["Sattari", "Dharbandora", "Salcette"], 
    Assam: ["Nagaon", "Baksa", "Dhubri","Darrang","Sonitpur"], 
    Odisa: ["Angul", "Deogarh", "Jajpur","Kandhamal","Khordha"], 
    Westbengal: ["Malda", "Birbhum", "Bankura"], 
    Uttarpradesh: ["Agra", "Ayodhya", "Banda","Bijnor","Fetehpur","Gonda","Jhansi"],    
    JandK: ["Jammu", "Kashmir", "Budgam","Kulgam"]
  };

  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  // Event listener for state selection
  stateSelect.addEventListener("change", function () {
    const selectedState = stateSelect.value;

    // Clear existing city options
    citySelect.innerHTML = '<option value="">--Select City--</option>';

    // Populate cities based on selected state
    if (selectedState && stateCityMap[selectedState]) {
      stateCityMap[selectedState].forEach(city => {
        const option = document.createElement("option");
        option.value = city.toLowerCase().replace(/ /g, "-");
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  });



// slider script 
let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let thumbnails = document.querySelectorAll('.thumbnail .item');

let countItem = items.length;
let itemActive = 0;

next.onclick = function () {
    itemActive = itemActive+1;
    if (itemActive >= countItem) {
        itemActive= 0;
    }
    showSlider();
}
prev.onclick = function(){
    itemActive = itemActive -1;
    if (itemActive<0) {
        itemActive = countItem-1;
    }
    showSlider();
}
let refreshInterval = setInterval(()=>{
    next.click();
},3000)
function showSlider(){
    let itemActiveOld = document.querySelector('.slider .list .item.active');
    let thumbnaiActiveOld = document.querySelector('.thumbnail .item.active');
    itemActiveOld.classList.remove('active');
    thumbnaiActiveOld.classList.remove('active');

    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');

    clearInterval(refreshInterval);
    refreshInterval = setInterval(()=>{
        next.click();
    },5000)
}

thumbnails.forEach((thumbnail, index)=>{
    thumbnail.addEventListener('click', ()=>{
        itemActive= index;
        showSlider();
    })
})







