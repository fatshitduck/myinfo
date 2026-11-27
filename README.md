# Erist — Personal Steam & Gear (`instaserist.ggff.net`)

Trang giới thiệu cá nhân tối giản gắn trên Steam Profile của **Erist**, sử dụng nền **Yellow Liquid** gợn sóng nước êm dịu theo con trỏ chuột bằng WebGL, tiêu đề **Erist** biến hóa mỗi 3 giây, biểu tượng chỏm tóc nghiêng của **Ijichi Nijika**, **CS2 Live Stats**, ảnh tách nền thực tế của **Gear**, **Monitor**, **PC Specs**, mini-game **Doritos Maker** và mục **Buy me some caffeine** với mã QR PayPal.

## Nội dung chính
- **Nút `Donate me` góc trên bên trái & icon chỏm tóc Nijika:** Biểu tượng tab web và icon cạnh chữ `ERIST` xoay nghiêng theo chỏm ahoge của Nijika; bấm `Donate me` để cuộn mượt xuống mục QR PayPal ở cuối trang.
- **Tiêu đề động (3 giây/nhịp):** Luân chuyển mượt giữa hiệu ứng gõ chữ, đổi font liên tục, mã Morse (`· ·−· ·· ··· −`), giải mã ký tự, sóng chữ và nháy nhị phân.
- **Liên kết tối giản chỉ icon:** Steam (`76561198845357399`), YouTube (`@erist2689`) và GitHub (`fatshitduck`).
- **CS2 Stats (tự cập nhật từ Leetify API công khai):** Premier Rating, FACEIT Level/ELO, Aim Rating, Win Rate, Counter-Strafing, Headshot Acc, Reaction / Preaim cùng liên kết tới Leetify và CSStats.
- **Gear & Monitor tách nền thực tế:**
  - Chuột: Delux M500 Pro
  - Bàn phím: EWEADN ZAP68 Ultra
  - Tai nghe: AULA G7 Pro
  - Màn chính: KTC H24T7 / H25T7 (24 inch • 260Hz)
  - Màn phụ: ASUS VG247Q1A (24 inch • 165Hz)
- **PC Specs:** Ảnh tách nền (`assets/potato-cutout.png`) cùng cấu hình đầy đủ (CPU, GPU, RAM, Ổ cứng, Mainboard, Case, Tản nhiệt, Nguồn PSU).
- **Doritos Maker:** Liên kết trực tiếp tới mini-game `https://tamanidamani.itch.io/nijikas-ahoge`.
- **Buy me some caffeine:** Mã QR PayPal (`assets/paypal-qr.svg`) và liên kết `https://www.paypal.com/ncp/payment/FFXRNUASDPLAY`.

## Cấu trúc thư mục
- `index.html`: Cấu trúc trang tối giản.
- `style.css`: Các ô đồng màu nền tối nhẹ và hiệu ứng hover nâng nổi.
- `script.js`: Tự động đồng bộ CS2 Stats qua Leetify API, shader WebGL gợn sóng nước êm, cuộn mượt và bộ điều khiển hiệu ứng chữ `Erist`.
- `assets/*.png` & `assets/paypal-qr.svg`: Bộ ảnh sản phẩm tách nền, Potato PC và mã QR PayPal.
- `CNAME`: Tên miền tùy chỉnh `instaserist.ggff.net` cho GitHub Pages.
