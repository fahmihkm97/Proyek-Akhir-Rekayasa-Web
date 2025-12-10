import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

// Import Komponen
import StaffModal from '../components/StaffModal';
import HistoryModal from '../components/HistoryModal';
import TransactionModal from '../components/TransactionModal';
import ProductModal from '../components/ProductModal';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]); 
    const [history, setHistory] = useState([]); 
    
    // State Modal UI
    const [showModal, setShowModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    
    // State Transaksi Sementara
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [trxType, setTrxType] = useState('in');

    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');

    // --- API CALLS ---
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(Array.isArray(response.data) ? response.data : response.data.data);
        } catch (err) { if (err.response?.status === 401) navigate('/'); }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
            setShowUserModal(true); 
        } catch (err) { alert('Gagal mengambil data staff.'); }
    };

    const fetchHistory = async () => {
        try {
            const response = await api.get('/transactions');
            setHistory(response.data.filter(item => item.type === 'out'));
            setShowHistoryModal(true);
        } catch (err) { alert('Gagal ambil data riwayat'); }
    };

    // --- HANDLERS (LOGIKA BISNIS) ---
    
    const handleStaffSave = async (formData, isEditing) => {
        try {
            if (isEditing) await api.put(`/users/${formData.id}`, formData);
            else await api.post('/users', formData);
            
            alert(isEditing ? 'Staff diperbarui!' : 'Staff ditambahkan!');
            const res = await api.get('/users'); // Refresh list
            setUsers(res.data);
        } catch (err) { alert('Gagal menyimpan staff'); }
    };

    const handleStaffDelete = async (id) => {
        if (window.confirm("Yakin hapus staff ini?")) {
            await api.delete(`/users/${id}`);
            const res = await api.get('/users');
            setUsers(res.data);
        }
    };

    const handleTransactionSubmit = async (qty, notes) => {
        try {
            await api.post('/transactions', { product_id: selectedProduct.id, type: trxType, quantity: qty, notes: notes });
            alert('Transaksi Berhasil!');
            setShowModal(false);
            fetchProducts();
        } catch (err) { alert('Transaksi Gagal'); }
    };

    const handleHistoryDelete = async (id) => {
        if (window.confirm("Hapus riwayat? Stok akan dikembalikan.")) {
            await api.delete(`/transactions/${id}`);
            fetchHistory(); 
            fetchProducts();
        }
    };

    const handleHistoryUpdateNote = async (id, newNote) => {
        try {
            await api.put(`/transactions/${id}`, { notes: newNote });
            fetchHistory();
        } catch (err) { alert('Gagal update catatan'); }
    };

    const handleProductSave = async (newProduct) => {
        try {
            await api.post('/products', newProduct);
            alert('Produk ditambahkan!');
            setShowProductModal(false);
            fetchProducts();
        } catch (err) { alert('Gagal tambah produk'); }
    };

    const handleProductDelete = async (id) => {
        if (window.confirm("Hapus produk permanen?")) {
            await api.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    const handleLogout = async () => {
        await api.post('/logout');
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => { fetchProducts(); }, []);

    // --- MAIN RENDER ---
    const styles = {
        container: { backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '20px 30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
        title: { margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: 'bold' },
        btn: { padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', margin: '0 5px', color: 'white' },
        tableContainer: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { backgroundColor: '#3498db', color: 'white', padding: '10px', textAlign: 'left' },
        td: { padding: '10px', borderBottom: '1px solid #eee' }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>📦 Dashboard {userRole === 'admin' ? '(Admin)' : '(Staff)'}</h1>
                <div>
                    {userRole === 'admin' && (
                        <>
                            <button onClick={() => setShowProductModal(true)} style={{...styles.btn, backgroundColor: '#27ae60'}}>+ Produk</button>
                            <button onClick={fetchUsers} style={{...styles.btn, backgroundColor: '#8e44ad'}}>👥 Kelola Staff</button>
                        </>
                    )}
                    <button onClick={fetchHistory} style={{...styles.btn, backgroundColor: '#e67e22'}}>📋 Riwayat Keluar</button>
                    <button onClick={handleLogout} style={{...styles.btn, backgroundColor: '#e74c3c'}}>Logout</button>
                </div>
            </div>

            {/* Main Table */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>SKU</th>
                            <th style={styles.th}>Nama Barang</th>
                            <th style={styles.th}>Stok</th>
                            {userRole === 'admin' && <th style={styles.th}>Harga</th>}
                            <th style={styles.th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p, i) => (
                            <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                                <td style={styles.td}>{p.sku}</td>
                                <td style={{...styles.td, fontWeight: 'bold'}}>{p.name}</td>
                                <td style={{...styles.td, color: p.stock < 10 ? 'red' : 'green'}}>{p.stock} Unit</td>
                                {userRole === 'admin' && <td style={styles.td}>Rp {parseFloat(p.price).toLocaleString('id-ID')}</td>}
                                <td style={styles.td}>
                                    <button onClick={() => { setSelectedProduct(p); setTrxType('in'); setShowModal(true); }} style={{...styles.btn, backgroundColor: '#27ae60'}}>+ Masuk</button>
                                    <button onClick={() => { setSelectedProduct(p); setTrxType('out'); setShowModal(true); }} style={{...styles.btn, backgroundColor: '#e67e22'}}>- Keluar</button>
                                    {userRole === 'admin' && <button onClick={() => handleProductDelete(p.id)} style={{...styles.btn, backgroundColor: '#c0392b'}}>Hapus</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- CHILD COMPONENTS (MODALS) --- */}
            
            <StaffModal 
                isOpen={showUserModal} 
                onClose={() => setShowUserModal(false)} 
                users={users} 
                onSave={handleStaffSave} 
                onDelete={handleStaffDelete} 
            />

            <HistoryModal 
                isOpen={showHistoryModal} 
                onClose={() => setShowHistoryModal(false)} 
                history={history} 
                onDelete={handleHistoryDelete} 
                onUpdateNote={handleHistoryUpdateNote} 
                onAddClick={() => { setShowHistoryModal(false); alert("Pilih produk di tabel utama untuk transaksi baru."); }}
            />

            <TransactionModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                type={trxType} 
                productName={selectedProduct?.name} 
                onSubmit={handleTransactionSubmit} 
            />

            <ProductModal 
                isOpen={showProductModal} 
                onClose={() => setShowProductModal(false)} 
                onSave={handleProductSave} 
            />
        </div>
    );
}