# This is a descriptor for the Nix package manager.
# Invoke nix-shell in this directory to enter an environment where
# everything gets downloaded and made available for development.
# With the shellHook enabled it will even start up a local
# HTTP server serving the docs.

{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    coreutils diffutils
    bash-completion less
    gitFull
    nodejs-14_x

    # keep this line if you use bash
    bashInteractive
  ];

  buildCommand = ''
    npm run build
  '';

  shellHook =
  ''
    # ideally, npm ci should be here, and it should run fast when it has nothing to do...
    # npm ci 
    npm start
  '';
}
