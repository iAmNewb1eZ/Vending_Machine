const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser'); // เพิ่ม body-parser
const app = express();
const port = 3000;

// Middleware สำหรับแสดงไฟล์ static เช่น HTML, CSS, JS
app.use(express.static('fontend'));

// Middleware สำหรับรับ JSON
app.use(bodyParser.json());

// สร้างการเชื่อมต่อกับ MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root_password',
    database: process.env.DB_NAME || 'vending_machine'
});

// เชื่อมต่อกับฐานข้อมูล
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Route แสดงหน้าเว็บ vending machine
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/fontend/index.html');
});

// Route สำหรับดึงข้อมูลสินค้า
app.get('/products', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Database error');
        } else {
            res.json(results);
        }
    });
});

// Route สำหรับการซื้อสินค้า
app.post('/purchase', (req, res) => {
    const { productName, price } = req.body;

    // สร้างตั๋ว
    const ticket = `คุณได้ซื้อ ${productName} ราคา ${price} บาท`;
    
    // ส่งกลับข้อมูลตั๋ว
    res.json({ ticket });
});

// Server เริ่มฟังที่ port 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
