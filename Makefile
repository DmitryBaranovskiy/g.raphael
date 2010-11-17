SRC_DIR = src
BUILD_DIR = build

DIR_PREFIX = .
DIST_DIR = ${DIR_PREFIX}/dist

SOURCES := $(patsubst ${SRC_DIR}/%.js, %, $(wildcard ${SRC_DIR}/*.js))

MINJAR = java -jar ${BUILD_DIR}/yuicompressor-2.4.2.jar

all: script min
	@@echo "Script build complete."

script:
	@@echo "Copying scripts..."
	@@mkdir -p ${DIST_DIR}
	@@for f in ${SOURCES} ; do \
		cp ${SRC_DIR}/$$f.js ${DIST_DIR} ; \
	done

min: script
	@@echo "Building minified scripts..."
	@@for f in ${SOURCES} ; do \
		${MINJAR} ${SRC_DIR}/$$f.js -o ${DIST_DIR}/$$f.min.js ; \
	done

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}
