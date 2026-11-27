# Trang giới thiệu cá nhân cho Steam Profile

Bộ mã nguồn web tĩnh thuần (HTML/CSS/JS) gọn nhẹ, giao diện tối theo phong cách Steam, có thể đưa lên mạng miễn phí và gắn tên miền từ **L53.NET** (`*.ggff.net` hoặc `*.filegear-sg.me`).

## 1. Tùy chỉnh thông tin cá nhân
Mở file `index.html` và sửa các thông tin sau:
- **Tên & mô tả:** Sửa `Tên Của Bạn`, `Level 42 • Gamer`, và đoạn giới thiệu.
- **Avatar:** Thay đường dẫn `src="..."` trong thẻ `<img class="avatar" ...>` bằng link ảnh avatar Steam hoặc ảnh của bạn.
- **Link Steam & Discord:** Thay `https://steamcommunity.com/id/your-id`, `123456789` (Friend Code), và `your_discord_tag`.
- **Cấu hình PC & Game yêu thích:** Sửa trực tiếp trong các mục tương ứng.

## 2. Đưa web lên mạng miễn phí (GitHub Pages)
1. Tạo tài khoản GitHub (nếu chưa có) và tạo một repository mới (ví dụ `my-steam-profile`).
2. Upload 3 file `index.html`, `style.css`, `script.js` lên repository đó.
3. Vào **Settings → Pages**, chọn nhánh `main` và bấm **Save** để nhận link miễn phí dạng `https://<username>.github.io/my-steam-profile/`.

## 3. Gắn tên miền L53.NET vào trang web (tùy chọn)
1. Đăng ký tên miền tại `https://customer.l53.net/order`.
2. Tạo tài khoản quản lý DNS miễn phí (như `https://dns.he.net/`) và điền nameserver của họ vào phần **Manage → NameServers** trên L53.NET.
3. Trên trang DNS đó, tạo bản ghi `CNAME` trỏ tên miền của bạn về `<username>.github.io`, rồi nhập tên miền của bạn vào mục **Custom domain** trong phần **Settings → Pages** trên GitHub.
4. Dán link trang web hoàn chỉnh vào phần **Website URL** hoặc **Summary** trên Steam Profile của bạn.
