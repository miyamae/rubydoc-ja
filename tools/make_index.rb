#!/usr/bin/ruby
# -*- coding: utf-8 -*-

# gem install json

require 'rubygems'
require 'find'
require 'cgi'
require 'json'

html_dir = '../1.9.2/method'

id = 1
recs = []
items = []
Find.find(html_dir) do |file|

  if FileTest.file?(file) && File.extname(file) == '.html'
    html = File.read(file)
    item = {:id => id, :path=>file.gsub(/^\.\.\/1\.9\.2/, '')}
    id += 1
    if html =~ %r{<dt class="method-heading"><code>(.*?)</code>}
      item[:name] = CGI.unescapeHTML($1)
      if item[:name] =~ %r{^(.*?)([( ].*)$}
        item[:name] = $1
        item[:arg] = $2.strip
        if item[:arg] =~ %r{^(.*)->(.*)$}
          item[:arg] = $1.strip
          item[:ret] = $2.strip
        end
      end
    end
#    if html =~ %r{<title>(.*? method|module function|constant) (.*?)[#\.:]*</title>}
    if html =~ %r{<title>(.*? method|module function|constant) (.*?)</title>}
      item[:key] = CGI.unescapeHTML($2)
    end
    if html =~ %r{<dd class="method-description">.*?<p>(.*?)</p>}m
      item[:desc] = CGI.unescapeHTML($1.gsub(/<.*?>|"/, '').gsub(/\n/, ' ')).strip
    end
    items << item
  end

end

puts items.sort{|a,b|a[:name]<=>b[:name]}.to_json
