/**
 * MediPharm GPP - Hệ Thống Nhà Thuốc & Vật Tư Y Tế Chuẩn Quốc Tế
 * Mock Database: 16+ Sản Phẩm Chuẩn Y Khoa & Dược Điển Việt Nam
 * (Cập nhật đường dẫn hình ảnh thực tế lưu trữ trong thư mục Images/)
 */

const CATEGORIES = [
  { id: 'all', name: 'Tất cả sản phẩm', icon: 'fa-cubes' },
  { id: 'otc', name: 'Thuốc không kê đơn (OTC)', icon: 'fa-pills' },
  { id: 'rx', name: 'Thuốc kê đơn (Rx)', icon: 'fa-file-prescription' },
  { id: 'supplements', name: 'Thực phẩm chức năng', icon: 'fa-heart-pulse' },
  { id: 'devices', name: 'Thiết bị y tế gia đình', icon: 'fa-stethoscope' },
  { id: 'first-aid', name: 'Vật tư & Sơ cứu vết thương', icon: 'fa-kit-medical' },
  { id: 'personal-care', name: 'Chăm sóc cá nhân & Vệ sinh', icon: 'fa-shield-halved' }
];

const SYMPTOM_TAGS = [
  { id: 'fever-cold', label: 'Cảm sốt & Đau đầu' },
  { id: 'cough-throat', label: 'Ho & Đau họng' },
  { id: 'digestion', label: 'Đau dạ dày & Tiêu hóa' },
  { id: 'joints', label: 'Cơ xương khớp' },
  { id: 'allergy', label: 'Dị ứng & Mẩn ngứa' },
  { id: 'immunity', label: 'Tăng đề kháng & Vitamin' },
  { id: 'blood-pressure', label: 'Huyết áp & Tim mạch' },
  { id: 'first-aid-care', label: 'Sơ cứu & Vết thương' },
];

