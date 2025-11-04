// אפקטים אינטראקטיביים לעמוד

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('audio-player');
    const verses = document.querySelectorAll('.verse');
    
    // הוספת אפקט הדגשה לבתים בזמן נגינה
    if (audio) {
        audio.addEventListener('timeupdate', function() {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            
            // הסרת הדגשה קודמת
            verses.forEach(verse => verse.classList.remove('highlight-verse'));
            
            // חישוב איזה בית להדגיש לפי זמן
            if (duration > 0) {
                const progress = currentTime / duration;
                
                // הדגשת בית בהתאם להתקדמות
                if (verses.length > 0) {
                    const verseIndex = Math.floor(progress * (verses.length - 1));
                    if (verses[verseIndex]) {
                        verses[verseIndex].classList.add('highlight-verse');
                    }
                }
            }
        });
    }
    
    // אפקט hover על כלי נגינה
    const instrumentItems = document.querySelectorAll('.meta-info span');
    instrumentItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // אפקט scroll smooth
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // אנימציה כניסה לאלמנטים
    const sections = document.querySelectorAll('.lyrics-section, .player-section, .details-section, .quote-section, .project-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // אנימציה כניסה ראשונית
    setTimeout(() => {
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
    
    // אפקט קליק על הבתים
    verses.forEach(verse => {
        verse.style.cursor = 'pointer';
        verse.addEventListener('click', function() {
            // אפקט הדגשה רגעי
            this.style.background = 'rgba(176, 224, 255, 0.3)';
            setTimeout(() => {
                this.style.background = '';
            }, 500);
        });
    });
    
    // קונסול לוג
    console.log('🌙 MoonFlow - Page Loaded Successfully!');
    console.log('🎵 Audio Player Ready');
    console.log('📝 Lyrics Displayed');
    console.log('🌀 Awakening Arc - Stage 1/5');
});

