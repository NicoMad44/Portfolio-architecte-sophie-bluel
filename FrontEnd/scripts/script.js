// fetching the different category from the API
const responseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategories.json()
console.log(categories);

// fetching all the works from the API
const responseWorks = await fetch("http://localhost:5678/api/works");
const works = await responseWorks.json();
console.log(works);


// Dynamically populating the gallery with the works from the API using the function

diplayGallery(works);
displayModaleGallery(works);
makeCategoryMenu(category); // populate the category drop down menu of the form with function

// Check if user logedin and add the admin modification button if it is the case
if (!window.localStorage.getItem("1")){
    console.log("pas logger");
} else {
    displayEditButton();
    console.log("logger");
    console.log(window.localStorage.getItem("1"));
}


// Dynamically popylating the filter zone with

const filterZone = document.querySelector(".filterZone");

// Methode One : creation of the filter button based on a new API feed to get the category data

    for (let i=0; i<categories.length;i++){
        const filterButton = document.createElement("button");
        filterButton.innerText = categories[i].name;
        filterButton.dataset.id = categories[i].id;
        filterZone.appendChild(filterButton);
    } 

// Methode 2: Using the existing works data

    /* const cat_ID = new Set();
    const categoriesInWorks = new Set();

    // loop to go througth all the works and add the category to the set - as a set, category will only be inserted once
    for (let i =0; i<works.length; i++){
        cat_ID.add(works[i].categoryId);
        categoriesInWorks.add(works[i].category.name);
        console.log(works[i].category.name)
    }
    console.log(cat_ID);

    for (const catId of cat_ID) {
        const filterButton = document.createElement("button");
        filterButton.innerText = category.name;
        filterButton.dataset.id = catId;
        filterZone.appendChild(filterButton);
    } */


// Filter builder

const filterButtonsElement =document.querySelectorAll(".filterZone button");

/* loop to add event listner on all button - I use the dataset.id to know which button is clicked
* When a button is clicked, I call the function to filter and display the works
*/
for(let i=0; i<filterButtonsElement.length; i++){
    filterButtonsElement[i].addEventListener("click",(event)=>{
        const category_id = filterButtonsElement[i].dataset.id;
        
        filterAndDisplayWork(category_id);

    })
}


// add event listner on the "edit button" to open the modale
const editButton = document.querySelector(".editButton");
editButton.addEventListener("click", () =>{
    openModale();
    //clickOutToClose(); // add event listner on the modal to close it when click outside
});



// add event listner on cross icon to close the modale
const crossIcon = document.querySelector(".crossIcon");
crossIcon.addEventListener("click", ()=>{
    closeModale();
});

// add event listner on arrow icon to go back to gallery screen
const arrowIcon = document.querySelector(".arrowIcon");
arrowIcon.addEventListener("click", ()=>{
    diplayModaleGalleryScreen();
});


// add event listner on Ajouter Une Photo button
const addPhotoButton = document.querySelector(".greenButton");
addPhotoButton.addEventListener("click", ()=>{
    displayModaleNewPhotoScreen();
});



/********function diplayGallery(works)
 * to diplay the galery 
 * taking a table of works as parameter
 **************************************/
function diplayGallery(works){
    const galleryElement = document.querySelector(".gallery");
    galleryElement.innerHTML="";
    // for loop to create a figure for each works that will be poplulating the gallery on the page
    for(let i=0; i<works.length;i++){
        const figureElement = document.createElement("figure");
    
        const imgElement = document.createElement("img");
        imgElement.src = works[i].imageUrl;
        imgElement.alt = works[i].title;
    
        const figureCaptionElement = document.createElement("figcaption");
        figureCaptionElement.innerText = works[i].title;
    
        figureElement.appendChild(imgElement);
        figureElement.appendChild(figureCaptionElement);
    
        galleryElement.appendChild(figureElement);
    }
}

/********function filterAndDiplayWork(category-id)
 * to diplay the galery but only for a specific category 
 * taking the category - id as parameter
 **************************************/
function filterAndDisplayWork(cat_id){
    if(cat_id==0){
        diplayGallery(works);
    } else {
        const filteredWorks = works.filter(function(work){
            return work.categoryId == cat_id;
        })
        diplayGallery(filteredWorks);
    }
}

