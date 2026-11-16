import { LuGraduationCap, LuPresentation } from "react-icons/lu";
import { materiData } from "./data/materiData";
import SlideViewer from "./components/SlideViewer";

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#efeae1] text-card-text">
      {/* Hero Header */}
      <header className="w-full bg-primary-light border-b border-card-border">
        <div className="max-w-4xl mx-auto px-6 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary border border-card-border text-secondary shrink-0">
              <LuGraduationCap size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-secondary tracking-tight">
              Program Kerja KKN • Pembekalan Siswa
            </h1>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-primary-dark">
            Materi Pembekalan
          </h3>

          <p className="text-sm sm:text-base text-card-muted mt-2 max-w-2xl leading-relaxed">
            Kumpulan modul interaktif keterampilan digital, pemanfaatan AI, dan
            pengembangan diri untuk mendukung kesiapan belajar siswa.
          </p>

          {/* Navigasi Cepat Modul */}
          <nav className="flex flex-wrap gap-2.5 mt-6">
            {materiData.map((materi, idx) => (
              <a
                key={materi.id}
                href={`#materi-${materi.id}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary/70 border border-card-border hover:bg-secondary hover:text-primary-light hover:border-secondary text-secondary text-xs font-semibold transition-colors"
              >
                <LuPresentation size={15} />
                <span>
                  {idx + 1}. {materi.title}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Daftar Card Materi */}
      <main className="max-w-4xl w-full mx-auto px-6 py-8 sm:py-10 space-y-8 flex-1">
        {materiData.map((materi, index) => (
          <section
            id={`materi-${materi.id}`}
            key={materi.id}
            className="bg-primary-light border border-card-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 scroll-mt-6"
          >
            <div className="flex items-start gap-3.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary text-primary-light font-bold text-sm shrink-0 mt-0.5 shadow-xs">
                {index + 1}
              </span>
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-secondary leading-snug">
                  {materi.title}
                </h2>
                {materi.description && (
                  <p className="text-sm text-card-muted leading-relaxed">
                    {materi.description}
                  </p>
                )}
              </div>
            </div>

            <SlideViewer slides={materi.slides} />
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-card-border bg-primary-light py-5 text-center text-xs font-medium text-card-muted">
        Disusun untuk Program Kerja KKN • 2026
      </footer>
    </div>
  );
}
