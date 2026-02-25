// All/ฐานข้อมูล.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    serverTimestamp,
    limit
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// การตั้งค่า Firebase ของคุณ
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
 * DatabaseAPI: ศูนย์กลางการจัดการข้อมูลทุกหน้าเว็บ
 * จัดการให้ง่ายขึ้นโดยรวม Logic ไว้ที่เดียว
 */
export const DatabaseAPI = {
    
    // ==========================================
    // ส่วนที่ 1: สำหรับหน้า "แจ้งปัญหา" (Complaints)
    // ==========================================
    
    /**
     * ส่งปัญหาใหม่
     * @param {string} detail - รายละเอียด
     * @param {string} refLink - ลิงก์อ้างอิง (เพิ่มเข้ามาใหม่)
     */
    async submitComplaint(detail, refLink = "") {
        return await addDoc(collection(db, "complaints"), {
            detail: detail,
            refLink: refLink,         // เก็บลิงก์อ้างอิง
            status: "ยังไม่ได้แก้ไข",
            adminReply: "",
            timestamp: serverTimestamp()
        });
    },

    /**
     * ติดตามรายการแจ้งปัญหาแบบ Real-time
     */
    listenToComplaints(callback) {
        const q = query(
            collection(db, "complaints"), 
            orderBy("timestamp", "desc")
        );
        return onSnapshot(q, callback);
    },


    // ==========================================
    // ส่วนที่ 2: สำหรับหน้าอื่นๆ ในอนาคต (ตัวอย่างการขยาย)
    // ==========================================

    /**
     * ตัวอย่าง: สำหรับดึงข้อมูลข่าวสาร (ถ้าอนาคตมีหน้าข่าว)
     */
    listenToNews(callback) {
        const q = query(
            collection(db, "news"), 
            orderBy("timestamp", "desc"),
            limit(10)
        );
        return onSnapshot(q, callback);
    },

    /**
     * ตัวอย่าง: สำหรับส่งคะแนนโหวต
     */
    async submitVote(topicId, choice) {
        return await addDoc(collection(db, "votes"), {
            topicId: topicId,
            choice: choice,
            timestamp: serverTimestamp()
        });
    }
};
