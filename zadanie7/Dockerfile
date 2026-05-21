# Build Vapor na Linuxie — działa w Docker Desktop na Windows
FROM swift:5.10-jammy AS build

WORKDIR /build

COPY Package.swift ./
RUN swift package resolve

COPY Sources ./Sources
COPY Public ./Public

RUN swift build -c release --static-swift-stdlib

# Obraz uruchomieniowy
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libcurl4 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /build/.build/release/App ./App
COPY --from=build /build/Public ./Public

ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

EXPOSE 8080

CMD ["./App", "serve", "--hostname", "0.0.0.0", "--port", "8080"]
