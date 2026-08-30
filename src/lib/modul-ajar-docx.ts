import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  PageBreak,
  Packer,
} from 'docx';
import { saveAs } from 'file-saver';
import { ModulAjarData } from '@/types/modul-ajar';

function safeStr(val: unknown, fallback: string = ''): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) {
    return val
      .map((v) => safeStr(v, ''))
      .filter(Boolean)
      .join(', ');
  }
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch {
      return fallback;
    }
  }
  return String(val);
}

export async function exportModulAjarToDocx(modul: ModulAjarData) {
  const children: (Paragraph | Table)[] = [];

  const isK13 = modul.format === 'rpp_1_lembar';
  const docTitle = isK13
    ? 'RENCANA PELAKSANAAN PEMBELAJARAN (RPP INSPIRATIF)'
    : modul.format === 'rpp_berdiferensiasi'
    ? 'MODUL AJAR PEMBELAJARAN BERDIFERENSIASI'
    : 'MODUL AJAR KURIKULUM MERDEKA';

  // ================= 1. KOP FORMAL =================
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: safeStr(modul.identitas?.namaSekolah ? modul.identitas.namaSekolah.toUpperCase() : 'SATUAN PENDIDIKAN'),
          bold: true,
          size: 28, // 14pt
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: docTitle,
          bold: true,
          size: 24, // 12pt
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `TAHUN AJARAN ${safeStr(modul.identitas?.tahunAjaran, '2024/2025')} - SEMESTER ${safeStr(modul.identitas?.semester, 'GANJIL').toUpperCase()}`,
          bold: true,
          size: 22, // 11pt
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 150 },
      border: {
        bottom: {
          style: BorderStyle.DOUBLE,
          size: 16,
          color: '000000',
        },
      },
    })
  );

  // Helper cell builder
  const createInfoRow = (label1: string, val1: string, label2?: string, val2?: string) => {
    const cells: TableCell[] = [
      new TableCell({
        width: { size: 22, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: label1, bold: true, size: 20, font: 'Times New Roman' })] })],
      }),
      new TableCell({
        width: { size: 28, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: `: ${safeStr(val1, '-')}`, size: 20, font: 'Times New Roman' })] })],
      }),
    ];

    if (label2 !== undefined) {
      cells.push(
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: label2, bold: true, size: 20, font: 'Times New Roman' })] })],
        }),
        new TableCell({
          width: { size: 28, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: `: ${safeStr(val2, '-')}`, size: 20, font: 'Times New Roman' })] })],
        })
      );
    } else {
      cells.push(
        new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, children: [] }),
        new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, children: [] })
      );
    }

    return new TableRow({ children: cells });
  };

  // ================= 2. TABEL IDENTITAS MODUL =================
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: 'I. INFORMASI UMUM',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  const infoRows: TableRow[] = [
    createInfoRow('Nama Penyusun', modul.identitas?.namaPenyusun, 'Satuan Pendidikan', modul.identitas?.namaSekolah),
    createInfoRow('NIP Penyusun', modul.identitas?.nipPenyusun || '-', 'Jenjang / Kelas', `${modul.identitas?.jenjang || ''} / ${modul.identitas?.faseKelas || ''}`),
    createInfoRow('Mata Pelajaran', modul.identitas?.mataPelajaran, 'Alokasi Waktu', modul.identitas?.alokasiWaktu),
    createInfoRow('Topik / Materi', modul.identitas?.topikMateri, 'Jumlah Pertemuan', `${modul.identitas?.jumlahPertemuan || 1} Pertemuan`),
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: infoRows,
    }),
    new Paragraph({ spacing: { after: 150 } })
  );

  // Profil Pelajar Pancasila & Model
  if (modul.profilPelajarPancasila && modul.profilPelajarPancasila.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'A. Profil Pelajar Pancasila: ', bold: true, size: 20, font: 'Times New Roman' }),
          new TextRun({ text: modul.profilPelajarPancasila.join(', '), size: 20, font: 'Times New Roman' }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  if (modul.saranaPrasarana) {
    const saranaText = [
      modul.saranaPrasarana.sumberBelajar?.length ? `Sumber Belajar: ${modul.saranaPrasarana.sumberBelajar.join(', ')}` : '',
      modul.saranaPrasarana.mediaPembelajaran?.length ? `Media: ${modul.saranaPrasarana.mediaPembelajaran.join(', ')}` : '',
      modul.saranaPrasarana.alatDanBahan?.length ? `Alat/Bahan: ${modul.saranaPrasarana.alatDanBahan.join(', ')}` : '',
    ].filter(Boolean).join(' | ');

    if (saranaText) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'B. Sarana & Prasarana: ', bold: true, size: 20, font: 'Times New Roman' }),
            new TextRun({ text: saranaText, size: 20, font: 'Times New Roman' }),
          ],
          spacing: { after: 80 },
        })
      );
    }
  }

  if (modul.targetPesertaDidik) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'C. Target Peserta Didik: ', bold: true, size: 20, font: 'Times New Roman' }),
          new TextRun({ text: modul.targetPesertaDidik, size: 20, font: 'Times New Roman' }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  if (modul.modelPembelajaran) {
    const modelStr = `${modul.modelPembelajaran.model || 'Problem-Based Learning'} (${modul.modelPembelajaran.metode?.join(', ') || 'Diskusi, Tanya Jawab, Presentasi'})`;
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'D. Model & Metode Pembelajaran: ', bold: true, size: 20, font: 'Times New Roman' }),
          new TextRun({ text: modelStr, size: 20, font: 'Times New Roman' }),
        ],
        spacing: { after: 150 },
      })
    );
  }

  // ================= 3. KOMPONEN INTI =================
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 150, after: 100 },
      children: [
        new TextRun({
          text: 'II. KOMPONEN INTI',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  if (modul.komponenInti?.capaianPembelajaran) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'A. Capaian Pembelajaran (CP):', bold: true, size: 20, font: 'Times New Roman' })],
        spacing: { after: 50 },
      }),
      new Paragraph({
        children: [new TextRun({ text: modul.komponenInti.capaianPembelajaran, size: 20, font: 'Times New Roman' })],
        spacing: { after: 100 },
      })
    );
  }

  if (modul.komponenInti?.tujuanPembelajaran && modul.komponenInti.tujuanPembelajaran.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'B. Tujuan Pembelajaran (TP):', bold: true, size: 20, font: 'Times New Roman' })],
        spacing: { after: 50 },
      })
    );
    modul.komponenInti.tujuanPembelajaran.forEach((tp, idx) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${idx + 1}. ${tp}`, size: 20, font: 'Times New Roman' })],
          indent: { left: 360 },
          spacing: { after: 40 },
        })
      );
    });
  }

  if (modul.komponenInti?.pemahamanBermakna && modul.komponenInti.pemahamanBermakna.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'C. Pemahaman Bermakna:', bold: true, size: 20, font: 'Times New Roman' })],
        spacing: { before: 80, after: 50 },
      })
    );
    modul.komponenInti.pemahamanBermakna.forEach((pb) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${pb}`, size: 20, font: 'Times New Roman' })],
          indent: { left: 360 },
          spacing: { after: 40 },
        })
      );
    });
  }

  if (modul.komponenInti?.pertanyaanPemantik && modul.komponenInti.pertanyaanPemantik.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'D. Pertanyaan Pemantik:', bold: true, size: 20, font: 'Times New Roman' })],
        spacing: { before: 80, after: 50 },
      })
    );
    modul.komponenInti.pertanyaanPemantik.forEach((pp, idx) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${idx + 1}. ${pp}`, size: 20, font: 'Times New Roman' })],
          indent: { left: 360 },
          spacing: { after: 40 },
        })
      );
    });
  }

  // ================= 4. KEGIATAN PEMBELAJARAN (PER PERTEMUAN) =================
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'III. KEGIATAN PEMBELAJARAN',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  if (modul.kegiatanPembelajaran && modul.kegiatanPembelajaran.length > 0) {
    modul.kegiatanPembelajaran.forEach((kegiatan) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Pertemuan Ke-${kegiatan.pertemuan} (${kegiatan.alokasiWaktu || 'Alokasi Waktu Sesuai Jadwal'})`,
              bold: true,
              size: 21,
              font: 'Times New Roman',
            }),
          ],
          spacing: { before: 100, after: 60 },
        })
      );

      if (kegiatan.tujuanPertemuan) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Fokus Pertemuan: ', bold: true, size: 19, font: 'Times New Roman', italics: true }),
              new TextRun({ text: kegiatan.tujuanPertemuan, size: 19, font: 'Times New Roman', italics: true }),
            ],
            spacing: { after: 80 },
          })
        );
      }

      // Tabel Kegiatan Pertemuan
      const tableRows: TableRow[] = [];

      // Header row
      tableRows.push(
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'F1F5F9' },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tahap Kegiatan', bold: true, size: 20, font: 'Times New Roman' })] })],
            }),
            new TableCell({
              width: { size: 65, type: WidthType.PERCENTAGE },
              shading: { fill: 'F1F5F9' },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Deskripsi Aktivitas Pembelajaran', bold: true, size: 20, font: 'Times New Roman' })] })],
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              shading: { fill: 'F1F5F9' },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Waktu', bold: true, size: 20, font: 'Times New Roman' })] })],
            }),
          ],
        })
      );

      // Pendahuluan
      const pendahuluanParas: Paragraph[] = (kegiatan.pendahuluan?.langkah || []).map(
        (l) => new Paragraph({ children: [new TextRun({ text: `• ${l}`, size: 19, font: 'Times New Roman' })], spacing: { after: 40 } })
      );
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Kegiatan Pendahuluan', bold: true, size: 20, font: 'Times New Roman' })] })],
            }),
            new TableCell({
              children: pendahuluanParas.length > 0 ? pendahuluanParas : [new Paragraph({ children: [new TextRun({ text: '-', size: 19, font: 'Times New Roman' })] })],
            }),
            new TableCell({
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${kegiatan.pendahuluan?.alokasiMenit || 10}'`, size: 19, font: 'Times New Roman' })] })],
            }),
          ],
        })
      );

      // Inti (Sintaks)
      if (kegiatan.inti?.sintaks && kegiatan.inti.sintaks.length > 0) {
        kegiatan.inti.sintaks.forEach((sintak, sIdx) => {
          const sintakParas: Paragraph[] = [
            new Paragraph({
              children: [
                new TextRun({ text: 'Aktivitas Guru: ', bold: true, size: 19, font: 'Times New Roman' }),
                new TextRun({ text: sintak.aktivitasGuru, size: 19, font: 'Times New Roman' }),
              ],
              spacing: { after: 40 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Aktivitas Siswa: ', bold: true, size: 19, font: 'Times New Roman' }),
                new TextRun({ text: sintak.aktivitasSiswa, size: 19, font: 'Times New Roman' }),
              ],
              spacing: { after: 40 },
            }),
          ];

          if (sintak.fokusDiferensiasi) {
            sintakParas.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `[${sintak.fokusDiferensiasi}]`, bold: true, size: 18, font: 'Times New Roman', italics: true }),
                ],
              })
            );
          }

          tableRows.push(
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: sIdx === 0 ? 'Kegiatan Inti' : '',
                          bold: true,
                          size: 20,
                          font: 'Times New Roman',
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: sintak.tahap,
                          bold: true,
                          size: 19,
                          font: 'Times New Roman',
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({ children: sintakParas }),
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${sintak.alokasiMenit || ''}'`, size: 19, font: 'Times New Roman' })] })],
                }),
              ],
            })
          );
        });
      }

      // Penutup
      const penutupParas: Paragraph[] = (kegiatan.penutup?.langkah || []).map(
        (l) => new Paragraph({ children: [new TextRun({ text: `• ${l}`, size: 19, font: 'Times New Roman' })], spacing: { after: 40 } })
      );
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Kegiatan Penutup', bold: true, size: 20, font: 'Times New Roman' })] })],
            }),
            new TableCell({
              children: penutupParas.length > 0 ? penutupParas : [new Paragraph({ children: [new TextRun({ text: '-', size: 19, font: 'Times New Roman' })] })],
            }),
            new TableCell({
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${kegiatan.penutup?.alokasiMenit || 10}'`, size: 19, font: 'Times New Roman' })] })],
            }),
          ],
        })
      );

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        }),
        new Paragraph({ spacing: { after: 150 } })
      );
    });
  }

  // ================= 5. ASESMEN & KKTP =================
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'IV. ASESMEN & KRITERIA KETERCAPAIAN (KKTP)',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  if (modul.asesmen) {
    // Diagnostik
    if (modul.asesmen.diagnostik) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'A. Asesmen Diagnostik: ', bold: true, size: 20, font: 'Times New Roman' }),
            new TextRun({ text: `${modul.asesmen.diagnostik.teknik} (${modul.asesmen.diagnostik.instrumen})`, size: 20, font: 'Times New Roman' }),
          ],
          spacing: { after: 60 },
        })
      );
      if (modul.asesmen.diagnostik.contohSoalPertanyaan?.length) {
        modul.asesmen.diagnostik.contohSoalPertanyaan.forEach((soal) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `  - ${soal}`, size: 19, font: 'Times New Roman' })],
              spacing: { after: 40 },
            })
          );
        });
      }
    }

    // Formatif & Rubrik
    if (modul.asesmen.formatif?.rubrikAtauKriteria && modul.asesmen.formatif.rubrikAtauKriteria.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'B. Asesmen Formatif (Rubrik Penilaian):', bold: true, size: 20, font: 'Times New Roman' }),
          ],
          spacing: { before: 80, after: 60 },
        })
      );

      const rubrikRows: TableRow[] = [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9' }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Aspek Penilaian', bold: true, size: 19, font: 'Times New Roman' })] })] }),
            new TableCell({ width: { size: 19, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9' }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sangat Baik (4)', bold: true, size: 19, font: 'Times New Roman' })] })] }),
            new TableCell({ width: { size: 19, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9' }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Baik (3)', bold: true, size: 19, font: 'Times New Roman' })] })] }),
            new TableCell({ width: { size: 19, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9' }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Cukup (2)', bold: true, size: 19, font: 'Times New Roman' })] })] }),
            new TableCell({ width: { size: 19, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9' }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Perlu Bimbingan (1)', bold: true, size: 19, font: 'Times New Roman' })] })] }),
          ],
        }),
      ];

      modul.asesmen.formatif.rubrikAtauKriteria.forEach((item) => {
        rubrikRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.aspek, bold: true, size: 18, font: 'Times New Roman' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.sangatBaik, size: 18, font: 'Times New Roman' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.baik, size: 18, font: 'Times New Roman' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.cukup, size: 18, font: 'Times New Roman' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.perluBimbingan, size: 18, font: 'Times New Roman' })] })] }),
            ],
          })
        );
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: rubrikRows,
        }),
        new Paragraph({ spacing: { after: 100 } })
      );
    }

    // KKTP Interval
    if (modul.asesmen.kktp?.skalaInterval && modul.asesmen.kktp.skalaInterval.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'C. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP Interval):', bold: true, size: 20, font: 'Times New Roman' }),
          ],
          spacing: { before: 80, after: 60 },
        })
      );

      const kktpRows: TableRow[] = [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9' }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Interval Nilai', bold: true, size: 19, font: 'Times New Roman' })] })] }),
            new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9' }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Keterangan', bold: true, size: 19, font: 'Times New Roman' })] })] }),
            new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9' }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tindak Lanjut / Intervensi', bold: true, size: 19, font: 'Times New Roman' })] })] }),
          ],
        }),
      ];

      modul.asesmen.kktp.skalaInterval.forEach((k) => {
        kktpRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: k.interval, bold: true, size: 18, font: 'Times New Roman' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: k.keterangan, size: 18, font: 'Times New Roman' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: k.intervensi, size: 18, font: 'Times New Roman' })] })] }),
            ],
          })
        );
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: kktpRows,
        }),
        new Paragraph({ spacing: { after: 120 } })
      );
    }
  }

  // ================= 6. PENGAYAAN & REMEDIAL =================
  if (modul.pengayaanDanRemedial) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 150, after: 100 },
        children: [
          new TextRun({
            text: 'V. PENGAYAAN DAN REMEDIAL',
            bold: true,
            size: 22,
            font: 'Times New Roman',
          }),
        ],
      })
    );

    if (modul.pengayaanDanRemedial.pengayaan?.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'A. Pengayaan:', bold: true, size: 20, font: 'Times New Roman' })],
          spacing: { after: 40 },
        })
      );
      modul.pengayaanDanRemedial.pengayaan.forEach((p) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `• ${p}`, size: 19, font: 'Times New Roman' })],
            indent: { left: 360 },
            spacing: { after: 40 },
          })
        );
      });
    }

    if (modul.pengayaanDanRemedial.remedial?.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'B. Remedial:', bold: true, size: 20, font: 'Times New Roman' })],
          spacing: { before: 60, after: 40 },
        })
      );
      modul.pengayaanDanRemedial.remedial.forEach((r) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `• ${r}`, size: 19, font: 'Times New Roman' })],
            indent: { left: 360 },
            spacing: { after: 40 },
          })
        );
      });
    }
  }

  // ================= 7. LAMPIRAN (LKPD, GLOSARIUM, PUSTAKA) =================
  children.push(
    new Paragraph({
      children: [new PageBreak()],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 100, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'LAMPIRAN',
          bold: true,
          size: 24,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  if (modul.lampiran?.lkpd) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: safeStr(modul.lampiran.lkpd.judul, 'LEMBAR KERJA PESERTA DIDIK (LKPD)'),
            bold: true,
            size: 22,
            font: 'Times New Roman',
          }),
        ],
        spacing: { after: 100 },
      })
    );

    // Identitas LKPD Siswa
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Nama Kelompok / Siswa : ..............................................................', size: 20, font: 'Times New Roman' }),
        ],
        spacing: { after: 40 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Kelas / No. Absen             : ..............................................................', size: 20, font: 'Times New Roman' }),
        ],
        spacing: { after: 100 },
      })
    );

    if (modul.lampiran.lkpd.petunjukPengerjaan?.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Petunjuk Pengerjaan:', bold: true, size: 20, font: 'Times New Roman' })],
          spacing: { after: 40 },
        })
      );
      modul.lampiran.lkpd.petunjukPengerjaan.forEach((ptk) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: ptk, size: 19, font: 'Times New Roman' })],
            indent: { left: 360 },
            spacing: { after: 40 },
          })
        );
      });
    }

    if (modul.lampiran.lkpd.aktivitasTugas?.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Aktivitas Belajar & Penugasan:', bold: true, size: 20, font: 'Times New Roman' })],
          spacing: { before: 80, after: 40 },
        })
      );
      modul.lampiran.lkpd.aktivitasTugas.forEach((tgs, idx) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `${idx + 1}. ${tgs}`, size: 19, font: 'Times New Roman' })],
            indent: { left: 360 },
            spacing: { after: 60 },
          })
        );
      });
    }
  }

  // Glosarium
  if (modul.lampiran?.glosarium && modul.lampiran.glosarium.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Glosarium:', bold: true, size: 20, font: 'Times New Roman' })],
        spacing: { before: 120, after: 40 },
      })
    );
    modul.lampiran.glosarium.forEach((g) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `• ${g.istilah}: `, bold: true, size: 19, font: 'Times New Roman' }),
            new TextRun({ text: g.definisi, size: 19, font: 'Times New Roman' }),
          ],
          indent: { left: 360 },
          spacing: { after: 40 },
        })
      );
    });
  }

  // Daftar Pustaka
  if (modul.lampiran?.daftarPustaka && modul.lampiran.daftarPustaka.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Daftar Pustaka:', bold: true, size: 20, font: 'Times New Roman' })],
        spacing: { before: 120, after: 40 },
      })
    );
    modul.lampiran.daftarPustaka.forEach((dp) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${dp}`, size: 19, font: 'Times New Roman' })],
          indent: { left: 360 },
          spacing: { after: 40 },
        })
      );
    });
  }

  // ================= 8. LEMBAR PENGESAHAN (TANDA TANGAN) =================
  const teacherName = modul.identitas?.namaPenyusun || 'Guru Pengampu';
  const teacherNip = modul.identitas?.nipPenyusun || '-';
  const ksName = modul.identitas?.kepalaSekolah?.nama || 'Kepala Sekolah';
  const ksNip = modul.identitas?.kepalaSekolah?.nip || '-';

  children.push(
    new Paragraph({ spacing: { before: 200, after: 100 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mengetahui,', size: 20, font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kepala Sekolah', bold: true, size: 20, font: 'Times New Roman' })] }),
                new Paragraph({ spacing: { after: 600 } }), // Ruang TTD
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ksName, bold: true, underline: {}, size: 20, font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `NIP. ${ksNip}`, size: 18, font: 'Times New Roman' })] }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '........................, .................... 2024', size: 20, font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Guru Mata Pelajaran', bold: true, size: 20, font: 'Times New Roman' })] }),
                new Paragraph({ spacing: { after: 600 } }), // Ruang TTD
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: teacherName, bold: true, underline: {}, size: 20, font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `NIP. ${teacherNip}`, size: 18, font: 'Times New Roman' })] }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Pack and save document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = (modul.identitas?.topikMateri || 'Modul_Ajar')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 40);
  const filename = `Modul_Ajar_${cleanTitle}_${modul.identitas?.faseKelas?.replace(/[^a-zA-Z0-9]/g, '_') || 'Kelas'}.docx`;

  saveAs(blob, filename);
}
