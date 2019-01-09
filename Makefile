.PHONY: dist clean-dist gen

all: gen

gen:
	go run ./cmd/apigen/ cmd/apigen/specs/swagger-v1.13.0.json cmd/apigen/templates ./src/

src/api.ts: gen
src/shapes.ts: gen

dist: src/api.ts src/shapes.ts
	npx tsc
	npx tsc -d --emitDeclarationOnly --allowJs false
	cp README.md LICENSE package.json .npmrc $@

clean:
	rm -rf dist
	rm -f src/api.ts src/shapes.ts

test: gen
	npm test
