(function() {
    // 1. เพิ่ม CSS สำหรับ Background, ดวงดาว และดาวตก
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --space-bg: #030712;
            --core-glow: #1e293b;
            --accent-glow: rgba(56, 189, 248, 0.15);
            --star-color: #ffffff;
            --meteor-color: rgba(255, 255, 255, 0.7);
        }

        body {
            margin: 0;
            min-height: 100vh;
            background: radial-gradient(circle at center, var(--core-glow) 0%, var(--space-bg) 100%) !important;
            background-attachment: fixed !important;
            position: relative;
            overflow: hidden;
        }

        body::before {
            content: "";
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, var(--accent-glow), transparent 70%);
            z-index: -2;
            pointer-events: none;
        }

        .stars-container {
            position: fixed;
            inset: 0;
            z-index: -1;
            pointer-events: none;
        }

        /* --- สไตล์ดวงดาวระยิบระยับ --- */
        .star-global {
            position: absolute;
            background: var(--star-color);
            border-radius: 50%;
            filter: blur(0.3px);
            will-change: opacity, transform;
            animation: shimmerGlobal var(--d) infinite ease-in-out;
        }

        @keyframes shimmerGlobal {
            0%, 100% { opacity: var(--op); transform: scale(1); }
            50% { opacity: 0.1; transform: scale(0.7); }
        }

        /* --- สไตล์ดาวตก (Meteor) --- */
        .meteor {
            position: absolute;
            top: 0;
            left: 50%;
            width: 2px;
            height: 2px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 0 4px rgba(255,255,255,0.1), 
                        0 0 0 8px rgba(255,255,255,0.1), 
                        0 0 20px rgba(255,255,255,1);
            animation: meteorAnim 3s linear infinite;
            opacity: 0;
            pointer-events: none;
            z-index: -1;
        }

        /* หางดาวตก */
        .meteor::before {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100px;
            height: 1px;
            background: linear-gradient(90deg, #fff, transparent);
        }

        @keyframes meteorAnim {
            0% {
                transform: rotate(215deg) translateX(0);
                opacity: 1;
            }
            70% {
                opacity: 1;
            }
            100% {
                transform: rotate(215deg) translateX(-1000px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. สร้าง Container
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.prepend(starsContainer);

    // 3. สร้างดวงดาวพื้นหลัง
    const starCount = window.innerWidth < 768 ? 40 : 60;
    for (let i = 0; i < starCount; i++) {
        let star = document.createElement("div");
        star.className = "star-global";
        const size = (Math.random() * 2 + 1).toFixed(1);
        const opacity = (Math.random() * 0.5 + 0.3).toFixed(2);
        const duration = (3 + Math.random() * 5).toFixed(1);
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.setProperty('--op', opacity);
        star.style.setProperty('--d', duration + "s");
        star.style.animationDelay = (Math.random() * 5) + "s";
        starsContainer.appendChild(star);
    }

    // 4. ฟังก์ชันสร้างดาวตกแบบสุ่มเวลา
    function createMeteor() {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // สุ่มตำแหน่งเริ่มต้น (ให้เริ่มจากขอบขวาหรือบน)
        meteor.style.left = Math.random() * window.innerWidth + 'px';
        meteor.style.top = Math.random() * (window.innerHeight / 2) + 'px';
        
        // สุ่มขนาดและความเร็ว
        const scale = Math.random() * 1.5;
        meteor.style.transform = `scale(${scale})`;
        
        starsContainer.appendChild(meteor);

        // ลบ element ทิ้งเมื่อแอนิเมชันจบเพื่อประหยัด RAM
        setTimeout(() => {
            meteor.remove();
        }, 3000);

        // สุ่มเวลาเพื่อสร้างดาวตกดวงต่อไป (ระหว่าง 4 - 10 วินาที)
        const nextMeteor = Math.random() * 6000 + 4000;
        setTimeout(createMeteor, nextMeteor);
    }

    // เริ่มทำงานดาวตกดวงแรก
    setTimeout(createMeteor, 2000);

})();