// API Configuration - Using OpenWeatherMap Free Tier
const API_KEY = 'your_api_key_here'; // You need to get this from OpenWeatherMap
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const themeToggle = document.getElementById('themeToggle');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const suggestions = document.getElementById('suggestions');
const userLocation = document.getElementById('userLocation');
const userTime = document.getElementById('userTime');
const userDate = document.getElementById('userDate');

// Weather Display Elements
const cityName = document.getElementById('cityName');
const locationDate = document.getElementById('locationDate');
const timeZone = document.getElementById('timeZone');
const timeDifference = document.getElementById('timeDifference');
const fullLocation = document.getElementById('fullLocation');
const continent = document.getElementById('continent');
const weatherIcon = document.getElementById('weatherIcon');
const weatherCondition = document.getElementById('weatherCondition');
const currentTemp = document.getElementById('currentTemp');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const precipitation = document.getElementById('precipitation');
const uvIndex = document.getElementById('uvIndex');

// Chart.js instance
let forecastChart;
let chartType = 'temperature';
let forecastData = [];
let userCity = '';
let userCountry = '';

// Complete world capitals data with flags and continents
const worldCapitals = [
    // Africa
    { name: "Abuja", country: "Nigeria", code: "NG", continent: "Africa", lat: 9.0765, lon: 7.3986 },
    { name: "Accra", country: "Ghana", code: "GH", continent: "Africa", lat: 5.6037, lon: -0.1870 },
    { name: "Addis Ababa", country: "Ethiopia", code: "ET", continent: "Africa", lat: 9.0054, lon: 38.7636 },
    { name: "Algiers", country: "Algeria", code: "DZ", continent: "Africa", lat: 36.7538, lon: 3.0588 },
    { name: "Antananarivo", country: "Madagascar", code: "MG", continent: "Africa", lat: -18.8792, lon: 47.5079 },
    { name: "Bamako", country: "Mali", code: "ML", continent: "Africa", lat: 12.6392, lon: -8.0029 },
    { name: "Bangui", country: "Central African Republic", code: "CF", continent: "Africa", lat: 4.3947, lon: 18.5582 },
    { name: "Banjul", country: "Gambia", code: "GM", continent: "Africa", lat: 13.4549, lon: -16.5790 },
    { name: "Bissau", country: "Guinea-Bissau", code: "GW", continent: "Africa", lat: 11.8817, lon: -15.6178 },
    { name: "Cairo", country: "Egypt", code: "EG", continent: "Africa", lat: 30.0444, lon: 31.2357 },
    { name: "Conakry", country: "Guinea", code: "GN", continent: "Africa", lat: 9.6412, lon: -13.5784 },
    { name: "Dakar", country: "Senegal", code: "SN", continent: "Africa", lat: 14.7167, lon: -17.4677 },
    { name: "Djibouti", country: "Djibouti", code: "DJ", continent: "Africa", lat: 11.8251, lon: 42.5903 },
    { name: "Dodoma", country: "Tanzania", code: "TZ", continent: "Africa", lat: -6.1630, lon: 35.7516 },
    { name: "Freetown", country: "Sierra Leone", code: "SL", continent: "Africa", lat: 8.4657, lon: -13.2317 },
    { name: "Gaborone", country: "Botswana", code: "BW", continent: "Africa", lat: -24.6282, lon: 25.9231 },
    { name: "Harare", country: "Zimbabwe", code: "ZW", continent: "Africa", lat: -17.8292, lon: 31.0522 },
    { name: "Kampala", country: "Uganda", code: "UG", continent: "Africa", lat: 0.3476, lon: 32.5825 },
    { name: "Khartoum", country: "Sudan", code: "SD", continent: "Africa", lat: 15.5007, lon: 32.5599 },
    { name: "Kigali", country: "Rwanda", code: "RW", continent: "Africa", lat: -1.9441, lon: 30.0619 },
    { name: "Kinshasa", country: "Democratic Republic of the Congo", code: "CD", continent: "Africa", lat: -4.4419, lon: 15.2663 },
    { name: "Libreville", country: "Gabon", code: "GA", continent: "Africa", lat: 0.4162, lon: 9.4673 },
    { name: "Lilongwe", country: "Malawi", code: "MW", continent: "Africa", lat: -13.9626, lon: 33.7741 },
    { name: "Lomé", country: "Togo", code: "TG", continent: "Africa", lat: 6.1725, lon: 1.2314 },
    { name: "Luanda", country: "Angola", code: "AO", continent: "Africa", lat: -8.8390, lon: 13.2894 },
    { name: "Lusaka", country: "Zambia", code: "ZM", continent: "Africa", lat: -15.3875, lon: 28.3228 },
    { name: "Malabo", country: "Equatorial Guinea", code: "GQ", continent: "Africa", lat: 3.7500, lon: 8.7833 },
    { name: "Maputo", country: "Mozambique", code: "MZ", continent: "Africa", lat: -25.9653, lon: 32.5892 },
    { name: "Maseru", country: "Lesotho", code: "LS", continent: "Africa", lat: -29.3101, lon: 27.4786 },
    { name: "Mbabane", country: "Eswatini", code: "SZ", continent: "Africa", lat: -26.3054, lon: 31.1367 },
    { name: "Mogadishu", country: "Somalia", code: "SO", continent: "Africa", lat: 2.0469, lon: 45.3182 },
    { name: "Monrovia", country: "Liberia", code: "LR", continent: "Africa", lat: 6.2907, lon: -10.7605 },
    { name: "Moroni", country: "Comoros", code: "KM", continent: "Africa", lat: -11.7172, lon: 43.2473 },
    { name: "Nairobi", country: "Kenya", code: "KE", continent: "Africa", lat: -1.2864, lon: 36.8172 },
    { name: "Niamey", country: "Niger", code: "NE", continent: "Africa", lat: 13.5137, lon: 2.1098 },
    { name: "Nouakchott", country: "Mauritania", code: "MR", continent: "Africa", lat: 18.0735, lon: -15.9582 },
    { name: "Ouagadougou", country: "Burkina Faso", code: "BF", continent: "Africa", lat: 12.3714, lon: -1.5197 },
    { name: "Port Louis", country: "Mauritius", code: "MU", continent: "Africa", lat: -20.1609, lon: 57.5012 },
    { name: "Porto-Novo", country: "Benin", code: "BJ", continent: "Africa", lat: 6.4969, lon: 2.6289 },
    { name: "Praia", country: "Cape Verde", code: "CV", continent: "Africa", lat: 14.9330, lon: -23.5133 },
    { name: "Pretoria", country: "South Africa", code: "ZA", continent: "Africa", lat: -25.7479, lon: 28.2293 },
    { name: "Rabat", country: "Morocco", code: "MA", continent: "Africa", lat: 34.0209, lon: -6.8416 },
    { name: "São Tomé", country: "São Tomé and Príncipe", code: "ST", continent: "Africa", lat: 0.3302, lon: 6.7333 },
    { name: "Tripoli", country: "Libya", code: "LY", continent: "Africa", lat: 32.8872, lon: 13.1913 },
    { name: "Tunis", country: "Tunisia", code: "TN", continent: "Africa", lat: 36.8065, lon: 10.1815 },
    { name: "Windhoek", country: "Namibia", code: "NA", continent: "Africa", lat: -22.5609, lon: 17.0658 },
    { name: "Yamoussoukro", country: "Ivory Coast", code: "CI", continent: "Africa", lat: 6.8276, lon: -5.2893 },
    { name: "Yaoundé", country: "Cameroon", code: "CM", continent: "Africa", lat: 3.8480, lon: 11.5021 },

    // Asia
    { name: "Abu Dhabi", country: "United Arab Emirates", code: "AE", continent: "Asia", lat: 24.4539, lon: 54.3773 },
    { name: "Amman", country: "Jordan", code: "JO", continent: "Asia", lat: 31.9539, lon: 35.9106 },
    { name: "Ankara", country: "Turkey", code: "TR", continent: "Asia", lat: 39.9334, lon: 32.8597 },
    { name: "Ashgabat", country: "Turkmenistan", code: "TM", continent: "Asia", lat: 37.9601, lon: 58.3261 },
    { name: "Astana", country: "Kazakhstan", code: "KZ", continent: "Asia", lat: 51.1694, lon: 71.4491 },
    { name: "Baghdad", country: "Iraq", code: "IQ", continent: "Asia", lat: 33.3152, lon: 44.3661 },
    { name: "Baku", country: "Azerbaijan", code: "AZ", continent: "Asia", lat: 40.4093, lon: 49.8671 },
    { name: "Bandar Seri Begawan", country: "Brunei", code: "BN", continent: "Asia", lat: 4.9031, lon: 114.9398 },
    { name: "Bangkok", country: "Thailand", code: "TH", continent: "Asia", lat: 13.7563, lon: 100.5018 },
    { name: "Beijing", country: "China", code: "CN", continent: "Asia", lat: 39.9042, lon: 116.4074 },
    { name: "Beirut", country: "Lebanon", code: "LB", continent: "Asia", lat: 33.8938, lon: 35.5018 },
    { name: "Bishkek", country: "Kyrgyzstan", code: "KG", continent: "Asia", lat: 42.8746, lon: 74.5698 },
    { name: "Colombo", country: "Sri Lanka", code: "LK", continent: "Asia", lat: 6.9271, lon: 79.8612 },
    { name: "Damascus", country: "Syria", code: "SY", continent: "Asia", lat: 33.5138, lon: 36.2765 },
    { name: "Dhaka", country: "Bangladesh", code: "BD", continent: "Asia", lat: 23.8103, lon: 90.4125 },
    { name: "Dili", country: "Timor-Leste", code: "TL", continent: "Asia", lat: -8.5569, lon: 125.5603 },
    { name: "Doha", country: "Qatar", code: "QA", continent: "Asia", lat: 25.2769, lon: 51.5200 },
    { name: "Dubai", country: "United Arab Emirates", code: "AE", continent: "Asia", lat: 25.2048, lon: 55.2708 },
    { name: "Dushanbe", country: "Tajikistan", code: "TJ", continent: "Asia", lat: 38.5598, lon: 68.7870 },
    { name: "Hanoi", country: "Vietnam", code: "VN", continent: "Asia", lat: 21.0278, lon: 105.8342 },
    { name: "Islamabad", country: "Pakistan", code: "PK", continent: "Asia", lat: 33.6844, lon: 73.0479 },
    { name: "Jakarta", country: "Indonesia", code: "ID", continent: "Asia", lat: -6.2088, lon: 106.8456 },
    { name: "Jerusalem", country: "Israel", code: "IL", continent: "Asia", lat: 31.7683, lon: 35.2137 },
    { name: "Kabul", country: "Afghanistan", code: "AF", continent: "Asia", lat: 34.5553, lon: 69.2075 },
    { name: "Kathmandu", country: "Nepal", code: "NP", continent: "Asia", lat: 27.7172, lon: 85.3240 },
    { name: "Kuala Lumpur", country: "Malaysia", code: "MY", continent: "Asia", lat: 3.1390, lon: 101.6869 },
    { name: "Kuwait City", country: "Kuwait", code: "KW", continent: "Asia", lat: 29.3759, lon: 47.9774 },
    { name: "Manama", country: "Bahrain", code: "BH", continent: "Asia", lat: 26.2285, lon: 50.5860 },
    { name: "Manila", country: "Philippines", code: "PH", continent: "Asia", lat: 14.5995, lon: 120.9842 },
    { name: "Muscat", country: "Oman", code: "OM", continent: "Asia", lat: 23.5880, lon: 58.3829 },
    { name: "Naypyidaw", country: "Myanmar", code: "MM", continent: "Asia", lat: 19.7633, lon: 96.0785 },
    { name: "New Delhi", country: "India", code: "IN", continent: "Asia", lat: 28.6139, lon: 77.2090 },
    { name: "Nicosia", country: "Cyprus", code: "CY", continent: "Asia", lat: 35.1856, lon: 33.3823 },
    { name: "Phnom Penh", country: "Cambodia", code: "KH", continent: "Asia", lat: 11.5564, lon: 104.9282 },
    { name: "Pyongyang", country: "North Korea", code: "KP", continent: "Asia", lat: 39.0392, lon: 125.7625 },
    { name: "Riyadh", country: "Saudi Arabia", code: "SA", continent: "Asia", lat: 24.7136, lon: 46.6753 },
    { name: "Sana'a", country: "Yemen", code: "YE", continent: "Asia", lat: 15.3694, lon: 44.1910 },
    { name: "Seoul", country: "South Korea", code: "KR", continent: "Asia", lat: 37.5665, lon: 126.9780 },
    { name: "Singapore", country: "Singapore", code: "SG", continent: "Asia", lat: 1.3521, lon: 103.8198 },
    { name: "Taipei", country: "Taiwan", code: "TW", continent: "Asia", lat: 25.0330, lon: 121.5654 },
    { name: "Tashkent", country: "Uzbekistan", code: "UZ", continent: "Asia", lat: 41.2995, lon: 69.2401 },
    { name: "Tbilisi", country: "Georgia", code: "GE", continent: "Asia", lat: 41.7151, lon: 44.8271 },
    { name: "Tehran", country: "Iran", code: "IR", continent: "Asia", lat: 35.6892, lon: 51.3890 },
    { name: "Thimphu", country: "Bhutan", code: "BT", continent: "Asia", lat: 27.4728, lon: 89.6390 },
    { name: "Tokyo", country: "Japan", code: "JP", continent: "Asia", lat: 35.6762, lon: 139.6503 },
    { name: "Ulaanbaatar", country: "Mongolia", code: "MN", continent: "Asia", lat: 47.8864, lon: 106.9057 },
    { name: "Vientiane", country: "Laos", code: "LA", continent: "Asia", lat: 17.9757, lon: 102.6331 },
    { name: "Yerevan", country: "Armenia", code: "AM", continent: "Asia", lat: 40.1792, lon: 44.4991 },

    // Europe
    { name: "Amsterdam", country: "Netherlands", code: "NL", continent: "Europe", lat: 52.3676, lon: 4.9041 },
    { name: "Andorra la Vella", country: "Andorra", code: "AD", continent: "Europe", lat: 42.5063, lon: 1.5218 },
    { name: "Athens", country: "Greece", code: "GR", continent: "Europe", lat: 37.9838, lon: 23.7275 },
    { name: "Belgrade", country: "Serbia", code: "RS", continent: "Europe", lat: 44.7866, lon: 20.4489 },
    { name: "Berlin", country: "Germany", code: "DE", continent: "Europe", lat: 52.5200, lon: 13.4050 },
    { name: "Bern", country: "Switzerland", code: "CH", continent: "Europe", lat: 46.9480, lon: 7.4474 },
    { name: "Bratislava", country: "Slovakia", code: "SK", continent: "Europe", lat: 48.1486, lon: 17.1077 },
    { name: "Brussels", country: "Belgium", code: "BE", continent: "Europe", lat: 50.8503, lon: 4.3517 },
    { name: "Bucharest", country: "Romania", code: "RO", continent: "Europe", lat: 44.4268, lon: 26.1025 },
    { name: "Budapest", country: "Hungary", code: "HU", continent: "Europe", lat: 47.4979, lon: 19.0402 },
    { name: "Chisinau", country: "Moldova", code: "MD", continent: "Europe", lat: 47.0105, lon: 28.8638 },
    { name: "Copenhagen", country: "Denmark", code: "DK", continent: "Europe", lat: 55.6761, lon: 12.5683 },
    { name: "Dublin", country: "Ireland", code: "IE", continent: "Europe", lat: 53.3498, lon: -6.2603 },
    { name: "Edinburgh", country: "United Kingdom", code: "GB", continent: "Europe", lat: 55.9533, lon: -3.1883 },
    { name: "Helsinki", country: "Finland", code: "FI", continent: "Europe", lat: 60.1699, lon: 24.9384 },
    { name: "Kyiv", country: "Ukraine", code: "UA", continent: "Europe", lat: 50.4501, lon: 30.5234 },
    { name: "Lisbon", country: "Portugal", code: "PT", continent: "Europe", lat: 38.7223, lon: -9.1393 },
    { name: "Ljubljana", country: "Slovenia", code: "SI", continent: "Europe", lat: 46.0569, lon: 14.5058 },
    { name: "London", country: "United Kingdom", code: "GB", continent: "Europe", lat: 51.5074, lon: -0.1278 },
    { name: "Luxembourg", country: "Luxembourg", code: "LU", continent: "Europe", lat: 49.6116, lon: 6.1319 },
    { name: "Madrid", country: "Spain", code: "ES", continent: "Europe", lat: 40.4168, lon: -3.7038 },
    { name: "Minsk", country: "Belarus", code: "BY", continent: "Europe", lat: 53.9045, lon: 27.5615 },
    { name: "Monaco", country: "Monaco", code: "MC", continent: "Europe", lat: 43.7384, lon: 7.4246 },
    { name: "Moscow", country: "Russia", code: "RU", continent: "Europe", lat: 55.7558, lon: 37.6173 },
    { name: "Oslo", country: "Norway", code: "NO", continent: "Europe", lat: 59.9139, lon: 10.7522 },
    { name: "Paris", country: "France", code: "FR", continent: "Europe", lat: 48.8566, lon: 2.3522 },
    { name: "Podgorica", country: "Montenegro", code: "ME", continent: "Europe", lat: 42.4304, lon: 19.2594 },
    { name: "Prague", country: "Czech Republic", code: "CZ", continent: "Europe", lat: 50.0755, lon: 14.4378 },
    { name: "Reykjavik", country: "Iceland", code: "IS", continent: "Europe", lat: 64.1466, lon: -21.9426 },
    { name: "Riga", country: "Latvia", code: "LV", continent: "Europe", lat: 56.9496, lon: 24.1052 },
    { name: "Rome", country: "Italy", code: "IT", continent: "Europe", lat: 41.9028, lon: 12.4964 },
    { name: "San Marino", country: "San Marino", code: "SM", continent: "Europe", lat: 43.9424, lon: 12.4578 },
    { name: "Sarajevo", country: "Bosnia and Herzegovina", code: "BA", continent: "Europe", lat: 43.8563, lon: 18.4131 },
    { name: "Skopje", country: "North Macedonia", code: "MK", continent: "Europe", lat: 41.9981, lon: 21.4254 },
    { name: "Sofia", country: "Bulgaria", code: "BG", continent: "Europe", lat: 42.6977, lon: 23.3219 },
    { name: "Stockholm", country: "Sweden", code: "SE", continent: "Europe", lat: 59.3293, lon: 18.0686 },
    { name: "Tallinn", country: "Estonia", code: "EE", continent: "Europe", lat: 59.4370, lon: 24.7536 },
    { name: "Tirana", country: "Albania", code: "AL", continent: "Europe", lat: 41.3275, lon: 19.8187 },
    { name: "Vaduz", country: "Liechtenstein", code: "LI", continent: "Europe", lat: 47.1410, lon: 9.5209 },
    { name: "Valletta", country: "Malta", code: "MT", continent: "Europe", lat: 35.8997, lon: 14.5146 },
    { name: "Vatican City", country: "Vatican City", code: "VA", continent: "Europe", lat: 41.9029, lon: 12.4534 },
    { name: "Vienna", country: "Austria", code: "AT", continent: "Europe", lat: 48.2082, lon: 16.3738 },
    { name: "Vilnius", country: "Lithuania", code: "LT", continent: "Europe", lat: 54.6872, lon: 25.2797 },
    { name: "Warsaw", country: "Poland", code: "PL", continent: "Europe", lat: 52.2297, lon: 21.0122 },
    { name: "Zagreb", country: "Croatia", code: "HR", continent: "Europe", lat: 45.8150, lon: 15.9819 },

    // North America
    { name: "Basseterre", country: "Saint Kitts and Nevis", code: "KN", continent: "North America", lat: 17.3026, lon: -62.7177 },
    { name: "Belmopan", country: "Belize", code: "BZ", continent: "North America", lat: 17.2510, lon: -88.7590 },
    { name: "Bridgetown", country: "Barbados", code: "BB", continent: "North America", lat: 13.1132, lon: -59.5988 },
    { name: "Castries", country: "Saint Lucia", code: "LC", continent: "North America", lat: 14.0101, lon: -60.9875 },
    { name: "Guatemala City", country: "Guatemala", code: "GT", continent: "North America", lat: 14.6349, lon: -90.5069 },
    { name: "Havana", country: "Cuba", code: "CU", continent: "North America", lat: 23.1136, lon: -82.3666 },
    { name: "Kingston", country: "Jamaica", code: "JM", continent: "North America", lat: 17.9712, lon: -76.7926 },
    { name: "Kingstown", country: "Saint Vincent and the Grenadines", code: "VC", continent: "North America", lat: 13.1600, lon: -61.2248 },
    { name: "Managua", country: "Nicaragua", code: "NI", continent: "North America", lat: 12.1364, lon: -86.2514 },
    { name: "Mexico City", country: "Mexico", code: "MX", continent: "North America", lat: 19.4326, lon: -99.1332 },
    { name: "Nassau", country: "Bahamas", code: "BS", continent: "North America", lat: 25.0443, lon: -77.3504 },
    { name: "Ottawa", country: "Canada", code: "CA", continent: "North America", lat: 45.4215, lon: -75.6972 },
    { name: "Panama City", country: "Panama", code: "PA", continent: "North America", lat: 8.9824, lon: -79.5199 },
    { name: "Port-au-Prince", country: "Haiti", code: "HT", continent: "North America", lat: 18.5944, lon: -72.3074 },
    { name: "Roseau", country: "Dominica", code: "DM", continent: "North America", lat: 15.3092, lon: -61.3790 },
    { name: "San José", country: "Costa Rica", code: "CR", continent: "North America", lat: 9.9281, lon: -84.0907 },
    { name: "San Juan", country: "Puerto Rico", code: "PR", continent: "North America", lat: 18.4655, lon: -66.1057 },
    { name: "San Salvador", country: "El Salvador", code: "SV", continent: "North America", lat: 13.6929, lon: -89.2182 },
    { name: "Santo Domingo", country: "Dominican Republic", code: "DO", continent: "North America", lat: 18.4861, lon: -69.9312 },
    { name: "Tegucigalpa", country: "Honduras", code: "HN", continent: "North America", lat: 14.0723, lon: -87.1921 },
    { name: "Washington D.C.", country: "United States", code: "US", continent: "North America", lat: 38.9072, lon: -77.0369 },

    // South America
    { name: "Asunción", country: "Paraguay", code: "PY", continent: "South America", lat: -25.2637, lon: -57.5759 },
    { name: "Bogotá", country: "Colombia", code: "CO", continent: "South America", lat: 4.7110, lon: -74.0721 },
    { name: "Brasília", country: "Brazil", code: "BR", continent: "South America", lat: -15.7975, lon: -47.8919 },
    { name: "Buenos Aires", country: "Argentina", code: "AR", continent: "South America", lat: -34.6037, lon: -58.3816 },
    { name: "Caracas", country: "Venezuela", code: "VE", continent: "South America", lat: 10.4806, lon: -66.9036 },
    { name: "Georgetown", country: "Guyana", code: "GY", continent: "South America", lat: 6.8013, lon: -58.1551 },
    { name: "La Paz", country: "Bolivia", code: "BO", continent: "South America", lat: -16.5000, lon: -68.1500 },
    { name: "Lima", country: "Peru", code: "PE", continent: "South America", lat: -12.0464, lon: -77.0428 },
    { name: "Montevideo", country: "Uruguay", code: "UY", continent: "South America", lat: -34.9011, lon: -56.1645 },
    { name: "Paramaribo", country: "Suriname", code: "SR", continent: "South America", lat: 5.8520, lon: -55.2038 },
    { name: "Quito", country: "Ecuador", code: "EC", continent: "South America", lat: -0.1807, lon: -78.4678 },
    { name: "Santiago", country: "Chile", code: "CL", continent: "South America", lat: -33.4489, lon: -70.6693 },
    { name: "Sucre", country: "Bolivia", code: "BO", continent: "South America", lat: -19.0196, lon: -65.2620 },

    // Oceania
    { name: "Apia", country: "Samoa", code: "WS", continent: "Oceania", lat: -13.8507, lon: -171.7514 },
    { name: "Canberra", country: "Australia", code: "AU", continent: "Oceania", lat: -35.2809, lon: 149.1300 },
    { name: "Funafuti", country: "Tuvalu", code: "TV", continent: "Oceania", lat: -8.5167, lon: 179.2167 },
    { name: "Honiara", country: "Solomon Islands", code: "SB", continent: "Oceania", lat: -9.4333, lon: 159.9500 },
    { name: "Majuro", country: "Marshall Islands", code: "MH", continent: "Oceania", lat: 7.0897, lon: 171.3803 },
    { name: "Ngerulmud", country: "Palau", code: "PW", continent: "Oceania", lat: 7.5000, lon: 134.6242 },
    { name: "Nuku'alofa", country: "Tonga", code: "TO", continent: "Oceania", lat: -21.1390, lon: -175.2049 },
    { name: "Palikir", country: "Micronesia", code: "FM", continent: "Oceania", lat: 6.9147, lon: 158.1610 },
    { name: "Port Moresby", country: "Papua New Guinea", code: "PG", continent: "Oceania", lat: -9.4438, lon: 147.1803 },
    { name: "Port Vila", country: "Vanuatu", code: "VU", continent: "Oceania", lat: -17.7333, lon: 168.3273 },
    { name: "Suva", country: "Fiji", code: "FJ", continent: "Oceania", lat: -18.1248, lon: 178.4501 },
    { name: "Tarawa", country: "Kiribati", code: "KI", continent: "Oceania", lat: 1.3282, lon: 172.9750 },
    { name: "Wellington", country: "New Zealand", code: "NZ", continent: "Oceania", lat: -41.2865, lon: 174.7762 }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Set current date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Detect user location
    detectUserLocation();
    
    // Set default city (Dhaka)
    getWeatherData('Dhaka', 'Bangladesh');
    
    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    cityInput.addEventListener('input', handleInput);
    cityInput.addEventListener('focus', showPopularCapitals);
    
    themeToggle.addEventListener('click', toggleTheme);
    aboutBtn.addEventListener('click', showAboutModal);
    
    // Close modal when clicking outside
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.add('hidden');
        }
    });
    
    // Close modal with close button
    document.querySelector('.close-modal').addEventListener('click', () => {
        aboutModal.classList.add('hidden');
    });
    
    // Forecast control buttons
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            chartType = e.currentTarget.dataset.type;
            if (forecastData.length > 0) {
                updateForecastChart(forecastData, chartType);
            }
        });
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeButton('dark');
    }
});

