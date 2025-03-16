{
    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs?ref=nixpkgs-unstable";
    };

    outputs = 
        inputs@{
            self,
            nixpkgs,
            ...
        }:
        let
            system = "x86_64-linux";
            # システムにあったパッケージを取得する。
            pkgs = nixpkgs.legacyPackages.${system};
        in {
            # デフォルトで起動するdevShellを定義
            devShells.${system}.default = pkgs.mkShell {
                packages = [ pkgs.nodejs ];
            };
            # デフォルトでビルドされるDerivationの定義
            packages.${system}.default = pkgs.hello;
        };
}