const PRODUCTS = [
  // 1. Panadol Extra (OTC)
  {
    id: 'prod-01',
    name: 'Panadol Extra Giảm Đau Hạ Sốt',
    strength: '500mg / 65mg',
    activeIngredient: 'Paracetamol 500mg, Caffeine 65mg',
    category: 'otc',
    classification: 'otc',
    targetAudience: 'adults',
    origin: 'Việt Nam (GSK - Anh Quốc)',
    regNumber: 'VD-28491-17',
    packageSpec: 'Hộp 15 vỉ x 12 viên nén',
    manufacturer: 'Công ty TNHH Sanofi-Aventis Việt Nam / GSK',
    image: 'Images/prod-01.jpg',
    description: 'Giảm đau từ nhẹ đến vừa: đau đầu, đau nửa đầu, đau cơ gân, đau họng, đau răng, sốt sau tiêm hoặc do cảm cúm.',
    symptoms: ['fever-cold', 'cough-throat'],
    inStock: 120,
    rating: 4.9,
    reviewsCount: 380,
    units: [
      { unit: 'Viên', factor: 1, price: 1500, originalPrice: 1800 },
      { unit: 'Vỉ', factor: 12, price: 17000, originalPrice: 20000 },
      { unit: 'Hộp', factor: 180, price: 235000, originalPrice: 260000 }
    ],
    defaultUnit: 'Hộp',
    pharmacology: {
      indication: 'Điều trị các cơn đau từ nhẹ đến vừa như đau đầu, đau cơ, sốt do cảm cúm, đau sau phẫu thuật nhỏ.',
      dosage: 'Người lớn và trẻ em từ 12 tuổi trở lên: 1 - 2 viên mỗi 4 - 6 giờ. Không dùng quá 8 viên trong 24 giờ.',
      contraindication: 'Mẫn cảm với paracetamol hoặc caffeine. Bệnh nhân suy gan hoặc suy thận nặng. Trẻ em dưới 12 tuổi.',
      warning: 'Không uống rượu bia khi dùng thuốc. Không dùng chung với các thuốc khác chứa Paracetamol.',
      storage: 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp, nhiệt độ dưới 30°C.'
    }
  },

  // 2. Efferalgan 500mg Sủi (OTC)
  {
    id: 'prod-02',
    name: 'Efferalgan 500mg Viên Sủi Giảm Đau',
    strength: '500mg',
    activeIngredient: 'Paracetamol 500mg',
    category: 'otc',
    classification: 'otc',
    targetAudience: 'adults',
    origin: 'Pháp (UPSA SAS)',
    regNumber: 'VN-21950-19',
    packageSpec: 'Hộp 4 vỉ x 4 viên sủi',
    manufacturer: 'UPSA SAS - Pháp',
    image: 'Images/prod-02.jpg',
    description: 'Thuốc viên sủi hòa tan nhanh trong nước, hấp thu nhanh, hiệu quả giảm đau hạ sốt chỉ sau 15-20 phút.',
    symptoms: ['fever-cold'],
    inStock: 85,
    rating: 4.95,
    reviewsCount: 290,
    units: [
      { unit: 'Viên', factor: 1, price: 4500, originalPrice: 5000 },
      { unit: 'Vỉ', factor: 4, price: 17500, originalPrice: 20000 },
      { unit: 'Hộp', factor: 16, price: 68000, originalPrice: 78000 }
    ],
    defaultUnit: 'Hộp',
    pharmacology: {
      indication: 'Hạ sốt nhanh, giảm các cơn đau vừa và nhẹ: đau đầu, đau răng, nhức mỏi cơ thể khi sốt.',
      dosage: 'Người lớn: 1 - 2 viên hòa tan hoàn toàn vào 1 cốc nước (200ml), uống mỗi 4-6 giờ. Tối đa 6 viên/ngày.',
      contraindication: 'Bệnh gan tiến triển, suy tế bào gan nặng. Bệnh nhân kiêng muối nghiêm ngặt (do có ion Natri trong viên sủi).',
      warning: 'Chờ viên sủi tan hoàn toàn mới uống. Không nuốt trực tiếp cả viên thuốc.',
      storage: 'Để nơi khô ráo, đậy kín sau khi lấy thuốc, nhiệt độ dưới 25°C.'
    }
  },

  // 3. Siro Ho Thảo Dược Prospan (OTC)
  {
    id: 'prod-03',
    name: 'Siro Ho Thảo Dược Prospan Đức',
    strength: 'Chai 100ml',
    activeIngredient: 'Cao khô lá thường xuân (Hederae helicis folii extractum siccum) 0.7g/100ml',
    category: 'otc',
    classification: 'otc',
    targetAudience: 'children',
    origin: 'Đức (Engelhard Arzneimittel)',
    regNumber: 'VN-17937-14',
    packageSpec: 'Chai thủy tinh 100ml kèm cốc đong',
    manufacturer: 'Engelhard Arzneimittel GmbH & Co. KG',
    image: 'Images/prod-03.jpg',
    description: 'Chiết xuất lá thường xuân đặc chế, trị viêm đường hô hấp cấp có kèm ho, làm lỏng đờm, chống co thắt phế quản an toàn cho trẻ sơ sinh.',
    symptoms: ['cough-throat'],
    inStock: 95,
    rating: 4.92,
    reviewsCount: 450,
    units: [
      { unit: 'Chai', factor: 1, price: 215000, originalPrice: 245000 },
      { unit: 'Hộp 2 Chai', factor: 2, price: 410000, originalPrice: 470000 }
    ],
    defaultUnit: 'Chai',
    pharmacology: {
      indication: 'Viêm đường hô hấp cấp có kèm ho. Điều trị triệu chứng trong các bệnh lý viêm phế quản mạn tính.',
      dosage: 'Trẻ sơ sinh - 5 tuổi: 2.5ml x 3 lần/ngày. Trẻ 6 - 9 tuổi: 5ml x 3 lần/ngày. Người lớn: 5 - 7.5ml x 3 lần/ngày.',
      contraindication: 'Bệnh nhân bất dung nạp fructose bẩm sinh.',
      warning: 'Lắc kỹ trước khi sử dụng. Dùng cốc định liều kèm theo.',
      storage: 'Bảo quản nhiệt độ dưới 25°C. Đóng nắp kín sau khi mở, dùng trong vòng 3 tháng kể từ ngày mở nắp.'
    }
  },

  // 4. Gaviscon Dual Action (OTC)
  {
    id: 'prod-04',
    name: 'Hỗn Dịch Uống Gaviscon Dual Action',
    strength: 'Gói 10ml',
    activeIngredient: 'Natri alginat, Natri bicarbonat, Calci carbonat',
    category: 'otc',
    classification: 'otc',
    targetAudience: 'adults',
    origin: 'Anh Quốc (Reckitt Benckiser)',
    regNumber: 'VN-19823-16',
    packageSpec: 'Hộp 24 gói x 10ml',
    manufacturer: 'Reckitt Benckiser Healthcare (UK) Ltd',
    image: 'Images/prod-04.png',
    description: 'Tạo lớp màng bảo vệ ngăn trào ngược axit dạ dày thực quản, giảm nhanh cảm giác ợ nóng, ợ chua và khó tiêu do thừa axit.',
    symptoms: ['digestion'],
    inStock: 60,
    rating: 4.88,
    reviewsCount: 210,
    units: [
      { unit: 'Gói', factor: 1, price: 7500, originalPrice: 8500 },
      { unit: 'Hộp', factor: 24, price: 168000, originalPrice: 195000 }
    ],
    defaultUnit: 'Hộp',
    pharmacology: {
      indication: 'Điều trị các triệu chứng trào ngược dạ dày - thực quản: ợ nóng, ợ chua, đau sau xương ức, khó tiêu do dư axit.',
      dosage: 'Người lớn và trẻ em từ 12 tuổi trở lên: 1 - 2 gói (10 - 20ml) sau bữa ăn và trước khi đi ngủ (tối đa 4 lần/ngày).',
      contraindication: 'Quá mẫn cảm với bất kỳ thành phần nào của thuốc.',
      warning: 'Nên dùng cách xa các thuốc khác ít nhất 2 giờ vì thuốc có thể làm giảm hấp thu các thuốc khác.',
      storage: 'Bảo quản dưới 30°C, không để trong tủ lạnh hoặc làm đông đá.'
    }
  },

  // 5. Berberin Clorid 100mg (OTC)
  {
    id: 'prod-05',
    name: 'Berberin Clorid 100mg Trị Tiêu Chảy',
    strength: '100mg',
    activeIngredient: 'Berberin clorid 100mg',
    category: 'otc',
    classification: 'otc',
    targetAudience: 'adults',
    origin: 'Việt Nam (Dược Phẩm OPC)',
    regNumber: 'VD-24510-16',
    packageSpec: 'Lọ 100 viên bao phim',
    manufacturer: 'Công ty Cổ phần Dược phẩm OPC',
    image: 'Images/prod-05.jpg',
    description: 'Kháng khuẩn đường ruột từ thảo dược thiên nhiên, điều trị viêm ruột, kiết lỵ, tiêu chảy do nhiễm trùng thức ăn an toàn.',
    symptoms: ['digestion'],
    inStock: 140,
    rating: 4.85,
    reviewsCount: 310,
    units: [
      { unit: 'Viên', factor: 1, price: 800, originalPrice: 1000 },
      { unit: 'Lọ 100 Viên', factor: 100, price: 65000, originalPrice: 75000 }
    ],
    defaultUnit: 'Lọ 100 Viên',
    pharmacology: {
      indication: 'Lỵ trực trùng, hội chứng lỵ, viêm ruột, tiêu chảy do ăn uống nhiễm khuẩn.',
      dosage: 'Người lớn: 2 - 4 viên/lần, ngày 2 lần. Trẻ em từ 8 tuổi: 1 - 2 viên/lần, ngày 2 lần.',
      contraindication: 'Phụ nữ có thai (tuyệt đối không dùng vì có thể gây co bóp tử cung).',
      warning: 'Thận trọng với người có tiền sử dị ứng với berberin.',
      storage: 'Nơi khô mát, nhiệt độ không quá 30°C, tránh ánh sáng.'
    }
  },

  // 6. Thuốc Nhỏ Mắt V.Rohto Kháng Khuẩn (OTC)
  {
    id: 'prod-06',
    name: 'Thuốc Nhỏ Mắt V.Rohto Antibacterial',
    strength: 'Chai 13ml',
    activeIngredient: 'Sodium Chondroitin Sulfate, Dipotassium Glycyrrhizinate',
    category: 'otc',
    classification: 'otc',
    targetAudience: 'adults',
    origin: 'Nhật Bản (Rohto Mentholatum)',
    regNumber: 'VD-21045-14',
    packageSpec: 'Chai 13ml',
    manufacturer: 'Công ty TNHH Rohto-Mentholatum Việt Nam',
    image: 'Images/prod-06.jpg',
    description: 'Chống viêm, kháng khuẩn điều trị lẹo mắt, viêm kết mạc, viêm mí mắt, xoa dịu ngứa và đỏ mắt tức thì.',
    symptoms: ['allergy'],
    inStock: 110,
    rating: 4.9,
    reviewsCount: 180,
    units: [
      { unit: 'Chai 13ml', factor: 1, price: 54000, originalPrice: 62000 }
    ],
    defaultUnit: 'Chai 13ml',
    pharmacology: {
      indication: 'Lẹo mắt, viêm kết mạc (đau mắt đỏ), viêm mí mắt, ngứa mắt do khói bụi hoặc bơi lội.',
      dosage: 'Nhỏ mắt 2 - 3 giọt/lần, 5 - 6 lần/ngày.',
      contraindication: 'Tiền sử dị ứng với thuốc nhỏ mắt có chứa kháng sinh nhóm Sulfamid.',
      warning: 'Không để mi mắt chạm vào đầu vòi nhỏ thuốc để tránh nhiễm trùng dung dịch.',
      storage: 'Vặn chặt nắp sau khi dùng, bảo quản nơi thoáng mát dưới 30°C.'
    }
  },

  // 7. Kháng Sinh Augmentin 1g (Rx - Kê Đơn)
  {
    id: 'prod-07',
    name: 'Kháng Sinh Augmentin 1g (Amoxicillin/Clavulanate)',
    strength: '1000mg (875mg / 125mg)',
    activeIngredient: 'Amoxicillin 875mg, Acid clavulanic 125mg',
    category: 'rx',
    classification: 'rx',
    targetAudience: 'adults',
    origin: 'Pháp (Glaxo Wellcome Production)',
    regNumber: 'VN-19543-16',
    packageSpec: 'Hộp 2 vỉ x 7 viên nén bao phim',
    manufacturer: 'Glaxo Wellcome Production - Pháp',
    image: 'Images/prod-07.jpg',
    description: 'Kháng sinh phổ rộng trị nhiễm khuẩn đường hô hấp trên và dưới, viêm xoang, viêm amidan, nhiễm trùng tiết niệu và da. (Cần đơn thuốc của bác sĩ).',
    symptoms: ['cough-throat', 'fever-cold'],
    inStock: 50,
    rating: 4.96,
    reviewsCount: 160,
    units: [
      { unit: 'Viên', factor: 1, price: 18000, originalPrice: 20000 },
      { unit: 'Vỉ', factor: 7, price: 120000, originalPrice: 135000 },
      { unit: 'Hộp 14 Viên', factor: 14, price: 235000, originalPrice: 260000 }
    ],
    defaultUnit: 'Hộp 14 Viên',
    pharmacology: {
      indication: 'Nhiễm khuẩn đường hô hấp trên (viêm xoang, viêm tai giữa, viêm amidan tái phát), hô hấp dưới (viêm phế quản mạn, viêm phổi), nhiễm trùng tiết niệu.',
      dosage: 'Người lớn và trẻ em trên 40kg: 1 viên 1g x 2 lần/ngày. Uống ngay trước bữa ăn để giảm thiểu khó chịu đường tiêu hóa.',
      contraindication: 'Tiền sử dị ứng kháng sinh nhóm Penicillin hoặc Cephalosporin. Bệnh nhân có tiền sử vàng da tắc mật liên quan đến Amoxicillin.',
      warning: 'Thuốc kê đơn (Rx) - Bắt buộc phải có chỉ định của Bác sĩ. Phải dùng đủ liệu trình 5 - 7 ngày để tránh vi khuẩn kháng thuốc.',
      storage: 'Bảo quản trong bao bì gốc ở nhiệt độ dưới 25°C, tránh ẩm.'
    }
  },

  // 8. Thuốc Huyết Áp Amlodipin 5mg (Rx - Kê Đơn)
  {
    id: 'prod-08',
    name: 'Amlodipin 5mg Điều Trị Tăng Huyết Áp',
    strength: '5mg',
    activeIngredient: 'Amlodipin besylat 5mg',
    category: 'rx',
    classification: 'rx',
    targetAudience: 'elderly',
    origin: 'Việt Nam (Dược Hậu Giang - DHG Pharma)',
    regNumber: 'VD-22340-15',
    packageSpec: 'Hộp 3 vỉ x 10 viên nén',
    manufacturer: 'Công ty Cổ phần Dược Hậu Giang',
    image: 'Images/prod-08.png',
    description: 'Thuốc chẹn kênh canxi điều trị tăng huyết áp vô căn và cơn đau thắt ngực ổn định mạn tính. (Cần bác sĩ kê đơn).',
    symptoms: ['blood-pressure'],
    inStock: 75,
    rating: 4.89,
    reviewsCount: 140,
    units: [
      { unit: 'Viên', factor: 1, price: 1500, originalPrice: 1800 },
      { unit: 'Vỉ 10 Viên', factor: 10, price: 14000, originalPrice: 17000 },
      { unit: 'Hộp 30 Viên', factor: 30, price: 39000, originalPrice: 48000 }
    ],
    defaultUnit: 'Hộp 30 Viên',
    pharmacology: {
      indication: 'Điều trị tăng huyết áp đơn trị liệu hoặc kết hợp với các thuốc hạ áp khác; điều trị đau thắt ngực ổn định.',
      dosage: 'Liều khởi đầu thông thường: 5mg x 1 lần/ngày. Bác sĩ có thể tăng liều tối đa lên 10mg/ngày tùy đáp ứng của bệnh nhân.',
      contraindication: 'Hạ huyết áp nghiêm trọng, sốc tim, hẹp van động mạch chủ nặng, suy tim không ổn định sau nhồi máu cơ tim cấp.',
      warning: 'Thuốc kê đơn (Rx) - Theo dõi huyết áp định kỳ. Không tự ý ngưng thuốc đột ngột.',
      storage: 'Bảo quản nơi khô ráo, nhiệt độ dưới 30°C.'
    }
  },

  // 9. Thuốc Mỡ Kháng Viêm Fucidin H (Rx - Kê Đơn)
  {
    id: 'prod-09',
    name: 'Thuốc Mỡ Bôi Da Fucidin H Kháng Viêm',
    strength: 'Tuýp 15g',
    activeIngredient: 'Acid fusidic 2%, Hydrocortisone acetate 1%',
    category: 'rx',
    classification: 'rx',
    targetAudience: 'adults',
    origin: 'Ireland (LEO Laboratories)',
    regNumber: 'VN-18231-14',
    packageSpec: 'Tuýp nhôm 15g',
    manufacturer: 'LEO Pharma / LEO Laboratories Ltd',
    image: 'Images/prod-09.png',
    description: 'Kết hợp kháng sinh Acid fusidic và Hydrocortisone kháng viêm điều trị chàm viêm da dị ứng có nhiễm trùng. (Thuốc kê đơn).',
    symptoms: ['allergy'],
    inStock: 45,
    rating: 4.93,
    reviewsCount: 95,
    units: [
      { unit: 'Tuýp 15g', factor: 1, price: 145000, originalPrice: 165000 }
    ],
    defaultUnit: 'Tuýp 15g',
    pharmacology: {
      indication: 'Viêm da dị ứng, viêm da tiếp xúc, chàm có nghi ngờ hoặc xác định có nhiễm trùng thứ phát nhạy cảm với acid fusidic.',
      dosage: 'Bôi một lượng nhỏ lên vùng da bị tổn thương 2 lần/ngày cho đến khi đạt hiệu quả điều trị (không quá 2 tuần).',
      contraindication: 'Nhiễm trùng da do virus (Herpes, thủy đậu), nhiễm nấm da, bệnh lao da hoặc giang mai.',
      warning: 'Thuốc kê đơn (Rx) - Tránh bôi gần mắt, không bôi trên diện rộng kéo dài.',
      storage: 'Bảo quản dưới 30°C. Đậy nắp kín sau khi sử dụng.'
    }
  },

  // 10. Viên Sủi Berocca Energy Vitamin C 1000mg (TPCN)
  {
    id: 'prod-10',
    name: 'Viên Sủi Bổ Sung Năng Lượng Berocca Mango',
    strength: 'Tuýp 10 viên',
    activeIngredient: 'Vitamin C 500mg, Vitamin B-Complex, Kẽm, Magie',
    category: 'supplements',
    classification: 'otc',
    targetAudience: 'adults',
    origin: 'Indonesia (Bayer - Đức)',
    regNumber: 'DKSP-4921/2020/ĐKSP',
    packageSpec: 'Tuýp 10 viên sủi vị xoài cam',
    manufacturer: 'PT Bayer Indonesia',
    image: 'Images/prod-10.jpg',
    description: 'Bổ sung đầy đủ 8 loại vitamin nhóm B, vitamin C liều cao cùng khoáng chất kẽm & canxi giúp tỉnh táo tinh thần, giảm căng thẳng mệt mỏi.',
    symptoms: ['immunity'],
    inStock: 130,
    rating: 4.94,
    reviewsCount: 520,
    units: [
      { unit: 'Tuýp 10 Viên', factor: 1, price: 88000, originalPrice: 98000 },
      { unit: 'Hộp 2 Tuýp', factor: 2, price: 168000, originalPrice: 190000 }
    ],
    defaultUnit: 'Tuýp 10 Viên',
    pharmacology: {
      indication: 'Cung cấp năng lượng, hỗ trợ hệ thần kinh tỉnh táo, tăng cường miễn dịch cho người lao động trí óc căng thẳng, người đang hồi phục thể lực.',
      dosage: 'Người lớn: 1 viên/ngày hòa tan trong 200ml nước lọc, uống vào buổi sáng sau ăn.',
      contraindication: 'Người bị sỏi thận oxalate, người thừa canxi máu hoặc suy thận nặng.',
      warning: 'Sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.',
      storage: 'Đậy nắp thật chặt sau khi lấy viên sủi, để nơi khô ráo, tránh ánh sáng.'
    }
  },

  // 11. Dầu Cá Omega-3 Fish Oil Kirkland (TPCN)
  {
    id: 'prod-11',
    name: 'Viên Uống Dầu Cá Kirkland Signature Omega-3',
    strength: '1000mg / Lọ 400 viên',
    activeIngredient: 'Fish Oil 1000mg cung cấp EPA 180mg, DHA 120mg',
    category: 'supplements',
    classification: 'otc',
    targetAudience: 'elderly',
    origin: 'Mỹ (Kirkland Signature)',
    regNumber: 'DKSP-8214/2019/ĐKSP',
    packageSpec: 'Lọ lớn 400 viên nang mềm',
    manufacturer: 'Costco Wholesale Corporation - USA',
    image: 'Images/prod-11.png',
    description: 'Hỗ trợ sức khỏe tim mạch, giảm triglyceride máu, bổ mắt, nuôi dưỡng võng mạc và duy trì chức năng tuần hoàn não bộ người cao tuổi.',
    symptoms: ['blood-pressure', 'immunity'],
    inStock: 70,
    rating: 4.97,
    reviewsCount: 680,
    units: [
      { unit: 'Chiết 60 Viên', factor: 60, price: 95000, originalPrice: 115000 },
      { unit: 'Lọ 400 Viên', factor: 400, price: 485000, originalPrice: 560000 }
    ],
    defaultUnit: 'Lọ 400 Viên',
    pharmacology: {
      indication: 'Bảo vệ tim mạch, hỗ trợ giảm mỡ máu, cải thiện thị lực cho mắt mờ mỏi mệt, chống thoái hóa khớp.',
      dosage: 'Người lớn uống 1 - 2 viên/ngày sau bữa ăn chính.',
      contraindication: 'Dị ứng với cá biển hoặc hải sản.',
      warning: 'Sản phẩm không phải là thuốc, không thay thế thuốc hạ mỡ máu theo toa.',
      storage: 'Bảo quản nơi khô ráo, nhiệt độ dưới 25°C, tránh nhiệt độ cao làm chảy viên nang.'
    }
  },

  // 12. Men Vi Sinh Enterogermina 4 Tỷ Bào Tử (TPCN)
  {
    id: 'prod-12',
    name: 'Men Vi Sinh Enterogermina 4 Tỷ Bào Tử Lợi Khuẩn',
    strength: 'Ống 5ml / 4 tỷ CFU Bacillus clausii',
    activeIngredient: 'Bào tử Bacillus clausii kháng đa kháng sinh 4 tỷ',
    category: 'supplements',
    classification: 'otc',
    targetAudience: 'children',
    origin: 'Ý (Sanofi S.p.A)',
    regNumber: 'VN-18921-15',
    packageSpec: 'Hộp 20 ống nhựa x 5ml',
    manufacturer: 'Sanofi S.p.A - Italy',
    image: 'Images/prod-12.jpg',
    description: 'Cân bằng hệ vi sinh đường ruột, phục hồi đường ruột bị tổn thương sau khi dùng kháng sinh dài ngày, trị tiêu chảy và rối loạn tiêu hóa.',
    symptoms: ['digestion'],
    inStock: 105,
    rating: 4.96,
    reviewsCount: 410,
    units: [
      { unit: 'Ống 5ml', factor: 1, price: 16000, originalPrice: 18000 },
      { unit: 'Vỉ 5 Ống', factor: 5, price: 78000, originalPrice: 88000 },
      { unit: 'Hộp 20 Ống', factor: 20, price: 298000, originalPrice: 340000 }
    ],
    defaultUnit: 'Hộp 20 Ống',
    pharmacology: {
      indication: 'Điều trị và phòng ngừa rối loạn vi sinh vật đường ruột và bệnh lý kém hấp thu vitamin nội sinh; phục hồi hệ vi sinh sau dùng kháng sinh.',
      dosage: 'Người lớn: 1 ống 4 tỷ/ngày. Trẻ em: dùng theo chỉ định của bác sĩ/dược sĩ.',
      contraindication: 'Tiền sử dị ứng với bất kỳ thành phần nào của thuốc.',
      warning: 'Lắc kỹ ống trước khi uống. Uống trực tiếp hoặc hòa với sữa, nước đường, nước cam.',
      storage: 'Bảo quản ở nhiệt độ dưới 30°C.'
    }
  },

  // 13. Máy Đo Huyết Áp Bắp Tay Omron HEM-7120 (Thiết bị y tế)
  {
    id: 'prod-13',
    name: 'Máy Đo Huyết Áp Bắp Tay Tự Động Omron HEM-7120',
    strength: 'Model HEM-7120',
    activeIngredient: 'Công nghệ cảm biến Intellisense Nhật Bản',
    category: 'devices',
    classification: 'device',
    targetAudience: 'elderly',
    origin: 'Nhật Bản (Omron Healthcare)',
    regNumber: 'Số lưu hành: 190001890/PCBA-HN',
    packageSpec: 'Thân máy, vòng bít (22-32cm), 4 pin AA, hướng dẫn sử dụng',
    manufacturer: 'Omron Healthcare Manufacturing Vietnam / Nhật Bản',
    image: 'Images/prod-13.jpg',
    description: 'Máy đo huyết áp điện tử bắp tay chuẩn xác y khoa, báo quấn đúng vòng bít, cảnh báo tăng huyết áp và nhịp tim bất thường.',
    symptoms: ['blood-pressure'],
    inStock: 40,
    rating: 4.98,
    reviewsCount: 390,
    units: [
      { unit: 'Bộ Máy Hoàn Chỉnh', factor: 1, price: 830000, originalPrice: 990000 },
      { unit: 'Combo Máy + Bộ Đổi Nguồn AC', factor: 1, price: 990000, originalPrice: 1190000 }
    ],
    defaultUnit: 'Bộ Máy Hoàn Chỉnh',
    pharmacology: {
      indication: 'Tự theo dõi huyết áp tâm thu, huyết áp tâm trương và nhịp tim tại nhà cho bệnh nhân tim mạch, người lớn tuổi.',
      dosage: 'Nên đo vào cùng một thời điểm mỗi ngày (sáng sớm sau khi thức dậy hoặc buổi tối trước khi đi ngủ), ngồi nghỉ ngơi 5 phút trước khi đo.',
      contraindication: 'Không dùng cho người có vết thương hở lớn ở bắp tay.',
      warning: 'Bảo hành chính hãng 5 năm (1 đổi 1 trong 30 ngày nếu lỗi do nhà sản xuất).',
      storage: 'Tránh rơi vỡ, tránh ẩm ướt, tháo pin khi không sử dụng thời gian dài.'
    }
  },

  // 14. Nhiệt Kế Hồng Ngoại Đo Trán Microlife NC200 (Thiết bị y tế)
  {
    id: 'prod-14',
    name: 'Nhiệt Kế Hồng Ngoại Đo Trán Không Chạm Microlife NC200',
    strength: 'Model NC200',
    activeIngredient: 'Cảm biến nhiệt hồng ngoại Thụy Sĩ',
    category: 'devices',
    classification: 'device',
    targetAudience: 'children',
    origin: 'Thụy Sĩ (Microlife AG)',
    regNumber: 'Số lưu hành: 200000412/PCBA-HCM',
    packageSpec: 'Thân máy, túi đựng cao cấp, 2 pin AAA, HDSD',
    manufacturer: 'Microlife AG - Thụy Sĩ',
    image: 'Images/prod-14.jpg',
    description: 'Đo nhiệt độ cơ thể không chạm trong 1 giây từ khoảng cách 5cm, đèn nền đổi màu cảnh báo sốt đỏ, bộ nhớ 30 lần đo tiện lợi cho bé.',
    symptoms: ['fever-cold'],
    inStock: 55,
    rating: 4.95,
    reviewsCount: 280,
    units: [
      { unit: 'Cái', factor: 1, price: 920000, originalPrice: 1100000 }
    ],
    defaultUnit: 'Cái',
    pharmacology: {
      indication: 'Đo thân nhiệt trẻ em và người lớn không cần tiếp xúc, đo nhiệt độ bình sữa, nước tắm hoặc nhiệt độ phòng.',
      dosage: 'Đặt máy cách tâm trán 1 - 5 cm, máy tự động phát hiện khoảng cách và cho kết quả sau 1 giây.',
      contraindication: 'Không có.',
      warning: 'Bảo hành chính hãng 2 năm 1 đổi 1.',
      storage: 'Vệ sinh đầu đo bằng bông tẩm cồn nhẹ, để nơi khô ráo thoáng mát.'
    }
  },

  // 15. Hộp Khẩu Trang Y Tế 4 Lớp Kháng Khuẩn KF94 (Vật tư y tế)
  {
    id: 'prod-15',
    name: 'Khẩu Trang Y Tế 4 Lớp Kháng Khuẩn KF94 CareMax',
    strength: 'Hộp 30 chiếc',
    activeIngredient: 'Màng lọc Meltblown tĩnh điện lọc 99% bụi mịn PM2.5 & vi khuẩn',
    category: 'first-aid',
    classification: 'supply',
    targetAudience: 'adults',
    origin: 'Việt Nam',
    regNumber: '210000892/PCBA-HCM',
    packageSpec: 'Hộp 30 chiếc (từng túi zip riêng biệt)',
    manufacturer: 'Công ty Cổ phần Thiết bị Y tế CareMax',
    image: 'Images/prod-15.jpg',
    description: 'Thiết kế 4D ôm khít khuôn mặt, không dính son môi, màng lọc 4 lớp kháng khuẩn BFE >= 99% ngăn ngừa giọt bắn và khói bụi.',
    symptoms: ['allergy', 'fever-cold'],
    inStock: 300,
    rating: 4.9,
    reviewsCount: 820,
    units: [
      { unit: 'Gói 5 Chiếc', factor: 5, price: 18000, originalPrice: 22000 },
      { unit: 'Hộp 30 Chiếc', factor: 30, price: 85000, originalPrice: 105000 },
      { unit: 'Thùng 10 Hộp', factor: 300, price: 780000, originalPrice: 950000 }
    ],
    defaultUnit: 'Hộp 30 Chiếc',
    pharmacology: {
      indication: 'Bảo vệ đường hô hấp khỏi khói bụi, vi khuẩn, virus lây qua giọt bắn trong không khí khi đến bệnh viện, nơi đông người.',
      dosage: 'Sử dụng 1 lần/ngày hoặc thay mới khi khẩu trang bị ẩm/bẩn.',
      contraindication: 'Không dùng cho người khó thở nghiêm trọng khi đeo.',
      warning: 'Không giặt lại để tái sử dụng làm mất lớp lọc tĩnh điện.',
      storage: 'Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.'
    }
  },

  // 16. Băng Cá Nhân Vô Trùng Urgo Waterproof (Vật tư sơ cứu)
  {
    id: 'prod-16',
    name: 'Băng Gạc Cá Nhân Chống Nước Urgo Waterproof',
    strength: 'Hộp 20 miếng',
    activeIngredient: 'Gạc tẩm chất sát trùng Benzalkonium chloride, màng PU chống thấm nước',
    category: 'first-aid',
    classification: 'supply',
    targetAudience: 'adults',
    origin: 'Pháp (Laboratoires Urgo)',
    regNumber: '170001540/PCBA-HN',
    packageSpec: 'Hộp 20 miếng dán chống nước',
    manufacturer: 'Laboratoires Urgo - France',
    image: 'Images/prod-16.jpg',
    description: 'Băng gạc cá nhân trong suốt, chống thấm nước tuyệt đối khi tắm rửa hoặc bơi lội, bảo vệ vết thương trầy xước không bị nhiễm trùng.',
    symptoms: ['first-aid-care'],
    inStock: 180,
    rating: 4.92,
    reviewsCount: 230,
    units: [
      { unit: 'Miếng', factor: 1, price: 2500, originalPrice: 3000 },
      { unit: 'Hộp 20 Miếng', factor: 20, price: 45000, originalPrice: 55000 }
    ],
    defaultUnit: 'Hộp 20 Miếng',
    pharmacology: {
      indication: 'Bảo vệ các vết thương nhỏ, trầy xước, vết cắt nhẹ tránh nhiễm trùng và bụi bẩn khi tiếp xúc với nước.',
      dosage: 'Vệ sinh sạch và lau khô vết thương trước khi dán. Thay băng ít nhất 1 lần/ngày.',
      contraindication: 'Vết thương sâu, vết cắn của động vật hoặc vết bỏng nặng.',
      warning: 'Không kéo căng băng khi dán để tránh gây căng da.',
      storage: 'Để nơi khô mát, nhiệt độ dưới 30°C.'
    }
  }
];

