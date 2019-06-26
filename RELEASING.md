# Releasing `@jkcfg/kubernetes`

Steps to produce a new `@jkcfg/kubernetes` version:

1. Make sure you are on master, and that it has the latest from
   `origin/master`:

   ```console
   $ git checkout master
   $ git pull --ff-only origin master
   ```

   If git complains that it can't fast-forward, you've probably
   committed something to master by mistake. Consider putting it in a
   branch to submit as a PR.

2. Bump the version in `package{-lock}.json`, commit the result.

3. Tag the commit and push it (with the new commit):

   ```console
   $ git tag -a x.y.z -m "x.y.z release"
   $ git push --tags origin master
   ```

4. Wait for the CI build to push the NPM module

5. Go and edit the release page on GitHub with the list of API
   changes, new features and fixes.
