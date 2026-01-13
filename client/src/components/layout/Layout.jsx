import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
    return (
        <div className="layout">
            {/* Animated Background Elements */}
            <div className="animated-bg"></div>
            <div className="particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>
            <div className="glow-orb glow-orb-1"></div>
            <div className="glow-orb glow-orb-2"></div>

            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
