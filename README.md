# ZBLL trainer
## https://bestsiteever.ru/zbll/

The purpose of this project and its details are described on speedsolving forum in [this post](https://www.speedsolving.com/forum/threads/zbll-trainer.63572/).  

How it works
------------

For each zbll case, there is a set of algorithms defined in _scripts/casesmap.js_. To generate a scramble for a specific ZBLL case, the program randomly picks one of the algorithms for this case and inverses it. After that, an additional procedure is performed to disguise the scramble (see `applyRotationForAlgorithm()` function in _scripts/timer.js_).  
For every ZBLL case, all the algorithms must satisfy these requirements:

- Alg should not be too short or too long, otherwise it can expose the case
- Alg should not start or end up with the AUF (U layer move)
- There should be enough algs for each ZBLL case to not let the user memorize scrambles during practicing
- None of two algs should be each other's rotation (like _R U L' D2_ an _F U B' D2_) because such scrambles will generate the same set of four algs after `applyRotationForAlgorithm()`
- Generally, for each ZBLL case, algs should be as different from each other as possible


Contributing workflow
---------------------

For contributing, follow the "fork-and-pull" Git workflow.

 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull request** so that I can review your changes
