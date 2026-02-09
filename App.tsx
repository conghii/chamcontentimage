
import React, { useState } from 'react';
import { Scene, Assets, GenerationSettings, AspectRatio, Quality, AssetData, ProductContext } from './types';
import AssetUploader from './components/AssetUploader';
import StoryboardCard from './components/StoryboardCard';
import { ApiKeySettings } from './components/ApiKeySettings';
import { splitPromptIntoScenes, generateSceneImage, generateProductTailoredPrompt, generatePromptsFromAssets } from './services/geminiService';

// ==========================================
// 1. LISTING TEMPLATES (STANDARD 6 SCENES)
// ==========================================

const SCENE_1_LISTING_REF = `
[---TIÊU ĐỀ VÀ TEXT BÊN TRÁI---]
Bên trái khung hình: Text title "A DAILY DOSE OF POSITIVITY" (Pickle Green font, large, bold, inspiring).

[---SẢN PHẨM CHÍNH (BÊN PHẢI)---]
On a light oak desk, under soft natural sunlight:
(One clear plastic jar:1.3) with black lid, approx 3.3 inches tall, showing the "POSITIVE PICKLE" label.
(One beige gift box:1.2) standing next to it.

⚠️ CRITICAL HEIGHT CONSTRAINT: The jar and box MUST be EXACTLY THE SAME HEIGHT! 
Both products are approximately 3.3 inches tall. They should appear EQUAL in height when standing side by side.
Imagine placing a ruler across their tops - the line should be perfectly horizontal.
DO NOT make the box taller than the jar. They are IDENTICAL in height.
(Multiple green pickle-shaped cards) scattered naturally in front of the jar and box. Important Scale: The cards are small (approx 2 inches), looking tiny and cute next to the jar, showing the cartoon faces.

[---BỐI CẢNH BÌNH THƯỜNG (NON-HOLIDAY)---]
The set is placed on a clean, light oak wooden desk surface. The background is a gently blurred, sunlit cozy room shelf with a small green potted plant and a stack of books (creating a fresh, daily, uplifting vibe, no Christmas elements).

[---PHONG CÁCH & ÁNH SÁNG---]
High-end commercial product photography, vibrant and cheerful colors, (soft diffused natural sunlight:1.2) coming from the side creating a warm glow, clear visibility of all items and textures.

[---KỸ THUẬT---]
Shot on 50mm lens, sharp focus on the entire product set, shallow depth of field, high texture detail on paper and plastic, 8k resolution, masterpiece, no text overlays.
`;

const SCENE_2_LISTING_REF = `
[---BỐ CỤC CHUNG---] A clean, bright 3-panel horizontal infographic banner. Main Title at top: "YOUR 3-STEP RITUAL". The overall vibe is fresh, sunny, and everyday (absolutely NO Christmas elements).
[---PANEL 1 (TRÁI): BƯỚC 1---]
Title: "STEP 1. OPEN YOUR JAR".
Action: Close-up of hands twisting open the black lid of the clear "Positive Pickle" jar.
Setting: Sunlit kitchen counter with a small green plant.
[---PANEL 2 (GIỮA): BƯỚC 2 - RÚT THẺ---]
Title: "STEP 2. PICK A CARD".
Visual Correction (Sửa lỗi): A close-up macro shot of fingers pinching one small folded paper card (shaped like a pickle) from the jar.
Detail Focus: Show clearly that it is a paper product, not plastic. The card is currently closed (showing the cute pickle face on the outside).
Action: The hand lifts it delicately, like picking a lucky draw.
[---PANEL 3 (PHẢI): BƯỚC 3 (ĐÃ SỬA LẠI)---]
Title: "STEP 3. READ & SMILE".
Visual Correction: A close-up shot of a woman holding a single, tiny green pickle card between her thumb and index finger.
Important Scale: The card looks very small in her hand (approx 2 inches).
Key Detail (Mặt sau): The side facing the camera is the back of the card, showing white printed affirmation text (similar style to the reference image).
Emotion & Setting: The woman is smiling warmly down at the card. The open jar sits on a cozy coffee table nearby.
[---FOOTER---]
Bottom text box: "Daily happiness in 3 simple steps!"
[---PHONG CÁCH & KỸ THUẬT---] Commercial photography style, vibrant fresh colors (yellow, green, white), soft natural lighting, sharp focus on products, clean design, 8k resolution.
`;

const SCENE_3_LISTING_REF = `
[---TIÊU ĐỀ & BỐ CỤC CHUNG---]
A clean, organized "What's Included" product photography shot (Knolling style).

⚠️ TEXT STYLE MANDATE (CRITICAL):
Top Banner: The text "**WHAT'S INCLUDED?**" MUST be in a **playful, bouncy, cartoon handwriting style**:
  - Font style: Rounded, irregular baseline (like Comic Sans meets hand lettering)
  - Color: Bright BLUE (#4A90E2) with slight white outline
  - Background: Soft yellow banner with wavy, hand-drawn edges (NOT straight geometric banner)
  - Feel: Fun, friendly, casual - NOT corporate or professional typography

DO NOT use standard printed fonts. This MUST look hand-drawn and playful.
The items are arranged neatly on a clean wooden surface, separated clearly to show quantity and scale.

[---PHONG CÁCH TEXT CHUNG CHO NHÃN---]
**CRITICAL TEXT STYLE:** All pointing labels and dimension text below are in a **friendly, rounded, hand-drawn marker font**. The text color is **Pickle Green**, sometimes inside chubby, hand-drawn speech bubbles or tag shapes with a **yellow or beige border** to match the product aesthetic.

[---CHI TIẾT SẢN PHẨM & NHÃN TEXT (ĐÃ STYLE HÓA)---]
1.  **THE JAR (Center):** The clear plastic jar (3.3 inches tall) filled with cards, black lid, yellow "Positive Pickle" label.
    * *Text Label pointing to Jar:* A playful bubble label reads: "**1x Pickle Jar (60 Cards Inside)**".
    * *Dimension Text:* A hand-drawn vertical double-arrow line with text: "**3.3 inches**".

2.  **THE BOX (Left):** The beige gift box standing upright, showing the rainbow/animal design.
    * *Text Label:* A playful bubble label reads: "**1x Gift-Ready Box**".
    * *Dimension Text:* Hand-drawn vertical line: "**3.3 inches**".

3.  **THE CARDS (Right/Front):** A neat fan-out or pile of the small green pickle cards.
    * *Visual Detail:* Show clearly they are small (**approx 2 inches**) and some are slightly open to hint at the text inside.
    * *Text Label:* A playful bubble label reads: "**60x Unique Affirmation Cards**".
    * *Dimension Text:* Hand-drawn line next to a single card: "**2 inches (Tiny & Cute!)**".

4.  **THE NOTE (Bottom Corner):** The rectangular Thank You card.
    * *Text Label:* A playful bubble label reads: "**1x Thank You Card**".

[---BỐI CẢNH BÌNH THƯỜNG (EVERYDAY)---]
Placed on a light oak wooden desk. The background is a clean, bright white wall with soft shadows (Amazon commercial style), absolutely NO holiday/Christmas decorations. Just pure, fresh product focus.

[---PHONG CÁCH & KỸ THUẬT---]
High-end e-commerce photography, flat lay or slight 45-degree angle, sharp focus on all funny text labels, vibrant colors (Yellow, Green, Beige), 8k resolution.
`;

