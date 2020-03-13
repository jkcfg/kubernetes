KUBE_SCHEMA_ORG:=jkcfg
KUBE_SCHEMA_REPO:=kubernetes-schema
KUBE_SCHEMA_SHA1:=83d92a798500efd744a576df994196e75f3133dd
SCHEMA_ZIP:=build/${KUBE_SCHEMA_ORG}-${KUBE_SCHEMA_REPO}-${KUBE_SCHEMA_SHA1}.zip
# the next one is a consequence of how the zip file is made: the files
# will be in a directory named for the repo and commit hash.
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

${SCHEMA_ZIP}:
	mkdir build
	curl -L -o "$@" "https://github.com/${KUBE_SCHEMA_ORG}/${KUBE_SCHEMA_REPO}/archive/${KUBE_SCHEMA_SHA1}.zip"

${SCHEMA_DIR}: ${SCHEMA_ZIP}
	unzip -q ${SCHEMA_ZIP} -d build/raw/ "${KUBE_SCHEMA_REPO}-${KUBE_SCHEMA_SHA1}/*-local/*.json"
