import { useState } from 'react';

export default function StaffModal({ isOpen, onClose, users, onSave, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ id: null, name: '', email: '', password: '', role: 'user' });

    if (!isOpen) return null;

    // Handle Edit Click dari Tabel
    const handleEditClick = (user) => {
        setForm({ ...user, password: '' });
        setIsEditing(true);
    };

    // Handle Submit Form
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form, isEditing); // Kirim data ke Dashboard
        // Reset local form
        setForm({ id: null, name: '', email: '', password: '', role: 'user' });
        setIsEditing(false);
    };

    const styles = {
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
        content: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
        input: { width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
        btn: { padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', margin: '0 5px', color: 'white' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' },
        th: { backgroundColor: '#ecf0f1', padding: '10px', textAlign: 'left' },
        td: { padding: '10px', borderBottom: '1px solid #eee' }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.content}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <h2 style={{margin:0}}>👥 Daftar & Kelola Staff</h2>
                    <button onClick={onClose} style={{border:'none', background:'none', fontSize:'20px', cursor:'pointer'}}>❌</button>
                </div>
                
                <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginTop: '15px'}}>
                    <h4 style={{margin:0}}>{isEditing ? '✏️ Edit Staff' : '➕ Tambah Staff Baru'}</h4>
                    <form onSubmit={handleSubmit} style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'flex-end', marginTop:'10px'}}>
                        <div style={{flex:1}}><small>Nama</small><input required style={styles.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                        <div style={{flex:1}}><small>Email</small><input required type="email" style={styles.input} value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                        <div style={{flex:1}}><small>Pass</small><input type="text" placeholder={isEditing?"(Opsional)":"Wajib"} style={styles.input} value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
                        <div style={{width:'80px'}}><small>Role</small>
                            <select style={{...styles.input, height:'35px'}} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                                <option value="user">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" style={{...styles.btn, backgroundColor: isEditing?'#f39c12':'#27ae60', height:'35px'}}>Simpan</button>
                        {isEditing && <button type="button" onClick={()=>{setIsEditing(false); setForm({id:null, name:'', email:'', password:'', role:'user'})}} style={{...styles.btn, backgroundColor:'#95a5a6', height:'35px'}}>Batal</button>}
                    </form>
                </div>

                <table style={styles.table}>
                    <thead><tr><th style={styles.th}>Nama</th><th style={styles.th}>Email</th><th style={styles.th}>Role</th><th style={styles.th}>Aksi</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td style={styles.td}>{u.name}</td>
                                <td style={styles.td}>{u.email}</td>
                                <td style={styles.td}>{u.role}</td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEditClick(u)} style={{...styles.btn, backgroundColor: '#f39c12'}}>Edit</button>
                                    <button onClick={() => onDelete(u.id)} style={{...styles.btn, backgroundColor: '#c0392b'}}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}