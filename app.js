document.addEventListener("DOMContentLoaded", () => {
    // Dán Discord Webhook URL vào đây.
    const DISCORD_WEBHOOK_URL =
        "https://discord.com/api/webhooks/1527509431053713498/YnwPR_5PUl8xwOryeDRHYxe2nwdTynw6vAq5c5pWFrtB9Mqt4z12Ec02tv_KXmDs4ai_";

    let currentStep = 0;

    const steps = [
        "step-services",
        "step-staff",
        "step-datetime",
        "step-summary"
    ];

    const bookingData = {
        service: null,
        price: null,
        staff: null,
        date: null,
        time: null
    };

    const menuContainer = document.getElementById("servicesMenu");
    const staffContainer = document.getElementById("staffList");
    const btnBack = document.getElementById("btnBack");
    const btnNext = document.getElementById("btnNext");
    const searchInput = document.getElementById("serviceSearch");
    const bookingDateInput = document.getElementById("bookingDate");
    const btnBookNow = document.getElementById("btnBookNow");

    // =====================================================
    // 1. HIỂN THỊ DANH SÁCH DỊCH VỤ
    // =====================================================

    function renderMenu(filter = "") {
        menuContainer.innerHTML = "";

        Object.entries(window.HERMOSA_MENU).forEach(([category, items]) => {
            const filteredItems = items.filter((item) =>
                item.name.toLowerCase().includes(filter.toLowerCase())
            );

            if (filteredItems.length === 0) return;

            const group = document.createElement("div");
            group.className = "accordion-group";

            const head = document.createElement("button");
            head.type = "button";
            head.className = "accordion-head";
            head.innerHTML = `${category} <span>▾</span>`;

            head.addEventListener("click", () => {
                group.classList.toggle("open");
            });

            const body = document.createElement("div");
            body.className = "accordion-body";

            const itemList = document.createElement("div");
            itemList.className = "item-list";

            filteredItems.forEach((item) => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "service-item";

                if (bookingData.service === item.name) {
                    itemDiv.classList.add("selected");
                }

                itemDiv.innerHTML = `
                    <div>${item.name}</div>
                    <div class="item-price">${item.price}</div>
                `;

                itemDiv.addEventListener("click", () => {
                    document
                        .querySelectorAll(".service-item")
                        .forEach((element) =>
                            element.classList.remove("selected")
                        );

                    itemDiv.classList.add("selected");

                    bookingData.service = item.name;
                    bookingData.price = item.price;

                    validateStep();
                });

                itemList.appendChild(itemDiv);
            });

            body.appendChild(itemList);
            group.append(head, body);
            menuContainer.appendChild(group);

            if (filter !== "") {
                group.classList.add("open");
            }
        });
    }

    renderMenu();

    searchInput.addEventListener("input", (event) => {
        renderMenu(event.target.value);
    });

    // =====================================================
    // 2. HIỂN THỊ DANH SÁCH NHÂN VIÊN
    // =====================================================

    window.HERMOSA_STAFF.forEach((staff) => {
        const card = document.createElement("div");
        card.className = "staff-card";
        card.textContent = staff;

        card.addEventListener("click", () => {
            document
                .querySelectorAll(".staff-card")
                .forEach((element) => element.classList.remove("selected"));

            card.classList.add("selected");
            bookingData.staff = staff;

            validateStep();
        });

        staffContainer.appendChild(card);
    });

    // =====================================================
    // 3. HIỂN THỊ KHUNG GIỜ
    // =====================================================

    const morningTimes = [
        "10:00 AM",
        "10:15 AM",
        "10:30 AM",
        "10:45 AM",
        "11:00 AM",
        "11:15 AM",
        "11:30 AM",
        "11:45 AM"
    ];

    const afternoonTimes = [
        "12:00 PM",
        "12:15 PM",
        "12:30 PM",
        "12:45 PM",
        "1:00 PM",
        "1:15 PM",
        "1:30 PM",
        "1:45 PM",
        "2:00 PM"
    ];

    function setTimeGrid(containerId, times) {
        const grid = document.getElementById(containerId);

        times.forEach((time) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "time-btn";
            button.textContent = time;

            button.addEventListener("click", () => {
                document
                    .querySelectorAll(".time-btn")
                    .forEach((element) =>
                        element.classList.remove("selected")
                    );

                button.classList.add("selected");
                bookingData.time = time;

                validateStep();
            });

            grid.appendChild(button);
        });
    }

    setTimeGrid("morning-slots", morningTimes);
    setTimeGrid("afternoon-slots", afternoonTimes);

    bookingDateInput.addEventListener("change", (event) => {
        bookingData.date = event.target.value;
        validateStep();
    });

    // Không cho khách chọn ngày trong quá khứ.
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    )
        .toISOString()
        .split("T")[0];

    bookingDateInput.min = localToday;

    // =====================================================
    // 4. CHUYỂN BƯỚC
    // =====================================================

    function updateStepVisibility() {
        document.querySelectorAll(".booking-step").forEach((element) => {
            element.classList.remove("active");
        });

        document.getElementById(steps[currentStep]).classList.add("active");

        const servicesTab = document.getElementById("btn-services-tab");
        const staffTab = document.getElementById("btn-staff-tab");

        servicesTab.classList.toggle("active", currentStep === 0);
        staffTab.classList.toggle("active", currentStep === 1);

        btnBack.disabled = currentStep === 0;

        validateStep();

        if (currentStep === 3) {
            document.getElementById(
                "summary-service"
            ).textContent = `${bookingData.service} (${bookingData.price})`;

            document.getElementById("summary-staff").textContent =
                bookingData.staff;

            document.getElementById(
                "summary-time"
            ).textContent = `${formatBookingDate(bookingData.date)} at ${
                bookingData.time
            }`;
        }
    }

    function validateStep() {
        let isValid = false;

        if (currentStep === 0) {
            isValid = Boolean(bookingData.service);
        } else if (currentStep === 1) {
            isValid = Boolean(bookingData.staff);
        } else if (currentStep === 2) {
            isValid = Boolean(bookingData.date && bookingData.time);
        }

        btnNext.disabled = !isValid;
    }

    btnNext.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateStepVisibility();
        }
    });

    btnBack.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepVisibility();
        }
    });

    document
        .getElementById("btn-services-tab")
        .addEventListener("click", () => {
            currentStep = 0;
            updateStepVisibility();
        });

    document.getElementById("btn-staff-tab").addEventListener("click", () => {
        if (bookingData.service) {
            currentStep = 1;
            updateStepVisibility();
        }
    });

    // =====================================================
    // 5. GỬI BOOKING ĐẾN DISCORD WEBHOOK
    // =====================================================

    btnBookNow.addEventListener("click", async () => {
        if (
            !bookingData.service ||
            !bookingData.staff ||
            !bookingData.date ||
            !bookingData.time
        ) {
            alert("Please complete all booking information.");
            return;
        }

        btnBookNow.disabled = true;
        btnBookNow.textContent = "Sending Appointment...";

        const discordMessage = {
            username: "Hermosa Booking",
            avatar_url:
                "https://cdn-icons-png.flaticon.com/512/3468/3468377.png",

            embeds: [
                {
                    title: "💅 New Appointment Booking",
                    description:
                        "A customer has submitted a new appointment request.",
                    color: 0xf4a6c1,

                    fields: [
                        {
                            name: "✨ Service",
                            value: String(bookingData.service),
                            inline: false
                        },
                        {
                            name: "💵 Price",
                            value: String(bookingData.price),
                            inline: true
                        },
                        {
                            name: "👩‍💼 Staff",
                            value: String(bookingData.staff),
                            inline: true
                        },
                        {
                            name: "📅 Date",
                            value: formatBookingDate(bookingData.date),
                            inline: true
                        },
                        {
                            name: "⏰ Time",
                            value: String(bookingData.time),
                            inline: true
                        }
                    ],

                    footer: {
                        text: "Hermosa Online Booking"
                    },

                    timestamp: new Date().toISOString()
                }
            ]
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(discordMessage)
            });

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    `Discord webhook error ${response.status}: ${errorText}`
                );
            }

            document.getElementById("successModal").style.display = "flex";
        } catch (error) {
            console.error("Booking webhook error:", error);

            alert(
                "Your booking could not be sent. Please try again or contact the salon."
            );
        } finally {
            btnBookNow.disabled = false;
            btnBookNow.textContent = "Confirm Appointment";
        }
    });

    // =====================================================
    // 6. HÀM PHỤ
    // =====================================================

    function formatBookingDate(dateString) {
        if (!dateString) return "Not selected";

        const [year, month, day] = dateString.split("-");

        return `${month}/${day}/${year}`;
    }

    updateStepVisibility();
});
