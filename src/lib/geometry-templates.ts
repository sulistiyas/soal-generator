export interface GeometryTemplate {
  id: string;
  name: string;
  category: '3d' | '2d' | 'diagram';
  svg: string;
  defaultCaption: string;
}

export const GEOMETRY_TEMPLATES: GeometryTemplate[] = [
  {
    id: 'kubus-abcd-efgh',
    name: 'Kubus ABCD.EFGH',
    category: '3d',
    defaultCaption: 'Gambar Kubus ABCD.EFGH',
    svg: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="240" height="180" fill="#f8fafc" rx="8" />
  <!-- Rusuk Terlihat -->
  <!-- Alas ABCD -->
  <polygon points="50,140 130,140 170,105 90,105" fill="#e2e8f0" fill-opacity="0.3" stroke="#1e293b" stroke-width="2" stroke-linejoin="round" />
  <!-- Tutup EFGH -->
  <polygon points="50,60 130,60 170,25 90,25" fill="#cbd5e1" fill-opacity="0.3" stroke="#1e293b" stroke-width="2" stroke-linejoin="round" />
  <!-- Rusuk Tegak -->
  <line x1="50" y1="140" x2="50" y2="60" stroke="#1e293b" stroke-width="2" />
  <line x1="130" y1="140" x2="130" y2="60" stroke="#1e293b" stroke-width="2" />
  <line x1="170" y1="105" x2="170" y2="25" stroke="#1e293b" stroke-width="2" />
  <!-- Rusuk Putus-putus (Tak Terlihat) DH & alas belakang -->
  <line x1="90" y1="105" x2="90" y2="25" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
  <!-- Titik Sudut -->
  <text x="36" y="152" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">A</text>
  <text x="135" y="152" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">B</text>
  <text x="176" y="112" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">C</text>
  <text x="76" y="108" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">D</text>
  <text x="36" y="58" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">E</text>
  <text x="135" y="58" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">F</text>
  <text x="176" y="24" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">G</text>
  <text x="76" y="22" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">H</text>
  <!-- Keterangan Rusuk -->
  <text x="85" y="156" font-family="Arial, sans-serif" font-size="11" fill="#2563eb" font-weight="600">s = 8 cm</text>
</svg>`,
  },
  {
    id: 'balok-dimensi',
    name: 'Balok (Panjang, Lebar, Tinggi)',
    category: '3d',
    defaultCaption: 'Gambar Balok ABCD.EFGH',
    svg: `<svg viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="260" height="170" fill="#f8fafc" rx="8" />
  <!-- Sisi Depan ABFE -->
  <rect x="40" y="65" width="120" height="70" fill="#e2e8f0" fill-opacity="0.4" stroke="#1e293b" stroke-width="2" />
  <!-- Garis Belakang Putus-putus -->
  <line x1="85" y1="35" x2="85" y2="105" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
  <line x1="40" y1="135" x2="85" y2="105" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
  <line x1="85" y1="105" x2="205" y2="105" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
  <!-- Sisi Atas & Kanan -->
  <polygon points="40,65 85,35 205,35 160,65" fill="#cbd5e1" fill-opacity="0.4" stroke="#1e293b" stroke-width="2" stroke-linejoin="round" />
  <polygon points="160,65 205,35 205,105 160,135" fill="#94a3b8" fill-opacity="0.3" stroke="#1e293b" stroke-width="2" stroke-linejoin="round" />
  <!-- Label Dimensi -->
  <text x="85" y="152" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#2563eb">p = 12 cm</text>
  <text x="185" y="128" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#059669">l = 6 cm</text>
  <text x="18" y="104" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#dc2626">t = 8 cm</text>
  <!-- Label Titik -->
  <text x="28" y="148" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">A</text>
  <text x="165" y="148" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">B</text>
  <text x="210" y="112" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">C</text>
  <text x="72" y="110" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">D</text>
  <text x="28" y="62" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">E</text>
  <text x="162" y="60" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">F</text>
  <text x="210" y="32" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">G</text>
  <text x="74" y="30" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">H</text>
</svg>`,
  },
  {
    id: 'tabung',
    name: 'Tabung (Silinder)',
    category: '3d',
    defaultCaption: 'Gambar Bangun Ruang Tabung',
    svg: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="200" height="180" fill="#f8fafc" rx="8" />
  <!-- Selimut Tabung -->
  <path d="M 50,45 L 50,135 A 50,16 0 0 0 150,135 L 150,45" fill="#e2e8f0" fill-opacity="0.3" stroke="#1e293b" stroke-width="2" />
  <!-- Alas Belakang Putus-putus -->
  <path d="M 50,135 A 50,16 0 0 1 150,135" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
  <!-- Tutup Atas -->
  <ellipse cx="100" cy="45" rx="50" ry="16" fill="#cbd5e1" fill-opacity="0.5" stroke="#1e293b" stroke-width="2" />
  <!-- Garis Jari-jari r -->
  <line x1="100" y1="45" x2="150" y2="45" stroke="#2563eb" stroke-width="2" />
  <circle cx="100" cy="45" r="2.5" fill="#2563eb" />
  <text x="116" y="40" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#2563eb">r = 7 cm</text>
  <!-- Garis Tinggi t -->
  <line x1="165" y1="45" x2="165" y2="135" stroke="#dc2626" stroke-width="1.5" marker-start="url(#dot)" marker-end="url(#dot)" />
  <text x="170" y="94" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#dc2626">t = 20 cm</text>
</svg>`,
  },
  {
    id: 'kerucut',
    name: 'Kerucut',
    category: '3d',
    defaultCaption: 'Gambar Bangun Ruang Kerucut',
    svg: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="200" height="180" fill="#f8fafc" rx="8" />
  <!-- Selimut Kerucut -->
  <polygon points="100,25 45,140 155,140" fill="#e2e8f0" fill-opacity="0.3" />
  <line x1="100" y1="25" x2="45" y2="140" stroke="#1e293b" stroke-width="2" />
  <line x1="100" y1="25" x2="155" y2="140" stroke="#1e293b" stroke-width="2" />
  <!-- Alas Lengkung Depan -->
  <path d="M 45,140 A 55,16 0 0 0 155,140" fill="none" stroke="#1e293b" stroke-width="2" />
  <!-- Alas Lengkung Belakang (Putus-putus) -->
  <path d="M 45,140 A 55,16 0 0 1 155,140" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
  <!-- Garis Tinggi Tengah -->
  <line x1="100" y1="25" x2="100" y2="140" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,3" />
  <!-- Garis Jari-jari -->
  <line x1="100" y1="140" x2="155" y2="140" stroke="#2563eb" stroke-width="2" />
  <circle cx="100" cy="140" r="2.5" fill="#2563eb" />
  <!-- Siku-siku alas -->
  <polyline points="100,132 108,132 108,140" fill="none" stroke="#dc2626" stroke-width="1" />
  <!-- Label -->
  <text x="96" y="18" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">T</text>
  <text x="82" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#dc2626">t = 12</text>
  <text x="115" y="156" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#2563eb">r = 5 cm</text>
  <text x="135" y="80" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#059669">s = 13 cm</text>
</svg>`,
  },
  {
    id: 'limas-segiempat',
    name: 'Limas Segiempat T.ABCD',
    category: '3d',
    defaultCaption: 'Gambar Limas T.ABCD',
    svg: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="240" height="180" fill="#f8fafc" rx="8" />
  <!-- Alas ABCD -->
  <polygon points="50,145 150,145 190,115 90,115" fill="#e2e8f0" fill-opacity="0.3" />
  <line x1="50" y1="145" x2="150" y2="145" stroke="#1e293b" stroke-width="2" />
  <line x1="150" y1="145" x2="190" y2="115" stroke="#1e293b" stroke-width="2" />
  <!-- Rusuk Tersembunyi AD & CD -->
  <line x1="50" y1="145" x2="90" y2="115" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
  <line x1="90" y1="115" x2="190" y2="115" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
  <!-- Rusuk Tegak -->
  <line x1="120" y1="30" x2="50" y2="145" stroke="#1e293b" stroke-width="2" />
  <line x1="120" y1="30" x2="150" y2="145" stroke="#1e293b" stroke-width="2" />
  <line x1="120" y1="30" x2="190" y2="115" stroke="#1e293b" stroke-width="2" />
  <line x1="120" y1="30" x2="90" y2="115" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4" />
  <!-- Titik Puncak & Sudut -->
  <text x="116" y="22" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">T</text>
  <text x="36" y="155" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">A</text>
  <text x="156" y="155" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">B</text>
  <text x="195" y="120" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">C</text>
  <text x="76" y="118" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">D</text>
</svg>`,
  },
  {
    id: 'segitiga-siku-siku',
    name: 'Segitiga Siku-siku (Pythagoras)',
    category: '2d',
    defaultCaption: 'Gambar Segitiga Siku-siku ABC',
    svg: `<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="220" height="160" fill="#f8fafc" rx="8" />
  <!-- Bidang Segitiga -->
  <polygon points="50,125 170,125 50,35" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5" stroke-linejoin="round" />
  <!-- Tanda Siku-siku di A -->
  <polyline points="50,110 65,110 65,125" fill="none" stroke="#0369a1" stroke-width="1.5" />
  <!-- Titik Sudut -->
  <text x="34" y="135" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">A</text>
  <text x="178" y="135" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">B</text>
  <text x="42" y="28" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">C</text>
  <!-- Label Sisi -->
  <text x="100" y="145" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0369a1">a = 12 cm</text>
  <text x="14" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0369a1">b = 9 cm</text>
  <text x="120" y="70" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#dc2626">c = ?</text>
</svg>`,
  },
  {
    id: 'persegi-panjang',
    name: 'Persegi Panjang ABCD',
    category: '2d',
    defaultCaption: 'Gambar Persegi Panjang ABCD',
    svg: `<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="240" height="150" fill="#f8fafc" rx="8" />
  <rect x="40" y="35" width="160" height="80" fill="#f1f5f9" stroke="#334155" stroke-width="2" rx="2" />
  <!-- Label Titik -->
  <text x="28" y="125" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">A</text>
  <text x="206" y="125" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">B</text>
  <text x="206" y="38" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">C</text>
  <text x="28" y="38" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">D</text>
  <!-- Label Ukuran -->
  <text x="105" y="135" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#2563eb">p = 15 cm</text>
  <text x="210" y="80" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#2563eb">l = 8 cm</text>
</svg>`,
  },
  {
    id: 'lingkaran-juring-arsir',
    name: 'Lingkaran & Daerah Juring Diarsir',
    category: '2d',
    defaultCaption: 'Gambar Lingkaran dengan Juring AOB Terarsir',
    svg: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="200" height="180" fill="#f8fafc" rx="8" />
  <!-- Lingkaran Luar -->
  <circle cx="100" cy="90" r="60" fill="#ffffff" stroke="#1e293b" stroke-width="2" />
  <!-- Juring Terarsir 60 derajat -->
  <path d="M 100,90 L 160,90 A 60,60 0 0 0 130,38 Z" fill="#93c5fd" fill-opacity="0.7" stroke="#1d4ed8" stroke-width="2" />
  <!-- Titik Pusat O -->
  <circle cx="100" cy="90" r="3" fill="#1e293b" />
  <text x="86" y="95" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">O</text>
  <!-- Titik Juring -->
  <text x="165" y="95" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">A</text>
  <text x="132" y="30" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">B</text>
  <!-- Sudut Pusat -->
  <path d="M 120,90 A 20,20 0 0 0 110,73" fill="none" stroke="#dc2626" stroke-width="1.5" />
  <text x="122" y="80" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#dc2626">60°</text>
  <!-- Keterangan Jari-jari -->
  <text x="110" y="110" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#1e293b">r = 14 cm</text>
</svg>`,
  },
  {
    id: 'trapesium-sama-kaki',
    name: 'Trapesium Sama Kaki',
    category: '2d',
    defaultCaption: 'Gambar Trapesium Sama Kaki ABCD',
    svg: `<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="240" height="160" fill="#f8fafc" rx="8" />
  <polygon points="40,125 200,125 160,45 80,45" fill="#fef3c7" stroke="#b45309" stroke-width="2" stroke-linejoin="round" />
  <!-- Garis Tinggi Putus-putus -->
  <line x1="80" y1="45" x2="80" y2="125" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3" />
  <polyline points="80,115 90,115 90,125" fill="none" stroke="#d97706" stroke-width="1" />
  <!-- Label -->
  <text x="26" y="132" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">A</text>
  <text x="206" y="132" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">B</text>
  <text x="165" y="40" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">C</text>
  <text x="68" y="40" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">D</text>
  <text x="110" y="38" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#92400e">a = 8 cm</text>
  <text x="110" y="145" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#92400e">b = 16 cm</text>
  <text x="54" y="90" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#d97706">t = 6 cm</text>
</svg>`,
  },
  {
    id: 'pecahan-arsiran-lingkaran',
    name: 'Pecahan Visual (Arsiran Lingkaran 3/8)',
    category: 'diagram',
    defaultCaption: 'Gambar Nilai Pecahan Daerah yang Diarsir',
    svg: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="200" height="180" fill="#f8fafc" rx="8" />
  <circle cx="100" cy="90" r="60" fill="#ffffff" stroke="#1e293b" stroke-width="2" />
  <!-- 3 dari 8 Bagian Terarsir -->
  <path d="M 100,90 L 160,90 A 60,60 0 0 1 100,150 Z" fill="#86efac" stroke="#1e293b" stroke-width="1.5" />
  <path d="M 100,90 L 100,150 A 60,60 0 0 1 57.5,132.5 Z" fill="#86efac" stroke="#1e293b" stroke-width="1.5" />
  <!-- Garis Pemisah 8 Bagian -->
  <line x1="40" y1="90" x2="160" y2="90" stroke="#1e293b" stroke-width="1.5" />
  <line x1="100" y1="30" x2="100" y2="150" stroke="#1e293b" stroke-width="1.5" />
  <line x1="57.5" y1="47.5" x2="142.5" y2="132.5" stroke="#1e293b" stroke-width="1.5" />
  <line x1="57.5" y1="132.5" x2="142.5" y2="47.5" stroke="#1e293b" stroke-width="1.5" />
  <circle cx="100" cy="90" r="3" fill="#1e293b" />
</svg>`,
  },
  {
    id: 'diagram-batang',
    name: 'Diagram Batang Statistika',
    category: 'diagram',
    defaultCaption: 'Diagram Penjualan / Data Nilai Siswa',
    svg: `<svg viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-48">
  <rect width="260" height="170" fill="#f8fafc" rx="8" />
  <!-- Sumbu X & Y -->
  <line x1="40" y1="135" x2="240" y2="135" stroke="#334155" stroke-width="2" />
  <line x1="40" y1="20" x2="40" y2="135" stroke="#334155" stroke-width="2" />
  <!-- Garis Grid Horizontal -->
  <line x1="40" y1="105" x2="240" y2="105" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2,2" />
  <line x1="40" y1="75" x2="240" y2="75" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2,2" />
  <line x1="40" y1="45" x2="240" y2="45" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2,2" />
  <text x="22" y="109" font-family="Arial, sans-serif" font-size="10" fill="#64748b">10</text>
  <text x="22" y="79" font-family="Arial, sans-serif" font-size="10" fill="#64748b">20</text>
  <text x="22" y="49" font-family="Arial, sans-serif" font-size="10" fill="#64748b">30</text>
  <!-- Batang-batang Diagram -->
  <rect x="60" y="75" width="28" height="60" fill="#3b82f6" rx="2" />
  <text x="70" y="70" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#1e40af">20</text>
  <text x="64" y="148" font-family="Arial, sans-serif" font-size="10" fill="#334155">Sen</text>
  
  <rect x="105" y="45" width="28" height="90" fill="#10b981" rx="2" />
  <text x="115" y="40" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#065f46">30</text>
  <text x="109" y="148" font-family="Arial, sans-serif" font-size="10" fill="#334155">Sel</text>
  
  <rect x="150" y="90" width="28" height="45" fill="#f59e0b" rx="2" />
  <text x="160" y="85" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#92400e">15</text>
  <text x="154" y="148" font-family="Arial, sans-serif" font-size="10" fill="#334155">Rab</text>

  <rect x="195" y="60" width="28" height="75" fill="#8b5cf6" rx="2" />
  <text x="205" y="55" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#5b21b6">25</text>
  <text x="199" y="148" font-family="Arial, sans-serif" font-size="10" fill="#334155">Kam</text>
</svg>`,
  },
];

