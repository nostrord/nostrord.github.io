install:
	bundle config set --local path 'vendor/bundle'
	bundle install

serve:
	bundle exec jekyll serve

build:
	bundle exec jekyll build

clean:
	bundle exec jekyll clean
