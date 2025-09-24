const responseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategories.json()
console.log(categories);

const responseWorks = await fetch("http://localhost:5678/api/works");
const works = await responseWorks.json();
console.log(works);

const galleryElement = document.querySelector(".gallery");

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


