

/********** INITIALISATION of the Page *************/

initialise();
activateFilterButton();

/********** LOGIN Management ***********************
Check if user logedin and add the admin modification button if it is the case
for now: we use local storage but there might be a better way tbc
*/
if(userLoggedIn()){
    displayEditButton();
}

// add event listner on the "edit button" to open the modale
const editButton = document.querySelector(".editButton");
editButton.addEventListener("click", () =>{
    openModale();
});


/******** FONCTIONS ***********/

/**
 * to initialise the page: by
 * fetching the info from the api;
 * building the picture galleries on the main screen and on the modal;
 * building the filter on the main page with category extracted form the works to be displayed
 * bulding the category menu for the modale add photo screen form.
 */
async function initialise(){
    await updateBothGallery();
    await buildCategoryFilterFromWorks();
    await makeCategoryMenu();
}

/**
 * this function extract and dedup the category from the API works info and build the category filter button
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

    /*NOTE: there is an other way to get the category - by using the Gategory API directly
    but we might have a button filter for a category not usefull in case there is not photo of that category in the gallery
    /* second Function (not in use): creation of the filter button based on a new API feed to get the category data */
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
        filterButtonsElement[i].addEventListener("click", async (event)=>{
            const category_id = filterButtonsElement[i].dataset.id;
            await filterAndDisplayWork(category_id);
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
 * to fetch the data from API and update the gallery by redisplaying it  
 ************************************************************************/
async function updateGallery(){
    const updatedWorks = await fetchWorks();
    diplayGallery(updatedWorks);
}

/**
 * to fetch work from the API and update both photos gallery
 */
async function updateBothGallery(){
    const updatedWorks = await fetchWorks();
    diplayGallery(updatedWorks);
    displayModaleGallery(updatedWorks);
}

/**
 * to diplay the galery but only for a specific category 
 * taking the category - id as parameter
 * @param {number} cat_id: ID of the category of work user wants to see
 **************************************/
async function filterAndDisplayWork(cat_id){
    const works = await fetchWorks();
    if(cat_id==0){
        diplayGallery(works);
    } else {
        const filteredWorks = works.filter(function(work){
            return work.categoryId == cat_id;
        })
        diplayGallery(filteredWorks);
    }
}

/**
 * to diplay the modification button that will allow the modal to be displayed
 * this function is called only if the user is logged in
 **************************************/
function displayEditButton(){
    const editButton = document.querySelector(".editButton");
    editButton.classList.remove("hidden");
}

/**
 * check if user if logged in and return true if he is 
 * @returns {boolean} : true if logged in, flase if not
 **************************************/
function userLoggedIn(){
    if (!window.localStorage.getItem("1")){
        console.log("Not Logged-in");
        return false;
    } else {
        console.log("Logged-in");
        console.log(window.localStorage.getItem("1"));
        return true;
    }
}