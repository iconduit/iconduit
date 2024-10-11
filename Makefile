-include .makefiles/Makefile
-include .makefiles/pkg/js/v1/Makefile
-include .makefiles/pkg/js/v1/with-npm.mk

.makefiles/%:
	@curl -sfL https://makefiles.dev/v1 | bash /dev/stdin "$@"

################################################################################

.PHONY: ci
ci:: build

.PHONY: precommit
precommit:: build

################################################################################

.PHONY: build
build:: artifacts/link-dependencies.touch
	bin/iconduit test/fixture/iconduit
