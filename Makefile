KUBE_SCHEMA_ORG:=yannh
KUBE_SCHEMA_REPO:=kubernetes-json-schema
KUBE_SCHEMA_SHA1:=23cab9da14079ad764032a4b1c6efaef6739d24b
SCHEMA_DIR:=build/raw/${KUBE_SCHEMA_REPO}-${KUBE_SCHEMA_SHA1}
COPIED_MARK:=build/.copied.${KUBE_SCHEMA_SHA1}

.PHONY: all dist clean gen test copy-schemas

all: gen

gen:
	GO111MODULE=on go run ./cmd/apigen/ cmd/apigen/specs/swagger-v1.13.0.json cmd/apigen/templates ./src/

src/api.ts: gen
src/shapes.ts: gen

dist: src/api.ts src/shapes.ts ${COPIED_MARK}
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

${COPIED_MARK}: ${SCHEMA_DIR}
	rm -rf ./build/schemas
	GO111MODULE=on go run ./cmd/dedup/ ${SCHEMA_DIR} ./build/schemas
	touch ${COPIED_MARK}

build-image: dist
	mkdir -p build/image
	cp -R @jkcfg build/image/
	docker build -t jkcfg/kubernetes -f Dockerfile build/image

${SCHEMA_DIR}:
	mkdir -p build
	git clone --depth 1 --no-checkout "https://github.com/${KUBE_SCHEMA_ORG}/${KUBE_SCHEMA_REPO}" ${SCHEMA_DIR}
	cd ${SCHEMA_DIR} && \
	git sparse-checkout init --cone && \
	git ls-tree -d -r HEAD --name-only | grep -E "v.*-local" | xargs git sparse-checkout add && \
  git read-tree -mu HEAD