// Show About Modal
function showAboutModal() {
    aboutModal.classList.remove('hidden');
}

// Detect user location using IP-based geolocation
async function detectUserLocation() {
    try {
        // Using a free IP geolocation service
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        userCity = data.city;
        userCountry = data.country_name;
        
        userLocation.textContent = `${userCity}, ${userCountry}`;
        
        // Get weather for user's location
        getWeatherData(userCity, userCountry, true);
        
    } catch (error) {
        console.error('Error detecting location:', error);
        // Fallback to a default city
        userCity = 'Dhaka';
        userCountry = 'Bangladesh';
        userLocation.textContent = `${userCity}, ${userCountry}`;
        getWeatherData(userCity, userCountry, true);
    }
}

// Handle city search
function handleSearch() {
    const query = cityInput.value.trim();
    if (query) {
        const [city, country] = parseSearchQuery(query);
        getWeatherData(city, country, false);
        suggestions.classList.add('hidden');
        cityInput.value = '';
    }
}

// Parse search query to extract city and country
function parseSearchQuery(query) {
    // Check if query contains a comma (city, country format)
    if (query.includes(',')) {
        const parts = query.split(',').map(part => part.trim());
        return [parts[0], parts[1] || ''];
    }
    
    // Check if query matches any capital city
    const capital = worldCapitals.find(c => 
        c.name.toLowerCase() === query.toLowerCase() || 
        c.country.toLowerCase() === query.toLowerCase()
    );
    
    if (capital) {
        return [capital.name, capital.country];
    }
    
    // Default to city name only
    return [query, ''];
}

