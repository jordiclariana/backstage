#!/bin/bash

docker run -ti --rm -v "$PWD"/app-config.yaml:/app/app-config.yaml -p 7007:7007 --name backstage backstage:latest