const SCENE_4_LISTING_REF = `
**CRITICAL SCALE CONSTRAINT:** The product is a **SMALL, PALM-SIZED JAR (3.3 inches)**. Do not render it as a large container. It should look compact and cute.

⚠️ COLLAGE DIVERSITY REQUIREMENT (CRITICAL):
This is a 2x2 COLLAGE with 4 DIFFERENT scenes. Each panel MUST show a UNIQUE context.
DO NOT repeat the same image 4 times. Each panel requires distinct setting, people, and atmosphere.

[---KHUNG 1 (TOP LEFT): BẠN BÈ (FRIENDS IN CAFÉ)---]
* **Text Label:** A tag reading: "**Gift for Friends**"
* **Visual:** A CANDID, mid-conversation shot in a REAL CAFÉ. Two friends at a rustic wooden table.
* **Action:** One person is handing the small beige gift box to their friend. Their hands are mid-reach, capturing a natural moment.
* **Setting Details:** Half-empty coffee cups, café window with soft diffused daylight, other blurred diners in far background
* **NATURAL AUTHENTICITY:**
  - Genuine, mid-laugh expressions (not posed smiles)
  - Candid body language - leaning in, relaxed postures
  - Soft natural window light (NOT studio lighting)
  - Slightly imperfect composition - not centered, organic framing
  - Real café atmosphere - napkins, crumbs, lived-in feeling
* **Scale Check:** The box is small, fitting easily in one hand.

[---KHUNG 2 (TOP RIGHT): ĐỒNG NGHIỆP (OFFICE SETTING)---]
* **Text Label:** A tag reading: "**Gift for Colleagues**"
* **Visual:** A REAL, actively-used office desk. Not perfectly clean - lived-in workspace.
* **Action:** The small jar sits naturally among work items on the desk.
* **Setting Details:** Computer monitor (screen has content), half-drunk coffee in mug, sticky notes on monitor, papers with handwriting, pens scattered
* **NATURAL AUTHENTICITY:**
  - Realistic office lighting - fluorescent + window light mix
  - Desk has real clutter - keyboard, mouse, phone charger cable
  - Background slightly out of focus - colleague walking by (blurred)
  - Natural shadows from desk lamp and window
  - Jar placed casually, not perfectly centered
* **Scale Check:** The jar is VERY SMALL - about half the height of the coffee mug.

[---KHUNG 3 (BOTTOM LEFT): HỌC SINH (STUDY DESK)---]
* **Text Label:** A tag reading: "**Gift for Students**"
* **Visual:** An AUTHENTIC student desk mid-study session. Realistically messy.
* **Action:** The tiny jar tucked among study materials, one green pickle card leaning against it.
* **Setting Details:** Open textbook (pages visible), notebook with actual handwritten notes/doodles, laptop keyboard partially visible, highlighters uncapped, coffee stain on paper
* **NATURAL AUTHENTICITY:**
  - Warm desk lamp creates golden pool of light
  - Natural shadows from stacked books
  - Realistic study clutter - eraser shavings, crumpled sticky notes
  - Late evening atmosphere - dim room, focused light on desk
  - Hand resting on desk edge (partial, suggesting someone studying)
* **Scale Check:** Jar is TINY - smaller than the textbook spine, dwarfed by stacked books.

[---KHUNG 4 (BOTTOM RIGHT): BẢN THÂN (SELF-CARE MOMENT)---]
* **Text Label:** A tag reading: "**Gift for Yourself**"
* **Visual:** An INTIMATE, peaceful self-care moment. Person curled up on couch.
* **Action:** Person holding a tiny green card close, reading it with genuine soft smile. Natural, unposed moment.
* **Setting Details:** Chunky knit blanket draped naturally (wrinkles, folds), jar on wooden side table with tea mug, soft couch pillows
* **NATURAL AUTHENTICITY:**
  - Soft afternoon window light (NOT studio light)
  - Natural face - minimal/no makeup, relaxed expression
  - Cozy clothes - oversized sweater, fuzzy socks visible
  - Background softly blurred - hint of living room (plant, bookshelf)
  - Steam rising from tea mug for lived-in feeling
  - Card held naturally between fingers (not perfectly displayed)
* **Scale Check:** The card is VERY SMALL in hand (business card size). Jar on table looks tiny and unobtrusive.

[---PHONG CÁCH & KỸ THUẬT---]
**Style:** AUTHENTIC Lifestyle Photography - MUST look real, candid, lived-in.
**Quality:** 8k, sharp focus on products, SLIGHT imperfections OK (adds realism).
**Lighting:** 100% NATURAL light sources (windows, desk lamps, café lighting). NO studio softboxes.
**Composition:** Slightly off-center, organic framing. NOT perfectly symmetrical.
**Atmosphere:** Each panel must feel like a real moment caught on camera, NOT a staged photoshoot.
**DO NOT:** Make it look like professional product photography. It should look like Instagram lifestyle content.
**Text Style:** Simple, modern sans-serif fonts in Yellow/Green boxes.
`;

