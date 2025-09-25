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

// Check if user logedin and add the admin modification button if it is the case
if (!window.localStorage.getItem("1")){
    console.log("pas logger");
} else {
    diplayAdminTool();
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
console.log(filterButtonsElement)

/* loop to add event listner on all button - I use the dataset.id to know which button is clicked
* When a button is clicked, I call the function to filter and display the works
*/
for(let i=0; i<filterButtonsElement.length; i++){
    filterButtonsElement[i].addEventListener("click",(event)=>{
        const category_id = filterButtonsElement[i].dataset.id;
        
        filterAndDisplayWork(category_id);

    })
}


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

/********function displayAdminTool()
 * to diplay the modification button that will allow the modal to be displayed
 * this function is called only if the user is logged in
 **************************************/
function displayAdminTool(){
    const portfolio_titleZone = document.getElementById("portfolio-titleZone");
    

}