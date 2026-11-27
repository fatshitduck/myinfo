# Erist — Personal Steam & Gear (`instaserist.ggff.net`)

Trang giới thiệu cá nhân tối giản gắn trên Steam Profile của **Erist**, sử dụng nền **Yellow Liquid** gợn sóng nước êm dịu theo con trỏ chuột bằng WebGL, tiêu đề **Erist** biến hóa mỗi 3 giây, ảnh tách nền thực tế của bộ gear, **Monitor**, **PC Specs** đầy đủ thông số và mục **Buy me some caffeine** với mã QR PayPal.

## Nội dung chính
- **Nút `Buy me some caffeine` góc trên bên trái:** Cuộn mượt xuống cuối trang để xem mã QR PayPal và liên kết thanh toán (`https://www.paypal.com/ncp/payment/FFXRNUASDPLAY`).
- **Tiêu đề động (3 giây/nhịp):** Luân chuyển mượt giữa hiệu ứng gõ chữ, đổi font liên tục, mã Morse (`· ·−· ·· ··· −`), giải mã ký tự, sóng chữ và nháy nhị phân.
- **Liên kết tối giản chỉ icon:** Steam (`76561198845357399`), YouTube (`@erist2689`) và GitHub (`fatshitduck`).
- **Gear & Monitor tách nền thực tế:**
  - Chuột: Delux M500 Pro
  - Bàn phím: EWEADN ZAP68 Ultra
  - Tai nghe: AULA G7 Pro
  - Màn chính: KTC H24T7 / H25T7 (24 inch • 260Hz)
  - Màn phụ: ASUS VG247Q1A (24 inch • 165Hz)
- **PC Specs:** Ảnh tách nền (`assets/potato-cutout.png`) cùng cấu hình đầy đủ (CPU, GPU, RAM, Ổ cứng, Mainboard, Case, Tản nhiệt, Nguồn PSU).

## Cấu trúc thư mục
- `index.html`: Cấu trúc trang tối giản.
- `style.css`: Các ô đồng màu nền tối nhẹ và hiệu ứng hover nâng nổi.
- `script.js`: Shader WebGL gợn sóng nước êm, cuộn mượt và bộ điều khiển hiệu ứng chữ `Erist`.
- `assets/*.png` & `assets/paypal-qr.svg`: Bộ ảnh sản phẩm tách nền, Potato PC và mã QR PayPal.
- `CNAME`: Tên miền tùy chỉnh `instaserist.ggff.net` cho GitHub Pages.