const SCENE_5_LISTING_REF = `
[---TIÊU ĐỀ & BỐ CỤC CHUNG---]
A high-quality lifestyle photography 2x2 grid collage titled "**FITS EVERY SPACE**".
The collage shows the "Positive Pickle" set in four REAL, LIVED-IN home spaces. Each photo must feel authentic and natural.

[---KHUNG 1 (TOP LEFT): BÀN LÀM VIỆC (HOME OFFICE)---]
* **Setting:** A REAL home office desk in active use. Natural morning light from window.
* **Product Placement:** Jar and box sit casually among work items - NOT staged perfectly.
* **NATURAL DETAILS:**
  - Laptop open (screen shows work content, not blank)
  - Coffee mug with visible coffee level, steam if morning
  - Scattered items: phone charging cable, notepad with pen, reading glasses
  - Background slightly blurred - bookshelf or plant visible
  - Natural shadows from window light
  - Desk has character - wood grain, slight imperfections
* **Text Overlay:** Clean label: "**DESK MOTIVATION**" (Pickle Green)
* **Atmosphere:** Mid-morning work session, productive but cozy

[---KHUNG 2 (TOP RIGHT): BÀN TRÀ PHÒNG KHÁCH (COFFEE TABLE)---]
* **Setting:** Rustic wooden coffee table in lived-in living room. Afternoon sunlight.
* **Product Placement:** Set placed naturally on magazines/books, jar lid slightly askew (suggesting use).
* **NATURAL DETAILS:**
  - Stack of real magazines (visible covers, slightly messy)
  - Ceramic mug with visible tea/coffee inside
  - Cozy knit blanket edge visible on couch in background
  - Succulent plant or small flower vase nearby
  - Natural sunlight creating warm glow and soft shadows
  - Table shows use - slight ring marks, lived-in texture
* **Text Overlay:** "**DAILY LIVING ROOM JOY**" (Yellow)
* **Atmosphere:** Lazy Sunday afternoon, relaxed home vibe

[---KHUNG 3 (BOTTOM LEFT): KỆ SÁCH (BOOKSHELF)---]
* **Setting:** White/light wood bookshelf filled with actual books (spines visible).
* **Product Placement:** Jar and box nestled between book rows, NOT perfectly aligned.
* **NATURAL DETAILS:**
  - Books of varying heights and colors (realistic shelf)
  - Small potted succulent or air plant on shelf
  - One book slightly pulled out (suggesting recent use)
  - Shelf has personality - mix of vertical/horizontal books
  - Natural lighting from room (not spotlight)
  - Maybe a small photo frame or decorative item nearby
* **Text Overlay:** "**A SHELF FULL OF SMILES**" (Beige/Tan)
* **Atmosphere:** Cozy reading nook, personal library feel

[---KHUNG 4 (BOTTOM RIGHT): TỦ ĐẦU GIƯỜNG (BEDSIDE TABLE)---]
* **Setting:** Minimalist bedside table, early morning soft light through window.
* **Product Placement:** Set within easy reach, naturally positioned for morning ritual.
* **NATURAL DETAILS:**
  - Small warm bedside lamp (ON, casting soft glow)
  - Analog alarm clock or phone charging
  - Glass of water (half-full)
  - Edge of soft bedding visible (unmade, suggesting morning)
  - Window with sheer curtain, golden hour light filtering through
  - Table surface shows use - not perfectly clean
* **Text Overlay:** "**MORNING PICK-ME-UP**" (Pickle Green)
* **Atmosphere:** Peaceful morning ritual, gentle wake-up moment

[---PHONG CÁCH & KỸ THUẬT---]
**Style:** REAL HOME PHOTOGRAPHY - Instagram lifestyle aesthetic, NOT professional staging.
**Lighting:** 100% natural light from windows/lamps. Each panel has different time of day lighting (morning, afternoon, evening).
**Composition:** Organic, slightly off-center. Products integrated naturally into environment.
**Quality:** 8k but with natural imperfections (slight dust, lived-in details).
**CRITICAL:** Each space must feel INHABITED and REAL. NO sterile catalog photography.
**DO NOT:** Make it look like an IKEA catalog. Add life - coffee rings, book creases, blanket wrinkles.
**Color Grading:** Warm, inviting tones. Each panel slightly different white balance based on light source.
`;

const SCENE_6_LISTING_REF = `
[---BỐ CỤC CHUNG---]
A professional Amazon comparison infographic titled \"**WHY CHOOSE US?**\" at the top center in bold Pickle Green font on a soft yellow banner.
The image is divided into two clear vertical columns with a subtle dividing line.

[---CỘT TRÁI: "OUR POSITIVE PICKLE" (✓)---]
**Header:** A green checkmark icon + bold text \"**OUR POSITIVE PICKLE**\" in Pickle Green.

**CRITICAL PRODUCT PHOTOGRAPHY (PREMIUM QUALITY):**
* **The Complete Set:** The clear jar with yellow "POSITIVE PICKLE" label + beige rainbow gift box standing side-by-side.
* **Product Positioning:** Both products centered, slightly angled (15°) to show dimension and depth.
* **LIGHTING (CRITICAL):** 
  - Soft, diffused studio lighting from 45° angle
  - Gentle rim light on the edges to create premium glow
  - Subtle shadow underneath for grounding and realism
* **MATERIAL TEXTURE (MUST SHOW):**
  - Jar: Crystal-clear plastic with light refraction, showing cards inside
  - Label: Glossy finish with slight reflection
  - Box: Matte cardboard texture with soft, tactile appearance
  - Colors: Vibrant and saturated (yellow label pops, rainbow design clear)
* **VISUAL QUALITY:**
  - Sharp focus on both products
  - High resolution, commercial photography standard
  - Clean white/light gray background (Amazon standard)
  - Products look NEW, pristine, and desirable

**Checklist Below (Yellow Background Rows):**
Row 1: Gift icon + "Beautifully Illustrated Gift Box Included" | Green checkmark
Row 2: Pickle icon + "60 Unique Pickle-Shaped Affirmation Cards" | Green checkmark  
Row 3: Star icon + "Adorable Hand-Drawn Characters & Cards" | Green checkmark
Row 4: Diamond icon + "Premium Thick Card Stock with Vibrant Colors" | Green checkmark

[---CỘT PHẢI: "OTHERS" (✗)---]
**Header:** A red X icon + bold text \"**OTHERS**\" in dark gray.

**PRODUCT (INTENTIONALLY PLAIN):**
* A single empty glass jar (no label, no decoration)
* Positioned center, same angle as left column for fair comparison
* Same lighting setup but the jar looks generic/boring due to lack of design
* Background: Soft pink/salmon color to create visual distinction

**Checklist Below (Yellow Background Rows with Red X):**
Row 1: "No Box / Simple Plastic Bag" | Red X
Row 2: "Blank or Generic Square Paper" | Red X
Row 3: "Boring / Plaink & White Text" | Red X
Row 4: "Flimsy Thin Paper" | Red X

[---PHONG CÁCH & KỸ THUẬT---]
**Photography Style:** High-end Amazon product photography
**Lighting:** Studio softbox lighting, even and professional
**Focus:** Razor-sharp on products, slight blur on background
**Resolution:** 8k, commercial quality
**Color Grading:** Vibrant, saturated colors on left; muted on right
**Texture Detail:** Show material quality - plastic clarity, cardboard texture, label gloss
**Perspective:** Straight-on with slight 3/4 angle for depth

⚠️ CRITICAL: The products on the LEFT must look PREMIUM, DESIRABLE, and HIGH-QUALITY.
This is a selling point - make customers WANT to buy based on visual appeal alone.
`;

// ==========================================
// 2. A+ CONTENT TEMPLATES (5 SCENES)
// ==========================================

