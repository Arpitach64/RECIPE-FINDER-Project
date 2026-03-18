# 🍴 Recipe Finder - Smart Ingredient-Based Recipe App

**Recipe Finder** is a fully functional, feature-rich, and highly interactive web application. It helps you discover delicious recipes based on ingredients you already have at home — reducing food waste and making cooking effortless.

## 🚀 Live Demo

You can view the live project here:  
👉 [https://arpitach64.github.io/RECIPE-FINDER-Project/](https://arpitach64.github.io/RECIPE-FINDER-Project/)

## ✨ Key Features

* **🔍 Smart Recipe Search:** Searches recipes using the **Spoonacular API** based on ingredients you enter — with auto-suggest dropdown for common ingredients.

* **🕐 Search History:** Saves your last 5 searches locally so you can quickly re-run them without retyping.

* **⭐ Recipe of the Day:** A daily featured recipe that automatically changes every day, complete with nutrition info and quick-action buttons.

* **🌓 Dark Mode:** Toggle between light and dark themes — preference is saved across sessions using localStorage.

* **❤️ Favorites System:** Save your favorite recipes with a heart button. All favorites are stored locally and accessible from a dedicated Favorites page.

* **📅 Weekly Meal Planner:**
    * Plan **Breakfast, Lunch, Dinner & Snack** for every day of the week.
    * Override protection — warns before replacing an existing meal slot.
    * Generate a full Shopping List from the entire week's plan in one click.

* **🛒 Smart Shopping List:**
    * Add missing ingredients from any recipe card in one click.
    * Organized into **"To Buy"** and **"Done"** sections with checkboxes.
    * Live count badge in the navbar updates in real time.
    * 🖨️ Print a formatted shopping list or 📤 share via **WhatsApp**.

* **📋 Recipe Detail Modal:** View full ingredient breakdown, nutrition badges, and quick-action buttons — all without leaving the page.

* **🌍 Cuisine & Diet Filters:** Filter recipes by diet (Vegetarian / Non-Veg) and cuisine (Indian 🇮🇳 | Italian 🇮🇹 | Chinese 🇨🇳 | Mexican 🇲🇽 | American 🇺🇸), or sort by least missing ingredients.

* **📤 WhatsApp Share:** Share any recipe directly to WhatsApp with a pre-formatted message including ingredients and recipe link.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Variables, Keyframe Animations, Responsive Design)
* **Logic:** Vanilla JavaScript (ES6+)
* **API:** [Spoonacular API](https://spoonacular.com/food-api) — For recipe search and data
* **Libraries:**
    * [Google Fonts (Poppins)](https://fonts.google.com/) — For modern typography
    * [Font Awesome 5](https://fontawesome.com/) — For social and UI icons

## 📂 Project Structure

* `index.html` — Core structure, layout, and all sections of the app
* `style.css` — Custom styling, dark mode, animations, and full responsive design
* `script.js` — All application logic including API calls, filters, localStorage, and UI interactions
* `README.md` — Project documentation

## ⚙️ How to Run Locally

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Arpitach64/RECIPE-FINDER-Project.git
    ```

2. **Open the project:**
    ```bash
    cd RECIPE-FINDER-Project
    ```

3. **Run with a Server:** Use the **Live Server** extension in VS Code to launch the project at `http://localhost:5500`.

    > ⚠️ **Note:** The app fetches data from the Spoonacular API. Make sure you have an active internet connection.

4. **API Key Setup:** Open `script.js` and replace the API key with your own:
    ```javascript
    var API_KEY = 'YOUR_SPOONACULAR_API_KEY';
    ```
    Get a free key at [spoonacular.com/food-api](https://spoonacular.com/food-api)

---

Developed with ❤️ by [Arpitach64](https://github.com/Arpitach64)
