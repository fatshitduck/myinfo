# Erist — Personal Steam & Gear (`erist.ggff.net`)

Trang giới thiệu cá nhân tối giản gắn trên Steam Profile của **Erist**, sử dụng nền **Yellow Liquid** gợn sóng nước êm dịu theo con trỏ chuột bằng WebGL, tiêu đề **Erist** biến hóa mỗi 3 giây, thẻ hồ sơ **Discord** trực tiếp (`737671991288397915`), biểu tượng chỏm tóc nghiêng của **Ijichi Nijika**, **CS2 Live Stats**, **Favourite Games**, ảnh tách nền thực tế của **Gear**, **Monitor**, **PC Specs** và mục **Buy me some caffeine** với mã QR PayPal.

## Nội dung chính
- **Thanh đầu trang tối giản:** Nút **`Donate me`** ở góc trái cuộn xuống QR PayPal, nút **`Doritos Maker`** ngay cạnh **`ERIST`** dẫn tới mini-game `https://tamanidamani.itch.io/nijikas-ahoge`, cùng biểu tượng chỏm tóc nghiêng của Nijika.
- **Tiêu đề động & Hồ sơ Discord:**
  - Chữ `Erist` luân chuyển mượt mỗi 3 giây qua 6 chế độ hiển thị.
  - Dãy 4 nút chỉ icon: Steam (`76561198845357399`), YouTube (`@erist2689`), GitHub (`fatshitduck`) và Discord (`737671991288397915`).
  - Thẻ **Discord Profile** nhúng trực tiếp đồng bộ qua Lanyard / `japi.rest` (avatar, tên hiển thị, handle `.erist`, trạng thái và hoạt động trực tiếp).
- **CS2 Stats (2 tab chi tiết & tự cập nhật từ Leetify API v3):**
  - Tab **`Matchmaking`**: Hiển thị đồng thời **Premier** (kèm **Highest 23,679**), **Competitive** (kèm **Highest LEM** và rank từng map active: Mirage, Dust 2, Nuke, Inferno, Ancient), bảng so sánh trực tiếp Premier vs Competitive (Win Rate, K/D, ADR, HS%, Rating, phong độ gần đây) và 8 chỉ số kỹ năng tổng hợp.
  - Tab **`FACEIT`**: Hiển thị **Level 9 / 1,885 ELO**, **Highest Rank Level 10 / 2,456 ELO**, thông số sự nghiệp CS2 (531 trận, Win Rate, K/D, ADR, HS%, K/R, HLTV Rating, chuỗi thắng dài nhất), Top FACEIT Maps, phong độ 10 trận gần đây cùng liên kết tới Leetify, FACEIT, Faceit Analyser và CSStats.
- **Favourite Games:** Counter-Strike 2, Hunt: Showdown, Battlefield 1 và Battlefield V với ảnh bìa Steam chính thức.
- **Gear & Monitor tách nền thực tế:** Delux M500 Pro, EWEADN ZAP68 Ultra, AULA G7 Pro, KTC H24T7 / H25T7 (24 inch • 260Hz) và ASUS VG247Q1A (24 inch • 165Hz).
- **PC Specs:** Ảnh tách nền (`assets/potato-cutout.png`) cùng cấu hình đầy đủ (CPU, GPU, RAM, Ổ cứng, Mainboard, Case, Tản nhiệt, Nguồn PSU).
- **Nhạc nền cố định góc dưới phải:** Trình phát timeline nổi (`Nếu Như Ta Chẳng Còn - MCK (ft. A$AP Ướt Mi)`) nhúng qua YouTube IFrame Player API, hỗ trợ Play/Pause, kéo tua timeline, chỉnh âm lượng và tự động phát lặp khi có tương tác.
- **Buy me some caffeine:** Mã QR PayPal (`assets/paypal-qr.svg`) và liên kết `https://www.paypal.com/ncp/payment/FFXRNUASDPLAY`.

## Cấu trúc thư mục
- `index.html`: Cấu trúc trang tối giản.
- `style.css`: Các ô đồng màu nền tối nhẹ và hiệu ứng hover nâng nổi.
- `script.js`: Đồng bộ CS2 Stats, hồ sơ Discord, nhạc nền YouTube IFrame Player API, shader WebGL gợn sóng nước êm, cuộn mượt và hiệu ứng chữ `Erist`.
- `assets/*.png`, `assets/ranks/` (18 huy hiệu Competitive & 10 icon cấp FACEIT), `assets/game-*.jpg` & `assets/paypal-qr.svg`: Bộ ảnh sản phẩm tách nền, huy hiệu rank CS2/FACEIT, bìa game, avatar Discord, Potato PC và mã QR PayPal.
- `CNAME`: Tên miền tùy chỉnh `erist.ggff.net` cho GitHub Pages.