// Handle input for suggestions
function handleInput() {
    const query = cityInput.value.trim().toLowerCase();
    
    if (query.length === 0) {
        showPopularCapitals();
        return;
    }
    
    // Filter capitals based on input
    const filteredCapitals = worldCapitals.filter(capital => 
        capital.name.toLowerCase().includes(query) || 
        capital.country.toLowerCase().includes(query)
    );
    
    showSuggestions(filteredCapitals);
}

// Show popular capitals in suggestions
function showPopularCapitals() {
    // Show a mix of popular capitals
    const popular = ['Dhaka', 'London', 'New Delhi', 'Tokyo', 'Paris', 'Washington D.C.', 'Dubai', 'Sydney'];
    const popularCapitals = worldCapitals.filter(capital => 
        popular.includes(capital.name)
    );
    showSuggestions(popularCapitals);
}

// Display suggestions with flags
function showSuggestions(capitals) {
    suggestions.innerHTML = '';
    
    if (capitals.length === 0) {
        suggestions.classList.add('hidden');
        return;
    }
    
    // Limit to 10 suggestions for performance
    capitals.slice(0, 10).forEach(capital => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        
        // Create flag using country code (using emoji as placeholder)
        const flag = getFlagEmoji(capital.code);
        
        item.innerHTML = `
            <span class="suggestion-flag">${flag}</span>
            <div class="suggestion-text">
                <span class="suggestion-name">${capital.name}</span>
                <span class="suggestion-country">${capital.country}</span>
            </div>
            <span class="suggestion-type">${capital.continent}</span>
        `;
        item.addEventListener('click', () => {
            cityInput.value = `${capital.name}, ${capital.country}`;
            getWeatherData(capital.name, capital.country, false);
            suggestions.classList.add('hidden');
        });
        suggestions.appendChild(item);
    });
    
    suggestions.classList.remove('hidden');
}

