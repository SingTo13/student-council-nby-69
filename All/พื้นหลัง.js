(function() {
    // 1. เพิ่ม CSS ที่เน้นความลื่น (Hardware Acceleration)
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --space-bg: #030712;
            --core-glow: #1e293b;
            --accent-glow: rgba(56, 189, 248, 0.12);
        }

        /* ปรับปรุง Body ให้รองรับการ Scroll */
        body {
            margin: 0;
            background-color: var(--space-bg) !important;
            /* ลบ background-gradient จาก body ไปใส่ใน Fixed Layer แทนเพื่อความลื่น */
        }

        /* Fixed Background Layer: ชั้นที่คุมสีและแสงฟุ้ง */
        .space-fixed-bg {
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at center, var(--core-glow) 0%, var(--space-bg) 100%);
            z-index: -3;
            pointer-events: none;
        }

        /* Accent Glow Layer */
        .space-fixed-bg::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, var(--accent-glow), transparent 80%);
        }

        /* Stars Container: อยู่กับที่ ไม่เลื่อนตาม Scroll */
        .stars-container {
            position: fixed;
            inset: 0;
            z-index: -2;
            pointer-events: none;
            overflow: hidden;
            will-change: transform;
        }

        /* ดวงดาว: ใช้ translate3d เพื่อเรียกใช้ GPU */
        .star-global {
            position: absolute;
            background: #fff;
            border-radius: 50%;
            will-change: opacity, transform;
            animation: shimmerGlobal var(--d) infinite ease-in-out;
        }

        @keyframes shimmerGlobal {
            0%, 100% { opacity: var(--op); transform: translate3d(0,0,0) scale(1); }
            50% { opacity: 0.1; transform: translate3d(0,0,0) scale(0.5); }
        }

        /* ดาวตก: ปรับแต่งหางและเงาให้เนียนตาขึ้น */
        .meteor {
            position: absolute;
            width: 1px;
            height: 1px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 10px 1px #fff;
            will-change: transform, opacity;
            pointer-events: none;
        }

        .meteor::before {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 120px;
            height: 1px;
            background: linear-gradient(90deg, rgba(255,255,255,0.9), transparent);
        }

        @keyframes meteorMove {
            0% {
                transform: rotate(215deg) translate3d(0, 0, 0);
                opacity: 0;
            }
            5% { opacity: 1; }
            40% { opacity: 1; }
            100% {
                transform: rotate(215deg) translate3d(-100vw, 0, 0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // สร้าง Layer พื้นหลังสีและแสง
    const bgLayer = document.createElement('div');
    bgLayer.className = 'space-fixed-bg';
    document.body.prepend(bgLayer);

    // สร้าง Layer ดวงดาว
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.prepend(starsContainer);

    // 2. สร้างดวงดาวแบบประหยัด RAM
    const starCount = window.innerWidth < 768 ? 40 : 100;
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < starCount; i++) {
        let star = document.createElement("div");
        star.className = "star-global";
        const size = (Math.random() * 1.8 + 0.4).toFixed(1);
        const opacity = (Math.random() * 0.7 + 0.3).toFixed(2);
        const duration = (3 + Math.random() * 4).toFixed(1);
        
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.top = (Math.random() * 100) + "%";
        star.style.left = (Math.random() * 100) + "%";
        star.style.setProperty('--op', opacity);
        star.style.setProperty('--d', duration + "s");
        star.style.animationDelay = (Math.random() * 8) + "s";
        fragment.appendChild(star);
    }
    starsContainer.appendChild(fragment);

    // 3. ฟังก์ชันสร้างดาวตก (Optimized Loop)
    function spawnMeteor() {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // สุ่มจุดเริ่มต้นให้กว้างขึ้นครอบคลุมทุกจอ
        const startX = Math.random() * (window.innerWidth + 400); 
        const startY = Math.random() * (window.innerHeight * 0.5);
        
        meteor.style.left = startX + 'px';
        meteor.style.top = startY + 'px';
        
        // ความเร็วที่ดูเป็นธรรมชาติ (1.5s - 2.5s)
        const duration = (1.5 + Math.random() * 1).toFixed(2);
        meteor.style.animation = `meteorMove ${duration}s cubic-bezier(0.1, 0.5, 0.5, 1) forwards`;

        starsContainer.appendChild(meteor);

        // ใช้ Event Listener ลบ Element เมื่อทำหน้าที่เสร็จ
        meteor.addEventListener('animationend', () => {
            meteor.remove();
        });

        // สุ่มเวลาเกิดใหม่ (3-7 วินาที)
        setTimeout(spawnMeteor, Math.random() * 4000 + 3000);
    }

    // เริ่มทำงานหลังจากหน้าโหลด
    if (document.readyState === 'complete') {
        spawnMeteor();
    } else {
        window.addEventListener('load', spawnMeteor);
    }
})();
