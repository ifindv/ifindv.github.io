document.addEventListener('DOMContentLoaded', function() {
  let currentCategory = 'all';
  let currentTimeRange = 'all';
  let categoryMenuOpen = false;
  let timeMenuOpen = false;
  
  function filterFavorites(category, timeRange) {
    console.log('Filtering favorites:', { category, timeRange });
    const cards = document.querySelectorAll('.favorite-card');
    const now = new Date();
    
    cards.forEach((card, index) => {
      const cardCategory = card.dataset.category;
      const cardDate = new Date(card.dataset.date);
      
      let categoryMatch = category === 'all' || cardCategory === category;
      let timeMatch = true;
      
      if (timeRange !== 'all') {
        const diffTime = Math.abs(now - cardDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch(timeRange) {
          case 'recent':
            timeMatch = diffDays <= 7;
            break;
          case 'month':
            timeMatch = diffDays <= 30;
            break;
          case 'year':
            timeMatch = diffDays <= 365;
            break;
        }
      }
      
      if (categoryMatch && timeMatch) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`;
      } else {
        card.classList.add('hidden');
      }
    });
  }
  
  function setupFilterListeners() {
    const categoryFilter = document.getElementById('category-filter');
    const timeFilter = document.getElementById('time-filter');
    
    if (categoryFilter) {
      const categoryOptions = categoryFilter.querySelectorAll('.filter-option');
      const categoryDropdown = categoryFilter.querySelector('.filter-options');

      // Add hover event handlers
      categoryFilter.addEventListener('mouseenter', function() {
        if (!categoryMenuOpen) {
          categoryDropdown.style.opacity = '1';
          categoryDropdown.style.visibility = 'visible';
          categoryDropdown.style.transform = 'scale(1)';
        }
      });

      categoryFilter.addEventListener('mouseleave', function() {
        if (!categoryMenuOpen) {
          categoryDropdown.style.opacity = '0';
          categoryDropdown.style.visibility = 'hidden';
          categoryDropdown.style.transform = 'scale(0.95)';
        }
      });
      
      categoryOptions.forEach(option => {
        option.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          categoryOptions.forEach(opt => opt.classList.remove('active'));
          this.classList.add('active');
          currentCategory = this.dataset.category;
          
          console.log('Category selected:', currentCategory);
          filterFavorites(currentCategory, currentTimeRange);
          
          // Close the dropdown after selection
          if (categoryDropdown) {
            categoryMenuOpen = true;
            categoryDropdown.style.opacity = '0';
            categoryDropdown.style.visibility = 'hidden';
            categoryDropdown.style.transform = 'scale(0.95)';
            // Reset the flag after a delay to allow hover to work again
            setTimeout(() => {
              categoryMenuOpen = false;
            }, 500);
          }
        });
      });
    }
    
    if (timeFilter) {
      const timeOptions = timeFilter.querySelectorAll('.filter-option');
      const timeDropdown = timeFilter.querySelector('.filter-options');

      // Add hover event handlers
      timeFilter.addEventListener('mouseenter', function() {
        if (!timeMenuOpen) {
          timeDropdown.style.opacity = '1';
          timeDropdown.style.visibility = 'visible';
          timeDropdown.style.transform = 'scale(1)';
        }
      });

      timeFilter.addEventListener('mouseleave', function() {
        if (!timeMenuOpen) {
          timeDropdown.style.opacity = '0';
          timeDropdown.style.visibility = 'hidden';
          timeDropdown.style.transform = 'scale(0.95)';
        }
      });
      
      timeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          timeOptions.forEach(opt => opt.classList.remove('active'));
          this.classList.add('active');
          currentTimeRange = this.dataset.time;
          
          console.log('Time range selected:', currentTimeRange);
          filterFavorites(currentCategory, currentTimeRange);
          
          // Close the dropdown after selection
          if (timeDropdown) {
            timeMenuOpen = true;
            timeDropdown.style.opacity = '0';
            timeDropdown.style.visibility = 'hidden';
            timeDropdown.style.transform = 'scale(0.95)';
            // Reset the flag after a delay to allow hover to work again
            setTimeout(() => {
              timeMenuOpen = false;
            }, 500);
          }
        });
      });
    }
  }
  
  function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.style.animation = 'fadeInUp 0.6s ease-out';
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.favorite-card').forEach(card => {
      observer.observe(card);
    });
  }
  
  setupFilterListeners();
  setupIntersectionObserver();
});
