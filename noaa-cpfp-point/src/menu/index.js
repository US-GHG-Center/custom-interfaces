import { CONTINUOUS, NON_CONTINIOUS, ALL } from "../enumeration";

/**
 * Shows options based on the provided query parameters and handles user interaction.
 * @param {Object} queryParams - The query parameters.
 * @param {string} queryParams.ghg - The type of greenhouse gas.
 * @param {string} queryParams.frequency - The frequency of measurements.
 * @param {string} queryParams.type - The type of measurement.
 * @returns {void}
 */
export const showOptions = (queryParams) => {
    let publicUrl = process.env.PUBLIC_URL;
    let {ghg, frequency, type} = queryParams;
    //options for selection
    let collectionMechanismDropdown = document.getElementById("collection-mechanism");

    // if frequency is available only then show the button
    // if frequency is continuous, change the dropdown selected value to continuous
    // if frequency is non-continuous, change the dropdown selected value to non-continuous
    if (!frequency) {
        collectionMechanismDropdown.style.display = "none";
        return;
    }

    if (frequency == CONTINUOUS) {
        collectionMechanismDropdown.value = CONTINUOUS;
    } else if (frequency == NON_CONTINIOUS){
        collectionMechanismDropdown.value = NON_CONTINIOUS;    
    } else {
        collectionMechanismDropdown.value = ALL;
    }
    collectionMechanismDropdown.addEventListener("change", (e) => {
        let clickedVal = e.target.value;
        if (clickedVal == NON_CONTINIOUS & type != NON_CONTINIOUS) { // and previous is not continuous
            let newlocation = `${publicUrl}/?ghg=${ghg}&frequency=${NON_CONTINIOUS}`;
            window.location.href = newlocation;
            collectionMechanismDropdown.value = NON_CONTINIOUS;
        } else if (clickedVal == CONTINUOUS & type != CONTINUOUS) { // and previous is discrete
            let newlocation = `${publicUrl}/?ghg=${ghg}&frequency=${CONTINUOUS}`;
            window.location.href = newlocation;
            collectionMechanismDropdown.value = CONTINUOUS;
        } else if (clickedVal == ALL & type != ALL) { // and previous is discrete
            let newlocation = `${publicUrl}/?ghg=${ghg}&frequency=${ALL}`;
            window.location.href = newlocation;
            collectionMechanismDropdown.value = ALL;} 
        else {
        // do nothing
        }
    });
}