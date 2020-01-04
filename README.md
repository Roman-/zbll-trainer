# ZBLL trainer
## http://bestsiteever.ru/zbll/

The purpose of this project and its details are described on speedsolving forum in [this post](https://www.speedsolving.com/forum/threads/zbll-trainer.63572/).  

TODO list
---------

- generate more and scrambles, make them equally long
- show suggested alg (might be from Swanson's or Jabari's list)
- add the anti-sune pictures angle setting.
- different timer layout for smartphones

How it works
------------

For each zbll case, there is a set of algorithms defined in _scripts/casesmap.js_ from which the scramble is being randomly selected. After that, an additional procedure is performed to disguise the scramble (see `applyRotationForAlgorithm()` function in _scripts/timer.js_).  
All the scrambles must satisfy these requirements:
* No scramble should be too short or too long, otherwise it can expose the case
* Scrambles shouldn't start or end up with the AUF (U layer move)
* For each case, there should be enough scrambles to not let the user memorize them during practicing
* For each case, scrambles should be as different from each other as possible
* For each case, none of two scrambles should be each other's rotation (like _R U L' D2_ an _F U B' D2_) because such scrambles will generate the same set of four algs after `applyRotationForAlgorithm()`
* Scrambles shouldn't be 2-gen (currently not implemented; there's a feature-request for that)

Contributing to zbll trainer
============================

As you see, improving the scrambler basically boils down to generating a lot of different scrambles and adding them to the casesmap. You can help by doing it for separate cases or groups using CubeExplorer or similar tools, or maybe suggesting an entirely new approach to dealing with scrambles generation.  
If you want to improve something else or add a new feature, please use pure JavaScript and do not use additional JS libraries.
Feel free to submit issues and enhancement requests. 


Contributing workflow
---------------------

For contributing, follow the "fork-and-pull" Git workflow.

 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull request** so that I can review your changes
