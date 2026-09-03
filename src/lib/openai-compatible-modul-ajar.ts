import { ModulAjarData, ModulAjarGenerationRequest } from '@/types/modul-ajar';
import { AIProviderId } from '@/types/exam';

interface OpenAICompatibleModulAjarParams {
  request: ModulAjarGenerationRequest;
  apiKey: string;
  provider: AIProviderId;
  model: string;
  baseUrl: string;
}

export async function generateModulAjarWithOpenAICompatible({
  request,
  apiKey,
  provider,
  model,
  baseUrl,
}: OpenAICompatibleModulAjarParams): Promise<ModulAjarData> {
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
2. Karakteristik Siswa: Rancang kegiatan yang interaktif, student-centered, kontekstual, dan mengakomodasi keberagaman siswa.
3. Diferensiasi: Sertakan diferensiasi konten/proses/produk pada kegiatan inti.
4. Sintaks Model Pembelajaran: Terapkan sintaks model pembelajaran (${request.learningModel}) secara runtut dan jelas.
5. Asesmen Berkelanjutan: Sajikan instrumen asesmen diagnostik, formatif, sumatif, dan rubrik Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).
6. Kelengkapan Lampiran: Sediakan LKPD yang aplikatif, bahan bacaan ringkas, glosarium, dan daftar pustaka.

Wajib menghasilkan output HANYA dalam format JSON valid murni tanpa awalan/akhiran obrolan markdown lainnya.`;

  const userPrompt = `Susunlah dokumen ${formatLabel} dengan parameter berikut:
- Nama Sekolah / Satuan Pendidikan: ${request.schoolName || 'Satuan Pendidikan'}
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
    "babTema": "Bab / Tema terkait materi",
    "topikMateri": "${request.topic}",
    "kepalaSekolah": {
      "nama": "${request.headmasterName || 'Kepala Sekolah'}",
      "nip": "${request.headmasterNip || '-'}"
    }
  },
  "kompetensiAwal": [
    "Kompetensi prasyarat siswa sebelum mempelajari topik"
  ],
  "profilPelajarPancasila": [
    "Dimensi P5 dan wujud penerapannya dalam materi ini"
  ],
  "saranaPrasarana": {
    "sumberBelajar": ["Buku Siswa", "Sumber Digital"],
    "mediaPembelajaran": ["Slide Presentasi", "LKPD"],
    "alatDanBahan": ["Papan Tulis", "Proyektor", "Alat Tulis"]
  },
  "targetPesertaDidik": "Peserta didik reguler / umum",
  "modelPembelajaran": {
    "pendekatan": "Saintifik / Berdiferensiasi",
    "model": "${request.learningModel}",
    "metode": ["Diskusi Kelompok", "Tanya Jawab", "Eksplorasi", "Presentasi"]
  },
  "komponenInti": {
    "capaianPembelajaran": "Capaian Pembelajaran (CP) terkait topik",
    "tujuanPembelajaran": [
      "1. Siswa mampu memahami...",
      "2. Siswa mampu menganalisis..."
    ],
    "alurTujuanPembelajaran": "Alur pencapaian kompetensi secara runtut",
    "pemahamanBermakna": [
      "Pemahaman mendalam yang bermanfaat bagi kehidupan nyata"
    ],
    "pertanyaanPemantik": [
      "Pertanyaan terbuka menstimulasi rasa ingin tahu siswa"
    ],
    "persiapanPembelajaran": [
      "Guru menyiapkan materi tayang dan lembar kerja aktivitas siswa"
    ]
  },
  "kegiatanPembelajaran": [
    {
      "pertemuan": 1,
      "alokasiWaktu": "${request.duration}",
      "tujuanPertemuan": "Tujuan spesifik pertemuan ke-1",
      "pendahuluan": {
        "alokasiMenit": 10,
        "langkah": [
          "Salam, doa bersama, dan presensi kehadiran.",
          "Apersepsi dan mengaitkan materi dengan pertanyaan pemantik.",
          "Menyampaikan tujuan dan alur kegiatan pembelajaran."
        ]
      },
      "inti": {
        "alokasiMenit": 50,
        "sintaks": [
          {
            "tahap": "Tahap 1: Stimulasi / Orientasi Masalah",
            "alokasiMenit": 10,
            "aktivitasGuru": "Guru menayangkan kasus kontekstual...",
            "aktivitasSiswa": "Siswa mengamati dan merespons pertanyaan...",
            "fokusDiferensiasi": "Diferensiasi Konten"
          },
          {
            "tahap": "Tahap 2: Pengorganisasian Belajar & Eksplorasi",
            "alokasiMenit": 15,
            "aktivitasGuru": "Guru mendistribusikan LKPD dan memandu diskusi...",
            "aktivitasSiswa": "Siswa berdiskusi aktif dalam kelompok kecil...",
            "fokusDiferensiasi": "Diferensiasi Proses"
          },
          {
            "tahap": "Tahap 3: Penyajian Hasil & Verifikasi",
            "alokasiMenit": 15,
            "aktivitasGuru": "Guru memfasilitasi presentasi kelompok...",
            "aktivitasSiswa": "Kelompok mempresentasikan hasil temuan LKPD...",
            "fokusDiferensiasi": "Diferensiasi Produk"
          },
          {
            "tahap": "Tahap 4: Penarikan Kesimpulan & Penguatan",
            "alokasiMenit": 10,
            "aktivitasGuru": "Guru meluruskan miskonsepsi dan memberi umpan balik...",
            "aktivitasSiswa": "Siswa merangkum konsep utama..."
          }
        ]
      },
      "penutup": {
        "alokasiMenit": 10,
        "langkah": [
          "Menyimpulkan pembelajaran bersama peserta didik.",
          "Refleksi dan apresiasi pembelajaran.",
          "Penyampaian rencana tindak lanjut, doa bersama, dan salam."
        ]
      }
    }
  ],
  "asesmen": {
    "diagnostik": {
      "teknik": "Tes Diagnostik Non-kognitif & Kognitif Awal",
      "instrumen": "Pertanyaan lisan apersepsi awal",
      "contohSoalPertanyaan": ["Pertanyaan pemantik pengetahuan awal"]
    },
    "formatif": {
      "teknik": "Observasi Kinerja & LKPD",
      "instrumen": "Rubrik Penilaian Aktivitas Kelompok",
      "rubrikAtauKriteria": [
        {
          "aspek": "Pemahaman & Penguasaan Konsep",
          "sangatBaik": "Sangat menguasai konsep secara utuh dan tepat.",
          "baik": "Menguasai sebagian besar konsep dengan baik.",
          "cukup": "Cukup memahami konsep namun masih butuh arahan.",
          "perluBimbingan": "Belum memahami konsep dasar."
        }
      ]
    },
    "sumatif": {
      "teknik": "Tes Tertulis / Unjuk Kerja",
      "bentukInstrumen": "Soal Uraian / Lembar Tugas Proyek",
      "kisiKisiSingkat": "Mengukur capaian tujuan pembelajaran secara komprehensif."
    },
    "kktp": {
      "tujuan": "Ketercapaian kompetensi pembelajaran",
      "skalaInterval": [
        {
          "interval": "0 - 40%",
          "keterangan": "Belum Tuntas",
          "intervensi": "Remedial menyeluruh."
        },
        {
          "interval": "41 - 65%",
          "keterangan": "Belum Tuntas Sebagian",
          "intervensi": "Remedial indikator belum tercapai."
        },
        {
          "interval": "66 - 85%",
          "keterangan": "Tuntas",
          "intervensi": "Melanjutkan ke materi berikutnya."
        },
        {
          "interval": "86 - 100%",
          "keterangan": "Tuntas Istimewa",
          "intervensi": "Pengayaan materi lanjutan."
        }
      ]
    }
  },
  "pengayaanDanRemedial": {
    "pengayaan": ["Aktivitas eksplorasi tingkat lanjut bagi siswa tuntas."],
    "remedial": ["Pendampingan konsep dasar bagi siswa yang belum tuntas."]
  },
  "refleksi": {
    "refleksiGuru": ["Apakah tujuan pembelajaran tercapai dengan baik?"],
    "refleksiSiswa": ["Apa hal paling menarik yang kamu pelajari hari ini?"]
  },
  "lampiran": {
    "lkpd": {
      "judul": "LEMBAR KERJA PESERTA DIDIK (LKPD)",
      "petunjukPengerjaan": ["1. Berdoalah sebelum mengerjakan.", "2. Ikuti setiap langkah dengan teliti."],
      "aktivitasTugas": ["Aktivitas 1: Analisis kasus...", "Aktivitas 2: Rumuskan solusi..."]
    },
    "bahanBacaan": {
      "untukGuru": "Ringkasan konsep pendalaman untuk guru...",
      "untukSiswa": "Ringkasan materi bacaan untuk siswa..."
    },
    "glosarium": [
      { "istilah": "Istilah 1", "definisi": "Definisi istilah" }
    ],
    "daftarPustaka": [
      "Buku Guru dan Buku Siswa Kemendikbudristek 2024."
    ]
  }
}

