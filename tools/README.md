# るりまリポジトリをチェックアウトして、index.jsonを作るまで

    $ svn co http://jp.rubyist.net/svn/rurema/doctree/trunk build/rubydoc
    $ svn co http://jp.rubyist.net/svn/rurema/bitclust/trunk build/bitclust
    $ cd build/rubydoc/refm/api
    $ mkdir html

## 1.8.7

    $ ruby -I ../../../bitclust/lib ../../../bitclust/bin/bitclust \
        -d ./db-1.8.7 init version=1.8.7 encoding=utf-8
    $ ruby -I ../../../bitclust/lib ../../../bitclust/bin/bitclust \
        -d ./db-1.8.7 update --stdlibtree=src
    $ mkdir ./html/1.8.7 ./html/1.8.7/function ./html/1.8.7/json
    $ ruby ../../../bitclust/tools/bc-tohtmlpackage.rb -d ./db-1.8.7 -o \
        ./html/1.8.7 --catalog=../../../bitclust/data/bitclust/catalog
    $ cp ./html/1.8.7/library/_builtin.html ./html/1.8.7/library/builtin.html
    $ ruby ../../../../make_index.rb ./html/1.8.7 > ./html/1.8.7/json/index.json

## 1.9.2

    $ ruby -I ../../../bitclust/lib ../../../bitclust/bin/bitclust \
        -d ./db-1.9.2 init version=1.9.2 encoding=utf-8
    $ ruby -I ../../../bitclust/lib ../../../bitclust/bin/bitclust \
        -d ./db-1.9.2 update --stdlibtree=src
    $ mkdir ./html/1.9.2 ./html/1.9.2/function ./html/1.9.2/json
    $ ruby ../../../bitclust/tools/bc-tohtmlpackage.rb -d ./db-1.9.2 -o \
        ./html/1.9.2 --catalog=../../../bitclust/data/bitclust/catalog
    $ cp ./html/1.9.2/library/_builtin.html ./html/1.9.2/library/builtin.html
    $ ruby ../../../../make_index.rb ./html/1.9.2 > ./html/1.9.2/json/index.json

## 1.9.3

    $ ruby -I ../../../bitclust/lib ../../../bitclust/bin/bitclust \
        -d ./db-1.9.3 init version=1.9.3 encoding=utf-8
    $ ruby -I ../../../bitclust/lib ../../../bitclust/bin/bitclust \
        -d ./db-1.9.3 update --stdlibtree=src
    $ mkdir ./html/1.9.3 ./html/1.9.3/function ./html/1.9.3/json
    $ ruby ../../../bitclust/tools/bc-tohtmlpackage.rb -d ./db-1.9.3 -o \
        ./html/1.9.3 --catalog=../../../bitclust/data/bitclust/catalog
    $ cp ./html/1.9.3/library/_builtin.html ./html/1.9.3/library/builtin.html
    $ ruby ../../../../make_index.rb ./html/1.9.3 > ./html/1.9.3/json/index.json