// Pre-seeded Sample Orders for Instant Testing of Order Tracking
const SAMPLE_INITIAL_ORDERS = [
  {
    orderId: 'DH-2026-8492',
    createdAt: '2026-11-16T09:30:00Z',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0912345678',
    deliveryAddress: '107 Tân Cảng, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    deliveryMethod: 'express',
    paymentMethod: 'vietqr',
    paymentStatus: 'paid',
    status: 'delivering',
    hasRxMedicine: false,
    prescriptionCode: null,
    items: [
      {
        productId: 'prod-01',
        productName: 'Panadol Extra Giảm Đau Hạ Sốt',
        selectedUnit: 'Hộp',
        unitPrice: 235000,
        quantity: 1,
        totalPrice: 235000
      },
      {
        productId: 'prod-10',
        productName: 'Viên Sủi Bổ Sung Năng Lượng Berocca Mango',
        selectedUnit: 'Tuýp 10 Viên',
        unitPrice: 88000,
        quantity: 1,
        totalPrice: 88000
      }
    ],
    subtotal: 323000,
    discount: 50000,
    shippingFee: 0,
    total: 273000,
    voucherCode: 'TUTHOC50',
    estimatedDeliveryTime: 'Giao trong 2 giờ (Trước 11:30 hôm nay)',
    notes: 'Gọi trước khi giao 10 phút. Nhà có chuông cửa bên tay phải.'
  },
  {
    orderId: 'DH-2026-6127',
    createdAt: '2026-11-17T08:15:00Z',
    customerName: 'Lê Hoàng Yến Nhi',
    customerPhone: '0987654321',
    deliveryAddress: '45 Lê Văn Lương, Tân Phong, Quận 7, TP.HCM',
    deliveryMethod: 'pickup',
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    status: 'packing',
    hasRxMedicine: true,
    prescriptionCode: 'RX-2026-3829',
    items: [
      {
        productId: 'prod-07',
        productName: 'Kháng Sinh Augmentin 1g (Amoxicillin/Clavulanate)',
        selectedUnit: 'Hộp 14 Viên',
        unitPrice: 235000,
        quantity: 1,
        totalPrice: 235000
      },
      {
        productId: 'prod-12',
        productName: 'Men Vi Sinh Enterogermina 4 Tỷ Bào Tử Lợi Khuẩn',
        selectedUnit: 'Hộp 20 Ống',
        unitPrice: 298000,
        quantity: 1,
        totalPrice: 298000
      }
    ],
    subtotal: 533000,
    discount: 0,
    shippingFee: 0,
    total: 533000,
    voucherCode: null,
    estimatedDeliveryTime: 'Nhận tại quầy Nhà thuốc MediPharm Phú Mỹ Hưng',
    notes: 'Đã đính kèm ảnh đơn thuốc bác sĩ BV Nhi Đồng 1.'
  }
];

