const { useState, useEffect, useMemo } = React;

// ================== الإعدادات ==================
const FIREBASE_PROJECT_ID = "sanabel-alkhayrat";
const FIREBASE_API_KEY = "AIzaSyDD8eWkJjQAvsfIE1bBN7dsx9pjOxHMcuI";
const WHATSAPP_LINK ="https://chat.whatsapp.com/LiFBjhAbWjs71K29vHS4CC?s=cl&p=a&iam=2"  👈 ضع رابط مجموعتك هون
const CURRENCY = "ل.ل"; // العملة اللبنانية

const CATEGORIES = [
  "مواد غذائية", "ألبان وأجبان", "لحوم ودواجن", "خضار وفواكه", 
  "مخبوزات", "معلبات", "مشروبات", "مياه وعصائر", "قهوة وشاي", 
  "بهارات وتوابل", "زيوت وسمن", "أرز وحبوب", "معكرونة ونودلز", 
  "حلويات وسكاكر", "مكسرات", "وجبات خفيفة", "منظفات", 
  "أدوات منزلية", "عناية شخصية", "مستلزمات أطفال", "أخرى"
];

// ================== بطاقة تفاصيل المنتج ==================
function ProductModal({ product, onClose }) {
    if (!product) return null;
    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* زر الإغلاق */}
                <button 
                    onClick={onClose}
                    className="absolute top-3 left-3 bg-white/90 hover:bg-red-500 hover:text-white w-10 h-10 rounded-full font-bold text-xl shadow-lg z-10"
                >×</button>

                {/* صورة كاملة */}
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center p-3">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>

                {/* التفاصيل */}
                <div className="p-5">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                        {product.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                    
                    {product.description && (
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                            {product.description}
                        </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <span className="text-3xl font-black text-red-600">
                            {product.price.toLocaleString('ar-LB')} <span className="text-base">{CURRENCY}</span>
                        </span>
                        {product.inStock ? (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">✓ متوفر</span>
                        ) : (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">✗ غير متوفر</span>
                        )}
                    </div>

                    <a 
                        href={WHATSAPP_LINK}
                        target="_blank"
                        className="mt-4 block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl"
                    >
                        اطلب عبر واتساب 💬
                    </a>
                </div>
            </div>
        </div>
    );
}

// ================== التطبيق الرئيسي ==================
function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("الكل");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products?key=${FIREBASE_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                if (data.documents) {
                    const fetched = data.documents.map(doc => ({
                        id: doc.name.split('/').pop(),
                        name: doc.fields.name?.stringValue || "",
                        category: doc.fields.category?.stringValue || "",
                        price: parseFloat(doc.fields.price?.doubleValue || doc.fields.price?.integerValue || 0),
                        imageUrl: doc.fields.imageUrl?.stringValue || "https://via.placeholder.com/400",
                        description: doc.fields.description?.stringValue || "",
                        inStock: doc.fields.inStock?.booleanValue ?? true
                    }));
                    setProducts(fetched);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = selectedCategory === "الكل" || p.category === selectedCategory;
            const matchMin = minPrice === "" || p.price >= Number(minPrice);
            const matchMax = maxPrice === "" || p.price <= Number(maxPrice);
            return matchSearch && matchCategory && matchMin && matchMax;
        });
    }, [products, searchTerm, selectedCategory, minPrice, maxPrice]);

    return (
        <div className="min-h-screen flex flex-col">

            {/* ============ الهيدر ============ */}
            <header className="bg-gradient-to-l from-red-600 to-green-700 text-white shadow-xl sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3 flex items-center gap-3 max-w-7xl">
                    {/* زر القائمة للجوال */}
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-2xl bg-white/20 hover:bg-white/30 w-10 h-10 rounded-lg"
                    >☰</button>

                    {/* اللوغو */}
                    <img 
                        src="sanabel.png" 
                        alt="سنابل الخيرات" 
                        className="h-12 md:h-14 object-contain bg-white rounded-lg p-1"
                    />

                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg md:text-2xl font-black truncate">سنابل الخيرات</h1>
                        <p className="text-xs text-green-100 hidden md:block">للتموين والمواد الغذائية</p>
                    </div>

                    {/* زر واتساب */}
                    <a 
                        href={WHATSAPP_LINK} 
                        target="_blank"
                        className="bg-green-500 hover:bg-green-400 text-white font-bold px-3 md:px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-1"
                    >
                        💬 <span className="hidden md:inline">انضم لجروبنا</span>
                    </a>
                </div>

                {/* شريط البحث */}
                <div className="bg-red-700/90 py-2">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <input 
                            type="text"
                            placeholder="🔍 ابحث عن منتج..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white text-gray-800 rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        />
                    </div>
                </div>
            </header>

            {/* ============ المحتوى ============ */}
            <div className="flex-1 flex container mx-auto max-w-7xl w-full">
                
                {/* القائمة الجانبية (التصنيفات) */}
                <aside className={`
                    fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white shadow-2xl lg:shadow-none
                    transform transition-transform duration-300 overflow-y-auto sidebar-scroll
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4 lg:hidden">
                            <h2 className="font-bold text-lg text-green-700">التصنيفات</h2>
                            <button onClick={() => setSidebarOpen(false)} className="text-2xl text-red-600">×</button>
                        </div>

                        <h2 className="hidden lg:block font-black text-lg text-green-700 mb-3 border-b-2 border-red-500 pb-2">
                            🗂️ التصنيفات
                        </h2>

                        {/* فلتر السعر */}
                        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-bold text-gray-700 mb-2">💰 فلترة بالسعر ({CURRENCY})</p>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    placeholder="من"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-1/2 border rounded px-2 py-1 text-sm"
                                />
                                <input 
                                    type="number" 
                                    placeholder="إلى"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-1/2 border rounded px-2 py-1 text-sm"
                                />
                            </div>
                            {(minPrice || maxPrice) && (
                                <button 
                                    onClick={() => {setMinPrice(""); setMaxPrice("");}}
                                    className="text-xs text-red-600 mt-1 hover:underline"
                                >مسح الفلتر</button>
                            )}
                        </div>

                        {/* أزرار التصنيفات */}
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => { setSelectedCategory("الكل"); setSidebarOpen(false); }}
                                    className={`w-full text-right px-3 py-2 rounded-lg text-sm font-bold transition ${
                                        selectedCategory === "الكل" 
                                        ? "bg-green-700 text-white" 
                                        : "hover:bg-green-50 text-gray-700"
                                    }`}
                                >
                                    🛒 كل المنتجات
                                </button>
                            </li>
                            {CATEGORIES.map(cat => (
                                <li key={cat}>
                                    <button
                                        onClick={() => { setSelectedCategory(cat); setSidebarOpen(false); }}
                                        className={`w-full text-right px-3 py-2 rounded-lg text-sm transition ${
                                            selectedCategory === cat 
                                            ? "bg-green-700 text-white font-bold" 
                                            : "hover:bg-green-50 text-gray-700"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* خلفية معتمة لما القائمة مفتوحة على الجوال */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* شبكة المنتجات */}
                <main className="flex-1 p-4">
                    <div className="mb-3 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800">
                            {selectedCategory === "الكل" ? "كل المنتجات" : selectedCategory}
                        </h2>
                        <span className="text-xs text-gray-500">{filteredProducts.length} منتج</span>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500 py-20">جاري التحميل...</p>
                    ) : filteredProducts.length === 0 ? (
                        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
                            لا توجد منتجات مطابقة
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                            {filteredProducts.map(product => (
                                <div 
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer overflow-hidden group border-2 border-transparent hover:border-green-600"
                                >
                                    {/* صورة كاملة بغض النظر عن الأبعاد */}
                                    <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-2 overflow-hidden">
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-2 md:p-3">
                                        <h3 className="font-bold text-gray-800 text-xs md:text-sm line-clamp-2 min-h-[2.5rem]">
                                            {product.name}
                                        </h3>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm md:text-base font-black text-red-600">
                                                {product.price.toLocaleString('ar-LB')} <span className="text-[10px]">{CURRENCY}</span>
                                            </span>
                                            {product.inStock ? (
                                                <span className="w-2 h-2 bg-green-500 rounded-full" title="متوفر"></span>
                                            ) : (
                                                <span className="w-2 h-2 bg-red-500 rounded-full" title="غير متوفر"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* ============ الفوتر ============ */}
            <footer className="bg-gradient-to-l from-red-600 to-green-700 text-white text-center py-4 mt-6">
                <p className="text-sm">© {new Date().getFullYear()} سنابل الخيرات — جميع الحقوق محفوظة</p>
            </footer>

            {/* ============ بطاقة تفاصيل المنتج ============ */}
            <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
