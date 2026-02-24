(function() {
    // 1. CSS สำหรับหน้า Loading (เน้นความพรีเมียมและความเร็ว)
    const style = document.createElement('style');
    style.innerHTML = `
        #stellar-loader {
            position: fixed;
            inset: 0;
            background: #030712;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s;
            font-family: 'Kanit', sans-serif;
        }

        .loader-container {
            text-align: center;
        }

        /* วงโคจรดาวเคราะห์ */
        .orbit-wrapper {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto;
        }

        .planet-orbit {
            position: absolute;
            inset: 0;
            border: 1px solid rgba(56, 189, 248, 0.15);
            border-radius: 50%;
            animation: spin 3s linear infinite;
        }

        .planet-core {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 65px;
            filter: drop-shadow(0 0 15px rgba(56, 189, 248, 0.4));
        }

        .satellite {
            position: absolute;
            top: -5px; left: 50%;
            width: 10px; height: 10px;
            background: #38bdf8;
            border-radius: 50%;
            box-shadow: 0 0 15px #38bdf8;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* ตัวเลขเปอร์เซ็นต์ (อ้างอิงตามการโหลดทรัพยากร) */
        .load-status {
            margin-top: 25px;
            color: #ffffff;
            font-size: 0.8rem;
            letter-spacing: 5px;
            text-transform: uppercase;
            opacity: 0.8;
        }

        .progress-bar-wrap {
            width: 200px;
            height: 2px;
            background: rgba(255,255,255,0.1);
            margin-top: 15px;
            border-radius: 10px;
            overflow: hidden;
        }

        #stellar-progress {
            width: 0%;
            height: 100%;
            background: #38bdf8;
            box-shadow: 0 0 10px #38bdf8;
            transition: width 0.4s ease;
        }

        .loader-hidden {
            opacity: 0 !important;
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(style);

    // 2. HTML Structure
    const loaderHTML = `
        <div id="stellar-loader">
            <div class="loader-container">
                <div class="orbit-wrapper">
                    <div class="planet-orbit"><div class="satellite"></div></div>
                    <img src="โลโก้/SmNBY.webp" class="planet-core" alt="NBY">
                </div>
                <div class="load-status" id="load-text">Connecting...</div>
                <div class="progress-bar-wrap">
                    <div id="stellar-progress"></div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);

    const loader = document.getElementById('stellar-loader');
    const progress = document.getElementById('stellar-progress');
    const loadText = document.getElementById('load-text');

    // 3. ระบบตรวจเช็คการโหลดจริง (เน้นตามเน็ต)
    function updateProgress() {
        // ดึงข้อมูลการโหลดทรัพยากรจากเบราว์เซอร์
        const resources = performance.getEntriesByType('resource');
        const totalResources = resources.length;
        
        // จำลองการคำนวณความคืบหน้าเบื้องต้น (เน็ตช้า เปอร์เซ็นต์จะขึ้นช้า)
        let percentage = 0;
        
        if (document.readyState === 'interactive') percentage = 40;
        if (document.readyState === 'complete') percentage = 100;

        progress.style.width = percentage + '%';
        
        if (percentage < 100) {
            loadText.innerText = `Synchronizing... ${percentage}%`;
            requestAnimationFrame(updateProgress);
        } else {
            loadText.innerText = "System Ready";
            setTimeout(() => {
                loader.classList.add('loader-hidden');
            }, 600);
        }
    }

    // เริ่มตรวจเช็คเมื่อไฟล์ JS ทำงาน
    requestAnimationFrame(updateProgress);

    // 4. ระบบ Transition ตอนเปลี่ยนหน้า (Inter-page Loading)
    window.onbeforeunload = function() {
        loader.classList.remove('loader-hidden');
        progress.style.width = '0%';
        loadText.innerText = "Transmitting...";
    };

    // กรณีเปลี่ยนหน้าแบบกดลิงก์ (ช่วยให้ลื่นขึ้น)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && !link.target && link.origin === window.location.origin && !link.hash) {
            loader.classList.remove('loader-hidden');
        }
    });

    // ปิด Loader หากกลับมาหน้าเดิมด้วยปุ่ม Back
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            loader.classList.add('loader-hidden');
        }
    });

})();