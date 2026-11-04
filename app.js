// 1. БАЗА ДАНИХ (Тепер з реальними фотографіями!)
const carsDatabase = [
    { id: 1, make: "BMW", model: "X5 M50d", year: 2023, price: 95000, mileage: 12000, class: "suv", cylinders: 6, transmission: "a", drive: "awd", fuel_type: "diesel", highway_mpg: 30, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Спортивний кросовер у топовій комплектації M-пакет. Ідеальний стан, один власник. Лазерні фари, пневмопідвіска, панорамний дах." },
    { id: 2, make: "BMW", model: "320i", year: 2021, price: 34500, mileage: 45000, class: "sedan", cylinders: 4, transmission: "a", drive: "rwd", fuel_type: "gas", highway_mpg: 36, image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Надійний седан бізнес-класу. Обслуговувався тільки на офіційному сервісі. Apple CarPlay, камера заднього виду." },
    { id: 3, make: "Audi", model: "Q7 S-Line", year: 2022, price: 78000, mileage: 38000, class: "suv", cylinders: 6, transmission: "a", drive: "awd", fuel_type: "diesel", highway_mpg: 28, image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Великий сімейний позашляховик на 7 місць. Матричні фари, доводчики дверей, преміум акустика Bang & Olufsen." },
    { id: 4, make: "Audi", model: "A4", year: 2020, price: 25000, mileage: 98000, class: "sedan", cylinders: 4, transmission: "a", drive: "fwd", fuel_type: "gas", highway_mpg: 34, image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Економічний автомобіль для міста. Стан сів і поїхав. Нова літня гума в подарунок." },
    { id: 5, make: "Toyota", model: "Camry Hybrid", year: 2024, price: 42000, mileage: 1500, class: "sedan", cylinders: 4, transmission: "a", drive: "fwd", fuel_type: "hybrid", highway_mpg: 47, image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Абсолютно нове авто, на гарантії до 2029 року. Дуже економна витрата пального в місті." },
    { id: 6, make: "Toyota", model: "Land Cruiser 300", year: 2023, price: 110000, mileage: 18000, class: "suv", cylinders: 6, transmission: "a", drive: "awd", fuel_type: "diesel", highway_mpg: 20, image: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Легендарна надійність. Броньована плівка по всьому кузову, максимальна комплектація Executive Lounge." },
    { id: 7, make: "Porsche", model: "911 Carrera", year: 2022, price: 135000, mileage: 22000, class: "coupe", cylinders: 6, transmission: "a", drive: "rwd", fuel_type: "gas", highway_mpg: 24, image: "https://images.unsplash.com/photo-1503376760302-8fac2a829e1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Автомобіль вихідного дня. Зберігався виключно в теплому паркінгу. Спортивний вихлоп, карбонові вставки." },
    { id: 8, make: "Porsche", model: "Taycan 4S", year: 2023, price: 105000, mileage: 8000, class: "sedan", cylinders: 0, transmission: "a", drive: "awd", fuel_type: "electricity", highway_mpg: 80, image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Електромобіль майбутнього. Батарея Performance Plus. Запас ходу до 500 км на одному заряді." }
];
// Словники перекладу
const translate = {
    transmission: { 'a': 'Автомат', 'm': 'Механіка' },
    drive: { 'fwd': 'Передній', 'rwd': 'Задній', 'awd': 'Повний 4x4' },
    fuel: { 'gas': 'Бензин', 'diesel': 'Дизель', 'electricity': 'Електро', 'hybrid': 'Гібрид' }
};

// 2. НАВІГАЦІЯ МІЖ СТОРІНКАМИ (SPA логіка)
const pages = document.querySelectorAll('.page-section');
const navLinks = document.querySelectorAll('.nav-link');

function showPage(pageId) {
    pages.forEach(page => page.classList.add('hidden'));
    document.getElementById(`page-${pageId}`).classList.remove('hidden');
    window.scrollTo(0, 0);
    
    // Якщо відкриваємо каталог - одразу фільтруємо, щоб показати актуальний список
    if (pageId === 'catalog') {
        filterCars();
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        showPage(targetPage);
    });
});

// Форматування валюти (€ 34,500)
function formatPrice(price) {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}

// 3. ФІЛЬТРАЦІЯ
function filterCars() {
    const resultsContainer = document.getElementById('results');
    const loader = document.getElementById('loader');
    const countSpan = document.getElementById('results-count');
    
    resultsContainer.innerHTML = '';
    loader.classList.remove('hidden');

    // Зчитуємо всі фільтри
    const makeVal = document.getElementById('filter-make').value.trim().toLowerCase();
    const modelVal = document.getElementById('filter-model').value.trim().toLowerCase();
    
    // Читаємо діапазони
    const priceMin = parseFloat(document.getElementById('filter-price-min').value) || 0;
    const priceMax = parseFloat(document.getElementById('filter-price-max').value) || Infinity;
    
    const yearMin = parseInt(document.getElementById('filter-year-min').value) || 0;
    const yearMax = parseInt(document.getElementById('filter-year-max').value) || 9999;

    const transVal = document.getElementById('filter-transmission').value;
    const fuelVal = document.getElementById('filter-fuel').value;

    const filteredCars = carsDatabase.filter(car => {
        const matchMake = makeVal === '' || car.make.toLowerCase().includes(makeVal);
        const matchModel = modelVal === '' || car.model.toLowerCase().includes(modelVal);
        const matchPrice = car.price >= priceMin && car.price <= priceMax;
        const matchYear = car.year >= yearMin && car.year <= yearMax;
        const matchTrans = transVal === '' || car.transmission === transVal;
        const matchFuel = fuelVal === '' || car.fuel_type === fuelVal;

        return matchMake && matchModel && matchPrice && matchYear && matchTrans && matchFuel;
    });

    setTimeout(() => {
        loader.classList.add('hidden');
        countSpan.textContent = filteredCars.length;
        renderCars(filteredCars);
    }, 300);
}

// 4. ВІДМАЛЬОВКА КАРТОК (в каталозі)
function renderCars(cars) {
    const resultsContainer = document.getElementById('results');
    if (cars.length === 0) {
        resultsContainer.innerHTML = `
            <div class="col-span-full bg-white p-12 rounded-xl border border-gray-200 text-center">
                <i class="fa-solid fa-car-burst text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-700">Немає авто під ці критерії</h3>
                <p class="text-gray-500 mt-2">Спробуйте розширити діапазон ціни або років.</p>
            </div>
        `;
        return;
    }

    cars.forEach(car => {
        const trans = translate.transmission[car.transmission];
        const fuel = translate.fuel[car.fuel_type];
        // Генерація заглушки з текстом назви
        const imgText = `${car.make.toUpperCase()} ${car.model.toUpperCase()}`;
        const imageSrc = `https://placehold.co/800x600/1e293b/FFFFFF?text=${encodeURIComponent(imgText)}&font=montserrat`;

        const card = document.createElement('div');
        card.className = 'car-card bg-white rounded-xl border border-gray-100 shadow-sm';
        
        // При кліку на картку відкриваємо детальну сторінку
        card.onclick = () => showCarDetails(car.id);
        
        card.innerHTML = `
            <div class="car-image-container border-b border-gray-100 relative">
                <img src="${car.image}" alt="${car.make} ${car.model}" loading="lazy">
                <div class="absolute top-3 left-3 bg-white text-slate-800 text-xs font-black px-3 py-1 rounded-full shadow">
                    ${car.year}
                </div>
            </div>
            
            <div class="p-6">
                <h2 class="text-xl font-extrabold text-slate-900 uppercase mb-2 truncate">${car.make} ${car.model}</h2>
                <div class="text-2xl font-black text-blue-600 mb-4">${formatPrice(car.price)}</div>
                
                <div class="grid grid-cols-2 gap-y-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <div class="flex items-center"><i class="fa-solid fa-gauge w-6 text-gray-400"></i> ${car.mileage.toLocaleString('uk-UA')} км</div>
                    <div class="flex items-center"><i class="fa-solid fa-gas-pump w-6 text-gray-400"></i> ${fuel}</div>
                    <div class="flex items-center"><i class="fa-solid fa-gear w-6 text-gray-400"></i> ${trans}</div>
                    <div class="flex items-center"><i class="fa-solid fa-engine w-6 text-gray-400"></i> ${car.cylinders ? car.cylinders + ' цил.' : 'Електро'}</div>
                </div>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// 5. ДЕТАЛЬНА СТОРІНКА АВТОМОБІЛЯ
function showCarDetails(carId) {
    // Знаходимо авто в базі по ID
    const car = carsDatabase.find(c => c.id === carId);
    if(!car) return;

    const container = document.getElementById('car-details-container');
    const trans = translate.transmission[car.transmission];
    const drive = translate.drive[car.drive];
    const fuel = translate.fuel[car.fuel_type];
    
    const liters = car.highway_mpg > 0 ? (235.215 / car.highway_mpg).toFixed(1) + ' л/100км' : '-';
    
    const imgText = `${car.make.toUpperCase()} ${car.model.toUpperCase()}`;
    const imageSrc = `https://placehold.co/1200x800/1e293b/FFFFFF?text=${encodeURIComponent(imgText)}&font=montserrat`;

    container.innerHTML = `
        <button onclick="showPage('catalog')" class="mb-6 text-blue-600 font-bold hover:text-blue-800 transition flex items-center">
            <i class="fa-solid fa-arrow-left mr-2"></i> Повернутися до каталогу
        </button>
        
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div class="md:flex">
                <!-- Ліва частина: Велике фото -->
                <div class="md:w-1/2 bg-slate-800 relative">
                    <img src="${car.image}" alt="${car.make}" class="w-full h-full object-cover min-h-[400px]">
                    <div class="absolute top-4 left-4 bg-blue-600 text-white font-bold px-4 py-1 rounded shadow-lg text-lg">
                        ${car.year}
                    </div>
                </div>
                
                <!-- Права частина: Дані та ціна -->
                <div class="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <h1 class="text-4xl font-black text-slate-900 uppercase mb-2">${car.make} ${car.model}</h1>
                    <p class="text-gray-500 uppercase tracking-widest font-semibold mb-6">${car.class}</p>
                    
                    <div class="text-5xl font-black text-blue-600 mb-8">${formatPrice(car.price)}</div>
                    
                    <p class="text-gray-700 text-lg leading-relaxed mb-8 border-l-4 border-blue-500 pl-4 bg-slate-50 py-3 pr-3">
                        ${car.description}
                    </p>
                    
                    <div class="grid grid-cols-2 gap-6 mb-8 text-slate-700">
                        <div class="flex flex-col border-b border-gray-100 pb-2">
                            <span class="text-xs font-bold text-gray-400 uppercase">Пробіг</span>
                            <span class="font-bold text-lg"><i class="fa-solid fa-gauge text-blue-500 w-5"></i> ${car.mileage.toLocaleString('uk-UA')} км</span>
                        </div>
                        <div class="flex flex-col border-b border-gray-100 pb-2">
                            <span class="text-xs font-bold text-gray-400 uppercase">Пальне</span>
                            <span class="font-bold text-lg"><i class="fa-solid fa-gas-pump text-blue-500 w-5"></i> ${fuel}</span>
                        </div>
                        <div class="flex flex-col border-b border-gray-100 pb-2">
                            <span class="text-xs font-bold text-gray-400 uppercase">Коробка</span>
                            <span class="font-bold text-lg"><i class="fa-solid fa-gear text-blue-500 w-5"></i> ${trans}</span>
                        </div>
                        <div class="flex flex-col border-b border-gray-100 pb-2">
                            <span class="text-xs font-bold text-gray-400 uppercase">Привід</span>
                            <span class="font-bold text-lg"><i class="fa-solid fa-cogs text-blue-500 w-5"></i> ${drive}</span>
                        </div>
                    </div>

                    <button class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg transition text-xl">
                        Залишити заявку <i class="fa-solid fa-phone ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Переключаємо екран на сторінку деталей
    showPage('details');
}

// Обробники подій
document.getElementById('apply-filters-btn').addEventListener('click', filterCars);
document.getElementById('reset-filters-btn').addEventListener('click', () => {
    document.querySelectorAll('input, select').forEach(el => el.value = '');
    filterCars();
});