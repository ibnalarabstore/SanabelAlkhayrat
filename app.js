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

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

// ================== بطاقة تفاصيل المنتج ==================
function ProductModal({ product, onClose }) {
    if (!product) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop" onClick={onClose}>
            <div className="bg-white w-full max-w-lg sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh] animate-[slideUp_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 left-4 bg-white/80 backdrop-blur-md hover:bg-red-50 hover:text-red-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-sm z-10 transition">×</button>
                <div className="w-full h-[40vh] sm:h-80 bg-gray-50 flex items-center justify-center p-6 relative">
                    <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-xl" />
                </div>
                <div className="p-6 flex-1 overflow-y-auto bg-white rounded-t-3xl -mt-6 relative z-10">
                    <div className="flex justify-between items-center mb-3">
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-100">{product.category}</span>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${product.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            {product.inStock ? 'متوفر بالمخزون' : 'غير متوفر حالياً'}
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{product.name}</h2>
                    {product.description && <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>}
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100 mb-6">
                        <span className="text-sm text-gray-500 font-bold">السعر الإجمالي</span>
                        <span className="text-3xl font-black text-emerald-600">
                            {product.price.toLocaleString('ar-LB')} <span className="text-sm font-bold text-emerald-500">{CURRENCY}</span>
                        </span>
                    </div>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-green-200">
                        <WhatsAppIcon className="w-6 h-6" /> اطلب الآن عبر واتساب
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
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            
            {/* 1. الهيدر الفخم */}
            <header className="bg-gradient-to-l from-emerald-800 to-emerald-950 shadow-2xl sticky top-0 z-40">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-4 gap-4">
                        
                        {/* ✨ الشعار + أزرار الموبايل */}
                        <div className="flex items-center justify-between w-full md:w-auto gap-3">
                            <a href="#" className="flex items-center gap-3">
                                {/* اللوغو الدائري الجديد */}
                                <img 
                                    src="sanabel.png" 
                                    alt="سنابل الخيرات" 
                                    className="h-12 md:h-14 w-12 md:w-14 rounded-full object-cover logo-ring bg-white" 
                                />
                                <div className="hidden sm:block">
                                    <h1 className="text-white font-black text-xl leading-tight">سنابل الخيرات</h1>
                                    <p className="text-emerald-200 text-xs">للتموين والمواد الغذائية</p>
                                </div>
                            </a>

                            {/* 📱 أزرار الموبايل: واتساب + قائمة */}
                            <div className="flex md:hidden items-center gap-2">
                                <a 
                                    href={WHATSAPP_LINK} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-lg"
                                    aria-label="انضم لمجموعة الواتساب"
                                >
                                    <WhatsAppIcon className="w-5 h-5" />
                                </a>
                                <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center text-white bg-white/10 rounded-full hover:bg-white/20 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                </button>
                            </div>
                        </div>

                        {/* البحث (وسط الهيدر) */}
                        <div className="w-full md:max-w-2xl relative group">
                            <input 
                                type="text" placeholder="ابحث عن منتج..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/10 text-white placeholder-emerald-100/70 border border-emerald-500/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all shadow-inner"
                            />
                            <svg className="w-5 h-5 absolute left-4 top-3.5 text-emerald-300 group-focus-within:text-gray-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>

                        {/* زر الواتساب للكمبيوتر */}
                        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" 
                           className="hidden md:flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-green-900/50">
                            <WhatsAppIcon className="w-5 h-5" />
                            <span>تواصل معنا</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* 2. شريط التصنيفات الأفقي (للجوال) */}
            <div className="md:hidden overflow-x-auto bg-white border-b border-gray-100 shadow-sm sticky top-[73px] z-30 hide-scrollbar">
                <div className="flex px-4 py-3 gap-2 w-max">
                    <button onClick={() => setSelectedCategory("الكل")} className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === "الكل" ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600'}`}>الكل</button>
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === c ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600'}`}>{c}</button>
                    ))}
                </div>
            </div>

            {/* 3. المحتوى */}
            <div className="flex-1 container mx-auto max-w-7xl w-full flex relative pt-4 md:pt-8 gap-6 px-4">
                
                {/* القائمة الجانبية (للكمبيوتر فقط) */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sticky top-28">
                        <h2 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-emerald-600 rounded-full"></span> التصنيفات
                        </h2>
                        <ul className="space-y-1.5 mb-6">
                            <li>
                                <button onClick={() => setSelectedCategory("الكل")} className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCategory === "الكل" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50 text-gray-600"}`}>كل المنتجات</button>
                            </li>
                            {CATEGORIES.map(cat => (
                                <li key={cat}>
                                    <button onClick={() => setSelectedCategory(cat)} className={`w-full text-right px-4 py-2.5 rounded-xl text-sm transition-all ${selectedCategory === cat ? "bg-emerald-50 text-emerald-700 font-bold" : "hover:bg-gray-50 text-gray-600"}`}>{cat}</button>
                                </li>
                            ))}
                        </ul>

                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-sm font-bold text-gray-800 mb-3">فلترة السعر ({CURRENCY})</p>
                            <div className="flex flex-col gap-2">
                                <input type="number" placeholder="أقل سعر" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-black" />
                                <input type="number" placeholder="أعلى سعر" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-black" />
                            </div>
                            {(minPrice || maxPrice) && (
                                <button onClick={() => {setMinPrice(""); setMaxPrice("");}} className="text-xs text-red-600 mt-3 w-full bg-white border border-red-100 py-2 rounded-xl font-bold hover:bg-red-50 transition">مسح الفلتر</button>
                            )}
                        </div>
                    </div>
                </aside>

                {/* شبكة المنتجات */}
                <main className="flex-1 w-full pb-10">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="font-black text-xl md:text-2xl text-gray-900">{selectedCategory === "الكل" ? "تصفح المنتجات" : selectedCategory}</h2>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
                            <p className="text-gray-500">جرب البحث بكلمات أخرى أو تصفح تصنيفاً مختلفاً.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                            {filteredProducts.map(product => (
                                <div key={product.id} onClick={() => setSelectedProduct(product)}
                                    className="p-card bg-white rounded-3xl overflow-hidden cursor-pointer group flex flex-col border border-gray-100 relative">
                                    
                                    <div className="w-full aspect-[4/5] bg-white p-4 flex items-center justify-center relative overflow-hidden">
                                        <img src={product.imageUrl} alt={product.name} className="p-image max-w-full max-h-full object-contain drop-shadow-sm" loading="lazy" />
                                        
                                        {!product.inStock && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">غير متوفر</span>
                                            </div>
                                        )}
                                        
                                        <button className="absolute bottom-3 right-3 w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-emerald-700">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                                        </button>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                                        <div>
                                            <p className="text-[10px] text-emerald-600 font-bold mb-1">{product.category}</p>
                                            <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 leading-snug">{product.name}</h3>
                                        </div>
                                        
                                        <div className="mt-3">
                                            <span className="text-lg md:text-xl font-black text-emerald-800">
                                                {product.price.toLocaleString('ar-LB')} <span className="text-xs text-gray-500 font-bold">{CURRENCY}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* القائمة الجانبية المنبثقة للجوال */}
            {sidebarOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
                    <div className="fixed inset-y-0 right-0 w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="font-black text-lg text-gray-900">القائمة</h2>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 bg-white rounded-full text-gray-500 shadow-sm">×</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                                <p className="text-sm font-bold text-gray-800 mb-3">فلترة السعر</p>
                                <div className="flex flex-col gap-2">
                                    <input type="number" placeholder="أقل سعر" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-black" />
                                    <input type="number" placeholder="أعلى سعر" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-black" />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                {CATEGORIES.map(cat => (
                                    <button key={cat} onClick={() => { setSelectedCategory(cat); setSidebarOpen(false); }} className={`w-full text-right px-4 py-3 rounded-xl text-sm transition-all ${selectedCategory === cat ? "bg-emerald-50 text-emerald-700 font-bold" : "hover:bg-gray-50 text-gray-600"}`}>{cat}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* الفوتر - تم حذف اللوغو */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <p className="text-sm">© {new Date().getFullYear()} سنابل الخيرات للتموين. جميع الحقوق محفوظة.</p>
                </div>
            </footer>

            <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
