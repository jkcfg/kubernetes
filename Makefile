.PHONY: dist clean-dist gen

all: gen

gen:
	go run ./cmd/apigen/ cmd/apigen/specs/swagger-v1.13.0.json cmd/apigen/templates ./src/

dist: src/api.ts
	npx tsc
	npx tsc -d --emitDeclarationOnly --allowJs false
	cp LICENSE package.json .npmrc $@

clean:
	rm -rf dist
	rm -f src/api.ts src/shapes.ts