// Get flag emoji from country code
function getFlagEmoji(countryCode) {
    if (!countryCode) return '🏴';
    
    // Convert country code to flag emoji
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    
    return String.fromCodePoint(...codePoints);
}

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        suggestions.classList.add('hidden');
    }
});

// Fetch real weather data from OpenWeatherMap
async function getWeatherData(city, country = '', isUserLocation = false) {
    try {
        // Show loading state
        setLoadingState(true);
        
        // For demo purposes, we'll use mock data since we don't have a real API key
        // In a real application, you would use the code below:
        
        /*
        // Build API URL
        const query = country ? `${city},${country}` : city;
        const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        */
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for demonstration (replace with real API call)
        const mockWeatherData = generateMockWeatherData(city, country);
        
        if (mockWeatherData.cod === '404') {
            showError();
            return;
        }
        
        // Hide error message if previously shown
        hideError();
        
        // Update UI with weather data
        updateCurrentWeather(mockWeatherData, isUserLocation);
        forecastData = mockWeatherData.forecast;
        updateForecastChart(forecastData, chartType);
        updateForecastCards(forecastData);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError();
    } finally {
        setLoadingState(false);
    }
}

// Generate realistic mock weather data
function generateMockWeatherData(city, country = '') {
    // Find the capital to get coordinates
    const capital = worldCapitals.find(c => 
        c.name.toLowerCase() === city.toLowerCase() || 
        (country && c.country.toLowerCase() === country.toLowerCase())
    );
    
    if (!capital) {
        return { cod: '404', message: 'city not found' };
    }
    
    // Generate realistic weather data based on location and current time
    const now = new Date();
    const month = now.getMonth();
    const hour = now.getHours();
    const isDaytime = hour > 6 && hour < 18;
    
    // Seasonal temperature variations
    let baseTemp;
    if (capital.lat > 40) { // Northern hemisphere
        baseTemp = month >= 3 && month <= 8 ? 20 : 5; // Summer: 20°C, Winter: 5°C
    } else if (capital.lat < -40) { // Southern hemisphere
        baseTemp = month >= 3 && month <= 8 ? 5 : 20; // Winter: 5°C, Summer: 20°C
    } else { // Tropical regions
        baseTemp = 25; // Consistent warm temperature
    }
    
    // Add daily variation (-5°C at night, +5°C during day)
    const dailyVariation = isDaytime ? 5 : -5;
    const currentTemp = baseTemp + dailyVariation + (Math.random() * 10 - 5);
    
    // Weather conditions based on location and season
    const conditions = getRealisticConditions(capital, month, isDaytime);
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Generate forecast data for 7 days
    const forecast = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        // Temperature trend (slight variation each day)
        const dayTemp = currentTemp + (Math.random() * 6 - 3);
        
        forecast.push({
            date: date.toISOString().split('T')[0],
            temp: Math.round(dayTemp),
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            precipitation: Math.floor(Math.random() * 100),
            humidity: Math.floor(Math.random() * 50) + 30
        });
    }
    
    // Calculate timezone offset based on longitude
    const timezoneOffset = Math.round(capital.lon / 15);
    const timezone = `UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;
    
    // Calculate location time
    const locationTime = new Date(now.getTime() + (timezoneOffset * 60 * 60 * 1000));
    
    return {
        name: city,
        country: country || capital.country,
        continent: capital.continent,
        coord: { lat: capital.lat, lon: capital.lon },
        timezone: timezone,
        locationTime: locationTime,
        main: {
            temp: currentTemp,
            feels_like: currentTemp + (Math.random() * 4 - 2),
            humidity: Math.floor(Math.random() * 50) + 30,
            pressure: Math.floor(Math.random() * 100) + 1000
        },
        weather: [{ main: condition, description: condition.toLowerCase() }],
        wind: { speed: (Math.random() * 10).toFixed(1) },
        visibility: (Math.random() * 10 + 5).toFixed(1),
        sys: {
            sunrise: new Date(now.setHours(6, 0, 0, 0)),
            sunset: new Date(now.setHours(18, 0, 0, 0))
        },
        forecast: forecast
    };
}

// Get realistic weather conditions based on location and season
function getRealisticConditions(capital, month, isDaytime) {
    const lat = Math.abs(capital.lat);
    
    if (lat > 60) { // Polar regions
        return ['Snow', 'Clouds', 'Clear'];
    } else if (lat > 40) { // Temperate regions
        if (month >= 3 && month <= 8) { // Summer
            return ['Clear', 'Clouds', 'Rain'];
        } else { // Winter
            return ['Clouds', 'Rain', 'Snow', 'Clear'];
        }
    } else if (lat > 23.5) { // Subtropical
        return ['Clear', 'Clouds', 'Rain'];
    } else { // Tropical
        return isDaytime ? ['Clear', 'Clouds'] : ['Clouds', 'Rain', 'Clear'];
    }
}

// Update current weather display with time comparison
function updateCurrentWeather(data, isUserLocation = false) {
    cityName.textContent = `${data.name}, ${data.country}`;
    fullLocation.textContent = `${data.name}, ${data.country} (Lat: ${data.coord.lat.toFixed(2)}, Lon: ${data.coord.lon.toFixed(2)})`;
    continent.textContent = data.continent;
    timeZone.textContent = data.timezone;
    
    currentTemp.textContent = Math.round(data.main.temp);
    weatherCondition.textContent = data.weather[0].main;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${data.visibility} km`;
    
    // Sunrise and sunset
    sunrise.textContent = data.sys.sunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    sunset.textContent = data.sys.sunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Additional info
    precipitation.textContent = `${Math.floor(Math.random() * 100)}%`;
    uvIndex.textContent = Math.floor(Math.random() * 11);
    
    // Update location time
    updateLocationTime(data.locationTime);
    
    // Calculate and display time difference if not user's location
    if (!isUserLocation) {
        calculateTimeDifference(data.locationTime);
        timeDifference.classList.remove('hidden');
    } else {
        timeDifference.classList.add('hidden');
    }
    
    // Update weather icon based on condition with specific animations
    updateWeatherIcon(data.weather[0].main);
    
    // Add fade-in animation
    document.querySelector('.current-weather').classList.add('fade-in');
    setTimeout(() => {
        document.querySelector('.current-weather').classList.remove('fade-in');
    }, 500);
}

