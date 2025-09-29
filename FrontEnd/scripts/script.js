/********** DATA DOWNLOAD FROM API *************/
// fetching the different category from the API
const categories = await fetchCategories();

// fetching all the works from the API
const works = await fetchWorks();

/********** INITIALISATION content from API *************/
diplayGallery(works); // Dynamically populating the gallery with the works from the API using the function
displayModaleGallery(works); // Dynamically populating the gallery with the works from the API using the function
makeCategoryMenu(categories); // populate the category drop down menu of the form with function

/********** LOGIN Management *************/
// Check if user logedin and add the admin modification button if it is the case
if(userLoggedIn()){
    displayEditButton();
}


/******** FILTER ***********/
// Dynamically creating & populating the filter

/* Methode One : creation of the filter button based on a new API feed to get the category data */

    //buildCategoryFilterFromCategories(categories);

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

/* Methode 2: Using the existing works data  */

    buildCategoryFilterFromWorks(works);

    /**
     * this function extract and dedup the category from the API works info 
     * @param {array} works 
     */
    function buildCategoryFilterFromWorks(works){
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


// add event listner on all button
const filterButtonsElement =document.querySelectorAll(".filterZone button");
//use the dataset.id to know which button is clicked and call the function
for(let i=0; i<filterButtonsElement.length; i++){
    filterButtonsElement[i].addEventListener("click", async (event)=>{
        const category_id = filterButtonsElement[i].dataset.id;
        await filterAndDisplayWork(category_id);
    })
}

/********** MODALE *************/

// add event listner on the "edit button" to open the modale
const editButton = document.querySelector(".editButton");
editButton.addEventListener("click", () =>{
    openModale();
});

// add event listner on cross icon to close the modale
const crossIcon = document.querySelector(".crossIcon");
crossIcon.addEventListener("click", async ()=>{
    await closeModale();
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

// add event listners on all bin icon button to deleteWork
addEventListnerOnBinIcon();



// add event listner on the bleu Select photo button
const selectPhotoButton = document.querySelector(".importPhotoZone .selectPhotoButton");
const inputImgElement = document.getElementById("image");

selectPhotoButton.addEventListener("click",async ()=>{
    inputImgElement.click();
})
inputImgElement.addEventListener("change", (event)=>{
    const file = event.target.files[0];
    if(verifiedPhoto(file)){
        displayPreview(file);
        allowSubmition();
    } else {
        displayErrorMessage(file);
    }
})

//add event listner on the title field of the form
// if filled then we check if there is a photo in preview and if yes, then we can allow submition
const titleInput = document.getElementById("title");
const zoneToHideAfterSelection = document.querySelector(".zoneToHideAfterSelection");
titleInput.addEventListener("change",()=>{

    if(titleInput.value != "" && zoneToHideAfterSelection.classList.contains("hidden")) {// if hidden, it means that there is eligeable photo selected
        allowSubmition();
    } 
})




const newPhotoFormElement = document.querySelector(".modale-newPhotoForm");
newPhotoFormElement.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const formData = createPostData();
    await sendImg(formData);
    await updateBothGallery();
    closeModale(); 
});

/******** FONCTIONS ***********/

/**
 * to enable form button to submit image
 */
function allowSubmition(){
    const sendPhotoButton = document.querySelector(".sendImgButton");
        sendPhotoButton.disabled = false;
}



/**
 * to display an error message when the selected file is not respecting constraint
 */
function displayErrorMessage(file){
    const errorMessage = `The image ${file.name} is too large, please choose select an image less than 4Mo`
    const errorMessageElement = document.createElement("p");
    errorMessageElement.classList.add("errorMessage");
    errorMessageElement.innerText = errorMessage;
    document.querySelector(".zoneToHideAfterSelection").appendChild(errorMessageElement);
}

/**
 * to remove the error message & clean form
 */
function removeErrorMessage(){
    if(document.querySelector(".zoneToHideAfterSelection .errorMessage") != null){
        document.querySelector(".zoneToHideAfterSelection .errorMessage").innerHTML="";
    }
}

/**
 * to check that the file selected is following the rules:
 * i.e. png or jpeg and size< 4mo
 * @param {file}: file to verify
 * @returns {boolean}: true if respect rule
 */
function verifiedPhoto(file){
    if(file.size<=4000000 && ((file.type === "image/png") || (file.type === "image/jpeg"))){
        console.log(file);
        console.log("Photo validated")
        return true
    }
    console.log("file is too large or not the right format")
    return false
}

/** 
 * This function empty the title field fo the form 
 *****************************************************************************/
function clearFormInput(){
    const titleInput = document.getElementById("title");
    titleInput.value = "";
    const imgInput = document.getElementById("image");
    imgInput.value = "";
}

/** 
 * This function get the info from the form and format it in a formData Object that it returns
 * @return {formData} formData :info from the form 
 *****************************************************************************/
function createPostData(){ 
    const newPhotoForm = document.querySelector(".modale-newPhotoForm");
    const formData = new FormData(newPhotoForm);
    const categoryName = formData.get("category");
    //finding the category id from the category name:
    const found = categories.find(item => item.name === categoryName);
    const categoryId = found ? found.id : undefined;
    formData.set("category", categoryId);
    return formData
}

/** 
 * This function send a POST request to the API and upload the info contains in the formData
 *****************************************************************************/
function sendImg(formData){
    fetch(`http://localhost:5678/api/works`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("1")}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        console.log('Resource added successfully');
    })
    .catch(error => {
        console.error('There was a problem with the POST request:', error.message);
    });
}  

