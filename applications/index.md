---
layout: default
title: Applications
permalink: /applications/
custom_css:
  - /assets/css/contributors.css
  - /assets/css/applications.css
custom_js:
  - /assets/js/applications.js?v=14
---

<div class="contributors-page">

<div class="contributors-section">

{% assign app_count = 8 %}

<div class="apps-layout">

<!-- Landscape drawer overlay (hidden by default) -->
<div class="landscape-overlay" id="landscape-overlay"></div>

<!-- Landscape hamburger button (hidden by default) -->
<button class="landscape-hamburger" id="landscape-hamburger" style="display: none;">
<i class="fa-solid fa-bars"></i>
</button>

<!-- Sidebar -->
<aside class="filter-sidebar" id="filter-sidebar">
<div class="filter-sidebar-inner">
<div class="sidebar-header">
<h3><i class="fa-solid fa-filter"></i> Filters</h3>
<div class="sidebar-header-actions">
<!-- Portrait collapse button (hidden by default) -->
<button class="portrait-collapse-btn" id="portrait-collapse-btn" style="display: none;">
<i class="fa-solid fa-chevron-down"></i>
</button>
<button class="filter-reset hidden" id="filter-reset">
<i class="fa-solid fa-rotate-left"></i> Clear all
</button>
</div>
</div>

<!-- Collapsible content wrapper (level 1) -->
<div class="portrait-content-wrapper" id="portrait-content-wrapper">

<div class="filter-counter-box">
<span class="filter-counter" id="filter-counter">{{ app_count }} application{% if app_count != 1 %}s{% endif %}</span>
</div>

<div class="search-box">
<i class="fa-solid fa-search"></i>
<input type="text" id="search-input" placeholder="Search applications..." />
</div>

<!-- Toggle button for mobile portrait tags (level 2) -->
<button class="mobile-filter-toggle" id="mobile-filter-toggle" style="display: none;">
<span>Show filter tags</span>
<i class="fa-solid fa-chevron-down"></i>
</button>

<!-- Collapsible tags container (level 2) -->
<div class="filter-tags-wrapper" id="filter-tags-wrapper">

<div class="filter-tags-section">
<h4>Application Domains</h4>
<div class="filter-bar" id="filter-bar-domains"></div>
</div>

<div class="filter-tags-section">
<h4>Numerical Methods</h4>
<div class="filter-bar" id="filter-bar-methods"></div>
</div>

<div class="filter-tags-section">
<h4>Problem Types</h4>
<div class="filter-bar" id="filter-bar-problems"></div>
</div>

<div class="filter-tags-section">
<h4>Mathematical Concepts</h4>
<div class="filter-bar" id="filter-bar-concepts"></div>
</div>

<div class="filter-tags-section">
<h4>Specific Techniques</h4>
<div class="filter-bar" id="filter-bar-techniques"></div>
</div>

</div>

</div>
</div>
</aside>

<!-- Main content -->
<div class="apps-main">

<div class="contributors-header">
<h1>🚀 Applications</h1>
<p class="subtitle">A collection of optimal control applications built with the control-toolbox ecosystem.</p>
</div>

<div class="apps-cta">
<p>Want to add your application? <a href="https://github.com/orgs/control-toolbox/discussions/65" target="_blank">Follow the guide</a>.</p>
</div>

<div class="view-toggle-bar">
<button id="btn-detailed" class="view-btn active" title="Vue détaillée"><i class="fa-solid fa-list"></i></button>
<button id="btn-compact" class="view-btn" title="Vue compacte"><i class="fa-solid fa-table-cells"></i></button>
</div>

<div class="no-results hidden" id="no-results">
<i class="fa-solid fa-inbox"></i>
<p>No applications match your filters</p>
</div>

<div class="app-grid" id="app-grid">

{% assign tags1 = "classical-mechanics,calculus-of-variations,lagrangian,direct-methods,indirect-methods" | split: "," %}
{% include app-card.html
  url="https://control-toolbox.org/CalculusOfVariations.jl"
  color="#CB3C33"
  abbrev="CoV"
  title="Calculus of variations"
  summary="Classical variational problems reformulated as optimal control problems and solved via direct and indirect numerical methods."
  tags="classical-mechanics,calculus-of-variations,lagrangian,direct-methods,indirect-methods"
  tags_list=tags1
%}

