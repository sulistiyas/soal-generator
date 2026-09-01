import { GoogleGenAI } from '@google/genai';
import { ModulAjarData, ModulAjarGenerationRequest } from '@/types/modul-ajar';

export async function generateModulAjarWithGemini(
  request: ModulAjarGenerationRequest,
  apiKey: string,
  modelName: string = 'gemini-3.6-flash'
): Promise<ModulAjarData> {
  if (!apiKey) {
    throw new Error('API Key Google Gemini belum diatur. Silakan masukkan API Key di menu pengaturan atau file .env.local.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const isK13 = request.format === 'rpp_1_lembar';
  const formatLabel = isK13
    ? 'RPP 1 Lembar Inspiratif (Kurikulum 2013 Sesuai SE Mendikbud No. 14 Tahun 2019)'
    : request.format === 'rpp_berdiferensiasi'
    ? 'Modul Ajar Pembelajaran Berdiferensiasi (Kurikulum Merdeka)'
    : 'Modul Ajar Lengkap Standar Kemendikbudristek (Kurikulum Merdeka)';

  const systemInstruction = `Anda adalah Pakar Pengembang Kurikulum dan Modul Ajar Resmi Kemendikbudristek Indonesia.
Tugas Anda adalah menyusun dokumen Modul Ajar / RPP komprehensif, terstruktur rapi, mendalam, dan siap digunakan oleh guru di sekolah.

Prinsip Penyusunan:
1. Kesesuaian Kurikulum: Selaraskan dengan Panduan Pembelajaran dan Asesmen (PPA) Kemendikbudristek terbaru.
2. Karakteristik Siswa: Rancang kegiatan yang interaktif, student-centered (berpusat pada peserta didik), kontekstual dengan kehidupan di Indonesia, dan mengakomodasi keberagaman siswa.
3. Diferensiasi: Sertakan diferensiasi konten/proses/produk pada kegiatan inti.
4. Sintaks Model Pembelajaran: Terapkan sintaks model pembelajaran (${request.learningModel}) secara runtut dan jelas.
5. Asesmen Berkelanjutan: Sajikan instrumen asesmen diagnostik, formatif, sumatif, dan rubrik Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).
6. Kelengkapan Lampiran: Sediakan Lembar Kerja Peserta Didik (LKPD) yang aplikatif, bahan bacaan ringkas, glosarium istilah penting, dan daftar pustaka relevan.

Wajib menghasilkan output dalam format JSON valid murni sesuai struktur yang diminta, tanpa awalan markdown seperti \`\`\`json.`;

  const prompt = `Susunlah dokumen ${formatLabel} dengan parameter berikut:
- Nama Sekolah / Satuan Pendidikan: ${request.schoolName || 'SD/SMP/SMA Negeri Indonesia'}
- Nama Guru Penyusun: ${request.teacherName || 'Guru Pengampu'}
- NIP Guru: ${request.teacherNip || '-'}
- Nama Kepala Sekolah: ${request.headmasterName || 'Kepala Sekolah'}
- NIP Kepala Sekolah: ${request.headmasterNip || '-'}
- Jenjang: ${request.educationLevel.toUpperCase()}
- Fase / Kelas: ${request.phase} - ${request.grade}
- Mata Pelajaran: ${request.subject}
- Semester: ${request.semester}
- Tahun Ajaran: ${request.academicYear}
- Topik / Materi Pokok: ${request.topic}
${request.subTopics ? `- Sub-topik / Bahasan Khusus: ${request.subTopics}` : ''}
- Alokasi Waktu: ${request.duration || '2 x 35 menit / 2 x 45 menit'}
- Jumlah Pertemuan: ${request.meetingCount} Pertemuan
- Model Pembelajaran: ${request.learningModel}
- Dimensi Profil Pelajar Pancasila: ${request.p5Dimensions.join(', ') || 'Bernalar Kritis, Gotong Royong, Kreatif'}
- Target Peserta Didik: ${request.targetLearners || 'Peserta didik reguler / tipikal'}
- Sarana & Prasarana: ${request.facilities || 'Buku Teks, Laptop/Proyektor, Jaringan Internet, Lembar Kerja'}
${request.differentiationFocus && request.differentiationFocus.length > 0 ? `- Fokus Diferensiasi: ${request.differentiationFocus.join(', ')}` : ''}
${request.additionalInstructions ? `- Instruksi Tambahan Khusus: ${request.additionalInstructions}` : ''}

Struktur JSON yang WAJIB dihasilkan:
{
  "format": "${request.format}",
  "identitas": {
    "namaPenyusun": "${request.teacherName || 'Guru Pengampu'}",
    "nipPenyusun": "${request.teacherNip || '-'}",
    "namaSekolah": "${request.schoolName || 'Satuan Pendidikan'}",
    "jenjang": "${request.educationLevel.toUpperCase()}",
    "mataPelajaran": "${request.subject}",
    "faseKelas": "${request.phase} / ${request.grade}",
    "semester": "${request.semester}",
    "tahunAjaran": "${request.academicYear}",
    "alokasiWaktu": "${request.duration}",
    "jumlahPertemuan": ${request.meetingCount},
    "babTema": "Bab / Tema terkait topik",
    "topikMateri": "${request.topic}",
    "kepalaSekolah": {
      "nama": "${request.headmasterName || 'Kepala Sekolah'}",
      "nip": "${request.headmasterNip || '-'}"
    }
  },
  "kompetensiAwal": [
    "Kompetensi prasyarat atau pengetahuan awal yang perlu dimiliki siswa sebelum mempelajari materi ini"
  ],
  "profilPelajarPancasila": [
    "Dimensi 1 beserta deskripsi perilaku kontekstual",
    "Dimensi 2 beserta deskripsi perilaku kontekstual"
  ],
  "saranaPrasarana": {
    "sumberBelajar": ["Buku Siswa Kemendikbud", "Video edukasi / link sumber"],
    "mediaPembelajaran": ["Slide Presentasi", "LKPD interaktif", "Media konkret/digital"],
    "alatDanBahan": ["Proyektor", "Spidol/Papan Tulis", "Alat peraga sesuai materi"]
  },
  "targetPesertaDidik": "Peserta didik umum/reguler dengan kemampuan majemuk (menampung kebutuhan gaya belajar visual, auditori, dan kinestetik)",
  "modelPembelajaran": {
    "pendekatan": "Saintifik / Student-Centered / Berdiferensiasi",
    "model": "${request.learningModel}",
    "metode": ["Diskusi Kelompok", "Tanya Jawab Eksploratif", "Penugasan / Eksperimen", "Presentasi"]
  },
  "komponenInti": {
    "capaianPembelajaran": "Deskripsi Capaian Pembelajaran (CP) elemen mapel sesuai Kurikulum Merdeka",
    "tujuanPembelajaran": [
      "1. Melalui kegiatan ..., siswa mampu menganalisis ... dengan benar.",
      "2. Melalui diskusi ..., siswa mampu menyajikan hasil ... secara terampil."
    ],
    "alurTujuanPembelajaran": "Alur pencapaian kompetensi dari pemahaman konsep dasar hingga aplikasi & evaluasi",
    "pemahamanBermakna": [
      "Konsep bermakna relevan dengan kehidupan sehari-hari yang akan diingat siswa dalam jangka panjang"
    ],
    "pertanyaanPemantik": [
      "Pertanyaan terbuka menantang rasa ingin tahu siswa di awal sesi",
      "Pertanyaan kedua yang mengaitkan materi dengan situasi nyata"
    ],
    "persiapanPembelajaran": [
      "Guru menyiapkan lembar kerja LKPD dan materi tayang",
      "Guru mengelompokkan siswa secara heterogen",
      "Memastikan perangkat penunjang berfungsi dengan baik"
    ]
  },
  "kegiatanPembelajaran": [
    {
      "pertemuan": 1,
      "alokasiWaktu": "${request.duration}",
      "tujuanPertemuan": "Fokus capaian khusus untuk pertemuan ke-1",
      "pendahuluan": {
        "alokasiMenit": 10,
        "langkah": [
          "Guru membuka pembelajaran dengan salam hangat, sapaan ceria, dan doa bersama.",
          "Guru memeriksa kehadiran dan kesiapan belajar peserta didik.",
          "Apersepsi: Guru mengaitkan materi sebelumnya dengan topik hari ini melalui pertanyaan pemantik.",
          "Motivasi: Guru menyampaikan tujuan pembelajaran dan manfaat penting materi dalam kehidupan nyata.",
          "Guru menyampaikan garis besar alur kegiatan dan kriteria penilaian."
        ]
      },
      "inti": {
        "alokasiMenit": 50,
        "sintaks": [
          {
            "tahap": "Tahap 1: Orientasi Siswa pada Masalah",
            "alokasiMenit": 10,
            "aktivitasGuru": "Guru menayangkan video/studi kasus kontekstual tentang...",
            "aktivitasSiswa": "Peserta didik menyimak, mencatat poin kritis, dan mengajukan tanggapan awal.",
            "fokusDiferensiasi": "Diferensiasi Konten"
          },
          {
            "tahap": "Tahap 2: Mengorganisasi Siswa untuk Belajar",
            "alokasiMenit": 10,
            "aktivitasGuru": "Guru membagi siswa ke dalam kelompok kecil heterogen dan membagikan LKPD.",
            "aktivitasSiswa": "Siswa berkumpul dalam kelompok, berdiskusi membagi tugas kelompok.",
            "fokusDiferensiasi": "Diferensiasi Proses"
          },
          {
            "tahap": "Tahap 3: Membimbing Penyelidikan Individu/Kelompok",
            "alokasiMenit": 15,
            "aktivitasGuru": "Guru berkeliling memberikan scaffolding (bimbingan bertahap) bagi kelompok yang membutuhkan.",
            "aktivitasSiswa": "Siswa berkolaborasi mencari data, menganalisis solusi di LKPD.",
            "fokusDiferensiasi": "Diferensiasi Proses"
          },
          {
            "tahap": "Tahap 4: Mengembangkan dan Menyajikan Hasil Karya",
            "alokasiMenit": 10,
            "aktivitasGuru": "Guru memfasilitasi sesi presentasi kelompok dan memberi apresiasi.",
            "aktivitasSiswa": "Perwakilan kelompok mempresentasikan hasil temuan, kelompok lain menanggapi.",
            "fokusDiferensiasi": "Diferensiasi Produk"
          },
          {
            "tahap": "Tahap 5: Menganalisis dan Mengevaluasi Proses Pemecahan Masalah",
            "alokasiMenit": 5,
            "aktivitasGuru": "Guru bersama siswa menyimpulkan konsep utama dan meluruskan miskonsepsi.",
            "aktivitasSiswa": "Siswa melakukan klarifikasi dan merangkum inti sari materi."
          }
        ]
      },
      "penutup": {
        "alokasiMenit": 10,
        "langkah": [
          "Guru bersama peserta didik menyimpulkan intisari pembelajaran hari ini.",
          "Guru memandu refleksi singkat peserta didik (Apa yang paling dipahami? Apa yang masih menantang?).",
          "Guru memberikan umpan balik positif dan apresiasi atas partisipasi aktif siswa.",
          "Guru menyampaikan rencana topik pembelajaran untuk pertemuan berikutnya.",
          "Pembelajaran ditutup dengan doa bersama dan salam penutup."
        ]
      }
    }
  ],
  "asesmen": {
    "diagnostik": {
      "teknik": "Tes Diagnostik Non-kognitif & Kognitif Awal",
      "instrumen": "Pertanyaan lisan apersepsi dan kuis cepat 3 soal pra-pembelajaran",
      "contohSoalPertanyaan": [
        "1. Apa yang Anda ketahui tentang...?",
        "2. Bagaimana pengalaman Anda saat menemui fenomena...?"
      ]
    },
    "formatif": {
      "teknik": "Observasi Aktivitas Diskusi & Penilaian Kinerja LKPD",
      "instrumen": "Lembar Observasi Sikap & Rubrik Penilaian Kelompok",
      "rubrikAtauKriteria": [
        {
          "aspek": "Pemahaman Konsep & Analisis Masalah",
          "sangatBaik": "Mampu menjelaskan konsep secara mendalam, tepat, dan memberikan argumen logis yang kuat.",
          "baik": "Mampu menjelaskan konsep dengan tepat dengan sedikit bantuan bimbingan.",
          "cukup": "Menjelaskan konsep secara umum namun masih ada beberapa bagian yang kurang tepat.",
          "perluBimbingan": "Belum mampu menjelaskan konsep dasar dan membutuhkan bimbingan intensif guru."
        },
        {
          "aspek": "Kolaborasi & Partisipasi Kelompok",
          "sangatBaik": "Sangat aktif memimpin diskusi, menghargai pendapat teman, dan berkontribusi penuh.",
          "baik": "Aktif berpartisipasi dan bekerja sama dengan baik dalam kelompok.",
          "cukup": "Cukup aktif berpartisipasi meski terkadang pasif saat diskusi.",
          "perluBimbingan": "Kurang terlibat aktif dalam diskusi kelompok dan cenderung pasif."
        }
      ]
    },
    "sumatif": {
      "teknik": "Tes Tertulis / Penilaian Produk Akhir",
      "bentukInstrumen": "Soal Pilihan Ganda & Uraian / Lembar Penilaian Portofolio",
      "kisiKisiSingkat": "Mengukur kemampuan kognitif tingkat pemahaman (C2), aplikasi (C3), dan analisis (C4-C5) terhadap materi."
    },
    "kktp": {
      "tujuan": "Peserta didik mampu menguasai kompetensi utama materi...",
      "skalaInterval": [
        {
          "interval": "0 - 40%",
          "keterangan": "Belum Mencapai Ketuntasan",
          "intervensi": "Remedial di seluruh bagian materi dengan pendampingan intensif guru."
        },
        {
          "interval": "41 - 65%",
          "keterangan": "Belum Mencapai Ketuntasan",
          "intervensi": "Remedial pada indikator yang belum dikuasai melalui bimbingan tutor sebaya."
        },
        {
          "interval": "66 - 85%",
          "keterangan": "Sudah Mencapai Ketuntasan",
          "intervensi": "Tidak perlu remedial, dapat melanjutkan ke materi berikutnya."
        },
        {
          "interval": "86 - 100%",
          "keterangan": "Sudah Mencapai Ketuntasan (Istimewa)",
          "intervensi": "Diberikan materi pengayaan atau tugas proyek eksploratif tingkat lanjut."
        }
      ]
    }
  },
  "pengayaanDanRemedial": {
    "pengayaan": [
      "Peserta didik dengan capaian tinggi diberikan tugas eksplorasi studi kasus nyata tingkat lanjut atau membuat mini infografis/karya mandiri.",
      "Menjadi tutor sebaya untuk membantu teman dalam kelompoknya."
    ],
    "remedial": [
      "Bimbingan perorangan atau kelompok kecil untuk mengulas kembali konsep yang belum dipahami.",
      "Pemberian latihan soal adaptif dengan tingkat kesulitan bertahap (scaffolding)."
    ]
  },
  "refleksi": {
    "refleksiGuru": [
      "Apakah alokasi waktu yang direncanakan sudah sesuai dengan dinamika pembelajaran?",
      "Bagian kegiatan mana yang paling efektif memicu antusiasme siswa?",
      "Siswa mana yang memerlukan perhatian ekstra pada pertemuan berikutnya?"
    ],
    "refleksiSiswa": [
      "Materi apa yang paling menyenangkan dan mudah dipahami hari ini?",
      "Bagian mana yang menurutmu masih sulit atau butuh penjelasan ulang?",
      "Bagaimana perasaanmu setelah menyelesaikan tugas kelompok bersama teman?"
    ]
  },
  "lampiran": {
    "lkpd": {
      "judul": "LEMBAR KERJA PESERTA DIDIK (LKPD) AKTIVITAS EKSPLORASI",
      "petunjukPengerjaan": [
        "1. Bacalah basmalah / berdoalah sebelum memulai pengerjaan.",
        "2. Tuliskan nama anggota kelompok pada kolom yang disediakan.",
        "3. Kerjakan setiap instruksi aktivitas secara berurutan dan diskusikan bersama teman kelompok.",
        "4. Tanyakan kepada guru jika ada instruksi yang kurang jelas."
      ],
      "aktivitasTugas": [
        "Aktivitas 1: Amatilah stimulus/kasus berikut...",
        "Aktivitas 2: Identifikasi dan tuliskan 3 faktor penting...",
        "Aktivitas 3: Diskusikan solusi alternatif terbaik dan tuangkan dalam diagram/tabel..."
      ]
    },
    "bahanBacaan": {
      "untukGuru": "Ringkasan konsep teoretis, pedoman pendampingan, dan kunci poin pedagogis untuk guru...",
      "untukSiswa": "Ringkasan materi esensial, ilustrasi analogi ramah anak, dan contoh aplikatif..."
    },
    "glosarium": [
      { "istilah": "Istilah Utama 1", "definisi": "Definisi jelas dan kontekstual" },
      { "istilah": "Istilah Utama 2", "definisi": "Definisi jelas dan kontekstual" }
    ],
    "daftarPustaka": [
      "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2024). Buku Panduan Guru & Siswa. Jakarta: Pusat Perbukuan.",
      "Badan Standar, Kurikulum, dan Asesmen Pendidikan. (2024). Panduan Pembelajaran dan Asesmen. Jakarta: Kemendikbudristek."
    ]
  }
}

Buatkan data Modul Ajar di atas dengan detail lengkap, mendalam, dan disesuaikan tepat untuk jenjang ${request.educationLevel.toUpperCase()} ${request.grade}, mapel ${request.subject}, materi "${request.topic}". Hasilkan JSON valid.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text?.trim() || '';
    if (!responseText) {
      throw new Error('AI tidak mengembalikan respon. Silakan coba lagi.');
    }

    // Clean potential markdown wrap
    let cleanJson = responseText;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedData: ModulAjarData = JSON.parse(cleanJson);
    return parsedData;
  } catch (error: unknown) {
    console.error('Error generating Modul Ajar with Gemini:', error);
    const msg = error instanceof Error ? error.message : 'Gagal menghasilkan modul ajar.';
    throw new Error(`Gemini Error: ${msg}`);
  }
}
