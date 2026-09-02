// =====================================
// MotorMile JavaScript
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // Form Elements
    const form = document.querySelector("#service form");
    const serviceSelect = form.querySelector("select");
    const dateInput = form.querySelector('input[type="date"]');
    const timeInput = form.querySelector('input[type="time"]');
    const notesInput = form.querySelector("textarea");

    // History Table
    const table = document.querySelector("#history table");

    // -----------------------------------
    // Load Saved Services
    // -----------------------------------

    let services =
        JSON.parse(localStorage.getItem("motorMileServices")) || [];

    loadServices();

    // -----------------------------------
    // Form Submit
    // -----------------------------------

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const service = serviceSelect.value;
        const date = dateInput.value;
        const time = timeInput.value;
        const notes = notesInput.value;

        // Validation
        if (date === "" || time === "") {

            alert("Please select date and time.");

            return;
        }

        // Service Cost
        let cost = getCost(service);

        // Create Object
        const newService = {

            service: service,
            date: date,
            time: time,
            notes: notes,
            cost: cost,
            status: "Booked"
        };

        // Save
        services.push(newService);

        localStorage.setItem(
            "motorMileServices",
            JSON.stringify(services)
        );

        // Add to Table
        addServiceToTable(newService);

        // Message
        alert(
            "Service Booked Successfully!\n\n" +
            "Service: " + service + "\n" +
            "Date: " + formatDate(date) + "\n" +
            "Time: " + time
        );

        // Reset Form
        form.reset();
    });

    // -----------------------------------
    // Service Cost
    // -----------------------------------

    function getCost(service) {

        const prices = {

            "General Service": 4200,
            "Oil Change": 2500,
            "Brake Inspection": 1500,
            "Engine Check": 3000,
            "Tyre Replacement": 6000
        };

        return prices[service] || 0;
    }

    // -----------------------------------
    // Add Row
    // -----------------------------------

    function addServiceToTable(service) {

        const row = table.insertRow(-1);

        row.innerHTML = `
            <td>${formatDate(service.date)}</td>
            <td>${service.service}</td>
            <td>₹${service.cost}</td>
            <td>${service.status}</td>
        `;
    }

    // -----------------------------------
    // Load Existing Data
    // -----------------------------------

    function loadServices() {

        services.forEach(function (service) {

            addServiceToTable(service);

        });
    }

    // -----------------------------------
    // Format Date
    // -----------------------------------

    function formatDate(dateString) {

        const date = new Date(dateString);

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }

    // -----------------------------------
    // Smooth Scroll
    // -----------------------------------

    const links =
        document.querySelectorAll(".nav-links a");

    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const id =
                    link.getAttribute("href");

                const target =
                    document.querySelector(id);

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        );
    });

});