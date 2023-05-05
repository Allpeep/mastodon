FROM ubuntu:20.04 as build-dep

# Use bash for the shell
SHELL ["/bin/bash", "-c"]
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install Node v16 (LTS)
ENV NODE_VER="16.17.1"
RUN ARCH= && \
    dpkgArch="$(dpkg --print-architecture)" && \
  case "${dpkgArch##*-}" in \
    amd64) ARCH='x64';; \
    ppc64el) ARCH='ppc64le';; \
    s390x) ARCH='s390x';; \
    arm64) ARCH='arm64';; \
    armhf) ARCH='armv7l';; \
    i386) ARCH='x86';; \
    *) echo "unsupported architecture"; exit 1 ;; \
  esac && \
    echo "Etc/UTC" > /etc/localtime && \
	apt-get update && \
	apt-get install -y --no-install-recommends ca-certificates wget python3 apt-utils && \
	cd ~ && \
	wget -q https://nodejs.org/download/release/v$NODE_VER/node-v$NODE_VER-linux-$ARCH.tar.gz && \
	tar xf node-v$NODE_VER-linux-$ARCH.tar.gz && \
	rm node-v$NODE_VER-linux-$ARCH.tar.gz && \
	mv node-v$NODE_VER-linux-$ARCH /opt/node

# Install Ruby 3.0
ENV RUBY_VER="3.0.4"
RUN apt-get update && \
  apt-get install -y --no-install-recommends build-essential \
    bison libyaml-dev libgdbm-dev libreadline-dev libjemalloc-dev \
		libncurses5-dev libffi-dev zlib1g-dev libssl-dev && \
	cd ~ && \
	wget https://cache.ruby-lang.org/pub/ruby/${RUBY_VER%.*}/ruby-$RUBY_VER.tar.gz && \
	tar xf ruby-$RUBY_VER.tar.gz && \
	cd ruby-$RUBY_VER && \
	./configure --prefix=/opt/ruby \
	  --with-jemalloc \
	  --with-shared \
	  --disable-install-doc && \
	make -j"$(nproc)" > /dev/null && \
	make install && \
	rm -rf ../ruby-$RUBY_VER.tar.gz ../ruby-$RUBY_VER

ENV PATH="${PATH}:/opt/ruby/bin:/opt/node/bin"

RUN npm install -g npm@latest && \
	npm install -g yarn && \
	gem install bundler && \
	apt-get update && \
	apt-get install -y --no-install-recommends git libicu-dev libidn11-dev \
	libpq-dev shared-mime-info
