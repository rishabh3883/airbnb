controllers/      → API business logic  
init/             → Initialization scripts  
models/           → Database schemas  
routes/           → API routing  
public/           → Static assets (CSS, JS)  
views/            → Frontend EJS templates  
utils/            → Utility helper functions  
app.js            → Main server entry point  
``` :contentReference[oaicite:3]{index=3}

---

## 🚀 **How It Works**

1. **Clients send requests** from React UI (or EJS UI)  
2. **Express server handles routes**  
3. **MongoDB stores users, properties, bookings**  
4. **Frontend renders UI dynamically using API results**  

---

1.## 📌 **Setup / Installation**

  Clone repo:  
  ```bash
  git clone https://github.com/rishabh3883/airbnb.git


2.Install dependencies:
  npm install

3.Create .env file and add your config (MongoDB URI, secret keys)

4.Start server:
  npm start
