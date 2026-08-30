import { EducationLevel, CurriculumType } from '@/types/exam';

export interface TopicItem {
  topic: string;
  subMaterials: string[];
}

export interface SubjectData {
  name: string;
  aliases: string[];
  topics: TopicItem[];
}

// ==========================================
// 1. DATABASE TOPIK KHUSUS JENJANG SD / MI
// ==========================================
export const SD_SUBJECT_TOPICS: SubjectData[] = [
  // MATEMATIKA SD
  {
    name: 'Matematika',
    aliases: ['matematika', 'matematika sd', 'mtk', 'math'],
    topics: [
      {
        topic: 'Bilangan Cacah, Penjumlahan, dan Pengurangan (Kelas 1-2 / Fase A)',
        subMaterials: [
          'Mengenal lambang dan nama bilangan cacah sampai 100, nilai tempat (satuan, puluhan), serta perbandingan lebih besar/lebih kecil',
          'Penjumlahan dan pengurangan bilangan cacah tanpa teknik menyimpan/meminjam dan dengan teknik menyimpan',
          'Pola gambar dan pola bilangan membesar/mengecil serta penyelesaian masalah sehari-hari menggunakan benda konkret',
          'Cakupan komprehensif materi bilangan cacah, nilai tempat, dan operasi penjumlahan/pengurangan dasar',
        ],
      },
      {
        topic: 'Perkalian, Pembagian, dan Operasi Hitung Campuran (Kelas 3-4 / Fase B)',
        subMaterials: [
          'Konsep perkalian sebagai penjumlahan berulang dan pembagian sebagai pengurangan berulang sampai 100',
          'Perkalian bersusun dan pembagian bersusun (porogapit) bilangan cacah hingga ribuan',
          'Operasi hitung campuran penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah dalam soal cerita',
          'Faktor dan kelipatan bilangan, faktor persekutuan terbesar (FPB), dan kelipatan persekutuan terkecil (KPK) sederhana',
        ],
      },
      {
        topic: 'Pecahan, Desimal, dan Persen (Kelas 4-6 / Fase B & C)',
        subMaterials: [
          'Mengenal pecahan sederhana menggunakan gambar konkret (arsiran pecahan 1/2, 1/3, 1/4, dll) dan pecahan senilai',
          'Membandingkan dan mengurutkan pecahan biasa dan pecahan campuran',
          'Operasi penjumlahan dan pengurangan pecahan dengan penyebut sama dan berbeda',
          'Mengubah bentuk pecahan biasa ke pecahan desimal dan persen serta operasi hitungnya dalam kehidupan sehari-hari',
        ],
      },
      {
        topic: 'Keliling dan Luas Bangun Datar (Kelas 4-6 / Fase B & C)',
        subMaterials: [
          'Ciri-ciri dan sifat bangun datar (persegi, persegi panjang, segitiga, jajar genjang, trapesium, layang-layang, belah ketupat, lingkaran)',
          'Perhitungan keliling dan luas persegi, persegi panjang, dan segitiga dalam konteks soal cerita',
          'Unsur-unsur lingkaran (jari-jari, diameter, busur, juring, tembereng) serta perhitungan keliling dan luas lingkaran',
          'Penyelesaian masalah kontekstual yang melibatkan gabungan luas dan keliling bangun datar',
        ],
      },
      {
        topic: 'Volume dan Luas Permukaan Bangun Ruang (Kelas 5-6 / Fase C)',
        subMaterials: [
          'Ciri-ciri bangun ruang kubus dan balok (rusuk, titik sudut, sisi) dan jaring-jaring bangun ruang',
          'Menghitung volume kubus dan balok dengan kubus satuan dan rumus baku (V = s³ dan V = p × l × t)',
          'Menghitung luas permukaan kubus dan balok dalam penerapan soal kehidupan nyata',
          'Pengenalan bangun ruang prisma, limas, tabung, kerucut, dan bola beserta rumus volumenya',
        ],
      },
      {
        topic: 'Statistika dan Pengolahan Data Sederhana (Kelas 4-6 / Fase B & C)',
        subMaterials: [
          'Pengumpulan data melalui pencatatan langsung, turus (tally), dan wawancara sederhana',
          'Penyajian data dalam bentuk tabel daftar, diagram gambar (piktogram), diagram batang, dan diagram garis',
          'Membaca dan menafsirkan sajian data serta menentukan nilai rata-rata (mean), nilai tengah (median), dan modus',
        ],
      },
      {
        topic: 'Pengukuran Panjang, Massa/Berat, Waktu, dan Debit (Kelas 3-6)',
        subMaterials: [
          'Satuan baku panjang (km, hm, dam, m, dm, cm, mm) dan alat ukurnya (penggaris, meteran gulung)',
          'Satuan baku massa/berat (kg, gram, ons, kuintal, ton) dan hubungan antar satuan berat',
          'Satuan waktu (jam, menit, detik, hari, minggu, bulan, tahun) dan penyelesaian durasi kegiatan',
          'Kecepatan sebagai perbandingan jarak terhadap waktu dan debit air (volume per satuan waktu)',
        ],
      },
    ],
  },

  // BAHASA INDONESIA SD
  {
    name: 'Bahasa Indonesia',
    aliases: ['bahasa indonesia', 'b. indonesia', 'indonesian', 'bina'],
    topics: [
      {
        topic: 'Mengenal Huruf, Suku Kata, dan Membaca Lancar (Kelas 1-2 / Fase A)',
        subMaterials: [
          'Pengenalan huruf vokal dan konsonan, merangkai suku kata menjadi kata bermakna (ba-bi-bu-be-bo)',
          'Membaca kata benda sehari-hari, kosakata anggota tubuh, keluarga, dan lingkungan sekitar',
          'Membaca nyaring kalimat sederhana dengan intonasi dan pelafalan yang tepat dan jelas',
        ],
      },
      {
        topic: 'Membaca Pemahaman Cerita Anak, Dongeng, dan Fabel (Kelas 1-4 / Fase A & B)',
        subMaterials: [
          'Menemukan tokoh, watak tokoh, latar tempat/waktu, dan alur peristiwa dalam dongeng fabel',
          'Menjawab pertanyaan adiksimba (apa, siapa, di mana, kapan, mengapa, bagaimana) dari teks bacaan anak',
          'Menyimpulkan pesan moral atau amanat yang terkandung dalam cerita anak',
        ],
      },
      {
        topic: 'Teks Petunjuk dan Arahan Sederhana (Kelas 3-4 / Fase B)',
        subMaterials: [
          'Ciri-ciri teks petunjuk membuat atau melakukan sesuatu (resep anak, petunjuk minum obat, aturan permainan)',
          'Menyusun urutan langkah-langkah yang logis dan penggunaan kalimat perintah santun',
        ],
      },
      {
        topic: 'Teks Deskripsi Objek Lingkungan Sekitar (Kelas 4-5 / Fase B & C)',
        subMaterials: [
          'Mendeskripsikan benda, hewan peliharaan, tempat wisata, atau orang terdekat secara rinci',
          'Menggunakan pancaindra dalam menggambarkan warna, bentuk, rasa, aroma, dan tekstur objek',
        ],
      },
      {
        topic: 'Teks Narasi dan Menulis Pengalaman Pribadi (Kelas 4-6 / Fase B & C)',
        subMaterials: [
          'Menulis karangan narasi pengalaman liburan, kegiatan sekolah, atau bersama keluarga secara kronologis',
          'Penggunaan konjungsi waktu (setelah itu, kemudian, lalu, akhirnya) dalam merangkai alur cerita',
        ],
      },
      {
        topic: 'Ide Pokok dan Kalimat Utama Paragraf (Kelas 5-6 / Fase C)',
        subMaterials: [
          'Menentukan kalimat utama dan kalimat penjelas pada paragraf deduktif dan induktif',
          'Menemukan gagasan pokok / ide pokok dalam teks bacaan eksplanasi anak',
          'Membuat ringkasan atau simpulan isi bacaan secara singkat dan padat',
        ],
      },
      {
        topic: 'Puisi Anak, Pantun, dan Ungkapan Sederhana (Kelas 4-6 / Fase B & C)',
        subMaterials: [
          'Membaca dan mendeklamasikan puisi anak dengan ekspresi, lafal, dan intonasi yang sesuai',
          'Ciri-ciri pantun (4 baris, rima a-b-a-b, sampiran, dan isi) serta melengkapi pantun rumpang',
          'Mengenal makna kiasan sederhana dan ungkapan kata (rendah hati, buah tangan, kutu buku, dll)',
        ],
      },
      {
        topic: 'Teks Formulir, Surat Undangan, dan Pengumuman (Kelas 6 / Fase C)',
        subMaterials: [
          'Mengisi formulir pendaftaran kegiatan, kartu anggota perpustakaan, dan daftar riwayat hidup sederhana',
          'Bagian-bagian surat undangan resmi dan tidak resmi (pembuka, isi, penutup, tanggal, tanda tangan)',
          'Menulis dan memahami pengumuman singkat di lingkungan sekolah',
        ],
      },
      {
        topic: 'Kaidah Kebahasaan, EYD, dan Kosakata Baku (Kelas 4-6 / Fase B & C)',
        subMaterials: [
          'Penggunaan huruf kapital untuk nama orang, nama tempat/kota, nama hari/bulan, dan awal kalimat',
          'Penggunaan tanda baca titik (.), koma (,), tanda tanya (?), tanda seru (!), dan tanda petik ("...")',
          'Membedakan kata baku dan tidak baku serta mencari arti kata dalam kamus (KBBI)',
        ],
      },
    ],
  },

  // IPAS SD (KURIKULUM MERDEKA)
  {
    name: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    aliases: ['ipas', 'ilmu pengetahuan alam dan sosial', 'sains dan sosial', 'ipas sd'],
    topics: [
      {
        topic: 'Bagian Tubuh Tumbuhan dan Fotosintesis (Kelas 4 / Fase B)',
        subMaterials: [
          'Fungsi akar, batang, daun, bunga, buah, dan biji pada tumbuhan',
          'Proses fotosintesis pada daun (bahan: air, karbon dioksida, cahaya matahari, klorofil; hasil: glukosa dan oksigen)',
          'Perkembangbiakan tumbuhan secara generatif (penyerbukan) dan vegetatif (alami dan buatan)',
        ],
      },
      {
        topic: 'Wujud Zat dan Perubahannya di Sekitar Kita (Kelas 4 / Fase B)',
        subMaterials: [
          'Sifat dan karakteristik benda padat, cair, dan gas',
          'Perubahan wujud benda: mencair, membeku, menguap, mengembun, menyublim, dan mengkristal dalam peristiwa sehari-hari',
        ],
      },
      {
        topic: 'Gaya dan Pengaruhnya terhadap Gerak Benda (Kelas 4 / Fase B)',
        subMaterials: [
          'Jenis-jenis gaya: gaya otot, gaya gesek, gaya pegas, gaya magnet, dan gaya gravitasi bumi',
          'Pengaruh gaya terhadap perubahan bentuk benda, arah gerak, dan kecepatan gerak benda',
        ],
      },
      {
        topic: 'Bentuk-Bentuk Energi dan Perubahannya (Kelas 4-5 / Fase B & C)',
        subMaterials: [
          'Macam-macam sumber energi: matahari, angin, air, biomassa, listrik, dan panas bumi',
          'Transformasi energi (energi listrik menjadi gerak, panas, cahaya, dan bunyi) pada peralatan rumah tangga',
          'Upaya penghematan energi dan pemanfaatan energi terbarukan ramah lingkungan',
        ],
      },
      {
        topic: 'Ekosistem, Rantai Makanan, dan Jaring-Jaring Makanan (Kelas 5 / Fase C)',
        subMaterials: [
          'Komponen biotik (produsen, konsumen I/II/III, pengurai/dekomposer) dan abiotik dalam ekosistem',
          'Aliran energi dalam rantai makanan dan jaring-jaring makanan di darat dan di perairan',
          'Hubungan simbiosis antarmakhluk hidup (mutualisme, komensalisme, parasitisme)',
        ],
      },
      {
        topic: 'Siklus Air dan Upaya Pelestarian Lingkungan Hidup (Kelas 5 / Fase C)',
        subMaterials: [
          'Tahapan siklus air: evaporasi, transpirasi, kondensasi, presipitasi, dan infiltrasi',
          'Pentingnya ketersediaan air bersih dan pengaruh aktivitas manusia terhadap daur air',
          'Dampak pencemaran tanah, air, dan udara serta gerakan 3R (Reduce, Reuse, Recycle) dan reboisasi',
        ],
      },
      {
        topic: 'Sistem Organ Tubuh Manusia (Pencernaan, Pernapasan, Peredaran Darah) (Kelas 5 / Fase C)',
        subMaterials: [
          'Organ pernapasan manusia (hidung, tenggorokan, trakea, bronkus, paru-paru) dan mekanisme bernapas',
          'Organ pencernaan manusia (mulut, kerongkongan, lambung, usus halus, usus besar, anus) dan nutrisi makanan',
          'Organ peredaran darah manusia (jantung, pembuluh nadi/vena) dan peredaran darah besar/kecil',
        ],
      },
      {
        topic: 'Kenampakan Alam, Peta, dan Keragaman Budaya Indonesia (Kelas 4-6 / Fase B & C)',
        subMaterials: [
          'Komponen peta (judul, skala, legenda, arah mata angin, simbol) dan membaca peta wilayah',
          'Kenampakan alam daratan (gunung, dataran tinggi/rendah) dan perairan (sungai, danau, laut, selat)',
          'Keragaman suku bangsa, rumah adat, pakaian daerah, tarian tradisional, dan senjata tradisional di Indonesia',
        ],
      },
      {
        topic: 'Kegiatan Ekonomi Masyarakat dan Penggunaan Uang (Kelas 4-6 / Fase B & C)',
        subMaterials: [
          'Kegiatan ekonomi: produksi (menghasilkan), distribusi (menyalurkan), dan konsumsi (menggunakan)',
          'Jenis-jenis usaha ekonomi agraris, peternakan, perikanan, industri, perdagangan, dan jasa pariwisata',
          'Nilai uang, kebutuhan vs keinginan, pengelolaan uang saku, dan pentingnya menabung',
        ],
      },
      {
        topic: 'Perjuangan Bangsa Indonesia dan Proklamasi Kemerdekaan (Kelas 6 / Fase C)',
        subMaterials: [
          'Tokoh pahlawan nasional melawan penjajah (Pattimura, Diponegoro, Imam Bonjol, Cut Nyak Dien, dll)',
          'Peristiwa menjelang kemerdekaan: Rengasdengklok, penyusunan naskah proklamasi di rumah Laksamana Maeda',
          'Pembacaan teks proklamasi 17 Agustus 1945 oleh Ir. Soekarno dan Moh. Hatta serta makna kemerdekaan',
        ],
      },
    ],
  },

  // IPA SD (KURIKULUM 2013)
  {
    name: 'Ilmu Pengetahuan Alam (IPA)',
    aliases: ['ipa', 'ilmu pengetahuan alam', 'sains', 'science'],
    topics: [
      {
        topic: 'Bagian Tubuh Tumbuhan, Hewan, dan Fungsinya',
        subMaterials: [
          'Fungsi akar, batang, daun, bunga, buah, dan biji pada tumbuhan',
          'Bagian tubuh hewan dan adaptasi morfologi hewan terhadap lingkungannya',
          'Proses fotosintesis pada daun tumbuhan hijau',
        ],
      },
      {
        topic: 'Wujud Benda dan Perubahan Sifat Benda',
        subMaterials: [
          'Sifat benda padat, cair, dan gas',
          'Peristiwa mencair, membeku, menguap, mengembun, menyublim, dan mengkristal',
        ],
      },
      {
        topic: 'Gaya, Gerak, dan Pesawat Sederhana',
        subMaterials: [
          'Pengaruh gaya otot, gesek, pegas, gravitasi, dan magnet terhadap benda',
          'Pesawat sederhana (pengungkit/tuas, bidang miring, katrol, roda berporos) dalam memudahkan pekerjaan',
        ],
      },
      {
        topic: 'Bentuk Energi, Bunyi, dan Cahaya',
        subMaterials: [
          'Sumber energi dan perubahan energi listrik, panas, gerak, dan kimia',
          'Sifat-sifat bunyi (merambat, memantul, menyerap) dan indra pendengaran telinga',
          'Sifat-sifat cahaya (merambat lurus, menembus benda bening, dipantulkan, dibiaskan, diuraikan)',
        ],
      },
      {
        topic: 'Ekosistem, Daur Hidup Hewan, dan Pelestarian Lingkungan',
        subMaterials: [
          'Metamorfosis sempurna dan tidak sempurna pada hewan (kupu-kupu, nyamuk, katak, kecoa, belalang)',
          'Rantai makanan, jaring-jaring makanan, dan simbiosis antarmakhluk hidup',
          'Upaya pelestarian hewan dan tumbuhan langka di Indonesia (taman nasional, cagar alam)',
        ],
      },
      {
        topic: 'Sistem Organ Tubuh Manusia (Pernapasan, Pencernaan, Peredaran Darah)',
        subMaterials: [
          'Organ pernapasan manusia dan mekanisme bernapas',
          'Organ pencernaan makanan dan fungsinya serta penyakit saluran cerna',
          'Jantung dan pembuluh darah dalam sistem sirkulasi darah manusia',
        ],
      },
      {
        topic: 'Siklus Air dan Tata Surya Sederhana',
        subMaterials: [
          'Tahapan siklus hidrologi air di bumi dan dampaknya bagi kehidupan',
          'Mengenal planet-planet dalam tata surya, rotasi dan revolusi bumi/bulan serta akibatnya (siang-malam, gerhana)',
        ],
      },
    ],
  },

  // IPS SD (KURIKULUM 2013)
  {
    name: 'Ilmu Pengetahuan Sosial (IPS)',
    aliases: ['ips', 'ilmu pengetahuan sosial', 'social studies'],
    topics: [
      {
        topic: 'Kenampakan Alam, Buatan, dan Pembacaan Peta',
        subMaterials: [
          'Komponen peta, skala, simbol, dan membaca peta lingkungan setempat',
          'Kenampakan alam daratan, perairan, dan kenampakan buatan (waduk, pelabuhan, jalan)',
        ],
      },
      {
        topic: 'Keragaman Suku, Agama, dan Budaya Indonesia',
        subMaterials: [
          'Keragaman suku bangsa, bahasa daerah, pakaian adat, rumah adat, dan tarian nusantara',
          'Menghargai keragaman sosial budaya dalam bingkai Bhinneka Tunggal Ika',
        ],
      },
      {
        topic: 'Kegiatan Ekonomi dan Pemanfaatan Sumber Daya Alam',
        subMaterials: [
          'Pemanfaatan sumber daya alam hayati dan non-hayati di berbagai wilayah Indonesia',
          'Kegiatan produksi, distribusi, dan konsumsi serta jenis-jenis usaha masyarakat',
        ],
      },
      {
        topic: 'Sejarah Kerajaan Nusantara dan Peninggalan Sejarah',
        subMaterials: [
          'Kerajaan Hindu-Buddha (Kutai, Tarumanegara, Sriwijaya, Majapahit) dan peninggalannya',
          'Kerajaan Islam di Indonesia (Samudera Pasai, Demak, Mataram, Banten, Gowa-Tallo)',
        ],
      },
      {
        topic: 'Perjuangan Melawan Penjajah dan Proklamasi Kemerdekaan',
        subMaterials: [
          'Perjuangan pahlawan daerah melawan penjajah Belanda dan Jepang',
          'Peristiwa sekitar proklamasi kemerdekaan Republik Indonesia 17 Agustus 1945',
        ],
      },
      {
        topic: 'Kerjasama Kawasan ASEAN dan Karakteristik Geografis',
        subMaterials: [
          'Negara-negara anggota ASEAN, letak geografis, dan kondisi sosial budaya Asia Tenggara',
          'Peran Indonesia dalam kerjasama bidang ekonomi dan sosial budaya di ASEAN',
        ],
      },
    ],
  },

  // PENDIDIKAN PANCASILA / PPKn SD
  {
    name: 'Pendidikan Pancasila',
    aliases: ['pendidikan pancasila', 'ppkn', 'pancasila', 'kewarganegaraan', 'pkn'],
    topics: [
      {
        topic: 'Simbol Garuda Pancasila dan Nilai Sila Pancasila',
        subMaterials: [
          'Mengenal lambang negara Garuda Pancasila, semboyan Bhinneka Tunggal Ika, dan 5 simbol sila (Bintang, Rantai, Pohon Beringin, Kepala Banteng, Padi dan Kapas)',
          'Penerapan nilai-nilai Pancasila dalam kehidupan sehari-hari di rumah, sekolah, dan lingkungan sekitar',
        ],
      },
      {
        topic: 'Aturan dan Norma di Rumah, Sekolah, dan Masyarakat',
        subMaterials: [
          'Mengenal aturan tertulis dan tidak tertulis di rumah dan sekolah',
          'Manfaat mematuhi aturan serta akibat melanggar aturan bagi diri sendiri dan orang lain',
        ],
      },
      {
        topic: 'Hak dan Kewajiban Anak di Rumah dan Sekolah',
        subMaterials: [
          'Membedakan hak (sesuatu yang diterima) dan kewajiban (sesuatu yang harus dilakukan)',
          'Contoh hak dan kewajiban anak di rumah dan di sekolah secara seimbang',
        ],
      },
      {
        topic: 'Keberagaman Suku, Agama, dan Budaya dalam Bingkai Kebinekaan',
        subMaterials: [
          'Mengenal keragaman 6 agama resmi di Indonesia beserta hari besar keagamaannya',
          'Sikap toleransi, saling menghormati perbedaan suku, fisik, dan kebiasaan antarteman di sekolah',
        ],
      },
      {
        topic: 'Persatuan, Gotong Royong, dan Cinta Tanah Air',
        subMaterials: [
          'Pengertian gotong royong dan contoh kerja bakti di lingkungan sekolah dan masyarakat',
          'Menjaga keutuhan NKRI dan bangga menggunakan produk buatan Indonesia',
        ],
      },
    ],
  },

  // BAHASA INGGRIS SD
  {
    name: 'Bahasa Inggris',
    aliases: ['bahasa inggris', 'b. inggris', 'english', 'bing'],
    topics: [
      {
        topic: 'Greetings, Alphabet, Numbers, and Colors',
        subMaterials: [
          'Basic greetings (Good morning, afternoon, evening, goodbye) and introductions (My name is, I am ... years old)',
          'Spelling words using the English alphabet and counting numbers 1 to 100',
          'Identifying basic colors (red, blue, yellow, green, black, white, orange, purple)',
        ],
      },
      {
        topic: 'Family Members, School Objects, and My House',
        subMaterials: [
          'Vocabulary for family members (father, mother, brother, sister, grandfather, grandmother)',
          'Classroom and stationery objects (pencil, book, eraser, ruler, desk, blackboard)',
          'Rooms in the house (living room, bedroom, kitchen, bathroom) and furniture items',
        ],
      },
      {
        topic: 'Animals, Plants, and Daily Activities',
        subMaterials: [
          'Common animals (wild and domestic), body parts of animals, and animal sounds',
          'Expressing simple daily routines (wake up, brush teeth, have breakfast, go to school)',
        ],
      },
      {
        topic: 'Food, Drinks, Shopping, and Hobbies',
        subMaterials: [
          'Vocabulary for meals, snacks, fruits, vegetables, and drinks (likes and dislikes: I like milk, I do not like coffee)',
          'Expressing hobbies and leisure activities (playing football, drawing, singing, reading)',
        ],
      },
      {
        topic: 'Telling the Time and Simple Descriptions',
        subMaterials: [
          'Asking and telling the time (o clock, half past, quarter to/past)',
          'Describing people, animals, and objects using simple adjectives (big, small, tall, short, happy, smart)',
        ],
      },
    ],
  },

  // TEMATIK TERPADU SD (K13)
  {
    name: 'Tematik Terpadu',
    aliases: ['tematik', 'tematik terpadu', 'tema', 'tematik sd'],
    topics: [
      {
        topic: 'Tema 1: Diriku & Indahnya Kebersamaan',
        subMaterials: [
          'Pengenalan identitas diri, anggota tubuh, panca indra, dan keragaman budaya bangsaku',
          'Saling menghormati perbedaan dan nilai-nilai persatuan di sekolah dan keluarga',
        ],
      },
      {
        topic: 'Tema 2: Kegemaranku & Selalu Berhemat Energi',
        subMaterials: [
          'Olahraga, bernyanyi, menari, dan kegemaran anak; macam-macam sumber energi dan hemat energi',
          'Hak dan kewajiban terhadap pemanfaatan sumber energi di lingkungan sekitar',
        ],
      },
      {
        topic: 'Tema 3: Kegiatanku & Peduli Terhadap Makhluk Hidup',
        subMaterials: [
          'Kegiatan pagi, siang, dan malam hari; bagian tubuh hewan/tumbuhan serta pelestarian alam',
          'Peran hewan dan tumbuhan bagi keseimbangan ekosistem dan kehidupan manusia',
        ],
      },
      {
        topic: 'Tema 4: Keluargaku & Berbagai Pekerjaan',
        subMaterials: [
          'Silsilah keluarga, kebersamaan di rumah, dan jenis-jenis profesi pekerjaan di sekitar kita',
          'Menghargai setiap jenis profesi dan pekerjaan yang halal di masyarakat',
        ],
      },
      {
        topic: 'Tema 5: Pengalamanku & Ekosistem',
        subMaterials: [
          'Pengalaman masa kecil dan di tempat wisata; komponen ekosistem dan rantai makanan',
          'Peran setiap makhluk hidup dalam menjaga keseimbangan rantai makanan',
        ],
      },
      {
        topic: 'Tema 6: Lingkungan Bersih, Sehat, dan Asri',
        subMaterials: [
          'Kerja sama menjaga kebersihan rumah dan sekolah; daur hidup hewan dan pelestarian lingkungan',
          'Membiasakan pola hidup bersih dan sehat dalam kehidupan sehari-hari',
        ],
      },
      {
        topic: 'Tema 7: Benda, Hewan, dan Tanaman di Sekitarku',
        subMaterials: [
          'Benda hidup vs tak hidup; karakteristik tanaman dan hewan peliharaan di sekitar rumah',
          'Merawat tanaman dan hewan peliharaan dengan penuh kasih sayang dan tanggung jawab',
        ],
      },
      {
        topic: 'Tema 8: Peristiwa Alam & Keselamatan',
        subMaterials: [
          'Siang dan malam, cuaca, musim kemarau dan hujan, serta bencana alam dan pencegahannya',
          'Kesiapsiagaan menghadapi peristiwa alam dan saling tolong-menolong',
        ],
      },
    ],
  },

  // PENDIDIKAN AGAMA SD
  {
    name: 'Pendidikan Agama dan Budi Pekerti',
    aliases: ['pendidikan agama', 'agama islam', 'pai', 'agama', 'budi pekerti'],
    topics: [
      {
        topic: 'Mengenal Rukun Iman, Sifat-Sifat Allah / Tuhan, dan Kitab Suci',
        subMaterials: [
          'Mengenal rukun iman, nama-nama indah Allah (Asmaul Husna), dan ciptaan-Nya di alam semesta',
          'Mengenal kitab-kitab suci dan para nabi/tokoh panutan yang wajib diteladani',
        ],
      },
      {
        topic: 'Ibadah Wajib, Tata Cara Bersuci (Thaharah), dan Doa Harian',
        subMaterials: [
          'Tata cara bersuci dari hadas kecil/wudhu dan adab berdoa dalam kehidupan sehari-hari',
          'Gerakan dan bacaan shalat wajib / tata ibadah harian secara tertib dan benar',
        ],
      },
      {
        topic: 'Akhlak Mulia, Sopan Santun, dan Kejujuran',
        subMaterials: [
          'Perilaku terpuji: berbakti kepada orang tua, menghormati guru, sayang sesama teman, dan jujur',
          'Menghindari perilaku tercela seperti berbohong, sombong, dan bertengkar',
        ],
      },
      {
        topic: 'Kisah Keteladanan Para Nabi, Sahabat, dan Tokoh Agama',
        subMaterials: [
          'Kisah keteladanan Nabi Muhammad SAW / para nabi lainnya dalam kesabaran dan kepemimpinan',
          'Penerapan nilai-nilai keteladanan para tokoh agama dalam lingkungan sekolah',
        ],
      },
    ],
  },

  // PJOK SD
  {
    name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    aliases: ['pjok', 'penjaskes', 'olahraga', 'penjas'],
    topics: [
      {
        topic: 'Pola Gerak Dasar Lokomotor, Nonlokomotor, dan Manipulatif',
        subMaterials: [
          'Gerak lokomotor: berjalan, berlari, melompat, dan meloncat pada lintasan lurus dan berkelok',
          'Gerak nonlokomotor: memutar badan, menekuk, mengayun lengan, dan membungkuk',
          'Gerak manipulatif: melempar bola, menangkap, menendang, dan menggiring bola sederhana',
        ],
      },
      {
        topic: 'Permainan Bola Besar dan Bola Kecil Sederhana',
        subMaterials: [
          'Variasi gerak dasar permainan sepak bola, bola voli, dan bola basket anak',
          'Variasi gerak dasar permainan kasti, rounders, dan bulu tangkis anak',
        ],
      },
      {
        topic: 'Senam Lantai, Kebugaran Jasmani, dan Aktivitas Air',
        subMaterials: [
          'Latihan kelenturan, keseimbangan, push up/sit up anak, dan daya tahan tubuh sederhana',
          'Gerak dasar senam lantai (guling depan/belakang) dan pengenalan keselamatan di kolam renang',
        ],
      },
      {
        topic: 'Pola Hidup Bersih, Sehat, dan Gizi Seimbang',
        subMaterials: [
          'Menjaga kebersihan diri (gigi, kuku, pakaian) dan memilih jajanan sehat bergizi',
          'Mengenal bahaya merokok dan pentingnya istirahat teratur untuk pertumbuhan anak',
        ],
      },
    ],
  },
];