const SCENE_1_APLUS_REF = `
PROMPT ẢNH A+ HERO DAILY – POSITIVE PICKLE JAR (TIẾNG VIỆT)
[— MỤC ĐÍCH ẢNH —]
Ảnh hero marketing chuyên nghiệp cho listing sản phẩm hằng ngày của “Positive Pickle Jar”, phong cách sạch – tích cực – thân thiện – dễ tin cậy, phù hợp Amazon / Etsy.

[— BỐ CỤC TỔNG THỂ —]
Bố cục trung tâm, cân đối, đối xứng. Zoom gần vào sản phẩm lọ
Trục dọc rõ ràng: Text → Sản phẩm → Không gian
Phong cách ảnh thương mại, dễ đọc, dễ nhận diện sản phẩm
Chừa đủ khoảng trống để nhìn rõ text và lọ

[— TEXT TRUNG TÂM (QUAN TRỌNG) —]
Text được đặt chính giữa trung tâm hình ảnh, rõ ràng, nổi bật:
Tiêu đề chính (lớn, đậm): “Positive Pickle Jar”
Dòng phụ (nhỏ hơn, ngay bên dưới): “60 Affirmation Cards for Daily Encouragement”
Phong cách chữ:
Font sans-serif bo tròn, thân thiện
Màu trắng hoặc xanh lá dịu
Có hiệu ứng nổi nhẹ, bóng mờ mềm
Ánh sáng dịu giúp text tách khỏi nền
Thứ tự thị giác rõ ràng, không rối

[— SẢN PHẨM (TRUNG TÂM DƯỚI TEXT) —]
Lọ Positive Pickle Jar không nắp đặt ngay bên dưới phần text, căn giữa hoàn hảo.
Nắp lọ mở ra đặt bên cạnh thân lọ
2 sticker pickle đứng bên cạnh, vài sticker pickle xếp xòe hình quạt trên mặt bàn
Nhìn rõ bên trong có nhiều card hình dưa leo dễ thương
Sản phẩm chiếm khoảng 55–65% chiều cao khung hình
Ánh sáng studio mềm, làm nổi chi tiết nhưng không gắt
Cảm giác cao cấp, thân thiện, dùng hằng ngày

[— KHÔNG GIAN & BACKGROUND —]
Không gian:
Bàn làm việc hiện đại
Mặt bàn gỗ sáng
Laptop, sổ tay đặt ở hậu cảnh, chậu cây mini ở 1 bên, tumbler
Background:
Tiền cảnh sắc nét
Hậu cảnh mờ nhẹ (xóa phông / bokeh)
Ánh sáng nắng vàng tự nhiên chiếu từ cửa sổ kính hiện đại vào lọ tạo cảm giác ấm áp
Gradient ánh sáng nhẹ tạo chiều sâu không gian
Không chi tiết gây nhiễu

[— MÀU SẮC & CẢM XÚC —]
Bảng màu:
Xanh lá dịu (pickle green)
Tông trung tính ấm
Trắng sạch
Cảm xúc tổng thể:
Tích cực
Dễ thương vừa đủ (không trẻ con)
Chữa lành
Thân thiện
Đúng tinh thần sản phẩm daily encouragement

[— ÁNH SÁNG & KỸ THUẬT —]
Ánh sáng tự nhiên kết hợp studio mềm
Bóng đổ dịu
Chiều sâu điện ảnh nhẹ
Độ phân giải cao
Phong cách chụp ảnh thương mại chuyên nghiệp
Phù hợp ảnh hero cho Amazon listing

[— NEGATIVE PROMPT —]
Không người
Không Valentine, không trái tim
Không chữ thừa
Không watermark
Không logo thương hiệu khác
Không nền tối
Không ánh sáng gắt
Không bố cục lệch tâm
Không chi tiết rối mắt
`;

const SCENE_2_APLUS_REF = `
PROMPT ẢNH A+ INFOGRAPHIC MARKETING DAILY
POSITIVE PICKLE JAR – 3 SIMPLE STEPS TO FEEL BETTER EVERY DAY
[— MỤC ĐÍCH ẢNH —]
Thiết kế ảnh infographic marketing hằng ngày cho sản phẩm Positive Pickle Jar, dùng cho ảnh listing Amazon / A+ Content / Etsy.
Phong cách Amazon-style infographic chuyên nghiệp, rõ ràng, dễ hiểu, tạo cảm giác feel good every day.
Mood tổng thể: Cheerful – Fresh – Uplifting – Clean – Trustworthy

[— TONE MÀU & ÁNH SÁNG —]
Màu sắc rực rỡ vừa phải nhưng dịu mắt
Tăng nhẹ saturation cho xanh lá pickle green
Nền sáng với gradient kem – xanh pastel
Ánh sáng tự nhiên rõ ràng, cảm giác buổi sáng tích cực
Da người tươi tắn, không ám vàng, không xám
Giảm blur nặng, tăng clarity
Ưu tiên độ sáng và cảm giác vui vẻ

[— BACKGROUND TỔNG THỂ —]
Nền sạch, sáng, trung tính
Màu: trắng pha be rất nhạt hoặc xanh pastel
Gradient ánh sáng mềm
Texture hạt rất nhẹ để tạo chiều sâu
Không vintage, không tone trầm, không Valentine

[— HEADER / TIÊU ĐỀ (TRÊN CÙNG) —]
Tiêu đề chính (font to, nổi bật, chính giữa): “3 Simple Steps to Feel Better Every Day”
Dòng phụ bên dưới: “Turning small moments into daily positivity.”
Phong cách text:
Font sans-serif bo tròn, hiện đại
Tiêu đề màu xanh lá đậm tươi
Dòng phụ sáng, sạch, fresh & happy
Nền tiêu đề bo góc màu trắng / kem nhạt
Bóng mờ mềm, tương phản cao
Không ribbon, không trái tim

[— BỐ CỤC INFOGRAPHIC 3 STEP —]
Bố cục 3 khung STEP, xếp ngang hoặc dọc gọn gàng, dễ scan.
Mỗi STEP:
Bo góc mềm
Viền xanh lá tươi
Badge số bước rõ ràng (STEP 1 – STEP 3)
Text rõ nét, dễ đọc
Khoảng thở thoáng

🟢 STEP 1 – Open the Jar
Hình ảnh:
Lọ Positive Pickle Jar đặt trên mặt bàn sáng
Không có người
Ánh sáng tự nhiên / studio mềm
Bố cục sạch, gọn
Cảm giác: bắt đầu thói quen tích cực
Text gắn step: “Open the jar and start your positive moment.”

🟢 STEP 2 – Pick One Pickle
Hình ảnh:
Tay nhẹ nhàng lấy 1 card pickle từ lọ
Lấy nét vào tay và card
Hậu cảnh mờ nhẹ
Nhấn mạnh hành động đơn giản mỗi ngày
Text gắn step: “Pick one pickle — a small message just for you.”

🟢 STEP 3 – Read & Reset
Hình ảnh:
Người trẻ (20s–30s) ngồi bàn làm việc hoặc sofa gần cửa sổ
Tay cầm card pickle và đọc
Ánh sáng tự nhiên buổi sáng
Gương mặt thư giãn, mỉm cười nhẹ
Không cảm xúc cường điệu
Text gắn step: “Read, breathe, and reset your mindset.”

[— FOOTER / SLOGAN (DƯỚI CÙNG) —]
“One pickle. One thought. One better day.”
Khung bo tròn tối giản
Màu trung tính
Icon nhỏ rất nhẹ (sparkle / lá)

[— PHONG CÁCH & CHẤT LƯỢNG —]
Lifestyle photography + infographic sạch
Ánh sáng cao cấp, bóng đổ dịu
Màu sắc sống động nhưng không gắt
Độ phân giải cao
Hình ảnh thương mại chất lượng cao
Chuẩn Amazon A+ / Product Detail Image

[— NEGATIVE PROMPT —]
Không Valentine
Không trái tim
Không ribbon
Không nền tối
Không vintage
Không watermark
Không chữ rối
Không ánh sáng gắt
`;

