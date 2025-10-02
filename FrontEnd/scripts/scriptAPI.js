/********************************************
 * Functions used to fetch data from the API
 * ******************************************/

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

export { fetchWorks, fetchCategories};