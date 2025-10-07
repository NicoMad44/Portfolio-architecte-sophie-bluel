import { updateStoredWorks } from "./script.js";   
import {closeModale} from "./scriptModale.js";

const apiUrl = "http://localhost:5678/api/"

/********************************************
 * Functions used to fetch data from the API
 * ******************************************/

/**
 * to fetch the work from the API
 * @return {array} works: return an array with all the works  
 **************************************/
async function fetchWorks(){
    const responseWorks = await fetch(`${apiUrl}works`);
    const works = await responseWorks.json();
    console.log("works fetched from API:");
    console.log(works);
    return works;
}

/**
 * to fetch the categories from the API
 * @return {array} categories: return an array with all the categories  
 **************************************/
async function fetchCategories(){
    const responseCategories = await fetch(`${apiUrl}categories`);
    const categories = await responseCategories.json()
    console.log("categories fetched from API:");
    console.log(categories);
    return categories;
}

/**
 * This function make a DELETE request to the API and delete work of workId from API
 **************************************/
async function deleteWork(workId){
    fetch(`${apiUrl}works/${workId}`, {
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
 * This function send a POST request to the API and upload the info contains in the formData to add the work
 * it also update the local storage once the work is uploaded by updating the local storage from the API
 * finally it closes the modale -> triggering the update of the gallery screen to reflect the new elements added
 *****************************************************************************/
async function sendImg(formData){
    fetch(`${apiUrl}works`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("userToken")}`
        },
        body: formData
    })
    .then(async response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        console.log('Resource added successfully');
        await updateStoredWorks();
        closeModale();
    })
    .catch(error => {
        console.error('There was a problem with the POST request:', error.message);
    });
}  

export { fetchWorks, fetchCategories, deleteWork, sendImg};