const SCENE_3_APLUS_REF = `
PROMPT ẢNH A+ HERO BANNER
POSITIVE PICKLE JAR (EVERYDAY ENCOURAGEMENT)
[— MỤC ĐÍCH ẢNH —]
Ảnh marketing lifestyle hằng ngày cho sản phẩm Positive Pickle Jar, dùng cho Amazon listing / A+ Content / Etsy.
Phong cách không theo mùa, dùng quanh năm, tạo cảm giác tích cực, dễ tin cậy và thân thiện.
Cảm xúc tổng thể: Cheerful – Bright – Cozy – Fresh – Uplifting – Stress-free

[— BẢNG MÀU & ÁNH SÁNG —]
Màu sắc sáng hơn, sống động hơn nhưng dịu mắt
Tăng saturation nhẹ cho xanh lá pickle green
Nền chuyển sang xanh pastel – kem sáng, sạch và thoáng
Giảm tone xám, không cảm giác trầm
Ánh sáng tự nhiên rõ ràng như buổi sáng sớm
Không gian trong trẻo, fresh – happy
Da người sáng, khỏe, không ám vàng hay tối
Không vintage, không tone tối

[— BỐ CỤC TỔNG THỂ (A+ HERO BANNER) —]
Bố cục thương mại hiện đại, cân đối, dễ nhìn:
Bên trái: ảnh lifestyle hero (cảm xúc chính)
Bên phải: các khung hình minh họa khoảnh khắc sử dụng sản phẩm
Bố cục thoáng, không rối, ưu tiên sản phẩm

[— BÊN TRÁI: HERO LIFESTYLE IMAGE —]
Một người trẻ (20s–30s) ngồi thư giãn trong không gian sống sáng sủa
Decor đơn giản: sofa sáng màu, bàn gỗ nhạt, ánh nắng qua cửa sổ, cây xanh nhẹ
Nhân vật cầm card pickle và đọc, hoặc cầm 1–2 card
Biểu cảm tươi vui rõ ràng, nụ cười tự nhiên, cảm giác được chữa lành
Trang phục thường ngày, màu sáng, thân thiện
Ánh sáng tự nhiên mạnh vừa phải, bóng đổ mềm
Phong cách chụp ảnh lifestyle thương mại cao cấp, không lãng mạn

[— BÊN PHẢI: MOMENT GALLERY (3–4 KHUNG BO GÓC) —]
Các khung ảnh bo góc mềm, viền sáng hơn để tương phản tốt với nền.
Panel 1 – Daily Encouragement: Người đọc card pickle trên sofa hoặc bàn làm việc. Cảm giác bình yên, tích cực. Caption: “A Little Daily Encouragement”
Panel 2 – Pick One Pickle: Tay lấy card pickle từ lọ. Lấy nét rõ sản phẩm và card. Caption: “One Pickle, One Positive Thought”
Panel 3 – Start Your Day Right: Bàn làm việc buổi sáng: ánh nắng, cốc cà phê, sổ tay. Lọ Positive Pickle Jar nổi bật. Caption: “Start Your Day with Positivity”
Panel 4 (Optional): Hai người chia sẻ card, mỉm cười tự nhiên. Caption: “Share the Good Vibes”
Text panel: Font sans-serif bo tròn. Màu xanh đậm tươi hoặc xanh pastel đậm. Rõ nét, dễ đọc.

[— NHÃN THÔNG TIN & SẢN PHẨM —]
Ở góc dưới hoặc vị trí gọn gàng:
Nhãn bo tròn, không hình trái tim
Tiêu đề: “Positive Pickle Jar”
Dòng phụ: “60 Affirmation Cards for Daily Encouragement”
Font thân thiện, rõ ràng
Màu nền kem / xanh pastel
Bên cạnh nhãn là ảnh sản phẩm rõ nét:
Lọ thủy tinh trong suốt
Nhãn rõ ràng
Card pickle đáng yêu, sinh động
Ánh sáng studio sạch, cao cấp nhưng gần gũi

[— PHONG CÁCH & CHẤT LƯỢNG —]
Amazon lifestyle product photography
Ánh sáng cao cấp, highlight sạch, bóng đổ dịu
Màu sắc tươi sáng, cảm giác tích cực mỗi ngày
Bố cục thương mại chuyên nghiệp
Độ phân giải cao, chi tiết sắc nét
Phù hợp ảnh hero listing / gallery / A+

[— NEGATIVE PROMPT —]
Không Valentine
Không trái tim
Không nến
Không hoa hồng
Không tone tối
Không vintage
Không watermark
Không chữ rối
Không logo phụ
Không bố cục lộn xộn
`;

const SCENE_4_APLUS_REF = `
DAILY A+ PRODUCT ANATOMY / WHAT’S INSIDE
POSITIVE PICKLE – STANDARD A+ PROMPT
[— IMAGE PURPOSE —]
A clean, professional “WHAT’S INSIDE / PRODUCT ANATOMY” marketing image for the product Positive Pickle, designed for daily use product listings. The image clearly explains what is included in the set, creating a trustworthy, friendly, and easy-to-understand impression for shoppers.

[— BACKGROUND & ATMOSPHERE —]
Soft neutral background: white, warm beige, or very light pastel green
Bright, clean, and minimal
Subtle natural light gradient
Calm, everyday, wellness-inspired mood
Premium yet approachable
No hearts, no romantic or seasonal elements

[— HEADER (TOP CENTER) —]
Top center headline: “WHAT’S INSIDE?”
Smaller subheading below: “Everything included in your Positive Pickle set”
Typography: Rounded, modern sans-serif, Dark green or soft charcoal text
Clean spacing, clear hierarchy
No decorative icons, no Valentine symbols

[— LAYOUT STRUCTURE —]
A three-column horizontal layout, evenly spaced on a bright neutral background, clean and balanced.

[— LEFT SECTION: AFFIRMATION GIFT BOX —]
“Emotional Support Affirmations” gift box placed on the left
Box standing upright, front-facing, clearly visible
Soft studio lighting with gentle shadows
Label below the box inside a rounded rectangle badge: “Emotional Support Affirmations Gift Box” or “Ready-to-Use Affirmation Box”
Minimal accent details: Small dots or subtle line icons
Clean, uncluttered
No ribbons, no hearts

[— CENTER SECTION: POSITIVE PICKLE JAR (MAIN FOCUS) —]
Positive Pickle Jar placed at the center as the main focal point
Jar open
Lid placed slightly tilted beside the jar
Inside the jar, multiple cute pickle affirmation notes clearly visible
A few pickle notes gently spilling out of the jar opening to suggest abundance and positivity
Highlighted label below the jar inside a rounded badge: “Positive Pickle Jar with 60 Affirmation Notes Inside” or “Positive Pickle – 60 Daily Affirmations”

[— RIGHT SECTION: PICKLE STICKERS —]
Four cute pickle stickers displayed on the right
Arranged neatly in a straight line or soft arc
Soft shadow beneath each sticker for depth
Label below the stickers inside a rounded rectangle: “4 Cute Pickle Stickers Included” or “4 Pickle Stickers for Daily Fun”
Very subtle motion accents: Soft shadow lift, Minimal dots or sparkles (optional)
No hearts, no decorative clutter

[— SUPPORTING INFO BUBBLES (OPTIONAL) —]
Rounded, friendly typography
Dark green or neutral text
Placed carefully to avoid covering products
Used only to clarify, not decorate

[— SOFT DAILY BACKGROUND DETAILS —]
Minimal desk elements (notebook, pen, plant leaf)
Light natural daylight
Background elements softly blurred
Product remains the clear visual priority

[— STYLE & QUALITY —]
Product anatomy / “What’s inside” listing image style
High resolution, 4K, sharp details
Professional studio lighting
Clean, organized, and informative
`;

