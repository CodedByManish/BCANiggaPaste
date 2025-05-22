# JustPaste.it Clone

A lightweight clone of JustPaste.it built using HTML, Tailwind CSS, JavaScript, and PHP. It allows users to:

- Paste and share text with formatting
- Upload files (max 100MB)
- Shorten URLs with expiry settings

---

## 📁 Folder Structure
```
/justpasteit-clone
├── index.html
├── style.css
├── script.js
├── save_paste.php
├── upload.php
├── /pastes       # Stores .json paste data
└── /uploads      # Stores uploaded files
```

## ⚙️ Requirements
- Free PHP hosting ( InfinityFree )
- PHP 7.0+

## 🧩 Features
- **Text Editor** with Bold/Italic/Underline
- **File Uploads** (Max 100MB)
- **URL Shortening** with dummy redirection URL
- **Expiry Options:** Never, 1 Hour, 1 Day, 1 Week

## 🚀 Setup Instructions
1. **Upload all files** to your hosting root directory.
2. Make sure `/pastes/` , `/uploads/` and `shorten_url.php`  directories are writable:
   - Set permissions to `0777` if needed.
3. Update `save_paste.php` and `upload.php` and `shorten_url.php` to use your actual domain:
```php
$baseUrl = 'https://niggapaste.kesug.com';
```
4. Open `index.html` in browser and test the app.

## 🔒 Security Notes
- All inputs are sanitized to prevent XSS
- Unique paste IDs are generated using `random_bytes()`

## 📎 Example Links
- Paste: `https://niggapaste.kesug.com/textid`
- File: `https://niggapaste.kesug.com/filename`
- Shortened URL: `https://niggapaste.kesug.com/shortlink`

---

## License & Usage
This project is **public for viewing only**. You may not rehost, redistribute, or use this code commercially without permission.

Only authorized contributors may modify the codebase.

For educational/personal exploration only.


---

