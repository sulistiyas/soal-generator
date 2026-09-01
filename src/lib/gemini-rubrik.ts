import { GoogleGenAI } from '@google/genai';
import { KisiKisiRubrikData, KisiKisiRubrikGenerationRequest } from '@/types/rubrik';

export async function generateKisiKisiRubrikWithGemini(
  request: KisiKisiRubrikGenerationRequest,
  apiKey: string,
  modelName: string = 'gemini-3.6-flash'
): Promise<KisiKisiRubrikData> {
  if (!apiKey) {
    throw new Error('API Key Google Gemini belum diatur. Silakan masukkan API Key di menu pengaturan atau file .env.local.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const getAssessmentLabel = (type: string) => {
    switch (type) {
      case 'formatif':
        return 'Asesmen Formatif / Ulangan Harian';
      case 'sumatif_materi':
        return 'Asesmen Sumatif Lingkup Materi';
      case 'sts':
        return 'Asesmen Sumatif Tengah Semester (STS / PTS)';
      case 'sas':
        return 'Asesmen Sumatif Akhir Semester (SAS / PAS / SAT)';
      case 'us':
        return 'Asesmen Akhir Jenjang / Ujian Sekolah';
      case 'kinerja':
        return 'Asesmen Kinerja / Unjuk Kerja / Ujian Praktik';
      case 'proyek':
        return 'Asesmen Proyek / P5 (Profil Pelajar Pancasila)';
      case 'portofolio':
        return 'Asesmen Produk / Portofolio';
      case 'sikap':
        return 'Asesmen Observasi Sikap & Profil Pelajar';
      default:
        return 'Asesmen Pembelajaran';
    }
  };

  const assessmentLabel = getAssessmentLabel(request.assessmentType);

  const systemInstruction = `Anda adalah Pakar Asesmen Pendidikan dan Evaluasi Pembelajaran Resmi Kemendikbudristek Indonesia.
Tugas Anda adalah merancang dokumen Matriks Kisi-Kisi Soal (Test Blueprint), Rubrik Penilaian Analitik & Holistik, Pedoman Penskoran, dan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) yang sangat presisi, berbobot pedagogis tinggi, dan siap digunakan oleh guru di sekolah.

Prinsip Penyusunan Instrumen Evaluasi:
1. Keselarasan Konstruk: Kisi-kisi harus menjamin keselarasan antara Capaian Pembelajaran (CP) / KD, Materi Pokok, Indikator Soal, dan Level Kognitif.
2. Kaidah Indikator Soal (ABCD): Rumuskan indikator soal yang spesifik dan terukur (Audience, Behavior, Condition, Degree). Gunakan Kata Kerja Operasional (KKO) Taksonomi Bloom (C1-C6).
3. Proporsi Kognitif: Sesuaikan distribusi LOTS (C1-C2), MOTS (C3), dan HOTS (C4-C6) sesuai permintaan pengguna.
4. Rubrik Analitik Operasional: Aspek penilaian harus jelas, dengan deskriptor kualitatif yang membedakan capaian Sangat Baik (Skor 4), Baik (Skor 3), Cukup (Skor 2), dan Perlu Bimbingan (Skor 1) secara konkrit, bukan sekadar kata "sangat/kurang".
5. Pedoman Penskoran Komprehensif: Sediakan kunci jawaban, langkah pengerjaan terperinci beserta bobot skor untuk setiap butir soal/aspek.
6. Interval KKTP & Tindak Lanjut: Sediakan rentang interval nilai dengan interpretasi ketuntasan dan intervensi tindak lanjut (remedial/pengayaan) yang edukatif.
7. Format Output: Wajib menghasilkan JSON valid murni sesuai skema yang diminta, tanpa teks pengantar maupun akhiran markdown di luar JSON.`;

  const activeQuestionTypes = Object.entries(request.questionTypesIncluded || {})
    .filter(([, v]) => v)
    .map(([k]) => {
      if (k === 'pg') return 'Pilihan Ganda';
      if (k === 'isian') return 'Isian Singkat';
      if (k === 'uraian') return 'Uraian / Essay';
      if (k === 'praktik') return 'Kinerja / Praktik';
      if (k === 'proyek') return 'Proyek / P5';
      return k;
    })
    .join(', ') || 'Pilihan Ganda dan Uraian';

  const prompt = `Susunlah dokumen Kisi-Kisi Soal dan Rubrik Penilaian lengkap dengan parameter berikut:
- Nama Sekolah: ${request.schoolName || 'Satuan Pendidikan'}
- Nama Guru: ${request.teacherName || 'Guru Mata Pelajaran'}
- NIP Guru: ${request.teacherNip || '-'}
- Nama Kepala Sekolah: ${request.headmasterName || 'Kepala Sekolah'}
- NIP Kepala Sekolah: ${request.headmasterNip || '-'}
- Jenjang: ${request.educationLevel.toUpperCase()}
- Fase / Kelas: ${request.phase} - ${request.grade}
- Mata Pelajaran: ${request.subject}
- Kurikulum: ${request.curriculum === 'merdeka' ? 'Kurikulum Merdeka' : 'Kurikulum 2013 (K-13)'}
- Semester: ${request.semester}
- Tahun Ajaran: ${request.academicYear}
- Jenis Asesmen: ${assessmentLabel}
- Alokasi Waktu: ${request.duration || '90 Menit'}
- Topik / Lingkup Materi: ${request.topic}
${request.subTopics ? `- Sub-topik / Bahasan Khusus: ${request.subTopics}` : ''}
${request.learningObjectives ? `- Tujuan Pembelajaran (TP) / Capaian: ${request.learningObjectives}` : ''}
- Total Butir Soal / Indikator: ${request.totalQuestions || 10} Soal
- Bentuk Soal yang Digunakan: ${activeQuestionTypes}
- Proporsi Tingkat Kesukaran Kognitif: LOTS ${request.difficultyRatio?.lots || 30}%, MOTS ${request.difficultyRatio?.mots || 40}%, HOTS ${request.difficultyRatio?.hots || 30}%
${request.rubricFocus ? `- Fokus Khusus Rubrik: ${request.rubricFocus}` : ''}
${request.additionalInstructions ? `- Catatan / Permintaan Khusus: ${request.additionalInstructions}` : ''}

STRUKTUR JSON YANG WAJIB DIHASILKAN:
{
  "identitas": {
    "namaSekolah": "${request.schoolName || 'Satuan Pendidikan'}",
    "mataPelajaran": "${request.subject}",
    "kelas": "${request.grade}",
    "fase": "${request.phase}",
    "kurikulum": "${request.curriculum}",
    "semester": "${request.semester}",
    "tahunAjaran": "${request.academicYear}",
    "jenisAsesmen": "${request.assessmentType}",
    "jenisAsesmenLabel": "${assessmentLabel}",
    "alokasiWaktu": "${request.duration || '90 Menit'}",
    "jumlahSoal": ${request.totalQuestions || 10},
    "namaGuru": "${request.teacherName || 'Guru Mata Pelajaran'}",
    "nipGuru": "${request.teacherNip || '-'}",
    "namaKepalaSekolah": "${request.headmasterName || 'Kepala Sekolah'}",
    "nipKepalaSekolah": "${request.headmasterNip || '-'}",
    "topikMateri": "${request.topic}",
    "subTopik": "${request.subTopics || ''}",
    "tujuanPembelajaran": "${request.learningObjectives || 'Memahami dan menerapkan konsep secara komprehensif'}"
  },
  "ringkasanKisiKisi": {
    "totalSoal": ${request.totalQuestions || 10},
    "distribusiBentuk": {
      "Pilihan Ganda": 5,
      "Isian Singkat": 2,
      "Uraian / Essay": 3
    },
    "distribusiLevel": {
      "lots": ${request.difficultyRatio?.lots || 30},
      "mots": ${request.difficultyRatio?.mots || 40},
      "hots": ${request.difficultyRatio?.hots || 30}
    }
  },
  "kisiKisi": [
    {
      "no": 1,
      "kdOrCp": "Elemen / Capaian Pembelajaran atau Kompetensi Dasar",
      "materi": "Materi Pokok / Lingkup Materi",
      "subMateri": "Sub materi spesifik",
      "indikatorSoal": "Disajikan stimulus ..., peserta didik dapat ... dengan tepat (ABCD)",
      "levelKognitif": "C4 (HOTS)",
      "bentukSoal": "Pilihan Ganda",
      "nomorSoal": "1",
      "bobotSkor": 2
    }
  ],
  "rubrikAnalitik": [
    {
      "aspect": "Penguasaan Konsep & Analisis Masalah",
      "weight": 30,
      "levels": [
        {
          "level": 4,
          "title": "Sangat Baik (4)",
          "scoreRange": "86 - 100",
          "descriptor": "Menunjukkan pemahaman konsep secara mendalam, argumen logis, analisis komprehensif dan tepat tanpa kesalahan konsep."
        },
        {
          "level": 3,
          "title": "Baik (3)",
          "scoreRange": "71 - 85",
          "descriptor": "Memahami konsep utama dengan baik, analisis cukup terstruktur dengan sedikit kekeliruan minor."
        },
        {
          "level": 2,
          "title": "Cukup (2)",
          "scoreRange": "56 - 70",
          "descriptor": "Memahami sebagian konsep dasar, namun analisis masih dangkal dan terdapat beberapa kekeliruan pemahaman."
        },
        {
          "level": 1,
          "title": "Perlu Bimbingan (1)",
          "scoreRange": "< 56",
          "descriptor": "Belum menunjukkan pemahaman konsep dasar, analisis tidak relevan dan memerlukan bimbingan intensif."
        }
      ]
    }
  ],
  "rubrikHolistik": [
    {
      "score": "4 (Skor 86-100)",
      "gradeLabel": "Sangat Mahir / Istimewa",
      "description": "Seluruh tugas diselesaikan dengan akurasi sangat tinggi, penalaran kritis terbukti kuat, dan penyajian sangat sistematis."
    },
    {
      "score": "3 (Skor 71-85)",
      "gradeLabel": "Cakap / Memuaskan",
      "description": "Tugas diselesaikan dengan baik, sebagian besar konsep diterapkan dengan benar, serta penyajian jelas."
    },
    {
      "score": "2 (Skor 56-70)",
      "gradeLabel": "Layak / Berkembang",
      "description": "Tugas terselesaikan sebagian, masih terdapat konsep penting yang belum tuntas atau kurang tepat."
    },
    {
      "score": "1 (Skor < 56)",
      "gradeLabel": "Baru Memulai / Perlu Pendampingan",
      "description": "Belum mampu menyelesaikan tugas sesuai kriteria dasar dan memerlukan pendampingan guru secara langsung."
    }
  ],
  "pedomanPenskoran": [
    {
      "nomorSoal": 1,
      "indikator": "Menganalisis dampak perubahan ...",
      "kunciJawaban": "Jawaban lengkap atau alternatif solusi yang benar",
      "langkahPenyelesaian": [
        {"step": "Menuliskan data/informasi yang diketahui", "points": 1},
        {"step": "Menganalisis keterkaitan sebab-akibat dengan formula yang tepat", "points": 2},
        {"step": "Menyimpulkan solusi akhir secara benar dan logis", "points": 2}
      ],
      "skorMaksimal": 5,
      "rubrikPenskoranSingkat": "Skor 5 jika lengkap dan tepat; skor 3 jika ada kekeliruan perhitungan; skor 1 jika hanya menulis rumus."
    }
  ],
  "intervalKktp": [
    {
      "interval": "0 - 40%",
      "kategori": "Belum Mencapai Ketuntasan",
      "intervensi": "Remedial di seluruh bagian materi dengan bimbingan tutor sebaya atau pendampingan individual oleh guru."
    },
    {
      "interval": "41 - 65%",
      "kategori": "Belum Mencapai Ketuntasan",
      "intervensi": "Remedial pada indikator materi tertentu yang belum dikuasai peserta didik."
    },
    {
      "interval": "66 - 85%",
      "kategori": "Sudah Mencapai Ketuntasan",
      "intervensi": "Tidak perlu remedial, dapat melanjutkan ke pembelajaran materi selanjutnya."
    },
    {
      "interval": "86 - 100%",
      "kategori": "Sudah Mencapai Ketuntasan (Pengayaan)",
      "intervensi": "Diberikan materi pengayaan, tantangan studi kasus tingkat lanjut, atau menjadi tutor sebaya."
    }
  ],
  "lembarPenilaianSiswa": {
    "columns": ["No", "Nama Siswa", "Kriteria 1", "Kriteria 2", "Kriteria 3", "Kriteria 4", "Total Skor", "Nilai Akhir", "Ketercapaian"],
    "maxTotalScore": 100,
    "sampleRows": [
      {
        "no": 1,
        "nama": "Ahmad Fauzi",
        "scores": [4, 3, 4, 3],
        "total": 14,
        "nilai": 88,
        "catatan": "Tuntas (Pengayaan)"
      },
      {
        "no": 2,
        "nama": "Budi Santoso",
        "scores": [3, 3, 3, 2],
        "total": 11,
        "nilai": 69,
        "catatan": "Tuntas"
      },
      {
        "no": 3,
        "nama": "Citra Dewi",
        "scores": [4, 4, 4, 4],
        "total": 16,
        "nilai": 100,
        "catatan": "Tuntas (Pengayaan)"
      }
    ]
  },
  "petunjukPenggunaan": [
    "Kisi-kisi ini disusun sebagai acuan pembuatan butir soal dan instrumen asesmen.",
    "Gunakan rubrik analitik untuk penilaian unjuk kerja atau tugas yang membutuhkan umpan balik detail.",
    "Pedoman penskoran digunakan untuk memeriksa naskah jawaban siswa secara obyektif dan konsisten."
  ],
  "catatanGuru": "Instrumen ini dapat disesuaikan dengan kondisi daya serap siswa di kelas masing-masing."
}

PENTING:
- Sediakan ${request.totalQuestions || 10} butir kisi-kisi pada array \`kisiKisi\` secara lengkap, bervariasi, dan runtut sesuai nomor 1 sampai ${request.totalQuestions || 10}.
- Sediakan minimal 3-5 kriteria aspek pada array \`rubrikAnalitik\` yang relevan dengan mata pelajaran ${request.subject}.
- Sediakan pedoman penskoran soal uraian/kinerja pada \`pedomanPenskoran\`.
- Buat semua teks dalam Bahasa Indonesia baku, jelas, profesional, dan operasional.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName || 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    if (!responseText) {
      throw new Error('Tidak ada respon yang diterima dari Google Gemini API.');
    }

    const cleanJson = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanJson);

    return {
      id: 'rubrik-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7),
      identitas: parsed.identitas || {
        namaSekolah: request.schoolName || 'Satuan Pendidikan',
        mataPelajaran: request.subject,
        kelas: request.grade,
        fase: request.phase,
        kurikulum: request.curriculum,
        semester: request.semester,
        tahunAjaran: request.academicYear,
        jenisAsesmen: request.assessmentType,
        jenisAsesmenLabel: assessmentLabel,
        alokasiWaktu: request.duration || '90 Menit',
        jumlahSoal: request.totalQuestions || 10,
        namaGuru: request.teacherName || 'Guru Mata Pelajaran',
        nipGuru: request.teacherNip || '-',
        namaKepalaSekolah: request.headmasterName || 'Kepala Sekolah',
        nipKepalaSekolah: request.headmasterNip || '-',
        topikMateri: request.topic,
        subTopik: request.subTopics || '',
        tujuanPembelajaran: request.learningObjectives || '',
      },
      ringkasanKisiKisi: parsed.ringkasanKisiKisi || {
        totalSoal: request.totalQuestions || 10,
        distribusiBentuk: { 'Pilihan Ganda': 5, Uraian: 5 },
        distribusiLevel: request.difficultyRatio || { lots: 30, mots: 40, hots: 30 },
      },
      kisiKisi: parsed.kisiKisi || [],
      rubrikAnalitik: parsed.rubrikAnalitik || [],
      rubrikHolistik: parsed.rubrikHolistik || [],
      pedomanPenskoran: parsed.pedomanPenskoran || [],
      intervalKktp: parsed.intervalKktp || [],
      lembarPenilaianSiswa: parsed.lembarPenilaianSiswa || {
        columns: ['No', 'Nama Siswa', 'Kriteria 1', 'Kriteria 2', 'Total Skor', 'Nilai'],
        maxTotalScore: 100,
        sampleRows: [],
      },
      petunjukPenggunaan: parsed.petunjukPenggunaan || [
        'Kisi-kisi digunakan sebagai panduan penulisan soal.',
        'Rubrik digunakan untuk memandu asesmen kinerja atau tugas.',
      ],
      catatanGuru: parsed.catatanGuru || '',
      createdAt: new Date().toISOString(),
    };
  } catch (error: unknown) {
    console.error('Gemini Rubrik Generation Error:', error);
    const msg = error instanceof Error ? error.message : 'Gagal menghasilkan kisi-kisi dan rubrik dengan Google Gemini.';
    throw new Error(msg);
  }
}
