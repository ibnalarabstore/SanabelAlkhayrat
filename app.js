const { useState, useEffect, useMemo } = React;

// ================== الإعدادات ==================
const FIREBASE_PROJECT_ID = "sanabel-alkhayrat";
const FIREBASE_API_KEY = "AIzaSyDD8eWkJjQAvsfIE1bBN7dsx9pjOxHMcuI";
const WHATSAPP_LINK = "https://chat.whatsapp.com/LiFBjhAbWjs71K29vHS4CC?s=cl&p=a&iam=2";
const CURRENCY = "ل.ل";

const CATEGORIES = [
  "مواد غذائية", "ألبان وأجبان", "لحوم ودواجن", "خضار وفواكه", 
  "مخبوزات", "معلبات", "مشروبات", "مياه وعصائر", "قهوة وشاي", 
  "بهارات وتوابل", "زيوت وسمن", "أرز وحبوب", "معكرونة ونودلز", 
  "حلويات وسكاكر", "مكسرات", "وجبات خفيفة", "منظفات", 
  "أدوات منزلية", "عناية شخصية", "مستلزمات أطفال", "أخرى"
];

// أيقونة واتساب SVG حقيقية
const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

// ================== بطاقة تفاصيل المنتج (Modal) ==================
function ProductModal({ product, onClose }) {
    if (!product) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
            <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh] animate-[fadeIn_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm hover:bg-red-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10 transition-colors"
                >×</button>

                <div className="w-full h-72 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
                    <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-start mb-2">
                        <span className="inline-block bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                            {product.category}
                        </span>
                        {product.inStock ? (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> متوفر</span>
                        ) : (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> غير متوفر</span>
                        )}
                    </div>

                    <h2 className="text-2xl font-black text-gray-800 leading-tight">{product.name}</h2>
                    
                    {product.description && (
                        <p className="text-gray-500 mt-3 text-sm leading-relaxed">{product.description}</p>
                    )}

                    <div className="mt-6 bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                        <span className="text-sm text-gray-500 font-bold">السعر</span>
                        <span className="text-3xl font-black text-red-600 tracking-tight">
                            {product.price.toLocaleString('ar-LB')} <span className="text-lg text-red-400 font-bold">{CURRENCY}</span>
                        </span>
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <a 
                        href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                        className="wa-btn w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-lg"
                    >
                        <WhatsAppIcon className="w-6 h-6" /> اطلب عبر واتساب
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
                        imageUrl: doc.fields.imageUrl?.stringValue || "",
                        description: doc.fields.description?.stringValue || "",
                        inStock: doc.fields.inStock?.booleanValue ?? true
                    }));
                    setProducts(fetched);
                }
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
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
        <div className="min-h-screen flex flex-col font-sans">
            {/* 1. الشريط العلوي الفخم */}
            <div className="bg-green-900 text-green-100 text-xs py-2 text-center font-semibold tracking-wider">
                🚚 توصيل سريع لجميع المناطق | جودة مضمونة 100%
            </div>

            {/* 2. الهيدر الرئيسي */}
            <header className="bg-white shadow-sm sticky top-0 z-40 border-b-2 border-red-600">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center justify-between py-3 gap-4">
                        
                        {/* الشعار والقائمة */}
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-2xl text-gray-700 hover:text-green-700 p-2 rounded-lg bg-gray-50">
                                ☰
                            </button>
                            <a href="#" className="flex items-center gap-3">
                                <img src="sanabel.png" alt="سنابل الخيرات" className="h-14 w-auto object-contain" />
                                <div className="hidden sm:block">
                                    <h1 className="text-2xl font-black text-green-800 leading-none">سنابل الخيرات</h1>
                                    <p className="text-xs text-gray-500 mt-1 font-semibold">للتموين والمواد الغذائية</p>
                                </div>
                            </a>
                        </div>

                        {/* حقل البحث (وسط الهيدر) */}
                        <div className="hidden md:flex flex-1 max-w-xl relative">
                            <input 
                                type="text" placeholder="ابحث عن منتج، ماركة، أو تصنيف..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-100 border-2 border-transparent focus:border-green-500 rounded-full px-6 py-2.5 text-sm focus:outline-none transition-colors text-black"
                            />
                            <span className="absolute left-4 top-3 text-gray-400">🔍</span>
                        </div>

                        {/* زر الواتساب */}
                        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" 
                           className="wa-btn flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-full text-sm">
                            <WhatsAppIcon className="w-5 h-5" />
                            <span className="hidden lg:inline">انضم لمجموعتنا</span>
                        </a>
                    </div>

                    {/* حقل البحث للموبايل */}
                    <div className="md:hidden pb-3 relative">
                         <input 
                            type="text" placeholder="ابحث عن منتج..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-transparent focus:border-green-500 rounded-full px-5 py-2 text-sm focus:outline-none text-black"
                        />
                        <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
                    </div>
                </div>
            </header>

            {/* 3. المحتوى الرئيسي */}
            <div className="flex-1 flex container mx-auto max-w-7xl w-full relative">
                
                {/* القائمة الجانبية */}
                <aside className={`
                    fixed lg:sticky top-[73px] lg:top-[120px] h-[calc(100vh-73px)] lg:h-[calc(100vh-120px)] inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-100 shadow-2xl lg:shadow-none
                    transform transition-transform duration-300 overflow-y-auto sidebar-scroll
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-5 lg:hidden">
                            <h2 className="font-bold text-lg text-gray-800">القائمة</h2>
                            <button onClick={() => setSidebarOpen(false)} className="text-2xl text-gray-500 hover:text-red-500">×</button>
                        </div>

                        <h2 className="hidden lg:flex items-center gap-2 font-black text-gray-800 mb-4 text-lg">
                            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block"></span> التصنيفات
                        </h2>

                        {/* فلتر السعر */}
                        <div className="mb-6 bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1">💰 فلترة السعر</p>
                            <div className="flex gap-2 items-center">
                                <input type="number" placeholder="من" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-black focus:outline-none focus:border-green-500" />
                                <span className="text-gray-400">-</span>
                                <input type="number" placeholder="إلى" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-black focus:outline-none focus:border-green-500" />
                            </div>
                            {(minPrice || maxPrice) && (
                                <button onClick={() => {setMinPrice(""); setMaxPrice("");}} className="text-xs text-red-600 mt-3 w-full bg-red-50 py-1.5 rounded font-bold hover:bg-red-100 transition">إلغاء الفلتر</button>
                            )}
                        </div>

                        {/* أزرار التصنيفات */}
                        <ul className="space-y-1.5">
                            <li>
                                <button onClick={() => { setSelectedCategory("الكل"); setSidebarOpen(false); }}
                                    className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        selectedCategory === "الكل" ? "bg-green-700 text-white shadow-md shadow-green-200" : "hover:bg-gray-50 text-gray-600"}`}>
                                    🛍️ كل المنتجات
                                </button>
                            </li>
                            {CATEGORIES.map(cat => (
                                <li key={cat}>
                                    <button onClick={() => { setSelectedCategory(cat); setSidebarOpen(false); }}
                                        className={`w-full text-right px-4 py-2.5 rounded-xl text-sm transition-all ${
                                            selectedCategory === cat ? "bg-green-700 text-white font-bold shadow-md shadow-green-200" : "hover:bg-gray-50 text-gray-600 hover:text-green-700"}`}>
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* غطاء اسود للجوال */}
                {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

                {/* شبكة المنتجات */}
                <main className="flex-1 p-4 md:p-6 w-full overflow-hidden">
                    <div className="mb-5 flex justify-between items-end border-b pb-3 border-gray-200">
                        <h2 className="font-black text-2xl text-gray-800">
                            {selectedCategory === "الكل" ? "أحدث المنتجات" : selectedCategory}
                        </h2>
                        <span className="text-sm text-gray-500 font-semibold bg-white px-3 py-1 rounded-full border border-gray-200">{filteredProducts.length} منتج</span>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 flex flex-col items-center">
                            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-100 border-t-green-600 mb-4"></div>
                            <p className="text-gray-500 font-bold">جاري تحضير المتجر...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                            <span className="text-6xl mb-4 opacity-50">🔍</span>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد منتجات</h3>
                            <p className="text-gray-500">لم نتمكن من العثور على منتجات تطابق بحثك.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                            {filteredProducts.map(product => (
                                <div key={product.id} onClick={() => setSelectedProduct(product)}
                                    className="product-card bg-white rounded-2xl overflow-hidden cursor-pointer group flex flex-col border border-gray-100">
                                    
                                    {/* الصورة */}
                                    <div className="relative w-full aspect-square bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
                                        <img src={product.imageUrl} alt={product.name} 
                                             className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                        
                                        {!product.inStock && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg transform -rotate-12">نفدت الكمية</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* التفاصيل */}
                                    <div className="p-3 md:p-4 flex-1 flex flex-col justify-between border-t border-gray-50">
                                        <div>
                                            <p className="text-[10px] md:text-xs text-green-600 font-bold mb-1">{product.category}</p>
                                            <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 leading-snug group-hover:text-green-700 transition-colors">
                                                {product.name}
                                            </h3>
                                        </div>
                                        
                                        <div className="mt-3 flex items-end justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 line-through">{(product.price * 1.2).toLocaleString('ar-LB')} {CURRENCY}</span>
                                                <span className="text-base md:text-xl font-black text-red-600 leading-none">
                                                    {product.price.toLocaleString('ar-LB')} <span className="text-xs">{CURRENCY}</span>
                                                </span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                                +
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* الفوتر */}
            <footer className="bg-gray-900 text-gray-400 py-10 mt-10 text-center text-sm">
                <div className="container mx-auto px-4">
                    <p className="mb-2 font-bold text-white text-lg">سنابل الخيرات</p>
                    <p>© {new Date().getFullYear()} جميع الحقوق محفوظة. صُنع بحب 💚</p>
                </div>
            </footer>

            <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
