/********** DATA DOWNLOAD FROM API *************/
// fetching the different category from the API
const categories = await fetchCategories();

// fetching all the works from the API
const works = await fetchWorks();

/********** INITIALISATION content from API *************/
diplayGallery(works); // Dynamically populating the gallery with the works from the API using the function
displayModaleGallery(works); // Dynamically populating the gallery with the works from the API using the function
makeCategoryMenu(category); // populate the category drop down menu of the form with function

/********** LOGIN Management *************/
// Check if user logedin and add the admin modification button if it is the case
if (!window.localStorage.getItem("1")){
    console.log("Not Logged-in");
} else {
    displayEditButton();
    console.log("Logged-in");
    console.log(window.localStorage.getItem("1"));
}

/******** FILTER ***********/
// Dynamically creating & populating the filter
const filterZone = document.querySelector(".filterZone");
    // Methode One : creation of the filter button based on a new API feed to get the category data
    for (let i=0; i<categories.length;i++){
        const filterButton = document.createElement("button");
        filterButton.innerText = categories[i].name;
        filterButton.dataset.id = categories[i].id;
        filterZone.appendChild(filterButton);
    } 
    /* Methode 2: Using the existing works data --- uncompleted

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

// add event listner on all button
const filterButtonsElement =document.querySelectorAll(".filterZone button");
//use the dataset.id to know which button is clicked and call the function
for(let i=0; i<filterButtonsElement.length; i++){
    filterButtonsElement[i].addEventListener("click",(event)=>{
        const category_id = filterButtonsElement[i].dataset.id;
        filterAndDisplayWork(category_id);
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
const binIconElements = document.querySelectorAll(".binIcon");
console.log(binIconElements);
for (let i=0; i<binIconElements.length; i++){
    binIconElements[i].addEventListener("click", async (event)=>{
        const work_id = event.target.dataset.id;
        console.log(work_id);
        await deleteWork(work_id);
        const updatedWorks = await fetchWorks();
        diplayGallery(updatedWorks);
        const imgCard = event.target.parentElement;
        imgCard.remove();
    });
}

// add event listner on the bleu ajouter photo button
const addPhotoButton2 = document.querySelector(".importPhotoZone .addPhotoButton");
const inputImgElement = document.getElementById("inputImg");

addPhotoButton2.addEventListener("click",async ()=>{
    inputImgElement.click();
})
inputImgElement.addEventListener("change", (event)=>{
    const file = event.target.files[0];
    displayPreview(file);
})


function displayPreview(file){
    const fileUrl = URL.createObjectURL(file);
    const imgPreviewElement = document.querySelector(".imgPreview");
    imgPreviewElement.src = fileUrl;
    imgPreviewElement.classList.remove("hidden");
    const zoneToHideAfterSelection = document.querySelector(".zoneToHideAfterSelection");
    zoneToHideAfterSelection.classList.add("hidden");
}

function hidePreview(){
    const imgPreviewElement = document.querySelector(".imgPreview");
    imgPreviewElement.classList.add("hidden");
    const zoneToHideAfterSelection = document.querySelector(".zoneToHideAfterSelection");
    zoneToHideAfterSelection.classList.remove("hidden");
}


function sendImg(){
    document.getElementById('uploadBtn').addEventListener('click', function () {
        const file = fileInput.files[0];
        if (!file) return;
      
        const formData = new FormData();
        formData.append('file', file);
      
        // Example endpoint: /upload (adapt as needed)
        fetch('/upload', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            alert('Upload successful!');
          })
          .catch(error => {
            alert('Upload failed!');
          });
      });
}







/******** FONCTIONS ***********/

/********function fetchCategories()
 * to fetch the work from the API
 * @return {array} categories: return an array with all the categories  
 **************************************/
async function fetchCategories(){
    const responseCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCategories.json()
    console.log(categories);
    return categories;
}

/********function fetchWorks()
 * to fetch the work from the API
 * @return {array} works: return an array with all the works  
 **************************************/
async function fetchWorks(){
    const responseWorks = await fetch("http://localhost:5678/api/works");
    const works = await responseWorks.json();
    console.log(works);
    return works;
}

/********function diplayGallery(works)
 * to diplay the galery 
 * taking a table of works as parameter
 * @param {array of work} works 
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
    console.log("Main Gallery is updated");
}

/********function filterAndDiplayWork(category-id)
 * to diplay the galery but only for a specific category 
 * taking the category - id as parameter
 * @param {number} cat_id: ID of the category of work user wants to see
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
    console.log("Modal mini gallery updated");
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
async function closeModale(){
    const modaleElement = document.querySelector(".modale");
    modaleElement.classList.add("hidden");
    const darkBackGroundElement = document.querySelector(".darkBackGround");
    darkBackGroundElement.classList.add("hidden");
    const updatedWorks = await fetchWorks();
    diplayGallery(updatedWorks);
    hidePreview();
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
 * @param {array of category} category 
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
/********function deleteWork()
 * This function add an event listner on the document so that if we click
 * outside the modale - it close
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