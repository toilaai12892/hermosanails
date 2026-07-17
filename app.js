document.addEventListener("DOMContentLoaded", () => {
    // THAY LINK DISCORD WEBHOOK CỦA BẠN VÀO ĐÂY GIỮA HAI DẤU NHÁY đơn/kép
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1527509431053713498/YnwPR_5PUl8xwOryeDRHYxe2nwdTynw6vAq5c5pWFrtB9Mqt4z12Ec02tv_KXmDs4ai_";

    let currentStep = 0; 
    const steps = ["step-services", "step-staff", "step-datetime", "step-summary"];
    let bookingData = { service: null, price: null, staff: null, date: null, time: null };

    const menuContainer = document.getElementById("servicesMenu");
    const staffContainer = document.getElementById("staffList");
    const btnBack = document.getElementById("btnBack");
    const btnNext = document.getElementById("btnNext");
    const searchInput = document.getElementById("serviceSearch");

    // --- 1. RENDER MENU ---
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
            if(filter !== "") group.classList.add("open");
        });
    }
    renderMenu();
    searchInput.oninput = (e) => renderMenu(e.target.value);

    // --- 2. RENDER STAFF ---
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

    // --- 3. RENDER TIME ---
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

    // --- 4. NAVIGATION LOGIC ---
    function updateStepVisibility() {
        document.querySelectorAll(".booking-step").forEach(el => el.classList.remove("active"));
        document.getElementById(steps[currentStep]).classList.add("active");

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
            document.getElementById("summary-time").textContent = `${bookingData.date} at ${bookingData.time}`;
        }
    }

    function validateStep() {
        let isValid = false;
        if (currentStep === 0 && bookingData.service) isValid = true;
        if (currentStep === 1 && bookingData.staff) isValid = true;
        if (currentStep === 2 && bookingData.date && bookingData.time) isValid = true;
        btnNext.disabled = !isValid;
    }

    btnNext.onclick = () => {
        if (currentStep < steps.length - 1) { currentStep++; updateStepVisibility(); }
    };

    btnBack.onclick = () => {
        if (currentStep > 0) { currentStep--; updateStepVisibility(); }
    };

    document.getElementById("btn-services-tab").onclick = () => { currentStep = 0; updateStepVisibility(); };
    document.getElementById("btn-staff-tab").onclick = () => { 
        if(bookingData.service) { currentStep = 1; updateStepVisibility(); } 
    };

    // --- 5. 🔥 GỬI THÔNG BÁO THẬT SỰ QUA DISCORD WEBHOOK ---
    document.getElementById("btnBookNow").onclick = async () => {
        const confirmBtn = document.getElementById("btnBookNow");
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Sending Request...";

        // Cấu trúc nội dung tin nhắn gửi về Discord siêu đẹp dạng Embed
        const embedPayload = {
            username: "Hermosa Nails Bot",
            avatar_url: "https://images.unsplash.com/photo-1604654894610-df4906b18563?q=80&w=200&auto=format&fit=crop", // Ảnh đại diện bot
            embeds: [{
                title: "✨ NEW APPOINTMENT BOOKED ✨",
                color: 14661484, // Màu vàng gold sang chảnh (mã Hex đổi sang Dec)
                fields: [
                    { name: "💅 Service", value: `**${bookingData.service}** (${bookingData.price})`, inline: false },
                    { name: "👤 Staff Selected", value: `${bookingData.staff}`, inline: true },
                    { name: "📅 Date & Time", value: `🗓️ ${bookingData.date}\n⏰ **${bookingData.time}**`, inline: true }
                ],
                footer: { text: "Hermosa Nails Live Booking System" },
                timestamp: new Date().toISOString()
            }]
        };

        try {
            // Gửi dữ liệu đi bằng hàm fetch API ngầm của trình duyệt cực kỳ nhanh mượt
            await fetch(DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(embedPayload)
            });

            // Hiện màn hình chúc mừng đặt thành công
            document.getElementById("successModal").style.display = "flex";
        } catch (error) {
            alert("Something went wrong! Please try again.");
            console.error(error);
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Confirm Appointment";
        }
    };
});
