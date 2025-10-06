import { userLoggedIn, updateNavLinks } from "./loginScript.js";
import { fetchCategories, fetchWorks } from "./scriptAPI.js";
import { displayModaleGallery, openModale, makeCategoryMenu } from "./scriptModale.js";


/****************************
 * Overall Main Page Script
 * **************************/


//  INITIALISATION of the Page
    console.log("index Page loading");
    // fetch info from API
    const works = await fetchWorks();
    window.localStorage.setItem("storedWorks", JSON.stringify(works));
    const categories = await fetchCategories();
    window.localStorage.setItem("storedCategories", JSON.stringify(categories));

    // display the Main gallery
    let storedWorks = JSON.parse(window.localStorage.getItem("storedWorks"));
    diplayGallery(storedWorks);
    // create the element for the modale gallery
    displayModaleGallery(storedWorks);
    // Build the category menu for the modale
    let storedCategories = JSON.parse(window.localStorage.getItem("storedCategories"));
    makeCategoryMenu(storedCategories);
    // Build, display and activate the filter buttons based on the Information form the API WORKS
    buildCategoryFilterFromCategories(storedCategories);
    activateFilterButton();
    // add event listner on the "edit button" to open the modale
    const editButton = document.querySelector(".editButton");
    editButton.addEventListener("click", () =>{
        openModale();
    });


//  LOGIN Management 

    //Check if user logedin and 
    //add the admin modification button + update login nav link to logout
    // + add a event listner on logout -> to remove toekn from local storage

    if(userLoggedIn()){
        // display editButton
        const editButton = document.querySelector(".editButton");
        editButton.classList.remove("hidden");
        updateNavLinks();
        const logoutNavLink = document.querySelector(".loginLink");
        logoutNavLink.addEventListener("click", ()=>{
            // if user click on "logout" the token is removed from local storage
            window.localStorage.removeItem("userToken");
            updateNavLinks();
        })
    }

    console.log("index Page loaded");

/*******************************
 * Overall Main Page FUNCTIONS
 * *****************************/

/**
 * NOT IN USE - this function extract and dedup the category from the API works info and build the category filter button
 * @param {array} works 
 */
async function buildCategoryFilterFromWorks(){
    const works = await fetchWorks();
    const categoriesInWorks = new Map();
    categoriesInWorks.set(0,"Tous"); // I add a 0 value for the "tous" option
    //loop to go througth all the works and add the category to the Map only if id not already contains in Map
    for (let i =0; i<works.length; i++){
        if(!categoriesInWorks.has(works[i].category.id)){
            categoriesInWorks.set(works[i].category.id, works[i].category.name);  
        }
    }
    console.log(`category from Works deduplicated:`)
    console.log(categoriesInWorks);
    const filterZone = document.querySelector(".filterZone");
    filterZone.innerHTML="";
    for (const [key, value] of categoriesInWorks){
        const filterButton = document.createElement("button");
        filterButton.innerText = value;
        filterButton.dataset.id = key;
        filterZone.appendChild(filterButton);
    } 
    console.log("filter updated")
}

/**
 * this function take the category from the api category info
 * @param {array} categories 
 */
function buildCategoryFilterFromCategories(categories){
    const filterZone = document.querySelector(".filterZone");
    filterZone.innerHTML="";
    const filterButtonTous = document.createElement("button");
    filterButtonTous.innerText="Tous";
    filterButtonTous.dataset.id = 0;
    filterZone.appendChild(filterButtonTous);
    for (let i=0; i<categories.length;i++){
        const filterButton = document.createElement("button");
        filterButton.innerText = categories[i].name;
        filterButton.dataset.id = categories[i].id;
        filterZone.appendChild(filterButton);
    } 
}

/**
 * to add the event listener on all filter button
 * on the click -> filter the photo according to which button clicked
 */
function activateFilterButton(){
    const filterButtonsElement =document.querySelectorAll(".filterZone button");
    //use the dataset.id to know which button is clicked and call the function
    for(let i=0; i<filterButtonsElement.length; i++){
        filterButtonsElement[i].addEventListener("click", (event)=>{
            const cat_id = filterButtonsElement[i].dataset.id;
            const storedWorks = JSON.parse(window.localStorage.getItem("storedWorks"));
            if(cat_id==0){
                diplayGallery(storedWorks);
            } else {
                const filteredWorks = storedWorks.filter(function(work){
                    return work.categoryId == cat_id;
                })
                diplayGallery(filteredWorks);
            }
        })
    }
}

/** 
 * to diplay the galery taking a table of works as parameter
 * @param {array of work} works 
 **************************************/
function diplayGallery(works){
    const galleryElement = document.querySelector(".gallery");
    galleryElement.innerHTML="";
    // loop to create a figure for each works that will be poplulating the gallery on the page
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
    console.log("Main Gallery is updated");
}

/**
 * update both photos gallery using the works in local storage
 */
function updateBothGallery(){
    const updatedWorks = JSON.parse(window.localStorage.getItem("works"));
    diplayGallery(updatedWorks);
    displayModaleGallery(updatedWorks);
}


/**
 * works on the local storage by fetching the info from the API and replacing the current local storage
 * @param {array of work} works
 * @param {Int} workId: id of the work to be removed or added
 */
async function updateStoredWorks(){
    window.localStorage.removeItem("works");
    const updatedWorks = await fetchWorks();
    window.localStorage.setItem("works", JSON.stringify(updatedWorks));
    console.log("local Storage updated")
}


export{updateBothGallery, activateFilterButton, updateStoredWorks};