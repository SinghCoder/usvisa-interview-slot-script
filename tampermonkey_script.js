// ==UserScript==
// @name         US Visa Interview appointment slots look
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Automatically select options in the dropdown on foobar.com
// @author       Your Name
// @match        https://www.usvisascheduling.com/en-US/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    //window.addEventListener('load', function() {
        // Find the select dropdown element
        var selectElement = document.getElementById('post_select');
        console.log(`Select Element is: ${selectElement}`);

        if (selectElement) {
            // Get all the options in the dropdown
            var options = selectElement.options;
            console.log(`Options are: ${options}`);

            // Create a function to simulate change and move to the next option
            function selectNextOption() {
                // Simulate change event
                var event = new Event('change');
                selectElement.dispatchEvent(event);
                console.log(`selectElement.selectedIndex = ${selectElement.selectedIndex}`);

                // Move on to the next option
                if (selectElement.selectedIndex < options.length - 1) {
                    selectElement.selectedIndex++;
                } else {
                    // If at the last option, reset to the first option
                    selectElement.selectedIndex = 0;
                }

                // Wait for 5 seconds before selecting the next option
                setTimeout(selectNextOption, 10000);
            }

            // Start the loop
            selectNextOption();
        } else {
            console.error('Element with id "post_select" not found.');
        }
//    });
})();

