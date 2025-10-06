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

/********function deleteWork()
 * This function make a DELETE request to the API and delete work of work_id from API
 **************************************/
async function deleteWork(work_id){
    fetch(`http://localhost:5678/api/works/${work_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem("userToken")}`
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
 * This function send a POST request to the API and upload the info contains in the formData
 *****************************************************************************/
async function sendImg(formData){
    fetch(`http://localhost:5678/api/works`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("userToken")}`
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

export { fetchWorks, fetchCategories, deleteWork, sendImg};