import { useState } from 'react';

export default function HistoryModal({ isOpen, onClose, history, onDelete, onUpdateNote, onAddClick }) {
    const [editingId, setEditingId] = useState(null);
    const [editNote, setEditNote] = useState('');

    if (!isOpen) return null;

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditNote(item.notes);
    };

    const saveEdit = (id) => {
        onUpdateNote(id, editNote);
        setEditingId(null);
    };

    const styles = {
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
        content: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' },
        th: { backgroundColor: '#ecf0f1', padding: '10px', textAlign: 'left' },
        td: { padding: '10px', borderBottom: '1px solid #eee' },
        btn: { padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', fontSize: '12px', margin: '0 2px' }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.content}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2 style={{margin:0, color:'#e67e22'}}>📋 Riwayat Barang Keluar</h2>
                    <button onClick={onAddClick} style={{...styles.btn, backgroundColor:'#27ae60', padding:'8px 16px', fontSize:'14px'}}>➕ Tambah Transaksi</button>
                    <button onClick={onClose} style={{border:'none', background:'none', fontSize:'20px', cursor:'pointer'}}>❌</button>
                </div>

                <table style={styles.table}>
                    <thead><tr><th style={styles.th}>Tanggal</th><th style={styles.th}>Barang</th><th style={styles.th}>Jml</th><th style={styles.th}>Oleh</th><th style={styles.th}>Catatan</th><th style={styles.th}>Aksi</th></tr></thead>
                    <tbody>
                        {history.map(h => (
                            <tr key={h.id}>
                                <td style={styles.td}>{new Date(h.created_at).toLocaleDateString()}</td>
                                <td style={styles.td}>{h.product?.name}</td>
                                <td style={{...styles.td, color:'red', fontWeight:'bold'}}>- {h.quantity}</td>
                                <td style={styles.td}>{h.user?.name}</td>
                                <td style={styles.td}>
                                    {editingId === h.id ? (
                                        <div style={{display:'flex', gap:'5px'}}>
                                            <input value={editNote} onChange={(e) => setEditNote(e.target.value)} style={{width:'80px'}} />
                                            <button onClick={() => saveEdit(h.id)} style={{...styles.btn, backgroundColor:'#27ae60'}}>OK</button>
                                            <button onClick={() => setEditingId(null)} style={{...styles.btn, backgroundColor:'#95a5a6'}}>X</button>
                                        </div>
                                    ) : h.notes}
                                </td>
                                <td style={styles.td}>
                                    {editingId !== h.id && (
                                        <>
                                            <button onClick={() => startEdit(h)} style={{...styles.btn, backgroundColor: '#f39c12'}}>✏️edit</button>
                                            <button onClick={() => onDelete(h.id)} style={{...styles.btn, backgroundColor: '#c0392b'}}>🗑️hapus</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}