// טעינת נתונים
let instrumentsData = [];
let stylesData = [];
let moodsData = [];

// מצב אפליקציה
const state = {
    selectedInstruments: [],
    selectedStyle: null,
    selectedMood: null,
    tempo: 110,
    keywords: [],
    customTitle: ''
};

// טעינת JSON
async function loadData() {
    try {
        const [instrumentsRes, stylesRes, moodsRes] = await Promise.all([
            fetch('data/instruments.json'),
            fetch('data/styles.json'),
            fetch('data/moods.json')
        ]);
        
        instrumentsData = (await instrumentsRes.json()).instruments;
        stylesData = (await stylesRes.json()).styles;
        moodsData = (await moodsRes.json()).moods;
        
        renderAll();
    } catch (error) {
        console.error('שגיאה בטעינת נתונים:', error);
    }
}

// רינדור כלי נגינה
function renderInstruments() {
    const container = document.getElementById('instruments-container');
    container.innerHTML = '';
    
    const categories = [...new Set(instrumentsData.map(inst => inst.category))];
    
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'instrument-category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);
        
        const grid = document.createElement('div');
        grid.className = 'instruments-grid';
        
        const categoryInstruments = instrumentsData.filter(inst => inst.category === category);
        
        categoryInstruments.forEach(instrument => {
            const item = document.createElement('div');
            item.className = 'instrument-item';
            item.dataset.id = instrument.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `inst-${instrument.id}`;
            checkbox.value = instrument.id;
            checkbox.checked = state.selectedInstruments.includes(instrument.id);
            
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    state.selectedInstruments.push(instrument.id);
                } else {
                    state.selectedInstruments = state.selectedInstruments.filter(id => id !== instrument.id);
                }
                updateInstrumentItem(item, instrument.id);
            });
            
            const label = document.createElement('label');
            label.htmlFor = `inst-${instrument.id}`;
            label.innerHTML = `<span>${instrument.emoji}</span> <span>${instrument.name}</span>`;
            
            item.appendChild(checkbox);
            item.appendChild(label);
            updateInstrumentItem(item, instrument.id);
            
            grid.appendChild(item);
        });
        
        categoryDiv.appendChild(grid);
        container.appendChild(categoryDiv);
    });
}

function updateInstrumentItem(item, id) {
    if (state.selectedInstruments.includes(id)) {
        item.classList.add('selected');
    } else {
        item.classList.remove('selected');
    }
}

// רינדור סגנונות
function renderStyles() {
    const container = document.getElementById('styles-container');
    container.innerHTML = '';
    
    stylesData.forEach(style => {
        const item = document.createElement('div');
        item.className = 'style-item';
        if (state.selectedStyle === style.id) {
            item.classList.add('selected');
        }
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'style';
        radio.id = `style-${style.id}`;
        radio.value = style.id;
        radio.checked = state.selectedStyle === style.id;
        
        radio.addEventListener('change', () => {
            state.selectedStyle = style.id;
            renderStyles();
        });
        
        item.innerHTML = `
            <div class="emoji">${style.emoji}</div>
            <div class="name">${style.name}</div>
            <div class="description">${style.description}</div>
        `;
        
        item.appendChild(radio);
        item.addEventListener('click', () => {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        });
        
        container.appendChild(item);
    });
}

// רינדור מצבי רוח
function renderMoods() {
    const container = document.getElementById('moods-container');
    container.innerHTML = '';
    
    moodsData.forEach(mood => {
        const item = document.createElement('div');
        item.className = 'mood-item';
        if (state.selectedMood === mood.id) {
            item.classList.add('selected');
        }
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'mood';
        radio.id = `mood-${mood.id}`;
        radio.value = mood.id;
        radio.checked = state.selectedMood === mood.id;
        
        radio.addEventListener('change', () => {
            state.selectedMood = mood.id;
            renderMoods();
        });
        
        item.innerHTML = `
            <div class="emoji">${mood.emoji}</div>
            <div class="name">${mood.name}</div>
        `;
        
        item.appendChild(radio);
        item.addEventListener('click', () => {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        });
        
        container.appendChild(item);
    });
}

// הגדרת קצב
function setupTempo() {
    const slider = document.getElementById('tempo-slider');
    const display = document.getElementById('tempo-value');
    
    slider.value = state.tempo;
    display.textContent = state.tempo;
    
    slider.addEventListener('input', (e) => {
        state.tempo = parseInt(e.target.value);
        display.textContent = state.tempo;
    });
    
    // כפתורי preset
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tempo = parseInt(btn.dataset.tempo);
            state.tempo = tempo;
            slider.value = tempo;
            display.textContent = tempo;
        });
    });
}

