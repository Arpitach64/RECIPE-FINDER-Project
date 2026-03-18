document.addEventListener('DOMContentLoaded', function () {

    // API key — ideally should be on a backend proxy
    var API_KEY = 'f4c54021eac0442f836867d746ea8cc2';

    // ── PAGE LOADER ───────────────────────────────────────────
    var loader = document.getElementById('pageLoader');
    window.addEventListener('load', function () {
        setTimeout(function () { loader.classList.add('hide'); }, 800);
    });

    // ── TOAST NOTIFICATIONS (replaces all alert()) ────────────
    function showToast(message, type, duration) {
        type = type || 'info';
        duration = duration || 3000;
        var container = document.getElementById('toastContainer');
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function () {
            toast.classList.add('hide');
            setTimeout(function () { toast.remove(); }, 300);
        }, duration);
    }

    // ── ELEMENTS ─────────────────────────────────────────────
    var hBtn = document.getElementById('hBtn');
    var navMenu = document.getElementById('navMenu');
    var overlay = document.getElementById('overlay');
    var darkBtn = document.getElementById('darkBtn');
    var heroSection = document.getElementById('heroSection');
    var rotdSection = document.getElementById('rotdSection');
    var about = document.getElementById('aboutContent');
    var recipesBox = document.getElementById('recipesContainer');
    var favBox = document.getElementById('favoritesContainer');
    var mealPlanBox = document.getElementById('mealPlanContainer');
    var shoppingBox = document.getElementById('shoppingContainer');
    var contactBox = document.getElementById('contactSection');
    var input = document.getElementById('ingredientInput');
    var suggestions = document.getElementById('suggestions');
    var modalOverlay = document.getElementById('modalOverlay');
    var modalClose = document.getElementById('modalClose');
    var modalContent = document.getElementById('modalContent');
    var backToTop = document.getElementById('backToTop');

    // ── CLEAN INGREDIENT NAME ─────────────────────────────────
    function cleanName(name) {
        if (!name) return '';
        return name
            .replace(/[-\u2013]\s*shopping list/gi, '')
            .replace(/shopping list/gi, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }

    // ── PAGE TRANSITIONS ──────────────────────────────────────
    var allSections = [heroSection, rotdSection, about, recipesBox,
        favBox, mealPlanBox, shoppingBox, contactBox];

    function hideAll() {
        allSections.forEach(function (el) { if (el) el.style.display = 'none'; });
    }

    function showSection(el, extraFn) {
        hideAll();
        if (!el) return;
        el.style.display = el.classList.contains('hero') ? 'flex' : 'block';
        el.classList.remove('page-fade');
        void el.offsetWidth;
        el.classList.add('page-fade');
        if (extraFn) extraFn();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showHome() {
        hideAll();
        heroSection.style.display = 'flex';
        rotdSection.style.display = 'block';
        about.style.display = 'block';
        recipesBox.style.display = 'block';
        [heroSection, rotdSection, about, recipesBox].forEach(function (el) {
            el.classList.remove('page-fade');
            void el.offsetWidth;
            el.classList.add('page-fade');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ── BACK TO TOP ───────────────────────────────────────────
    window.addEventListener('scroll', function () {
        backToTop.classList.toggle('show', window.scrollY > 400);
    });
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── HAMBURGER ─────────────────────────────────────────────
    function closeNav() {
        hBtn.classList.remove('open');
        navMenu.classList.remove('open');
        overlay.style.display = 'none';
    }
    hBtn.addEventListener('click', function () {
        navMenu.classList.contains('open') ? closeNav()
            : (hBtn.classList.add('open'), navMenu.classList.add('open'), overlay.style.display = 'block');
    });
    overlay.addEventListener('click', closeNav);

    // ── NAV LINKS ─────────────────────────────────────────────
    document.getElementById('lHome').addEventListener('click', function (e) { e.preventDefault(); closeNav(); showHome(); });
    document.getElementById('lAbout').addEventListener('click', function (e) { e.preventDefault(); closeNav(); showSection(about); });
    document.getElementById('lRecipes').addEventListener('click', function (e) { e.preventDefault(); closeNav(); showSection(recipesBox); });
    document.getElementById('lFavorites').addEventListener('click', function (e) { e.preventDefault(); closeNav(); showSection(favBox, renderFavorites); });
    document.getElementById('lMealPlan').addEventListener('click', function (e) { e.preventDefault(); closeNav(); showSection(mealPlanBox, renderMealPlan); });
    document.getElementById('lShopping').addEventListener('click', function (e) { e.preventDefault(); closeNav(); showSection(shoppingBox, renderShoppingList); });
    document.getElementById('lContact').addEventListener('click', function (e) { e.preventDefault(); closeNav(); showSection(contactBox); });

    var goToRecipes = document.getElementById('goToRecipesBtn');
    if (goToRecipes) goToRecipes.addEventListener('click', function () { showSection(recipesBox); });

    showHome();
    updateFavCount();
    updateShopCount();

    // ── DARK MODE ─────────────────────────────────────────────
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkBtn.textContent = '☀️';
    } else { darkBtn.textContent = '🌙'; }

    darkBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        var on = document.body.classList.contains('dark-mode');
        darkBtn.textContent = on ? '☀️' : '🌙';
        localStorage.setItem('darkMode', on ? 'true' : 'false');
    });

    // ── HERO BUTTONS ──────────────────────────────────────────
    document.getElementById('heroFindBtn').addEventListener('click', function () { showSection(recipesBox); });
    document.getElementById('heroAboutBtn').addEventListener('click', function () { showSection(about); });

    // ── TYPING ANIMATION ──────────────────────────────────────
    var words = ['With What You Have', 'Without Wasting Food', 'In Minutes', 'Like a Chef'];
    var wIdx = 0, cIdx = 0, deleting = false;
    var typedEl = document.getElementById('typedText');
    function type() {
        if (!typedEl) return;
        var word = words[wIdx];
        if (!deleting) { typedEl.textContent = word.substring(0, cIdx + 1); cIdx++; if (cIdx === word.length) { deleting = true; setTimeout(type, 1800); return; } }
        else { typedEl.textContent = word.substring(0, cIdx - 1); cIdx--; if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; } }
        setTimeout(type, deleting ? 60 : 100);
    }
    type();

    // ── RECIPE OF THE DAY ─────────────────────────────────────
    var rotdList = [
        { id: 644127, title: 'Gajar Ka Halwa', image: 'https://img.spoonacular.com/recipes/644127-312x231.jpg', calories: 320, protein: 8, carbs: 52, usedIngredients: [{ name: 'carrot' }, { name: 'milk' }], missedIngredients: [{ name: 'sugar' }, { name: 'ghee' }] },
        { id: 641110, title: 'Roast Chicken Curry', image: 'https://img.spoonacular.com/recipes/641110-312x231.jpg', calories: 480, protein: 42, carbs: 18, usedIngredients: [{ name: 'chicken' }, { name: 'onion' }], missedIngredients: [{ name: 'coconut milk' }, { name: 'eggs' }] },
        { id: 660913, title: 'Vegetable Biryani', image: 'https://img.spoonacular.com/recipes/660913-312x231.jpg', calories: 380, protein: 12, carbs: 68, usedIngredients: [{ name: 'onion' }, { name: 'rice' }], missedIngredients: [{ name: 'spices' }, { name: 'basmati rice' }] },
        { id: 652542, title: 'Mughlai Malai Kofta', image: 'https://img.spoonacular.com/recipes/652542-312x231.jpg', calories: 520, protein: 18, carbs: 32, usedIngredients: [{ name: 'paneer' }, { name: 'cream' }], missedIngredients: [{ name: 'cashews' }, { name: 'tomato' }] },
        { id: 635964, title: 'Bread Omelette', image: 'https://img.spoonacular.com/recipes/635964-312x231.jpg', calories: 280, protein: 14, carbs: 22, usedIngredients: [{ name: 'bread' }, { name: 'egg' }], missedIngredients: [{ name: 'potato' }, { name: 'milk' }] },
        { id: 641836, title: 'Baked Parmesan Chicken', image: 'https://img.spoonacular.com/recipes/641836-312x231.jpg', calories: 390, protein: 38, carbs: 14, usedIngredients: [{ name: 'chicken' }, { name: 'egg' }], missedIngredients: [{ name: 'parmesan' }, { name: 'breadcrumbs' }] },
        { id: 642583, title: 'Farfalle with Peas & Ham', image: 'https://img.spoonacular.com/recipes/642583-312x231.jpg', calories: 410, protein: 22, carbs: 54, usedIngredients: [{ name: 'pasta' }, { name: 'cheese' }], missedIngredients: [{ name: 'peas' }, { name: 'ham' }] }
    ];
    var rotd = rotdList[Math.floor(Date.now() / 86400000) % rotdList.length];
    var rotdLink = 'https://spoonacular.com/recipes/' + encodeURIComponent(rotd.title.replace(/\s+/g, '-').toLowerCase()) + '-' + rotd.id;
    document.getElementById('rotdCard').innerHTML =
        '<img src="' + rotd.image + '" alt="' + rotd.title + '">' +
        '<div class="rotd-info">' +
        '<h3>' + rotd.title + '</h3>' +
        '<div class="rotd-nutrition">' +
        '<span class="rotd-nut-badge">🔥 ' + rotd.calories + ' cal</span>' +
        '<span class="rotd-nut-badge">💪 ' + rotd.protein + 'g protein</span>' +
        '<span class="rotd-nut-badge">🌾 ' + rotd.carbs + 'g carbs</span>' +
        '</div>' +
        '<div class="rotd-btns">' +
        '<a href="' + rotdLink + '" target="_blank">View Recipe</a>' +
        '<button id="rotdFav">' + (isFav(rotd.id) ? '❤️ Saved' : '🤍 Save') + '</button>' +
        '<button id="rotdPlan">📅 Plan</button>' +
        '<button id="rotdShop">🛒 Add Missing</button>' +
        '</div>' +
        '</div>';
    document.getElementById('rotdFav').addEventListener('click', function () { toggleFav(rotd); this.textContent = isFav(rotd.id) ? '❤️ Saved' : '🤍 Save'; showToast(isFav(rotd.id) ? '❤️ Added to Favorites!' : 'Removed from Favorites', 'info'); });
    document.getElementById('rotdPlan').addEventListener('click', function () { openMealModal(rotd); });
    document.getElementById('rotdShop').addEventListener('click', function () { addToShopping(rotd.missedIngredients, rotd.title); this.textContent = '✅ Added!'; this.disabled = true; });

    // ── FAVORITES ─────────────────────────────────────────────
    function getFavs() { try { return JSON.parse(localStorage.getItem('recipeFavs') || '[]'); } catch (e) { return []; } }
    function saveFavs(arr) { localStorage.setItem('recipeFavs', JSON.stringify(arr)); }
    function isFav(id) { return getFavs().some(function (r) { return r.id === id; }); }
    function toggleFav(recipe) {
        var favs = getFavs(), idx = favs.findIndex(function (r) { return r.id === recipe.id; });
        if (idx === -1) favs.push(recipe); else favs.splice(idx, 1);
        saveFavs(favs); updateFavCount();
    }
    function updateFavCount() { document.getElementById('favCount').textContent = getFavs().length; }
    function renderFavorites() {
        var box = document.getElementById('favResults'), favs = getFavs();
        box.innerHTML = '';
        if (!favs.length) { box.innerHTML = '<p class="empty-fav">No favorites yet.<br>Press ❤️ on recipe cards to save them!</p>'; return; }
        favs.forEach(function (r) { box.appendChild(makeCard(r)); });
    }

    // ── SHOPPING LIST ─────────────────────────────────────────
    function getShoppingList() { try { return JSON.parse(localStorage.getItem('shoppingList') || '[]'); } catch (e) { return []; } }
    function saveShoppingList(list) { localStorage.setItem('shoppingList', JSON.stringify(list)); }
    function updateShopCount() {
        var total = getShoppingList().filter(function (i) { return !i.checked; }).length;
        document.getElementById('shopCount').textContent = total;
    }
    function addToShopping(items, source) {
        var list = getShoppingList(), added = 0;
        items.forEach(function (item) {
            var name = cleanName(item.name);
            if (name && !list.some(function (i) { return i.name === name; })) { list.push({ name: name, source: source, checked: false }); added++; }
        });
        saveShoppingList(list); updateShopCount();
        if (added > 0) showToast('🛒 ' + added + ' item(s) added to Shopping List!', 'success');
        else showToast('Items already in Shopping List', 'warning');
    }

    // Clean dirty data on load
    saveShoppingList(getShoppingList().map(function (i) { return { name: cleanName(i.name), source: i.source, checked: i.checked }; }));
    updateShopCount();

    function renderShoppingList() {
        var box = document.getElementById('shoppingList'), actions = document.getElementById('shoppingActions');
        var list = getShoppingList();
        box.innerHTML = '';
        if (!list.length) {
            box.innerHTML = '<div class="shopping-empty">🛒 Your shopping list is empty!<br>Add missing ingredients from recipe cards.</div>';
            actions.style.display = 'none'; return;
        }
        actions.style.display = 'flex';
        var unchecked = list.filter(function (i) { return !i.checked; });
        var checked = list.filter(function (i) { return i.checked; });

        function makeItem(item) {
            var idx = list.indexOf(item);
            var div = document.createElement('div');
            div.className = 'shopping-item' + (item.checked ? ' checked' : '');
            var uid = 'si_' + idx;
            div.innerHTML =
                '<input type="checkbox" id="' + uid + '"' + (item.checked ? ' checked' : '') + ' aria-label="' + item.name + '">' +
                '<label for="' + uid + '">' + item.name + (item.source ? ' <span style="opacity:0.5;font-size:0.78rem;">— ' + item.source + '</span>' : '') + '</label>' +
                '<button class="shopping-item-remove" title="Remove item">✕</button>';
            div.querySelector('input').addEventListener('change', function () {
                var l = getShoppingList(); l[idx].checked = this.checked; saveShoppingList(l); updateShopCount(); renderShoppingList();
            });
            div.querySelector('.shopping-item-remove').addEventListener('click', function () {
                var l = getShoppingList(); l.splice(idx, 1); saveShoppingList(l); updateShopCount(); renderShoppingList();
                showToast('Item removed', 'info', 1500);
            });
            return div;
        }
        if (unchecked.length) { var h1 = document.createElement('div'); h1.className = 'shopping-category'; h1.innerHTML = '<h3>To Buy (' + unchecked.length + ')</h3>'; box.appendChild(h1); }
        unchecked.forEach(function (item) { box.appendChild(makeItem(item)); });
        if (checked.length) { var h2 = document.createElement('div'); h2.className = 'shopping-category'; h2.innerHTML = '<h3>Done (' + checked.length + ')</h3>'; box.appendChild(h2); }
        checked.forEach(function (item) { box.appendChild(makeItem(item)); });
    }

    document.getElementById('printListBtn').addEventListener('click', function () {
        var list = getShoppingList();
        var html = '<html><body style="font-family:sans-serif;padding:20px;max-width:600px;margin:auto;">' +
            '<h2 style="color:#ff6a88;">🛒 Shopping List</h2>' +
            '<ul style="line-height:2;">' + list.map(function (i) { return '<li style="' + (i.checked ? 'text-decoration:line-through;opacity:0.5;' : '') + '">' + (i.checked ? '✅ ' : '▫️ ') + i.name + (i.source ? ' <small style="color:#999;">(' + i.source + ')</small>' : '') + '</li>'; }).join('') + '</ul>' +
            '<hr><p style="font-size:0.8rem;color:#999;">Generated by Recipe Finder App</p></body></html>';
        var w = window.open('', '_blank'); w.document.write(html); w.document.close(); w.print();
    });
    document.getElementById('shareListBtn').addEventListener('click', function () {
        var list = getShoppingList();
        var text = '🛒 *Shopping List*\n\n' + list.map(function (i) { return (i.checked ? '✅ ' : '▫️ ') + i.name; }).join('\n') + '\n\n_Recipe Finder App_';
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    });
    document.getElementById('clearShoppingBtn').addEventListener('click', function () {
        if (getShoppingList().length === 0) return;
        saveShoppingList([]); updateShopCount(); renderShoppingList();
        showToast('🗑️ Shopping list cleared!', 'info');
    });

    // ── MEAL PLANNER ──────────────────────────────────────────
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    var mealPendingRecipe = null;

    function getMealPlan() { try { return JSON.parse(localStorage.getItem('mealPlan') || '{}'); } catch (e) { return {}; } }
    function saveMealPlan(plan) { localStorage.setItem('mealPlan', JSON.stringify(plan)); }

    function renderMealPlan() {
        var grid = document.getElementById('mealGrid');
        var emptyState = document.getElementById('mealEmptyState');
        var mealActions = document.getElementById('mealActions');
        var plan = getMealPlan();
        var hasMeals = Object.values(plan).some(function (day) { return Object.keys(day).length > 0; });

        if (!hasMeals) {
            emptyState.style.display = 'block';
            grid.style.display = 'none';
            mealActions.style.display = 'none';
            return;
        }
        emptyState.style.display = 'none';
        grid.style.display = 'grid';
        mealActions.style.display = 'flex';
        grid.innerHTML = '';
        days.forEach(function (day) {
            var card = document.createElement('div'); card.className = 'meal-day-card';
            var slots = mealTypes.map(function (mt) {
                var meal = plan[day] && plan[day][mt];
                return '<div class="meal-slot">' +
                    '<span class="meal-slot-label">' + mt + '</span>' +
                    '<span class="meal-slot-name' + (meal ? '' : ' empty') + '">' + (meal ? meal.title : 'Not set') + '</span>' +
                    (meal ? '<button class="meal-slot-remove" data-day="' + day + '" data-type="' + mt + '" title="Remove">✕</button>' : '') +
                    '</div>';
            }).join('');
            card.innerHTML = '<h3>' + day + '</h3>' + slots;
            grid.appendChild(card);
        });
        grid.querySelectorAll('.meal-slot-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var p = getMealPlan();
                if (p[this.dataset.day]) delete p[this.dataset.day][this.dataset.type];
                saveMealPlan(p); renderMealPlan();
                showToast('Meal removed from plan', 'info', 1500);
            });
        });
    }

    function openMealModal(recipe) {
        mealPendingRecipe = recipe;
        document.getElementById('mealModalRecipeName').textContent = recipe.title;
        document.getElementById('mealModalOverlay').classList.add('show');
    }
    document.getElementById('mealModalClose').addEventListener('click', function () { document.getElementById('mealModalOverlay').classList.remove('show'); });
    document.getElementById('mealModalOverlay').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('show'); });

    document.getElementById('confirmMealAdd').addEventListener('click', function () {
        if (!mealPendingRecipe) return;
        var day = document.getElementById('mealDay').value;
        var type = document.getElementById('mealType').value;
        var plan = getMealPlan();
        if (!plan[day]) plan[day] = {};

        // Warn if slot already occupied
        if (plan[day][type]) {
            var confirmOverride = window.confirm(day + ' ' + type + ' already has "' + plan[day][type].title + '". Replace it?');
            if (!confirmOverride) return;
        }

        plan[day][type] = mealPendingRecipe;
        saveMealPlan(plan);
        document.getElementById('mealModalOverlay').classList.remove('show');
        showToast('📅 Added to ' + day + ' ' + type + '!', 'success');
        var btn = this; btn.textContent = '✓ Added!';
        setTimeout(function () { btn.textContent = 'Add to Plan ✓'; }, 1500);
    });

    document.getElementById('generateShoppingBtn').addEventListener('click', function () {
        var plan = getMealPlan(), items = [], count = 0;
        Object.values(plan).forEach(function (day) {
            Object.values(day).forEach(function (meal) {
                if (meal && meal.missedIngredients) {
                    meal.missedIngredients.forEach(function (ing) {
                        var name = cleanName(ing.name);
                        if (!items.some(function (i) { return i.name === name; })) { items.push({ name: name, source: meal.title }); }
                    });
                }
            });
        });
        var list = getShoppingList();
        items.forEach(function (item) {
            if (!list.some(function (i) { return i.name === item.name; })) { list.push({ name: item.name, source: item.source, checked: false }); count++; }
        });
        saveShoppingList(list); updateShopCount();
        showToast('🛒 ' + count + ' items added to Shopping List!', 'success');
        showSection(shoppingBox, renderShoppingList);
    });

    document.getElementById('clearPlanBtn').addEventListener('click', function () {
        if (Object.keys(getMealPlan()).length === 0) return;
        saveMealPlan({}); renderMealPlan();
        showToast('🗑️ Meal plan cleared!', 'info');
    });

    // ── SEARCH HISTORY ────────────────────────────────────────
    function getHistory() { try { return JSON.parse(localStorage.getItem('searchHistory') || '[]'); } catch (e) { return []; } }
    function saveHistory(arr) { localStorage.setItem('searchHistory', JSON.stringify(arr.slice(0, 5))); }
    function addToHistory(query) {
        var h = getHistory().filter(function (i) { return i !== query; });
        h.unshift(query); saveHistory(h);
    }
    function renderHistory() {
        var box = document.getElementById('searchHistory'), h = getHistory();
        box.innerHTML = '';
        if (!h.length) return;
        var label = document.createElement('div'); label.className = 'history-label'; label.textContent = 'Recent searches:'; box.appendChild(label);
        h.forEach(function (q) {
            var tag = document.createElement('button'); tag.className = 'history-tag';
            tag.innerHTML = '🕐 ' + q + '<span title="Remove">✕</span>';
            tag.addEventListener('click', function (e) {
                if (e.target.tagName === 'SPAN') { saveHistory(getHistory().filter(function (i) { return i !== q; })); renderHistory(); return; }
                input.value = q; document.getElementById('searchButton').click();
            });
            box.appendChild(tag);
        });
    }
    renderHistory();

    // ── SUGGESTIONS ───────────────────────────────────────────
    var commonIngredients = ['chicken', 'rice', 'egg', 'milk', 'onion', 'tomato', 'potato', 'paneer', 'bread', 'pasta', 'cheese', 'garlic', 'ginger', 'spinach', 'mushroom', 'carrot', 'lemon', 'butter', 'cream', 'flour', 'sugar', 'salt', 'pepper', 'fish', 'prawns', 'mutton', 'dal', 'rajma', 'chole', 'corn', 'capsicum'];
    input.addEventListener('input', function () {
        var val = this.value.split(',').pop().trim().toLowerCase();
        if (!val || val.length < 2) { suggestions.classList.remove('show'); return; }
        var matches = commonIngredients.filter(function (i) { return i.startsWith(val) && i !== val; }).slice(0, 5);
        if (!matches.length) { suggestions.classList.remove('show'); return; }
        suggestions.innerHTML = matches.map(function (m) { return '<div class="suggestion-item" role="option">' + m + '</div>'; }).join('');
        suggestions.classList.add('show');
        suggestions.querySelectorAll('.suggestion-item').forEach(function (item) {
            item.addEventListener('click', function () {
                var parts = input.value.split(',');
                parts[parts.length - 1] = ' ' + this.textContent;
                input.value = parts.join(',').replace(/^\s*,/, '').trim();
                suggestions.classList.remove('show'); input.focus();
            });
        });
    });
    document.addEventListener('click', function (e) { if (e.target !== input) suggestions.classList.remove('show'); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { suggestions.classList.remove('show'); document.getElementById('searchButton').click(); } });

    // ── CUISINE & FILTERS ─────────────────────────────────────
    var cuisineKeywords = {
        indian: ['halwa', 'biryani', 'kofta', 'curry', 'dal', 'paneer', 'tikka', 'masala', 'samosa', 'roti', 'naan', 'chutney', 'raita', 'korma', 'vindaloo', 'khichdi', 'paratha'],
        italian: ['pasta', 'pizza', 'risotto', 'lasagna', 'parmesan', 'marinara', 'pesto', 'bruschetta', 'tiramisu', 'farfalle', 'spaghetti', 'gnocchi', 'carbonara'],
        chinese: ['noodle', 'fried rice', 'dumpling', 'wonton', 'sriracha', 'soya', 'chow', 'kung', 'szechuan', 'stir fry', 'tofu', 'bok choy'],
        mexican: ['taco', 'burrito', 'quesadilla', 'salsa', 'guacamole', 'enchilada', 'tortilla', 'fajita', 'nacho', 'chipotle', 'jalapeno'],
        american: ['burger', 'sandwich', 'bbq', 'buffalo', 'mac', 'hotdog', 'coleslaw', 'brownie', 'pancake', 'waffle', 'fried chicken']
    };
    var currentCuisine = 'all', currentFilter = 'all', currentSort = null, currentRecipes = [];

    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (this.dataset.filter) {
                document.querySelectorAll('.filter-btn[data-filter]').forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active'); currentFilter = this.dataset.filter;
            }
            if (this.dataset.sort) currentSort = this.dataset.sort;
            renderRecipes(currentRecipes);
        });
    });
    document.querySelectorAll('.cuisine-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.cuisine-btn').forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active'); currentCuisine = this.dataset.cuisine;
            renderRecipes(currentRecipes);
        });
    });

    function applyFilters(list) {
        var f = list.slice();
        var nonVeg = ['chicken', 'mutton', 'fish', 'prawn', 'beef', 'pork', 'lamb', 'meat', 'egg'];
        if (currentFilter === 'veg') f = f.filter(function (r) { return !nonVeg.some(function (w) { return r.title.toLowerCase().includes(w); }); });
        else if (currentFilter === 'nonveg') f = f.filter(function (r) { return nonVeg.some(function (w) { return r.title.toLowerCase().includes(w); }); });
        if (currentCuisine !== 'all') {
            var kws = cuisineKeywords[currentCuisine] || [];
            f = f.filter(function (r) { return kws.some(function (k) { return r.title.toLowerCase().includes(k); }); });
        }
        if (currentSort === 'missing') f.sort(function (a, b) { return a.missedIngredients.length - b.missedIngredients.length; });
        return f;
    }

    // ── MAKE CARD ─────────────────────────────────────────────
    function makeCard(r) {
        var imgSrc = r.image || 'https://via.placeholder.com/268x175?text=No+Image';
        var used = r.usedIngredients.map(function (x) { return x.name; }).join(', ');
        var missed = r.missedIngredients.map(function (x) { return x.name; }).join(', ');
        var link = 'https://spoonacular.com/recipes/' + encodeURIComponent(r.title.replace(/\s+/g, '-').toLowerCase()) + '-' + r.id;
        var cal = r.calories || Math.floor(200 + Math.random() * 350);
        var pro = r.protein || Math.floor(5 + Math.random() * 35);
        var carb = r.carbs || Math.floor(15 + Math.random() * 55);

        var card = document.createElement('div'); card.className = 'recipe-card';
        card.innerHTML =
            '<div class="img-wrap"><img src="' + imgSrc + '" alt="' + r.title + '" loading="lazy"></div>' +
            '<button class="' + (isFav(r.id) ? 'fav-btn saved' : 'fav-btn') + '" title="' + (isFav(r.id) ? 'Remove from' : 'Add to') + ' Favorites">' + (isFav(r.id) ? '❤️' : '🤍') + '</button>' +
            '<h3>' + r.title + '</h3>' +
            '<div class="nutrition-bar">' +
            '<span class="nut-badge">🔥 ' + cal + ' cal</span>' +
            '<span class="nut-badge">💪 ' + pro + 'g</span>' +
            '<span class="nut-badge">🌾 ' + carb + 'g</span>' +
            '</div>' +
            '<p><strong>Used:</strong> ' + used + '</p>' +
            '<p><strong>Missing (' + r.missedIngredients.length + '):</strong> ' + missed + '</p>' +
            '<div class="card-actions">' +
            '<button class="btn-detail" title="View Details">📋</button>' +
            '<button class="btn-shop"   title="Add to Shopping List">🛒</button>' +
            '<button class="btn-plan"   title="Add to Meal Plan">📅</button>' +
            '<button class="btn-share"  title="Share on WhatsApp">📤</button>' +
            '<a class="btn-view" href="' + link + '" target="_blank" title="View Full Recipe" rel="noopener">🔗</a>' +
            '</div>';

        card.querySelector('.fav-btn').addEventListener('click', function () {
            toggleFav(r);
            this.textContent = isFav(r.id) ? '❤️' : '🤍';
            this.className = isFav(r.id) ? 'fav-btn saved' : 'fav-btn';
            this.title = (isFav(r.id) ? 'Remove from' : 'Add to') + ' Favorites';
            showToast(isFav(r.id) ? '❤️ Added to Favorites!' : 'Removed from Favorites', 'info', 2000);
        });
        card.querySelector('.btn-detail').addEventListener('click', function () { openModal(r, imgSrc, used, missed, link, cal, pro, carb); });
        card.querySelector('.btn-shop').addEventListener('click', function () {
            addToShopping(r.missedIngredients, r.title);
            this.textContent = '✅'; this.style.background = '#4caf50';
            this.style.color = '#fff'; this.disabled = true;
        });
        card.querySelector('.btn-plan').addEventListener('click', function () { openMealModal(r); });
        card.querySelector('.btn-share').addEventListener('click', function () {
            var text = '🍴 *' + r.title + '*\n\n✅ Have: ' + used + '\n🛒 Need: ' + missed + '\n\n👉 ' + link + '\n\n_Shared from Recipe Finder App_';
            window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
        });
        return card;
    }

    function renderRecipes(list) {
        var box = document.getElementById('recipeResults');
        var filtered = applyFilters(list);
        box.innerHTML = '';
        if (!filtered.length) {
            box.innerHTML = '<p style="color:#fff;opacity:0.8;padding:20px;width:100%;">No recipes found. Try changing filters!</p>';
            return;
        }
        filtered.forEach(function (r) { box.appendChild(makeCard(r)); });
    }

    // ── MODAL ─────────────────────────────────────────────────
    function openModal(r, imgSrc, used, missed, link, cal, pro, carb) {
        modalContent.innerHTML =
            '<img src="' + imgSrc + '" alt="' + r.title + '">' +
            '<h2>' + r.title + '</h2>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">' +
            '<span class="nut-badge" style="font-size:0.85rem;">🔥 ' + cal + ' cal</span>' +
            '<span class="nut-badge" style="font-size:0.85rem;">💪 ' + pro + 'g protein</span>' +
            '<span class="nut-badge" style="font-size:0.85rem;">🌾 ' + carb + 'g carbs</span>' +
            '</div>' +
            '<h3>✅ Available Ingredients</h3>' +
            '<ul>' + r.usedIngredients.map(function (x) { return '<li>' + x.name + '</li>'; }).join('') + '</ul>' +
            '<h3>🛒 Missing Ingredients</h3>' +
            '<ul>' + r.missedIngredients.map(function (x) { return '<li>' + cleanName(x.name) + '</li>'; }).join('') + '</ul>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;">' +
            '<a class="modal-link" href="' + link + '" target="_blank" rel="noopener">View Full Recipe →</a>' +
            '<button class="modal-link" style="background:#fff5f7;color:#ff6a88;border:none;cursor:pointer;" id="mAddShop">🛒 Add to Shopping</button>' +
            '<button class="modal-link" style="background:#fff5f7;color:#ff6a88;border:none;cursor:pointer;" id="mAddPlan">📅 Add to Plan</button>' +
            '<button class="modal-link" style="background:#25D366;color:#fff;border:none;cursor:pointer;" id="mShare">📤 WhatsApp</button>' +
            '</div>';
        modalOverlay.classList.add('show');
        document.getElementById('mAddShop').addEventListener('click', function () {
            addToShopping(r.missedIngredients, r.title);
            this.textContent = '✅ Added!'; this.disabled = true;
        });
        document.getElementById('mAddPlan').addEventListener('click', function () {
            modalOverlay.classList.remove('show'); openMealModal(r);
        });
        document.getElementById('mShare').addEventListener('click', function () {
            var text = '🍴 *' + r.title + '*\n\n✅ Have: ' + used + '\n🛒 Need: ' + missed + '\n\n👉 ' + link + '\n\n_Shared from Recipe Finder App_';
            window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
        });
    }
    modalClose.addEventListener('click', function () { modalOverlay.classList.remove('show'); });
    modalOverlay.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('show'); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            modalOverlay.classList.remove('show');
            document.getElementById('mealModalOverlay').classList.remove('show');
        }
    });

    // ── DEFAULT RECIPES ───────────────────────────────────────
    var defaultRecipes = [
        { id: 644127, title: 'Gajar Ka Halwa', image: 'https://img.spoonacular.com/recipes/644127-312x231.jpg', calories: 320, protein: 8, carbs: 52, usedIngredients: [{ name: 'carrot' }, { name: 'milk' }], missedIngredients: [{ name: 'sugar' }, { name: 'ghee' }] },
        { id: 641110, title: 'Roast Chicken Curry', image: 'https://img.spoonacular.com/recipes/641110-312x231.jpg', calories: 480, protein: 42, carbs: 18, usedIngredients: [{ name: 'chicken' }, { name: 'onion' }], missedIngredients: [{ name: 'coconut milk' }, { name: 'eggs' }] },
        { id: 636292, title: 'Peanut Butter Sriracha Cookies', image: 'https://img.spoonacular.com/recipes/636292-312x231.jpg', calories: 420, protein: 10, carbs: 48, usedIngredients: [{ name: 'mushroom' }, { name: 'rice' }], missedIngredients: [{ name: 'soya sauce' }, { name: 'ginger' }] },
        { id: 635964, title: 'Bread Omelette', image: 'https://img.spoonacular.com/recipes/635964-312x231.jpg', calories: 280, protein: 14, carbs: 22, usedIngredients: [{ name: 'bread' }, { name: 'egg' }], missedIngredients: [{ name: 'potato' }, { name: 'milk' }] },
        { id: 660913, title: 'Vegetable Biryani', image: 'https://img.spoonacular.com/recipes/660913-312x231.jpg', calories: 380, protein: 12, carbs: 68, usedIngredients: [{ name: 'onion' }, { name: 'rice' }], missedIngredients: [{ name: 'spices' }, { name: 'basmati rice' }] },
        { id: 652542, title: 'Mughlai Malai Kofta', image: 'https://img.spoonacular.com/recipes/652542-312x231.jpg', calories: 520, protein: 18, carbs: 32, usedIngredients: [{ name: 'paneer' }, { name: 'cream' }], missedIngredients: [{ name: 'cashews' }, { name: 'tomato' }] },
        { id: 641836, title: 'Baked Parmesan Chicken', image: 'https://img.spoonacular.com/recipes/641836-312x231.jpg', calories: 390, protein: 38, carbs: 14, usedIngredients: [{ name: 'chicken' }, { name: 'egg' }], missedIngredients: [{ name: 'parmesan' }, { name: 'breadcrumbs' }] },
        { id: 642583, title: 'Farfalle with Peas & Ham', image: 'https://img.spoonacular.com/recipes/642583-312x231.jpg', calories: 410, protein: 22, carbs: 54, usedIngredients: [{ name: 'pasta' }, { name: 'cheese' }], missedIngredients: [{ name: 'peas' }, { name: 'ham' }] }
    ];
    currentRecipes = defaultRecipes;
    renderRecipes(currentRecipes);

    // ── SEARCH ────────────────────────────────────────────────
    document.getElementById('searchButton').addEventListener('click', function () {
        var val = input.value.trim();
        if (!val) { showToast('⚠️ Please enter at least one ingredient!', 'warning'); return; }
        var clean = val.replace(/[^a-zA-Z0-9, ]/g, '').toLowerCase().trim();
        addToHistory(clean); renderHistory();
        var s = '';
        for (var i = 0; i < 8; i++) s += '<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-body"><div class="skeleton-line long"></div><div class="skeleton-line med"></div><div class="skeleton-line short"></div><div class="skeleton-btn"></div></div></div>';
        document.getElementById('recipeResults').innerHTML = s;
        fetch('https://api.spoonacular.com/recipes/findByIngredients?ingredients=' + encodeURIComponent(clean) + '&number=8&apiKey=' + API_KEY)
            .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(function (data) {
                currentRecipes = Array.isArray(data) ? data : [];
                renderRecipes(currentRecipes);
                showToast('Found ' + currentRecipes.length + ' recipes!', 'success', 2000);
            })
            .catch(function (err) {
                var msg = err.message === '402' ? 'API quota finished! Try again tomorrow.' : 'Something went wrong. Check your internet.';
                document.getElementById('recipeResults').innerHTML = '<p style="color:#fff;padding:20px;width:100%;">⚠️ ' + msg + '</p>';
                showToast('⚠️ ' + msg, 'error');
            });
    });

    // ── CONTACT FORM ──────────────────────────────────────────
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('cName').value.trim();
        var email = document.getElementById('cEmail').value.trim();
        var message = document.getElementById('cMessage').value.trim();
        if (!name || !email || !message) { showToast('⚠️ Please fill out all fields!', 'warning'); return; }
        var subject = encodeURIComponent('Recipe Finder - Message from ' + name);
        var body = encodeURIComponent('Name: ' + name + '\nFrom Email: ' + email + '\n\nMessage:\n' + message);
        window.open('mailto:arpitachaudhary489@gmail.com?subject=' + subject + '&body=' + body);
        var btn = document.getElementById('submitButton');
        btn.textContent = '✅ Email App Opened!'; btn.style.background = '#4caf50'; btn.style.color = '#fff';
        showToast('📧 Email app opened! Please send the email.', 'success');
        setTimeout(function () { btn.textContent = 'Send Message'; btn.style.background = ''; btn.style.color = ''; document.getElementById('contactForm').reset(); }, 3000);
    });

});