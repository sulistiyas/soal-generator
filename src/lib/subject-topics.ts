export interface TopicItem {
  topic: string;
  subMaterials: string[];
}

export interface SubjectData {
  name: string;
  aliases: string[];
  topics: TopicItem[];
}

export const SUBJECT_TOPICS_DATABASE: SubjectData[] = [
  // 1. ILMU PENGETAHUAN ALAM (IPA)
  {
    name: 'Ilmu Pengetahuan Alam (IPA)',
    aliases: ['ipa', 'ilmu pengetahuan alam', 'sains', 'science'],
    topics: [
      {
        topic: 'Hakikat Ilmu Sains dan Metode Ilmiah',
        subMaterials: [
          'Metode ilmiah, variabel penelitian (bebas, terikat, kontrol), keselamatan kerja di laboratorium, dan pengukuran besaran pokok/turunan',
          'Merancang percobaan sains sederhana, membuat hipotesis, mencatat data, dan menarik kesimpulan berbasis bukti',
          'Pengenalan alat-alat laboratorium IPA, simbol bahaya bahan kimia, dan prosedur pertolongan pertama kecelakaan kerja',
          'Semua cakupan materi bab Hakikat Ilmu Sains dan Metode Ilmiah secara komprehensif',
        ],
      },
      {
        topic: 'Zat dan Perubahannya',
        subMaterials: [
          'Wujud zat (padat, cair, gas), model partikel zat, difusi partikel, dan konsep massa jenis (kerapatan zat)',
          'Perubahan wujud zat (mencair, membeku, menguap, mengembun, menyublim, mengkristal) dan grafik perubahan wujud',
          'Perubahan fisika vs perubahan kimia, ciri-ciri reaksi kimia (perubahan warna, suhu, endapan, gas)',
          'Metode pemisahan campuran: filtrasi, kristalisasi, destilasi, kromatografi, dan sublimasi dalam kehidupan',
        ],
      },
      {
        topic: 'Suhu, Kalor, dan Pemuaian',
        subMaterials: [
          'Konversi skala termometer (Celsius, Reamur, Fahrenheit, Kelvin) dan penggunaan termometer laboratorium',
          'Asas Black, perhitungan kalor jenis (Q = m.c.ΔT), kalor lebur, dan kalor uap',
          'Perpindahan kalor (konduksi, konveksi, radiasi) dan contoh penerapannya pada termos, cerobong, serta panel surya',
          'Pemuaian panjang, luas, dan volume pada zat padat, anomali air, dan penerapan bimetal',
        ],
      },
      {
        topic: 'Gerak dan Gaya (Hukum Newton)',
        subMaterials: [
          'Gerak Lurus Beraturan (GLB) dan GLBB, konsep jarak vs perpindahan, kelajuan vs kecepatan, dan analisis grafik v-t',
          'Hukum I, II, dan III Newton tentang gerak, resultan gaya, dan perhitungan percepatan benda (F = m.a)',
          'Gaya gesek statis dan kinetis, gaya berat, gaya normal, dan pengaruh gaya pada percepatan mobil/benda',
        ],
      },
      {
        topic: 'Klasifikasi Makhluk Hidup & Keanekaragaman Hayati',
        subMaterials: [
          'Ciri-ciri makhluk hidup, sistem klasifikasi 5 kingdom (Monera, Protista, Fungi, Plantae, Animalia)',
          'Penggunaan kunci determinasi/dikotomi sederhana dan tata nama binomial nomenklatur',
          'Tumbuhan berpembuluh (vaskular) vs tidak berpembuluh, hewan avertebrata dan vertebrata',
        ],
      },
      {
        topic: 'Ekosistem dan Interaksi Makhluk Hidup',
        subMaterials: [
          'Komponen biotik dan abiotik, rantai makanan, jaring-jaring makanan, dan piramida energi/ekologi',
          'Bentuk interaksi antarmakhluk hidup: simbiosis (mutualisme, komensalisme, parasitisme), predasi, dan kompetisi',
          'Dampak aktivitas manusia terhadap pencemaran lingkungan (air, udara, tanah) dan upaya konservasi ekosistem',
        ],
      },
      {
        topic: 'Tekanan Zat dan Penerapannya dalam Kehidupan',
        subMaterials: [
          'Tekanan zat padat, tekanan hidrostatis zat cair (P = ρ.g.h), dan bejana berhubungan',
          'Hukum Pascal (dongkrak hidrolik) dan Hukum Archimedes (kondisi terapung, melayang, tenggelam)',
          'Tekanan gas/udara, hukum Boyle, aplikasi tekanan pada sistem peredaran darah dan pengangkutan air tumbuhan',
        ],
      },
      {
        topic: 'Sistem Organ Manusia (Pencernaan, Pernapasan, Sirkulasi)',
        subMaterials: [
          'Organ dan enzim pencernaan makanan, uji zat makanan (amilum, glukosa, protein, lemak), dan kelainan pencernaan',
          'Mekanisme pernapasan dada & perut, kapasitas vital paru-paru, dan gangguan sistem pernapasan (asma, TBC, ISPA)',
          'Komponen darah, golongan darah sistem ABO dan Rhesus, struktur jantung, peredaran darah besar/kecil, dan hipertensi',
        ],
      },
      {
        topic: 'Listrik Dinamis dan Kemagnetan',
        subMaterials: [
          'Hukum Ohm (V = I.R), rangkaian hambatan seri-paralel, hukum I Kirchhoff, dan perhitungan daya/energi listrik rumah tangga',
          'Sifat kutub magnet, pembuatan magnet (gosokan, induksi, elektromagnet), dan medan magnet bumi',
          'Gaya Lorentz, induksi elektromagnetik (Hukum Faraday), dan prinsip kerja transformator (trafo step up/step down)',
        ],
      },
    ],
  },

  // 2. MATEMATIKA / MATEMATIKA UMUM / MATEMATIKA TERAPAN
  {
    name: 'Matematika',
    aliases: ['matematika', 'matematika (umum)', 'matematika terapan', 'math', 'mtk'],
    topics: [
      {
        topic: 'Bilangan Bulat dan Pecahan',
        subMaterials: [
          'Operasi hitung campuran bilangan bulat positif dan negatif beserta sifat-sifat komutatif, asosiatif, distributif',
          'Operasi hitung pecahan biasa, campuran, desimal, dan persen beserta aplikasi pada soal cerita kontekstual',
          'Kelipatan Persekutuan Terkecil (KPK), Faktor Persekutuan Terbesar (FPB), dan bilangan berpangkat sederhana',
        ],
      },
      {
        topic: 'Aljabar dan Persamaan Linear Satu Variabel (PLSV)',
        subMaterials: [
          'Bentuk aljabar: suku, koefisien, konstanta, variabel, dan operasi penjumlahan, pengurangan, perkalian bentuk aljabar',
          'Penyelesaian Persamaan Linear Satu Variabel (PLSV) dengan pindah ruas dan kesetaraan operasi',
          'Pertidaksamaan Linear Satu Variabel (PtLSV) dan penyajian himpunan penyelesaian pada garis bilangan',
        ],
      },
      {
        topic: 'Sistem Persamaan Linear Dua Variabel (SPLDV)',
        subMaterials: [
          'Metode penyelesaian SPLDV: metode eliminasi, substitusi, metode campuran (gabungan), dan metode grafik',
          'Pemodelan matematika dari masalah nyata (harga barang, tiket masuk, perbandingan usia) menggunakan SPLDV',
        ],
      },
      {
        topic: 'Teorema Pythagoras dan Penerapannya',
        subMaterials: [
          'Pembuktian rumus Pythagoras (c² = a² + b²), tripel Pythagoras, dan penentuan jenis segitiga (lancip, siku-siku, tumpul)',
          'Perbandingan sisi-sisi segitiga khusus bersudut 30°-60°-90° dan 45°-45°-90°',
          'Penerapan teorema Pythagoras dalam menghitung jarak, tinggi pohon/gedung, dan panjang tangga',
        ],
      },
      {
        topic: 'Bangun Datar dan Bangun Ruang (Geometri)',
        subMaterials: [
          'Keliling dan luas bangun datar (segitiga, persegi panjang, trapesium, jajar genjang, layang-layang, belah ketupat, lingkaran)',
          'Luas permukaan dan volume bangun ruang sisi datar (kubus, balok, prisma, limas)',
          'Luas permukaan dan volume bangun ruang sisi lengkung (tabung, kerucut, bola) dan bangun gabungan',
        ],
      },
      {
        topic: 'Statistika dan Pengolahan Data',
        subMaterials: [
          'Penyajian data: tabel distribusi frekuensi, diagram batang, diagram garis, dan diagram lingkaran',
          'Ukuran pemusatan data: Mean (rata-rata), Median (nilai tengah), dan Modus (nilai paling sering muncul) data tunggal & kelompok',
          'Ukuran penyebaran data: Jangkauan (range), Kuartil bawah (Q1), Kuartil tengah (Q2), Kuartil atas (Q3), dan Jangkauan Interkuartil',
        ],
      },
      {
        topic: 'Peluang (Teoretik dan Empirik)',
        subMaterials: [
          'Ruang sampel, titik sampel, frekuensi relatif, dan perhitungan peluang empirik suatu kejadian',
          'Peluang teoretik kejadian tunggal (pelemparan koin, dadu, kartu bridge) dan peluang kejadian majemuk',
          'Frekuensi harapan dari suatu percobaan pelemparan berulang',
        ],
      },
      {
        topic: 'Relasi, Fungsi, dan Persamaan Garis Lurus',
        subMaterials: [
          'Pengertian relasi & fungsi, penyajian relasi (diagram panah, himpunan pasangan berurutan, diagram Kartesius), domain, kodomain, range',
          'Bentuk umum fungsi linier f(x) = ax + b, bayangan suatu nilai, dan grafik fungsi',
          'Gradien (kemiringan garis), persamaan garis lurus melalui satu titik dan dua titik, hubungan garis sejajar dan tegak lurus',
        ],
      },
      {
        topic: 'Transformasi Geometri',
        subMaterials: [
          'Translasi (pergeseran koordinat) titik dan garis pada bidang Kartesius',
          'Refleksi (pencerminan terhadap sumbu-x, sumbu-y, garis y=x, y=-x, titik asal O(0,0))',
          'Rotasi (perputaran 90°, 180°, 270° searah/berlawanan jarum jam) dan Dilatasi (faktor skala k)',
        ],
      },
    ],
  },

  // 3. MATEMATIKA TINGKAT LANJUT (SMA)
  {
    name: 'Matematika Tingkat Lanjut',
    aliases: ['matematika tingkat lanjut', 'matematika peminatan', 'advanced math'],
    topics: [
      {
        topic: 'Polinomial (Suku Banyak)',
        subMaterials: [
          'Operasi aljabar pada polinomial, pembagian polinomial cara bersusun dan skema Horner / Horner-Kino',
          'Teorema Sisa dan Teorema Faktor untuk menentukan faktor-faktor dan akar rasional polinomial derajat tinggi',
          'Persamaan polinomial dan penerapan rumus Vieta untuk jumlah dan hasil kali akar-akar',
        ],
      },
      {
        topic: 'Trigonometri Lanjutan & Fungsi Trigonometri',
        subMaterials: [
          'Rumus jumlah dan selisih dua sudut untuk sinus, kosinus, dan tangen (sin(A±B), cos(A±B), tan(A±B))',
          'Rumus sudut rangkap (sudut ganda), sudut pertengahan, dan perkalian ke penjumlahan trigonometri',
          'Penyelesaian persamaan trigonometri dan analisis grafik fungsi trigonometri (periode, amplitudo, pergeseran fase)',
        ],
      },
      {
        topic: 'Matriks dan Sistem Persamaan Linear',
        subMaterials: [
          'Operasi matriks (penjumlahan, pengurangan, perkalian skalar, perkalian antarmatriks), transpos matriks',
          'Determinan dan invers matriks ordo 2x2 dan 3x3 (metode Sarrus dan kofaktor)',
          'Penyelesaian Sistem Persamaan Linear Tiga Variabel (SPLTV) menggunakan matriks invers dan Aturan Cramer',
        ],
      },
      {
        topic: 'Vektor pada Bidang (R²) dan Ruang (R³)',
        subMaterials: [
          'Vektor posisi, panjang vektor, operasi aljabar vektor, dan vektor satuan',
          'Perkalian skalar dua vektor (dot product), sudut antara dua vektor, dan proyeksi vektor ortogonal',
        ],
      },
      {
        topic: 'Kalkulus: Limit, Turunan, dan Integral',
        subMaterials: [
          'Limit fungsi aljabar dan limit fungsi trigonometri untuk x mendekati nilai tertentu dan mendekati tak hingga',
          'Turunan fungsi aljabar dan trigonometri, aturan rantai, persamaan garis singgung, fungsi naik/turun, dan nilai stasioner maksimum/minimum',
          'Integral tak tentu dan tentu fungsi aljabar/trigonometri, teknik integral substitusi & parsial, serta aplikasi luas daerah kurva',
        ],
      },
    ],
  },

  // 4. BAHASA INDONESIA
  {
    name: 'Bahasa Indonesia',
    aliases: ['bahasa indonesia', 'b. indonesia', 'indonesian', 'bindo'],
    topics: [
      {
        topic: 'Teks Laporan Hasil Observasi (LHO)',
        subMaterials: [
          'Struktur teks LHO: pernyataan umum (definisi umum), deskripsi bagian, dan deskripsi manfaat',
          'Ciri kebahasaan teks LHO: kalimat definisi, kalimat deskripsi, verba material, kata teknis/istilah ilmiah, dan penggunaan imbuhan di- vs kata depan di',
          'Menganalisis objektivitas isi teks LHO, menyusun ringkasan, dan menyunting kesalahan ejaan EYD V',
        ],
      },
      {
        topic: 'Teks Cerita Fantasi dan Cerpen (Narasi)',
        subMaterials: [
          'Unsur intrinsik: tema, tokoh & penokohan, alur/plot (maju, mundur, campuran), latar (tempat, waktu, suasana), sudut pandang, amanat',
          'Struktur narasi: orientasi, komplikasi (konflik), klimaks, resolusi, dan koda',
          'Gaya bahasa (majas metafora, personifikasi, hiperbola, simile) dan analisis pesan moral cerita',
        ],
      },
      {
        topic: 'Teks Prosedur',
        subMaterials: [
          'Struktur teks prosedur: tujuan, bahan/alat/material, langkah-langkah berurutan, dan penutup/penegasan ulang',
          'Kaidah kebahasaan: kalimat imperatif (perintah), kalimat deklaratif, konjungsi urutan waktu, dan kata kerja aktif',
          'Menyusun teks prosedur protokol dan tips praktis sesuai kaidah tata bahasa baku',
        ],
      },
      {
        topic: 'Teks Eksplanasi',
        subMaterials: [
          'Struktur teks eksplanasi: pernyataan umum (identifikasi fenomena), deretan penjelas (proses kausalitas/kronologis), dan ulasan/interpretasi',
          'Kaidah kebahasaan: konjungsi kausalitas (sebab, karena, oleh karena itu), konjungsi kronologis, kata serapan, dan kalimat pasif',
          'Menjelaskan proses terjadinya fenomena alam (gempa, banjir, pelangi) dan fenomena sosial budaya secara ilmiah',
        ],
      },
      {
        topic: 'Teks Iklan, Slogan, dan Poster',
        subMaterials: [
          'Unsur-unsur pembentuk iklan, slogan, dan poster (gambar, kata-kata, gerak, suara) serta tujuannya (komersial vs layanan masyarakat)',
          'Ciri kebahasaan: bahasa persuasif, imperatif, ringkas, berima, dan memikat khalayak sasaran',
          'Membedakan fakta dan opini dalam teks iklan komersial maupun advertorial',
        ],
      },
      {
        topic: 'Teks Puisi dan Resensi Buku',
        subMaterials: [
          'Unsur fisik puisi (diksi, pengimajian/citraan, kata konkret, majas, rima/ritme, tipografi) dan unsur batin (tema, nada, rasa, amanat)',
          'Menganalisis makna tersurat dan tersirat dalam bait puisi modern',
          'Struktur resensi buku (identitas buku, sinopsis, kelebihan, kekurangan, rekomendasi sasaran pembaca)',
        ],
      },
      {
        topic: 'Teks Argumentasi dan Editorial / Opini',
        subMaterials: [
          'Struktur teks argumentasi: tesis (pernyataan pendapat), argumen pendukung berbasis data/fakta valid, dan simpulan rekomendasi',
          'Kaidah kebahasaan teks editorial: kata modalitas (mungkin, pasti, harus), konjungsi antarkalimat, dan kosakata evaluatif',
          'Menilai kelogisan argumen, validitas data rujukan, dan keberpihakan redaksi dalam isu aktual publik',
        ],
      },
    ],
  },

  // 5. BAHASA INGGRIS
  {
    name: 'Bahasa Inggris',
    aliases: ['bahasa inggris', 'b. inggris', 'english', 'bing'],
    topics: [
      {
        topic: 'Descriptive Text (People, Places, and Famous Landmarks)',
        subMaterials: [
          'Text structure: Identification and Detailed Description of physical traits, qualities, and characteristics',
          'Grammar focus: Simple Present Tense, Adjectives, Adjective Order (DOSASCOMP), and Degrees of Comparison',
          'Reading comprehension: identifying main ideas, specific factual details, synonyms, and reference words',
        ],
      },
      {
        topic: 'Recount Text (Personal Experiences & Historical Events)',
        subMaterials: [
          'Text structure: Orientation, Sequence of Events in chronological order, and Re-orientation',
          'Grammar focus: Simple Past Tense (regular and irregular verbs), past time connectors (first, next, after that, finally)',
          'Vocabulary related to unforgettable vacation, school events, and heroic independence battles',
        ],
      },
      {
        topic: 'Narrative Text (Folktales, Fables, Legends, and Fairy Tales)',
        subMaterials: [
          'Text structure: Orientation, Complication (rising action, climax), Resolution, and Moral Value / Coda',
          'Grammar focus: Past Continuous Tense, Direct and Indirect Speech, Action Verbs, and Time Sequences',
          'Character analysis, conflict identification, and understanding figurative language / themes',
        ],
      },
      {
        topic: 'Procedure Text (Recipes, Manuals, and Life Hacks)',
        subMaterials: [
          'Text structure: Goal / Aim, Ingredients / Materials Needed, and Step-by-Step Methods',
          'Grammar focus: Imperative sentences (commands), Adverbials of Sequence, Precise measurement vocabulary',
          'Comprehending cooking instructions, assembling electronic devices, and safety warnings',
        ],
      },
      {
        topic: 'Analytical & Hortatory Exposition Text',
        subMaterials: [
          'Text structure: Thesis Statement, Arguments supported by evidence/data, Reiteration / Recommendation',
          'Grammar focus: Connectors of cause and effect (because of, consequently, therefore), Modals, Evaluative Language',
          'Critical reading: distinguishing facts from opinions on environmental issues, technology impact, and healthy lifestyle',
        ],
      },
      {
        topic: 'Transactional & Interpersonal Communication',
        subMaterials: [
          'Asking for and giving opinions, expressing agreement and disagreement politely',
          'Offering help / services, accepting or declining offers, making requests and suggestions',
          'Expressing congratulations, compliments, hopes, wishes, intentions, and apologizing in formal/informal contexts',
        ],
      },
    ],
  },

  // 6. PENDIDIKAN PANCASILA / PPKN
  {
    name: 'Pendidikan Pancasila',
    aliases: ['pendidikan pancasila', 'ppkn', 'pkn', 'pancasila', 'pendidikan kewarganegaraan'],
    topics: [
      {
        topic: 'Sejarah Kelahiran & Penerapan Nilai-Nilai Pancasila',
        subMaterials: [
          'Sidang BPUPKI, gagasan dasar negara pendiri bangsa (Moh. Yamin, Soepomo, Ir. Soekarno), dan Piagam Jakarta',
          'Penerapan sila 1 sampai sila 5 Pancasila dalam kehidupan sehari-hari di rumah, sekolah, masyarakat, dan berbangsa',
          'Tantangan pengamalan Pancasila di era digital dan globalisasi serta revitalisasi Profil Pelajar Pancasila',
        ],
      },
      {
        topic: 'Norma Sosial dan UUD NRI Tahun 1945',
        subMaterials: [
          'Macam-macam norma (agama, kesusilaan, kesopanan, hukum), sanksi pelanggaran norma, dan pentingnya budaya tertib',
          'Kedudukan dan fungsi UUD NRI Tahun 1945 sebagai hukum dasar tertulis tertinggi di Indonesia',
          'Hak dan kewajiban asasi warga negara menurut pasal-pasal UUD 1945 (Pasal 27, 28, 29, 30, 31)',
        ],
      },
      {
        topic: 'Bhinneka Tunggal Ika & Keberagaman Budaya Nusantara',
        subMaterials: [
          'Keberagaman suku, agama, ras, dan antargolongan (SARA) di Indonesia sebagai kekayaan identitas nasional',
          'Menghargai keragaman budaya daerah, toleransi antarumat beragama, dan pencegahan paham diskriminasi/intoleransi',
          'Resolusi konflik sosial bernuansa keberagaman dan penguatan integrasi nasional',
        ],
      },
      {
        topic: 'Negara Kesatuan Republik Indonesia (NKRI) & Kedaulatan',
        subMaterials: [
          'Bentuk negara kesatuan, wilayah kedaulatan NKRI (darat, laut, udara), batas teritorial dan ZEE Indonesia',
          'Peran dan fungsi lembaga negara: Eksekutif (Presiden), Legislatif (DPR, DPD, MPR), dan Yudikatif (MA, MK, KY)',
          'Upaya bela negara, menjaga keutuhan wilayah dari ancaman militer, siber, ideologi, dan geopolitik kawasan',
        ],
      },
    ],
  },

  // 7. ILMU PENGETAHUAN SOSIAL (IPS)
  {
    name: 'Ilmu Pengetahuan Sosial (IPS)',
    aliases: ['ips', 'ilmu pengetahuan sosial', 'social studies'],
    topics: [
      {
        topic: 'Keluarga Awal Kehidupan & Interaksi Sosial',
        subMaterials: [
          'Peran dan fungsi lembaga keluarga, sosialisasi nilai dan norma, serta pembentukan kepribadian individu',
          'Syarat interaksi sosial (kontak sosial & komunikasi), bentuk interaksi asosiatif (kerja sama, akomodasi) dan disosiatif (konflik, kompetisi)',
          'Status sosial, peran sosial, diferensiasi sosial, dan dinamika interaksi di era media sosial',
        ],
      },
      {
        topic: 'Kondisi Geografis dan Potensi Alam Indonesia',
        subMaterials: [
          'Letak astronomis, geografis, geologis Indonesia dan pengaruhnya terhadap iklim muson serta pembagian zona waktu',
          'Potensi sumber daya alam (hutan, tambang minyak/batubara, kemaritiman) dan persebarannya di pulau-pulau Indonesia',
          'Mitigasi bencana alam (gempa tektonik, gunung api, tsunami, banjir) dan adaptasi perubahan iklim',
        ],
      },
      {
        topic: 'Aktivitas Ekonomi: Kebutuhan, Kelangkaan, dan Pasar',
        subMaterials: [
          'Kebutuhan manusia (primer, sekunder, tersier), kelangkaan sumber daya, biaya peluang (opportunity cost), dan prinsip ekonomi',
          'Kegiatan produksi, distribusi, konsumsi, serta peran pelaku ekonomi (rumah tangga konsumen, produsen, pemerintah, luar negeri)',
          'Permintaan, penawaran, hukum permintaan-penawaran, dan proses pembentukan harga keseimbangan pasar',
        ],
      },
      {
        topic: 'Peradaban Kerajaan Hindu-Buddha dan Islam di Nusantara',
        subMaterials: [
          'Jalur perdagangan maritim kuno, peninggalan kerajaan Kutai, Sriwijaya, Tarumanegara, dan Majapahit',
          'Masuk dan berkembangnya agama Islam melalui jalur perdagangan, dakwah Wali Songo, serta kerajaan Samudera Pasai, Demak, Mataram Islam, Gowa-Tallo',
          'Akulturasi budaya praaksara, Hindu-Buddha, dan Islam pada arsitektur masjid, makam, kesenian, dan tradisi',
        ],
      },
      {
        topic: 'Masa Kolonialisme dan Pergerakan Nasional Indonesia',
        subMaterials: [
          'Kedatangan bangsa barat (Portugis, Spanyol, VOC Belanda), kebijakan kerja paksa, sistem tanam paksa (Cultuurstelsel), dan monopoli',
          'Lahirnya organisasi modern (Budi Utomo, Sarekat Islam, Indische Partij), Kongres Sumpah Pemuda 1928, dan tokoh pergerakan',
        ],
      },
    ],
  },

  // 8. IPAS (SD / SMK)
  {
    name: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    aliases: ['ipas', 'ilmu pengetahuan alam dan sosial', 'projek ipas', 'projek ipas (smk)'],
    topics: [
      {
        topic: 'Tumbuhan, Sumber Kehidupan di Bumi (Fotosintesis)',
        subMaterials: [
          'Bagian tubuh tumbuhan (akar, batang, daun, bunga, buah, biji) dan fungsi masing-masing bagi kelangsungan hidup',
          'Proses fotosintesis pada daun (klorofil, sinar matahari, air, CO2) dan hasil fotosintesis (glukosa, oksigen)',
          'Perkembangbiakan tumbuhan secara generatif (penyerbukan bunga) dan vegetatif (alami & buatan)',
        ],
      },
      {
        topic: 'Wujud Zat dan Perubahannya di Sekitar Kita',
        subMaterials: [
          'Mengenal materi zat padat, cair, dan gas beserta sifat-sifat volume dan bentuknya',
          'Peristiwa membeku, mencair, menguap, mengembun, menyublim, dan mengkristal dalam kehidupan sehari-hari',
        ],
      },
      {
        topic: 'Gaya dan Gerak di Sekitar Kita',
        subMaterials: [
          'Pengaruh gaya otot, gaya gesek, gaya pegas, gaya magnet, dan gaya gravitasi terhadap gerak dan bentuk benda',
          'Manfaat dan kerugian gaya gesek serta cara memperbesar atau memperkecil gaya gesek',
        ],
      },
      {
        topic: 'Mengubah Bentuk Energi dan Sumber Energi Alternatif',
        subMaterials: [
          'Bentuk-bentuk energi: energi kinetik, potensial, kimia, listrik, panas, cahaya, dan bunyi',
          'Transformasi/perubahan energi pada peralatan elektronik rumah tangga dan kendaraan',
          'Pemanfaatan energi terbarukan ramah lingkungan: tenaga surya, angin, air, dan biomassa',
        ],
      },
      {
        topic: 'Indonesiaku Kaya Hayati dan Ragam Budayanya',
        subMaterials: [
          'Keanekaragaman hayati flora dan fauna endemik Indonesia di zona Asiatis, Peralihan, dan Australis',
          'Keragaman rumah adat, pakaian tradisional, tarian daerah, senjata khas, dan makanan tradisional antardaerah',
        ],
      },
      {
        topic: 'Kenampakan Alam, Bentang Lahan, dan Peta Wilayah',
        subMaterials: [
          'Kenampakan alam daratan (gunung, pegunungan, dataran tinggi/rendah, lembah) dan perairan (sungai, danau, laut, selat)',
          'Membaca peta lingkungan tempat tinggal, simbol peta, arah mata angin, dan pemanfaatan sumber daya alam lokal',
        ],
      },
    ],
  },

  // 9. INFORMATIKA
  {
    name: 'Informatika',
    aliases: ['informatika', 'tik', 'ilmu komputer', 'computer science', 'it'],
    topics: [
      {
        topic: 'Berpikir Komputasional (Computational Thinking)',
        subMaterials: [
          '4 pilar berpikir komputasional: Dekomposisi, Pengenalan Pola (Pattern Recognition), Abstraksi, dan Perancangan Algoritma',
          'Pemecahan masalah optimasi penjadwalan, struktur data pohon (tree) dan graf (graph), serta logika runtut',
          'Representasi data bilangan biner, heksadesimal, dan logika Boolean (AND, OR, NOT)',
        ],
      },
      {
        topic: 'Teknologi Informasi dan Komunikasi (Aplikasi Perkantoran)',
        subMaterials: [
          'Integrasi aplikasi perkantoran: Mail Merge, Object Linking & Embedding (OLE), dan pembuatan daftar isi otomatis',
          'Penggunaan formula dan fungsi lanjutan pada spreadsheet (SUMIF, COUNTIF, VLOOKUP, HLOOKUP, IF bertingkat)',
          'Penyusunan presentasi interaktif dan infografis visual berbasis data yang efektif',
        ],
      },
      {
        topic: 'Sistem Komputer (Hardware, Software, & Operating System)',
        subMaterials: [
          'Komponen perangkat keras: Input, Output, Central Processing Unit (ALU, CU, Register), dan Storage device',
          'Fungsi sistem operasi: manajemen proses, manajemen memori, sistem berkas (file system), dan interaksi antarmuka (GUI/CLI)',
        ],
      },
      {
        topic: 'Jaringan Komputer dan Internet',
        subMaterials: [
          'Topologi jaringan (Star, Bus, Ring, Mesh), model protokol TCP/IP dan OSI Layer, serta pengalamatan IP Address & DNS',
          'Konektivitas nirkabel (Wi-Fi, Bluetooth, Seluler 4G/5G), keamanan jaringan, enkripsi data (SSL/HTTPS), dan firewall',
          'Ancaman siber: malware, phishing, ransomware, sniffing, dan langkah pencegahan keamanan data',
        ],
      },
      {
        topic: 'Algoritma dan Pemrograman (Python / Blockly / Scratch)',
        subMaterials: [
          'Variabel, tipe data (integer, float, string, boolean), operator aritmatika dan logika',
          'Struktur kontrol percabangan (if-else, elif) dan perulangan (for loop, while loop)',
          'Pembuatan fungsi (def), penanganan list/array, dan teknik debugging error program',
        ],
      },
      {
        topic: 'Dampak Sosial Informatika & Etika Digital',
        subMaterials: [
          'Undang-Undang ITE, hak kekayaan intelektual (lisensi open-source vs proprietary), dan perlindungan privasi data pribadi',
          'Cyberbullying, penyebaran berita bohong (hoax), jejak digital (digital footprint), dan etika kecerdasan buatan (AI)',
        ],
      },
    ],
  },

  // 10. FISIKA (SMA)
  {
    name: 'Fisika',
    aliases: ['fisika', 'physics'],
    topics: [
      {
        topic: 'Pengukuran, Besaran Vektor, dan Kinematika Gerak',
        subMaterials: [
          'Aturan angka penting, notasi ilmiah, ketidakpastian pengukuran (jangka sorong & mikrometer sekrup), dan analisis dimensi',
          'Resultan vektor dengan metode poligon, jajargenjang, dan analisis komponen sumbu x-y',
          'Kinematika: Gerak Lurus Beraturan (GLB), GLBB dipercepat/diperlambat, gerak vertikal ke atas/bawah, dan gerak jatuh bebas',
          'Gerak Parabola (analisis kecepatan horizontal dan vertikal, titik tertinggi, jangkauan terjauh) dan Gerak Melingkar Beraturan',
        ],
      },
      {
        topic: 'Dinamika Gerak dan Hukum Gravitasi Newton',
        subMaterials: [
          'Hukum Newton I, II, III pada sistem bidang datar, bidang miring licin/kasar, dan sistem katrol berbeban',
          'Gaya gesek statis maksimum dan kinetis, tegangan tali, dan gaya sentripetal pada lintasan menikung',
          'Hukum gravitasi universal Newton, medan gravitasi (percepatan gravitasi pada ketinggian tertentu), dan Hukum I, II, III Kepler',
        ],
      },
      {
        topic: 'Usaha, Energi, dan Hukum Kekekalan Energi Mekanik',
        subMaterials: [
          'Konsep usaha (W = F.s.cos θ), energi kinetik (Ek = ½mv²), energi potensial gravitasi (Ep = mgh), dan energi potensial pegas',
          'Teorema usaha dan perubahan energi kinetik/potensial serta efisiensi daya',
          'Hukum kekekalan energi mekanik (Em = Ep + Ek = konstan) pada gerak jatuh bebas, roller coaster, dan ayunan bandul',
        ],
      },
      {
        topic: 'Momentum, Impuls, dan Tumbukan',
        subMaterials: [
          'Konsep momentum (p = m.v), impuls (I = F.Δt), dan teorema impuls-momentum',
          'Hukum kekekalan momentum pada penembakan peluru, roket, dan tumbukan dua benda',
          'Koefisien restitusi (e) dan jenis tumbukan: lenting sempurna (e=1), lenting sebagian (0<e<1), dan tidak lenting sama sekali (e=0)',
        ],
      },
      {
        topic: 'Fluida Statis dan Fluida Dinamis',
        subMaterials: [
          'Tekanan hidrostatis, hukum Pascal, hukum Archimedes (terapung, melayang, tenggelam), tegangan permukaan, dan kapilaritas',
          'Persamaan kontinuitas (debit aliran Q = A.v) dan Hukum Bernoulli pada pipa venturimeter, tabung pitot, dan sayap pesawat',
        ],
      },
      {
        topic: 'Suhu, Kalor, dan Termodinamika',
        subMaterials: [
          'Kalor, kapasitas kalor, kalor lebur/uap, perpindahan kalor (konduksi, konveksi, radiasi), dan hukum Stefan-Boltzmann',
          'Teori kinetik gas ideal: persamaan gas ideal (PV = nRT), energi kinetik rata-rata molekul, dan kecepatan efektif gas',
          'Hukum I dan II Termodinamika: usaha pada proses isotermal, isobarik, isokhorik, adiabatik, siklus Carnot, dan efisiensi mesin pendingin',
        ],
      },
      {
        topic: 'Gelombang Bunyi, Gelombang Cahaya, dan Optika',
        subMaterials: [
          'Persamaan gelombang berjalan dan stasioner (ujung bebas dan ujung terikat), cepat rambat gelombang',
          'Gelombang bunyi: cepat rambat bunyi, efek Doppler, intensitas dan taraf intensitas bunyi (dB), frekuensi dawai dan pipa organa',
          'Gelombang cahaya: interferensi celah ganda Young, kisi difraksi, polarisasi cahaya, dan pemantulan/pembiasan pada cermin/lensa',
        ],
      },
      {
        topic: 'Listrik Statis, Listrik Dinamis, dan Medan Magnet',
        subMaterials: [
          'Hukum Coulomb, kuat medan listrik, potensial listrik, energi potensial listrik, dan rangkaian kapasitor keping sejajar',
          'Hukum Ohm, hukum Kirchhoff I dan II pada rangkaian 1 loop dan 2 loop, jembatan Wheatstone, dan energi listrik',
          'Medan magnet di sekitar kawat lurus/melingkar, solenoida, toroida, gaya Lorentz, Hukum Faraday, dan induktansi diri trafo',
        ],
      },
    ],
  },

  // 11. KIMIA (SMA)
  {
    name: 'Kimia',
    aliases: ['kimia', 'chemistry'],
    topics: [
      {
        topic: 'Struktur Atom dan Sistem Periodik Unsur',
        subMaterials: [
          'Perkembangan model atom (Dalton, Thomson, Rutherford, Bohr, Mekanika Kuantum), partikel dasar (proton, elektron, neutron), isotop/isobar/isoton',
          'Konfigurasi elektron menurut Aufbau, aturan Hund, larangan Pauli, bilangan kuantum (n, l, m, s), dan letak golongan/periode',
          'Sifat keperiodikan unsur: jari-jari atom, energi ionisasi, afinitas elektron, dan keelektronegatifan',
        ],
      },
      {
        topic: 'Ikatan Kimia dan Bentuk Geometri Molekul',
        subMaterials: [
          'Ikatan ion (serah terima elektron) vs ikatan kovalen (kovalen tunggal, rangkap, koordinasi, polar vs nonpolar), dan ikatan logam',
          'Struktur Lewis, teori domain elektron (VSEPR), dan hibridisasi untuk memprediksi bentuk geometri molekul',
          'Gaya antarmolekul: gaya London (dispersi), gaya dipol-dipol, dan ikatan hidrogen beserta pengaruhnya pada titik didih',
        ],
      },
      {
        topic: 'Stoikiometri dan Hukum Dasar Kimia',
        subMaterials: [
          'Hukum dasar kimia: Hukum Lavoisier, Proust, Dalton, Gay-Lussac, dan Hipotesis Avogadro',
          'Konsep mol, massa molar (Mr/Ar), volume molar gas (STP/RTP/kondisi gas ideal), molaritas larutan, dan persen massa',
          'Perhitungan kimia persamaan reaksi setara, penentuan rumus empiris & molekul, air kristal (hidrat), dan pereaksi pembatas',
        ],
      },
      {
        topic: 'Termokimia dan Laju Reaksi',
        subMaterials: [
          'Reaksi eksoterm dan endoterm, sistem dan lingkungan, perubahan entalpi standar (ΔH°f, ΔH°d, ΔH°c)',
          'Penentuan ΔH reaksi menggunakan kalorimetri, Hukum Hess, data entalpi pembentukan standar, dan data energi ikatan rata-rata',
          'Teori tumbukan, faktor yang memengaruhi laju reaksi (konsentrasi, luas permukaan, suhu, katalis), dan persamaan laju / orde reaksi',
        ],
      },
      {
        topic: 'Kesetimbangan Kimia dan Asam Basa',
        subMaterials: [
          'Tetapan kesetimbangan konsentrasi (Kc) dan tekanan (Kp), hubungan Kp dan Kc, serta faktor pergeseran kesetimbangan (Asas Le Chatelier)',
          'Teori asam basa (Arrhenius, Bronsted-Lowry, Lewis), penentuan pH asam/basa kuat dan lemah, serta derajat ionisasi (α)',
          'Larutan penyangga (buffer asam & basa), hidrolisis garam (parsial, total, tidak terhidrolisis), dan kurva titrasi asam-basa',
        ],
      },
      {
        topic: 'Reaksi Redoks dan Elektrokimia (Sel Volta & Elektrolisis)',
        subMaterials: [
          'Penyetaraan reaksi redoks metode perubahan bilangan oksidasi (PBO) dan metode setengah reaksi (ion-elektron)',
          'Sel Volta / Galvani: notasi sel, potensial sel standar (E° sel), deret volta, dan aplikasi baterai serta pencegahan korosi besi',
          'Sel Elektrolisis: reaksi di anoda dan katoda, Hukum Faraday I dan II (massa endapan w = e.i.t / 96500), dan elektroplating logam',
        ],
      },
      {
        topic: 'Senyawa Karbon (Kimia Organik) dan Makromolekul',
        subMaterials: [
          'Tata nama IUPAC dan sifat turunan alkana: alkohol (alkanol), eter (alkoksialkana), aldehid (alkanal), keton (alkanon), asam karboksilat, ester',
          'Isomer struktur, posisi, fungsi, optik aktif, dan reaksi senyawa karbon (substitusi, adisi, eliminasi, oksidasi, esterifikasi)',
          'Polimer alam vs sintetis (reaksi polimerisasi adisi vs kondensasi), karbohidrat, protein, dan lemak',
        ],
      },
    ],
  },

  // 12. BIOLOGI (SMA)
  {
    name: 'Biologi',
    aliases: ['biologi', 'biology'],
    topics: [
      {
        topic: 'Struktur dan Fungsi Organel Sel',
        subMaterials: [
          'Perbedaan sel prokariotik dan eukariotik, struktur dan fungsi organel sel hewan vs tumbuhan (nukleus, ribosom, RE, mitokondria, kloroplas, vakuola)',
          'Mekanisme transpor membran: transpor pasif (difusi sederhana, difusi terfasilitasi, osmosis) dan transpor aktif (pompa ion Na-K, endositosis, eksositosis)',
        ],
      },
      {
        topic: 'Struktur Jaringan Tumbuhan dan Hewan',
        subMaterials: [
          'Jaringan meristem, epidermis, parenkim, kolenkim, sklerenkim, xilem, dan floem pada anatomi akar, batang, dan daun tumbuhan',
          'Jaringan epitel, jaringan ikat (tulang, darah, adiposa), jaringan otot (otot polos, lurik, jantung), dan jaringan saraf pada hewan',
        ],
      },
      {
        topic: 'Sistem Fisiologi Organ Manusia',
        subMaterials: [
          'Sistem peredaran darah, pembekuan darah, penggolongan darah, kerja jantung, dan penyakit arteriosklerosis/anemia',
          'Sistem ekskresi: proses pembentukan urine di nefron ginjal (filtrasi, reabsorpsi, augmentasi), peran hati, kulit, dan paru-paru',
          'Sistem koordinasi: struktur neuron, penghantaran impuls sinapsis, sistem saraf pusat/tepi, sistem endokrin (hormon), dan sistem indra',
        ],
      },
      {
        topic: 'Metabolisme Sel (Enzim, Katabolisme, dan Anabolisme)',
        subMaterials: [
          'Karakteristik enzim, teori kerja enzim (lock and key vs induced fit), faktor pengaruh enzim (suhu, pH, inhibitor kompetitif/non-kompetitif)',
          'Respirasi aerob: tahapan Glikolisis, Dekarboksilasi Oksidatif, Siklus Krebs, dan Rantai Transpor Elektron beserta jumlah ATP yang dihasilkan',
          'Respirasi anaerob (fermentasi asam laktat dan fermentasi alkohol) vs fotosintesis (Reaksi Terang fotolisis & Reaksi Gelap siklus Calvin)',
        ],
      },
      {
        topic: 'Genetika dan Pewarisan Sifat (Hereditas)',
        subMaterials: [
          'Struktur gen, kromosom, DNA, RNA, kode genetik, dan tahapan sintesis protein (transkripsi di nukleus & translasi di ribosom)',
          'Hukum Mendel I (monohibrid) dan Hukum Mendel II (dihibrid), persilangan uji (test cross), dan penyimpangan semu hukum Mendel (kriptomeri, polimeri, epistasis-hipostasis)',
          'Pola hereditas manusia: penentuan jenis kelamin, pautan seks, gen letal, hemofilia, buta warna, dan golongan darah',
        ],
      },
      {
        topic: 'Evolusi dan Bioteknologi Modern',
        subMaterials: [
          'Teori evolusi Darwin vs Lamarck vs Weismann, bukti-bukti evolusi (homologi, analogi, fosil, biogeografi), dan Hukum Kesetimbangan Hardy-Weinberg',
          'Bioteknologi konvensional (fermentasi tempe, yogurt, keju) vs modern (rekombinasi DNA, kultur jaringan, kloning hewan, teknik CRISPR, antibodi monoklonal)',
        ],
      },
    ],
  },

  // 13. EKONOMI (SMA)
  {
    name: 'Ekonomi',
    aliases: ['ekonomi', 'economy', 'economics'],
    topics: [
      {
        topic: 'Konsep Dasar Ilmu Ekonomi dan Kelangkaan',
        subMaterials: [
          'Masalah pokok ekonomi klasik dan modern (What, How, For Whom), biaya peluang (opportunity cost), dan skala prioritas kebutuhan',
          'Sistem ekonomi tradisional, komando/terpusat, pasar/liberal, dan sistem ekonomi campuran serta ekonomi Pancasila',
          'Pelaku ekonomi dan model diagram arus lingkaran kegiatan ekonomi (Circular Flow Diagram 2, 3, dan 4 sektor)',
        ],
      },
      {
        topic: 'Mekanisme Pasar (Permintaan, Penawaran, dan Elastisitas)',
        subMaterials: [
          'Fungsi permintaan dan penawaran, hukum permintaan-penawaran, kurva pergeseran, dan penentuan harga serta kuantitas keseimbangan pasar',
          'Elastisitas harga permintaan dan penawaran (elastis, inelastis, uniter, elastis sempurna, inelastis sempurna)',
          'Struktur pasar: pasar persaingan sempurna vs pasar persaingan tidak sempurna (monopoli, oligopoli, monopolistik)',
        ],
      },
      {
        topic: 'Bank, Lembaga Keuangan, dan Kebijakan Moneter',
        subMaterials: [
          'Peran Bank Sentral (Bank Indonesia), tugas menjaga stabilitas nilai rupiah, dan sistem pembayaran tunai/nontunai',
          'Instrumen kebijakan moneter: politik diskonto, operasi pasar terbuka, rasio cadangan wajib (GWM), dan kredit selektif',
          'Lembaga Keuangan Bukan Bank (LKBB): pasar modal (saham & obligasi), asuransi, pegadaian, dana pensiun, dan fintech lending',
        ],
      },
      {
        topic: 'Pendapatan Nasional dan Kesenjangan Ekonomi',
        subMaterials: [
          'Konsep PDB/GDP, PNB/GNP, NNP, NNI, Personal Income (PI), dan Disposable Income (DI)',
          'Perhitungan pendapatan nasional dengan pendekatan produksi, pendapatan, dan pengeluaran (Y = C + I + G + (X - M))',
          'Pendapatan per kapita, Kurva Lorenz, dan Koefisien Gini sebagai indikator distribusi pendapatan',
        ],
      },
      {
        topic: 'APBN, APBD, dan Kebijakan Fiskal',
        subMaterials: [
          'Fungsi APBN (otorisasi, perencanaan, pengawasan, alokasi, distribusi, stabilisasi) dan struktur pendapatan/belanja negara',
          'Pajak sebagai sumber pendapatan utama negara, asas pemungutan pajak, dan tarif pajak progresif/proporsional',
          'Kebijakan fiskal ekspansif vs kontraktif dalam mengatasi inflasi dan deflasi ekonomi',
        ],
      },
      {
        topic: 'Perdagangan Internasional dan Kerjasama Ekonomi',
        subMaterials: [
          'Teori keunggulan mutlak (Adam Smith) dan teori keunggulan komparatif (David Ricardo)',
          'Alat pembayaran internasional, valuta asing, kurs beli/jual, neraca perdagangan, dan neraca pembayaran',
          'Kebijakan proteksi perdagangan (tarif bea masuk, kuota impor, subsidi, dumping) dan organisasi kerjasama internasional (ASEAN, WTO, APEC)',
        ],
      },
    ],
  },

  // 14. SOSIOLOGI (SMA)
  {
    name: 'Sosiologi',
    aliases: ['sosiologi', 'sociology'],
    topics: [
      {
        topic: 'Fungsi Sosiologi dan Interaksi Sosial',
        subMaterials: [
          'Objek kajian sosiologi, ciri sosiologi sebagai ilmu (empiris, teoretis, kumulatif, non-etis), dan peran sosiolog dalam pembangunan',
          'Faktor pendorong interaksi sosial: imitasi, sugesti, identifikasi, simpati, empati, dan motivasi',
          'Status sosial (ascribed, achieved, assigned status), peran sosial, dan konflik peran dalam masyarakat',
        ],
      },
      {
        topic: 'Nilai, Norma, dan Keteraturan Sosial',
        subMaterials: [
          'Jenis nilai sosial menurut Prof. Notonagoro (nilai material, vital, rohani) dan fungsinya dalam keteraturan hidup',
          'Tingkatan norma sosial: cara (usage), kebiasaan (folkways), tata kelakuan (mores), dan adat istiadat (custom)',
          'Tahapan sosialisasi kepribadian (preparatory stage, play stage, game stage, generalized other) dan peran agen sosialisasi',
        ],
      },
      {
        topic: 'Penyimpangan Sosial dan Pengendalian Sosial',
        subMaterials: [
          'Bentuk penyimpangan sosial primer vs sekunder, individu vs kelompok, serta teori penyimpangan (labelling, anomie, differential association)',
          'Bentuk pengendalian sosial: preventif, kuratif, persuasif, koersif, dan institusi pengendali sosial (kepolisian, pengadilan, adat)',
        ],
      },
      {
        topic: 'Kelompok Sosial dan Stratifikasi Sosial',
        subMaterials: [
          'Klasifikasi kelompok sosial: Gemeinschaft (paguyuban) vs Gesellschaft (patembayan), in-group vs out-group, kelompok primer vs sekunder',
          'Stratifikasi sosial terbuka, tertutup, dan campuran berdasarkan kriteria kekayaan, kekuasaan, kehormatan, dan ilmu pengetahuan',
          'Diferensiasi sosial berdasarkan ras, etnis, klan, agama, dan gender',
        ],
      },
      {
        topic: 'Konflik Sosial, Kekerasan, dan Perdamaian',
        subMaterials: [
          'Faktor penyebab konflik sosial: perbedaan antarindividu, perbedaan kebudayaan, benturan kepentingan, dan perubahan sosial cepat',
          'Bentuk-bentuk akomodasi resolusi konflik: mediasi, arbitrase, konsiliasi, kompromi, ajudikasi, dan konsensus',
        ],
      },
      {
        topic: 'Perubahan Sosial dan Dampak Globalisasi',
        subMaterials: [
          'Bentuk perubahan sosial: evolusi vs revolusi, terencana vs tidak terencana, perubahan kecil vs besar, serta teori siklus dan linier',
          'Dampak globalisasi, modernisasi, westernisasi, konsumerisme, kesenjangan sosial ekonomi, dan penguatan kearifan lokal',
        ],
      },
    ],
  },

  // 15. GEOGRAFI (SMA)
  {
    name: 'Geografi',
    aliases: ['geografi', 'geography'],
    topics: [
      {
        topic: 'Pengetahuan Dasar Geografi dan Keterampilan Geografis',
        subMaterials: [
          '10 konsep esensial geografi (lokasi, jarak, keterjangkauan, pola, morfologi, aglomerasi, nilai guna, interaksi, diferensiasi area, keterkaitan keruangan)',
          '4 prinsip geografi (persebaran, interelasi, deskripsi, korologi) dan 3 pendekatan (keruangan/spasial, kelingkungan/ekologis, kompleks wilayah)',
        ],
      },
      {
        topic: 'Peta, Penginderaan Jauh, dan Sistem Informasi Geografis (SIG)',
        subMaterials: [
          'Komponen kelengkapan peta, perhitungan skala peta (skala angka, garis, kontur), dan jenis proyeksi peta',
          'Unsur interpretasi citra penginderaan jauh: rona/warna, ukuran, bentuk, tekstur, pola, bayangan, situs, dan asosiasi',
          'Komponen SIG, keunggulan data raster vs vektor, dan analisis overlay (tumpang susun) untuk penataan ruang wilayah',
        ],
      },
      {
        topic: 'Dinamika Litosfer dan Dampaknya terhadap Kehidupan',
        subMaterials: [
          'Struktur lapisan bumi, teori lempeng tektonik, tenaga endogen (tektonisme orogenesa/epirogenesa, vulkanisme, gempa bumi/seisme)',
          'Tenaga eksogen (pelapukan batuan, erosi, mass wasting, sedimentasi), profil tanah, dan metode konservasi tanah',
        ],
      },
      {
        topic: 'Dinamika Atmosfer dan Hidrosfer',
        subMaterials: [
          'Lapisan atmosfer bumi, unsur cuaca & iklim (suhu, kelembapan, tekanan, angin, curah hujan), klasifikasi iklim Koppen dan Schmidt-Ferguson',
          'Siklus hidrologi (pendek, sedang, panjang), Daerah Aliran Sungai (DAS), dan pembagian zona laut berdasarkan kedalaman (litoral, neritik, batial, abisal)',
        ],
      },
      {
        topic: 'Biosfer dan Persebaran Flora Fauna',
        subMaterials: [
          'Bioma daratan dunia (tundra, taiga, hutan gugur, sabana, padang rumput/stepa, gurun, hutan hujan tropis)',
          'Persebaran fauna Indonesia menurut Garis Wallace dan Garis Weber (zona Asiatis, Peralihan/Wallacea, Australis) serta konservasi cagar alam',
        ],
      },
      {
        topic: 'Dinamika Kependudukan dan Interaksi Keruangan Desa-Kota',
        subMaterials: [
          'Faktor dinamika penduduk (kelahiran, kematian, migrasi), perhitungan pertumbuhan penduduk, dan analisis piramida penduduk',
          'Struktur keruangan kota (teori konsentris Burgess, teori sektoral Hoyt, teori inti berganda Harris-Ullman), serta interaksi desa-kota',
        ],
      },
    ],
  },

  // 16. SEJARAH (SMA)
  {
    name: 'Sejarah',
    aliases: ['sejarah', 'history', 'sejarah indonesia'],
    topics: [
      {
        topic: 'Konsep Dasar Ilmu Sejarah dan Penelitian Sejarah',
        subMaterials: [
          'Konsep berpikir diakronik (kronologis), sinkronik, kausalitas, keberlanjutan, dan perubahan dalam sejarah',
          'Tahapan metodologi penelitian sejarah: Heuristik (pengumpulan sumber), Verifikasi/Kritik (intern & ekstern), Interpretasi, dan Historiografi',
        ],
      },
      {
        topic: 'Pergerakan Nasional dan Lahirnya Kesadaran Kebangsaan',
        subMaterials: [
          'Latar belakang politik etis, bangkitnya kaum terpelajar pribumi, peran pers bumiputera dalam menyebarkan ide kebangsaan',
          'Organisasi pergerakan: Budi Utomo, Sarekat Islam, Indische Partij, Perhimpunan Indonesia, PNI, dan Kongres Sumpah Pemuda 28 Oktober 1928',
        ],
      },
      {
        topic: 'Pendudukan Jepang dan Proklamasi Kemerdekaan Indonesia',
        subMaterials: [
          'Kebijakan militer dan eksploitasi Jepang (Romusha, PETA, Heiho, Jawa Hokokai) serta respon tokoh nasionalis',
          'Sidang BPUPKI, perumusan dasar negara, peristiwa Rengasdengklok, perumusan teks proklamasi di kediaman Maeda, dan proklamasi 17 Agustus 1945',
        ],
      },
      {
        topic: 'Perjuangan Mempertahankan Kemerdekaan (1945-1949)',
        subMaterials: [
          'Perjuangan fisik bersenjata: Pertempuran 10 November Surabaya, Ambarawa, Bandung Lautan Api, Medan Area, Serangan Umum 1 Maret',
          'Perjuangan diplomasi: Perjanjian Linggarjati, Perjanjian Renville, Roem-Royen, dan Konferensi Meja Bundar (KMB) pengakuan kedaulatan',
        ],
      },
      {
        topic: 'Indonesia Masa Demokrasi Parlementer, Terpimpin, dan Orde Baru',
        subMaterials: [
          'Masa Demokrasi Liberal/Parlementer: sistem kabinet, Pemilu 1955, Dekrit Presiden 5 Juli 1959',
          'Masa Demokrasi Terpimpin: politik konfrontasi Dwikora, GNB, dan dinamika peristiwa G30S/PKI',
          'Masa Orde Baru: Supersemar, stabilitas politik, Repelita, krisis moneter 1998, hingga gerakan reformasi',
        ],
      },
    ],
  },

  // 17. PENDIDIKAN AGAMA DAN BUDI PEKERTI
  {
    name: 'Pendidikan Agama dan Budi Pekerti',
    aliases: ['pendidikan agama dan budi pekerti', 'pai', 'pendidikan agama islam', 'agama', 'agama islam'],
    topics: [
      {
        topic: 'Kajian Al-Qur\'an dan Hadis (Hukum Tajwid & Makna Ayat)',
        subMaterials: [
          'Hukum bacaan nun mati/tanwin (idzhar, idgham bighunnah/bilaghunnah, iqlab, ikhfa), mim mati, hukum mad, dan qalqalah',
          'Tafsir tematik ayat-ayat tentang menuntut ilmu, toleransi beragama, bersikap adil, dan menjaga kelestarian alam',
        ],
      },
      {
        topic: 'Aqidah dan Penguatan Rukun Iman',
        subMaterials: [
          'Iman kepada Allah SWT melalui Asmaul Husna (Al-Alim, Al-Khabir, As-Sami\', Al-Bashir, Al-Adl)',
          'Iman kepada Malaikat, Kitab-Kitab Allah (Taurat, Zabur, Injil, Al-Qur\'an), Rasul-Rasul Allah, Hari Akhir/Kiamat, serta Qadha dan Qadar',
        ],
      },
      {
        topic: 'Akhlak Terpuji (Mahmudah) vs Akhlak Tercela (Mazmumah)',
        subMaterials: [
          'Akhlak berbakti kepada orang tua (birrul walidain) dan guru, sikap jujur, amanah, pemaaf, istiqamah, dan kerja keras',
          'Menghindari akhlak tercela: ghibah, fitnah, riya, sum\'ah, hasad (dengki), takabur (sombong), dan bahaya miras/judi/pergaulan bebas',
        ],
      },
      {
        topic: 'Fiqih Ibadah dan Muamalah',
        subMaterials: [
          'Thaharah (bersuci dari hadas kecil dan besar), tata cara shalat wajib, shalat berjamaah, shalat sunnah, dan sujud sahwi/syukur/tilawah',
          'Zakat fitrah & zakat mal, puasa wajib Ramadhan & puasa sunnah, haji & umrah, serta kurban & aqiqah',
          'Prinsip muamalah Islam: jual beli yang sah dan halal, larangan riba, syirkah, perbankan syariah, dan asuransi syariah',
        ],
      },
      {
        topic: 'Sejarah Peradaban Islam (SKI)',
        subMaterials: [
          'Strategi dakwah Rasulullah SAW periode Makkah dan Madinah, Piagam Madinah, dan peristiwa Fathu Makkah',
          'Kepemimpinan Khulafaur Rasyidin (Abu Bakar, Umar bin Khattab, Utsman bin Affan, Ali bin Abi Thalib)',
          'Masa keemasan peradaban Islam Dinasti Umayyah, Abbasiyah, dan sejarah masuknya Islam di Indonesia via Wali Songo',
        ],
      },
    ],
  },

  // 18. PJOK
  {
    name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    aliases: ['pjok', 'pendidikan jasmani, olahraga, dan kesehatan', 'penjas', 'olahraga', 'penjaskes'],
    topics: [
      {
        topic: 'Permainan Bola Besar (Sepak Bola, Bola Voli, Bola Basket)',
        subMaterials: [
          'Teknik dasar passing, dribbling, shooting, controlling pada sepak bola, formasi tim, dan regulasi offside',
          'Teknik passing bawah, passing atas, servis, smash, block pada bola voli, serta aturan perolehan poin',
          'Teknik chest pass, bounce pass, lay-up shoot, pivot, zone defense bola basket, dan peraturan pelanggaran foul',
        ],
      },
      {
        topic: 'Permainan Bola Kecil (Bulutangkis, Tenis Meja, Kasti/Rounders)',
        subMaterials: [
          'Teknik pegangan raket (forehand/backhand), pukulan servis, lob, dropshot, smash pada bulutangkis',
          'Teknik push, drive, block, spin, servis pada tenis meja, dan peraturan rally meja',
          'Teknik melempar bola mendatar/melambung, menangkap bola, memukul, dan lari pos pada rounders/kasti',
        ],
      },
      {
        topic: 'Cabang Olahraga Atletik (Lari, Lompat, Lempar, Tolak)',
        subMaterials: [
          'Lari jarak pendek (sprint 100m) menggunakan start jongkok, fase akselerasi, dan teknik melewati garis finish',
          'Lari estafet (teknik visual & non-visual pergantian tongkat) dan jalan cepat',
          'Teknik awalan, tumpuan, melayang di udara, dan pendaratan pada lompat jauh gaya menggantung / berjalan di udara',
          'Teknik memegang peluru, awalan geser (ortodoks) dan putar (O\'Brien) pada tolak peluru',
        ],
      },
      {
        topic: 'Kebugaran Jasmani dan Pola Hidup Sehat',
        subMaterials: [
          'Komponen kebugaran jasmani: daya tahan jantung-paru (aerobik), kekuatan otot, kelenturan (fleksibilitas), dan kelincahan',
          'Latihan sirkuit (circuit training), tes kebugaran MFT/beep test, dan pengukuran IMT (Indeks Massa Tubuh)',
          'Pola makan bergizi seimbang (Isi Piringku), penanganan cedera olahraga ringan (RICE), dan pencegahan penyakit menular',
        ],
      },
      {
        topic: 'Senam Lantai dan Aktivitas Gerak Berirama',
        subMaterials: [
          'Rangkaian gerak senam lantai: guling depan (forward roll), guling belakang (back roll), sikap lilin, kayang, dan meroda',
          'Variasi langkah kaki dan ayunan lengan mengikuti irama musik pada senam ritmik kelompok',
        ],
      },
    ],
  },

  // 19. SENI DAN BUDAYA / SENI RUPA
  {
    name: 'Seni dan Budaya',
    aliases: ['seni dan budaya', 'seni rupa / seni musik / seni tari', 'seni rupa', 'seni musik', 'seni tari', 'seni'],
    topics: [
      {
        topic: 'Unsur dan Prinsip Seni Rupa Dua Dimensi',
        subMaterials: [
          'Unsur seni rupa: titik, garis, bidang, bentuk, ruang, warna (primer, sekunder, tersier), tekstur, dan gelap-terang',
          'Prinsip seni rupa: kesatuan (unity), keseimbangan (balance), proporsi, irama (rhythm), keselarasan, dan pusat perhatian',
          'Teknik menggambar bentuk objek alam benda, teknik arsir, dussel, pointilis, aquarel, dan perspektif 1-2 titik hilang',
        ],
      },
      {
        topic: 'Seni Rupa Tiga Dimensi dan Seni Kriya',
        subMaterials: [
          'Karakteristik karya 3 dimensi, teknik pahat, teknik butsir, teknik cor, teknik cetak tuang, dan teknik anyam',
          'Eksplorasi ragam motif batik nusantara, seni keramik, dan apresiasi karya seni rupa terapan',
        ],
      },
      {
        topic: 'Seni Musik: Unsur Musik dan Alat Musik Tradisional',
        subMaterials: [
          'Unsur musik: melodi, ritme/irama, birama, harmoni, tangga nada diatonis mayor/minor dan pentatonis, tempo, dinamika',
          'Alat musik ritmis, melodis, dan harmonis nusantara (gamelan, angklung, sasando, kolintang, tifa) dan teknik bermain ansambel',
          'Teknik vokal bernyanyi solo dan paduan suara: pernapasan diafragma, artikulasi, intonasi, dan pembawaan ekspresi lagu',
        ],
      },
      {
        topic: 'Seni Tari Tradisional Nusantara',
        subMaterials: [
          'Elemen dasar gerak tari: ruang gerak, waktu/tempo, tenaga, dan level gerak (tinggi, sedang, rendah)',
          'Pola lantai tari (garis lurus, diagonal, melingkar, zig-zag) dan kesesuaian gerak dengan iringan musik tari',
          'Karakteristik tari tunggal, berpasangan, kelompok, tata rias, dan busana tari tradisional daerah',
        ],
      },
    ],
  },

  // 20. PRAKARYA / PKK
  {
    name: 'Prakarya',
    aliases: ['prakarya', 'produk kreatif dan kewirausahaan (pkk)', 'pkk', 'kewirausahaan'],
    topics: [
      {
        topic: 'Perencanaan Usaha dan Analisis Peluang Produk Kreatif',
        subMaterials: [
          'Analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) dan identifikasi kebutuhan pasar lokal',
          'Perhitungan Harga Pokok Produksi (HPP), penentuan harga jual, dan perhitungan titik impas / Break Even Point (BEP)',
          'Strategi pemasaran bauran 4P (Product, Price, Place, Promotion) dan promosi digital di media sosial / marketplace',
        ],
      },
      {
        topic: 'Kerajinan dari Bahan Keras, Lunak, dan Limbah',
        subMaterials: [
          'Karakteristik bahan alam (kayu, bambu, rotan, tanah liat) dan bahan sintetis/limbah (plastik, kain perca, kertas kardus)',
          'Teknik pembuatan kerajinan: mengukir, memotong, menenun, merakit, dan finishing pelapisan vernis/cat yang aman',
          'Desain pengemasan produk kerajinan yang estetik, fungsional, dan ramah lingkungan',
        ],
      },
      {
        topic: 'Pengolahan Bahan Pangan Nusantara',
        subMaterials: [
          'Pengolahan komoditas pangan nabati dan hewani khas daerah menjadi makanan utama dan camilan bernilai ekonomis',
          'Teknik pengolahan panas basah (boiling, steaming, poaching) dan panas kering (baking, grilling, deep frying)',
          'Prinsip higienitas sanitasi pangan, kemasan kedap udara, dan teknik pengawetan makanan alami tanpa kimia berbahaya',
        ],
      },
      {
        topic: 'Budidaya Tanaman dan Ternak / Perikanan',
        subMaterials: [
          'Teknik budidaya tanaman pangan/hortikultura dengan media tanah, hidroponik, atau vertikultur',
          'Pemilihan bibit unggul, pemupukan organik, penanganan hama terpadu, dan manajemen panen/pascapanen',
          'Teknik budidaya ikan konsumsi air tawar (lele, nila, gurami) dan pemeliharaan kualitas air kolam',
        ],
      },
    ],
  },

  // 21. KEJURUAN SMK (Dasar-dasar Program Keahlian / Konsentrasi Keahlian)
  {
    name: 'Dasar-dasar Program Keahlian',
    aliases: ['dasar-dasar program keahlian', 'konsentrasi keahlian kejuruan', 'kejuruan', 'smk'],
    topics: [
      {
        topic: 'Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH)',
        subMaterials: [
          'Penerapan standar APD (Alat Pelindung Diri), identifikasi potensi bahaya kerja di bengkel/laboratorium, dan rambu-rambu K3',
          'Pencegahan kebakaran menggunakan APAR, prosedur tanggap darurat P3K, dan budaya industri 5R/5S (Ringkas, Rapi, Resik, Rawat, Rajin)',
          'Pengelolaan limbah bahan berbahaya dan beracun (B3) sesuai regulasi kelestarian lingkungan hidup',
        ],
      },
      {
        topic: 'Gambar Teknik dan Standar Operasional Prosedur (SOP)',
        subMaterials: [
          'Standar garis gambar teknik ISO, proyeksi piktorial (isometri/dimetri), proyeksi ortogonal (sudut pertama & ketiga)',
          'Pemberian ukuran dimensi, toleransi geometri, pembacaan diagram skematik teknis, dan kepatuhan SOP perakitan',
        ],
      },
      {
        topic: 'Penggunaan Alat Ukur Presisi dan Peralatan Bengkel',
        subMaterials: [
          'Penggunaan, pembacaan skala, dan kalibrasi jangka sorong (vernier caliper), mikrometer sekrup, dan dial gauge indicator',
          'Penggunaan alat ukur elektrik multimeter digital/analog, osiloskop, dan peralatan perkakas tangan/mesin industri',
        ],
      },
    ],
  },
];

