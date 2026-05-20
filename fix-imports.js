const fs = require('fs');

function fixFile(file) {
    let c = fs.readFileSync(file, 'utf8');
    
    // For move-out.html and maintenance.html
    const search1 = 'import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";\\n        import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";';
    const replace1 = 'import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";';
    
    // For room-apply.html
    const search2 = 'import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";\\n        import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";';
    const replace2 = 'import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, addDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";';
    
    if (c.includes(search1)) {
        c = c.replace(search1, replace1);
    } else if (c.includes(search2)) {
        c = c.replace(search2, replace2);
    }
    
    fs.writeFileSync(file, c);
    console.log("Fixed " + file);
}

fixFile('move-out.html');
fixFile('room-apply.html');
