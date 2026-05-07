import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProtectedLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100">

            {/* HEADER */}
            <Header />

            {/* PAGE CONTENT */}
            <main className="pt-20 pb-24">
                {children}
            </main>

            {/* FOOTER */}
            <Footer />

        </div>
    );
}
