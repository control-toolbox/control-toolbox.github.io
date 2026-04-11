---
layout: default
title: Applications
permalink: /applications/
custom_css:
  - /assets/css/contributors.css
  - /assets/css/applications.css
---

<div class="contributors-page">

<div class="contributors-header">
<h1>🚀 Applications</h1>
<p class="subtitle">A collection of optimal control applications built with the control-toolbox ecosystem.</p>
</div>

<div class="contributors-section">
<div class="view-toggle-bar">
<button id="btn-detailed" class="view-btn active" title="Vue détaillée"><i class="fa-solid fa-list"></i></button>
<button id="btn-compact" class="view-btn" title="Vue compacte"><i class="fa-solid fa-table-cells"></i></button>
</div>

<div class="filter-bar" id="filter-bar">
<span class="filter-label">Filter by tags:</span>
<span class="filter-counter" id="filter-counter">8 applications</span>
<button class="filter-reset hidden" id="filter-reset">Reset filters</button>
</div>

<div class="no-results hidden" id="no-results">
No applications match the selected filters.
</div>

<div class="app-grid" id="app-grid">

{% include app-card.html
  url="https://control-toolbox.org/CalculusOfVariations.jl"
  color="#CB3C33"
  abbrev="CoV"
  title="Calculus of variations"
  summary="Classical variational problems reformulated as optimal control problems and solved via direct and indirect numerical methods."
  tags="calculus-of-variations,indirect-methods,direct-methods,lagrangian,classical-mechanics"
  tags_list="calculus-of-variations,indirect-methods,direct-methods,lagrangian,classical-mechanics" | split: ","
%}

{% include app-card.html
  url="https://agustinyabo.github.io/DiauxicGrowth.jl"
  color="#389826"
  abbrev="DBG"
  title="Diauxic bacterial growth"
  summary="Optimal resource allocation for bacterial growth on multiple substrates, maximizing final cell population via optimal control of metabolic fluxes."
  tags="bacterial-growth,biotechnology,resource-allocation,metabolic-flux,switching-time"
  tags_list="bacterial-growth,biotechnology,resource-allocation,metabolic-flux,switching-time" | split: ","
%}

{% include app-card.html
  url="https://agustinyabo.github.io/PWLdynamics.jl"
  color="#9558B2"
  abbrev="GRN"
  title="PWL models of gene regulatory networks"
  summary="State transitions in piecewise linear models of gene regulatory networks, with a nonsmooth L¹ cost and regularization strategies (Hill and exponential)."
  tags="gene-networks,piecewise-linear,nonsmooth,regularization,bistable,oscillator"
  tags_list="gene-networks,piecewise-linear,nonsmooth,regularization,bistable,oscillator" | split: ","
%}

{% include app-card.html
  url="https://control-toolbox.org/GeometricPreconditioner.jl"
  color="#CB3C33"
  abbrev="GPrec"
  font_size="19"
  title="Geometric preconditioner"
  summary="Geometric preconditioning of shooting methods to accelerate convergence in indirect optimal control, exploiting the structure of the Hamiltonian flow."
  tags="preconditioning,shooting-methods,convergence,hamiltonian,geometric-control"
  tags_list="preconditioning,shooting-methods,convergence,hamiltonian,geometric-control" | split: ","
%}

{% include app-card.html
  url="https://control-toolbox.org/LossControl.jl"
  color="#389826"
  abbrev="LCtrl"
  font_size="19"
  title="Loss control regions in optimal control problems"
  summary="Optimal control problems with loss control regions where the control is frozen, solved by combining direct regularization and indirect shooting methods."
  tags="loss-control,frozen-control,regularization,zermelo,indirect-shooting"
  tags_list="loss-control,frozen-control,regularization,zermelo,indirect-shooting" | split: ","
%}

