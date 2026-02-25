// All/ฐานข้อมูล.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsBzUXKm_421QMAj2UG8IZYDiFLgc8vfw",
    authDomain: "student-council-nby-68.firebaseapp.com",
    projectId: "student-council-nby-68",
    storageBucket: "student-council-nby-68.firebasestorage.app",
    messagingSenderId: "198592356446",
    appId: "1:198592356446:web:c8de1a525606b10e8254cf"
};

// เริ่มต้นใช้งาน
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// หากอนาคตมีฐานข้อมูลอื่น (เช่น Supabase หรือ SQL API) 
// คุณสามารถส่งออก (export) ตัวแปรเชื่อมต่อเพิ่มจากไฟล์นี้ได้เลย