// Pre-seeded sample prescriptions
const SAMPLE_PRESCRIPTIONS = [
  {
    code: 'RX-2026-3829',
    createdAt: '2026-11-16T14:20:00Z',
    patientName: 'Lê Hoàng Yến Nhi (Bé 6 tuổi)',
    phone: '0987654321',
    prescriptionImageUrl: 'Images/rx-sample-2.jpg',
    note: 'Bác sĩ BV Nhi Đồng kê đơn Augmentin và Men vi sinh, nhờ Dược sĩ kiểm tra liều dùng cho bé 20kg.',
    requestCallback: true,
    status: 'approved',
    pharmacistNotes: 'Dược sĩ đã gọi xác nhận: Liều dùng 1/2 viên x 2 lần/ngày sau ăn.'
  },
  {
    code: 'RX-2026-8419',
    createdAt: '2026-11-17T09:00:00Z',
    patientName: 'Nguyễn Văn An',
    phone: '0912345678',
    prescriptionImageUrl: 'Images/rx-sample-1.jpg',
    note: 'Đơn thuốc khám xoang mũi cấp BV Tai Mũi Họng.',
    requestCallback: true,
    status: 'pending',
    pharmacistNotes: 'Dược sĩ trực đang kiểm tra toa thuốc...'
  }
];