// ==========================================
// 2. DATABASE TOPIK KHUSUS JENJANG SMP / MTS
// ==========================================
export const SMP_SUBJECT_TOPICS: SubjectData[] = [
  // MATEMATIKA SMP
  {
    name: 'Matematika',
    aliases: ['matematika', 'matematika smp', 'mtk', 'math'],
    topics: [
      {
        topic: 'Bilangan Bulat, Pecahan, FPB, dan KPK (Kelas 7)',
        subMaterials: [
          'Operasi hitung campuran bilangan bulat (positif dan negatif) serta sifat-sifat komutatif, asosiatif, dan distributif',
          'Operasi pecahan biasa, campuran, desimal, persen, dan notasi ilmiah (bentuk baku)',
          'Penerapan FPB dan KPK dalam pemecahan masalah kontekstual sehari-hari',
        ],
      },
      {
        topic: 'Bentuk Aljabar dan Operasi Aljabar (Kelas 7)',
        subMaterials: [
          'Mengenal suku, koefisien, variabel, dan konstanta pada bentuk aljabar',
          'Operasi penjumlahan, pengurangan, perkalian suku aljabar, dan pembagian aljabar',
          'Pemfaktoran bentuk aljabar (selisih dua kuadrat, bentuk ax² + bx + c)',
        ],
      },
      {
        topic: 'Persamaan dan Pertidaksamaan Linear Satu Variabel (PLSV & PtLSV) (Kelas 7)',
        subMaterials: [
          'Konsep kalimat terbuka, pernyataan, dan menentukan himpunan penyelesaian PLSV',
          'Penyelesaian Pertidaksamaan Linear Satu Variabel (PtLSV) dan penyajian pada garis bilangan',
          'Pemodelan matematika dari soal cerita menggunakan PLSV dan PtLSV',
        ],
      },
      {
        topic: 'Aritmetika Sosial dan Perbandingan (Kelas 7)',
        subMaterials: [
          'Perbandingan senilai dan berbalik nilai beserta grafiknya pada koordinat kartesius',
          'Aritmetika sosial: harga beli, harga jual, untung, rugi, persentase laba/rugi',
          'Perhitungan diskon (rabat), bruto, netto, tara, bunga tunggal bank, dan pajak (PPN/PPh)',
        ],
      },
      {
        topic: 'Himpunan dan Diagram Venn (Kelas 7)',
        subMaterials: [
          'Konsep himpunan, notasi pembentuk himpunan, kardinalitas, himpunan bagian, dan semesta',
          'Operasi himpunan: irisan (intersection), gabungan (union), selisih (difference), dan komplemen',
          'Penyajian operasi himpunan dalam diagram Venn dan soal cerita terapan',
        ],
      },
      {
        topic: 'Garis, Sudut, dan Hubungan Antarsudut (Kelas 7)',
        subMaterials: [
          'Kedudukan dua garis (sejajar, berpotongan, berimpit, bersilangan)',
          'Jenis sudut dan hubungan antarsudut (sudut berpelurus/suplemen, berpenyiku/komplemen, bertolak belakang)',
          'Hubungan sudut pada dua garis sejajar yang dipotong garis transversal (sehadap, berseberangan, sepihak)',
        ],
      },
      {
        topic: 'Pola Bilangan, Barisan, dan Deret (Kelas 8)',
        subMaterials: [
          'Menentukan suku ke-n dari pola bilangan persegi, persegi panjang, segitiga, dan Pascal',
          'Barisan dan deret aritmetika (rumus suku ke-n Un = a + (n-1)b dan jumlah n suku pertama Sn)',
          'Barisan dan deret geometri (rumus suku ke-n Un = a.r^(n-1) dan Sn) serta aplikasinya',
        ],
      },
      {
        topic: 'Sistem Koordinat Kartesius dan Relasi-Fungsi (Kelas 8)',
        subMaterials: [
          'Menentukan posisi titik terhadap sumbu-x, sumbu-y, dan titik asal (0,0) pada kuadran I-IV',
          'Konsep relasi, cara penyajian relasi (diagram panah, himpunan pasangan berurutan, diagram kartesius)',
          'Konsep fungsi/pemetaan, domain, kodomain, range, rumus fungsi f(x) = ax + b, dan korespondensi satu-satu',
        ],
      },
      {
        topic: 'Persamaan Garis Lurus (PGL) (Kelas 8)',
        subMaterials: [
          'Menggambar grafik persamaan garis lurus y = mx + c dan ax + by = c',
          'Menentukan gradien (kemiringan) garis melalui dua titik, dari grafik, dan dari persamaan',
          'Menentukan persamaan garis yang melalui satu titik dengan gradien m dan melalui dua titik',
          'Hubungan gradien dua garis yang sejajar (m1 = m2) dan tegak lurus (m1 . m2 = -1)',
        ],
      },
      {
        topic: 'Sistem Persamaan Linear Dua Variabel (SPLDV) (Kelas 8)',
        subMaterials: [
          'Konsep SPLDV dan metode penyelesaian: grafik, substitusi, eliminasi, dan campuran',
          'Penyelesaian masalah kontekstual (soal cerita belanja, umur, bilangan) menggunakan SPLDV',
        ],
      },
      {
        topic: 'Teorema Pythagoras dan Penerapannya (Kelas 8)',
        subMaterials: [
          'Membuktikan dan menghitung panjang sisi segitiga siku-siku dengan Teorema Pythagoras (a² + b² = c²)',
          'Mengenal tripel Pythagoras dan menentukan jenis segitiga (lancip, siku-siku, tumpul)',
          'Perbandingan sisi-sisi segitiga siku-siku khusus (sudut 30°-60°-90° dan 45°-45°-90°)',
        ],
      },
      {
        topic: 'Lingkaran (Kelas 8)',
        subMaterials: [
          'Unsur-unsur lingkaran: titik pusat, jari-jari, diameter, busur, tali busur, juring, tembereng, apotema',
          'Hubungan sudut pusat dan sudut keliling yang menghadap busur yang sama',
          'Menghitung panjang busur dan luas juring lingkaran',
          'Garis singgung persekutuan luar (GSPL) dan dalam (GSPD) dua lingkaran',
        ],
      },
      {
        topic: 'Bangun Ruang Sisi Datar (Kelas 8)',
        subMaterials: [
          'Kubus dan balok: unsur, jaring-jaring, luas permukaan, dan volume',
          'Prisma dan limas: unsur, penamaan berdasarkan alas, jaring-jaring, luas permukaan, dan volume',
          'Penyelesaian masalah gabungan bangun ruang sisi datar dan kerangka kawat',
        ],
      },
      {
        topic: 'Statistika SMP (Kelas 8)',
        subMaterials: [
          'Membaca dan menganalisis data dari diagram batang, garis, dan lingkaran',
          'Ukuran pemusatan data tunggal: rata-rata (mean), nilai tengah (median), dan modus',
          'Ukuran penyebaran data: jangkauan (range), kuartil (Q1, Q2, Q3), dan jangkauan interkuartil',
        ],
      },
      {
        topic: 'Peluang (Kelas 8)',
        subMaterials: [
          'Ruang sampel, titik sampel, dan peluang teoretik suatu kejadian pada koin, dadu, dan kartu',
          'Peluang empirik (frekuensi relatif) dari hasil percobaan berulang dan frekuensi harapan',
        ],
      },
      {
        topic: 'Perpangkatan dan Bentuk Akar (Eksponen) (Kelas 9)',
        subMaterials: [
          'Sifat-sifat operasi perpangkatan (pangkat bulat positif, nol, dan negatif)',
          'Operasi aljabar bentuk akar (penjumlahan, pengurangan, perkalian, pembagian)',
          'Merasionalkan penyebut pecahan bentuk akar dan penulisan bentuk baku/notasi ilmiah',
        ],
      },
      {
        topic: 'Persamaan dan Fungsi Kuadrat (Kelas 9)',
        subMaterials: [
          'Menentukan akar-akar persamaan kuadrat (memfaktorkan, melengkapkan kuadrat sempurna, rumus ABC)',
          'Diskriminan (D = b² - 4ac) dan karakteristik akar-akar persamaan kuadrat',
          'Menggambar grafik fungsi kuadrat f(x) = ax² + bx + c, sumbu simetri, dan titik puncak/optimum',
        ],
      },
      {
        topic: 'Transformasi Geometri (Kelas 9)',
        subMaterials: [
          'Translasi (pergeseran) titik dan kurva pada bidang kartesius',
          'Refleksi (pencerminan) terhadap sumbu-x, sumbu-y, garis y=x, y=-x, titik asal, dan x=h, y=k',
          'Rotasi (perputaran) sebesar 90°, 180°, 270° searah dan berlawanan arah jarum jam',
          'Dilatasi (pembesaran/pengecilan) dengan faktor skala k dan pusat (0,0) atau (a,b)',
        ],
      },
      {
        topic: 'Kekongruenan dan Kesebangunan (Kelas 9)',
        subMaterials: [
          'Syarat dua bangun datar kongruen dan sebangun',
          'Kekongruenan dua segitiga (syarat: sisi-sisi-sisi, sisi-sudut-sisi, sudut-sisi-sudut)',
          'Kesebangunan dua segitiga dan penerapannya dalam menghitung tinggi pohon/gedung dengan bayangan',
        ],
      },
      {
        topic: 'Bangun Ruang Sisi Lengkung (Kelas 9)',
        subMaterials: [
          'Tabung: unsur, jaring-jaring, luas selimut, luas permukaan total, dan volume (V = π.r².t)',
          'Kerucut: garis pelukis (s), luas selimut, luas permukaan, dan volume (V = 1/3.π.r².t)',
          'Bola: luas permukaan (L = 4.π.r²) dan volume (V = 4/3.π.r³)',
          'Penyelesaian masalah gabungan bangun ruang sisi lengkung dalam kehidupan nyata',
        ],
      },
    ],
  },

  // IPA SMP (TERPADU)
  {
    name: 'Ilmu Pengetahuan Alam (IPA)',
    aliases: ['ipa', 'ilmu pengetahuan alam', 'sains', 'science'],
    topics: [
      {
        topic: 'Hakikat Ilmu Sains, Pengukuran, dan Metode Ilmiah (Kelas 7)',
        subMaterials: [
          'Metode ilmiah, variabel penelitian (bebas, terikat, kontrol), keselamatan kerja di laboratorium IPA',
          'Besaran pokok (panjang, massa, waktu, suhu, kuat arus, jumlah zat, intensitas cahaya) vs besaran turunan',
          'Penggunaan alat ukur: jangka sorong, mikrometer sekrup, neraca, gelas ukur, dan stopwatch',
        ],
      },
      {
        topic: 'Zat dan Perubahannya (Kelas 7)',
        subMaterials: [
          'Wujud zat (padat, cair, gas), model partikel difusi, dan konsep massa jenis (ρ = m/V)',
          'Perubahan fisika vs kimia, ciri reaksi kimia (warna, suhu, endapan, gas)',
          'Metode pemisahan campuran: filtrasi, kristalisasi, destilasi, kromatografi, dan sublimasi',
          'Unsur, senyawa, dan campuran homogen/heterogen',
        ],
      },
      {
        topic: 'Suhu, Kalor, dan Pemuaian (Kelas 7)',
        subMaterials: [
          'Konversi skala termometer (Celsius, Reamur, Fahrenheit, Kelvin)',
          'Asas Black dan perhitungan kalor Q = m.c.ΔT, kalor lebur, kalor uap',
          'Perpindahan kalor secara konduksi, konveksi, dan radiasi dalam teknologi',
          'Pemuaian panjang, luas, dan volume pada zat padat serta penerapan bimetal',
        ],
      },
      {
        topic: 'Gerak Lurus, Gaya, dan Hukum Newton (Kelas 7)',
        subMaterials: [
          'Gerak Lurus Beraturan (GLB) dan GLBB, konsep jarak vs perpindahan, kelajuan vs kecepatan',
          'Hukum I, II, dan III Newton tentang gerak, resultan gaya, dan perhitungan F = m.a',
          'Gaya gesek statis/kinetis, gaya berat, dan gaya normal pada bidang datar',
        ],
      },
      {
        topic: 'Klasifikasi Makhluk Hidup dan Keanekaragaman Hayati (Kelas 7)',
        subMaterials: [
          'Ciri-ciri makhluk hidup dan sistem klasifikasi 5 kingdom (Monera, Protista, Fungi, Plantae, Animalia)',
          'Penggunaan kunci determinasi/dikotomi sederhana dan tata nama binomial nomenklatur',
          'Tumbuhan lumut, paku, berbiji serta hewan avertebrata dan vertebrata',
        ],
      },
      {
        topic: 'Ekosistem dan Pencemaran Lingkungan (Kelas 7)',
        subMaterials: [
          'Komponen biotik-abiotik, rantai makanan, jaring makanan, dan piramida ekologi',
          'Interaksi antarmakhluk hidup (simbiosis, predasi, kompetisi, netralisme)',
          'Pencemaran air, udara, tanah serta dampaknya terhadap pemanasan global dan upaya penanggulangannya',
        ],
      },
      {
        topic: 'Struktur Bumi, Gunung Berapi, dan Tata Surya (Kelas 7)',
        subMaterials: [
          'Lapisan bumi (kerak, mantel, inti) dan dinamika lempeng tektonik',
          'Gempa bumi, tsunami, gunung berapi, dan mitigasi bencana alam',
          'Karakteristik anggota tata surya, rotasi-revolusi bumi/bulan, fase bulan, pasang surut, dan gerhana',
        ],
      },
      {
        topic: 'Usaha, Energi, dan Pesawat Sederhana (Kelas 8)',
        subMaterials: [
          'Konsep usaha (W = F.s) dan daya (P = W/t)',
          'Energi kinetik (Ek = 1/2.m.v²), energi potensial (Ep = m.g.h), dan hukum kekekalan energi mekanik',
          'Pesawat sederhana: tuas (pengungkit jenis I, II, III), katrol tetap/bebas/majemuk, bidang miring, roda berporos',
        ],
      },
      {
        topic: 'Tekanan Zat dan Penerapannya (Kelas 8)',
        subMaterials: [
          'Tekanan zat padat (P = F/A)',
          'Tekanan hidrostatis (P = ρ.g.h) dan bejana berhubungan',
          'Hukum Pascal (F1/A1 = F2/A2) pada dongkrak hidrolik dan Hukum Archimedes (gaya apung, terapung, melayang, tenggelam)',
          'Tekanan gas/udara pada manometer dan barometer serta tekanan darah manusia',
        ],
      },
      {
        topic: 'Getaran, Gelombang, dan Bunyi (Kelas 8)',
        subMaterials: [
          'Konsep getaran: amplitudo, periode (T), frekuensi (f), dan hubungan T = 1/f',
          'Gelombang transversal dan longitudinal, cepat rambat gelombang (v = λ.f)',
          'Karakteristik bunyi: infrasonik, audiosonik, ultrasonik, resonansi, pemantulan bunyi (gaung, gema), dan USG',
        ],
      },
      {
        topic: 'Cahaya dan Alat Optik (Kelas 8)',
        subMaterials: [
          'Sifat-sifat cahaya dan hukum pemantulan Snellius',
          'Pembentukan bayangan pada cermin datar, cermin cekung, dan cermin cembung (rumus 1/f = 1/s + 1/s\')',
          'Pembiasan cahaya pada lensa cembung dan cekung serta kekuatan lensa',
          'Mata manusia, cacat mata (miopi, hipermetropi, presbiopi) dan kacamata koreksi, lup, mikroskop, teleskop',
        ],
      },
      {
        topic: 'Struktur dan Fungsi Jaringan Tumbuhan (Kelas 8)',
        subMaterials: [
          'Struktur dan fungsi akar, batang, daun, bunga, buah, dan biji',
          'Jaringan meristem, epidermis, parenkim, kolenkim, sklerenkim, xilem, dan floem',
          'Uji fotosintesis (Sachs dan Ingenhousz) dan teknologi yang terinspirasi struktur tumbuhan',
        ],
      },
      {
        topic: 'Sistem Organ Manusia (Pencernaan, Pernapasan, Peredaran Darah, Ekskresi) (Kelas 8)',
        subMaterials: [
          'Sistem pencernaan: organ saluran dan kelenjar, enzim pencernaan, uji makanan (karbohidrat, protein, lemak)',
          'Sistem pernapasan: organ, mekanisme dada/perut, kapasitas vital paru-paru, gangguan pernapasan',
          'Sistem peredaran darah: jantung, pembuluh darah, pembekuan darah, golongan darah ABO/Rhesus, hipertensi',
          'Sistem ekskresi: struktur nefron ginjal, tahapan pembentukan urine (filtrasi, reabsorpsi, augmentasi), kulit, hati, paru-paru',
        ],
      },
      {
        topic: 'Listrik Statis dan Muatan Listrik (Kelas 9)',
        subMaterials: [
          'Muatan listrik, elektroskop, dan interaksi muatan sejenis/tak sejenis',
          'Hukum Coulomb (F = k.q1.q2/r²) dan medan listrik (E = F/q)',
          'Potensial listrik dan kelistrikan pada sistem saraf manusia serta hewan penghasil listrik',
        ],
      },
      {
        topic: 'Listrik Dinamis dalam Kehidupan Sehari-hari (Kelas 9)',
        subMaterials: [
          'Arus listrik, beda potensial, Hukum Ohm (V = I.R), dan hambatan jenis kawat',
          'Rangkaian hambatan seri dan paralel serta Hukum I Kirchhoff (I masuk = I keluar)',
          'Energi listrik (W = V.I.t) dan daya listrik (P = V.I) serta perhitungan tagihan rekening listrik PLN',
        ],
      },
      {
        topic: 'Kemagnetan dan Induksi Elektromagnetik (Kelas 9)',
        subMaterials: [
          'Sifat kutub magnet, cara membuat magnet (menggosok, induksi, elektromagnetik), dan deklinasi/inklinasi bumi',
          'Gaya Lorentz pada kawat berarus dalam medan magnet (F = B.I.L)',
          'Induksi elektromagnetik (Faraday), prinsip kerja generator, dinamo, dan transformator (step up & step down: Np/Ns = Vp/Vs = Is/Ip)',
        ],
      },
      {
        topic: 'Pewarisan Sifat / Genetika Mendel (Kelas 9)',
        subMaterials: [
          'Materi genetik: kromosom, gen, DNA, RNA, genotipe (homozigot, heterozigot), dan fenotipe',
          'Persilangan monohibrid dominan penuh dan intermediet (rasio fenotipe 3:1 dan 1:2:1)',
          'Persilangan dihibrid (rasio fenotipe 9:3:3:1) dan penerapannya dalam pemuliaan tanaman/hewan',
        ],
      },
      {
        topic: 'Bioteknologi Konvensional dan Modern (Kelas 9)',
        subMaterials: [
          'Bioteknologi konvensional pangan (fermentasi tempe, kecap, yoghurt, keju, tape) dan mikroorganisme yang berperan',
          'Bioteknologi modern: kultur jaringan, rekayasa genetika, kloning, organisme transgenik, dan dampaknya',
        ],
      },
    ],
  },

  // BAHASA INDONESIA SMP
  {
    name: 'Bahasa Indonesia',
    aliases: ['bahasa indonesia', 'b. indonesia', 'indonesian', 'bina'],
    topics: [
      {
        topic: 'Teks Deskripsi (Kelas 7)',
        subMaterials: [
          'Struktur teks deskripsi: identifikasi/gambaran umum, deskripsi bagian, dan simpulan/kesan',
          'Kaidah kebahasaan: kata konkret, kalimat bermajas, kata depan, konjungsi, dan cerapan pancaindra',
          'Menyajikan dan menyunting teks deskripsi tentang objek wisata, budaya, atau tempat bersejarah',
        ],
      },
      {
        topic: 'Teks Cerita Fantasi dan Cerpen (Kelas 7)',
        subMaterials: [
          'Unsur intrinsik: tema, tokoh dan penokohan, latar, alur (orientasi, komplikasi, resolusi), sudut pandang, amanat',
          'Ciri teks cerita fantasi: keajaiban tokoh, latar lintas ruang dan waktu, ide cerita terbuka',
          'Kaidah kebahasaan: kata ganti orang, kata serapan, konjungsi urutan waktu, dan dialog langsung',
        ],
      },
      {
        topic: 'Teks Prosedur (Kelas 7)',
        subMaterials: [
          'Struktur teks prosedur: tujuan, alat/bahan, langkah-langkah berurutan, dan penutup/penegasan',
          'Ciri kebahasaan: kalimat perintah (imperatif), kalimat saran/larangan, kata kerja aktif, kata keterangan ukuran',
          'Menyusun teks prosedur membuat atau melakukan sesuatu secara terstruktur dan logis',
        ],
      },
      {
        topic: 'Teks Laporan Hasil Observasi (LHO) (Kelas 7)',
        subMaterials: [
          'Struktur teks LHO: definisi umum / pernyataan umum, deskripsi bagian, dan deskripsi manfaat',
          'Kaidah kebahasaan: kata benda umum (nomina), verba relasional/klasifikasi, istilah ilmiah teknis, dan kalimat definisi',
          'Menyimpulkan isi dan menyusun teks laporan hasil pengamatan lingkungan sekitar',
        ],
      },
      {
        topic: 'Teks Iklan, Slogan, dan Poster (Kelas 8)',
        subMaterials: [
          'Membedakan unsur iklan (gambar, teks, gerak, suara), slogan (kata-kata menarik/motto), dan poster (gambar dan teks di plakat)',
          'Struktur teks iklan: judul/nama produk, penjelasan produk, dan kontak penyedia',
          'Kaidah kebahasaan: kalimat persuasif, imperatif, ringkas, berima, dan berdaya sugesti',
        ],
      },
      {
        topic: 'Teks Puisi (Kelas 8)',
        subMaterials: [
          'Unsur fisik puisi: tipografi, diksi, imaji (citraan), kata konkret, majas (personifikasi, metafora, simile), rima/ritme',
          'Unsur batin puisi: tema (sense), nada (tone), perasaan (feeling), dan amanat (intention)',
          'Menganalisis makna puisi dan mendeklamasikan puisi dengan lafal, intonasi, dan ekspresi yang tepat',
        ],
      },
      {
        topic: 'Teks Eksplanasi (Kelas 8)',
        subMaterials: [
          'Struktur teks eksplanasi: pernyataan umum, deretan penjelas (kausalitas / kronologis), dan interpretasi / ulasan',
          'Kaidah kebahasaan: konjungsi kausalitas (sebab, karena, akibatnya), konjungsi kronologis (kemudian, lalu), kata teknis',
          'Meringkas dan menyusun teks eksplanasi fenomena alam (gempa, banjir) dan fenomena sosial',
        ],
      },
      {
        topic: 'Teks Ulasan / Resensi Buku (Kelas 8)',
        subMaterials: [
          'Struktur teks ulasan: identitas karya, orientasi, sinopsis, analisis, evaluasi kelebihan & kekurangan, dan rekomendasi',
          'Kaidah kebahasaan: konjungsi penerang (bahwa, yaitu), konjungsi temporal, dan kalimat saran/rekomendasi',
        ],
      },
      {
        topic: 'Teks Persuasi dan Pidato Persuasif (Kelas 8 & 9)',
        subMaterials: [
          'Struktur pidato persuasif: pembukaan (salam, penghormatan), isi (fakta, argumen logis, etis, emosional), penutup',
          'Ciri kebahasaan teks persuasi: kata bujukan (harus, hendaknya, mari), kata kerja mental, kata ganti orang pertama jamak',
          'Menulis naskah pidato persuasif dan berpidato dengan teknik artikulasi yang memikat',
        ],
      },
      {
        topic: 'Teks Tanggapan Kritis (Kelas 9)',
        subMaterials: [
          'Struktur teks tanggapan: konteks, deskripsi karya/fenomena, dan penilaian kritis (pujian atau kritikan santun)',
          'Kaidah kebahasaan: kalimat kompleks, konjungsi pertentangan, rujukan kata, dan kalimat santun objektif',
        ],
      },
      {
        topic: 'Teks Diskusi (Kelas 9)',
        subMaterials: [
          'Struktur teks diskusi: isu permasalahan aktual, argumen mendukung (pro), argumen menentang (kontra), dan simpulan/solusi',
          'Kaidah kebahasaan: kata modalitas (dapat, harus, sebaiknya), kata hubung perlawanan (namun, sebaliknya), kata kohesi',
        ],
      },
      {
        topic: 'Teks Cerita Inspiratif (Kelas 9)',
        subMaterials: [
          'Struktur cerita inspiratif: orientasi, rangkaian peristiwa, komplikasi, resolusi, dan koda (pesan moral reflektif)',
          'Menganalisis nilai-nilai keteladanan hidup dan menyusun cerita inspiratif yang menyentuh perasaan',
        ],
      },
    ],
  },

  // BAHASA INGGRIS SMP
  {
    name: 'Bahasa Inggris',
    aliases: ['bahasa inggris', 'b. inggris', 'english', 'bing'],
    topics: [
      {
        topic: 'Descriptive Text (People, Famous Places, Animals)',
        subMaterials: [
          'Social function and text structure: Identification and Description of physical appearance, qualities, and characteristics',
          'Language features: Simple Present Tense, specific nouns, descriptive adjectives, action verbs, and linking verbs',
          'Comprehending details and writing short descriptive texts about famous Indonesian landmarks and tourism objects',
        ],
      },
      {
        topic: 'Procedure Text (Recipes, Manuals, Life Hacks)',
        subMaterials: [
          'Social function and text structure: Goal/Title, Materials/Ingredients, and Sequential Steps/Methods',
          'Language features: Imperative sentences (stir, boil, cut), temporal connectives (first, then, next, finally), adverbs of manner',
          'Writing clear step-by-step cooking recipes and electronics operating instructions',
        ],
      },
      {
        topic: 'Recount Text (Personal Experiences & Historical Events)',
        subMaterials: [
          'Social function and text structure: Orientation (who, where, when), Events in chronological order, and Reorientation',
          'Language features: Simple Past Tense (regular & irregular verbs), action verbs, time conjunctions (after that, before, when)',
          'Writing a personal diary, holiday recount, and national historical event recount',
        ],
      },
      {
        topic: 'Narrative Text (Folktales, Fables, Legends, Fairy Tales)',
        subMaterials: [
          'Social function and text structure: Orientation, Complication (problems arise), Resolution, and Moral Value / Coda',
          'Language features: Past Tense, direct dialogue, action verbs, time words (once upon a time, suddenly), descriptive adjectives',
          'Analyzing Indonesian folklore (Malin Kundang, Sangkuriang, Danau Toba) and international fairy tales',
        ],
      },
      {
        topic: 'Short Functional Texts (Notice, Announcement, Greeting Cards)',
        subMaterials: [
          'Reading and analyzing public notices, warning signs, school announcements, short text messages, and invitations',
          'Designing greeting cards (birthday, congratulations, get well soon) and short formal announcements',
        ],
      },
      {
        topic: 'Interpersonal & Transactional Conversations',
        subMaterials: [
          'Expressing congratulations, hopes, wishes, intentions, and agreements/disagreements',
          'Expressing willingness, obligations, advice/suggestions (should, must, can, will), and asking for/giving opinions',
        ],
      },
      {
        topic: 'Grammar & Sentence Structures SMP',
        subMaterials: [
          'Simple Present Tense vs Present Continuous Tense',
          'Simple Past Tense vs Past Continuous Tense and Present Perfect Tense',
          'Degrees of Comparison (positive, comparative -er/more, superlative -est/most)',
          'Passive Voice in Simple Present and Simple Past Tense',
        ],
      },
    ],
  },

  // INFORMATIKA SMP
  {
    name: 'Informatika',
    aliases: ['informatika', 'tik', 'komputer', 'computer', 'informatics'],
    topics: [
      {
        topic: 'Berpikir Komputasional (Computational Thinking)',
        subMaterials: [
          '4 pilar berpikir komputasional: Dekomposisi masalah, Pengenalan pola, Abstraksi, dan Perancangan algoritma',
          'Penerapan struktur data logika dasar: tumpukan (stack), antrean (queue), dan pencarian/pengurutan data',
        ],
      },
      {
        topic: 'Teknologi Informasi dan Komunikasi (TIK)',
        subMaterials: [
          'Integrasi aplikasi perkantoran: pengolah kata (word processor), lembar kerja (spreadsheet), presentasi',
          'Pencarian informasi efektif melalui search engine dan pengelolaan surel (email) profesional',
        ],
      },
      {
        topic: 'Sistem Komputer (Hardware, Software, OS)',
        subMaterials: [
          'Komponen perangkat keras: input device, processing unit (CPU/ALU), storage device, dan output device',
          'Perangkat lunak sistem operasi (Windows, Linux, Android) vs perangkat lunak aplikasi',
          'Mekanisme kerja interaksi manusia dan komputer serta representasi data biner',
        ],
      },
      {
        topic: 'Jaringan Komputer dan Internet',
        subMaterials: [
          'Topologi jaringan (star, bus, ring, mesh) dan jenis jaringan (LAN, MAN, WAN)',
          'Konektivitas internet (WiFi, seluler, fiber optic), fungsi IP Address, dan protokol HTTP/HTTPS',
          'Keamanan data di jaringan: proteksi kata sandi, enkripsi, dan pencegahan malware / phishing',
        ],
      },
      {
        topic: 'Analisis Data (Data Analysis)',
        subMaterials: [
          'Pengumpulan data, pembersihan data, dan pemformatan data angka/teks',
          'Penggunaan fungsi matematika dan logika spreadsheet: SUM, AVERAGE, MAX, MIN, COUNT, IF, VLOOKUP',
          'Visualisasi data menggunakan diagram batang, garis, dan diagram lingkaran',
        ],
      },
      {
        topic: 'Algoritma dan Pemrograman (Coding)',
        subMaterials: [
          'Pemrograman visual berbasis blok (Scratch / Blockly): variabel, kondisional (if-else), perulangan (loop)',
          'Dasar-dasar pseudocode dan flowchart algoritma logika program',
          'Pengenalan sintaks dasar bahasa pemrograman teks (Python dasar: input, print, tipe data)',
        ],
      },
      {
        topic: 'Dampak Sosial Informatika (DSI)',
        subMaterials: [
          'Etika berkomunikasi di media sosial (netiket), pencegahan cyberbullying, dan literasi anti-hoaks',
          'Hak Kekayaan Intelektual (HAKI), lisensi perangkat lunak, dan perlindungan jejak digital pribadi',
        ],
      },
    ],
  },

  // IPS SMP
  {
    name: 'Ilmu Pengetahuan Sosial (IPS)',
    aliases: ['ips', 'ilmu pengetahuan sosial', 'social studies'],
    topics: [
      {
        topic: 'Letak Astronomis, Geografis, dan Potensi SDA Indonesia',
        subMaterials: [
          'Letak astronomis (zona waktu WIB, WITA, WIT) dan letak geografis Indonesia di jalur perdagangan dunia',
          'Potensi sumber daya alam hutan, tambang (minyak, gas, batu bara, emas), dan kelautan (maritim) Indonesia',
        ],
      },
      {
        topic: 'Dinamika Kependudukan Indonesia',
        subMaterials: [
          'Jumlah, pertumbuhan, kepadatan, persebaran penduduk, dan piramida penduduk Indonesia',
          'Kualitas penduduk (Indeks Pembangunan Manusia / IPM, pendidikan, kesehatan) dan mobilitas migrasi',
        ],
      },
      {
        topic: 'Interaksi Antarruang dan Perubahan Sosial Budaya',
        subMaterials: [
          'Bentuk interaksi sosial asosiatif (akomodasi, asimilasi, akulturasi) dan disosiatif (konflik, kompetisi)',
          'Faktor pendorong dan penghambat perubahan sosial budaya serta globalisasi di era modern',
        ],
      },
      {
        topic: 'Permintaan, Penawaran, Pasar, dan Harga Keseimbangan',
        subMaterials: [
          'Hukum permintaan dan penawaran serta faktor yang mempengaruhinya',
          'Kurva permintaan, kurva penawaran, dan terbentuknya harga keseimbangan pasar',
          'Fungsi pasar dan jenis-jenis pasar konkret/abstrak dalam perekonomian',
        ],
      },
      {
        topic: 'Perdagangan Antardaerah dan Perdagangan Internasional',
        subMaterials: [
          'Keunggulan komparatif antardaerah dan perdagangan antarpulau di Indonesia',
          'Ekspor-impor, devisa, neraca perdagangan, dan kebijakan tarif/kuota perdagangan bebas',
        ],
      },
      {
        topic: 'Masa Praaksara, Hindu-Buddha, dan Islam di Nusantara',
        subMaterials: [
          'Kehidupan berburu, bercocok tanam, dan perundagian pada masa praaksara di Indonesia',
          'Masuknya pengaruh Hindu-Buddha, kerajaan-kerajaan besar (Kutai, Sriwijaya, Majapahit), dan peninggalannya',
          'Saluran penyebaran Islam, kerajaan-kerajaan Islam (Samudera Pasai, Demak, Mataram Islam, Gowa-Tallo)',
        ],
      },
      {
        topic: 'Kolonialisme, Pergerakan Nasional, dan Kemerdekaan Indonesia',
        subMaterials: [
          'Kebijakan VOC, Tanam Paksa (Cultuurstelsel), dan Politik Etis masa kolonial Belanda',
          'Lahirnya organisasi modern (Budi Utomo, Sarekat Islam, Indische Partij) dan Sumpah Pemuda 1928',
          'Pendudukan militer Jepang, peristiwa Rengasdengklok, Proklamasi 1945, dan perang kemerdekaan',
        ],
      },
      {
        topic: 'Kerjasama Kawasan ASEAN dan Lembaga Internasional',
        subMaterials: [
          'Latar belakang berdirinya ASEAN, Deklarasi Bangkok, dan profil 10 negara anggota',
          'Bentuk kerjasama bidang politik, ekonomi (MEA), sosial budaya ASEAN, dan peran PBB/WHO/UNESCO',
        ],
      },
    ],
  },

  // PENDIDIKAN PANCASILA / PPKn SMP
  {
    name: 'Pendidikan Pancasila',
    aliases: ['pendidikan pancasila', 'ppkn', 'pancasila', 'kewarganegaraan', 'pkn'],
    topics: [
      {
        topic: 'Sejarah Perumusan dan Penetapan Pancasila sebagai Dasar Negara',
        subMaterials: [
          'Sidang BPUPKI pertama, gagasan tokoh (Muh. Yamin, Soepomo, Soekarno), dan Piagam Jakarta 22 Juni 1945',
          'Sidang PPKI 18 Agustus 1945: pengesahan UUD 1945, pemilihan Presiden/Wapres, dan penetapan Pancasila',
        ],
      },
      {
        topic: 'Norma dan UUD NRI Tahun 1945',
        subMaterials: [
          'Mengenal 4 norma dalam masyarakat: norma agama, norma kesusilaan, norma kesopanan, dan norma hukum',
          'Kedudukan UUD NRI 1945 sebagai hukum dasar tertinggi dan tata urutan perundang-undangan (UU No. 12/2011)',
        ],
      },
      {
        topic: 'Makna dan Semangat Sumpah Pemuda Tahun 1928',
        subMaterials: [
          'Sejarah Kongres Pemuda I dan II, ikrar Sumpah Pemuda, lagu Indonesia Raya, dan bendera Merah Putih',
          'Penerapan semangat persatuan pemuda dalam mengisi kemerdekaan di era digital',
        ],
      },
      {
        topic: 'Keberagaman Suku, Agama, Ras, dan Antargolongan (SARA) dalam Bhinneka Tunggal Ika',
        subMaterials: [
          'Faktor penyebab keberagaman masyarakat Indonesia dan potensi kekayaan budaya',
          'Mencegah diskriminasi, etnosentrisme, dan stereotip melalui sikap toleransi dan moderasi beragama',
        ],
      },
      {
        topic: 'Kedaulatan Rakyat dan Sistem Pemerintahan NKRI',
        subMaterials: [
          'Konsep kedaulatan rakyat dan lembaga negara (MPR, DPR, DPD, Presiden, MA, MK, BPK)',
          'Prinsip musyawarah mufakat, pelaksanaan Pemilihan Umum (Pemilu), dan otonomi daerah',
        ],
      },
      {
        topic: 'Semangat Bela Negara dan Ketahanan Nasional',
        subMaterials: [
          'Hak dan kewajiban warga negara dalam pertahanan keamanan negara (Pasal 27 ayat 3 dan Pasal 30 UUD 1945)',
          'Wujud nyata bela negara bagi pelajar di lingkungan sekolah dan masyarakat',
        ],
      },
    ],
  },
];

