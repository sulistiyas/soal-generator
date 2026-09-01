import { KisiKisiRubrikData, KisiKisiRubrikGenerationRequest } from '@/types/rubrik';

export async function generateKisiKisiRubrikWithAnthropic(
  request: KisiKisiRubrikGenerationRequest,
  apiKey: string,
  model: string = 'claude-3-7-sonnet-20250219',
  baseUrl: string = 'https://api.anthropic.com/v1'
): Promise<KisiKisiRubrikData> {
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

  const systemMessage = `Anda adalah Pakar Asesmen Pendidikan dan Evaluasi Pembelajaran Resmi Kemendikbudristek Indonesia.
Tugas Anda adalah merancang dokumen Matriks Kisi-Kisi Soal (Test Blueprint), Rubrik Penilaian Analitik & Holistik, Pedoman Penskoran, dan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) yang sangat presisi, berbobot pedagogis tinggi, dan siap digunakan oleh guru di sekolah. Wajib menghasilkan JSON valid murni.`;

  const userMessage = `Susunlah dokumen Kisi-Kisi Soal dan Rubrik Penilaian lengkap dengan parameter berikut:
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
${request.subTopics ? `- Sub-topik: ${request.subTopics}` : ''}
${request.learningObjectives ? `- Tujuan Pembelajaran: ${request.learningObjectives}` : ''}
- Total Butir Soal: ${request.totalQuestions || 10} Soal
- Bentuk Soal: ${activeQuestionTypes}
- Proporsi Kesukaran: LOTS ${request.difficultyRatio?.lots || 30}%, MOTS ${request.difficultyRatio?.mots || 40}%, HOTS ${request.difficultyRatio?.hots || 30}%

Kembalikan format JSON murni:
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
    "tujuanPembelajaran": "${request.learningObjectives || ''}"
  },
  "ringkasanKisiKisi": {
    "totalSoal": ${request.totalQuestions || 10},
    "distribusiBentuk": { "Pilihan Ganda": 5, "Uraian / Essay": 5 },
    "distribusiLevel": { "lots": 30, "mots": 40, "hots": 30 }
  },
  "kisiKisi": [
    {
      "no": 1,
      "kdOrCp": "Capaian Pembelajaran",
      "materi": "Materi Pokok",
      "indikatorSoal": "Indikator soal ABCD",
      "levelKognitif": "C4 (HOTS)",
      "bentukSoal": "Pilihan Ganda",
      "nomorSoal": "1",
      "bobotSkor": 2
    }
  ],
  "rubrikAnalitik": [
    {
      "aspect": "Penguasaan Konsep",
      "weight": 30,
      "levels": [
        { "level": 4, "title": "Sangat Baik (4)", "scoreRange": "86 - 100", "descriptor": "Sangat mendalam dan tepat" },
        { "level": 3, "title": "Baik (3)", "scoreRange": "71 - 85", "descriptor": "Memahami konsep dengan baik" },
        { "level": 2, "title": "Cukup (2)", "scoreRange": "56 - 70", "descriptor": "Pemahaman cukup, ada kekeliruan minor" },
        { "level": 1, "title": "Perlu Bimbingan (1)", "scoreRange": "< 56", "descriptor": "Belum memahami konsep dasar" }
      ]
    }
  ],
  "rubrikHolistik": [
    { "score": "4", "gradeLabel": "Sangat Mahir", "description": "Tugas selesai dengan kualitas sangat tinggi" }
  ],
  "pedomanPenskoran": [
    {
      "nomorSoal": 1,
      "indikator": "Menganalisis konsep",
      "kunciJawaban": "Jawaban lengkap",
      "langkahPenyelesaian": [{"step": "Langkah 1", "points": 1}],
      "skorMaksimal": 5,
      "rubrikPenskoranSingkat": "Skor maksimal jika tepat"
    }
  ],
  "intervalKktp": [
    { "interval": "0 - 40%", "kategori": "Belum Mencapai Ketuntasan", "intervensi": "Remedial seluruh bagian" },
    { "interval": "41 - 65%", "kategori": "Belum Mencapai Ketuntasan", "intervensi": "Remedial sebagian materi" },
    { "interval": "66 - 85%", "kategori": "Sudah Mencapai Ketuntasan", "intervensi": "Tidak perlu remedial" },
    { "interval": "86 - 100%", "kategori": "Sudah Mencapai Ketuntasan (Pengayaan)", "intervensi": "Tugas pengayaan" }
  ],
  "lembarPenilaianSiswa": {
    "columns": ["No", "Nama Siswa", "Kriteria 1", "Kriteria 2", "Total Skor", "Nilai Akhir", "Ketercapaian"],
    "maxTotalScore": 100,
    "sampleRows": []
  },
  "petunjukPenggunaan": ["Panduan pemakaian instrumen"],
  "catatanGuru": ""
}`;

  const endpoint = `${baseUrl.replace(/\/$/, '')}/messages`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 4000,
      system: systemMessage,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`Gagal memproses dengan Anthropic Claude: ${errData?.error?.message || response.statusText}`);
  }

  const result = await response.json();
  const rawText = result.content?.[0]?.text || '';
  const cleanJson = rawText
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
    petunjukPenggunaan: parsed.petunjukPenggunaan || [],
    catatanGuru: parsed.catatanGuru || '',
    createdAt: new Date().toISOString(),
  };
}
