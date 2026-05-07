import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProtectedLayout({ children }) {
    return (
        <div >
            <Header />
            <div >
                <main>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}