// ==========================================
// 3. DATABASE TOPIK KHUSUS JENJANG SMA / MA
// ==========================================
export const SMA_SUBJECT_TOPICS: SubjectData[] = [
  // MATEMATIKA (UMUM) SMA
  {
    name: 'Matematika (Umum)',
    aliases: ['matematika (umum)', 'matematika wajib', 'matematika', 'matematika sma', 'math'],
    topics: [
      {
        topic: 'Eksponen, Bentuk Akar, dan Logaritma',
        subMaterials: [
          'Sifat-sifat fungsi eksponen, persamaan eksponen, dan pertidaksamaan eksponen',
          'Operasi aljabar bentuk akar dan merasionalkan penyebut pecahan',
          'Sifat-sifat operasi logaritma, persamaan logaritma, dan aplikasi pada skala gempa Richter / pH larutan',
        ],
      },
      {
        topic: 'Persamaan dan Pertidaksamaan Nilai Mutlak',
        subMaterials: [
          'Definisi nilai mutlak |x| dan grafik fungsi nilai mutlak linear satu variabel',
          'Penyelesaian persamaan nilai mutlak linear satu variabel |ax + b| = c dan |f(x)| = |g(x)|',
          'Penyelesaian pertidaksamaan nilai mutlak linear satu variabel (|f(x)| < a dan |f(x)| > a)',
        ],
      },
      {
        topic: 'Sistem Persamaan Linear Tiga Variabel (SPLTV)',
        subMaterials: [
          'Metode penyelesaian SPLTV: eliminasi-substitusi dan metode determinan matriks (Cramer)',
          'Pemodelan dan penyelesaian masalah kontekstual yang melibatkan SPLTV',
        ],
      },
      {
        topic: 'Barisan dan Deret Aritmetika, Geometri, dan Tak Hingga',
        subMaterials: [
          'Barisan dan deret aritmetika (suku ke-n Un dan jumlah n suku Sn)',
          'Barisan dan deret geometri hingga serta aplikasi pada bunga majemuk, pertumbuhan, dan peluruhan',
          'Deret geometri tak hingga konvergen (S∞ = a / (1 - r))',
        ],
      },
      {
        topic: 'Trigonometri Dasar dan Sudut Berelasi',
        subMaterials: [
          'Perbandingan trigonometri pada segitiga siku-siku (sin, cos, tan, csc, sec, cot)',
          'Nilai perbandingan trigonometri sudut istimewa (0°, 30°, 45°, 60°, 90°) dan sudut berelasi di kuadran I-IV',
          'Aturan sinus (a/sinA = b/sinB = c/sinC) dan aturan cosinus (a² = b² + c² - 2bc.cosA) serta luas segitiga',
        ],
      },
      {
        topic: 'Fungsi, Komposisi Fungsi, dan Fungsi Invers',
        subMaterials: [
          'Domain, kodomain, range fungsi dan grafik fungsi aljabar/linear/kuadrat/rasional',
          'Operasi aljabar fungsi dan fungsi komposisi (f ∘ g)(x) dan (g ∘ f)(x)',
          'Menentukan fungsi invers f⁻¹(x) dan sifat-sifatnya ((f ∘ g)⁻¹(x) = (g⁻¹ ∘ f⁻¹)(x))',
        ],
      },
      {
        topic: 'Matriks dan Determinan',
        subMaterials: [
          'Ordo, transpose, kesamaan matriks, dan operasi aljabar matriks (penjumlahan, pengurangan, perkalian skalar & matriks)',
          'Determinan matriks ordo 2x2 dan ordo 3x3 (metode Sarrus dan ekspansi kofaktor)',
          'Invers matriks ordo 2x2 dan penyelesaian persamaan matriks AX = B serta SPLDV dengan matriks',
        ],
      },
      {
        topic: 'Transformasi Geometri dengan Matriks',
        subMaterials: [
          'Translasi oleh matriks translasi T = (a, b)',
          'Refleksi terhadap sumbu-x, sumbu-y, y=x, y=-x, x=h, y=k dengan matriks transformasi',
          'Rotasi terhadap pusat (0,0) dan (a,b) dengan sudut putar θ',
          'Dilatasi dengan faktor skala k dan komposisi beberapa transformasi matriks',
        ],
      },
      {
        topic: 'Limit Fungsi Aljabar',
        subMaterials: [
          'Konsep intuitif limit fungsi dan sifat-sifat teorema limit aljabar',
          'Menentukan nilai limit fungsi aljabar x mendekati c (metode substitusi, pemfaktoran, perkalian sekawan)',
          'Limit fungsi aljabar menuju tak hingga (lim x→∞ f(x)) pada bentuk pecahan dan bentuk akar',
        ],
      },
      {
        topic: 'Turunan Fungsi Aljabar (Diferensial) dan Penerapannya',
        subMaterials: [
          'Konsep turunan fungsi sebagai limit fungsi f\'(x) = lim h→0 [f(x+h)-f(x)]/h dan aturan turunan aljabar',
          'Aturan rantai, turunan hasil kali u.v dan hasil bagi u/v',
          'Penerapan turunan: persamaan garis singgung kurva, fungsi naik/turun, titik stasioner, nilai maksimum/minimum, dan laju perubahan',
        ],
      },
      {
        topic: 'Integral Tak Tentu dan Integral Tentu Fungsi Aljabar',
        subMaterials: [
          'Konsep antiturunan dan rumus dasar integral tak tentu ∫ x^n dx = 1/(n+1) x^(n+1) + C',
          'Teknik integrasi substitusi aljabar sederhana',
          'Integral tentu (Teorema Dasar Kalkulus) dan perhitungan luas daerah di bawah kurva',
        ],
      },
      {
        topic: 'Dimensi Tiga / Geometri Ruang',
        subMaterials: [
          'Kedudukan titik, garis, dan bidang pada bangun ruang kubus dan balok',
          'Jarak titik ke titik, jarak titik ke garis, dan jarak titik ke bidang',
          'Jarak garis ke garis sejajar, garis ke bidang, bidang ke bidang, dan besar sudut antara dua garis/bidang',
        ],
      },
      {
        topic: 'Statistika Data Berkelompok',
        subMaterials: [
          'Penyajian data berkelompok dalam bentuk tabel distribusi frekuensi, histogram, dan poligon frekuensi',
          'Ukuran pemusatan: rata-rata (mean data kelompok), median (Me), dan modus (Mo)',
          'Ukuran penyebaran: kuartil (Q1, Q2, Q3), desil, varians (ragam), dan simpangan baku (standar deviasi)',
        ],
      },
      {
        topic: 'Kaidah Pencacahan dan Peluang Majemuk',
        subMaterials: [
          'Aturan penjumlahan, aturan perkalian (filling slots), dan notasi faktorial n!',
          'Permutasi (unsur berbeda, unsur sama, permutasi siklis) dan Kombinasi C(n, r)',
          'Peluang kejadian saling lepas, saling bebas, dan peluang bersyarat P(A|B)',
        ],
      },
    ],
  },

  // MATEMATIKA TINGKAT LANJUT SMA
  {
    name: 'Matematika Tingkat Lanjut',
    aliases: ['matematika tingkat lanjut', 'matematika peminatan', 'mtk lanjut', 'math advanced'],
    topics: [
      {
        topic: 'Polinomial (Suku Banyak)',
        subMaterials: [
          'Operasi aljabar polinomial (penjumlahan, pengurangan, perkalian) dan kesamaan polinomial',
          'Pembagian polinomial bersusun dan metode Horner / sintetik',
          'Teorema Sisa dan Teorema Faktor serta menentukan akar-akar rasional persamaan polinomial (Vieta)',
        ],
      },
      {
        topic: 'Matriks Lanjutan dan Sistem Persamaan Linear',
        subMaterials: [
          'Invers matriks ordo 3x3 menggunakan adjoint dan kofaktor',
          'Penyelesaian SPLTV menggunakan metode invers matriks dan aturan Cramer',
          'Nilai eigen dan vektor eigen dasar serta aplikasinya',
        ],
      },
      {
        topic: 'Vektor pada Bidang (R²) dan Ruang (R³)',
        subMaterials: [
          'Vektor posisi, panjang vektor, vektor satuan, dan operasi aljabar vektor',
          'Perkalian skalar dua vektor (dot product) u . v = |u||v| cos θ dan besar sudut antar dua vektor',
          'Perkalian silang dua vektor (cross product) u × v dan proyeksi skalar/vektor ortogonal',
        ],
      },
      {
        topic: 'Geometri Analitik dan Irisan Kerucut',
        subMaterials: [
          'Persamaan lingkaran dengan pusat (0,0) dan (a,b) serta bentuk umum x² + y² + Ax + By + C = 0',
          'Persamaan garis singgung lingkaran melalui titik pada lingkaran, gradien m, dan titik di luar lingkaran',
          'Irisan kerucut: persamaan parabola, persamaan elips, dan persamaan hiperbola beserta unsur-unsurnya',
        ],
      },
      {
        topic: 'Trigonometri Lanjutan dan Persamaan Trigonometri',
        subMaterials: [
          'Penyelesaian persamaan trigonometri dasar: sin x = sin α, cos x = cos α, tan x = tan α',
          'Rumus trigonometri jumlah dan selisih dua sudut: sin(α±β), cos(α±β), tan(α±β)',
          'Rumus sudut ganda (2α), sudut paruh (α/2), dan perkalian ke penjumlahan/pengurangan trigonometri',
        ],
      },
      {
        topic: 'Kalkulus: Turunan dan Integral Fungsi Trigonometri',
        subMaterials: [
          'Turunan fungsi trigonometri dasar (sin, cos, tan, sec, csc, cot) dan aturan rantai trigonometri',
          'Aplikasi turunan trigonometri: garis singgung, nilai maksimum/minimum, dan titik belok kurva',
          'Integral fungsi trigonometri dan teknik integrasi parsial / substitusi trigonometri',
        ],
      },
      {
        topic: 'Distribusi Peluang Binomial dan Distribusi Normal',
        subMaterials: [
          'Variabel acak diskret dan fungsi distribusi peluang binomial P(X = x) = C(n,x) . p^x . q^(n-x)',
          'Variabel acak kontinu, kurva distribusi normal standar (Z-score), dan pembacaan tabel Z',
          'Uji hipotesis statistik dasar dan penarikan kesimpulan berbasis probabilitas',
        ],
      },
    ],
  },

  // FISIKA SMA
  {
    name: 'Fisika',
    aliases: ['fisika', 'physics', 'fisika sma'],
    topics: [
      {
        topic: 'Besaran, Satuan, Angka Penting, dan Vektor',
        subMaterials: [
          'Besaran pokok dan turunan, dimensi besaran, dan analisis dimensional rumus fisika',
          'Aturan angka penting dan ketidakpastian pengukuran alat ukur presisi',
          'Penjumlahan vektor metode analitis (penguraian komponen sumbu x dan y) dan perkalian vektor',
        ],
      },
      {
        topic: 'Kinematika Gerak Lurus dan Gerak Parabola',
        subMaterials: [
          'GLB dan GLBB, analisis grafik x-t, v-t, dan a-t, serta gerak jatuh bebas / vertikal ke atas',
          'Gerak parabola: kecepatan awal komponen x-y, tinggi maksimum, waktu di udara, dan jarak jangkauan terjauh',
          'Gerak melingkar beraturan (GMB) dan gerak melingkar berubah beraturan (GMBB), percepatan sentripetal',
        ],
      },
      {
        topic: 'Dinamika Gerak dan Hukum Newton',
        subMaterials: [
          'Hukum I, II, dan III Newton tentang gerak, diagram gaya bebas pada bidang miring dan sistem katrol',
          'Gaya gesekan statis dan kinetis, gaya normal, dan tegangan tali',
          'Hukum gravitasi universal Newton, percepatan gravitasi planet, dan Hukum Kepler I, II, III',
        ],
      },
      {
        topic: 'Usaha, Energi, dan Momentum-Impuls',
        subMaterials: [
          'Konsep usaha oleh gaya konstan dan gaya berubah (grafik F-s), energi kinetik, dan teorema usaha-energi',
          'Energi potensial gravitasi dan pegas serta Hukum Kekekalan Energi Mekanik (Em1 = Em2)',
          'Momentum (p = m.v), impuls (I = F.Δt = Δp), dan hukum kekekalan momentum pada tumbukan elastis/inelastis',
        ],
      },
      {
        topic: 'Dinamika Rotasi dan Keseimbangan Benda Tegar',
        subMaterials: [
          'Momen gaya / torsi (τ = r × F) dan momen inersia berbagai bentuk benda tegar (I = k.m.r²)',
          'Hukum II Newton untuk rotasi (Στ = I.α), energi kinetik rotasi, dan momentum sudut',
          'Syarat keseimbangan statis benda tegar (ΣFx = 0, ΣFy = 0, Στ = 0) dan penentuan titik berat benda',
        ],
      },
      {
        topic: 'Fluida Statis dan Fluida Dinamis',
        subMaterials: [
          'Fluida statis: tekanan hidrostatis, Hukum Pascal, Hukum Archimedes (gaya apung), tegangan permukaan, dan kapilaritas',
          'Fluida dinamis: persamaan kontinuitas debit (A1.v1 = A2.v2) dan Hukum Bernoulli (P + 1/2.ρ.v² + ρ.g.h = C)',
          'Penerapan Hukum Bernoulli pada venturimeter, tabung pitot, gaya angkat sayap pesawat, dan kebocoran tangki Torricelli',
        ],
      },
      {
        topic: 'Suhu, Kalor, dan Termodinamika',
        subMaterials: [
          'Kalor jenis, kapasitas kalor, Asas Black, perubahan wujud, dan perpindahan kalor (konduksi, konveksi, radiasi)',
          'Teori kinetik gas ideal: persamaan keadaan P.V = n.R.T, energi kinetik rata-rata, dan kecepatan efektif gas',
          'Hukum Termodinamika I (Q = ΔU + W) pada proses isobarik, isotermik, isokhorik, adiabatik',
          'Hukum Termodinamika II, efisiensi mesin Carnot (η = (1 - Tc/Th) × 100%), dan entropi',
        ],
      },
      {
        topic: 'Gelombang Mekanik, Bunyi, dan Cahaya',
        subMaterials: [
          'Persamaan gelombang berjalan y = A sin(ωt ± kx) dan gelombang stasioner ujung bebas/terikat',
          'Gelombang bunyi: cepat rambat dawai/pipa organa, Efek Doppler fp = fs.(v ± vp)/(v ∓ vs), intensitas & taraf intensitas (TI = 10 log(I/I0))',
          'Gelombang cahaya: interferensi celah ganda Young, kisi difraksi, difraksi celah tunggal, dan polarisasi cahaya',
        ],
      },
      {
        topic: 'Listrik Statis dan Listrik Dinamis (DC)',
        subMaterials: [
          'Hukum Coulomb, kuat medan listrik E, potensial listrik V, dan kapasitor keping sejajar (kapasitansi & energi tersimpan)',
          'Rangkaian arus searah: Hukum Ohm, Hukum Kirchhoff I dan II pada rangkaian 1 loop dan 2 loop',
          'Jembatan Wheatstone dan energi serta daya listrik',
        ],
      },
      {
        topic: 'Medan Magnetik, Induksi Elektromagnetik, dan Arus Bolak-Balik (AC)',
        subMaterials: [
          'Hukum Biot-Savart dan Hukum Ampere pada kawat lurus, kawat melingkar, solenoida, dan toroida',
          'Gaya Lorentz pada kawat berarus dan muatan bergerak dalam medan magnet',
          'Hukum Faraday dan Lenz tentang GGL induksi (ε = -N dΦ/dt), induktansi diri, dan transformator',
          'Rangkaian R-L-C seri arus bolak-balik: impedansi Z = √(R² + (XL-XC)²), diagram fasor, resonansi, dan faktor daya',
        ],
      },
      {
        topic: 'Fisika Modern, Relativitas, dan Fisika Inti',
        subMaterials: [
          'Teori relativitas khusus Einstein: postulat relativitas, dilatasi waktu, kontraksi panjang, dan kesetaraan massa-energi E = mc²',
          'Radiasi benda hitam (Hukum Planck & Wien), efek fotolistrik Einstein (Ek = h.f - W0), dan efek Compton',
          'Struktur inti atom, defek massa, energi ikat inti, radioaktivitas (peluruhan alfa, beta, gamma), dan reaksi fisi/fusi nuklir',
        ],
      },
    ],
  },

  // KIMIA SMA
  {
    name: 'Kimia',
    aliases: ['kimia', 'chemistry', 'kimia sma'],
    topics: [
      {
        topic: 'Struktur Atom, Konfigurasi Elektron, dan Tabel Periodik',
        subMaterials: [
          'Perkembangan model atom (Dalton, Thomson, Rutherford, Bohr, Mekanika Kuantum) dan 4 bilangan kuantum (n, l, m, s)',
          'Konfigurasi elektron (prinsip Aufbau, aturan Hund, larangan Pauli) dan letak unsur dalam Sistem Periodik Unsur (SPU)',
          'Sifat keperiodikan unsur: jari-jari atom, energi ionisasi, afinitas elektron, dan keelektronegatifan',
        ],
      },
      {
        topic: 'Ikatan Kimia dan Bentuk Molekul',
        subMaterials: [
          'Struktur Lewis, aturan oktet/duplet, ikatan ionik, ikatan kovalen (tunggal, rangkap, koordinasi), dan ikatan logam',
          'Teori Domain Elektron / VSEPR dan Hibridisasi orbital dalam menentukan geometri bentuk molekul',
          'Kepolaran senyawa dan gaya antarmolekul (gaya Van der Waals, gaya London, ikatan hidrogen)',
        ],
      },
      {
        topic: 'Hukum-Hukum Dasar Kimia dan Stoikiometri (Konsep Mol)',
        subMaterials: [
          'Hukum Lavoisier (kekekalan massa), Hukum Proust (perbandingan tetap), Hukum Dalton, Hukum Gay-Lussac, dan Hipotesis Avogadro',
          'Konsep mol: massa molar (Mr), volume molar gas (STP, RTP), jumlah partikel, dan kemolaran (M)',
          'Penyetaraan persamaan reaksi kimia, pereaksi pembatas, kadar zat, rumus empiris, dan rumus molekul',
        ],
      },
      {
        topic: 'Larutan Elektrolit, Redoks, dan Tata Nama Senyawa',
        subMaterials: [
          'Daya hantar listrik larutan elektrolit kuat, lemah, dan non-elektrolit beserta derajat ionisasi (α)',
          'Konsep reaksi redoks berdasarkan pengikatan/pelepasan oksigen, elektron, dan perubahan bilangan oksidasi (biloks)',
          'Tata nama senyawa anorganik biner dan poliatomik serta penentuan oksidator/reduktor',
        ],
      },
      {
        topic: 'Termokimia',
        subMaterials: [
          'Sistem dan lingkungan, reaksi eksoterm (ΔH < 0) vs endoterm (ΔH > 0), dan persamaan termokimia',
          'Jenis perubahan entalpi standar: pembentukan (ΔHf°), penguraian (ΔHd°), pembakaran (ΔHc°), dan netralisasi',
          'Perhitungan ΔH reaksi menggunakan kalorimeter (q = m.c.ΔT), Hukum Hess, data entalpi pembentukan, dan energi ikatan rata-rata',
        ],
      },
      {
        topic: 'Laju Reaksi dan Teori Tumbukan',
        subMaterials: [
          'Pengertian laju reaksi, persamaan laju reaksi v = k [A]^m [B]^n, dan penentuan orde reaksi',
          'Faktor-faktor yang mempengaruhi laju reaksi: konsentrasi, luas permukaan, suhu, dan katalis berbasis teori tumbukan',
        ],
      },
      {
        topic: 'Kesetimbangan Kimia',
        subMaterials: [
          'Konsep kesetimbangan dinamis homogen dan heterogen serta tetapan kesetimbangan Kc dan Kp',
          'Pergeseran kesetimbangan menurut Asas Le Chatelier: pengaruh konsentrasi, suhu, tekanan, dan volume',
          'Aplikasi kesetimbangan kimia dalam proses industri (sintesis amonia Haber-Bosch dan asam sulfat proses Kontak)',
        ],
      },
      {
        topic: 'Asam, Basa, pH, dan Titrasi',
        subMaterials: [
          'Teori asam basa Arrhenius, Bronsted-Lowry (pasangan asam-basa konjugasi), dan Lewis',
          'Perhitungan derajat keasaman (pH) asam/basa kuat dan asam/basa lemah menggunakan Ka/Kb dan Kw',
          'Titrasi asam-basa: kurva titrasi, titik ekivalen, titik akhir titrasi, dan pemilihan indikator pH',
        ],
      },
      {
        topic: 'Larutan Penyangga (Buffer) dan Hidrolisis Garam',
        subMaterials: [
          'Komponen larutan penyangga (asam lemah + basa konjugasi / basa lemah + asam konjugasi) dan perhitungan pH buffer',
          'Peran larutan penyangga dalam tubuh makhluk hidup (sistem buffer karbonat dalam darah)',
          'Hidrolisis garam: garam dari asam kuat-basa lemah, asam lemah-basa kuat, dan asam lemah-basa lemah beserta rumus pH hidrolisis',
        ],
      },
      {
        topic: 'Kelarutan dan Hasil Kali Kelarutan (Ksp)',
        subMaterials: [
          'Hubungan kelarutan (s) dan tetapan hasil kali kelarutan (Ksp)',
          'Pengaruh penambahan ion sejenis terhadap kelarutan',
          'Memprediksi terjadinya endapan dengan membandingkan nilai Qc terhadap Ksp (Qc < Ksp, Qc = Ksp, Qc > Ksp)',
        ],
      },
      {
        topic: 'Sistem Koloid',
        subMaterials: [
          'Perbedaan larutan, koloid, dan suspensi serta jenis-jenis koloid (sol, emulsi, buih, aerosol, gel)',
          'Sifat-sifat koloid: Efek Tyndall, gerak Brown, adsorpsi, koagulasi, elektroforesis, dan dialisis',
          'Cara pembuatan koloid metode kondensasi dan dispersi serta aplikasinya dalam industri',
        ],
      },
      {
        topic: 'Sifat Koligatif Larutan',
        subMaterials: [
          'Konsentrasi larutan: fraksi mol (X) dan molalitas (m)',
          'Penurunan tekanan uap (ΔP), kenaikan titik didih (ΔTb), penurunan titik beku (ΔTf), dan tekanan osmotik (π)',
          'Sifat koligatif larutan elektrolit dengan faktor Van\'t Hoff (i = 1 + (n-1)α)',
        ],
      },
      {
        topic: 'Elektrokimia: Sel Volta, Elektrolisis, dan Korosi',
        subMaterials: [
          'Penyetaraan persamaan reaksi redoks metode perubahan bilangan oksidasi dan metode setengah reaksi (ion-elektron)',
          'Sel Volta / Galvani: notasi sel, potensial sel standar (E°sel = E°katoda - E°anoda), dan deret Volta',
          'Sel Elektrolisis: reaksi di katoda dan anoda serta perhitungan massa endapan menggunakan Hukum Faraday I & II (w = e.i.t / 96500)',
          'Proses korosi besi dan metode pencegahan korosi (pelapisan, proteksi katodik / anoda korban)',
        ],
      },
      {
        topic: 'Kimia Karbon (Organik) dan Benzena',
        subMaterials: [
          'Kekhasan atom karbon, hidrokarbon (alkana, alkena, alkuna), dan keisomeran (rantai, posisi, fungsi, geometri)',
          'Gugus fungsi senyawa karbon: haloalkana, alkohol, eter, aldehid (alkanal), keton (alkanon), asam karboksilat (asam alkanoat), dan ester (alkil alkanoat)',
          'Benzena dan turunannya: tata nama (toluena, anilina, fenol, asam benzoat), sifat, dan reaksi substitusi elektrofilik',
        ],
      },
      {
        topic: 'Makromolekul: Polimer, Karbohidrat, Protein, Lipid',
        subMaterials: [
          'Polimerisasi adisi vs kondensasi, polimer sintetis (plastik, nilon, teflon) dan polimer alami (karet, protein)',
          'Struktur dan klasifikasi karbohidrat (monosakarida, disakarida, polisakarida) serta uji karbohidrat (Molisch, Benedict, Iodium)',
          'Asam amino, struktur protein, ikatan peptida, dan uji protein (Biuret, Xantoproteat, Uji Belerang)',
          'Lipid / lemak: asam lemak jenuh/tak jenuh, reaksi saponifikasi (pembuatan sabun), dan fungsi biologis lemak',
        ],
      },
    ],
  },

  // BIOLOGI SMA
  {
    name: 'Biologi',
    aliases: ['biologi', 'biology', 'biologi sma'],
    topics: [
      {
        topic: 'Keanekaragaman Hayati, Virus, dan Bakteri',
        subMaterials: [
          'Tingkat keanekaragaman hayati (gen, jenis, ekosistem) di Indonesia, garis Wallace & Weber, dan upaya konservasi insitu/exsitu',
          'Virus: struktur kapsid, asam nukleat, daur litik dan lisogenik, peranan virus, dan vaksinasi',
          'Bakteri (Eubacteria dan Archaebacteria): struktur sel prokariotik, pewarnaan Gram, reproduksi, dan peranan bakteri',
        ],
      },
      {
        topic: 'Protista, Jamur (Fungi), Plantae, dan Animalia',
        subMaterials: [
          'Protista mirip hewan (Protozoa), mirip tumbuhan (Alga), dan mirip jamur',
          'Fungi: Zygomycota, Ascomycota, Basidiomycota, Deuteromycota, mikoriza, dan lichen',
          'Plantae: metagenesis lumut (Bryophyta) dan paku (Pteridophyta), serta tumbuhan berbiji (Gymnospermae & Angiospermae)',
          'Animalia: ciri filum Invertebrata (Porifera sampai Echinodermata) dan Vertebrata (Pisces, Amphibia, Reptilia, Aves, Mammalia)',
        ],
      },
      {
        topic: 'Ekologi, Ekosistem, dan Daur Biogeokimia',
        subMaterials: [
          'Komponen ekosistem, interaksi rantai makanan, jaring makanan, dan piramida energi',
          'Daur biogeokimia: siklus air, siklus karbon, siklus nitrogen, siklus fosfor, dan siklus belerang/sulfur',
          'Dampak perubahan lingkungan, pencemaran lingkungan, dan upaya pemulihan ekosistem',
        ],
      },
      {
        topic: 'Sel dan Transpor Membran',
        subMaterials: [
          'Struktur dan fungsi organel sel eukariotik (nukleus, mitokondria, RE, badan Golgi, lisosom, kloroplas, ribosom)',
          'Perbedaan sel hewan vs sel tumbuhan',
          'Mekanisme transpor membran: transpor pasif (difusi sederhana, difusi terfasilitasi, osmosis) dan transpor aktif (pompa ion Na-K, endositosis, eksositosis)',
        ],
      },
      {
        topic: 'Struktur dan Fungsi Jaringan Tumbuhan serta Jaringan Hewan',
        subMaterials: [
          'Jaringan tumbuhan: meristem, epidermis, parenkim, penyokong (kolenkim, sklerenkim), dan pengangkut (xilem, floem)',
          'Jaringan hewan: epitel (pipih, kubus, silindris), ikat (tulang, darah, adiposa), otot (polos, lurik, jantung), dan saraf',
          'Kultur jaringan tumbuhan dan teknologi stem cell (sel punca)',
        ],
      },
      {
        topic: 'Sistem Organ Tubuh Manusia',
        subMaterials: [
          'Sistem gerak: struktur tulang, macam-macam sendi gerak (diartrosis), mekanisme kontraksi otot (sliding filament theory), kelainan sistem gerak',
          'Sistem peredaran darah: komponen darah, mekanisme pembekuan darah, struktur jantung, sirkulasi sistemik/pulmonal, golongan darah ABO & Rhesus',
          'Sistem pencernaan: organ saluran & kelenjar cerna, enzim pencernaan, uji zat makanan, dan kelainan pencernaan',
          'Sistem pernapasan: organ, mekanisme pernapasan dada & perut, volume udara pernapasan, pertukaran gas O2 & CO2',
          'Sistem ekskresi: struktur nefron ginjal, proses pembentukan urine (filtrasi, reabsorpsi, augmentasi), hati, kulit, paru-paru',
          'Sistem regulasi / koordinasi: sistem saraf (impuls saraf & gerak refleks), sistem endokrin (hormon), dan alat indra manusia',
          'Sistem reproduksi: spermatogenesis, oogenesis, siklus menstruasi, fertilisasi, kontrasepsi, dan penyakit menular seksual',
          'Sistem pertahanan tubuh (imunitas): imunitas bawaan (non-spesifik) dan adaptif (spesifik: sel T dan sel B), antibodi, imunisasi',
        ],
      },
      {
        topic: 'Metabolisme Sel (Enzim, Katabolisme, Anabolisme)',
        subMaterials: [
          'Enzim: struktur (apoenzim, koenzim), sifat, mekanisme kerja (lock and key vs induced fit), dan faktor yang mempengaruhinya',
          'Katabolisme karbohidrat (respirasi aerob): glikolisis, dekarboksilasi oksidatif, siklus Krebs, dan rantai transpor elektron (menghasilkan ~36/38 ATP)',
          'Respirasi anaerob / fermentasi: fermentasi asam laktat dan fermentasi alkohol',
          'Anabolisme (fotosintesis): reaksi terang (fotolisis air & fotofosforilasi pada tilakoid) dan reaksi gelap / Siklus Calvin (fiksasi CO2 pada stroma)',
        ],
      },
      {
        topic: 'Materi Genetik dan Sintesis Protein',
        subMaterials: [
          'Struktur DNA (double helix, nukleotida, aturan pasangan basa Chargaff), RNA (mRNA, tRNA, rRNA), dan kromosom',
          'Replikasi DNA (model semikonservatif, konservatif, dispersif)',
          'Tahapan sintesis protein: Transkripsi (inisiasi, elongasi, terminasi oleh RNA polimerase) dan Translasi pada ribosom menggunakan kode genetik (kodon)',
        ],
      },
      {
        topic: 'Pembelahan Sel dan Gametogenesis',
        subMaterials: [
          'Siklus sel: interfase (G1, S, G2) dan tahapan mitosis (profase, metafase, anafase, telofase) pada sel somatik',
          'Tahapan meiosis I dan meiosis II (pindah silang / crossing over pada profase I) pada sel kelamin',
          'Gametogenesis: proses spermatogenesis pada testis dan oogenesis pada ovarium',
        ],
      },
      {
        topic: 'Pola-Pola Hereditas dan Genetika Mendel',
        subMaterials: [
          'Hukum Mendel I (segregasi bebas) pada persilangan monohibrid dan Hukum Mendel II (asortasi bebas) pada persilangan dihibrid',
          'Penyimpangan semu Hukum Mendel: interaksi gen (atavisme), kriptomeri, polimeri, epistasis-hipostasis, dan komplementer',
          'Pola hereditas: tautan gen, pindah silang (NPS), gagal berpisah (nondisjunction), dan gen letal (dominan & resesif)',
          'Hereditas pada manusia: penentuan golongan darah (ABO, MN, Rh), kelainan terpaut autosom (albino, polidaktili), dan terpaut kromosom seks (buta warna, hemofilia)',
        ],
      },
      {
        topic: 'Mutasi, Evolusi, dan Bioteknologi',
        subMaterials: [
          'Mutasi gen (substitusi, insersi, delesi) dan mutasi kromosom (delesi, duplikasi, inversi, translokasi, aneuploidi/poliploidi)',
          'Teori evolusi Darwin vs Lamarck, petunjuk evolusi (fosil, homologi vs analogi organ, embriologi perbandingan), dan Hukum Hardy-Weinberg (p² + 2pq + q² = 1)',
          'Bioteknologi konvensional vs modern: rekombinasi DNA, kloning, antibodi monoklonal, tanaman transgenik, dan bioetika',
        ],
      },
    ],
  },

  // SOSIOLOGI SMA
  {
    name: 'Sosiologi',
    aliases: ['sosiologi', 'sociology', 'sosiologi sma'],
    topics: [
      {
        topic: 'Sosiologi sebagai Ilmu Mengkaji Masyarakat',
        subMaterials: [
          'Ciri-ciri sosiologi sebagai ilmu (empiris, teoritis, kumulatif, non-etis) dan objek kajian sosiologi',
          'Sejarah kelahiran sosiologi oleh Auguste Comte dan tokoh klasik (Emile Durkheim, Max Weber, Karl Marx)',
        ],
      },
      {
        topic: 'Individu, Kelompok, dan Hubungan Sosial',
        subMaterials: [
          'Faktor pendorong interaksi sosial: imitasi, sugesti, identifikasi, simpati, dan empati',
          'Bentuk interaksi sosial asosiatif (kerja sama, akomodasi, asimilasi, akulturasi) dan disosiatif (persaingan, kontravensi, konflik)',
          'Nilai sosial dan norma sosial serta lembaga pengendalian sosial',
        ],
      },
      {
        topic: 'Struktur Sosial, Stratifikasi, dan Diferensiasi Sosial',
        subMaterials: [
          'Konsep struktur sosial, status dan peran sosial (ascribed, achieved, assigned status)',
          'Stratifikasi sosial terbuka, tertutup, dan campuran berdasarkan kekayaan, kekuasaan, kehormatan, ilmu pengetahuan',
          'Diferensiasi sosial horizontal berdasarkan ras, etnis/suku, agama, klan, dan gender',
        ],
      },
      {
        topic: 'Konflik Sosial, Kekerasan, dan Resolusi Perdamaian',
        subMaterials: [
          'Faktor penyebab konflik sosial: perbedaan antarindividu, perbedaan kebudayaan, benturan kepentingan, perubahan sosial cepat',
          'Bentuk-bentuk resolusi konflik / akomodasi: mediasi, arbitrase, konsiliasi, kompromi, ajudikasi, konsiliasi',
          'Upaya integrasi sosial dan reintegrasi sosial pascakonflik',
        ],
      },
      {
        topic: 'Kelompok Sosial di Masyarakat Multikultural',
        subMaterials: [
          'Klasifikasi kelompok sosial: in-group vs out-group, primary vs secondary group, gemeinschaft (paguyuban) vs gesellschaft (patembayan)',
          'Dinamika kelompok sosial dan partikularisme vs universalisme kelompok',
        ],
      },
      {
        topic: 'Permasalahan Sosial, Ketimpangan, dan Perubahan Sosial',
        subMaterials: [
          'Masalah sosial: kemiskinan struktural, kriminalitas, kesenjangan sosial ekonomi, dan ketidakadilan gender',
          'Teori perubahan sosial (teori siklus, teori linier / evolusi, teori konflik, teori fungsional)',
          'Dampak modernisasi, globalisasi, westernisasi, dan upaya pelestarian kearifan lokal di tengah perubahan',
        ],
      },
      {
        topic: 'Metode Penelitian Sosial',
        subMaterials: [
          'Rancangan penelitian sosial: topik, rumusan masalah, tujuan, hipotesis, dan kajian pustaka',
          'Pendekatan kuantitatif (survei, kuesioner) vs kualitatif (wawancara mendalam, observasi partisipatoris, studi kasus)',
          'Teknik pengolahan data, analisis data, dan penyusunan laporan penelitian ilmiah',
        ],
      },
    ],
  },

  // EKONOMI SMA
  {
    name: 'Ekonomi',
    aliases: ['ekonomi', 'economics', 'ekonomi sma'],
    topics: [
      {
        topic: 'Konsep Dasar Ilmu Ekonomi, Kelangkaan, dan Biaya Peluang',
        subMaterials: [
          'Pengertian kelangkaan (scarcity), kebutuhan manusia yang tak terbatas vs alat pemuas kebutuhan yang terbatas',
          'Biaya peluang (opportunity cost), skala prioritas kebutuhan, dan prinsip ekonomi',
          'Masalah pokok ekonomi klasik (produksi, distribusi, konsumsi) vs modern (what, how, for whom)',
          'Sistem ekonomi: tradisional, pasar / liberal, komando / terpusat, dan campuran / Pancasila',
        ],
      },
      {
        topic: 'Pelaku Ekonomi dan Keseimbangan Pasar',
        subMaterials: [
          'Peran Rumah Tangga Konsumen (RTK), Produsen (RTP), Pemerintah (RTG), dan Masyarakat Luar Negeri (RTLN) dalam Circular Flow Diagram',
          'Hukum permintaan dan penawaran serta kurva pergeseran permintaan/penawaran',
          'Perhitungan elastisitas permintaan dan elastisitas penawaran (Ed dan Es) serta harga keseimbangan pasar (Qd = Qs)',
          'Struktur pasar: pasar persaingan sempurna vs pasar persaingan tidak sempurna (monopoli, oligopoli, monopolistik)',
        ],
      },
      {
        topic: 'Lembaga Jasa Keuangan, Bank Sentral, dan Sistem Pembayaran',
        subMaterials: [
          'Peran Otoritas Jasa Keuangan (OJK) dalam mengatur dan mengawasi sektor jasa keuangan',
          'Peran Bank Indonesia (BI) sebagai bank sentral: kebijakan moneter, stabilitas nilai rupiah, dan perbankan konvensional/syariah',
          'Pasar modal (saham, obligasi, reksadana), perasuransian, pegadaian, dan lembaga pembiayaan',
          'Sistem pembayaran tunai (uang kartal/giral) dan non-tunai (kartu debit/kredit, e-wallet, QRIS, BI-FAST)',
        ],
      },
      {
        topic: 'Badan Usaha dalam Perekonomian Indonesia dan Koperasi',
        subMaterials: [
          'Karakteristik dan peran BUMN, BUMD, dan BUMS (PT, CV, Firma, Perusahaan Perseorangan)',
          'Koperasi: asas, landasan, prinsip, jenis koperasi, dan perhitungan Sisa Hasil Usaha (SHU)',
          'Fungsi-fungsi manajemen (POAC: Planning, Organizing, Actuating, Controlling)',
        ],
      },
      {
        topic: 'Pendapatan Nasional dan Pertumbuhan Ekonomi',
        subMaterials: [
          'Konsep pendapatan nasional: PDB/GDP, PNB/GNP, NNP, NNI, PI, dan DI',
          'Tiga metode perhitungan pendapatan nasional: pendekatan produksi, pendekatan pendapatan, dan pendekatan pengeluaran',
          'Pendapatan per kapita dan indikator ketimpangan distribusi pendapatan (Koefisien Gini dan Kurva Lorenz)',
          'Pertumbuhan ekonomi (teori pertumbuhan Rostow, Schumpeter, Harrod-Domar) dan pembangunan ekonomi',
        ],
      },
      {
        topic: 'Ketenagakerjaan, Inflasi, dan Kebijakan Fiskal/Moneter',
        subMaterials: [
          'Masalah ketenagakerjaan: angkatan kerja, pengangguran (friksional, struktural, siklis), sistem upah, dan peningkatan mutu SDM',
          'Inflasi: pengertian, penyebab (demand pull & cost push), jenis inflasi, indeks harga (IHK), dan dampak inflasi',
          'Kebijakan moneter (operasi pasar terbuka, diskonto, cadangan kas, kredit selektif) vs kebijakan fiskal (pajak dan subsidi)',
        ],
      },
      {
        topic: 'APBN, APBD, dan Perpajakan di Indonesia',
        subMaterials: [
          'Fungsi APBN/APBD (otorisasi, perencanaan, pengawasan, alokasi, distribusi, stabilisasi) dan pos penerimaan/pengeluaran negara',
          'Pajak: fungsi pajak, asas pemungutan, tarif pajak (progresif, degresif, proporsional), perhitungan PPh dan PPN',
        ],
      },
      {
        topic: 'Perdagangan Internasional dan Neraca Pembayaran',
        subMaterials: [
          'Teori keunggulan mutlak (Adam Smith) dan teori keunggulan komparatif (David Ricardo)',
          'Kebijakan perdagangan internasional: tarif, kuota, subsidi, dumping, larangan ekspor-impor',
          'Neraca pembayaran (debit, kredit, surplus, defisit) dan perhitungan kurs valuta asing (kurs jual & beli)',
        ],
      },
      {
        topic: 'Akuntansi Perusahaan Jasa dan Perusahaan Dagang',
        subMaterials: [
          'Persamaan dasar akuntansi: Harta = Utang + Modal dan analisis bukti transaksi keuangan',
          'Siklus akuntansi perusahaan jasa: Jurnal Umum, Buku Besar, Neraca Saldo, Jurnal Penyesuaian, Kertas Kerja / Neraca Lajur, dan Laporan Keuangan (Laba Rugi, Perubahan Modal, Posisi Keuangan)',
          'Siklus akuntansi perusahaan dagang: Jurnal Khusus (Pembelian, Penjualan, Penerimaan Kas, Pengeluaran Kas), Buku Besar Pembantu, Harga Pokok Penjualan (HPP), dan Jurnal Penutup',
        ],
      },
    ],
  },

  // GEOGRAFI SMA
  {
    name: 'Geografi',
    aliases: ['geografi', 'geography', 'geografi sma'],
    topics: [
      {
        topic: 'Pengetahuan Dasar Geografi, Pemetaan, dan SIG',
        subMaterials: [
          '10 konsep esensial geografi (lokasi, jarak, keterjangkauan, pola, morfologi, aglomerasi, nilai guna, interaksi/interdependensi, diferensiasi area, keterkaitan keruangan)',
          'Prinsip geografi (distribusi, interelasi, deskripsi, korologi) dan pendekatan geografi (keruangan, ekologi, kompleks wilayah)',
          'Dasar pemetaan: proyeksi peta, skala peta, interpretasi citra penginderaan jauh (PJ), dan subsistem Sistem Informasi Geografis (SIG)',
        ],
      },
      {
        topic: 'Dinamika Litosfer dan Pedosfer',
        subMaterials: [
          'Struktur lapisan bumi, pergerakan lempeng tektonik (konvergen, divergen, transform)',
          'Tenaga endogen: tektonisme, vulkanisme (intrusi, ekstrusi, tipe letusan), dan seisme (gempa bumi & perhitungan episentrum)',
          'Tenaga eksogen: pelapukan (fisika, kimia, biologi), erosi, masswasting, dan sedimentasi',
          'Profil tanah, faktor pembentukan tanah, dan upaya konservasi tanah dari degradasi lahan',
        ],
      },
      {
        topic: 'Dinamika Atmosfer dan Dampaknya terhadap Kehidupan',
        subMaterials: [
          'Lapisan atmosfer (troposfer, stratosfer, mesosfer, termosfer, eksosfer) dan fungsinya',
          'Unsur cuaca dan iklim: suhu udara, tekanan, angin (angin monsun, pasat, fohn), kelembapan, awan, curah hujan',
          'Klasifikasi iklim: Koppen, Schmidt-Ferguson, Junghuhn, dan fenomena perubahan iklim global (El Nino & La Nina)',
        ],
      },
      {
        topic: 'Dinamika Hidrosfer (Perairan Darat dan Laut)',
        subMaterials: [
          'Siklus hidrologi pendek, sedang, panjang dan daerah aliran sungai (DAS)',
          'Perairan darat: sungai (meander, delta), danau (tektonik, vulkanik), rawa, dan air tanah (freatik & artesis)',
          'Perairan laut: morfologi dasar laut (dangkalan, palung, lubuk), zona kedalaman laut, arus laut, salinitas, dan potensi laut Indonesia',
        ],
      },
      {
        topic: 'Posisi Strategis Indonesia dan Flora-Fauna Dunia',
        subMaterials: [
          'Indonesia sebagai poros maritim dunia: batas teritorial, ZEE, landas kontinen, dan Alur Laut Kepulauan Indonesia (ALKI)',
          'Bioma di dunia (tundra, taiga, hutan gugur, padang rumput/savana, gurun, hutan hujan tropis)',
          'Persebaran flora-fauna di Indonesia: tipe Asiatis, Peralihan (garis Wallace), Australis (garis Weber) dan konservasi hayati',
        ],
      },
      {
        topic: 'Pengelolaan Sumber Daya Alam dan Pembangunan Berkelanjutan',
        subMaterials: [
          'Klasifikasi SDA hayati dan non-hayati, SDA dapat diperbaharui vs tidak dapat diperbaharui',
          'Prinsip pembangunan berkelanjutan (SDGs), Analisis Mengenai Dampak Lingkungan (AMDAL), dan ekowisata',
          'Ketahanan pangan, industri manufaktur, dan transisi Energi Baru Terbarukan (EBT)',
        ],
      },
      {
        topic: 'Dinamika Kependudukan dan Mitigasi Bencana Alam',
        subMaterials: [
          'Sensus penduduk, komposisi penduduk, angka kelahiran (CBR), kematian (CDR), migrasi, dan proyeksi bonus demografi',
          'Jenis bencana geologis, klimatologis, dan ekstra-terestrial serta tahapan manajemen bencana (pra-bencana, tanggap darurat, pasca-bencana)',
        ],
      },
      {
        topic: 'Interaksi Desa-Kota dan Tata Ruang Wilayah',
        subMaterials: [
          'Karakteristik desa, tipologi desa, struktur ruang kota (teori konsentris, sektoral, inti berganda)',
          'Interaksi keruangan desa-kota: Teori Gravitasi Reilly dan Teori Titik Henti (Breaking Point Theory)',
          'Rencana Tata Ruang Wilayah (RTRW), wilayah formal dan fungsional, serta pusat-pusat pertumbuhan ekonomi wilayah',
        ],
      },
    ],
  },

  // SEJARAH SMA
  {
    name: 'Sejarah (Umum)',
    aliases: ['sejarah', 'sejarah indonesia', 'sejarah umum', 'sejarah peminatan', 'history'],
    topics: [
      {
        topic: 'Konsep Dasar Ilmu Sejarah dan Historiografi',
        subMaterials: [
          'Konsep manusia, ruang, dan waktu dalam sejarah serta cara berpikir diakronik/kronologis vs sinkronik',
          'Kausalitas sejarah, kontinuitas dan perubahan dalam sejarah',
          'Sumber sejarah (primer, sekunder, lisan, benda, tertulis), kritik sumber (verifikasi), interpretasi, dan penulisan sejarah (historiografi)',
        ],
      },
      {
        topic: 'Masa Praaksara dan Peradaban Kuno Dunia',
        subMaterials: [
          'Fosil manusia purba di Indonesia (Meganthropus, Pithecanthropus, Homo) dan asal-usul nenek moyang bangsa Indonesia (teori Out of Taiwan/Yunnan)',
          'Corak kehidupan berburu-meramu, bercocok tanam, dan perundagian serta hasil budaya megalitikum',
          'Peradaban kuno dunia (Mesopotamia, Mesir Kuno, Lembah Indus, Tiongkok Kuno, Yunani dan Romawi Kuno)',
        ],
      },
      {
        topic: 'Kerajaan-Kerajaan Maritim Hindu-Buddha dan Islam di Indonesia',
        subMaterials: [
          'Teori masuknya Hindu-Buddha (Brahmana, Ksatria, Waisya, Arus Balik) dan kerajaan Kutai, Tarumanegara, Sriwijaya, Mataram Kuno, Majapahit',
          'Penyebaran Islam, saluran Islamisasi, dan kerajaan Samudera Pasai, Demak, Mataram Islam, Banten, Ternate-Tidore, Gowa-Tallo',
          'Akulturasi kebudayaan Hindu-Buddha-Islam dengan budaya lokal nusantara',
        ],
      },
      {
        topic: 'Kolonialisme, Imperialisme, dan Perlawanan Rakyat',
        subMaterials: [
          'Latar belakang kedatangan bangsa Barat (Gold, Glory, Gospel), monopoli perdagangan VOC di Maluku dan Jawa',
          'Kebijakan Daendels, Raffles, Tanam Paksa (Van den Bosch), UU Agraria 1870, dan Politik Etis',
          'Perlawanan bersenjata rakyat daerah (Perang Pattimura, Perang Paderi, Perang Diponegoro, Perang Banjar, Perang Aceh)',
        ],
      },
      {
        topic: 'Pergerakan Nasional dan Sumpah Pemuda',
        subMaterials: [
          'Faktor internal dan eksternal lahirnya nasionalisme Indonesia',
          'Organisasi pergerakan nasional: Budi Utomo, Sarekat Islam, Indische Partij, Perhimpunan Indonesia, PNI, dan PKI',
          'Kongres Pemuda, Sumpah Pemuda 28 Oktober 1928, dan pembentukan GAPI',
        ],
      },
      {
        topic: 'Masa Pendudukan Jepang dan Proklamasi Kemerdekaan',
        subMaterials: [
          'Pendudukan militer Jepang di Indonesia, eksploitasi ekonomi-militer (Romusha, PETA, Heiho), dan perlawanan rakyat',
          'Janji Koiso, pembentukan BPUPKI dan PPKI, serta perumusan dasar negara',
          'Peristiwa Rengasdengklok, penyusunan teks proklamasi di rumah Laksamana Maeda, dan detik-detik Proklamasi 17 Agustus 1945',
        ],
      },
      {
        topic: 'Perjuangan Mempertahankan Kemerdekaan (1945-1949)',
        subMaterials: [
          'Perjuangan bersenjata: Pertempuran Surabaya 10 November, Palagan Ambarawa, Bandung Lautan Api, Medan Area, Serangan Umum 1 Maret 1949',
          'Perjuangan diplomasi: Perjanjian Linggarjati, Renville, Roem-Royen, dan Konferensi Meja Bundar (KMB)',
        ],
      },
      {
        topic: 'Indonesia Masa Demokrasi Liberal dan Demokrasi Terpimpin',
        subMaterials: [
          'Sistem kabinet parlementer (Natsir, Sukiman, Wilopo, Ali, Burhanuddin), Pemilu 1955, dan Dekrit Presiden 5 Juli 1959',
          'Demokrasi Terpimpin: konsep Nasakom, konfrontasi Malaysia, pembebasan Irian Barat (Trikora), dan peristiwa G30S/PKI',
        ],
      },
      {
        topic: 'Indonesia Masa Orde Baru dan Reformasi',
        subMaterials: [
          'Lahirnya Orde Baru (Supersemar), stabilitas politik-ekonomi, Repelita, Trilogi Pembangunan, dan integrasi Timor Timur',
          'Krisis moneter 1997, gerakan mahasiswa 1998, mundurnya Presiden Soeharto, dan agenda reformasi konstitusi/demokrasi',
          'Pemerintahan masa Reformasi (B.J. Habibie, Abdurrahman Wahid, Megawati, SBY, hingga Jokowi)',
        ],
      },
      {
        topic: 'Peran Indonesia dalam Perdamaian Dunia dan Sejarah Kontemporer',
        subMaterials: [
          'Konferensi Asia Afrika (KAA) Bandung 1955, Gerakan Non-Blok (GNB), Misi Pemeliharaan Perdamaian Garuda, dan pembentukan ASEAN',
          'Sejarah dunia kontemporer: Perang Dunia I & II, Perang Dingin (AS vs Uni Soviet), reunifikasi Jerman, dan runtuhnya Uni Soviet',
        ],
      },
    ],
  },
];

