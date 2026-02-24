(function() {
    // 1. เพิ่ม CSS สำหรับ Background, ดวงดาว และดาวตก (ฉบับ Optimized)
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --space-bg: #030712;
            --core-glow: #1e293b;
            --accent-glow: rgba(56, 189, 248, 0.1);
            --star-color: #ffffff;
        }

        body {
            margin: 0;
            min-height: 100vh;
            background: radial-gradient(circle at center, var(--core-glow) 0%, var(--space-bg) 100%) !important;
            background-attachment: fixed !important;
            position: relative;
            overflow-x: hidden; /* ป้องกัน scrollbar แนวนอน */
        }

        body::before {
            content: "";
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, var(--accent-glow), transparent 80%);
            z-index: -2;
            pointer-events: none;
        }

        .stars-container {
            position: fixed;
            inset: 0;
            z-index: -1;
            pointer-events: none;
            perspective: 1000px;
        }

        /* --- ดวงดาว (ใช้ opacity และ scale แบบ hardware accelerated) --- */
        .star-global {
            position: absolute;
            background: var(--star-color);
            border-radius: 50%;
            will-change: opacity, transform;
            animation: shimmerGlobal var(--d) infinite ease-in-out;
        }

        @keyframes shimmerGlobal {
            0%, 100% { opacity: var(--op); transform: translate3d(0,0,0) scale(1); }
            50% { opacity: 0.2; transform: translate3d(0,0,0) scale(0.6); }
        }

        /* --- ดาวตก (Meteor) ปรับปรุงความสมูท --- */
        .meteor {
            position: absolute;
            width: 2px;
            height: 2px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 15px 2px rgba(255,255,255,0.4);
            will-change: transform, opacity;
            pointer-events: none;
            z-index: -1;
        }

        .meteor::before {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 80px;
            height: 1px;
            background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
        }

        @keyframes meteorMove {
            0% {
                transform: rotate(215deg) translate3d(0, 0, 0);
                opacity: 0;
            }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% {
                transform: rotate(215deg) translate3d(-1200px, 0, 0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.prepend(starsContainer);

    // 2. สร้างดวงดาว (ลดจำนวนลงเล็กน้อยเพื่อความคลีน แต่เนียนขึ้น)
    const starCount = window.innerWidth < 768 ? 50 : 80;
    for (let i = 0; i < starCount; i++) {
        let star = document.createElement("div");
        star.className = "star-global";
        const size = (Math.random() * 1.5 + 0.5).toFixed(1);
        const opacity = (Math.random() * 0.6 + 0.2).toFixed(2);
        const duration = (4 + Math.random() * 6).toFixed(1);
        
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.setProperty('--op', opacity);
        star.style.setProperty('--d', duration + "s");
        star.style.animationDelay = (Math.random() * 10) + "s";
        starsContainer.appendChild(star);
    }

    // 3. ฟังก์ชันสร้างดาวตก (ใช้ CSS Animation แทนเพื่อความลื่น)
    function triggerMeteor() {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // สุ่มตำแหน่งเริ่มต้น
        const startX = Math.random() * window.innerWidth + (window.innerWidth * 0.2);
        const startY = Math.random() * (window.innerHeight * 0.4);
        
        meteor.style.left = startX + 'px';
        meteor.style.top = startY + 'px';
        
        // สุ่มความเร็ว (2s - 4s)
        const speed = (2 + Math.random() * 2).toFixed(2);
        meteor.style.animation = `meteorMove ${speed}s linear forwards`;

        starsContainer.appendChild(meteor);

        // ทำลายเมื่อจบแอนิเมชัน
        meteor.addEventListener('animationend', () => {
            meteor.remove();
        });

        // สุ่มเวลาเกิดดวงถัดไป
        setTimeout(triggerMeteor, Math.random() * 5000 + 3000);
    }

    // เริ่มทำงาน
    setTimeout(triggerMeteor, 1000);
})();