// Update location time display
function updateLocationTime(locationTime) {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    locationDate.textContent = locationTime.toLocaleDateString('en-US', dateOptions);
}

// Calculate time difference between user and location
function calculateTimeDifference(locationTime) {
    const userTime = new Date();
    const diffMs = locationTime - userTime;
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    
    let differenceText;
    if (diffHours === 0) {
        differenceText = 'Same time zone';
    } else if (diffHours > 0) {
        differenceText = `${diffHours} hours ahead`;
    } else {
        differenceText = `${Math.abs(diffHours)} hours behind`;
    }
    
    document.querySelector('.difference-value').textContent = differenceText;
}

// Update weather icon based on condition with specific animations
function updateWeatherIcon(condition) {
    const iconMap = {
        'Clear': 'fa-sun clear',
        'Clouds': 'fa-cloud clouds',
        'Rain': 'fa-cloud-rain rain',
        'Drizzle': 'fa-cloud-drizzle rain',
        'Thunderstorm': 'fa-bolt',
        'Snow': 'fa-snowflake',
        'Mist': 'fa-smog',
        'Smoke': 'fa-smog',
        'Haze': 'fa-smog',
        'Dust': 'fa-smog',
        'Fog': 'fa-smog',
        'Sand': 'fa-smog',
        'Ash': 'fa-smog',
        'Squall': 'fa-wind',
        'Tornado': 'fa-tornado'
    };
    
    const iconClass = iconMap[condition] || 'fa-sun clear';
    weatherIcon.className = `fas ${iconClass} animated-icon`;
}

