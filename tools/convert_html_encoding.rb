#!/usr/bin/ruby

require 'find'
require 'nkf'
require 'fileutils'

src_dir = '../1.9.2.euc'
dst_dir = '../1.9.2.utf8'

if FileTest.exist?(dst_dir)
  puts dst_dir + ' already exist.'
else
  Find.find(src_dir) do |src_file|
    begin
      base_name = src_file[src_dir.length, src_file.length]
      dst_file = dst_dir + base_name
      if FileTest.directory?(src_file)
        puts 'mkdir ' + dst_file
        Dir.mkdir(dst_file)
      elsif FileTest.file?(src_file) && File.extname(src_file) == '.html'
        html_orig = File.read(src_file)
        html_utf8 = NKF.nkf('-wEm0x', html_orig)
        html_utf8.gsub!(/(<meta.*?charset=)(.*?)"/, '\1utf-8"')
        puts 'convert ' + dst_file
        open(dst_file, 'w') do |f|
          f.write(html_utf8)
        end
      else
        puts 'copy ' + dst_file
        FileUtils.cp(src_file, dst_file)
      end
    rescue
      puts $!
    end
  end
end