// Fallback topics when subject is custom or not explicitly found
export const DEFAULT_FALLBACK_TOPICS: TopicItem[] = [
  {
    topic: 'Konsep Dasar dan Teori Pokok Materi',
    subMaterials: [
      'Pemahaman definisi, ruang lingkup konsep inti, istilah kunci, dan prinsip dasar materi',
      'Identifikasi karakteristik, klasifikasi komponen, dan struktur hubungan antarunsur materi',
      'Semua cakupan konsep pokok materi ini secara komprehensif',
    ],
  },
  {
    topic: 'Penerapan Praktis dan Pemecahan Masalah Kontekstual',
    subMaterials: [
      'Studi kasus nyata dalam kehidupan sehari-hari, analisis data informasi, dan pemecahan masalah',
      'Penerapan rumus/metode sistematis dalam menyelesaikan permasalahan kontekstual berbobot HOTS',
    ],
  },
  {
    topic: 'Analisis Kritis, Evaluasi, dan Refleksi Materi',
    subMaterials: [
      'Menganalisis perbandingan, kelebihan vs kelemahan, sebab-akibat, serta penarikan kesimpulan logis',
      'Evaluasi kritis terhadap fenomena relevan dan perumusan alternatif solusi kreatif',
    ],
  },
];

/**
 * Normalizes subject string for flexible matching
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Finds topic suggestions for a given subject
 */