/********function displayEditButton()
 * to diplay the modification button that will allow the modal to be displayed
 * this function is called only if the user is logged in
 **************************************/
function displayEditButton(){
    const editButton = document.querySelector(".editButton");
    editButton.classList.remove("hidden");
}


/********function diplayModaleGallery(works)
 * to diplay the mini Galery on the modale form
 * taking a table of works as parameter
 **************************************/
function displayModaleGallery(works){
    const modaleGalleryElement = document.querySelector(".modale-gallery");
    modaleGalleryElement.innerHTML="";
    // for loop to create a figure for each works that will be poplulating the gallery on the page
    for(let i=0; i<works.length;i++){
        const imgCard = document.createElement("div");
        imgCard.classList.add("imgCard");

        const imgElement = document.createElement("img");
        imgElement.src = works[i].imageUrl;
        imgElement.alt = works[i].title;

        const binIconElement = document.createElement("img");
        binIconElement.src = "./assets/icons/binIcon.png";
        binIconElement.alt = "icon showing a bin - press to remove picture";
        binIconElement.classList.add("binIcon");

        imgCard.appendChild(imgElement);
        imgCard.appendChild(binIconElement);

        modaleGalleryElement.appendChild(imgCard);
    }
}

/********function OpenModale()
 * calling this function will Open the modal
 **************************************/
function openModale(){
    const modaleElement = document.querySelector(".modale");
    modaleElement.classList.remove("hidden");
    const darkBackGroundElement = document.querySelector(".darkBackGround");
    darkBackGroundElement.classList.remove("hidden");
    diplayModaleGalleryScreen();
    clickOutToClose()
}


/********function closeModale()
 * calling this function will hide the modal
 **************************************/
function closeModale(){
    const modaleElement = document.querySelector(".modale");
    modaleElement.classList.add("hidden");
    const darkBackGroundElement = document.querySelector(".darkBackGround");
    darkBackGroundElement.classList.add("hidden");
    stopClickOutToClose();
}

/********function diplayModaleGalleryScreen()
 * calling this function will hide the add photo screen and display the modal gallery screen
 *  **************************************/
function diplayModaleGalleryScreen(){
    // remove the back arrow icon
    const arrowIconElement = document.querySelector(".arrowIcon");
    arrowIconElement.classList.add("hidden");

    // reverse order of nav icon
    const navElement = document.querySelector(".modale-nav");
    navElement.style.flexDirection = "row-reverse";

    // hide the new photo screen by removing the .hidden class
    const newPhotoScreen = document.querySelector(".newPhotoScreen");
    newPhotoScreen.classList.add("hidden");

    // display teh screen 1 i.e. the galery screen
    const galleryScreen = document.querySelector(".galleryScreen");
    galleryScreen.classList.remove("hidden");

}




/********function diplayModaleNewPhotoScreen()
 * calling this function will hide modal gallery screen and display add new photo screen
 **************************************/
function displayModaleNewPhotoScreen(){
    // display the back arrow icon
    const arrowIconElement = document.querySelector(".arrowIcon");
    arrowIconElement.classList.remove("hidden");

    // reverse order of nav icon
    const navElement = document.querySelector(".modale-nav");
    navElement.style.flexDirection = "row";

    // hide teh screen 1 i.e. the galery screen
    const galleryScreen = document.querySelector(".galleryScreen");
    galleryScreen.classList.add("hidden");

    // display the new photo screen by removing the .hidden class
    const newPhotoScreen = document.querySelector(".newPhotoScreen");
    newPhotoScreen.classList.remove("hidden");

}

/********function makeCategoryMenu()
 * This function populate the drop down menu category of the modale,
 * taking as parameter the category info to display
 **************************************/
function makeCategoryMenu(category){
    const dropDownMenu = document.getElementById("category");
    for( let i=0; i<categories.length ; i++){
        const option = document.createElement("option");
        option.value = categories[i].name;
        option.innerText = categories[i].name;
        dropDownMenu.appendChild(option);
    }
}

/********function clickOutToClose()
 * This function add an event listner on the document so that if we click
 * outside the modale - it close
 **************************************/
function clickOutToClose(){
    document.querySelector(".darkBackGround").addEventListener("click", (event)=>{
        closeModale();
    });
}