{% include app-card.html
  url="https://control-toolbox.org/MagneticResonanceImaging.jl"
  color="#9558B2"
  abbrev="MRI"
  title="Optimal control in Magnetic Resonance Imaging"
  summary="Time-minimal control of nuclear spin ensembles via RF pulses, with applications to contrast optimization in MRI using geometric optimal control."
  tags="mri,bloch-equation,rf-pulses,time-minimal,contrast-optimization,nuclear-spin"
  tags_list="mri,bloch-equation,rf-pulses,time-minimal,contrast-optimization,nuclear-spin" | split: ","
%}

{% include app-card.html
  url="https://control-toolbox.org/Kepler.jl"
  color="#CB3C33"
  abbrev="Kepler"
  font_size="19"
  title="Minimum time orbit transfer"
  summary="Minimum-time orbit transfer of a spacecraft under Kepler dynamics with thrust constraints, solved by direct and indirect methods."
  tags="orbit-transfer,spacecraft,kepler,minimum-time,aerospace,cnes"
  tags_list="orbit-transfer,spacecraft,kepler,minimum-time,aerospace,cnes" | split: ","
%}

{% include app-card.html
  url="https://anasxbouali.github.io/SIRcontrol.jl"
  color="#389826"
  abbrev="SIR"
  title="On the problem of minimizing the epidemic final size for SIR model via social distancing"
  summary="Minimizing epidemic final size in the SIR model via L¹-constrained social distancing interventions, with optimal control over a single or two time intervals."
  tags="sir-model,epidemic,social-distancing,public-health,l1-constraint,budget-constraint"
  tags_list="sir-model,epidemic,social-distancing,public-health,l1-constraint,budget-constraint" | split: ","
%}

</div>
</div>

</div>

<script>
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

  var savedView = localStorage.getItem(VIEW_STORAGE_KEY);
  if (savedView) { setView(savedView); }

  btnDetailed.addEventListener('click', function() { setView('detailed'); });
  btnCompact.addEventListener('click', function() { setView('compact'); });

  // Tag filtering
  var cards = Array.from(grid.querySelectorAll('.app-card'));
  var filterBar = document.getElementById('filter-bar');
  var filterCounter = document.getElementById('filter-counter');
  var filterReset = document.getElementById('filter-reset');
  var noResults = document.getElementById('no-results');
  var FILTER_STORAGE_KEY = 'app-active-filters';

  // Extract all unique tags
  var allTags = new Set();
  cards.forEach(function(card) {
    var tags = card.getAttribute('data-tags');
    if (tags) {
      tags.split(',').forEach(function(tag) { allTags.add(tag.trim()); });
    }
  });

  // Create filter buttons
  var activeFilters = new Set();
  var tagButtons = {};

  Array.from(allTags).sort().forEach(function(tag) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = tag;
    btn.addEventListener('click', function() { toggleFilter(tag); });
    filterBar.insertBefore(btn, filterCounter);
    tagButtons[tag] = btn;
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

    if (activeFilters.size === 0) {
      cards.forEach(function(card) {
        card.classList.remove('filtered-out');
        visibleCount++;
      });
      filterReset.classList.add('hidden');
      noResults.classList.add('hidden');
    } else {
      cards.forEach(function(card) {
        var cardTags = card.getAttribute('data-tags') || '';
        var cardTagArray = cardTags.split(',').map(function(t) { return t.trim(); });
        var hasAllTags = Array.from(activeFilters).every(function(filter) {
          return cardTagArray.indexOf(filter) !== -1;
        });
        if (hasAllTags) {
          card.classList.remove('filtered-out');
          visibleCount++;
        } else {
          card.classList.add('filtered-out');
        }
      });
      filterReset.classList.remove('hidden');
      noResults.classList.toggle('hidden', visibleCount > 0);
    }

    filterCounter.textContent = visibleCount + ' application' + (visibleCount !== 1 ? 's' : '');
  }

  function resetFilters() {
    activeFilters.clear();
    Object.values(tagButtons).forEach(function(btn) { btn.classList.remove('active'); });
    applyFilters();
    saveFilters();
  }

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
</script>