const SCENE_5_APLUS_REF = `
DAILY HERO A+ IMAGE – POSITIVE PICKLE JAR
STANDARD COMMERCIAL PROMPT
[— IMAGE PURPOSE —]
A clean, warm daily lifestyle hero image for the product “Positive Pickle Jar”, designed for a standard product listing (Amazon / Etsy).
The image communicates daily encouragement, calm positivity, and emotional comfort, suitable for everyday self-care and gifting.

[— SUBJECT & EMOTION —]
A young woman in her 20s with a natural appearance, healthy skin tone, and minimal makeup.
She is smiling gently with a calm, optimistic expression.
Her mood feels:
– Relaxed
– Emotionally comforted
– Quietly motivated
She is engaged in a small daily ritual of encouragement and mindfulness.

[— ACTION & PRODUCT INTERACTION —]
She is holding one cute pickle-shaped affirmation card in her hand
The card is slightly angled toward the camera and clearly readable
The card is small (approx.. 2 inches), cute but mature, suitable for daily adult use
On the desk or table near her:
The Positive Pickle Jar is clearly visible
The jar is open
The lid is placed neatly beside the jar
The jar is filled with pickle affirmation cards
A few affirmation cards and pickle stickers are casually scattered on the surface
The product looks:
– Clean
– Friendly
– Premium
– Easy to recognize for commercial listing use

[— DAILY SETTING & ENVIRONMENT —]
A cozy indoor daytime setting such as:
– Home office
– Reading corner
– Desk near a window
Environment details:
Soft natural sunlight coming from a window
Neutral-toned books or notebooks
Simple work tools (pen, planner, laptop corner, or mug)
Minimal greenery for freshness
Color palette:
– Warm white
– Soft beige
– Light wood tones
– Fresh pickle green accents
Lighting:
– Bright natural daylight
– Soft, diffused shadows
– Clean, airy atmosphere
Depth of field:
– Shallow depth
– Background softly blurred
– No dramatic or artificial effects

[— HERO LISTING COMPOSITION —]
Horizontal composition
Standard commercial hero banner layout
Subject slightly off-center
Product fully visible and not cropped
Clean negative space on top or side for text overlay
Reserved text space (no text rendered):
Headline: "Positive Pickle Jar"
Subheadline: "60 Affirmation Cards for Daily Encouragement"

[— STYLE & TECHNICAL QUALITY —]
High-end lifestyle product photography
Daily wellness / self-care gift advertising style
Shot on 50mm lens, f/1.8
Sharp focus on hand and affirmation card
Natural skin tones
Clean, realistic color grading
Ultra high resolution, 4K–8K
Calm, joyful, emotionally comforting

[— NEGATIVE PROMPTS —]
No watermark
No Valentine elements
No hearts, roses, ribbons, or candles
No heavy makeup
No dark or dramatic lighting
No clutter
No harsh shadows
No exaggerated facial expressions
No visible brand logos other than the product
`;

// --- ARRAY DEFINITIONS (CRITICAL: DO NOT MIX THESE UP) ---

const LISTING_TEMPLATES = [
  SCENE_1_LISTING_REF, // Hero & Included
  SCENE_2_LISTING_REF, // 3-Step Ritual
  SCENE_3_LISTING_REF, // Knolling / What's Included
  SCENE_4_LISTING_REF, // Gifts For Everyone (Collage)
  SCENE_5_LISTING_REF, // Decoration / Lifestyle Grid
  SCENE_6_LISTING_REF  // Comparison
];

const APLUS_TEMPLATES = [
  SCENE_1_APLUS_REF, // Daily Hero (Vietnamese)
  SCENE_2_APLUS_REF, // 3 Simple Steps Infographic
  SCENE_3_APLUS_REF, // Daily Encouragement Banner (Custom)
  SCENE_4_APLUS_REF, // Daily Product Anatomy
  SCENE_5_APLUS_REF  // Daily Hero Listing Image (Custom - Woman with Card)
];

// Helper để tạo template mặc định
const getTemplates = (context: ProductContext): Scene[] => {
  if (context === 'LISTING') {
    return [
      { id: 1, title: 'HERO & INCLUDED', prompt: 'Ảnh Hero Shot Listing: Text bên trái "A DAILY DOSE OF POSITIVITY". Lọ sản phẩm (1.3) và Hộp (1.2) cao bằng nhau trên bàn gỗ sồi, ánh nắng tự nhiên, các thẻ nhỏ 2 inch rải rác. KHÔNG CÓ THANK YOU CARD.' },
      { id: 2, title: 'HOW TO USE / RITUAL', prompt: 'Infographic 3 bước hướng dẫn sử dụng: Mở lọ, Rút thẻ, Đọc và Mỉm cười.' },
      { id: 3, title: 'WHAT\'S INCLUDED / KNOLLING', prompt: 'Ảnh sắp xếp (Knolling) các thành phần: Lọ, Hộp, 60 thẻ, Card cảm ơn. Text nhãn phong cách hoạt hình, viết tay màu xanh.' },
      { id: 4, title: 'GIFTS FOR / COLLAGE', prompt: 'Collage 2x2: Quà tặng cho mọi người (Bạn bè, Đồng nghiệp, Học sinh, Bản thân). Nhấn mạnh kích thước nhỏ gọn 3.3 inch.' },
      { id: 5, title: 'DECORATION / LIFESTYLE GRID', prompt: 'Collage 2x2: Sản phẩm trang trí trong 4 không gian sống (Bàn làm việc, Phòng khách, Kệ sách, Đầu giường).' },
      { id: 6, title: 'WHY CHOOSE US / COMPARISON', prompt: 'Infographic so sánh "Why Choose Us": Cột trái "Our Positive Pickle" (đầy đủ hộp, lọ, thẻ đẹp), Cột phải "Others" (lọ trơn, không hộp). Các tiêu chí: Packaging, Content, Design, Quality.' },
    ];
  } else {
    return [
      { id: 1, title: 'A+ HERO BANNER', prompt: 'Ảnh Hero Shot cân đối: Lọ sản phẩm ở giữa, text tiêu đề phía trên, nắp mở, background bàn làm việc hiện đại, ánh sáng ấm.' },
      { id: 2, title: '3 STEPS RITUAL', prompt: 'Infographic 3 bước: Open Jar, Pick One, Read & Reset. Phong cách Amazon Clean.' },
      { id: 3, title: 'DAILY ENCOURAGEMENT BANNER', prompt: 'Banner quảng cáo Hero & Gallery: Người trẻ đọc thẻ tích cực, khung cảnh tươi sáng, gallery 3-4 ô khoảnh khắc.' },
      { id: 4, title: 'WHAT’S INSIDE / ANATOMY', prompt: 'Ảnh Anatomy 3 cột (Hộp, Lọ, Sticker) giải thích thành phần bộ quà tặng. Nền trung tính, text "WHAT’S INSIDE?".' },
      { id: 5, title: 'DAILY HERO LIFESTYLE', prompt: 'Ảnh Hero Lifestyle hàng ngày: Một người phụ nữ trẻ đang đọc thẻ tích cực trong không gian ấm cúng, sản phẩm nổi bật.' },
    ];
  }
};

