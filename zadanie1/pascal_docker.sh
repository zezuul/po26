#!/bin/bash

# Nazwa pliku z kodem Pascal
PASCAL_FILE="task1.pas"
OUTPUT_FILE="task1"

docker image inspect my-fpc-image >/dev/null 2>&1 || {
  echo "Tworzenie obrazu Docker z Free Pascal..."
  cat <<EOF > Dockerfile
  FROM freepascal/fpc:3.2.2-focal-full

  WORKDIR /usr/src/myapp
  COPY . .

  RUN fpc $PASCAL_FILE

  CMD ["./$OUTPUT_FILE"]
EOF
  docker build -t my-fpc-image .
}

echo "Uruchamianie programu w Dockerze..."
docker run --rm my-fpc-image