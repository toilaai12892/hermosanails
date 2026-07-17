document.addEventListener("DOMContentLoaded", () => {
    // Khởi tạo các biến bước trạng thái
    let currentStep = 0; // 0: Dịch vụ, 1: Staff, 2: Ngày Giờ, 3: Xác nhận
    const steps = ["step-services", "step-staff", "step-datetime", "step-summary"];
    
    // Đối tượng lưu trữ thông tin lịch đặt
    let bookingData = { service: null, price: null, staff: null, date: null, time: null };

    // Dom Elements
    const menuContainer = document.getElementById("servicesMenu");
    const staffContainer = document.getElementById("staffList");
    const btnBack = document.getElementById("btnBack");
    const btnNext = document.getElementById("btnNext");
    const searchInput = document.getElementById("serviceSearch");

    // --- 1. ĐỔ DATA DỊCH VỤ VÀO ACCORDION ---
    function renderMenu(filter = "") {
        menuContainer.innerHTML = "";
        Object.entries(window.HERMOSA_MENU).forEach(([category, items]) => {
            const filteredItems = items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));
            if (filteredItems.length === 0) return;

            const group = document.createElement("div");
            group.className = "accordion-group";

            const head = document.createElement("button");
            head.className = "accordion-head";
            head.innerHTML = `${category} <span>▾</span>`;
            head.onclick = () => group.classList.toggle("open");

            const body = document.createElement("div");
            body.className = "accordion-body";

            const itemList = document.createElement("div");
            itemList.className = "item-list";

            filteredItems.forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "service-item";
                if(bookingData.service === item.name) itemDiv.classList.add("selected");
                
                itemDiv.innerHTML = `<div>${item.name}</div><div class="item-price">${item.price}</div>`;
                
                itemDiv.onclick = () => {
                    document.querySelectorAll(".service-item").forEach(el => el.classList.remove("selected"));
                    itemDiv.classList.add("selected");
                    bookingData.service = item.name;
                    bookingData.price = item.price;
                    validateStep();
                };
                itemList.appendChild(itemDiv);
            });

            body.appendChild(itemList);
            group.append(head, body);
            menuContainer.appendChild(group);
            if(filter !== "") group.classList.add("open"); // Tự mở nếu đang tìm kiếm
        });
    }
    renderMenu();
    searchInput.oninput = (e) => renderMenu(e.target.value);

    // --- 2. ĐỔ DATA NHÂN VIÊN (STAFF) ---
    window.HERMOSA_STAFF.forEach(staff => {
        const card = document.createElement("div");
        card.className = "staff-card";
        card.textContent = staff;
        card.onclick = () => {
            document.querySelectorAll(".staff-card").forEach(el => el.classList.remove("selected"));
            card.classList.add("selected");
            bookingData.staff = staff;
            validateStep();
        };
        staffContainer.appendChild(card);
    });

    // --- 3. ĐỔ DATA KHUNG GIỜ (TIME SLOTS) ---
    const morningTimes = ["10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM", "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM"];
    const afternoonTimes = ["12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM", "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM", "2:00 PM"];
    
    const setTimeGrid = (containerId, array) => {
        const grid = document.getElementById(containerId);
        array.forEach(time => {
            const btn = document.createElement("button");
            btn.className = "time-btn";
            btn.textContent = time;
            btn.onclick = () => {
                document.querySelectorAll(".time-btn").forEach(el => el.classList.remove("selected"));
                btn.classList.add("selected");
                bookingData.time = time;
                validateStep();
            };
            grid.appendChild(btn);
        });
    };
    setTimeGrid("morning-slots", morningTimes);
    setTimeGrid("afternoon-slots", afternoonTimes);

    document.getElementById("bookingDate").onchange = (e) => {
        bookingData.date = e.target.value;
        validateStep();
    };

    // --- 4. HỆ THỐNG ĐIỀU HƯỚNG BƯỚC (NAVIGATION LOGIC) ---
    function updateStepVisibility() {
        document.querySelectorAll(".booking-step").forEach(el => el.classList.remove("active"));
        document.getElementById(steps[currentStep]).classList.add("active");

        // Đồng bộ hiệu ứng thanh Top Tabs
        const servicesTab = document.getElementById("btn-services-tab");
        const staffTab = document.getElementById("btn-staff-tab");
        if(currentStep === 0) {
            servicesTab.classList.add("active");
            staffTab.classList.remove("active");
        } else if (currentStep === 1) {
            servicesTab.classList.remove("active");
            staffTab.classList.add("active");
        }

        btnBack.disabled = currentStep === 0;
        validateStep();

        if (currentStep === 3) {
            document.getElementById("summary-service").textContent = `${bookingData.service} (${bookingData.price})`;
            document.getElementById("summary-staff").textContent = bookingData.staff;
            document.getElementById("summary-time").textContent = `${bookingData.date} lúc ${bookingData.time}`;
        }
    }

    function validateStep() {
        let isValid = false;
        if (currentStep === 0 && bookingData.service) isValid = true;
        if (currentStep === 1 && bookingData.staff) isValid = true;
        if (currentStep === 2 && bookingData.date && bookingData.time) isValid = true;
        if (currentStep === 3) isValid = false; // Bước cuối dùng nút riêng

        btnNext.disabled = !isValid;
    }

    btnNext.onclick = () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateStepVisibility();
        }
    };

    btnBack.onclick = () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepVisibility();
        }
    };

    // Tabs Click nhanh
    document.getElementById("btn-services-tab").onclick = () => { currentStep = 0; updateStepVisibility(); };
    document.getElementById("btn-staff-tab").onclick = () => { 
        if(bookingData.service) { currentStep = 1; updateStepVisibility(); } 
    };

    // Nút xác nhận cuối cùng
    document.getElementById("btnBookNow").onclick = () => {
        document.getElementById("successModal").style.display = "flex";
    };
});
