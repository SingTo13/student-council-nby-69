<script type="module">
    // 1. Import ตัว db มาจากไฟล์กลาง (ระบุ Path ให้ถูกต้องตามที่เก็บไฟล์)
    import { db } from "./ฐานข้อมูล.js"; 
    
    // 2. Import ฟังก์ชันของ Firestore ที่จำเป็นต้องใช้ในหน้านี้
    import { 
        collection, 
        addDoc, 
        query, 
        orderBy, 
        onSnapshot, 
        serverTimestamp 
    } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

    const badWords = ["ควย", "เย็ด", "มึง", "กู", "สัส", "เหี้ย", "ดอกทอง", "ชิบหาย", "อีดอก"];

    const btnSubmit = document.getElementById('btnSubmit');
    const detailInput = document.getElementById('detail');
    const complaintList = document.getElementById('complaintList');
    const overlay = document.getElementById('stellarOverlay');

    // --- Logic การแสดง Alert (เหมือนเดิม) ---
    window.showAlert = (type, title, desc) => {
        const content = document.getElementById('alertContent');
        const icon = document.getElementById('alertIcon');
        content.style.background = type === 'success' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(40, 10, 10, 0.9)';
        content.style.borderColor = type === 'success' ? 'var(--accent)' : 'var(--danger)';
        icon.innerHTML = type === 'success' ? '<i class="fas fa-check-circle" style="color: var(--accent);"></i>' : '<i class="fas fa-exclamation-circle" style="color: var(--danger);"></i>';
        document.getElementById('alertTitle').innerText = title;
        document.getElementById('alertTitle').style.color = type === 'success' ? 'var(--accent)' : 'var(--danger)';
        document.getElementById('alertDesc').innerText = desc;
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 10);
    };

    window.closeOverlay = () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 400);
    };

    // --- การส่งข้อมูล (ใช้ db ที่ import มา) ---
    btnSubmit.addEventListener('click', async () => {
        const detail = detailInput.value.trim();
        if(!detail) return;
        if(badWords.some(word => detail.includes(word))) {
            showAlert('warning', 'คำไม่สุภาพ!', 'ขอความกรุณาใช้ถ้อยคำที่สุภาพในการแจ้งเรื่องครับ');
            return;
        }
        btnSubmit.disabled = true;
        try {
            await addDoc(collection(db, "complaints"), {
                detail: detail,
                status: "ยังไม่ได้แก้ไข",
                adminReply: "",
                timestamp: serverTimestamp()
            });
            detailInput.value = "";
            showAlert('success', 'ส่งเรื่องสำเร็จ!', 'ข้อมูลของคุณถูกส่งไปยังสภานักเรียนแล้ว');
        } catch (e) { console.error(e); }
        finally { btnSubmit.disabled = false; }
    });

    // --- การดึงข้อมูลมาแสดงผล (ใช้ db ที่ import มา) ---
    const q = query(collection(db, "complaints"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        complaintList.innerHTML = "";
        const now = new Date();
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

        snapshot.forEach((doc, index) => {
            const data = doc.data();
            const status = data.status || "ยังไม่ได้แก้ไข";
            
            if (data.timestamp && (status === "แก้ไขแล้ว" || status === "ไม่สามารถแก้ไขได้")) {
                const postDate = data.timestamp.toDate();
                if (now - postDate > sevenDaysInMs) return; 
            }

            let sClass = "status-wait";
            if(status === "กำลังดำเนินการ") sClass = "status-process";
            if(status === "แก้ไขแล้ว") sClass = "status-success";
            if(status === "ไม่สามารถแก้ไขได้") sClass = "status-fail";

            const item = document.createElement('div');
            item.className = 'complaint-item';
            item.style.animationDelay = `${index * 0.05}s`;
            item.innerHTML = `
                <span class="badge-status ${sClass}">${status}</span>
                <div style="font-size: 1rem; line-height: 1.6; color: #f1f5f9;">${data.detail}</div>
                ${data.adminReply ? `<div style="background: rgba(56,189,248,0.1); border-left: 4px solid var(--accent); padding: 12px; border-radius: 12px; margin-top: 15px; font-size: 0.9rem;">
                    <b style="color: var(--accent);"><i class="fas fa-reply me-1"></i>สภานักเรียน:</b> ${data.adminReply}
                </div>` : ""}
                <div style="font-size: 0.75rem; opacity: 0.4; margin-top: 15px;">
                    <i class="far fa-calendar-alt me-1"></i> ${data.timestamp ? data.timestamp.toDate().toLocaleString('th-TH') : 'กำลังส่ง...'}
                </div>
            `;
            complaintList.appendChild(item);
        });
    });
</script>