// Pre-seeded Registered Users for Testing Login & Register
const SAMPLE_USERS = [
  {
    id: 'USER-1001',
    fullName: 'Nguyễn Văn An',
    phone: '0912345678',
    email: 'an.nguyen@gmail.com',
    password: 'password123',
    address: '107 Tân Cảng, Phường 22, Quận Bình Thạnh, TP.HCM',
    createdAt: '2026-10-10T08:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'USER-1002',
    fullName: 'Lê Hoàng Yến Nhi',
    phone: '0987654321',
    email: 'yennhi.le@gmail.com',
    password: 'password123',
    address: '45 Lê Văn Lương, Tân Phong, Quận 7, TP.HCM',
    createdAt: '2026-11-01T10:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  }
];

// Clinical Drug Interaction Database for Health Tools Checker
const DRUG_INTERACTIONS = [
  {
    drugA: 'Paracetamol',
    drugB: 'Rượu bia / Cồn',
    severity: 'danger',
    title: 'Nguy cơ độc tính cho gan nghiêm trọng!',
    description: 'Uống rượu bia trong khi dùng Paracetamol làm tăng đáng kể nguy cơ hoại tử tế bào gan cấp do chuyển hóa thành chất độc NAPQI vượt ngưỡng giải độc của gan.'
  },
  {
    drugA: 'Paracetamol',
    drugB: 'Efferalgan (Paracetamol)',
    severity: 'danger',
    title: 'Quá liều Paracetamol trùng lặp!',
    description: 'Cả hai loại thuốc đều chứa cùng hoạt chất Paracetamol. Dùng đồng thời sẽ dẫn đến quá liều (>4g/ngày), gây suy gan tối cấp.'
  },
  {
    drugA: 'Kháng sinh Augmentin',
    drugB: 'Men vi sinh Enterogermina',
    severity: 'warning',
    title: 'Giảm hiệu lực của men vi sinh!',
    description: 'Kháng sinh phổ rộng có thể tiêu diệt luôn các bào tử lợi khuẩn trong men vi sinh. Khuyến cáo uống men vi sinh cách thời điểm uống kháng sinh ít nhất 2 giờ.'
  },
  {
    drugA: 'Thuốc hạ áp Amlodipin',
    drugB: 'Thuốc giảm đau kháng viêm (NSAIDs)',
    severity: 'warning',
    title: 'Giảm tác dụng hạ huyết áp & tăng tải cho thận!',
    description: 'Các thuốc kháng viêm như Ibuprofen, Diclofenac giữ muối nước làm giảm hiệu quả hạ áp của Amlodipin và làm tăng áp lực lọc cầu thận.'
  },
  {
    drugA: 'Vitamin C 1000mg',
    drugB: 'Kháng sinh Augmentin',
    severity: 'safe',
    title: 'Có thể phối hợp an toàn',
    description: 'Vitamin C giúp tăng cường sức đề kháng miễn dịch trong khi kháng sinh tiêu diệt ổ nhiễm khuẩn. Nên uống sau bữa ăn no để tránh cồn cào dạ dày.'
  },
  {
    drugA: 'Dầu cá Omega-3',
    drugB: 'Thuốc hạ áp Amlodipin',
    severity: 'safe',
    title: 'Tương tác có lợi cho tim mạch',
    description: 'Omega-3 hỗ trợ giảm mỡ máu và cải thiện tuần hoàn thành mạch, kết hợp tốt với phác đồ kiểm soát huyết áp của Amlodipin.'
  }
];

// Clinic & Pharmacy Store Branches
const PHARMACY_STORES = [
  {
    id: 'store-1',
    name: 'MediPharm GPP Trụ Sở Chính (Bình Thạnh)',
    address: '107 Tân Cảng, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    phone: '(028) 7300 8866',
    hours: '06:30 – 22:30 (Mở cửa tất cả các ngày trong tuần)',
    pharmacist: 'DS.CKI Nguyễn Thị Mai Lan',
    services: ['Đo huyết áp & đường huyết miễn phí', 'Tư vấn toa thuốc bệnh viện', 'Giao hỏa tốc 2h', 'Đổi trả thiết bị y tế']
  },
  {
    id: 'store-2',
    name: 'MediPharm GPP Chi Nhánh Phú Mỹ Hưng',
    address: 'Lầu 1, Tòa Crescent Plaza, 105 Tôn Dật Tiên, Quận 7, TP.HCM',
    phone: '(028) 7300 8899',
    hours: '07:00 – 22:00 (Thứ 2 – Chủ Nhật)',
    pharmacist: 'ThS.DS Trần Minh Trí',
    services: ['Tư vấn dinh dưỡng chuyên sâu', 'Giao hỏa tốc quận 7 & Nhà Bè', 'Thanh toán bảo hiểm bảo lãnh']
  },
  {
    id: 'store-3',
    name: 'MediPharm GPP Chi Nhánh Quận 1',
    address: '88 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM',
    phone: '(028) 7300 8822',
    hours: '24/24 (Mở cửa thâu đêm phục vụ khẩn cấp)',
    pharmacist: 'DS. Lê Thị Hồng Vân',
    services: ['Trực đêm 24/7', 'Thuốc hiếm & Đặc trị ung bướu', 'Tư vấn tiêm ngừa']
  }
];
