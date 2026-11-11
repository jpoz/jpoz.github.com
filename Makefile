.DEFAULT_GOAL := help
.PHONY: help install dev build preview deploy-jpoz-com clean

node_modules: package.json package-lock.json
	npm install
	@touch node_modules

help: ## Show this help
	@awk 'BEGIN {FS = ":.*## "; printf "Usage: make <target>\n\nTargets:\n"} \
		/^[a-zA-Z_-]+:.*## / {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: node_modules ## Install npm dependencies

dev: node_modules ## Run the dev server on all interfaces (LAN/Tailscale) at port 4321
	npm run dev -- --host --force

build: node_modules ## Build the static site into dist/
	npm run build

preview: build ## Build, then serve dist/ locally
	npm run preview

deploy-jpoz-com: build ## Build, then deploy dist/ to the jpoz.com Cloudflare Worker
	npx wrangler deploy

clean: ## Remove build output and Astro cache
	rm -rf dist .astro