/**
 * to fetch the categories from the API
 * @return {array} categories: return an array with all the categories  
 **************************************/
async function fetchCategories(){
    const responseCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCategories.json()
    console.log("categories updated:");
    console.log(categories);
    return categories;
}

/**
 * to fetch the work from the API
 * @return {array} works: return an array with all the works  
 **************************************/
async function fetchWorks(){
    const responseWorks = await fetch("http://localhost:5678/api/works");
    const works = await responseWorks.json();
    console.log("works updated:");
    console.log(works);
    return works;
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
 * to fetch the data from API and update the Modale gallery by redisplaying it  
 ************************************************************************/
async function updateModaleGallery(){
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
 * to diplay the mini Galery on the modale form & add eventlistner on all "bin Icon"
 * taking a table of works as parameter
 * @param {array of work} works 
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
        binIconElement.dataset.id = works[i].id;
        binIconElement.classList.add("binIcon");

        imgCard.appendChild(imgElement);
        imgCard.appendChild(binIconElement);

        modaleGalleryElement.appendChild(imgCard);
    }
    addEventListnerOnBinIcon();
    console.log("Modal mini gallery updated");
}

/**
 * calling this function will Open the modal and
 **************************************/
function openModale(){
    const modaleElement = document.querySelector(".modale");
    modaleElement.classList.remove("hidden");
    const darkBackGroundElement = document.querySelector(".darkBackGround");
    darkBackGroundElement.classList.remove("hidden");
    diplayModaleGalleryScreen();
    clickOutToClose();
}

/**
 * calling this function will hide the modal and
 * -> update both gallery i.e. fetch the works from the API and update
 **************************************/
async function closeModale(){
    const modaleElement = document.querySelector(".modale");
    modaleElement.classList.add("hidden");
    const darkBackGroundElement = document.querySelector(".darkBackGround");
    darkBackGroundElement.classList.add("hidden");
    updateBothGallery();
    hiddePreview();
    removeErrorMessage();
    clearFormInput();
}

/**
 * calling this function will hide the add photo screen and display the modal gallery screen
 *  **************************************/
function diplayModaleGalleryScreen(){
    // remove the back arrow icon
    const arrowIconElement = document.querySelector(".arrowIcon");
    arrowIconElement.classList.add("hidden");

    // reverse order of nav icon
    const navElement = document.querySelector(".modale-nav");
    navElement.style.flexDirection = "row-reverse";

    // hide the new photo screen by adding the .hidden class
    const newPhotoScreen = document.querySelector(".newPhotoScreen");
    newPhotoScreen.classList.add("hidden");

    // display teh screen 1 i.e. the galery screen
    const galleryScreen = document.querySelector(".galleryScreen");
    galleryScreen.classList.remove("hidden");
}

/**
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

/**
 * This function populate the drop down menu category of the modale,
 * taking as parameter the category info to display
 * @param {array of category} category 
 **************************************/
function makeCategoryMenu(categories){
    const dropDownMenu = document.getElementById("category");
    for( let i=0; i<categories.length ; i++){
        const option = document.createElement("option");
        option.value = categories[i].name;
        option.dataset.id = categories[i].id;
        option.innerText = categories[i].name;
        dropDownMenu.appendChild(option);
    }
    console.log("menu updated")
}

/**
 * This function add an event listner on the modale overalay so that if we click
 * outside the modale - it close
 **************************************/
function clickOutToClose(){
    document.querySelector(".darkBackGround").addEventListener("click", (event)=>{
        closeModale();
    });
}

/********function deleteWork()
 * This function make a DELETE request to the API and delete work of work_id from API
 **************************************/
async function deleteWork(work_id){
    fetch(`http://localhost:5678/api/works/${work_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem("1")}`
        }
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        console.log('Resource deleted successfully');
    })
    .catch(error => {
        console.error('There was a problem with the DELETE request:', error.message);
    });
}

/**
 * to display the preview of the file pass as argment
 * @param {file img} file: img file to dislay
 **************************************/
function displayPreview(file){
    const fileUrl = generateImgURL(file);
    const imgPreviewElement = document.querySelector(".imgPreview");
    imgPreviewElement.src = fileUrl;
    imgPreviewElement.classList.remove("hidden");
    const zoneToHideAfterSelection = document.querySelector(".zoneToHideAfterSelection");
    zoneToHideAfterSelection.classList.add("hidden");
    const titleFromElement = document.getElementById("title");
    titleFromElement.value = file.name;
}

/********function hidePreview()
 * to hidde the imgage preview and diplay the button back 
 **************************************/
function hiddePreview(){
    const imgPreviewElement = document.querySelector(".imgPreview");
    imgPreviewElement.classList.add("hidden");
    const zoneToHideAfterSelection = document.querySelector(".zoneToHideAfterSelection");
    zoneToHideAfterSelection.classList.remove("hidden");
}

/**
 * to generate and returning the image URL of a image file
 * @param {file}
 * @returns {string} imgURL
 **************************************/
function generateImgURL(file){
    return URL.createObjectURL(file);
}

/**
 * to add eventlisnter on all the bin Icon of the modal galery screen
 * when cliked: the work is deleted and the img is removed form screen
 **************************************/
function addEventListnerOnBinIcon(){
    const binIconElements = document.querySelectorAll(".binIcon");
    for (let i=0; i<binIconElements.length; i++){
        binIconElements[i].addEventListener("click", async (event)=>{
            const work_id = event.target.dataset.id;
            console.log(work_id);
            await deleteWork(work_id);
            const imgCard = event.target.parentElement;
            imgCard.remove();
        });
    }
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