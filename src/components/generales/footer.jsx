'use client';

export default function Footer({pais}) {
    return (
        <footer className="footer">
            <div className="text-center">
                <span>© 2025 Copyright: AlexServCorp</span>
                <a href="https://jobget.vercel.app/">JobGet.com</a>
            </div>
            <p>PAIS: {pais}</p>
        </footer>
    );
}