{% assign tags2 = "biology,resource-allocation,switching-time,bang-bang,indirect-methods" | split: "," %}
{% include app-card.html
  url="https://agustinyabo.github.io/DiauxicGrowth.jl"
  color="#389826"
  abbrev="DBG"
  title="Diauxic bacterial growth"
  summary="Optimal resource allocation for bacterial growth on multiple substrates, maximizing final cell population via optimal control of metabolic fluxes."
  tags="biology,resource-allocation,switching-time,bang-bang,indirect-methods"
  tags_list=tags2
%}

{% assign tags3 = "biology,piecewise-linear,nonsmooth,regularization,gene-networks" | split: "," %}
{% include app-card.html
  url="https://agustinyabo.github.io/PWLdynamics.jl"
  color="#9558B2"
  abbrev="GRN"
  title="PWL models of gene regulatory networks"
  summary="State transitions in piecewise linear models of gene regulatory networks, with a nonsmooth L¹ cost and regularization strategies (Hill and exponential)."
  tags="biology,piecewise-linear,nonsmooth,regularization,gene-networks"
  tags_list=tags3
%}

{% assign tags4 = "preconditioning,shooting,convergence,hamiltonian,geometric-control" | split: "," %}
{% include app-card.html
  url="https://control-toolbox.org/GeometricPreconditioner.jl"
  color="#CB3C33"
  abbrev="GPrec"
  font_size="19"
  title="Geometric preconditioner"
  summary="Geometric preconditioning of shooting methods to accelerate convergence in indirect optimal control, exploiting the structure of the Hamiltonian flow."
  tags="preconditioning,shooting,convergence,hamiltonian,geometric-control"
  tags_list=tags4
%}

{% assign tags5 = "constrained,regularization,shooting,indirect-methods,zermelo" | split: "," %}
{% include app-card.html
  url="https://control-toolbox.org/LossControl.jl"
  color="#389826"
  abbrev="LCtrl"
  font_size="19"
  title="Loss control regions in optimal control problems"
  summary="Optimal control problems with loss control regions where the control is frozen, solved by combining direct regularization and indirect shooting methods."
  tags="constrained,regularization,shooting,indirect-methods,zermelo"
  tags_list=tags5
%}

{% assign tags6 = "medical-imaging,time-optimal,physics,geometric-control,bloch-equation" | split: "," %}
{% include app-card.html
  url="https://control-toolbox.org/MagneticResonanceImaging.jl"
  color="#9558B2"
  abbrev="MRI"
  title="Optimal control in Magnetic Resonance Imaging"
  summary="Time-minimal control of nuclear spin ensembles via RF pulses, with applications to contrast optimization in MRI using geometric optimal control."
  tags="medical-imaging,time-optimal,physics,geometric-control,bloch-equation"
  tags_list=tags6
%}

{% assign tags7 = "aerospace,time-optimal,shooting,direct-methods,orbital-mechanics" | split: "," %}
{% include app-card.html
  url="https://control-toolbox.org/Kepler.jl"
  color="#CB3C33"
  abbrev="Kepler"
  font_size="19"
  title="Minimum time orbit transfer"
  summary="Minimum-time orbit transfer of a spacecraft under Kepler dynamics with thrust constraints, solved by direct and indirect methods."
  tags="aerospace,time-optimal,shooting,direct-methods,orbital-mechanics"
  tags_list=tags7
%}

{% assign tags8 = "epidemiology,constrained,social-distancing,public-health,ode" | split: "," %}
{% include app-card.html
  url="https://anasxbouali.github.io/SIRcontrol.jl"
  color="#389826"
  abbrev="SIR"
  title="On the problem of minimizing the epidemic final size for SIR model via social distancing"
  summary="Minimizing epidemic final size in the SIR model via L¹-constrained social distancing interventions, with optimal control over a single or two time intervals."
  tags="epidemiology,constrained,social-distancing,public-health,ode"
  tags_list=tags8
%}

</div>
</div>
</div>

</div>
</div>
