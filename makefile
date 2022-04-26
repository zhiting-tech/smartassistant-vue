.PHONY: start build lint test format
VERSION=latest
#DOCKER_REGISTRY=scregistry.zhitingtech.com/
DOCKER_REGISTRY="docker.yctc.tech/"


# make build-all VERSION=1.0.0
build-all: build

build:
	docker build -f Dockerfile --build-arg VERSION=$(VERSION) --build-arg GIT_COMMIT=$(shell git log -1 --format=%h) -t sa-vue:$(VERSION) .

push:
	docker image tag sa-vue:$(VERSION) $(DOCKER_REGISTRY)zhitingtech/sa-vue:$(VERSION)
	docker push $(DOCKER_REGISTRY)zhitingtech/sa-vue:$(VERSION)

