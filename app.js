const { useState, useEffect } = React;

function App() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("الكل");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const categories = ["مواد غذائية", "ألبان وأجبان", "لحوم ودواجن", "خضار وفواكه", "مخبوزات", "معلبات", "مشروبات", "منظفات"];

    // جلب البيانات من Firebase (هنستخدم REST API عشان ما نعقد الأمور)
    useEffect(() => {
        const projectId = "sanabel-alkhayrat";
        fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products`)
            .then(res => res.json())
            .then(data => {
                if(data.documents) {
                    const fetchedProducts = data.documents.map(doc => {
                        const fields = doc.fields;
                        return {
                            id: doc.name.split('/').pop(),
                            name: fields.name?.stringValue || "",
                            category: fields.category?.stringValue || "",
                            price: parseFloat(fields.price?.doubleValue || fields.price?.integerValue || 0),
                            imageUrl: fields.imageUrl?.stringValue || "https://via.placeholder.com/400",
                            description: fields.description?.stringValue || "",
                            inStock: fields.inStock?.booleanValue ?? true
                        };
                    });
                    setProducts(fetchedProducts);
                }
            })
            .catch(err => console.error("خطأ في جلب البيانات:", err));
    }, []);

    // فلترة المنتجات
    const filteredProducts = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory === "الكل" || p.category === selectedCategory;
        const matchMin = minPrice === "" || p.price >= Number(minPrice);
        const matchMax = maxPrice === "" || p.price <= Number(maxPrice);
        return matchSearch && matchCategory && matchMin && matchMax;
    });

    return (
        <div className="min-h-screen">
            <header className="bg-green-700 text-white py-6 shadow-lg text-center">
                <h1 className="text-3xl font-bold">🌾 سنابل الخيرات</h1>
                <p className="text-green-100 mt-2">للتموين والمواد الغذائية</p>
                <a href="admin.html" className="inline-block mt-3 bg-green-800 px-4 py-1 rounded text-sm hover:bg-green-900">لوحة التحكم</a>
            </header>

            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* شريط الفلاتر */}
                <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
                    <input type="text" placeholder="🔍 ابحث عن منتج..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="الكل">كل التصنيفات</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="number" placeholder="السعر من..." value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="border rounded-lg px-4 py-2" />
                        <input type="number" placeholder="السعر إلى..." value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="border rounded-lg px-4 py-2" />
                    </div>
                </div>

                {/* شبكة المنتجات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500 py-10">لا توجد منتجات لعرضها.</p>
                    ) : (
                        filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{product.category}</span>
                                    <h3 className="font-bold text-gray-800 text-lg mt-2">{product.name}</h3>
                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="text-xl font-bold text-green-700">{product.price.toFixed(2)} $</span>
                                        {product.inStock ? <span className="text-xs text-green-600 font-semibold">✓ متوفر</span> : <span className="text-xs text-red-600 font-semibold">✗ غير متوفر</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