Buatkan data Modul Ajar di atas dengan detail lengkap, mendalam, dan disesuaikan untuk jenjang ${request.educationLevel.toUpperCase()} ${request.grade}, mapel ${request.subject}, materi "${request.topic}". Hasilkan JSON valid murni.`;

  // Endpoint mapping
  let endpoint = baseUrl;
  if (!endpoint) {
    switch (provider) {
      case 'groq':
        endpoint = 'https://api.groq.com/openai/v1';
        break;
      case 'openrouter':
        endpoint = 'https://openrouter.ai/api/v1';
        break;
      case 'deepseek':
        endpoint = 'https://api.deepseek.com/v1';
        break;
      case 'openai':
        endpoint = 'https://api.openai.com/v1';
        break;
      case 'ollama':
        endpoint = 'http://localhost:11434/v1';
        break;
      default:
        endpoint = 'https://api.openai.com/v1';
    }
  }

  endpoint = endpoint.replace(/\/+$/, '');
  const url = `${endpoint}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://teacher-hub-edu.vercel.app';
    headers['X-Title'] = 'Teacher Hub - Modul Ajar Generator';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      ...(provider !== 'ollama' && provider !== 'anthropic' ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    let parsedErr = errText;
    try {
      const errJson = JSON.parse(errText);
      parsedErr = errJson.error?.message || errJson.message || errText;
    } catch {
      // keep raw
    }
    throw new Error(`Provider ${provider.toUpperCase()} Error: ${parsedErr}`);
  }

  const result = await response.json();
  const rawContent = result.choices?.[0]?.message?.content?.trim() || '';

  if (!rawContent) {
    throw new Error(`Model ${model} tidak mengembalikan respon.`);
  }

  let cleanJson = rawContent.trim();
  cleanJson = cleanJson.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  cleanJson = cleanJson
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const firstBrace = cleanJson.indexOf('{');
  const lastBrace = cleanJson.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsedData: ModulAjarData = JSON.parse(cleanJson);
    return parsedData;
  } catch (parseError) {
    console.error('Failed to parse OpenAI-compatible response as JSON:', rawContent);
    throw new Error('Format JSON dari AI tidak valid. Silakan coba lagi.');
  }
}
