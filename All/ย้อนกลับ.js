// 1. สร้างส่วนของ CSS สำหรับปุ่ม
const style = document.createElement('style');
style.innerHTML = `
    :root {
        --accent: #38bdf8;
        --border: rgba(255, 255, 255, 0.1);
        --speed: 0.6s;
        --curve: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .nav-btn-global {
        position: fixed; 
        top: 20px; 
        left: 20px; 
        height: 50px; 
        background: rgba(255, 255, 255, 0.08); 
        border: 1px solid var(--border);
        backdrop-filter: blur(20px); 
        -webkit-backdrop-filter: blur(20px);
        border-radius: 16px; 
        color: white;
        display: flex; 
        align-items: center; 
        padding: 0 20px;
        text-decoration: none; 
        z-index: 9999; 
        transition: var(--speed) var(--curve);
        font-family: 'Sarabun', sans-serif;
        font-size: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }

    .nav-btn-global:hover { 
        background: white; 
        color: black; 
        transform: scale(1.05) translateX(5px); 
        text-decoration: none;
    }

    .nav-btn-global i {
        margin-right: 8px;
    }
`;
document.head.appendChild(style);

// 2. สร้างโครงสร้าง HTML ของปุ่ม (เลือกระหว่าง Link ไปหน้าหลัก หรือ ย้อนกลับจริง)
const navBtn = document.createElement('a');
navBtn.className = 'nav-btn-global';
navBtn.href = 'index.html'; // เปลี่ยนเป็นหน้าหลักของคุณ หรือใช้ 'javascript:history.back()'
navBtn.innerHTML = '<i class="fas fa-arrow-left"></i> ย้อนกลับ';

// 3. นำปุ่มไปใส่ใน Body
document.body.prepend(navBtn);