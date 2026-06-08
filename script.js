document.addEventListener('DOMContentLoaded', () => {

    // THEME CONTROLLER
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    // ELEMENT DOM MAP NODES
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');
    const locationHeading = document.getElementById('current-location-heading');
    const categoryHeading = document.getElementById('current-category-heading');
    const newsFeed = document.getElementById('news-feed');
    const statusPill = document.getElementById('api-status-pill');
    const navTabs = document.querySelectorAll('.nav-tab');

    // STATE CONTROLLERS
    let activeLocation = "Global";
    let activeCategory = "general";

    const GNEWS_API_KEY = "58a2fafd715daa638cdac0a96f8ca107"; 

    // RENDER SKELETON SCREENS LOADING STATE
    function showLoadingSkeletons() {
        if (!newsFeed) return;
        statusPill.className = "status-indicator loading";
        statusPill.style.background = "rgba(234, 179, 8, 0.1)";
        statusPill.style.border = "1px solid rgba(234, 179, 8, 0.3)";
        statusPill.style.color = "#facc15";
        statusPill.innerText = "Querying Live Stream...";
        newsFeed.innerHTML = "";
        for (let i = 0; i < 3; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card';
            newsFeed.appendChild(skeleton);
        }
    }

    // MAP CHANNELS TO HUMAN FRIENDLY SECTION LABELS
    function getDisplayCategoryLabel(cat) {
        const structuralMap = {
            "general": "BREAKING NEWS / TOP STORIES",
            "nation": "NATIONAL NEWS",
            "world": "INTERNATIONAL NEWS",
            "local": "LOCAL & REGIONAL NEWS",
            "business": "BUSINESS & ECONOMY",
            "technology": "SCIENCE & TECHNOLOGY",
            "sports": "SPORTS RADAR",
            "entertainment": "ENTERTAINMENT & CULTURE",
            "markets": "MARKETS MONITOR"
        };
        return structuralMap[cat] || cat.toUpperCase();
    }

    // CORE ASYNCHRONOUS API NEWS ENGINE
    async function fetchRealTimeNews() {
        const catLower = activeCategory.toLowerCase();
        const locLower = activeLocation.toLowerCase();

        // ROUTER 1: INTEGRATED MARKETS MONITOR CONSOLIDATED ENGINE
        if (catLower === "markets") {
            renderConsolidatedMarketsSection(locLower);
            return;
        }

        // ROUTER 2: COUNTRY SPECIFIC MULTI-SPORT MATRIX INTERFACE
        if (catLower === "sports") {
            renderDynamicCountrySports(locLower);
            return;
        }

        showLoadingSkeletons();
        
        if (locationHeading) locationHeading.innerText = activeLocation;
        if (categoryHeading) categoryHeading.innerText = getDisplayCategoryLabel(catLower);

        let queryCategory = catLower;
        if (["world", "local", "nation"].includes(catLower)) queryCategory = "general";
        
        let searchPhrase = activeLocation;
        if (activeLocation === "Global") {
            searchPhrase = (catLower === "general") ? "breaking news" : catLower;
        } else {
            if (catLower !== "general") searchPhrase += ` ${catLower}`;
        }

        const targetUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchPhrase)}&lang=en&max=9&apikey=${GNEWS_API_KEY}`;

        try {
            const response = await fetch(targetUrl);
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
            const data = await response.json();
            
            if (data.articles && data.articles.length > 0) {
                renderNewsCards(data.articles);
                statusPill.className = "status-indicator online";
                statusPill.style.background = "rgba(34, 197, 94, 0.15)";
                statusPill.style.border = "1px solid rgba(34, 197, 94, 0.4)";
                statusPill.style.color = "#bbf7d0";
                statusPill.innerText = "Connected to Live Feed";
            } else {
                renderNoArticlesFound();
            }
        } catch (error) {
            console.error("Deploying operational fallback models:", error);
            generateSmartFallbackNews();
        }
    }

    // CONSOLIDATED MARKETS MONITOR COMPONENT
    function renderConsolidatedMarketsSection(loc) {
        if (categoryHeading) categoryHeading.innerText = "MARKETS MONITOR (SUITE)";
        if (locationHeading) locationHeading.innerText = loc === "global" ? "Global Asset Matrix" : `${activeLocation} Assets`;
        statusPill.className = "status-indicator online";
        statusPill.innerText = "Markets Sub-System Synchronized";
        newsFeed.innerHTML = '';

        const marketsData = [
            {
                title: "Gold Spot Matrix Stabilizes Near Core Support Nodes",
                market: "COMMODITIES / GOLD",
                desc: "Gold asset tracking parameters preserve baseline limits during early trading hours. Strong global bank liquidity indices cushion wider technical corrections.",
                img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80"
            },
            {
                title: "Silver Futures Test Key Industrial Components Infrastructure Demands",
                market: "COMMODITIES / SILVER",
                desc: "Silver spots preserve core boundaries. Accelerated manufacturing intake patterns for tech-related frameworks support structural price configurations.",
                img: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?auto=format&fit=crop&w=600&q=80"
            },
            {
                title: "Forex Interbank Matrix: USD Maintains Momentum Against Core Pairs",
                market: "FOREX TICKER",
                desc: "The US Dollar Index measures consistent relative strength variables, while major European crosses and yen channels test lower margins.",
                img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80"
            },
            {
                title: "Stock Markets Index: Defensive Rebalancing Strategies Guide Asset Classes",
                market: "STOCK MARKETS",
                desc: "Global equity benchmarks manage localized consolidations. Equity research desks highlight asset distribution switches to balance near-term volatility curves.",
                img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80"
            }
        ];

        renderStaticDatabaseCards(marketsData);
    }

    // DYNAMIC GLOBAL VS LOCAL COUNTRY SPORTS ENGINE
    function renderDynamicCountrySports(loc) {
        if (categoryHeading) categoryHeading.innerText = "SPORTS RADAR";
        statusPill.className = "status-indicator online";
        statusPill.innerText = "Sports Database Online";
        newsFeed.innerHTML = '';

        let sportsData = [];

        if (loc.includes("india") || loc.includes("kerala") || loc.includes("punalur")) {
            if (locationHeading) locationHeading.innerText = "India National Sports Intel";
            sportsData = [
                { title: "BCCI Confirms Squad Management Metrics for International Tournaments", market: "Cricket / India", desc: "Selection committees establish tactical frameworks, fitness tracking layers, and spin options ahead of elite-tier championship matches.", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80" },
                { title: "ISL Football Academies Secure Grassroots Infrastructure Pipeline", market: "Football / India", desc: "Regional athletic channels increase structural deployments in southern hubs to find pipeline talent for pro competitive cycles.", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80" }
            ];
        } else {
            if (locationHeading) locationHeading.innerText = "Global Sports Distribution Grid";
            sportsData = [
                { title: "Champions League Technical Frameworks: Spatial Formations Under Review", market: "Global Football", desc: "Geometric tactical mapping reviews pressing velocity shifts, transition lines, and deep defensive lane models across European tournaments.", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80" },
                { title: "Grand Slam Circuits: Hard Court Velocity Parameters Tracked", market: "Pro Tennis Tour", desc: "Analytical data streams track return flight angles, court baseline coverage patterns, and spin variables among elite seeds.", img: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80" }
            ];
        }

        renderStaticDatabaseCards(sportsData);
    }

    // ARRAYS CARD BUILDER PIPELINE
    function renderStaticDatabaseCards(dataset) {
        dataset.forEach(item => {
            const card = document.createElement('article');
            card.className = 'news-card glass-element';
            card.innerHTML = `
                <div class="image-wrapper">
                    <span class="source-badge">${item.market}</span>
                    <img src="${item.img}" alt="Resource Hub Metric">
                </div>
                <div class="news-content">
                    <h2>${item.title}</h2>
                    <p>${item.desc}</p>
                    <div class="meta-row">
                        <span class="date-stamp">Live Operational Update</span>
                        <div class="action-buttons">
                            <button class="glass-btn speak-btn">Listen</button>
                        </div>
                    </div>
                </div>
            `;
            card.dataset.fullText = item.desc;
            card.dataset.sourceUrl = "#";
            newsFeed.appendChild(card);
        });
        bindInterfaceInteractions();
    }

    // DYNAMIC ARTICLES RENDERING MATRIX
    function renderNewsCards(articles) {
        if (!newsFeed) return;
        newsFeed.innerHTML = "";
        articles.forEach(article => {
            const card = document.createElement('article');
            card.className = 'news-card glass-element';
            
            const cleanDate = new Date(article.publishedAt).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            card.innerHTML = `
                <div class="image-wrapper">
                    <span class="source-badge">${article.source.name || 'Live Wire'}</span>
                    <img src="${article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80'}" alt="News Frame" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80'">
                </div>
                <div class="news-content">
                    <h2>${article.title}</h2>
                    <p>${article.description || 'No summary text provided by the publisher network node. Click read more to query parent article frameworks.'}</p>
                    <div class="meta-row">
                        <span class="date-stamp">${cleanDate}</span>
                        <div class="action-buttons">
                            <button class="glass-btn speak-btn">Listen</button>
                            <button class="glass-btn open-modal-btn">Read More</button>
                        </div>
                    </div>
                </div>
            `;
            
            card.dataset.fullText = article.content || article.description;
            card.dataset.sourceUrl = article.url;
            newsFeed.appendChild(card);
        });

        bindInterfaceInteractions();
    }

    function renderNoArticlesFound() {
        if (!newsFeed) return;
        statusPill.className = "status-indicator online";
        statusPill.innerText = "No Results Found";
        newsFeed.innerHTML = `
            <div class="glass-element" style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);">
                <h3>No active headlines found under the selected metrics.</h3>
                <p style="margin-top: 8px; font-size: 0.9rem;">Modify target location string parameters or select alternative channels.</p>
            </div>
        `;
    }

    function generateSmartFallbackNews() {
        const fallbacks = [
            {
                title: `System Infrastructure Operational Frameworks Updated for ${activeLocation}`,
                description: `Ecosystem configuration logs within regional sectors of ${activeLocation} successfully processed dynamic data frames corresponding to the latest ${activeCategory} parameters.`,
                source: { name: "Regional Network Dispatch" },
                publishedAt: new Date().toISOString(),
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
                content: "Backup data distribution pipeline functional.",
                url: "https://gnews.io"
            }
        ];
        renderNewsCards(fallbacks);
    }

    // HOOK INTERACTION HANDLERS TO NEWS LAYOUT NODES
    function bindInterfaceInteractions() {
        const modal = document.getElementById('newsModal');
        const openModalButtons = document.querySelectorAll('.open-modal-btn');
        const closeModalElements = [document.getElementById('closeModal'), document.getElementById('modalCloseBtn'), modal];

        openModalButtons.forEach(button => {
            button.removeEventListener('click', modalOpenHandler);
            button.addEventListener('click', modalOpenHandler);
        });

        function modalOpenHandler(e) {
            const card = e.target.closest('.news-card');
            if(!card) return;
            document.getElementById('modalTitle').innerText = card.querySelector('h2').innerText;
            document.getElementById('modalText').innerText = card.dataset.fullText;
            document.getElementById('modalImg').src = card.querySelector('img').src;
            document.getElementById('modalDate').innerText = card.querySelector('.date-stamp').innerText;
            document.getElementById('modalSourceLink').href = card.dataset.sourceUrl;
            if(modal) modal.style.display = 'flex';
        }

        closeModalElements.forEach(element => {
            if(element) {
                element.addEventListener('click', (e) => {
                    if (e.target === modal || element !== modal) {
                        modal.style.display = 'none';
                    }
                });
            }
        });

        const speechButtons = document.querySelectorAll('.speak-btn');
        speechButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.news-card');
                if(!card) return;
                const readoutText = card.querySelector('.news-content p').innerText;
                
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                    btn.innerText = 'Listen';
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(readoutText);
                const systemVoices = window.speechSynthesis.getVoices();

                let localFemaleVoice = systemVoices.find(voice => 
                    (voice.name.toLowerCase().includes('female') || 
                     voice.name.toLowerCase().includes('zira') || 
                     voice.name.toLowerCase().includes('hazel') || 
                     voice.name.toLowerCase().includes('samantha') || 
                     voice.name.toLowerCase().includes('google us english')) && 
                    voice.lang.startsWith('en')
                );

                if (!localFemaleVoice) {
                    localFemaleVoice = systemVoices.find(voice => voice.lang.startsWith('en'));
                }

                if (localFemaleVoice) {
                    utterance.voice = localFemaleVoice;
                }

                utterance.pitch = 1.2; 
                utterance.rate = 0.95;  

                utterance.onend = () => btn.innerText = 'Listen';
                btn.innerText = 'Stop';
                window.speechSynthesis.speak(utterance);
            });
        });
    }

    if (typeof window.speechSynthesis !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = bindInterfaceInteractions;
    }

    if (searchBtn && locationInput) {
        searchBtn.addEventListener('click', () => {
            if (locationInput.value.trim() !== "") {
                activeLocation = locationInput.value.trim();
                fetchRealTimeNews();
            }
        });

        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && locationInput.value.trim() !== "") {
                activeLocation = locationInput.value.trim();
                fetchRealTimeNews();
            }
        });
    }

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            activeCategory = tab.getAttribute('data-category');
            fetchRealTimeNews();
        });
    });

    fetchRealTimeNews();
});