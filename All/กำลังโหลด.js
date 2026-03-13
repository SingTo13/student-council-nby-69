(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════════════════
       STELLAR LOADER  —  ใช้ Pace.js เป็นตัวติดตาม % เท่านั้น
       วิธีใช้: วาง <script src="All/กำลังโหลด.js"></script>
                เป็นบรรทัดแรกสุดใน <body>
       Pace.js จะถูกโหลดอัตโนมัติจาก CDN
    ═══════════════════════════════════════════════════════════════ */

    /* ─── โหลด Pace.js จาก CDN ก่อนทุกอย่าง ──────────────────── */
    var paceScript = document.createElement('script');
    paceScript.src = 'https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js';
    paceScript.async = false;
    document.head.insertBefore(paceScript, document.head.firstChild);

    /* ซ่อน UI ของ Pace.js เอง (เราใช้แค่ข้อมูล % เท่านั้น) */
    var hideStyle = document.createElement('style');
    hideStyle.innerHTML = '.pace,.pace-progress,.pace-activity{display:none!important;opacity:0!important;}';
    document.head.appendChild(hideStyle);

    /* ─── CSS ──────────────────────────────────────────────────── */
    var css = document.createElement('style');
    css.innerHTML = [
        '#sl{position:fixed;inset:0;background:#030712;',
            'display:flex;flex-direction:column;',
            'align-items:center;justify-content:center;',
            'z-index:2147483647;font-family:"Kanit",sans-serif;}',

        '#sl.sl-out{',
            'opacity:0;visibility:hidden;pointer-events:none;',
            'transition:opacity .4s ease,visibility .4s;',
        '}',

        /* orbit */
        '.sl-ow{position:relative;width:110px;height:110px;margin:0 auto 28px;}',
        '.sl-o1{position:absolute;inset:0;',
            'border:1px solid rgba(56,189,248,.2);border-radius:50%;',
            'animation:sl-sp 2.6s linear infinite;}',
        '.sl-o2{position:absolute;inset:14px;',
            'border:1px solid rgba(129,140,248,.12);border-radius:50%;',
            'animation:sl-sp 4s linear infinite reverse;}',
        '.sl-d1{position:absolute;top:-5px;left:50%;',
            'width:10px;height:10px;margin-left:-5px;',
            'background:#38bdf8;border-radius:50%;',
            'box-shadow:0 0 10px 2px #38bdf8;}',
        '.sl-d2{position:absolute;bottom:-4px;left:50%;',
            'width:6px;height:6px;margin-left:-3px;',
            'background:#818cf8;border-radius:50%;',
            'box-shadow:0 0 8px 2px #818cf8;}',
        '.sl-logo{position:absolute;top:50%;left:50%;',
            'transform:translate(-50%,-50%);width:60px;',
            'filter:drop-shadow(0 0 12px rgba(56,189,248,.5));}',
        '@keyframes sl-sp{to{transform:rotate(360deg)}}',

        /* text */
        '.sl-lbl{font-size:.68rem;letter-spacing:5px;text-transform:uppercase;',
            'color:rgba(255,255,255,.4);margin-bottom:5px;}',
        '#sl-pct{font-size:2.5rem;font-weight:700;color:#fff;',
            'line-height:1;margin-bottom:16px;}',
        '#sl-pct.done{color:#38bdf8;}',

        /* bar */
        '.sl-bw{width:200px;height:2px;',
            'background:rgba(255,255,255,.08);',
            'border-radius:4px;overflow:hidden;margin-bottom:12px;}',
        '#sl-bar{height:100%;width:0%;',
            'background:linear-gradient(90deg,#38bdf8,#818cf8);',
            'border-radius:4px;',
            'transition:width .15s linear;}',

        /* status */
        '#sl-st{font-size:.7rem;letter-spacing:1.5px;',
            'color:rgba(255,255,255,.28);min-height:1.1em;}',
    ].join('');
    document.head.appendChild(css);

    /* ─── HTML ─────────────────────────────────────────────────── */
    document.body.insertAdjacentHTML('afterbegin', [
        '<div id="sl">',
            '<div class="sl-ow">',
                '<div class="sl-o1"><div class="sl-d1"></div></div>',
                '<div class="sl-o2"><div class="sl-d2"></div></div>',
                '<img src="โลโก้/SmNBY.webp" class="sl-logo" alt="">',
            '</div>',
            '<div class="sl-lbl">กำลังโหลด</div>',
            '<div id="sl-pct">0%</div>',
            '<div class="sl-bw"><div id="sl-bar"></div></div>',
            '<div id="sl-st">Initializing...</div>',
        '</div>',
    ].join(''));

    var el    = document.getElementById('sl');
    var bar   = document.getElementById('sl-bar');
    var pctEl = document.getElementById('sl-pct');
    var stEl  = document.getElementById('sl-st');

    /* ─── State ────────────────────────────────────────────────── */
    var _closed = false;
    var _curPct = 0;

    /* ─── อัปเดต UI ─────────────────────────────────────────────── */
    function setPct(v) {
        /* ห้ามถอยหลัง */
        _curPct = Math.min(Math.max(v, _curPct), 100);
        var n = Math.round(_curPct);
        bar.style.width   = n + '%';
        pctEl.textContent = n + '%';
    }

    function setSt(msg) { stEl.textContent = msg; }

    /* ─── ปิด Loader ─────────────────────────────────────────────── */
    function closeLoader() {
        if (_closed) return;
        _closed = true;
        setPct(100);
        pctEl.classList.add('done');
        setSt('System Ready');
        stEl.style.color = '#38bdf8';
        setTimeout(function () { el.classList.add('sl-out'); }, 350);
    }

    /* ─── เชื่อม Pace.js Events ──────────────────────────────────
       Pace.js events:
         pace:start    → เริ่มโหลด
         pace:progress → ส่ง % (0-100) ← ใช้ค่านี้อย่างเดียว
         pace:hide     → โหลดเสร็จแล้ว
    ─────────────────────────────────────────────────────────── */
    function bindPace() {
        if (typeof window.Pace === 'undefined') {
            setTimeout(bindPace, 50);
            return;
        }

        setSt('Loading resources...');

        /* รับ % จาก Pace โดยตรง — ไม่มีการแต่งค่าเพิ่มเติม */
        window.Pace.on('progress', function (pct) {
            setPct(pct);
            if      (pct < 30) setSt('Loading resources...');
            else if (pct < 60) setSt('Fetching assets...');
            else if (pct < 85) setSt('Almost there...');
            else               setSt('Finishing up...');
        });

        /* Pace เสร็จ → ปิด loader */
        window.Pace.on('hide', function () {
            closeLoader();
        });

        /* Safety: ถ้า Pace ไม่ยิง hide ให้ฟัง window load แทน */
        window.addEventListener('load', function () {
            setTimeout(function () {
                if (!_closed) closeLoader();
            }, 800);
        });
    }

    /* รอ Pace.js โหลดเสร็จก่อน */
    paceScript.addEventListener('load', bindPace);

    /* Fallback: ถ้าโหลด Pace ไม่ได้ (ออฟไลน์/บล็อก CDN) */
    paceScript.addEventListener('error', function () {
        setSt('Loading...');
        window.addEventListener('load', function () {
            setPct(100);
            setTimeout(closeLoader, 200);
        });
    });

    /* Safety net 20s */
    setTimeout(function () {
        if (!_closed) closeLoader();
    }, 20000);

    /* ═══════════════════════════════════════════════════════════
       PUBLIC API — window.StellarLoader
    ═══════════════════════════════════════════════════════════ */
    window.StellarLoader = {
        forceClose: function () { closeLoader(); }
    };

    /* ═══════════════════════════════════════════════════════════
       INTER-PAGE TRANSITION
    ═══════════════════════════════════════════════════════════ */
    function resetLoader(msg) {
        if (!el) return;
        el.classList.remove('sl-out');
        _closed = false;
        _curPct = 0;
        setPct(0);
        bar.style.transition = 'none';
        requestAnimationFrame(function () {
            bar.style.transition = 'width .15s linear';
        });
        pctEl.classList.remove('done');
        stEl.style.color = '';
        setSt(msg || 'Navigating...');
    }

    window.addEventListener('beforeunload', function () {
        resetLoader('Transmitting...');
    });

    document.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (a && a.href && !a.target
            && a.origin === location.origin
            && !a.hash
            && a.href !== location.href) {
            resetLoader('Navigating...');
        }
    });

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) el.classList.add('sl-out');
    });

})();