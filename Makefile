develop:
	npx webpack serve

install:
	yarn

build:
	NODE_ENV=production npx webpack

test:
	yarn test

lint:
	npx eslint .