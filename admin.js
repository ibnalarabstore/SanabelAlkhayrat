const { useState, useEffect } = React;

// ==========================================
// ⚠️ مفاتيحك الخاصة
// ==========================================
const IMGBB_API_KEY = "99bf37915afe5bdef0be905ae32d82fd";
const FIREBASE_PROJECT_ID = "sanabel-alkhayrat";
const FIREBASE_API_KEY = "AIzaSyDD8eWkJjQAvsfIE1bBN7dsx9pjOxHMcuI";
const ADMIN_PASSWORD = "sanabel2024";

const CATEGORIES = [
  "مواد غذائية", "ألبان وأجبان", "لحوم ودواجن", "خضار وفواكه", 
  "مخبوزات", "معلبات", "مشروبات", "مياه وعصائر", "قهوة وشاي", 
  "بهارات وتوابل", "زيوت وسمن", "أرز وحبوب", "معكرونة ونودلز", 
  "حلويات وسكاكر", "مكسرات", "وجبات خفيفة", "منظفات", 
  "أدوات منزلية", "عناية شخصية", "مستلزمات أطفال", "أخرى"
];

function AdminApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    const [name, setName] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [inStock, setInStock] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products?key=${FIREBASE_API_KEY}`);
            const data = await res.json();
            if (data.documents) {
                const fetched = data.documents.map(doc => ({
                    id: doc.name.split('/').pop(),
                    name: doc.fields.name?.stringValue || "",
                    category: doc.fields.category?.stringValue || "",
                    price: parseFloat(doc.fields.price?.doubleValue || doc.fields.price?.integerValue || 0),
                    imageUrl: doc.fields.imageUrl?.stringValue || "",
                    description: doc.fields.description?.stringValue || "",
                    inStock: doc.fields.inStock?.booleanValue ?? true
                }));
                setProducts(fetched.reverse());
            }
        } catch (err) {
            console.error("خطأ في الجلب:", err);
            alert("حدث خطأ أثناء جلب المنتجات");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isLoggedIn) loadProducts();
    }, [isLoggedIn]);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (data.success) return data.data.url;
        throw new Error("فشل رفع الصورة");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name || !price) return alert("الاسم والسعر مطلوبان");
        
        setSubmitting(true);
        try {
            let finalImageUrl = editingId ? products.find(p => p.id === editingId).imageUrl : "";

            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile);
            } else if (!finalImageUrl) {
                alert("الرجاء اختيار صورة");
                setSubmitting(false);
                return;
            }

            const productData = {
                fields: {
                    name: { stringValue: name },
                    category: { stringValue: category },
                    price: { doubleValue: Number(price) },
                    description: { stringValue: description },
                    imageUrl: { stringValue: finalImageUrl },
                    inStock: { booleanValue: inStock }
                }
            };

            let url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products`;
            let method = "POST";

            if (editingId) {
                url += `/${editingId}?updateMask.fieldPaths=name&updateMask.fieldPaths=category&updateMask.fieldPaths=price&updateMask.fieldPaths=description&updateMask.fieldPaths=imageUrl&updateMask.fieldPaths=inStock`;
                method = "PATCH";
            }

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData)
            });

            if (!res.ok) throw new Error("فشل الحفظ في قاعدة البيانات");

            alert(editingId ? "تم تعديل المنتج بنجاح" : "تمت إضافة المنتج بنجاح");
            resetForm();
            loadProducts();
        } catch (err) {
            console.error(err);
            alert("حدث خطأ: " + err.message);
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        try {
            await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products/${id}?key=${FIREBASE_API_KEY}`, {
                method: "DELETE"
            });
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert("فشل الحذف");
        }
    };

    const resetForm = () => {
        setName(""); setPrice(""); setDescription(""); setInStock(true); 
        setImageFile(null); setEditingId(null); setShowForm(false);
    };

    const handleEditClick = (product) => {
        setName(product.name);
        setCategory(product.category);
        setPrice(product.price.toString());
        setDescription(product.description);
        setInStock(product.inStock);
        setEditingId(product.id);
        setShowForm(true);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center text-green-700 mb-6">🔒 دخول لوحة التحكم</h2>
                    <form onSubmit={(e) => { e.preventDefault(); if(password === ADMIN_PASSWORD) setIsLoggedIn(true); else alert("كلمة المرور خاطئة"); }}>
                        <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 font-bold">دخول</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <header className="bg-green-700 text-white py-4 shadow-lg">
                <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
                    <h1 className="text-xl font-bold">🌾 لوحة التحكم</h1>
                    <div className="flex gap-2">
                        <a href="index.html" className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-500">عرض المتجر</a>
                        <button onClick={() => setIsLoggedIn(false)} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-500">خروج</button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">المنتجات ({products.length})</h2>
                    <button onClick={() => setShowForm(true)} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 font-bold">➕ إضافة منتج</button>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg my-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{editingId ? "تعديل منتج" : "إضافة منتج جديد"}</h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">صورة المنتج</label>
                                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full text-sm text-gray-700 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-green-100 file:text-green-800" />
                                </div>
                                <input type="text" placeholder="اسم المنتج *" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500" required />
                                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input type="number" step="0.01" placeholder="السعر ($) *" value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500" required />
                                <textarea placeholder="الوصف (اختياري)" value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg px-4 py-2"></textarea>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="stock" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-4 h-4" />
                                    <label htmlFor="stock" className="text-sm font-bold text-gray-700">متوفر في المخزون</label>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={submitting} className="flex-1 bg-green-700 text-white py-2 rounded-lg font-bold hover:bg-green-800 disabled:opacity-50">{submitting ? "جاري الحفظ..." : "حفظ"}</button>
                                    <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400">إلغاء</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {loading ? (
                    <p className="text-center text-gray-500 py-10">جاري التحميل...</p>
                ) : products.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow text-center text-gray-500">لا توجد منتجات بعد. اضغط "إضافة منتج" للبدء.</div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-3">الصورة</th>
                                    <th className="p-3">الاسم</th>
                                    <th className="p-3">التصنيف</th>
                                    <th className="p-3">السعر</th>
                                    <th className="p-3">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3"><img src={p.imageUrl} className="w-12 h-12 object-cover rounded" /></td>
                                        <td className="p-3 font-semibold text-gray-800">{p.name}</td>
                                        <td className="p-3 text-sm text-gray-600">{p.category}</td>
                                        <td className="p-3 font-bold text-green-700">{p.price.toFixed(2)} $</td>
                                        <td className="p-3 flex gap-2">
                                            <button onClick={() => handleEditClick(p)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">تعديل</button>
                                            <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">حذف</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
