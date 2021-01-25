# This is a descriptor for the Nix package manager.
# Invoke nix-shell in this directory to enter an environment where
# everything gets downloaded and made available for development.

with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "bee-docs";

  buildInputs = [
    coreutils diffutils
    bash-completion less
    gitFull
    nodejs
  ];

  buildCommand = ''
    npm run build
  '';

  shellHook =
  ''
    npm start
  '';
}
