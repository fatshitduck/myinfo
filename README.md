# Erist — Personal Steam & Gear (`instaserist.ggff.net`)

Trang giới thiệu cá nhân tối giản gắn trên Steam Profile của **Erist**, sử dụng nền **Yellow Liquid** gợn sóng nước êm dịu theo con trỏ chuột bằng WebGL, tiêu đề **Erist** biến hóa mỗi 3 giây, biểu tượng chỏm tóc nghiêng của **Ijichi Nijika**, **CS2 Live Stats**, **Favourite Games**, ảnh tách nền thực tế của **Gear**, **Monitor**, **PC Specs** và mục **Buy me some caffeine** với mã QR PayPal.

## Nội dung chính
- **Thanh đầu trang tối giản:** Nút **`Donate me`** ở góc trái cuộn xuống QR PayPal, nút **`Doritos Maker`** ngay cạnh **`ERIST`** dẫn tới mini-game `https://tamanidamani.itch.io/nijikas-ahoge`, cùng biểu tượng chỏm tóc nghiêng của Nijika.
- **Tiêu đề động (3 giây/nhịp):** Luân chuyển mượt giữa hiệu ứng gõ chữ, đổi font liên tục, mã Morse (`· ·−· ·· ··· −`), giải mã ký tự, sóng chữ và nháy nhị phân.
- **Liên kết tối giản chỉ icon:** Steam (`76561198845357399`), YouTube (`@erist2689`) và GitHub (`fatshitduck`).
- **CS2 Stats (tự cập nhật từ Leetify API công khai):** Premier Rating, FACEIT Level/ELO, Aim Rating, Win Rate, Counter-Strafing, Headshot Acc, Reaction / Preaim cùng liên kết tới Leetify và CSStats.
- **Favourite Games:** Counter-Strike 2, Hunt: Showdown, Battlefield 1 và Battlefield V với ảnh bìa Steam chính thức.
- **Gear & Monitor tách nền thực tế:** Delux M500 Pro, EWEADN ZAP68 Ultra, AULA G7 Pro, KTC H24T7 / H25T7 (24 inch • 260Hz) và ASUS VG247Q1A (24 inch • 165Hz).
- **PC Specs:** Ảnh tách nền (`assets/potato-cutout.png`) cùng cấu hình đầy đủ (CPU, GPU, RAM, Ổ cứng, Mainboard, Case, Tản nhiệt, Nguồn PSU).
- **Buy me some caffeine:** Mã QR PayPal (`assets/paypal-qr.svg`) và liên kết `https://www.paypal.com/ncp/payment/FFXRNUASDPLAY`.

## Cấu trúc thư mục
- `index.html`: Cấu trúc trang tối giản.
- `style.css`: Các ô đồng màu nền tối nhẹ và hiệu ứng hover nâng nổi.
- `script.js`: Tự động đồng bộ CS2 Stats qua Leetify API, shader WebGL gợn sóng nước êm, cuộn mượt và bộ điều khiển hiệu ứng chữ `Erist`.
- `assets/*.png`, `assets/game-*.jpg` & `assets/paypal-qr.svg`: Bộ ảnh sản phẩm tách nền, bìa game, Potato PC và mã QR PayPal.
- `CNAME`: Tên miền tùy chỉnh `instaserist.ggff.net` cho GitHub Pages.
