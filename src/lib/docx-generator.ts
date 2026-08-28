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
import { ExamData } from '@/types/exam';

export async function exportExamToDocx(exam: ExamData) {
  const children: (Paragraph | Table)[] = [];

  // ================= 1. KOP SURAT / HEADER =================
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: exam.schoolName ? exam.schoolName.toUpperCase() : 'SEKOLAH CONTOH INDONESIA',
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
          text: exam.examTitle || 'ASESMEN SUMATIF / NASKAH SOAL UJIAN',
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
          text: `TAHUN AJARAN ${exam.academicYear} - SEMESTER ${exam.semester.toUpperCase()}`,
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

  // ================= 2. TABEL IDENTITAS UJIAN =================
  const infoTable = new Table({
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
                children: [
                  new TextRun({ text: 'Mata Pelajaran : ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: exam.subject, font: 'Times New Roman' }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Kelas / Fase    : ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: exam.grade, font: 'Times New Roman' }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Waktu            : ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: `${exam.durationMinutes} Menit`, font: 'Times New Roman' }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Hari, Tanggal : ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: '....................................', font: 'Times New Roman' }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(infoTable);
  children.push(new Paragraph({ spacing: { after: 200 } }));

  // ================= 3. PETUNJUK UMUM =================
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'PETUNJUK UMUM:',
          bold: true,
          underline: {},
          font: 'Times New Roman',
          size: 20,
        }),
      ],
    })
  );

  (exam.instructions || [
    'Berdoalah sebelum mengerjakan soal.',
    'Tuliskan nomor dan nama Anda pada lembar jawaban yang tersedia.',
    'Bacalah setiap butir soal dengan cermat dan teliti.',
    'Periksalah kembali jawaban Anda sebelum diserahkan kepada pengawas.',
  ]).forEach((inst, idx) => {
    children.push(
      new Paragraph({
        indent: { left: 360 },
        children: [
          new TextRun({
            text: `${idx + 1}. ${inst}`,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
      })
    );
  });

  children.push(new Paragraph({ spacing: { after: 250 } }));

  // Pisahkan soal PG dan Uraian
  const pgQuestions = exam.questions.filter((q) => q.type === 'pg');
  const essayQuestions = exam.questions.filter((q) => q.type === 'uraian' || q.type === 'isian');

  // ================= 4. BAGIAN I: PILIHAN GANDA =================
  if (pgQuestions.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: 'I. PILIHAN GANDA',
            bold: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: 'Pilihlah salah satu jawaban yang paling tepat dengan memberi tanda silang (X) pada huruf A, B, C, atau D/E pada lembar jawaban!',
            italics: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
      })
    );

    pgQuestions.forEach((q) => {
      // Stimulus jika ada
      if (q.stimulus) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: `Bacaan untuk soal nomor ${q.number}:`,
                italics: true,
                bold: true,
                font: 'Times New Roman',
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            indent: { left: 360, right: 360 },
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: q.stimulus,
                italics: true,
                font: 'Times New Roman',
                size: 20,
              }),
            ],
          })
        );
      }

      // Pertanyaan
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({
              text: `${q.number}. `,
              bold: true,
              font: 'Times New Roman',
              size: 21,
            }),
            new TextRun({
              text: q.question,
              font: 'Times New Roman',
              size: 21,
            }),
          ],
        })
      );

      // Opsi Pilihan
      if (q.options) {
        q.options.forEach((opt) => {
          children.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `${opt.key}. `,
                  bold: true,
                  font: 'Times New Roman',
                  size: 20,
                }),
                new TextRun({
                  text: opt.text,
                  font: 'Times New Roman',
                  size: 20,
                }),
              ],
            })
          );
        });
      }
    });
  }

  // ================= 5. BAGIAN II: URAIAN / ESSAY =================
  if (essayQuestions.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 300, after: 150 },
        children: [
          new TextRun({
            text: 'II. URAIAN / ESSAY',
            bold: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: 'Jawablah pertanyaan-pertanyaan di bawah ini dengan jelas dan tepat!',
            italics: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
      })
    );

    essayQuestions.forEach((q) => {
      if (q.stimulus) {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: q.stimulus,
                italics: true,
                font: 'Times New Roman',
                size: 20,
              }),
            ],
          })
        );
      }

      children.push(
        new Paragraph({
          spacing: { before: 100, after: 100 },
          children: [
            new TextRun({
              text: `${q.number}. `,
              bold: true,
              font: 'Times New Roman',
              size: 21,
            }),
            new TextRun({
              text: q.question,
              font: 'Times New Roman',
              size: 21,
            }),
          ],
        })
      );
    });
  }

  // ================= 6. LAMPIRAN: KUNCI JAWABAN & PEMBAHASAN =================
  children.push(
    new Paragraph({
      children: [new PageBreak()],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'LEMBAR KUNCI JAWABAN & PEMBAHASAN',
          bold: true,
          size: 26,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  exam.questions.forEach((q) => {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({
            text: `Soal No. ${q.number} (${q.type.toUpperCase()}) - Kunci: `,
            bold: true,
            font: 'Times New Roman',
            size: 21,
          }),
          new TextRun({
            text: q.correctAnswer,
            bold: true,
            color: '006600',
            font: 'Times New Roman',
            size: 21,
          }),
          new TextRun({
            text: `  [Level: ${q.cognitiveLevel}]`,
            italics: true,
            font: 'Times New Roman',
            size: 19,
          }),
        ],
      }),
      new Paragraph({
        indent: { left: 360 },
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: `Pembahasan: `,
            bold: true,
            italics: true,
            font: 'Times New Roman',
            size: 20,
          }),
          new TextRun({
            text: q.explanation,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
      })
    );
  });

  // ================= 7. LAMPIRAN: TABEL KISI-KISI SOAL =================
  children.push(
    new Paragraph({
      children: [new PageBreak()],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: 'KISI-KISI PENULISAN SOAL ASESMEN',
          bold: true,
          size: 26,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  const kisiHeaderRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, font: 'Times New Roman' })] })],
      }),
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Capaian / Tujuan Pembelajaran', bold: true, font: 'Times New Roman' })] })],
      }),
      new TableCell({
        width: { size: 38, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Indikator Soal', bold: true, font: 'Times New Roman' })] })],
      }),
      new TableCell({
        width: { size: 12, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Level', bold: true, font: 'Times New Roman' })] })],
      }),
      new TableCell({
        width: { size: 14, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Bentuk (No)', bold: true, font: 'Times New Roman' })] })],
      }),
    ],
  });

  const kisiRows = [kisiHeaderRow];

  exam.questions.forEach((q, idx) => {
    kisiRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: 'Times New Roman' })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: q.learningObjective || exam.topic, font: 'Times New Roman' })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: q.indicator || `Menjawab soal materi ${exam.topic}`, font: 'Times New Roman' })] })],
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(q.cognitiveLevel), font: 'Times New Roman' })] })],
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${q.type.toUpperCase()} (No. ${q.number})`, font: 'Times New Roman' })] })],
          }),
        ],
      })
    );
  });

  const kisiTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: kisiRows,
  });

  children.push(kisiTable);

  // Buat Dokumen Docx
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanSubject = exam.subject.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanGrade = exam.grade.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Soal_${cleanSubject}_${cleanGrade}_${exam.academicYear.replace('/', '-')}.docx`;

  saveAs(blob, fileName);
}
