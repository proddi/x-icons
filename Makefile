DOCKER_IMAGE = "node:alpine"
SRC_IN_IMAGE = "/src"

.PHONY: init
init:
	docker run --rm -it --user "`id -u`":"`id -g`" -v `pwd`:${SRC_IN_IMAGE} -w ${SRC_IN_IMAGE} ${DOCKER_IMAGE} /bin/sh -c "npm install --production"

.PHONY: clean
clean:
	@rm -rf node_modules docs build

#.PHONY: build
#build:
#	docker run --rm -it --user "`id -u`":"`id -g`" -v `pwd`:${SRC_IN_IMAGE} -w ${SRC_IN_IMAGE} ${DOCKER_IMAGE} /bin/bash -c "node node_modules/polymer-cli/bin/polymer.js build --entrypoint examples/material/routing-app.html"

.PHONY: bash
bash: init
	docker run --rm -it --net host --user "`id -u`":"`id -g`" -v `pwd`:${SRC_IN_IMAGE} -w ${SRC_IN_IMAGE} ${DOCKER_IMAGE} /bin/sh -c "npm run; /bin/sh -i"
