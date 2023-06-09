import { data } from "./data.js";

const todaysDateObject = new Date();
const tomorrowsDateObject = new Date(todaysDateObject);

tomorrowsDateObject.setDate(todaysDateObject.getDate() + 1);
// Setting time to 0 to match input data that does not specify time
tomorrowsDateObject.setHours(0, 0, 0, 0);

// Date correction. If it is the last day of the month / last month of the year.
if (tomorrowsDateObject.getDate() === 1) {
    tomorrowsDateObject.setMonth(todaysDateObject.getMonth() + 1);
    if (tomorrowsDateObject.getMonth() === 0) {
        tomorrowsDateObject.setFullYear(todaysDateObject.getFullYear() + 1);
    }
}

/**
 *  Converts input data into ISO Date Format
 */

function getConvertedData() {
    const convertedArray = [];
    data.forEach((record) => {
        const dateArray = record.date.split("-");
        convertedArray.push({
            date: `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`,
            type: record.type,
        });
    });

    return convertedArray;
}

/**
 * Function finds a match between an object with a date key in the input data array
 * and and the date object. Function uses getTime() method to compare those dates.
 * Returns the resulting object.
 *
 * @param {array} data Expects array of objects with "date" key in ISO format.
 * @param {object} dateObject expects an instance of Date()
 * @returns object or undefined
 */

function findDate(data, dateObject) {
    return data.filter((record) => {
        if (new Date(record.date).getTime() === dateObject.getTime())
            return record;
    })[0];
}

/**
 * Function updates the extensions color depending on type of object that
 * findDate() function finds.
 *  * @param {string} color
 */
function updateIcon(color) {
    if (color === "default") {
        chrome.action.setIcon({ path: `icon.png` });
    } else {
        chrome.action.setIcon({ path: `icon-${color}.png` });
    }
}

/**
 * Shorthand function to execute the code to avoid repetition while adding
 * execution to different Chrome API actions.
 */
function run() {
    const data = findDate(getConvertedData(), tomorrowsDateObject);
    if (data) {
        updateIcon(data.type);
    } else {
        updateIcon("default");
    }
}

// Execution blocks

chrome.runtime.onStartup.addListener(run);
chrome.runtime.onInstalled.addListener(run);
chrome.action.onClicked.addListener(run);