// Update current date and time display for user
function updateDateTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    userTime.textContent = now.toLocaleTimeString('en-US', timeOptions);
    userDate.textContent = now.toLocaleDateString('en-US', dateOptions);
}

// Update the forecast chart
function updateForecastChart(forecastData, type = 'temperature') {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (forecastChart) {
        forecastChart.destroy();
    }
    
    // Prepare data for chart
    const labels = forecastData.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    const data = forecastData.map(day => 
        type === 'temperature' ? day.temp : 
        type === 'precipitation' ? day.precipitation : day.humidity
    );
    
    const label = type === 'temperature' ? 'Temperature (°C)' : 
                 type === 'precipitation' ? 'Precipitation (%)' : 'Humidity (%)';
    
    const color = type === 'temperature' ? 'rgba(37, 99, 235, 1)' : 
                 type === 'precipitation' ? 'rgba(124, 58, 237, 1)' : 'rgba(16, 185, 129, 1)';
    
    // Create gradient for chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, type === 'temperature' ? 'rgba(37, 99, 235, 0.8)' : 
                         type === 'precipitation' ? 'rgba(124, 58, 237, 0.8)' : 'rgba(16, 185, 129, 0.8)');
    gradient.addColorStop(1, type === 'temperature' ? 'rgba(37, 99, 235, 0.2)' : 
                         type === 'precipitation' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(16, 185, 129, 0.2)');
    
    // Create the chart
    forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: gradient,
                borderColor: color,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                pointBorderColor: color,
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: color,
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const condition = forecastData[index].condition;
                            const value = context.parsed.y;
                            const unit = type === 'temperature' ? '°C' : '%';
                            return `${value}${unit}, ${condition}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: type !== 'temperature',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + (type === 'temperature' ? '°C' : '%');
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Update forecast cards
function updateForecastCards(forecastData) {
    const forecastCards = document.querySelector('.forecast-cards');
    forecastCards.innerHTML = '';
    
    forecastData.forEach(day => {
        const date = new Date(day.date);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        const iconClass = getWeatherIconClass(day.condition);
        
        card.innerHTML = `
            <div class="forecast-day">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="forecast-date">${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}</div>
            <div class="forecast-icon">
                <i class="fas ${iconClass} animated-icon"></i>
            </div>
            <div class="forecast-temp">${day.temp}°C</div>
            <div class="forecast-condition">${day.condition}</div>
            <div class="forecast-precipitation">${day.precipitation}%</div>
        `;
        
        forecastCards.appendChild(card);
    });
}

// Get weather icon class for forecast
function getWeatherIconClass(condition) {
    const iconMap = {
        'Clear': 'fa-sun',
        'Clouds': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Snow': 'fa-snowflake',
        'Thunderstorm': 'fa-bolt'
    };
    
    return iconMap[condition] || 'fa-sun';
}

// Show error message
function showError() {
    errorMessage.classList.remove('hidden');
}

// Hide error message
function hideError() {
    errorMessage.classList.add('hidden');
}

// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        searchBtn.disabled = true;
        document.body.classList.add('loading');
    } else {
        searchBtn.innerHTML = '<i class="fas fa-chart-line"></i> Analyze';
        searchBtn.disabled = false;
        document.body.classList.remove('loading');
    }
}

// Toggle between dark and light mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        updateThemeButton('dark');
    } else {
        localStorage.setItem('theme', 'light');
        updateThemeButton('light');
    }
}

// Update theme toggle button
function updateThemeButton(theme) {
    if (theme === 'dark') {
        themeToggle.querySelector('i').className = 'fas fa-sun';
    } else {
        themeToggle.querySelector('i').className = 'fas fa-moon';
    }
}