// מילות מפתח
function setupKeywords() {
    const input = document.getElementById('keywords-input');
    const addBtn = document.getElementById('add-keywords-btn');
    const list = document.getElementById('keywords-list');
    
    function renderKeywords() {
        list.innerHTML = '';
        state.keywords.forEach(keyword => {
            const tag = document.createElement('div');
            tag.className = 'keyword-tag';
            tag.innerHTML = `
                <span>${keyword}</span>
                <span class="remove" data-keyword="${keyword}">×</span>
            `;
            
            tag.querySelector('.remove').addEventListener('click', () => {
                state.keywords = state.keywords.filter(k => k !== keyword);
                renderKeywords();
            });
            
            list.appendChild(tag);
        });
    }
    
    addBtn.addEventListener('click', () => {
        const keywords = input.value.split(',').map(k => k.trim()).filter(k => k);
        keywords.forEach(k => {
            if (!state.keywords.includes(k)) {
                state.keywords.push(k);
            }
        });
        input.value = '';
        renderKeywords();
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });
    
    renderKeywords();
}

// כותרת מותאמת
function setupCustomTitle() {
    const input = document.getElementById('custom-title');
    input.addEventListener('input', (e) => {
        state.customTitle = e.target.value;
    });
}

// יצירת פרומפט
function generatePrompt() {
    if (!state.selectedStyle || !state.selectedMood) {
        alert('אנא בחר סגנון ומצב רוח');
        return;
    }
    
    const selectedInstruments = instrumentsData.filter(inst => 
        state.selectedInstruments.includes(inst.id)
    );
    
    const selectedStyle = stylesData.find(s => s.id === state.selectedStyle);
    const selectedMood = moodsData.find(m => m.id === state.selectedMood);
    
    // בניית פרומפט
    const instrumentNames = selectedInstruments.map(inst => inst.name).join(', ');
    const moodKeywords = selectedMood.keywords.join(', ');
    const allKeywords = [...state.keywords, ...selectedMood.keywords].join(', ');
    
    const title = state.customTitle || `יצירה ${selectedStyle.name} ${selectedMood.name}`;
    
    const promptText = `${selectedStyle.emoji} **${title}**

🎚 **סגנון:** ${selectedStyle.name} - ${selectedStyle.description}
🎛 **כלי נגינה:** ${instrumentNames || 'מגוון כלים'}
🌡 **מצב רוח:** ${selectedMood.name} ${selectedMood.emoji}
⏱ **קצב:** ${state.tempo} BPM
🎧 **מילות מפתח:** ${allKeywords}

🧠 **Prompt for StableAudio:**

"${selectedStyle.name} ${selectedStyle.description.toLowerCase()}, featuring ${instrumentNames || 'a rich orchestral arrangement'}. The track conveys a ${selectedMood.name.toLowerCase()} mood with ${moodKeywords}. ${state.tempo} BPM, cinematic mastering with ${selectedStyle.name.toLowerCase()} elements."`;

    // הצגת תוצאה
    const resultSection = document.getElementById('result-section');
    const resultDiv = document.getElementById('prompt-result');
    resultDiv.textContent = promptText;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// העתקה
function setupCopy() {
    document.getElementById('copy-btn').addEventListener('click', () => {
        const text = document.getElementById('prompt-result').textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('הפרומפט הועתק ל-clipboard!');
        });
    });
}

// הורדה
function setupDownload() {
    document.getElementById('download-btn').addEventListener('click', () => {
        const text = document.getElementById('prompt-result').textContent;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `soundflow-prompt-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// איפוס
function setupReset() {
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('האם אתה בטוח שברצונך לאפס הכל?')) {
            state.selectedInstruments = [];
            state.selectedStyle = null;
            state.selectedMood = null;
            state.tempo = 110;
            state.keywords = [];
            state.customTitle = '';
            
            document.getElementById('custom-title').value = '';
            document.getElementById('keywords-input').value = '';
            document.getElementById('result-section').style.display = 'none';
            
            renderAll();
            setupTempo();
        }
    });
}

// הגדרת כפתור יצירה
function setupGenerate() {
    document.getElementById('generate-btn').addEventListener('click', generatePrompt);
}

// רינדור הכל
function renderAll() {
    renderInstruments();
    renderStyles();
    renderMoods();
}

// אתחול
function init() {
    loadData();
    setupTempo();
    setupKeywords();
    setupCustomTitle();
    setupGenerate();
    setupCopy();
    setupDownload();
    setupReset();
}

// הפעלה כשהדף נטען
document.addEventListener('DOMContentLoaded', init);

