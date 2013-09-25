version = ENV["VERSION"] || "2.0.0"

task :default => "build/html/#{version}/json/index.json"
task :install => "#{version}"

file "build/html/#{version}/json/index.json" => "build" do
  cd "build/rubydoc/refm/api" do
    bitclust = "ruby -I ../../../bitclust/lib ../../../bitclust/bin/bitclust -d db-#{version}"
    sh "#{bitclust} init version=#{version} encoding=utf-8"
    sh "#{bitclust} update --stdlibtree=src"
    mkdir_p "html/#{version}/function"
    mkdir_p "html/#{version}/json"
    sh "#{bitclust} statichtml -o html/#{version} --catalog=../../../bitclust/data/bitclust/catalog"
    sh "cp html/#{version}/library/_builtin.html html/#{version}/library/builtin.html"
    sh "ruby ../../../../tools/make_index.rb html/#{version} > html/#{version}/json/index.json"
  end
end

file "build" do
  sh "git clone https://github.com/rurema/doctree.git build/rubydoc"
  sh "git clone https://github.com/rurema/bitclust.git build/bitclust"
  sh "mkdir build/rubydoc/refm/api/html"
end

task "#{version}" do
  sh "mv #{version} #{version}_old"
  sh "mv build/rubydoc/refm/api/html/#{version} ."
  sh "cp -R resources/* #{version}"
end
