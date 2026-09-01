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
  ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';
import { KisiKisiRubrikData } from '@/types/rubrik';

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

// Styling Constants
const FONT_FAMILY = 'Arial';
const PRIMARY_COLOR = '1E3A8A'; // Blue-900
const HEADER_BG = 'F1F5F9'; // Slate-100
const ACCENT_BG = 'E2E8F0'; // Slate-200
const BORDER_COLOR = '94A3B8'; // Slate-400

const thinBorder = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: BORDER_COLOR,
};

const cellBorders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
};

const defaultCellMargins = {
  top: 100,
  bottom: 100,
  left: 140,
  right: 140,
};

export async function exportKisiKisiRubrikToDocx(data: KisiKisiRubrikData) {
  const children: (Paragraph | Table)[] = [];
  const identitas = data.identitas;

  // ================= 1. KOP SURAT RESMI =================
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: safeStr(identitas.namaSekolah ? identitas.namaSekolah.toUpperCase() : 'PEMERINTAH KABUPATEN / KOTA / YAYASAN PENDIDIKAN'),
          bold: true,
          size: 22,
          font: FONT_FAMILY,
          color: '334155',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: safeStr(identitas.namaSekolah ? identitas.namaSekolah.toUpperCase() : 'SATUAN PENDIDIKAN'),
          bold: true,
          size: 28,
          font: FONT_FAMILY,
          color: PRIMARY_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'KISI-KISI PENULISAN SOAL & RUBRIK PENILAIAN ASESMEN',
          bold: true,
          size: 24,
          font: FONT_FAMILY,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `TAHUN AJARAN ${safeStr(identitas.tahunAjaran, '2024/2025')} - SEMESTER ${safeStr(identitas.semester, 'GANJIL').toUpperCase()}`,
          bold: true,
          size: 20,
          font: FONT_FAMILY,
          color: '475569',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 180 },
      border: {
        bottom: {
          style: BorderStyle.DOUBLE,
          size: 18,
          color: '000000',
        },
      },
    })
  );

  // ================= 2. TABEL IDENTITAS ASESMEN =================
  const identitasTable = new Table({
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
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Mata Pelajaran', bold: true, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: `: ${safeStr(identitas.mataPelajaran)}`, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Jenis Asesmen', bold: true, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: `: ${safeStr(identitas.jenisAsesmenLabel)}`, size: 20, font: FONT_FAMILY })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Kelas / Fase', bold: true, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `: Kelas ${safeStr(identitas.kelas)} (${safeStr(identitas.fase)})`, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Kurikulum', bold: true, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `: ${identitas.kurikulum === 'merdeka' ? 'Kurikulum Merdeka' : 'Kurikulum 2013'}`, size: 20, font: FONT_FAMILY })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Materi Pokok', bold: true, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `: ${safeStr(identitas.topikMateri)}`, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Alokasi Waktu', bold: true, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `: ${safeStr(identitas.alokasiWaktu, '90 Menit')}`, size: 20, font: FONT_FAMILY })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Guru Pengampu', bold: true, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `: ${safeStr(identitas.namaGuru)}`, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Jumlah Soal', bold: true, size: 20, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `: ${safeStr(identitas.jumlahSoal)} Butir`, size: 20, font: FONT_FAMILY })] })],
          }),
        ],
      }),
    ],
  });

  children.push(identitasTable);
  children.push(new Paragraph({ spacing: { after: 200 } }));

  // ================= 3. BAGIAN I: MATRIKS KISI-KISI SOAL =================
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'I. MATRIKS KISI-KISI PENULISAN SOAL / ASESMEN',
          bold: true,
          size: 22,
          font: FONT_FAMILY,
          color: PRIMARY_COLOR,
        }),
      ],
    })
  );

  const kisiHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 5, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 22, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Capaian Pembelajaran / KD', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Materi Pokok', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 28, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Indikator Soal (ABCD)', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 9, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Level', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Bentuk', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No. Soal', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
    ],
  });

  const kisiRows = (data.kisiKisi || []).map((item, idx) => {
    const isEven = idx % 2 === 0;
    const bgFill = isEven ? 'FFFFFF' : HEADER_BG;

    return new TableRow({
      children: [
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: safeStr(item.no || idx + 1), size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: safeStr(item.kdOrCp), size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [
            new Paragraph({ children: [new TextRun({ text: safeStr(item.materi), bold: true, size: 18, font: FONT_FAMILY })] }),
            ...(item.subMateri ? [new Paragraph({ children: [new TextRun({ text: `(${safeStr(item.subMateri)})`, size: 16, color: '64748B', font: FONT_FAMILY })] })] : []),
          ],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: safeStr(item.indikatorSoal), size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: safeStr(item.levelKognitif), bold: true, size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: safeStr(item.bentukSoal), size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: safeStr(item.nomorSoal), bold: true, size: 18, font: FONT_FAMILY })] })],
        }),
      ],
    });
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [kisiHeaderRow, ...kisiRows],
    })
  );

  children.push(new Paragraph({ spacing: { after: 240 } }));

  // ================= 4. BAGIAN II: RUBRIK PENILAIAN ANALITIK =================
  if (data.rubrikAnalitik && data.rubrikAnalitik.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: 'II. RUBRIK PENILAIAN ANALITIK',
            bold: true,
            size: 22,
            font: FONT_FAMILY,
            color: PRIMARY_COLOR,
          }),
        ],
      })
    );

    const rubricHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Aspek / Kriteria', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sangat Baik (Skor 4)', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Baik (Skor 3)', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Cukup (Skor 2)', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Perlu Bimbingan (Skor 1)', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
      ],
    });

    const rubricRows = data.rubrikAnalitik.map((crit, idx) => {
      const isEven = idx % 2 === 0;
      const bgFill = isEven ? 'FFFFFF' : HEADER_BG;
      const l4 = crit.levels?.find((l) => l.level === 4) || crit.levels?.[0];
      const l3 = crit.levels?.find((l) => l.level === 3) || crit.levels?.[1];
      const l2 = crit.levels?.find((l) => l.level === 2) || crit.levels?.[2];
      const l1 = crit.levels?.find((l) => l.level === 1) || crit.levels?.[3];

      return new TableRow({
        children: [
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [
              new Paragraph({ children: [new TextRun({ text: safeStr(crit.aspect), bold: true, size: 18, font: FONT_FAMILY })] }),
              ...(crit.weight ? [new Paragraph({ children: [new TextRun({ text: `(Bobot: ${crit.weight}%)`, size: 16, color: '2563EB', font: FONT_FAMILY })] })] : []),
            ],
          }),
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: safeStr(l4?.descriptor), size: 17, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: safeStr(l3?.descriptor), size: 17, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: safeStr(l2?.descriptor), size: 17, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: safeStr(l1?.descriptor), size: 17, font: FONT_FAMILY })] })],
          }),
        ],
      });
    });

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [rubricHeaderRow, ...rubricRows],
      })
    );

    children.push(new Paragraph({ spacing: { after: 240 } }));
  }

  // ================= 5. BAGIAN III: PEDOMAN PENSKORAN & KUNCI =================
  if (data.pedomanPenskoran && data.pedomanPenskoran.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: 'III. PEDOMAN PENSKORAN & KUNCI JAWABAN',
            bold: true,
            size: 22,
            font: FONT_FAMILY,
            color: PRIMARY_COLOR,
          }),
        ],
      })
    );

    const pedomanHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Indikator Soal / Kompetensi', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          width: { size: 55, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kunci Jawaban / Kriteria Langkah Penskoran', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          width: { size: 12, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Skor Maks', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
      ],
    });

    const pedomanRows = data.pedomanPenskoran.map((item, idx) => {
      const isEven = idx % 2 === 0;
      const bgFill = isEven ? 'FFFFFF' : HEADER_BG;

      const stepsParagraphs: Paragraph[] = [];
      if (item.kunciJawaban) {
        stepsParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Kunci Jawaban: ', bold: true, size: 18, font: FONT_FAMILY }),
              new TextRun({ text: safeStr(item.kunciJawaban), size: 18, font: FONT_FAMILY }),
            ],
          })
        );
      }

      if (Array.isArray(item.langkahPenyelesaian) && item.langkahPenyelesaian.length > 0) {
        stepsParagraphs.push(
          new Paragraph({
            spacing: { before: 60 },
            children: [new TextRun({ text: 'Rincian Penskoran:', bold: true, size: 17, font: FONT_FAMILY })],
          })
        );
        item.langkahPenyelesaian.forEach((st) => {
          if (typeof st === 'object' && st !== null && 'step' in st) {
            stepsParagraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `• ${safeStr(st.step)} `, size: 17, font: FONT_FAMILY }),
                  new TextRun({ text: `(Skor: ${safeStr(st.points)})`, bold: true, size: 17, color: '2563EB', font: FONT_FAMILY }),
                ],
              })
            );
          } else {
            stepsParagraphs.push(
              new Paragraph({
                children: [new TextRun({ text: `• ${safeStr(st)}`, size: 17, font: FONT_FAMILY })],
              })
            );
          }
        });
      }

      if (item.rubrikPenskoranSingkat) {
        stepsParagraphs.push(
          new Paragraph({
            spacing: { before: 60 },
            children: [
              new TextRun({ text: 'Catatan Penskoran: ', bold: true, size: 16, color: '64748B', font: FONT_FAMILY }),
              new TextRun({ text: safeStr(item.rubrikPenskoranSingkat), size: 16, color: '64748B', font: FONT_FAMILY }),
            ],
          })
        );
      }

      return new TableRow({
        children: [
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: safeStr(item.nomorSoal), bold: true, size: 18, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: safeStr(item.indikator), size: 18, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: stepsParagraphs.length > 0 ? stepsParagraphs : [new Paragraph({ children: [new TextRun({ text: '-', size: 18, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: safeStr(item.skorMaksimal), bold: true, size: 18, font: FONT_FAMILY })] })],
          }),
        ],
      });
    });

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [pedomanHeaderRow, ...pedomanRows],
      })
    );

    children.push(new Paragraph({ spacing: { after: 240 } }));
  }

  // ================= 6. BAGIAN IV: KRITERIA KKTP & TINDAK LANJUT =================
  if (data.intervalKktp && data.intervalKktp.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: 'IV. KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP) & TINDAK LANJUT',
            bold: true,
            size: 22,
            font: FONT_FAMILY,
            color: PRIMARY_COLOR,
          }),
        ],
      })
    );

    const kktpHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Interval Nilai', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          width: { size: 28, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kategori Ketercapaian', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          width: { size: 54, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Rencana Tindak Lanjut / Intervensi Guru', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
        }),
      ],
    });

    const kktpRows = data.intervalKktp.map((item, idx) => {
      const isEven = idx % 2 === 0;
      const bgFill = isEven ? 'FFFFFF' : HEADER_BG;

      return new TableRow({
        children: [
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: safeStr(item.interval), bold: true, size: 18, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: safeStr(item.kategori), bold: true, size: 18, font: FONT_FAMILY })] })],
          }),
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: defaultCellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: safeStr(item.intervensi), size: 18, font: FONT_FAMILY })] })],
          }),
        ],
      });
    });

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [kktpHeaderRow, ...kktpRows],
      })
    );

    children.push(new Paragraph({ spacing: { after: 240 } }));
  }

  // ================= 7. BAGIAN V: LEMBAR PENILAIAN SISWA (BLANGKO) =================
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'V. FORMAT LEMBAR REKAP PENILAIAN SISWA',
          bold: true,
          size: 22,
          font: FONT_FAMILY,
          color: PRIMARY_COLOR,
        }),
      ],
    })
  );

  const blankRowsCount = 10;
  const sheetHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nama Peserta Didik', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Krit. 1', bold: true, color: 'FFFFFF', size: 17, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Krit. 2', bold: true, color: 'FFFFFF', size: 17, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Krit. 3', bold: true, color: 'FFFFFF', size: 17, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Krit. 4', bold: true, color: 'FFFFFF', size: 17, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nilai', bold: true, color: 'FFFFFF', size: 18, font: FONT_FAMILY })] })],
      }),
      new TableCell({
        width: { size: 14, type: WidthType.PERCENTAGE },
        shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: defaultCellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ketuntasan', bold: true, color: 'FFFFFF', size: 17, font: FONT_FAMILY })] })],
      }),
    ],
  });

  const blankStudentRows = Array.from({ length: blankRowsCount }, (_, i) => {
    const isEven = i % 2 === 0;
    const bgFill = isEven ? 'FFFFFF' : HEADER_BG;
    return new TableRow({
      children: [
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(i + 1), size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: '', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: '', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: '', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: '', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: '', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: '', size: 18, font: FONT_FAMILY })] })],
        }),
        new TableCell({
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          borders: cellBorders,
          margins: defaultCellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: '', size: 18, font: FONT_FAMILY })] })],
        }),
      ],
    });
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [sheetHeaderRow, ...blankStudentRows],
    })
  );

  children.push(new Paragraph({ spacing: { after: 300 } }));

  // ================= 8. LEMBAR PENGESAHAN / TANDA TANGAN =================
  const signatureTable = new Table({
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
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Mengetahui,', size: 20, font: FONT_FAMILY }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Kepala Satuan Pendidikan', bold: true, size: 20, font: FONT_FAMILY }),
                ],
              }),
              new Paragraph({ spacing: { after: 700 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: safeStr(identitas.namaKepalaSekolah, '...............................................'),
                    bold: true,
                    underline: {},
                    size: 20,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `NIP. ${safeStr(identitas.nipKepalaSekolah, '.......................................')}`,
                    size: 18,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `........................., ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, size: 20, font: FONT_FAMILY }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Guru Mata Pelajaran', bold: true, size: 20, font: FONT_FAMILY }),
                ],
              }),
              new Paragraph({ spacing: { after: 700 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: safeStr(identitas.namaGuru, '...............................................'),
                    bold: true,
                    underline: {},
                    size: 20,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `NIP. ${safeStr(identitas.nipGuru, '.......................................')}`,
                    size: 18,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(signatureTable);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Kisi-Kisi_dan_Rubrik_${safeStr(identitas.mataPelajaran, 'Mapel').replace(/\s+/g, '_')}_Kelas_${safeStr(identitas.kelas, 'Kelas')}.docx`;
  saveAs(blob, fileName);
}
