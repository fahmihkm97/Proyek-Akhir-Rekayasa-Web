import { useState } from 'react';

export default function ProductModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({ sku: '', name: '', category_id: '', stock: 0, price: 0 });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
        setForm({ sku: '', name: '', category_id: '', stock: 0, price: 0 }); // Reset
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
                <h2>➕ Produk Baru</h2>
                <form onSubmit={handleSubmit}>
                    <input placeholder="SKU" required style={styles.input} value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
                    <input placeholder="Nama" required style={styles.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input placeholder="Kategori ID" type="number" required style={styles.input} value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} />
                    <input placeholder="Harga" type="number" required style={styles.input} value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                    <input placeholder="Stok Awal" type="number" required style={styles.input} value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                    <div style={{textAlign:'right'}}>
                        <button type="button" onClick={onClose} style={{...styles.btn, backgroundColor:'#95a5a6', marginRight:'10px'}}>Batal</button>
                        <button type="submit" style={{...styles.btn, backgroundColor:'#27ae60'}}>Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}