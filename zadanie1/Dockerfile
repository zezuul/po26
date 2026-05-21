FROM freepascal/fpc:3.2.2-focal-full

WORKDIR /usr/src/myapp
COPY . .

RUN fpc task1.pas

CMD ["./task1"]