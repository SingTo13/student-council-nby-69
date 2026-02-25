// ฐานข้อมูล.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// การตั้งค่า Firebase จากโค้ดต้นฉบับของคุณ
const firebaseConfig = {
    apiKey: "AIzaSyCsBzUXKm_421QMAj2UG8IZYDiFLgc8vfw",
    authDomain: "student-council-nby-68.firebaseapp.com",
    projectId: "student-council-nby-68",
    storageBucket: "student-council-nby-68.firebasestorage.app",
    messagingSenderId: "198592356446",
    appId: "1:198592356446:web:c8de1a525606b10e8254cf"
};

// เริ่มต้นใช้งาน Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * DatabaseAPI: รวบรวมฟังก์ชันการทำงานกับฐานข้อมูล
 * เพื่อให้หน้าเว็บอื่นๆ เรียกใช้งานผ่านตัวแปรเดียว
 */
export const DatabaseAPI = {
    
    /**
     * สำหรับส่งปัญหาใหม่เข้าฐานข้อมูล
     * @param {string} detail - รายละเอียดของปัญหา
     */
    async submitComplaint(detail) {
        return await addDoc(collection(db, "complaints"), {
            detail: detail,
            status: "ยังไม่ได้แก้ไข", // สถานะเริ่มต้น
            adminReply: "",
            timestamp: serverTimestamp() // ใช้เวลาจาก Server
        });
    },

    /**
     * สำหรับดึงข้อมูลปัญหาแบบ Real-time
     * @param {function} callback - ฟังก์ชันที่จะทำงานเมื่อข้อมูลมีการเปลี่ยนแปลง
     */
    listenToComplaints(callback) {
        const q = query(
            collection(db, "complaints"), 
            orderBy("timestamp", "desc") // เรียงจากใหม่ไปเก่า
        );
        return onSnapshot(q, callback);
    }

    // ในอนาคตคุณสามารถเพิ่มฟังก์ชันอื่นๆ เช่น
    // listenToNews(callback) { ... }
    // หรือ submitVote(data) { ... } ที่นี่ได้เลย
};
