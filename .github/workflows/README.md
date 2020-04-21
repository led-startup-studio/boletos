[<img src="https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png" width="32">](https://github.com/led-startup-studio/boletos/tree/master/.github/workflows/README.md)
[<img src="https://cdn.countryflags.com/thumbs/brazil/flag-3d-round-250.png" width="32">](https://github.com/led-startup-studio/boletos/tree/master/.github/workflows/LEIAME.md)


# GitHub Actions

## Deploy and Release

The Action script tests and create new TAG and deploy versions based on the package.json version parameter.

To create a new version, simply update the version in the package.json and push a PR or directly to the main branch.

The script will check if a TAG with the same version is already created. If it is a brand new version a new TAG will be create in the GitHub and a new version will automatically be send to the NPM services. Otherwise, it will just run a unit test to check for code stability.

The pattern used to versioning is X.Y.Z where X is intended for major releases and Z is for minor bugs or simple adjustments.