// ==========================================
// 4. DATABASE TOPIK KHUSUS JENJANG SMK / MAK
// ==========================================
export const SMK_SUBJECT_TOPICS: SubjectData[] = [
  // PROJEK IPAS (SMK)
  {
    name: 'Projek IPAS (SMK)',
    aliases: ['projek ipas', 'ipas smk', 'ipas', 'sains smk'],
    topics: [
      {
        topic: 'Makhluk Hidup dan Lingkungannya dalam Ekosistem Industri',
        subMaterials: [
          'Komponen biotik-abiotik di lingkungan tempat kerja dan analisis rantai makanan di area agro/industri',
          'Pengaruh aktivitas industri terhadap keseimbangan lingkungan hidup dan upaya pelestarian keanekaragaman hayati',
        ],
      },
      {
        topic: 'Zat dan Perubahannya (Sifat Bahan Industri & Limbah B3)',
        subMaterials: [
          'Sifat fisika dan kimia bahan baku yang digunakan dalam proses produksi kejuruan',
          'Klasifikasi limbah industri (padat, cair, gas, dan Bahan Berbahaya & Beracun / B3)',
          'Metode pengolahan limbah industri dan implementasi prinsip 3R (Reduce, Reuse, Recycle) di bengkel/pabrik',
        ],
      },
      {
        topic: 'Energi dan Perubahannya (Efisiensi Energi & EBT Industri)',
        subMaterials: [
          'Bentuk-bentuk energi listrik, panas, gerak, dan kimia dalam operasional mesin industri',
          'Audit energi sederhana dan strategi efisiensi pemakaian energi di tempat kerja',
          'Pemanfaatan Energi Baru Terbarukan (EBT: panel surya, biomassa, mikrohidro) untuk instalasi kejuruan',
        ],
      },
      {
        topic: 'Bumi, Antariksa, dan Mitigasi Bencana Lingkungan Kerja',
        subMaterials: [
          'Kondisi geografis, iklim, dan cuaca yang mempengaruhi proses logistik dan operasional kerja',
          'Analisis potensi bencana alam dan kecelakaan kerja di area industri serta prosedur tanggap darurat evakuasi',
        ],
      },
      {
        topic: 'Keruangan, Konektivitas Antarruang, Logistik, dan Transportasi',
        subMaterials: [
          'Konsep keterhubungan ruang produksi dengan pasar konsumen dan jaringan rantai pasok (supply chain)',
          'Manajemen pergudangan, distribusi barang, dan efisiensi transportasi logistik industri',
        ],
      },
      {
        topic: 'Interaksi Sosial, Budaya Kerja, dan Produktivitas Industri',
        subMaterials: [
          'Interaksi sosial di tempat kerja, komunikasi efektif antardivisi, dan pembagian tugas tim kerja',
          'Penerapan budaya kerja industri profesional: 5R/5S (Ringkas, Rapi, Resik, Rawat, Rajin) dan etika kerja',
        ],
      },
      {
        topic: 'Perilaku Ekonomi, Ketenagakerjaan, dan Kesejahteraan Kerja',
        subMaterials: [
          'Faktor produksi (modal, tenaga kerja, teknologi, kewirausahaan) dan produktivitas tenaga kerja kejuruan',
          'Hak dan kewajiban tenaga kerja berdasarkan regulasi ketenagakerjaan, BPJS Ketenagakerjaan, dan K3LH',
        ],
      },
    ],
  },

  // MATEMATIKA TERAPAN (SMK)
  {
    name: 'Matematika Terapan',
    aliases: ['matematika terapan', 'matematika kejuruan', 'matematika smk', 'matematika', 'mtk smk'],
    topics: [
      {
        topic: 'Aritmetika Bisnis, Modal, dan Biaya Produksi',
        subMaterials: [
          'Perhitungan persentase laba-rugi, rabat/diskon bertingkat, komisi penjualan, dan perpajakan usaha',
          'Bunga tunggal dan bunga majemuk pada pinjaman modal usaha serta anuitas pelunasan kredit alat kerja',
        ],
      },
      {
        topic: 'Matriks Terapan dan Optimasi Masalah Kejuruan',
        subMaterials: [
          'Representasi data tabel inventaris barang, persediaan bahan baku, dan biaya operasional dalam bentuk matriks',
          'Penyelesaian sistem persamaan biaya dan kebutuhan produksi menggunakan operasi perkalian matriks dan invers matriks',
        ],
      },
      {
        topic: 'Trigonometri Terapan Pengukuran dan Konstruksi',
        subMaterials: [
          'Penerapan perbandingan trigonometri untuk menentukan tinggi bangunan, lebar sungai, dan kemiringan lereng',
          'Sudut elevasi, sudut depresi, dan azimut dalam pemetaan lapangan dan gambar teknik',
        ],
      },
      {
        topic: 'Vektor Terapan pada Sistem Mekanika dan Listrik',
        subMaterials: [
          'Representasi gaya tarik, momen gaya, dan tegangan pada konstruksi rangka batang menggunakan vektor',
          'Analisis fasor tegangan dan arus listrik bolak-balik menggunakan bilangan kompleks dan vektor',
        ],
      },
      {
        topic: 'Statistika Industri dan Pengendalian Mutu (Quality Control)',
        subMaterials: [
          'Penyajian data hasil pengukuran toleransi ukuran komponen mesin dalam tabel dan histogram',
          'Penggunaan mean, median, simpangan baku, dan grafik kendali mutu (Control Chart) untuk mendeteksi cacat produk',
        ],
      },
      {
        topic: 'Kalkulus Terapan: Optimasi Fungsi Biaya dan Produksi',
        subMaterials: [
          'Penggunaan turunan fungsi untuk menentukan biaya produksi minimum dan keuntungan penjualan maksimum',
          'Integral terapan untuk menghitung luas permukaan bidang lengkung komponen dan volume material kerja',
        ],
      },
    ],
  },

  // BAHASA INGGRIS KEJURUAN (SMK)
  {
    name: 'Bahasa Inggris Kejuruan',
    aliases: ['bahasa inggris kejuruan', 'bahasa inggris', 'english for vocational', 'b. inggris smk', 'esp'],
    topics: [
      {
        topic: 'Workplace Communication & Professional Telephoning',
        subMaterials: [
          'Professional workplace greetings, introducing company profiles, and taking telephone messages/inquiries',
          'Polite requests, asking for clarification, scheduling appointments, and handling visitor receptions',
        ],
      },
      {
        topic: 'Technical Manuals, SOPs, and Safety Workplace Signs',
        subMaterials: [
          'Reading and following technical manuals, wiring diagrams, machinery operational guides, and safety datasheets',
          'Understanding mandatory workplace safety signs, caution warnings, and industrial hazard labels',
        ],
      },
      {
        topic: 'Business Correspondence & Professional Emails',
        subMaterials: [
          'Writing inquiry letters, requesting price quotations, placing purchase orders, and issuing invoices/receipts',
          'Composing professional business emails to suppliers, clients, and project partners',
        ],
      },
      {
        topic: 'Job Application, Resume / CV, and Job Interview Preparation',
        subMaterials: [
          'Writing tailored job application letters and building a professional curriculum vitae (CV) / portfolio',
          'Answering common job interview questions with confidence and presenting personal technical qualifications',
        ],
      },
      {
        topic: 'Customer Service, Handling Inquiries & Complaints',
        subMaterials: [
          'Handling customer complaints with empathy, troubleshooting product issues, and proposing effective remedies',
          'Negotiating business terms, discounts, warranties, and delivery timelines with clients',
        ],
      },
      {
        topic: 'Product Demonstration and Project Pitching',
        subMaterials: [
          'Presenting vocational products or technical solutions using visual slides and demonstrations',
          'Explaining product unique features, technical specifications, competitive advantages, and pricing',
        ],
      },
    ],
  },

  // PRODUK KREATIF DAN KEWIRAUSAHAAN (PKK) (SMK)
  {
    name: 'Produk Kreatif dan Kewirausahaan (PKK)',
    aliases: ['pkk', 'produk kreatif dan kewirausahaan', 'kewirausahaan', 'pkwu smk', 'projek kreatif'],
    topics: [
      {
        topic: 'Analisis Peluang Usaha dan Perencanaan Bisnis Produk/Jasa',
        subMaterials: [
          'Identifikasi peluang usaha di bidang kejuruan dan analisis kelayakan bisnis dengan metode SWOT',
          'Penyusunan proposal usaha (Business Plan) dan Business Model Canvas (BMC) terstruktur',
        ],
      },
      {
        topic: 'Hak Atas Kekayaan Intelektual (HAKI) dan Paten',
        subMaterials: [
          'Konsep HAKI: hak cipta, paten produk, merek dagang, desain industri, rahasia dagang, dan indikasi geografis',
          'Prosedur pendaftaran hak paten dan merek produk hasil inovasi kejuruan ke Dirjen KI Kemenkumham',
        ],
      },
      {
        topic: 'Desain, Prototipe, dan Pengujian Produk',
        subMaterials: [
          'Konsep pembuatan prototipe (mockup, functional prototype) dan tahapan pengujian kesesuaian fungsi produk',
          'Standardisasi produk dan sertifikasi mutu (SNI, ISO, BPOM, Sertifikasi Halal) sesuai regulasi industri',
        ],
      },
      {
        topic: 'Perhitungan Biaya Produksi, HPP, dan Break Even Point (BEP)',
        subMaterials: [
          'Perhitungan biaya bahan baku langsung, biaya tenaga kerja, dan biaya overhead pabrik (BOP)',
          'Penetapan Harga Pokok Produksi (HPP) dan penentuan margin keuntungan harga jual produk',
          'Perhitungan titik impas (Break Even Point / BEP) dalam unit produk dan nominal rupiah',
        ],
      },
      {
        topic: 'Manajemen Produksi Massal dan Pengendalian Mutu (Quality Control)',
        subMaterials: [
          'Perencanaan jadwal produksi massal, alur lini perakitan, dan efisiensi waktu siklus kerja (takt time)',
          'Standar Operasional Prosedur (SOP) pengawasan mutu produk dan penanganan barang cacat / reject',
        ],
      },
      {
        topic: 'Pemasaran Digital (Digital Marketing) dan Penjualan',
        subMaterials: [
          'Strategi bauran pemasaran (Marketing Mix 4P / 7P) dan strategi promosi melalui media sosial',
          'Pemanfaatan marketplace e-commerce, pembuatan konten promosi visual/video, dan search engine optimization (SEO)',
        ],
      },
      {
        topic: 'Penyusunan Laporan Keuangan Sederhana dan Evaluasi Usaha',
        subMaterials: [
          'Pencatatan arus kas masuk/keluar (cash flow), pembuatan laporan laba rugi sederhana, dan neraca saldo',
          'Evaluasi kinerja perkembangan usaha dan rencana pengembangan diversifikasi produk masa depan',
        ],
      },
    ],
  },

  // DASAR-DASAR PROGRAM KEAHLIAN (SMK)
  {
    name: 'Dasar-dasar Program Keahlian',
    aliases: ['dasar-dasar program keahlian', 'kejuruan', 'dasar program keahlian', 'c2', 'c3'],
    topics: [
      {
        topic: 'Keselamatan, Kesehatan Kerja, dan Lingkungan Hidup (K3LH) serta Budaya Kerja',
        subMaterials: [
          'Penerapan standar keselamatan kerja K3LH, penggunaan Alat Pelindung Diri (APD) sesuai SOP',
          'Identifikasi potensi bahaya di tempat kerja, penanganan kecelakaan kerja (P3K), dan penggunaan APAR',
          'Penerapan budaya kerja industri: 5R/5S (Ringkas, Rapi, Resik, Rawat, Rajin) dan etika kerja profesional',
        ],
      },
      {
        topic: 'Pengenalan Alat Ukur Presisi, Perkakas Tangan, dan Instrumen Kerja',
        subMaterials: [
          'Identifikasi jenis dan fungsi alat kerja tangan, alat bertenaga (power tools), dan instrumen ukur spesifik',
          'Teknik kalibrasi, pembacaan skala presisi, dan pemeliharaan berkala peralatan bengkel/lab',
        ],
      },
      {
        topic: 'Membaca Gambar Teknik, Blueprint, dan Standar Operasional Prosedur (SOP)',
        subMaterials: [
          'Standar garis, proyeksi ortogonal, proyeksi piktorial, dan simbol-simbol dalam gambar teknik kejuruan',
          'Membaca dan menerapkan diagram skematik, diagram alir proses industri, dan dokumen SOP kerja',
        ],
      },
      {
        topic: 'Proses Bisnis Menyeluruh Bidang Keahlian dan Tren Industri 4.0',
        subMaterials: [
          'Rantai proses bisnis industri mulai dari pengadaan bahan, perencanaan produksi, hingga layanan purna jual',
          'Pemanfaatan otomatisasi, teknologi digital, dan Internet of Things (IoT) pada sektor industri kejuruan',
        ],
      },
      {
        topic: 'Kesiapan Praktik Kerja Lapangan (PKL) dan Etika Profesional DUDI',
        subMaterials: [
          'Standar kompetensi kerja, disiplin industri, dan kepatuhan terhadap peraturan Dunia Usaha / Dunia Industri (DUDI)',
          'Penyusunan jurnal harian kegiatan PKL, dokumentasi pekerjaan teknis, dan penyusunan laporan akhir PKL',
        ],
      },
    ],
  },
];

