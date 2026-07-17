document.addEventListener("DOMContentLoaded", () => {
    /*
      IMPORTANT:
      For security, do not place your Discord webhook directly in this file.
      Create a Vercel serverless function at /api/booking.js and store the
      webhook in a Vercel environment variable named DISCORD_WEBHOOK_URL.
    */

    const bookingData = {
        service: null,
        price: null,
        staff: null,
        date: null,
        time: null
    };

    const stepTitles = [
        ["Step 1 of 4", "Choose your service"],
        ["Step 2 of 4", "Choose your nail artist"],
        ["Step 3 of 4", "Select date and time"],
        ["Step 4 of 4", "Review your appointment"]
    ];

    const morningTimes = [
        "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
        "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM"
    ];

    const afternoonTimes = [
        "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
        "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM",
        "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM",
        "3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM",
        "4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM",
        "5:00 PM", "5:15 PM", "5:30 PM", "5:45 PM",
        "6:00 PM", "6:15 PM", "6:30 PM"
    ];

    let currentStep = 0;

    const stepsTrack = document.getElementById("stepsTrack");
    const menuContainer = document.getElementById("servicesMenu");
    const staffContainer = document.getElementById("staffList");
    const searchInput = document.getElementById("serviceSearch");
    const resultCount = document.getElementById("serviceResultCount");
    const dateInput = document.getElementById("bookingDate");
    const availabilityText = document.getElementById("availabilityText");
    const btnBack = document.getElementById("btnBack");
    const btnNext = document.getElementById("btnNext");
    const btnBookNow = document.getElementById("btnBookNow");
    const successModal = document.getElementById("successModal");

    function getLocalISODate(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // This hides/disables every date before today in the browser date picker.
    const todayISO = getLocalISODate();
    dateInput.min = todayISO;

    function formatDate(dateString) {
        if (!dateString) return "Not selected";

        const date = new Date(`${dateString}T12:00:00`);
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }).format(date);
    }

    function formatShortDate(dateString) {
        if (!dateString) return "Choose your time";

        const date = new Date(`${dateString}T12:00:00`);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric"
        }).format(date);
    }

    function isPastDate(dateString) {
        return Boolean(dateString && dateString < todayISO);
    }

    function renderMenu(filter = "") {
        menuContainer.innerHTML = "";
        const normalizedFilter = filter.trim().toLowerCase();
        let visibleItemCount = 0;

        Object.entries(window.HERMOSA_MENU).forEach(([category, items], categoryIndex) => {
            const filteredItems = items.filter((item) =>
                item.name.toLowerCase().includes(normalizedFilter)
            );

            if (!filteredItems.length) return;
            visibleItemCount += filteredItems.length;

            const group = document.createElement("div");
            group.className = "accordion-group";

            if (normalizedFilter || categoryIndex === 0) {
                group.classList.add("open");
            }

            const head = document.createElement("button");
            head.type = "button";
            head.className = "accordion-head";
            head.innerHTML = `
                <strong>${category}</strong>
                <span>⌄</span>
            `;

            head.addEventListener("click", () => {
                group.classList.toggle("open");
            });

            const body = document.createElement("div");
            body.className = "accordion-body";

            const itemList = document.createElement("div");
            itemList.className = "item-list";

            filteredItems.forEach((item) => {
                const itemButton = document.createElement("button");
                itemButton.type = "button";
                itemButton.className = "service-item";

                if (bookingData.service === item.name) {
                    itemButton.classList.add("selected");
                }

                itemButton.innerHTML = `
                    <span class="service-name">${item.name}</span>
                    <span class="item-price">${item.price}</span>
                `;

                itemButton.addEventListener("click", () => {
                    bookingData.service = item.name;
                    bookingData.price = item.price;

                    document.querySelectorAll(".service-item").forEach((element) => {
                        element.classList.remove("selected");
                    });

                    itemButton.classList.add("selected");
                    updateSelections();
                    validateCurrentStep();
                });

                itemList.appendChild(itemButton);
            });

            body.appendChild(itemList);
            group.append(head, body);
            menuContainer.appendChild(group);
        });

        resultCount.textContent = `${visibleItemCount} service${visibleItemCount === 1 ? "" : "s"}`;

        if (!visibleItemCount) {
            menuContainer.innerHTML = `
                <div class="summary-item">
                    <span>No results</span>
                    <strong>Try searching for another service.</strong>
                </div>
            `;
        }
    }

    function renderStaff() {
        staffContainer.innerHTML = "";

        window.HERMOSA_STAFF.forEach((staff) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "staff-card";

            if (bookingData.staff === staff) {
                card.classList.add("selected");
            }

            const initials = staff === "Any available staff"
                ? "✦"
                : staff
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

            card.innerHTML = `
                <span class="staff-avatar">${initials}</span>
                <span>
                    <strong>${staff}</strong>
                    <small>${staff === "Any available staff" ? "Fastest available appointment" : "Nail artist"}</small>
                </span>
                <span class="staff-check">✓</span>
            `;

            card.addEventListener("click", () => {
                bookingData.staff = staff;

                document.querySelectorAll(".staff-card").forEach((element) => {
                    element.classList.remove("selected");
                });

                card.classList.add("selected");
                updateSelections();
                validateCurrentStep();
            });

            staffContainer.appendChild(card);
        });
    }

    function renderTimeGrid(containerId, times) {
        const grid = document.getElementById(containerId);
        grid.innerHTML = "";

        times.forEach((time) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "time-btn";
            button.textContent = time;
            button.disabled = !bookingData.date;

            if (bookingData.time === time) {
                button.classList.add("selected");
            }

            button.addEventListener("click", () => {
                if (!bookingData.date) return;

                bookingData.time = time;

                document.querySelectorAll(".time-btn").forEach((element) => {
                    element.classList.remove("selected");
                });

                button.classList.add("selected");
                updateSelections();
                validateCurrentStep();
            });

            grid.appendChild(button);
        });
    }

    function refreshTimeButtons() {
        document.querySelectorAll(".time-btn").forEach((button) => {
            button.disabled = !bookingData.date;
        });
    }

    function updateSelections() {
        document.getElementById("side-service").textContent = bookingData.service
            ? `${bookingData.service} · ${bookingData.price}`
            : "Choose a service";

        document.getElementById("side-staff").textContent =
            bookingData.staff || "Choose a nail artist";

        document.getElementById("side-datetime").textContent =
            bookingData.date && bookingData.time
                ? `${formatShortDate(bookingData.date)} · ${bookingData.time}`
                : "Choose your time";

        document.getElementById("summary-service").textContent = bookingData.service
            ? `${bookingData.service} (${bookingData.price})`
            : "Not selected";

        document.getElementById("summary-staff").textContent =
            bookingData.staff || "Not selected";

        document.getElementById("summary-date").textContent =
            formatDate(bookingData.date);

        document.getElementById("summary-time").textContent =
            bookingData.time || "Not selected";

        availabilityText.textContent = bookingData.date
            ? `${formatDate(bookingData.date)} selected`
            : "Select a date to view times";
    }

    function canOpenStep(stepIndex) {
        if (stepIndex === 0) return true;
        if (stepIndex === 1) return Boolean(bookingData.service);
        if (stepIndex === 2) return Boolean(bookingData.service && bookingData.staff);
        if (stepIndex === 3) {
            return Boolean(
                bookingData.service &&
                bookingData.staff &&
                bookingData.date &&
                bookingData.time
            );
        }
        return false;
    }

    function setStep(stepIndex) {
        if (!canOpenStep(stepIndex)) return;

        currentStep = stepIndex;
        stepsTrack.style.transform = `translateX(-${currentStep * 25}%)`;

        document.getElementById("stepKicker").textContent = stepTitles[currentStep][0];
        document.getElementById("stepHeading").textContent = stepTitles[currentStep][1];

        document.querySelectorAll(".progress-item").forEach((item, index) => {
            item.classList.toggle("active", index === currentStep);
        });

        document.querySelectorAll(".step-dots span").forEach((dot, index) => {
            dot.classList.toggle("active", index === currentStep);
        });

        btnBack.disabled = currentStep === 0;
        btnNext.style.display = currentStep === 3 ? "none" : "";
        validateCurrentStep();

        if (currentStep === 3) {
            updateSelections();
        }

        document.querySelector(".booking-panel").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    function validateCurrentStep() {
        let valid = false;
        let status = "";

        if (currentStep === 0) {
            valid = Boolean(bookingData.service);
            status = valid
                ? `${bookingData.service} selected`
                : "Select a service to continue";
        }

        if (currentStep === 1) {
            valid = Boolean(bookingData.staff);
            status = valid
                ? `${bookingData.staff} selected`
                : "Select a staff member to continue";
        }

        if (currentStep === 2) {
            valid = Boolean(bookingData.date && bookingData.time && !isPastDate(bookingData.date));
            status = valid
                ? `${formatShortDate(bookingData.date)} at ${bookingData.time}`
                : "Choose a valid date and time";
        }

        if (currentStep === 3) {
            valid = true;
            status = "Ready to confirm";
        }

        btnNext.disabled = !valid;
        document.getElementById("footerStatus").textContent = status;
    }

    searchInput.addEventListener("input", (event) => {
        renderMenu(event.target.value);
    });

    dateInput.addEventListener("change", (event) => {
        const selectedDate = event.target.value;

        if (isPastDate(selectedDate)) {
            bookingData.date = null;
            bookingData.time = null;
            dateInput.value = "";
            alert("Please choose today or a future date.");
        } else {
            bookingData.date = selectedDate;
            bookingData.time = null;
        }

        document.querySelectorAll(".time-btn").forEach((button) => {
            button.classList.remove("selected");
        });

        refreshTimeButtons();
        updateSelections();
        validateCurrentStep();
    });

    btnNext.addEventListener("click", () => {
        if (!btnNext.disabled && currentStep < 3) {
            setStep(currentStep + 1);
        }
    });

    btnBack.addEventListener("click", () => {
        if (currentStep > 0) {
            setStep(currentStep - 1);
        }
    });

    document.querySelectorAll("[data-step-jump]").forEach((button) => {
        button.addEventListener("click", () => {
            setStep(Number(button.dataset.stepJump));
        });
    });

    btnBookNow.addEventListener("click", async () => {
        if (!canOpenStep(3)) {
            alert("Please complete every booking step.");
            return;
        }

        const originalText = btnBookNow.innerHTML;
        btnBookNow.disabled = true;
        btnBookNow.innerHTML = "<span>Sending appointment...</span>";

        try {
            const response = await fetch("/api/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Unable to submit booking.");
            }

            successModal.classList.add("show");
            document.body.style.overflow = "hidden";
        } catch (error) {
            console.error(error);
            alert("Your appointment could not be submitted. Please call Hermosa Nails at (956) 627-3366.");
        } finally {
            btnBookNow.disabled = false;
            btnBookNow.innerHTML = originalText;
        }
    });

    function closeModal() {
        successModal.classList.remove("show");
        document.body.style.overflow = "";
        window.location.reload();
    }

    document.getElementById("closeSuccessModal").addEventListener("click", closeModal);

    document.querySelector(".modal-backdrop").addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && successModal.classList.contains("show")) {
            closeModal();
        }
    });

    document.getElementById("currentYear").textContent = new Date().getFullYear();

    renderMenu();
    renderStaff();
    renderTimeGrid("morning-slots", morningTimes);
    renderTimeGrid("afternoon-slots", afternoonTimes);
    updateSelections();
    setStep(0);
});