/**
 * Konversi SVG string atau base64 image URL ke ArrayBuffer PNG untuk ekspor DOCX
 */
export async function convertVisualToPngArrayBuffer(
  svgOrUrl: string
): Promise<{ buffer: ArrayBuffer; width: number; height: number } | null> {
  if (typeof window === 'undefined') return null;

  try {
    return await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      let src = svgOrUrl;
      const isSvg = svgOrUrl.trim().startsWith('<svg') || svgOrUrl.includes('<svg');

      if (isSvg) {
        // Enkode SVG ke base64 data url
        const cleanSvg = svgOrUrl.trim();
        const svgBlob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
        src = URL.createObjectURL(svgBlob);
      }

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = img.naturalWidth || 320;
        const height = img.naturalHeight || 200;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        // Latar belakang putih bersih untuk Word
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        if (isSvg && src.startsWith('blob:')) {
          URL.revokeObjectURL(src);
        }

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result instanceof ArrayBuffer) {
              resolve({
                buffer: reader.result,
                width: Math.min(260, Math.max(160, width)),
                height: Math.min(180, Math.max(100, height)),
              });
            } else {
              resolve(null);
            }
          };
          reader.onerror = () => resolve(null);
          reader.readAsArrayBuffer(blob);
        }, 'image/png');
      };

      img.onerror = (e) => {
        console.warn('Gagal memuat visual diagram:', e);
        if (isSvg && src.startsWith('blob:')) {
          URL.revokeObjectURL(src);
        }
        resolve(null);
      };

      img.src = src;
    });
  } catch (err) {
    console.error('Error convertVisualToPngArrayBuffer:', err);
    return null;
  }
}
