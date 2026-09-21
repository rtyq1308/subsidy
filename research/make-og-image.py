"""사이트 히어로 디자인과 같은 톤의 Open Graph 썸네일을 만든다.

색상은 public/styles.css의 값을 그대로 쓴다.
크기는 Threads·카카오톡 링크 미리보기 기준 1200x630.
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
CREAM, INK, GREEN = "#f7f7f2", "#174e44", "#438f72"
SOFT, CARD, MUTED = "#e9efe6", "#ffffff", "#5f6f66"

bold = r"C:\Windows\Fonts\malgunbd.ttf"
regular = r"C:\Windows\Fonts\malgun.ttf"

img = Image.new("RGB", (W, H), CREAM)
d = ImageDraw.Draw(img)

# 히어로 우측의 둥근 면
d.ellipse((690, -150, 1330, 490), fill=SOFT)
d.ellipse((905, 250, 1235, 580), fill="#dce8dd")

# 헤더 줄: 로고 마크와 사이트 이름
d.rounded_rectangle((60, 46, 116, 102), 18, fill=INK)
d.text((88, 74), "₩", font=ImageFont.truetype(bold, 34), fill=CREAM, anchor="mm")
d.text((132, 74), "지원금 모음", font=ImageFont.truetype(bold, 36), fill=INK, anchor="lm")
d.text((1140, 74), "지원 제도 안내", font=ImageFont.truetype(regular, 24), fill=MUTED, anchor="rm")

# 본문 카피
d.text((60, 196), "내 상황에 맞는 혜택부터", font=ImageFont.truetype(bold, 26), fill=GREEN)
d.text((60, 250), "지원금 모음,", font=ImageFont.truetype(bold, 72), fill=INK)
d.text((60, 336), "나에게 맞는 혜택 찾기.", font=ImageFont.truetype(bold, 72), fill=GREEN)
d.text((60, 470), "청년·중장년·가족·생활·일자리 지원을 한곳에.",
       font=ImageFont.truetype(regular, 30), fill=MUTED)
d.text((60, 516), "조건을 먼저 읽고 필요한 제도로 바로 이동하세요.",
       font=ImageFont.truetype(regular, 30), fill=MUTED)

# 떠 있는 카드 두 장
def card(box, label, title, angle):
    w, h = box[2]-box[0], box[3]-box[1]
    layer = Image.new("RGBA", (w+80, h+80), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.rounded_rectangle((40, 40, 40+w, 40+h), 20, fill=CARD)
    ld.text((72, 68), label, font=ImageFont.truetype(regular, 22), fill=MUTED)
    ld.text((72, 100), title, font=ImageFont.truetype(bold, 38), fill=INK)
    layer = layer.rotate(angle, resample=Image.BICUBIC, expand=False)
    img.paste(layer, (box[0]-40, box[1]-40), layer)

card((856, 122, 1136, 238), "월세", "주거 지원", -4)
card((896, 262, 1176, 378), "훈련", "일자리 지원", 4)

# 별 모양 포인트
cx, cy, r = 880, 452, 26
d.line((cx-r, cy, cx+r, cy), fill=GREEN, width=6)
d.line((cx, cy-r, cx, cy+r), fill=GREEN, width=6)
d.line((cx-r*0.7, cy-r*0.7, cx+r*0.7, cy+r*0.7), fill=GREEN, width=6)
d.line((cx-r*0.7, cy+r*0.7, cx+r*0.7, cy-r*0.7), fill=GREEN, width=6)

img.save(r"public\og-benefit.png", optimize=True)
print("public/og-benefit.png 생성")
