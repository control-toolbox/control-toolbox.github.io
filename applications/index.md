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
<h1>Applications</h1>
<p class="subtitle">A collection of optimal control applications built with the control-toolbox ecosystem.</p>
</div>

<div class="contributors-section">
<div class="app-grid">

{% include app-card.html
  url="https://control-toolbox.org/CalculusOfVariations.jl"
  color="#CB3C33"
  abbrev="CoV"
  title="Calculus of variations"
  summary="Classical variational problems reformulated as optimal control problems and solved via direct and indirect numerical methods."
%}

{% include app-card.html
  url="https://agustinyabo.github.io/DiauxicGrowth.jl"
  color="#389826"
  abbrev="DBG"
  title="Diauxic bacterial growth"
  summary="Optimal resource allocation for bacterial growth on multiple substrates, maximizing final cell population via optimal control of metabolic fluxes."
%}

{% include app-card.html
  url="https://agustinyabo.github.io/PWLdynamics.jl"
  color="#9558B2"
  abbrev="GRN"
  title="PWL models of gene regulatory networks"
  summary="State transitions in piecewise linear models of gene regulatory networks, with a nonsmooth L¹ cost and regularization strategies (Hill and exponential)."
%}

{% include app-card.html
  url="https://control-toolbox.org/GeometricPreconditioner.jl"
  color="#CB3C33"
  abbrev="GPrec"
  font_size="19"
  title="Geometric preconditioner"
  summary="Geometric preconditioning of shooting methods to accelerate convergence in indirect optimal control, exploiting the structure of the Hamiltonian flow."
%}

{% include app-card.html
  url="https://control-toolbox.org/LossControl.jl"
  color="#389826"
  abbrev="LCtrl"
  font_size="19"
  title="Loss control regions in optimal control problems"
  summary="Optimal control problems with loss control regions where the control is frozen, solved by combining direct regularization and indirect shooting methods."
%}

{% include app-card.html
  url="https://control-toolbox.org/MagneticResonanceImaging.jl"
  color="#9558B2"
  abbrev="MRI"
  title="Optimal control in Magnetic Resonance Imaging"
  summary="Time-minimal control of nuclear spin ensembles via RF pulses, with applications to contrast optimization in MRI using geometric optimal control."
%}

{% include app-card.html
  url="https://control-toolbox.org/Kepler.jl"
  color="#CB3C33"
  abbrev="Kepler"
  font_size="19"
  title="Minimum time orbit transfer"
  summary="Minimum-time orbit transfer of a spacecraft under Kepler dynamics with thrust constraints, solved by direct and indirect methods (CNES/TAS/Inria/CNRS)."
%}

{% include app-card.html
  url="https://anasxbouali.github.io/SIRcontrol.jl"
  color="#389826"
  abbrev="SIR"
  title="On the problem of minimizing the epidemic final size for SIR model via social distancing"
  summary="Minimizing epidemic final size in the SIR model via L¹-constrained social distancing interventions, with optimal control over a single or two time intervals."
%}

</div>
</div>

</div>
