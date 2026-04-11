(function() {
  // View toggle
  var grid = document.getElementById('app-grid');
  var btnDetailed = document.getElementById('btn-detailed');
  var btnCompact = document.getElementById('btn-compact');
  var VIEW_STORAGE_KEY = 'app-view-mode';

  function setView(mode) {
    if (mode === 'compact') {
      grid.classList.add('compact');
      btnCompact.classList.add('active');
      btnDetailed.classList.remove('active');
    } else {
      grid.classList.remove('compact');
      btnDetailed.classList.add('active');
      btnCompact.classList.remove('active');
    }
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  }

  // Check if mobile
  function isMobile() {
    return window.innerWidth <= 480 || 
           (window.innerHeight <= 500 && window.matchMedia('(orientation: landscape)').matches);
  }

  // Set initial view: compact by default on mobile if no preference
  var savedView = localStorage.getItem(VIEW_STORAGE_KEY);
  if (savedView) {
    setView(savedView);
  } else if (isMobile()) {
    setView('compact');
  }

  btnDetailed.addEventListener('click', function() { setView('detailed'); });
  btnCompact.addEventListener('click', function() { setView('compact'); });

  // ÉTAPE 4: Portrait double accordion - Level 1 (main content)
  var portraitCollapseBtn = document.getElementById('portrait-collapse-btn');
  var portraitContentWrapper = document.getElementById('portrait-content-wrapper');
  var PORTRAIT_CONTENT_KEY = 'portrait-content-expanded';

  if (portraitCollapseBtn && portraitContentWrapper) {
    // Load saved state (default: collapsed)
    var contentState = localStorage.getItem(PORTRAIT_CONTENT_KEY);
    if (contentState === 'true') {
      portraitContentWrapper.classList.add('expanded');
      portraitCollapseBtn.classList.add('expanded');
    }

    // Toggle on click
    portraitCollapseBtn.addEventListener('click', function() {
      portraitContentWrapper.classList.toggle('expanded');
      portraitCollapseBtn.classList.toggle('expanded');
      var isExpanded = portraitContentWrapper.classList.contains('expanded');
      localStorage.setItem(PORTRAIT_CONTENT_KEY, isExpanded);
    });
  }

  // ÉTAPE 1: Mobile portrait filter toggle - Level 2 (tags)
  var mobileFilterToggle = document.getElementById('mobile-filter-toggle');
  var filterTagsWrapper = document.getElementById('filter-tags-wrapper');
  var MOBILE_FILTERS_KEY = 'mobile-filters-expanded';

  if (mobileFilterToggle && filterTagsWrapper) {
    // Load saved state
    var savedState = localStorage.getItem(MOBILE_FILTERS_KEY);
    if (savedState === 'true') {
      filterTagsWrapper.classList.add('expanded');
      mobileFilterToggle.classList.add('expanded');
      mobileFilterToggle.querySelector('span').textContent = 'Hide filter tags';
    }

    // Toggle on click
    mobileFilterToggle.addEventListener('click', function() {
      filterTagsWrapper.classList.toggle('expanded');
      mobileFilterToggle.classList.toggle('expanded');
      var isExpanded = filterTagsWrapper.classList.contains('expanded');
      mobileFilterToggle.querySelector('span').textContent = isExpanded ? 'Hide filter tags' : 'Show filter tags';
      localStorage.setItem(MOBILE_FILTERS_KEY, isExpanded);
    });
  }

  // ÉTAPE 2: Landscape drawer toggle
  var landscapeHamburger = document.getElementById('landscape-hamburger');
  var landscapeOverlay = document.getElementById('landscape-overlay');
  var filterSidebar = document.getElementById('filter-sidebar');
  var LANDSCAPE_DRAWER_KEY = 'landscape-drawer-open';

  if (landscapeHamburger && landscapeOverlay && filterSidebar) {
    // Load saved state (default: open)
    var drawerState = localStorage.getItem(LANDSCAPE_DRAWER_KEY);
    if (drawerState === 'false') {
      filterSidebar.classList.add('closed');
      landscapeOverlay.classList.remove('visible');
      landscapeHamburger.classList.remove('hidden');
    } else {
      // Default: drawer open, show overlay, hide hamburger
      landscapeOverlay.classList.add('visible');
      landscapeHamburger.classList.add('hidden');
    }

    // Toggle drawer
    function toggleDrawer() {
      filterSidebar.classList.toggle('closed');
      landscapeOverlay.classList.toggle('visible');
      landscapeHamburger.classList.toggle('hidden');
      var isOpen = !filterSidebar.classList.contains('closed');
      localStorage.setItem(LANDSCAPE_DRAWER_KEY, isOpen);
    }

    landscapeHamburger.addEventListener('click', toggleDrawer);
    landscapeOverlay.addEventListener('click', toggleDrawer);
  }

  // Tag filtering and search
  var cards = Array.from(grid.querySelectorAll('.app-card'));
  var filterCounter = document.getElementById('filter-counter');
  var filterReset = document.getElementById('filter-reset');
  var noResults = document.getElementById('no-results');
  var searchInput = document.getElementById('search-input');
  var FILTER_STORAGE_KEY = 'app-active-filters';
  var searchQuery = '';

  // Tag categories
  var tagCategories = {
    'domains': {
      container: document.getElementById('filter-bar-domains'),
      tags: ['classical-mechanics', 'biology', 'epidemiology', 'aerospace', 'medical-imaging', 'physics']
    },
    'methods': {
      container: document.getElementById('filter-bar-methods'),
      tags: ['direct-methods', 'indirect-methods', 'shooting', 'discretization', 'regularization']
    },
    'problems': {
      container: document.getElementById('filter-bar-problems'),
      tags: ['time-optimal', 'energy-optimal', 'lagrangian', 'constrained', 'nonsmooth', 'bang-bang']
    },
    'concepts': {
      container: document.getElementById('filter-bar-concepts'),
      tags: ['calculus-of-variations', 'hamiltonian', 'pontryagin', 'geometric-control', 'piecewise-linear', 'ode']
    },
    'techniques': {
      container: document.getElementById('filter-bar-techniques'),
      tags: ['preconditioning', 'convergence', 'switching-time', 'state-constraints', 'resource-allocation', 'social-distancing', 'public-health', 'gene-networks', 'zermelo', 'bloch-equation', 'orbital-mechanics']
    }
  };

  // Extract all unique tags
  var allTags = new Set();
  cards.forEach(function(card) {
    var tags = card.getAttribute('data-tags');
    if (tags) {
      tags.split(',').forEach(function(tag) { allTags.add(tag.trim()); });
    }
  });

  // Calculate tag counts
  var tagCounts = {};
  allTags.forEach(function(tag) {
    tagCounts[tag] = cards.filter(function(card) {
      var cardTags = card.getAttribute('data-tags') || '';
      return cardTags.split(',').map(function(t) { return t.trim(); }).indexOf(tag) !== -1;
    }).length;
  });

  // Create filter buttons with counts organized by category
  var activeFilters = new Set();
  var tagButtons = {};

  Object.keys(tagCategories).forEach(function(categoryKey) {
    var category = tagCategories[categoryKey];
    category.tags.forEach(function(tag) {
      if (allTags.has(tag)) {
        var btn = document.createElement('button');
        btn.className = 'filter-btn';
        
        var tagName = document.createElement('span');
        tagName.textContent = tag;
        
        var tagCount = document.createElement('span');
        tagCount.className = 'tag-count';
        tagCount.textContent = tagCounts[tag];
        
        btn.appendChild(tagName);
        btn.appendChild(tagCount);
        btn.addEventListener('click', function() { toggleFilter(tag); });
        category.container.appendChild(btn);
        tagButtons[tag] = btn;
      }
    });
  });

  function toggleFilter(tag) {
    if (activeFilters.has(tag)) {
      activeFilters.delete(tag);
      tagButtons[tag].classList.remove('active');
    } else {
      activeFilters.add(tag);
      tagButtons[tag].classList.add('active');
    }
    applyFilters();
    saveFilters();
  }

  function applyFilters() {
    var visibleCount = 0;
    var hasActiveFilters = activeFilters.size > 0 || searchQuery.length > 0;

    cards.forEach(function(card) {
      var cardTags = card.getAttribute('data-tags') || '';
      var cardTagArray = cardTags.split(',').map(function(t) { return t.trim(); });
      var cardTitle = card.querySelector('.app-title').textContent.toLowerCase();
      var cardSummary = card.querySelector('.app-summary').textContent.toLowerCase();
      
      // Check tag filters
      var matchesTags = activeFilters.size === 0 || Array.from(activeFilters).every(function(filter) {
        return cardTagArray.indexOf(filter) !== -1;
      });
      
      // Check search query
      var matchesSearch = searchQuery.length === 0 || 
        cardTitle.indexOf(searchQuery) !== -1 || 
        cardSummary.indexOf(searchQuery) !== -1 ||
        cardTagArray.some(function(tag) { return tag.indexOf(searchQuery) !== -1; });
      
      if (matchesTags && matchesSearch) {
        card.classList.remove('filtered-out');
        visibleCount++;
      } else {
        card.classList.add('filtered-out');
      }
    });

    filterReset.classList.toggle('hidden', !hasActiveFilters);
    noResults.classList.toggle('hidden', visibleCount > 0);
    filterCounter.textContent = visibleCount + ' application' + (visibleCount !== 1 ? 's' : '');
  }

  function resetFilters() {
    activeFilters.clear();
    searchQuery = '';
    searchInput.value = '';
    Object.values(tagButtons).forEach(function(btn) { btn.classList.remove('active'); });
    applyFilters();
    saveFilters();
  }
  
  // Search functionality
  searchInput.addEventListener('input', function() {
    searchQuery = this.value.toLowerCase().trim();
    applyFilters();
  });

  function saveFilters() {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(Array.from(activeFilters)));
  }

  function loadFilters() {
    var saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (saved) {
      try {
        var filters = JSON.parse(saved);
        filters.forEach(function(tag) {
          if (tagButtons[tag]) {
            activeFilters.add(tag);
            tagButtons[tag].classList.add('active');
          }
        });
        applyFilters();
      } catch(e) {}
    }
  }

  filterReset.addEventListener('click', resetFilters);

  // Load saved filters on page load
  loadFilters();
})();
