(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════════
       STELLAR LOADER  —  Universal Real-Progress Loading Screen
       วางไว้บรรทัดแรกสุดของ <body> ก่อน script อื่นทุกตัว
    ═══════════════════════════════════════════════════════ */

    // ─── CSS ────────────────────────────────────────────────
    var style = document.createElement('style');
    style.innerHTML = [
        '#stellar-loader{',
            'position:fixed;inset:0;',
            'background:#030712;',
            'display:flex;flex-direction:column;',
            'align-items:center;justify-content:center;',
            'z-index:2147483647;',           /* สูงสุดเท่าที่เป็นไปได้ */
            'font-family:"Kanit",sans-serif;',
            'transition:opacity .7s cubic-bezier(.4,0,.2,1),visibility .7s;',
        '}',
        '#stellar-loader.sl-done{opacity:0!important;visibility:hidden!important;pointer-events:none;}',

        /* วงโคจร */
        '.sl-orbit-wrap{position:relative;width:120px;height:120px;margin:0 auto 28px;}',
        '.sl-orbit{',
            'position:absolute;inset:0;',
            'border:1px solid rgba(56,189,248,.18);border-radius:50%;',
            'animation:sl-spin 2.8s linear infinite;',
        '}',
        '.sl-orbit-2{',
            'position:absolute;inset:14px;',
            'border:1px solid rgba(56,189,248,.08);border-radius:50%;',
            'animation:sl-spin 4.5s linear infinite reverse;',
        '}',
        '.sl-dot{',
            'position:absolute;top:-5px;left:50%;',
            'width:10px;height:10px;margin-left:-5px;',
            'background:#38bdf8;border-radius:50%;',
            'box-shadow:0 0 12px 2px #38bdf8;',
        '}',
        '.sl-dot2{',
            'position:absolute;bottom:-4px;left:50%;',
            'width:6px;height:6px;margin-left:-3px;',
            'background:#818cf8;border-radius:50%;',
            'box-shadow:0 0 8px 2px #818cf8;',
        '}',
        '.sl-logo{',
            'position:absolute;top:50%;left:50%;',
            'transform:translate(-50%,-50%);',
            'width:62px;',
            'filter:drop-shadow(0 0 14px rgba(56,189,248,.45));',
        '}',
        '@keyframes sl-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}',

        /* text */
        '.sl-label{',
            'font-size:.72rem;letter-spacing:5px;text-transform:uppercase;',
            'color:rgba(255,255,255,.55);margin-bottom:6px;',
        '}',
        '.sl-percent{',
            'font-size:2.6rem;font-weight:700;line-height:1;',
            'color:#fff;margin-bottom:16px;',
            'transition:color .3s;',
        '}',
        '.sl-percent.sl-done-num{color:#38bdf8;}',

        /* bar */
        '.sl-bar-wrap{',
            'width:220px;height:2px;',
            'background:rgba(255,255,255,.08);',
            'border-radius:10px;overflow:hidden;margin-bottom:14px;',
        '}',
        '#sl-bar{',
            'height:100%;width:0%;',
            'background:linear-gradient(90deg,#38bdf8,#818cf8);',
            'box-shadow:0 0 10px #38bdf8;',
            'border-radius:10px;',
            'transition:width .35s ease;',
        '}',

        /* status */
        '#sl-status{',
            'font-size:.75rem;letter-spacing:2px;text-transform:uppercase;',
            'color:rgba(255,255,255,.35);',
            'min-height:1.2em;transition:color .3s;',
        '}',
    ].join('');
    document.head.appendChild(style);

    // ─── HTML ────────────────────────────────────────────────
    document.body.insertAdjacentHTML('afterbegin', [
        '<div id="stellar-loader">',
            '<div class="sl-orbit-wrap">',
                '<div class="sl-orbit"><div class="sl-dot"></div></div>',
                '<div class="sl-orbit-2"><div class="sl-dot2"></div></div>',
                '<img src="โลโก้/SmNBY.webp" class="sl-logo" alt="NBY">',
            '</div>',
            '<div class="sl-label">กำลังโหลด</div>',
            '<div class="sl-percent" id="sl-pct">0%</div>',
            '<div class="sl-bar-wrap"><div id="sl-bar"></div></div>',
            '<div id="sl-status">Initializing...</div>',
        '</div>',
    ].join(''));

    // ─── References ─────────────────────────────────────────
    var loader   = document.getElementById('stellar-loader');
    var bar      = document.getElementById('sl-bar');
    var pctEl    = document.getElementById('sl-pct');
    var statusEl = document.getElementById('sl-status');

    // ─── State ───────────────────────────────────────────────
    var _pct      = 0;   // เปอร์เซ็นต์ที่แสดง (ค่อยๆขึ้น)
    var _target   = 0;   // เป้าหมายปัจจุบัน
    var _rafId    = null;
    var _closed   = false;

    var PHASES = {
        DOM_LOADED:   15,   // DOMContentLoaded
        RESOURCES:    75,   // ทรัพยากรทั้งหมดโหลดเสร็จ (ขึ้นกับจำนวน/ขนาด)
        IMAGES:       90,   // รูปภาพ visible ทั้งหมด complete
        FONTS:        95,   // fonts loaded
        DONE:        100
    };

    // ─── Smooth counter ──────────────────────────────────────
    function setTarget(t, label) {
        _target = Math.max(_target, Math.min(t, 100));
        if (label) statusEl.textContent = label;
        if (!_rafId) _rafId = requestAnimationFrame(tick);
    }

    function tick() {
        _rafId = null;
        if (_pct < _target) {
            /* ขึ้นช้าๆ เหลือน้อยยิ่งช้า (เน้นความจริง) */
            var step = Math.max(0.4, (_target - _pct) * 0.06);
            _pct = Math.min(_pct + step, _target);
            render(_pct);
            _rafId = requestAnimationFrame(tick);
        } else {
            render(_target);
            if (_target >= 100 && !_closed) finalize();
        }
    }

    function render(v) {
        var n = Math.round(v);
        bar.style.width   = n + '%';
        pctEl.textContent = n + '%';
    }

    // ─── Finalize ────────────────────────────────────────────
    function finalize() {
        _closed = true;
        statusEl.textContent  = 'System Ready';
        statusEl.style.color  = '#38bdf8';
        pctEl.classList.add('sl-done-num');
        setTimeout(function () {
            loader.classList.add('sl-done');
        }, 500);
    }

    /* ═══════════════════════════════════════════════════════
       PHASE 1 — DOM parsed
    ═══════════════════════════════════════════════════════ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTarget(PHASES.DOM_LOADED, 'DOM Ready...');
            trackResources();
        });
    } else {
        setTarget(PHASES.DOM_LOADED, 'DOM Ready...');
        trackResources();
    }

    /* ═══════════════════════════════════════════════════════
       PHASE 2 — Resource tracking (XHR/fetch/img intercept)
       นับทรัพยากรจริงจาก PerformanceObserver + ResourceTiming
    ═══════════════════════════════════════════════════════ */
    function trackResources() {
        /* นับ pending resources จาก <link>, <script>, <img>, <video>, <source> */
        var pending   = 0;
        var completed = 0;

        function countElements() {
            var selectors = [
                'img[src]',
                'script[src]',
                'link[rel="stylesheet"]',
                'link[rel="preload"]',
                'video[src]', 'video source[src]',
                'audio[src]', 'audio source[src]',
            ];
            return document.querySelectorAll(selectors.join(','));
        }

        function calcResourcePct() {
            /* ดึงจาก PerformanceTiming API */
            var entries = performance.getEntriesByType('resource');
            if (entries.length === 0) return PHASES.DOM_LOADED;

            /* คำนวณ bytes ที่โหลดแล้ว vs total ถ้ามี transferSize */
            var totalBytes = 0, loadedBytes = 0;
            var hasSize = false;
            entries.forEach(function (e) {
                if (e.encodedBodySize > 0) {
                    hasSize = true;
                    totalBytes   += e.encodedBodySize;
                    loadedBytes  += e.encodedBodySize;   /* complete entries เท่านั้นที่อยู่ใน getEntries */
                }
            });

            /* ถ้าไม่มี size data ใช้จำนวนแทน */
            var elems = countElements();
            var total = Math.max(entries.length, elems.length, 1);
            var done  = entries.length;
            var ratio = Math.min(done / total, 1);

            /* map ratio → 15–75% */
            return PHASES.DOM_LOADED + ratio * (PHASES.RESOURCES - PHASES.DOM_LOADED);
        }

        /* Observer ที่ติดตาม resource แต่ละชิ้น */
        var observer = null;
        if (window.PerformanceObserver) {
            try {
                observer = new PerformanceObserver(function (list) {
                    /* ทุกครั้งที่ resource โหลดเสร็จ อัปเดต progress */
                    var p = calcResourcePct();
                    setTarget(p, 'Loading Resources...');
                });
                observer.observe({ type: 'resource', buffered: true });
            } catch (e) { /* ไม่รองรับ — ใช้ fallback */ }
        }

        /* window.load = ทุก resource เสร็จหมดแล้ว */
        window.addEventListener('load', function () {
            if (observer) observer.disconnect();
            setTarget(PHASES.RESOURCES, 'Resources Loaded...');
            checkImages();
        });

        /* fallback กรณีที่ load ไม่ fired (page cached) */
        if (document.readyState === 'complete') {
            if (observer) observer.disconnect();
            setTarget(PHASES.RESOURCES, 'Resources Loaded...');
            checkImages();
        }
    }

    /* ═══════════════════════════════════════════════════════
       PHASE 3 — ตรวจสอบรูปภาพที่ visible ทั้งหมด complete จริง
    ═══════════════════════════════════════════════════════ */
    function checkImages() {
        var imgs = Array.prototype.slice.call(document.images);
        if (imgs.length === 0) { checkFonts(); return; }

        var total     = imgs.length;
        var done      = 0;

        function onOne() {
            done++;
            var p = PHASES.RESOURCES + (done / total) * (PHASES.IMAGES - PHASES.RESOURCES);
            setTarget(p, 'Loading Images... (' + done + '/' + total + ')');
            if (done >= total) checkFonts();
        }

        imgs.forEach(function (img) {
            if (img.complete && img.naturalWidth > 0) {
                onOne();
            } else {
                img.addEventListener('load',  onOne);
                img.addEventListener('error', onOne);  /* error ก็นับว่า "เสร็จ" */
            }
        });
    }

    /* ═══════════════════════════════════════════════════════
       PHASE 4 — Fonts
    ═══════════════════════════════════════════════════════ */
    function checkFonts() {
        setTarget(PHASES.IMAGES, 'Loading Fonts...');
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () {
                setTarget(PHASES.FONTS, 'Fonts Ready...');
                done();
            }).catch(function () { done(); });
        } else {
            done();
        }
    }

    /* ═══════════════════════════════════════════════════════
       PHASE 5 — Done
    ═══════════════════════════════════════════════════════ */
    function done() {
        setTarget(PHASES.DONE, 'System Ready');
    }

    /* ═══════════════════════════════════════════════════════
       SAFETY NET — บังคับปิดหลัง 15 วินาที (กรณีเน็ตช้ามาก)
    ═══════════════════════════════════════════════════════ */
    setTimeout(function () {
        if (!_closed) {
            setTarget(100, 'System Ready');
        }
    }, 15000);

    /* ═══════════════════════════════════════════════════════
       INTER-PAGE TRANSITION — แสดง loader ตอนเปลี่ยนหน้า
    ═══════════════════════════════════════════════════════ */
    function showLoader(msg) {
        loader.classList.remove('sl-done');
        _pct = 0; _target = 0; _closed = false;
        render(0);
        bar.style.transition = 'none';
        setTimeout(function(){ bar.style.transition = 'width .35s ease'; }, 50);
        statusEl.textContent = msg || 'Transmitting...';
        statusEl.style.color = '';
        pctEl.classList.remove('sl-done-num');
    }

    window.addEventListener('beforeunload', function () { showLoader('Transmitting...'); });

    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (link && link.href
            && !link.target
            && link.origin === window.location.origin
            && !link.hash
            && link.href !== window.location.href) {
            showLoader('Navigating...');
        }
    });

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) loader.classList.add('sl-done');
    });

})();
