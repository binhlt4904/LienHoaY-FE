# ⚠️ QUAN TRỌNG: PHẢI RESTART SERVER!

## Vấn Đề

Create React App (CRA) **KHÔNG TỰ ĐỘNG** load lại environment variables khi thay đổi file `.env`!

## ✅ Giải Pháp

### Bước 1: Dừng Server
```bash
# Nhấn Ctrl+C trong terminal đang chạy npm start
```

### Bước 2: Restart Server
```bash
npm start
```

### Bước 3: Kiểm Tra
Mở browser console và kiểm tra:
```javascript
console.log(process.env.REACT_APP_GEMINI_API_KEY);
```

Phải thấy: `AIzaSyB1Tc6FBj8hnLnpgn4xYZBlOmtyLMpgwnQ`

---

## 🔍 Debug

Nếu vẫn thấy `undefined`:

1. **Kiểm tra file .env**
   ```bash
   cat .env
   # Hoặc trên Windows:
   type .env
   ```

2. **Đảm bảo tên biến đúng**
   - Phải là: `REACT_APP_GEMINI_API_KEY`
   - KHÔNG phải: `VITE_GEMINI_API_KEY`

3. **Không có khoảng trắng**
   ```bash
   # SAI:
   REACT_APP_GEMINI_API_KEY = AIzaSy...
   
   # ĐÚNG:
   REACT_APP_GEMINI_API_KEY=AIzaSy...
   ```

4. **File .env ở đúng vị trí**
   ```
   ProjectStore-FE/
   ├── .env          ← Phải ở đây
   ├── package.json
   └── src/
   ```

---

## 🎯 Quick Fix

```bash
# 1. Stop server (Ctrl+C)

# 2. Clear cache (optional)
rm -rf node_modules/.cache

# 3. Restart
npm start

# 4. Test
# Vào http://localhost:3000/fitcheck
# Upload ảnh
```

---

**LƯU Ý:** Mỗi lần thay đổi `.env`, BẮT BUỘC phải restart server!
