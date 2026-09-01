import { ModulAjarData, ModulAjarGenerationRequest } from '@/types/modul-ajar';

export async function generateModulAjarWithAnthropic(
  request: ModulAjarGenerationRequest,
  apiKey: string,
  modelName: string = 'claude-sonnet-5',
  baseUrl: string = 'https://api.anthropic.com/v1'
): Promise<ModulAjarData> {
  if (!apiKey) {
    throw new Error('API Key Anthropic Claude belum diatur.');
  }

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

Wajib menghasilkan output HANYA dalam format JSON valid murni tanpa teks pembuka atau penutup markdown.`;

  const userPrompt = `Susunlah dokumen ${formatLabel} dengan parameter:
- Nama Sekolah: ${request.schoolName || 'Satuan Pendidikan'}
- Nama Guru: ${request.teacherName || 'Guru Pengampu'}
- Jenjang: ${request.educationLevel.toUpperCase()}
- Fase / Kelas: ${request.phase} - ${request.grade}
- Mata Pelajaran: ${request.subject}
- Semester: ${request.semester}
- Tahun Ajaran: ${request.academicYear}
- Topik / Materi Pokok: ${request.topic}
- Alokasi Waktu: ${request.duration || '2 x 35 menit'}
- Jumlah Pertemuan: ${request.meetingCount} Pertemuan
- Model Pembelajaran: ${request.learningModel}
- Profil Pelajar Pancasila: ${request.p5Dimensions.join(', ')}
${request.additionalInstructions ? `- Catatan Khusus: ${request.additionalInstructions}` : ''}

Keluarkan JSON valid dengan skema ModulAjarData.`;

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/messages`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 4096,
      system: systemInstruction,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API Error: ${errText}`);
  }

  const result = await response.json();
  const rawText = result.content?.[0]?.text?.trim() || '';

  let cleanJson = rawText;
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  return JSON.parse(cleanJson);
}
