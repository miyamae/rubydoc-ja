#!/usr/bin/ruby
# -*- coding: utf-8 -*-

# gem install json

require 'rubygems'
require 'find'
require 'cgi'
require 'json'
require 'yaml'

$SCRIPT_PATH = File.expand_path(File.dirname(__FILE__))

if ARGV.empty?
  $stderr.puts 'Usage: make_index.rb [html_dir]'
  exit
end
html_dir = ARGV[0]
if !FileTest.exist?(html_dir) || !FileTest.directory?(html_dir)
  $stderr.puts 'Not found: ' + html_dir
  exit
end

id = 1
recs = []
items = YAML.load_file($SCRIPT_PATH + '/default_index.yml')

Find.find(html_dir) do |file|

  if file !~ /\/(function|doc)\// && FileTest.file?(file) && File.extname(file) == '.html'
    html = File.read(file)
    item = {:path=>file.gsub(/^.*[1-3]\.[0-9]{1,2}\.[0-9]{1,2}/, ''), :key=>''}
    id += 1

    # method
    if html =~ %r{<title>(.*? method|module function|constant|variable) (.*?)</title>}
      item[:key] = CGI.unescapeHTML($2)
    end
    item[:sub] = []
    html.gsub(%r{<dt class="method-heading"><code>(.*?)</code>}) do |matched|
      item[:sub] << CGI.unescapeHTML($1)
    end
    if html =~ %r{<dd class="method-description">.*?<p>(.*?)</p>}m
      item[:desc] = CGI.unescapeHTML($1.gsub(/<.*?>|"/, '').gsub(/\n/, ' '))
    end


    # class
    if html =~ %r{<title>(class|module|object) (.*?)</title>}
      item[:key] = CGI.unescapeHTML($2)
    end
    if html =~ %r{<p>.*?クラスの継承リスト:.*?(&lt;.*?)</a>}m
      item[:sub] = CGI.unescapeHTML($1.gsub(/<.*?>|"/, ''))
    end
    if html =~ %r{<h2>要約</h2>.*?<p>(.*?)</p>}m
      item[:desc] = CGI.unescapeHTML($1.gsub(/<.*?>|"/, '').gsub(/\n/, ' '))
    end

    # library
    if html =~ %r{<title>(library) (.*?)</title>}
      item[:key] = CGI.unescapeHTML($2) + 'ライブラリ'
    end
    if html =~ %r{<h2>要約</h2>.*?<p>(.*?)</p>}m
      item[:desc] = CGI.unescapeHTML($1.gsub(/<.*?>|"/, '').gsub(/\n/, ' '))
    end

    if item[:desc] && item[:desc].size > 50
      item[:desc] = item[:desc].strip[0, 50] + '...'
    end

    if item[:key].empty?
      $stderr.puts 'no key. ' + file
    else
      items << item
    end
  end

end

puts items.sort{|a,b|a[:key]<=>b[:key]}.to_json
