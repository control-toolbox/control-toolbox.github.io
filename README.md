# Welcome to the control-toolbox ecosystem!

<p>
  <a href="https://github.com/control-toolbox"><img width="100" align='left' src="ct-crop.svg"></a>
</p>

The control-toolbox ecosystem gathers `Julia` packages for mathematical control and applications. It is an outcome of a research initiative supported by the [Centre Inria of Université Côte d'Azur](https://www.inria.fr/en/inria-centre-universite-cote-azur) and a sequel to previous developments, notably [Bocop](https://www.bocop.org) and [Hampath](https://www.hampath.org). See also: [ct gallery](https://ct.gitlabpages.inria.fr/gallery). The root package is [`OptimalControl.jl`](https://github.com/control-toolbox/OptimalControl.jl) which aims to provide tools to solve optimal control problems by direct and indirect methods.

[![doc OptimalControl.jl](https://img.shields.io/badge/doc-OptimalControl.jl-blue)](https://control-toolbox.github.io/OptimalControl.jl)

An optimal control problem can be described as minimising the cost functional

```math
g(t_0, x(t_0), t_f, x(t_f)) + \int_{t_0}^{t_f} f^{0}(t, x(t), u(t))~\mathrm{d}t
```

where the state $x$ and the control $u$ are functions subject, for $t \in [t_0, t_f]$,
to the differential constraint

```math
   \dot{x}(t) = f(t, x(t), u(t))
```

and other constraints such as

```math
\begin{array}{llcll}
~\xi_l  &\le& \xi(t, u(t))        &\le& \xi_u, \\
\eta_l &\le& \eta(t, x(t))       &\le& \eta_u, \\
\psi_l &\le& \psi(t, x(t), u(t)) &\le& \psi_u, \\
\phi_l &\le& \phi(t_0, x(t_0), t_f, x(t_f)) &\le& \phi_u.
\end{array}
```

## Installation

See the [Installation page](https://github.com/control-toolbox#installation).

