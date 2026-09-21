from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), "#eefbff")
d = ImageDraw.Draw(img)
bold = r"C:\Windows\Fonts\malgunbd.ttf"
regular = r"C:\Windows\Fonts\malgun.ttf"

# Soft background shapes
d.ellipse((-130, -190, 430, 370), fill="#d4f4ff")
d.ellipse((900, -210, 1360, 300), fill="#c9f0ef")
d.polygon([(0, 500), (310, 340), (520, 630), (0, 630)], fill="#d9f7ef")
d.polygon([(1200, 420), (1010, 300), (820, 630), (1200, 630)], fill="#d8ecff")

# Top copy
title_font = ImageFont.truetype(bold, 102)
sub_font = ImageFont.truetype(regular, 35)
button_font = ImageFont.truetype(bold, 61)
footer_font = ImageFont.truetype(bold, 40)
small_font = ImageFont.truetype(regular, 28)

title = "지원금 신청"
box = d.textbbox((0, 0), title, font=title_font)
d.text(((W - (box[2]-box[0]))/2, 65), title, font=title_font, fill="#102f67")
d.text((W/2, 193), "놓치기 전에 받을 수 있는 혜택을 확인하세요", font=sub_font, fill="#34516f", anchor="ma")

# Illustration: documents, check, coin, graph
d.rounded_rectangle((330, 270, 490, 390), 15, fill="#ffffff", outline="#2b6d91", width=5)
d.line((365, 307, 390, 330, 432, 290), fill="#16a29a", width=10, joint="curve")
d.line((365, 350, 445, 350), fill="#8fbcd0", width=9)
d.ellipse((518, 282, 626, 390), fill="#fff4bf", outline="#ce8a21", width=6)
d.text((572, 333), "₩", font=ImageFont.truetype(bold, 55), fill="#9d6719", anchor="mm")
d.line((675, 382, 720, 340, 773, 360, 842, 285), fill="#143f73", width=9, joint="curve")
d.polygon([(842, 285), (815, 294), (837, 315)], fill="#143f73")
d.rectangle((685, 365, 713, 390), fill="#67c9c4")
d.rectangle((737, 340, 765, 390), fill="#3ea7b8")
d.rectangle((789, 310, 817, 390), fill="#1b7998")

# Oversized CTA button
shadow = (246, 428, 962, 548)
d.rounded_rectangle(shadow, 28, fill="#a9cbd7")
d.rounded_rectangle((238, 416, 954, 536), 28, fill="#087b96")
d.text((596, 475), "바로가기  ›", font=button_font, fill="white", anchor="mm")

# Footer strip, matching the preview card caption role
d.rectangle((0, 574, W, H), fill="white")
d.text((600, 602), "지원금 혜택 모두 받아보세요", font=footer_font, fill="#173453", anchor="mm")
d.text((1120, 603), "지원금 모음", font=small_font, fill="#5c7589", anchor="rm")

img.save(r"benefit-hub\public\og-benefit.png", optimize=True)
