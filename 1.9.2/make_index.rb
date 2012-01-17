#!/usr/bin/ruby

HTDOCS_PATH = './ruby-refm-1.9.2-dynamic-20110729/html'

require 'find'

def unescapeHTML(str)
  str.
    gsub('&quot;', '"').
    gsub('&gt;', '>').
    gsub('&lt;', '<').
    gsub('&amp;', '&')
end

Find.find(HTDOCS_PATH) do |file|
  basename = file.gsub(HTDOCS_PATH, '')
  if FileTest.file?(file) && File.extname(file) == '.html'
#    p basename
    html = File.read(file)
    if html =~ %r{<h1>.*? method ((.*?)#(.*?))</h1>}
      p basename
      p unescapeHTML($1)
      p unescapeHTML($2)
      p unescapeHTML($3)
    end
  end
end
