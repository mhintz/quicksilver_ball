.PHONY: install server clean build deploy

install: package.json
	npm install

server: install
	$$(npm bin)/webpack-dev-server --content-base build/

clean:
	rm -rf build

build: clean install
	NODE_ENV=production $$(npm bin)/webpack --colors --progress

deploy: clean install build
	node src/deploy.js
