"use client"
export default function Modal_Share({showShareModal, setShowShareModal, tipo, data}){

    const handleShare = async (platform) => {
        const url = window.location.href;
        const text = `¡Mira ${`est${tipo==="pasantia"?"a":"e"} ${tipo}`}: ${data.titulo} en ${data.ciudad}!`;

        switch(platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    alert('¡Enlace copiado al portapapeles!');
                } catch (err) {
                    console.error('Error al copiar:', err);
                }
                break;
        }
        setShowShareModal(false);
    };//funcion del modal para compartir la pagina
    return (
        <>
        {showShareModal && (
        <div className="modal-backdrop" onClick={() => setShowShareModal(false)}>
            <div className="share-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h5 className="modal-title">
                        <i className="bi bi-share-fill"></i>
                        Compartir {tipo}
                    </h5>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white" 
                        onClick={() => setShowShareModal(false)}
                    ></button>
                </div>
                <div className="modal-body">
                    <div className="share-options">
                        <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp">
                            <i className="bi bi-whatsapp"></i>
                            <span>WhatsApp</span>
                        </button>
                        <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                            <i className="bi bi-facebook"></i>
                            <span>Facebook</span>
                        </button>
                        <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                            <i className="bi bi-twitter-x"></i>
                            <span>Twitter</span>
                        </button>
                        <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
                            <i className="bi bi-linkedin"></i>
                            <span>LinkedIn</span>
                        </button>
                        <button onClick={() => handleShare('copy')} className="share-btn copy">
                            <i className="bi bi-link-45deg"></i>
                            <span>Copiar Enlace</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}
    </>
    )
}