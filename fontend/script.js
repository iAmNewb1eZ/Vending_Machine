let currentBalance = 0; // ตัวแปรเพื่อเก็บยอดเงินปัจจุบัน
const productStock = {
    "ข้าวแกงกระหรี่": Math.floor(Math.random() * 10) + 1,
    "ข้าวแกงกระหรี่หมูทอดทงคัตสึ": Math.floor(Math.random() * 10) + 1,
    "ข้าวแกงกระหรี่ออมเล็ต": Math.floor(Math.random() * 10) + 1,
    "ข้าวแกงกระหรี่กุ้งเทมปุระ": Math.floor(Math.random() * 10) + 1,
    "กุ้งเทมปุระ": Math.floor(Math.random() * 10) + 1,
    "หมูทอดทงคัตสึ": Math.floor(Math.random() * 10) + 1,
};

let totalEarnings = 0; // ตัวแปรเพื่อเก็บยอดเงินทั้งหมดในตู้
let machineReady = true; // สถานะเครื่องเริ่มต้น

// ฟังก์ชันสำหรับการเติมเงิน
function addMoney(amount) {
    if (amount > 0) {
        currentBalance += amount; 
        document.getElementById('current-balance').innerText = currentBalance; 
        showMessage('เติมเงินสำเร็จ: ' + amount + ' บาท');
    } else {
        showMessage('กรุณาระบุจำนวนเงินที่ถูกต้อง');
    }
}

// ฟังก์ชันสำหรับการคืนเงิน
function refund() {
    if (currentBalance > 0) {
        const refundAmount = currentBalance; // จำนวนเงินที่จะคืน
        currentBalance = 0; // รีเซ็ตยอดเงิน
        document.getElementById('current-balance').innerText = currentBalance; // อัปเดตยอดเงิน
        showMessage('ขอคืนเงินสำเร็จ: ' + refundAmount + ' บาท');
    } else {
        showMessage('ไม่มีเงินที่จะคืน');
    }
}

// ฟังก์ชันสำหรับการซื้อสินค้า
function purchase(productName, price) {
    if (!machineReady) {
        showMessage('เครื่องไม่พร้อมทำงาน! ไม่สามารถซื้อสินค้าได้');
        return; // ป้องกันไม่ให้ซื้อสินค้า
    }

    if (currentBalance < price) {
        showMessage('ยอดเงินไม่เพียงพอสำหรับซื้อสินค้า: ' + productName);
        return;
    }

    if (productStock[productName] <= 0) { 
        showMessage('ของหมด: ' + productName);
        return;
    }

    fetch('/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName, price }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const change = currentBalance - price; 
        totalEarnings += price; // เติมเงินเข้าไปยังตู้
        document.getElementById('ticket').innerText = data.ticket; 

        // แสดงข้อความก่อนที่จะรีเซ็ตยอดเงิน
        showMessage('ซื้อสินค้าสำเร็จ!\nคุณได้รับตั๋ว "' + productName + '"\nเงินทอน: ' + change + ' บาท');

        // ดีเลย์ก่อนที่จะรีเซ็ตยอดเงิน
        setTimeout(() => {
            currentBalance = 0; 
            document.getElementById('current-balance').innerText = currentBalance; 
            productStock[productName]--; 
            updateStockDisplay(); // อัปเดตการแสดงจำนวนสินค้าหลังการซื้อ
        }, 2000); // 2000 มิลลิวินาที (2 วินาที)
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('เกิดข้อผิดพลาดในการซื้อสินค้า: ' + error.message);
    });
}

// ฟังก์ชันสำหรับอัปเดตการแสดงจำนวนสินค้า
function updateStockDisplay() {
    const productElements = document.querySelectorAll('.product');
    productElements.forEach(product => {
        const productName = product.querySelector('p').innerText; // ดึงชื่อผลิตภัณฑ์
        const stockElement = product.querySelector('.stock'); // ดึง element สำหรับแสดงจำนวนสินค้า
        stockElement.innerText = 'จำนวนสินค้า: ' + productStock[productName]; // แสดงจำนวนสินค้า
    });
}

// ฟังก์ชันแสดงกล่องข้อความ
function showMessage(message) {
    document.getElementById('message-text').innerText = message;
    document.getElementById('message').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// ฟังก์ชันปิดกล่องข้อความ
function closeMessage() {
    document.getElementById('message').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// ฟังก์ชันสำหรับการตั้งค่าสถานะเครื่อง
function setMachineReady(ready) {
    machineReady = ready;
    document.getElementById('ready-button').disabled = ready;
    document.getElementById('not-ready-button').disabled = !ready;

    // แสดงข้อความเมื่อเปลี่ยนสถานะเครื่อง
    if (ready) {
        showMessage("เครื่องพร้อมทำงาน!");
    } else {
        showMessage("เครื่องไม่พร้อมทำงาน!");
    }
}

// เพิ่มการทำงานให้กับปุ่มสถานะ
document.getElementById('ready-button').addEventListener('click', function() {
    setMachineReady(true); // เปลี่ยนสถานะเครื่องเป็นพร้อม
});

document.getElementById('not-ready-button').addEventListener('click', function() {
    setMachineReady(false); // เปลี่ยนสถานะเครื่องเป็นไม่พร้อม
});

// เพิ่ม Event Listener ให้กับปุ่มสินค้า
document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', () => {
        const productName = product.querySelector('p').innerText; // ดึงชื่อผลิตภัณฑ์
        const price = parseInt(product.querySelectorAll('p')[1].innerText.replace('ราคา ', '').replace(' บาท', '')); // ดึงราคา
        purchase(productName, price); // เรียกใช้ฟังก์ชัน purchase
    });
});

// การติดตั้งเหตุการณ์ให้กับปุ่มคืนเงิน
document.getElementById('refund-button').addEventListener('click', refund);

// อัปเดตการแสดงจำนวนสินค้าตอนเริ่มต้น
updateStockDisplay();
