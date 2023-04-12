Rails.application.configure do
  config.x.categories = YAML.load_file(Rails.root.join('config', 'categories.yml'))
end
