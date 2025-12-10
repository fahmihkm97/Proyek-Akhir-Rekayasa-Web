import { useState, useEffect } from 'react';

export default function TransactionModal({ isOpen, onClose, type, productName, onSubmit }) {
    const [qty, setQty] = useState(1);
    const [notes, setNotes] = useState('');

    // Reset form saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            setQty(1);
            setNotes('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(qty, notes);
    };

    const styles = {
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
        content: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
        input: { width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
        btn: { padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: 'white', marginTop: '15px' }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.content}>
                <h2>{type === 'in' ? '🟢 Barang Masuk' : '🔴 Barang Keluar'}</h2>
                <p>Produk: <strong>{productName}</strong></p>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom:'10px'}}>
                        <label>Jumlah</label>
                        <input type="number" min="1" required style={styles.input} value={qty} onChange={e => setQty(e.target.value)} />
                    </div>
                    <div style={{marginBottom:'10px'}}>
                        <label>Catatan</label>
                        <input type="text" style={styles.input} value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                    <div style={{textAlign:'right'}}>
                        <button type="button" onClick={onClose} style={{...styles.btn, backgroundColor: '#95a5a6', marginRight:'10px'}}>Batal</button>
                        <button type="submit" style={{...styles.btn, backgroundColor: '#3498db'}}>Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}