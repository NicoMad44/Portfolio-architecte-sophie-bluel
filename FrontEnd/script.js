const responseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategories.json()
console.log(categories);

const responseWorks = await fetch("http://localhost:5678/api/works");
const works = await responseWorks.json();
console.log(works);

