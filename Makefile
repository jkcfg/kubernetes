.PHONY: all dist clean gen test copy-schemas

all: gen

gen:
	GO111MODULE=on go run ./cmd/apigen/ cmd/apigen/specs/swagger-v1.13.0.json cmd/apigen/templates ./src/

src/api.ts: gen
src/shapes.ts: gen

dist: src/api.ts src/shapes.ts copy-schemas
	npx tsc
	npx tsc -d --emitDeclarationOnly --allowJs false
	cp README.md LICENSE package.json @jkcfg/kubernetes
	cp -R build/schemas @jkcfg/kubernetes/

clean:
	rm -rf @jkcfg
	rm -f src/api.ts src/shapes.ts
	rm -rf ./build

test: gen
	npm test
	npm run lint

copy-schemas:
	git submodule update --init -- ./schemas
	rm -rf ./build/schemas
	GO111MODULE=on go run ./cmd/dedup/ ./schemas ./build/schemas

build-image: dist
	mkdir -p build/image
	cp -R @jkcfg build/image/
	docker build -t jkcfg/kubernetes -f Dockerfile build/image
