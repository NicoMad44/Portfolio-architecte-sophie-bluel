import { updateBothGallery, activateFilterButton } from "./script.js";
import {fetchCategories, deleteWork, sendImg} from "./scriptAPI.js";

/*************************
 * Overall Modale Script
 * ***********************/

// Build the category menu for the modale 
await makeCategoryMenu();

// to allow the navigation in the modale between its screen
activate_modale_nav()

// add event listners on all bin icon button to deleteWork
activatePhotoDeleteButtonIcon();

// add event listner on the select photo button of the form
activate_new_photo_form()


/***************************
 * Overall Modale FUNCTIONS
 * *************************/

/**
 * calling this function will Open the modal and
 * display the first screen: mini galery screen;
 * add event listner on the dark background to allow a closing of the modal if we clisk outside it
 **************************************/
function openModale(){
    const modaleElement = document.querySelector(".modale");
    modaleElement.classList.remove("hidden");
    const darkBackGroundElement = document.querySelector("aside.modaleBG");
    darkBackGroundElement.classList.remove("hidden");
    diplayModaleGalleryScreen();
    clickOutToClose();
}

/**
 * calling this function will hide the modal and
 *  update both gallery i.e. fetch the works from the API and update;
 * clean the form
 * update the filter button of the 
 * 
 **************************************/
async function closeModale(){
    const modaleElement = document.querySelector(".modale");
    modaleElement.classList.add("hidden");
    const darkBackGroundElement = document.querySelector(".modaleBG");
    darkBackGroundElement.classList.add("hidden");

    // clean form
        hiddePreview();
        clearFormInput();
        removeErrorMessage();
    // update main gallery page
        await updateBothGallery();
        activateFilterButton();
}

/**
 * This function add an event listner on the modale overalay so that if we click
 * outside the modale - it closes
 **************************************/
function clickOutToClose(){
    const modale = document.querySelector(".modale");
    document.querySelector(".modaleBG").addEventListener("click", (event)=>{
        // this is to prevent the modale to close when we click on the modale itself
        if (!modale.contains(event.target)) {
            closeModale();
        }
    });
}

/**
 * this function add event listner on the navigation icon of the modal
 * to navigate between the 2 screen of the modale
 */
function activate_modale_nav(){
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
    const addPhotoButton = document.querySelector(".addPhotoButton");
    addPhotoButton.addEventListener("click", ()=>{
        displayModaleNewPhotoScreen();
    });
}

/************************************************************
 * MiniPhoto Modale Gallery Screen readiness + Functionality
 * **********************************************************/

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
        imgElement.classList.add("imgPhoto");

        const binIconElement = document.createElement("img");
        binIconElement.src = "./assets/icons/binIcon.png";
        binIconElement.alt = "icon showing a bin - press to remove picture";
        binIconElement.dataset.id = works[i].id;
        binIconElement.classList.add("binIcon");

        imgCard.appendChild(imgElement);
        imgCard.appendChild(binIconElement);

        modaleGalleryElement.appendChild(imgCard);
    }
    activatePhotoDeleteButtonIcon();
    console.log("Modal mini gallery updated");
}

/**
 * to fetch the data from API and update the Modale gallery by redisplaying it  
 ************************************************************************/
async function updateModaleGallery(){
    const updatedWorks = await fetchWorks();
    //diplayGallery(updatedWorks);
    displayModaleGallery(updatedWorks);
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
 * to add eventlisnter on all the bin Icon of the modal galery screen
 * when cliked: the work is deleted and the img is removed form screen
 **************************************/
function activatePhotoDeleteButtonIcon(){
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





/***********************************************
 * New Photo Screen readiness + Functionality
 * *********************************************/

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
 * fetching the category from the API
 **************************************/
async function makeCategoryMenu(){
    const categories = await fetchCategories();
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
 * function to add events listeners on the form:
 * one on the slect new photo button
 * one on the title field of the form
 * one on the submit button on the form
 */
function activate_new_photo_form(){
    // add event listner on the select a photo button
    const selectPhotoButton = document.querySelector(".importPhotoZone .selectPhotoButton");
    const inputImgElement = document.getElementById("image");

    selectPhotoButton.addEventListener("click",async ()=>{
        inputImgElement.click(); // when we click on the button -> it trigers the image input element and the file selection screen appear
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

    // add event listner on the photo title field of the form
    // if filled then we check if there is a photo in preview and if yes, then we can allow submition
    const titleInput = document.getElementById("title");
    const imgPreviewElement = document.querySelector(".imgPreview");
    titleInput.addEventListener("change",()=>{

        if(titleInput.value != "" && !imgPreviewElement.classList.contains("hidden")) {// if NOT hidden, it means we have an eligible photo ready
            allowSubmition();
        } 
    })

    // add event listner on the new photo form to send picture when submited
    const newPhotoFormElement = document.querySelector(".modale-newPhotoForm");
    newPhotoFormElement.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const formData = await createPostData();
        await sendImg(formData);
        closeModale(); 
    });
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
 * to remove the error message
 */
function removeErrorMessage(){
    if(document.querySelector(".zoneToHideAfterSelection .errorMessage") != null){
        document.querySelector(".zoneToHideAfterSelection .errorMessage").innerHTML="";
    }
}

/**
 * to display the preview of the file pass as argment and
 * insert the name of the file to the title field of the form
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
 * This function get the info from the form and format it in a formData Object that it returns
 * @return {formData} formData :info from the form 
 *****************************************************************************/
async function createPostData(){ 
    const newPhotoForm = document.querySelector(".modale-newPhotoForm");
    const formData = new FormData(newPhotoForm);
    const categoryName = formData.get("category");
    //finding the category id from the category name:
    const categories = await fetchCategories();
    const found = categories.find(item => item.name === categoryName);
    const categoryId = found ? found.id : undefined;
    formData.set("category", categoryId);
    return formData
}

/**
 * to enable form button to submit image
 */
function allowSubmition(){
    const sendPhotoButton = document.querySelector(".sendImgButton");
        sendPhotoButton.disabled = false;
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


export{ displayModaleGallery, openModale, activatePhotoDeleteButtonIcon};