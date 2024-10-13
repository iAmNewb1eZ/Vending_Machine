# ใช้ Node.js base image
FROM node:14

# สร้าง directory สำหรับแอปพลิเคชัน
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json ไปยังโฟลเดอร์แอป
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์แอปทั้งหมดไปยัง container
COPY . .

# เปิด port 3000
EXPOSE 3000

# รันแอป
CMD [ "npm", "start" ]