export function getTopicSuggestions(subjectName: string): TopicItem[] {
  if (!subjectName) return DEFAULT_FALLBACK_TOPICS;

  const normalized = normalizeString(subjectName);

  // Exact or alias match
  for (const item of SUBJECT_TOPICS_DATABASE) {
    if (normalizeString(item.name) === normalized) {
      return item.topics;
    }
    for (const alias of item.aliases) {
      if (normalized.includes(alias) || alias.includes(normalized)) {
        return item.topics;
      }
    }
  }

  // Keyword partial match
  for (const item of SUBJECT_TOPICS_DATABASE) {
    for (const alias of item.aliases) {
      const words = alias.split(' ');
      if (words.some((w) => w.length > 3 && normalized.includes(w))) {
        return item.topics;
      }
    }
  }

  return DEFAULT_FALLBACK_TOPICS;
}

/**
 * Finds sub-material suggestions for a given subject and topic
 */
export function getSubMaterialSuggestions(subjectName: string, topicName: string): string[] {
  const topics = getTopicSuggestions(subjectName);
  if (!topics || topics.length === 0) return [];

  const found = topics.find(
    (t) => normalizeString(t.topic) === normalizeString(topicName) || topicName.includes(t.topic) || t.topic.includes(topicName)
  );

  if (found && found.subMaterials && found.subMaterials.length > 0) {
    return found.subMaterials;
  }

  // If specific topic not matched, aggregate sub-materials from the subject topics
  const aggregated: string[] = [];
  topics.slice(0, 3).forEach((t) => {
    if (t.subMaterials && t.subMaterials[0]) {
      aggregated.push(t.subMaterials[0]);
    }
  });

  return aggregated.length > 0
    ? aggregated
    : [
        'Fokuskan pada konsep inti, studi kasus kontekstual, dan pemecahan masalah bertingkat HOTS',
        'Cakup seluruh sub-materi dari bab ini secara proporsional dan komprehensif',
      ];
}