// Master mapping per level
export const TOPICS_BY_LEVEL: Record<EducationLevel, SubjectData[]> = {
  sd: SD_SUBJECT_TOPICS,
  smp: SMP_SUBJECT_TOPICS,
  sma: SMA_SUBJECT_TOPICS,
  smk: SMK_SUBJECT_TOPICS,
};

export const DEFAULT_FALLBACK_TOPICS: TopicItem[] = [
  {
    topic: 'Cakupan Materi Inti Semester Ini',
    subMaterials: [
      'Konsep dasar, fakta kunci, dan prinsip utama materi',
      'Penerapan konsep pada studi kasus kontekstual dan kehidupan sehari-hari',
      'Pemecahan masalah bertingkat HOTS dan evaluasi kritis',
    ],
  },
];

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Finds topic suggestions for a given education level and subject.
 */
export function getTopicSuggestions(
  level: EducationLevel = 'smp',
  subjectName: string = '',
  curriculum: CurriculumType = 'merdeka'
): TopicItem[] {
  if (!subjectName) return DEFAULT_FALLBACK_TOPICS;

  const levelDatabase = TOPICS_BY_LEVEL[level] || TOPICS_BY_LEVEL.smp;
  const normalized = normalizeString(subjectName);

  // 1. Exact or alias match within the specific education level
  for (const item of levelDatabase) {
    if (normalizeString(item.name) === normalized) {
      return item.topics;
    }
    for (const alias of item.aliases) {
      if (normalized.includes(alias) || alias.includes(normalized)) {
        return item.topics;
      }
    }
  }

  // 2. Keyword match within the specific education level
  for (const item of levelDatabase) {
    for (const alias of item.aliases) {
      const words = alias.split(' ');
      if (words.some((w) => w.length > 3 && normalized.includes(w))) {
        return item.topics;
      }
    }
  }

  // 3. Fallback to search across other levels if not found
  for (const [lvlKey, db] of Object.entries(TOPICS_BY_LEVEL)) {
    if (lvlKey === level) continue;
    for (const item of db) {
      if (normalizeString(item.name) === normalized) {
        return item.topics;
      }
      for (const alias of item.aliases) {
        if (normalized.includes(alias) || alias.includes(normalized)) {
          return item.topics;
        }
      }
    }
  }

  return DEFAULT_FALLBACK_TOPICS;
}

/**
 * Finds sub-material suggestions for a given education level, subject, and topic.
 */
export function getSubMaterialSuggestions(
  level: EducationLevel = 'smp',
  subjectName: string = '',
  topicName: string = '',
  curriculum: CurriculumType = 'merdeka'
): string[] {
  const topics = getTopicSuggestions(level, subjectName, curriculum);
  if (!topics || topics.length === 0) return [];

  const normTopic = normalizeString(topicName);
  const found = topics.find(
    (t) => normalizeString(t.topic) === normTopic || normTopic.includes(normalizeString(t.topic)) || normalizeString(t.topic).includes(normTopic)
  );

  if (found && found.subMaterials && found.subMaterials.length > 0) {
    return found.subMaterials;
  }

  // If specific topic not matched, aggregate sub-materials from the topics
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