const App: React.FC = () => {
  const [assets, setAssets] = useState<Assets>({});
  const [mainPrompt, setMainPrompt] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '16:9',
    quality: 'Standard',
    productContext: 'LISTING'
  });

  const [scenes, setScenes] = useState<Scene[]>(getTemplates('LISTING'));
  const [isSplitting, setIsSplitting] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);

  // Check valid API key existence
  const checkApiKeyRequirement = async (): Promise<boolean> => {
    // 1. Check LocalStorage
    const localKey = localStorage.getItem('gemini_api_key');
    if (localKey && localKey.trim()) return true;

    // 2. Check Environment Variable
    // Note: We access this safely to avoid crashes if env is missing
    const envKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    if (envKey) return true;

    // 3. No key found -> Open Settings and show alert
    setShowApiKeySettings(true);
    alert('⚠️ Bạn cần nhập API Key để sử dụng tính năng này!\nVui lòng nhập key trong bảng cài đặt vừa hiện ra.');
    return false;
  };

  const handleApiKeyChange = (key: string) => {
    console.log('API Key updated:', key ? 'Set' : 'Cleared');
  };

  const handleContextChange = async (newContext: ProductContext) => {
    if (settings.productContext === newContext) return;

    // 1. Force Immediate UI Switch: Update settings and reset global error
    setSettings(s => ({ ...s, productContext: newContext }));
    setGlobalError(null);

    // 2. Get the correct templates for the new context (5 for A+, 6 for Listing)
    const newTemplates = getTemplates(newContext);

    // Explicitly define templates based on the incoming newContext argument
    // to avoid any closure staleness or state ambiguity
    const targetTemplates = newContext === 'LISTING' ? LISTING_TEMPLATES : APLUS_TEMPLATES;

    // AI SUGGEST condition
    if (assets.product && assets.sticker && assets.stickerBack && assets.box) {
      // 3. Optimistic Update: Show the NEW structure immediately with loading indicators
      // IMPORTANT: Explicitly clear the prompt to "..." to prevent old text from lingering visually if state update lags
      setScenes(newTemplates.map(s => ({ ...s, isSuggesting: true, prompt: "Đang tạo prompt mới..." })));

      await checkApiKeyRequirement();

      try {
        const newPrompts = await generatePromptsFromAssets(assets, newContext, targetTemplates);

        const mergedScenes = newTemplates.map(template => {
          const found = newPrompts.find(p => p.id === template.id);
          return found
            ? { ...template, prompt: found.prompt, isSuggesting: false }
            : { ...template, isSuggesting: false };
        });

        setScenes(mergedScenes);
      } catch (e) {
        console.error("Auto-suggest failed", e);
        // On error, just revert to the clean templates without loading spinners
        setScenes(newTemplates);
        setGlobalError("Không thể tự động gợi ý prompt, đã về mặc định.");
      }
    } else {
      // Normal switch without assets
      setScenes(newTemplates);
    }
  };

  const handleAssetUpload = async (key: keyof Assets, asset: AssetData) => {
    const newAssets = { ...assets, [key]: asset };
    setAssets(newAssets);

    // AI SUGGEST trigger: Lid is optional.
    if (newAssets.product && newAssets.sticker && newAssets.stickerBack && newAssets.box) {
      await checkApiKeyRequirement();
      setScenes(prev => prev.map(s => ({ ...s, isSuggesting: true })));
      try {
        const templates = settings.productContext === 'LISTING' ? LISTING_TEMPLATES : APLUS_TEMPLATES;
        const newPrompts = await generatePromptsFromAssets(newAssets, settings.productContext, templates);
        setScenes(prev => prev.map(s => {
          const found = newPrompts.find(p => p.id === s.id);
          return found ? { ...s, prompt: found.prompt, isSuggesting: false } : { ...s, isSuggesting: false };
        }));
      } catch (e) {
        setScenes(prev => prev.map(s => ({ ...s, isSuggesting: false })));
        setGlobalError("Không thể tự động tạo prompt.");
      }
    }
  };

  const handleSplit = async () => {
    setGlobalError(null);
    if (!mainPrompt.trim()) {
      setGlobalError("Vui lòng nhập nội dung kịch bản");
      return;
    }
    setIsSplitting(true);
    await checkApiKeyRequirement();

    try {
      // Pass the correct template set to the service
      const templates = settings.productContext === 'LISTING' ? LISTING_TEMPLATES : APLUS_TEMPLATES;
      const newScenes = await splitPromptIntoScenes(mainPrompt, assets, settings.productContext, templates);
      setScenes(newScenes);
    } catch (error: any) {
      setGlobalError("Lỗi khi phân tích kịch bản.");
    } finally {
      setIsSplitting(false);
    }
  };

  const handleUpdateScenePrompt = (id: number, newPrompt: string) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, prompt: newPrompt } : s));
  };

  const handleSuggestPrompt = async (id: number) => {
    // Lid is NOT required here anymore.
    if (!assets.product || !assets.sticker || !assets.stickerBack || !assets.box) {
      alert("Vui lòng Upload các tài nguyên chính (Lọ, Sticker trước, Sticker sau, Hộp) để AI có thể gợi ý.");
      return;
    }
    await checkApiKeyRequirement();
    setScenes(prev => prev.map(s => s.id === id ? { ...s, isSuggesting: true } : s));
    try {
      let suggestedPrompt = "";
      if (settings.productContext === 'LISTING') {
        suggestedPrompt = await generateProductTailoredPrompt(assets, LISTING_TEMPLATES[id - 1] || "Premium product scene", 'LISTING');
      } else {
        suggestedPrompt = await generateProductTailoredPrompt(assets, APLUS_TEMPLATES[id - 1] || "Premium A+ Brand scene", 'CONTENT_A_PLUS');
      }
      setScenes(prev => prev.map(s => s.id === id ? { ...s, prompt: suggestedPrompt, isSuggesting: false } : s));
    } catch (error: any) {
      setScenes(prev => prev.map(s => s.id === id ? { ...s, isSuggesting: false } : s));
    }
  };

  const handleGenerateImage = async (id: number, refinementInstruction?: string) => {
    const sceneToUpdate = scenes.find(s => s.id === id);
    if (!sceneToUpdate) return;
    await checkApiKeyRequirement();
    setScenes(prev => prev.map(s => s.id === id ? { ...s, isGenerating: true, error: undefined } : s));

    // Determine if we are Editing or Generating Fresh.
    // IF refinementInstruction is provided, it is an EDIT/FIX action.
    // IF NOT, it is a REGENERATE/NEW action (Text-to-Image), ignoring previous image.
    const isEditing = !!refinementInstruction;

    try {
      const url = await generateSceneImage(sceneToUpdate, assets, settings, isEditing, refinementInstruction);
      setScenes(prev => prev.map(s => s.id === id ? { ...s, imageUrl: url, isGenerating: false, error: undefined } : s));
    } catch (error: any) {
      setScenes(prev => prev.map(s => s.id === id ? { ...s, isGenerating: false, error: "Lỗi tạo hình ảnh" } : s));
    }
  };

  const handleGenerateAll = async () => {
    if (scenes.length === 0) return;
    setIsGeneratingAll(true);
    await checkApiKeyRequirement();
    for (const scene of scenes) {
      // Generate All is always Fresh Generation
      await handleGenerateImage(scene.id);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    setIsGeneratingAll(false);
  };

  const downloadImage = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `STORYBOARD_${title.substring(0, 20).replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    if (confirm("Bạn có chắc muốn làm mới toàn bộ?")) {
      setScenes(getTemplates(settings.productContext));
      setMainPrompt('');
      setAssets({});
      setGlobalError(null);
    }
  };



  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 overflow-hidden relative">
      <ApiKeySettings
        onApiKeyChange={handleApiKeyChange}
        showSettings={showApiKeySettings}
        onToggleSettings={() => setShowApiKeySettings(!showApiKeySettings)}
      />
      {zoomedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-fade-in" onClick={() => setZoomedImage(null)}>
          <button className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-[110]" onClick={() => setZoomedImage(null)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={zoomedImage} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scale-up" alt="Zoomed" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <aside className="w-80 flex flex-col border-r border-white/5 sidebar-gradient shrink-0 shadow-2xl z-10 overflow-hidden">
        <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 group cursor-default">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/30">V</div>
              <div>
                <h1 className="text-sm font-black tracking-[0.25em] uppercase leading-none">Visionary</h1>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Studio Suite</p>
              </div>
            </div>
            <button onClick={resetAll} className="p-2 hover:bg-slate-800 rounded-lg text-slate-600 hover:text-slate-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

          <div className="space-y-10 flex-1">
            <section>
              <h2 className="text-[10px] font-black uppercase text-slate-400 mb-5 tracking-[0.2em] flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                1. Upload Sản Phẩm
              </h2>
              <div className="space-y-4">
                <AssetUploader label="1. Lọ" id="p" onUpload={(a) => handleAssetUpload('product', a)} preview={assets.product?.data} onZoom={(url) => setZoomedImage(url)} />
                <AssetUploader label="2. Nắp lọ" id="l" optional onUpload={(a) => handleAssetUpload('lid', a)} preview={assets.lid?.data} onZoom={(url) => setZoomedImage(url)} />
                <AssetUploader label="3. Sticker/Card trước" id="s_front" onUpload={(a) => handleAssetUpload('sticker', a)} preview={assets.sticker?.data} onZoom={(url) => setZoomedImage(url)} />
                <AssetUploader label="4. Sticker/Card sau" id="s_back" onUpload={(a) => handleAssetUpload('stickerBack', a)} preview={assets.stickerBack?.data} onZoom={(url) => setZoomedImage(url)} />
                <AssetUploader label="5. Vỏ hộp" id="b" onUpload={(a) => handleAssetUpload('box', a)} preview={assets.box?.data} onZoom={(url) => setZoomedImage(url)} />
                <AssetUploader label="6. Thank You Card" id="ty" optional onUpload={(a) => handleAssetUpload('thankYouCard', a)} preview={assets.thankYouCard?.data} onZoom={(url) => setZoomedImage(url)} />
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <label className="block text-[9px] font-black text-slate-500 mb-3 uppercase tracking-widest">2. Chọn Loại Nội Dung</label>
                <div className="flex gap-2">
                  {(['LISTING', 'CONTENT_A_PLUS'] as ProductContext[]).map((ctx) => (
                    <button
                      key={ctx}
                      onClick={() => handleContextChange(ctx)}
                      className={`flex-1 py-3 text-[9px] font-black rounded-xl border transition-all uppercase tracking-wider
                        ${settings.productContext === ctx ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_20px_rgba(79,70,229,0.1)]' : 'bg-slate-900 border-white/5 text-slate-500 hover:bg-slate-800 hover:border-white/10'}`}
                    >
                      {ctx === 'CONTENT_A_PLUS' ? 'A+ Content (5)' : 'Listing (6)'}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                  3. Ý Tưởng (AI)
                </h2>
                {globalError && <span className="text-[9px] text-rose-500 font-black uppercase">{globalError}</span>}
              </div>
              <textarea
                className="w-full h-24 bg-slate-900/50 border border-white/5 rounded-xl p-4 text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all placeholder:text-slate-700 leading-relaxed"
                placeholder="Nhập ý tưởng (VD: Bộ quà tặng giáng sinh cho trẻ em)... Nhấn Enter để tạo kịch bản."
                value={mainPrompt}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSplit();
                  }
                }}
                onChange={(e) => setMainPrompt(e.target.value)}
              />
              <button
                onClick={handleSplit}
                disabled={isSplitting || !mainPrompt}
                className="w-full mt-3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 disabled:opacity-30"
              >
                {isSplitting ? "Đang viết..." : `AI Viết kịch bản (${settings.productContext === 'LISTING' ? 6 : 5} Cảnh)`}
              </button>
            </section>

            <section>
              <h2 className="text-[10px] font-black uppercase text-slate-400 mb-5 tracking-[0.2em] flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                4. Thông số
              </h2>
              <div className="mb-6">
                <label className="block text-[9px] font-black text-slate-600 mb-2 uppercase tracking-widest">Tỷ lệ khung hình</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1:1', '4:3', '16:9', '9:16', '3:4'] as AspectRatio[]).map((r) => (
                    <button key={r} onClick={() => setSettings(s => ({ ...s, aspectRatio: r }))} className={`py-2 text-[10px] font-black rounded-lg border transition-all ${settings.aspectRatio === r ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/10'}`}>{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-600 mb-2 uppercase tracking-widest">Chất lượng Render</label>
                <div className="flex gap-2">
                  {(['Standard', 'High'] as Quality[]).map((q) => (
                    <button key={q} onClick={() => setSettings(s => ({ ...s, quality: q }))} className={`flex-1 py-2 text-[10px] font-black rounded-lg border transition-all ${settings.quality === q ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500'}`}>{q === 'Standard' ? 'Tiêu chuẩn' : 'Cao cấp'}</button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="pt-8 pb-4 mt-auto">
            <button onClick={handleGenerateAll} disabled={isGeneratingAll || scenes.length === 0} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-indigo-600/20 border border-indigo-500/50">
              {isGeneratingAll ? "Đang khởi tạo toàn bộ..." : "Tạo toàn bộ ảnh"}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#020617] relative custom-scrollbar">
        <div className="max-w-7xl mx-auto p-12">
          <header className="mb-14 border-b border-white/5 pb-8 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">Storyboard</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Sản xuất nội dung thị giác</p>
            </div>
            <div className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
              {scenes.length > 0 ? `${scenes.filter(s => s.imageUrl).length} / ${scenes.length} Hoàn tất` : 'Sẵn sàng'}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-20">
            {scenes.map((scene) => (
              <StoryboardCard
                key={`${settings.productContext}-${scene.id}`}
                scene={scene}
                onRegenerate={handleGenerateImage}
                onDownload={downloadImage}
                onUpdatePrompt={handleUpdateScenePrompt}
                onZoom={(url) => setZoomedImage(url)}
                showSuggestBtn={true}
                onSuggestPrompt={handleSuggestPrompt}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
