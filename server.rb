#!/usr/bin/ruby

require 'webrick'
include WEBrick

module WEBrick::HTTPServlet
  FileHandler.add_handler('rb', CGIHandler)
end

s = HTTPServer.new(
  :Port => 3000,
  :DocumentRoot => "."
)
trap("INT") { s.shutdown }
s.start
