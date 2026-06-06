---
{ "draft": true }
---

# FJSR dev log

## 2026-06-06

The current plan is to fork off from hermes JS engine because it's got some
built-in support for typed JS AOT compilation.

Cloned and built the main branch. Builds cleanly. One thing that I find a bit
odd is that the default branch for https://github.com/facebook/hermes is static_h,
which has diverged significantly from main. Should be fine if I'm able to maintain
a cleanish fork.

The current plan is to implement a subset of the nodejs API to run some benchmarks.
The goal is to keep as much of the nodejs stdlib implementation in typed JS as possible.
This might be end up being slower than plain nodejs.

To begin with, something that reads and dumps a plain text
file might be a decent start
