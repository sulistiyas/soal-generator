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
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { ExamData, QuestionItem } from '@/types/exam';
import { convertVisualToPngArrayBuffer } from '@/lib/geometry-templates';

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

export async function exportExamToDocx(exam: ExamData) {
  const children: (Paragraph | Table)[] = [];

  // ================= 1. KOP SURAT / HEADER =================
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: safeStr(exam.schoolName ? exam.schoolName.toUpperCase() : 'SEKOLAH CONTOH INDONESIA'),
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
          text: safeStr(exam.examTitle, 'ASESMEN SUMATIF / NASKAH SOAL UJIAN'),
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
          text: `TAHUN AJARAN ${safeStr(exam.academicYear, '2024/2025')} - SEMESTER ${safeStr(exam.semester, 'GANJIL').toUpperCase()}`,
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
                  new TextRun({ text: safeStr(exam.subject, '-'), font: 'Times New Roman' }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Kelas / Fase    : ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: safeStr(exam.grade, '-'), font: 'Times New Roman' }),
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
                  new TextRun({ text: `${safeStr(exam.durationMinutes, '90')} Menit`, font: 'Times New Roman' }),
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

  const instructionsList =
    Array.isArray(exam.instructions) && exam.instructions.length > 0
      ? exam.instructions
      : [
          'Berdoalah sebelum mengerjakan soal.',
          'Tuliskan nomor dan nama Anda pada lembar jawaban yang tersedia.',
          'Bacalah setiap butir soal dengan cermat dan teliti.',
          'Periksalah kembali jawaban Anda sebelum diserahkan kepada pengawas.',
        ];

  instructionsList.forEach((inst, idx) => {
    children.push(
      new Paragraph({
        indent: { left: 360 },
        children: [
          new TextRun({
            text: `${idx + 1}. ${safeStr(inst)}`,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
      })
    );
  });

  children.push(new Paragraph({ spacing: { after: 250 } }));

  // Pisahkan soal PG, Isian Singkat, dan Uraian / Essay
  const questions: QuestionItem[] = Array.isArray(exam.questions) ? exam.questions : [];
  const pgQuestions = questions.filter((q) => q.type === 'pg');
  const isianQuestions = questions.filter((q) => q.type === 'isian');
  const essayQuestions = questions.filter((q) => q.type === 'uraian' || q.type === 'essay' || (q.type !== 'pg' && q.type !== 'isian'));

  let sectionCounter = 1;
  const toRoman = (num: number) => (num === 1 ? 'I' : num === 2 ? 'II' : num === 3 ? 'III' : `${num}`);

  // Helper menyematkan gambar diagram ke Word
  const addQuestionVisual = async (q: QuestionItem) => {
    const visualSource = q.imageSvg || q.imageUrl;
    if (!visualSource) return;

    try {
      const pngResult = await convertVisualToPngArrayBuffer(visualSource);
      if (pngResult && pngResult.buffer) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 60 },
            children: [
              new ImageRun({
                type: 'png',
                data: pngResult.buffer,
                transformation: {
                  width: pngResult.width,
                  height: pngResult.height,
                },
              }),
            ],
          })
        );

        if (q.imageCaption) {
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 80 },
              children: [
                new TextRun({
                  text: safeStr(q.imageCaption),
                  italics: true,
                  size: 18,
                  font: 'Times New Roman',
                  color: '555555',
                }),
              ],
            })
          );
        }
      }
    } catch (err) {
      console.warn(`Gagal menyematkan visual pada soal ${q.number}:`, err);
    }
  };

  // ================= 4. BAGIAN I: PILIHAN GANDA =================
  if (pgQuestions.length > 0) {
    const roman = toRoman(sectionCounter++);
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${roman}. PILIHAN GANDA`,
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

    for (const q of pgQuestions) {
      // Stimulus jika ada
      if (q.stimulus && typeof q.stimulus === 'string' && q.stimulus.trim()) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: `Bacaan untuk soal nomor ${safeStr(q.number)}:`,
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
                text: safeStr(q.stimulus),
                italics: true,
                font: 'Times New Roman',
                size: 20,
              }),
            ],
          })
        );
      }

      // Visual Diagram jika ada
      await addQuestionVisual(q);

      // Pertanyaan
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({
              text: `${safeStr(q.number)}. `,
              bold: true,
              font: 'Times New Roman',
              size: 21,
            }),
            new TextRun({
              text: safeStr(q.question),
              font: 'Times New Roman',
              size: 21,
            }),
          ],
        })
      );

      // Opsi Pilihan
      if (Array.isArray(q.options)) {
        q.options.forEach((opt) => {
          if (!opt) return;
          children.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `${safeStr(opt.key)}. `,
                  bold: true,
                  font: 'Times New Roman',
                  size: 20,
                }),
                new TextRun({
                  text: safeStr(opt.text),
                  font: 'Times New Roman',
                  size: 20,
                }),
              ],
            })
          );
        });
      }
    }
  }

  // ================= 5. BAGIAN II: ISIAN SINGKAT =================
  if (isianQuestions.length > 0) {
    const roman = toRoman(sectionCounter++);
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        children: [
          new TextRun({
            text: `${roman}. ISIAN SINGKAT`,
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
            text: 'Isilah titik-titik di bawah ini dengan jawaban yang singkat, tepat, dan benar!',
            italics: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
      })
    );

    for (const q of isianQuestions) {
      if (q.stimulus && typeof q.stimulus === 'string' && q.stimulus.trim()) {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: safeStr(q.stimulus),
                italics: true,
                font: 'Times New Roman',
                size: 20,
              }),
            ],
          })
        );
      }

      // Visual Diagram jika ada
      await addQuestionVisual(q);

      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({
              text: `${safeStr(q.number)}. `,
              bold: true,
              font: 'Times New Roman',
              size: 21,
            }),
            new TextRun({
              text: safeStr(q.question),
              font: 'Times New Roman',
              size: 21,
            }),
          ],
        }),
        new Paragraph({
          indent: { left: 400 },
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: 'Jawaban: .................................................................................................',
              font: 'Times New Roman',
              size: 20,
              color: '555555',
            }),
          ],
        })
      );
    }
  }

  // ================= 6. BAGIAN III: URAIAN / ESSAY =================
  if (essayQuestions.length > 0) {
    const roman = toRoman(sectionCounter++);
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        children: [
          new TextRun({
            text: `${roman}. URAIAN / ESSAY`,
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
            text: 'Jawablah pertanyaan-pertanyaan di bawah ini dengan uraian yang jelas dan lengkap!',
            italics: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
      })
    );

    for (const q of essayQuestions) {
      if (q.stimulus && typeof q.stimulus === 'string' && q.stimulus.trim()) {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: safeStr(q.stimulus),
                italics: true,
                font: 'Times New Roman',
                size: 20,
              }),
            ],
          })
        );
      }

      // Visual Diagram jika ada
      await addQuestionVisual(q);

      children.push(
        new Paragraph({
          spacing: { before: 100, after: 100 },
          children: [
            new TextRun({
              text: `${safeStr(q.number)}. `,
              bold: true,
              font: 'Times New Roman',
              size: 21,
            }),
            new TextRun({
              text: safeStr(q.question),
              font: 'Times New Roman',
              size: 21,
            }),
          ],
        })
      );
    }
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

  questions.forEach((q) => {
    const typeLabel = q.type === 'pg' ? 'PG' : q.type === 'isian' ? 'ISIAN' : 'URAIAN';
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({
            text: `Soal No. ${safeStr(q.number)} (${typeLabel}) - Kunci: `,
            bold: true,
            font: 'Times New Roman',
            size: 21,
          }),
          new TextRun({
            text: safeStr(q.correctAnswer, '-'),
            bold: true,
            color: '006600',
            font: 'Times New Roman',
            size: 21,
          }),
          new TextRun({
            text: `  [Level: ${safeStr(q.cognitiveLevel, 'C3')}]`,
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
            text: 'Pembahasan: ',
            bold: true,
            italics: true,
            font: 'Times New Roman',
            size: 20,
          }),
          new TextRun({
            text: safeStr(q.explanation, '-'),
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

  questions.forEach((q, idx) => {
    const typeLabel = q.type === 'pg' ? 'PG' : q.type === 'isian' ? 'ISIAN' : 'URAIAN';
    kisiRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: String(idx + 1), font: 'Times New Roman' })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: safeStr(q.learningObjective, safeStr(exam.topic, '-')),
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: safeStr(q.indicator, `Menjawab soal materi ${safeStr(exam.topic, '')}`),
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: safeStr(q.cognitiveLevel, 'C3'), font: 'Times New Roman' })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${typeLabel} (No. ${safeStr(q.number)})`,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
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

  // ================= 8. LAMPIRAN: RUBRIK PENILAIAN (JIKA ADA) =================
  if (Array.isArray(exam.rubrics) && exam.rubrics.length > 0) {
    children.push(
      new Paragraph({
        children: [new PageBreak()],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: 'PEDOMAN PENSKORAN & RUBRIK PENILAIAN URAIAN',
            bold: true,
            size: 26,
            font: 'Times New Roman',
          }),
        ],
      })
    );

    exam.rubrics.forEach((rubric) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: `Soal Uraian Nomor ${safeStr(rubric.questionNumber)} (Skor Maksimal: ${safeStr(rubric.maxScore, '10')})`,
              bold: true,
              font: 'Times New Roman',
              size: 21,
            }),
          ],
        }),
        new Paragraph({
          indent: { left: 240 },
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `Kriteria: ${safeStr(rubric.criteria)}`,
              italics: true,
              font: 'Times New Roman',
              size: 20,
            }),
          ],
        })
      );

      if (Array.isArray(rubric.scoringGuide)) {
        rubric.scoringGuide.forEach((sg) => {
          children.push(
            new Paragraph({
              indent: { left: 480 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `• Skor ${safeStr(sg.score)}: `,
                  bold: true,
                  font: 'Times New Roman',
                  size: 20,
                }),
                new TextRun({
                  text: safeStr(sg.description),
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
  const cleanSubject = safeStr(exam.subject, 'Mapel').replace(/[^a-zA-Z0-9]/g, '_');
  const cleanGrade = safeStr(exam.grade, 'Kelas').replace(/[^a-zA-Z0-9]/g, '_');
  const cleanYear = safeStr(exam.academicYear, '2024-2025').replace(/[^a-zA-Z0-9]/g, '-');
  const fileName = `Soal_${cleanSubject}_${cleanGrade}_${cleanYear}.docx`;

  saveAs(blob, fileName);
}

