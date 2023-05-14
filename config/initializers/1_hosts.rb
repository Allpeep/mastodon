# frozen_string_literal: true

port     = ENV.fetch('PORT') { 3000 }
host     = ENV.fetch('LOCAL_DOMAIN') { "localhost:#{port}" }
web_host = ENV.fetch('WEB_DOMAIN') { host }

alternate_domains = ENV.fetch('ALTERNATE_DOMAINS') { '' }.split(/\s*,\s*/)

Rails.application.configure do
  https = Rails.env.production? || ENV['LOCAL_HTTPS'] == 'true'

  config.x.local_domain = host
  config.x.web_domain   = web_host
  config.x.use_https    = https
  config.x.use_s3       = ENV['S3_ENABLED'] == 'true'
  config.x.use_swift    = ENV['SWIFT_ENABLED'] == 'true'

  config.x.alternate_domains = alternate_domains

  config.action_mailer.default_url_options = { host: web_host, protocol: https ? 'https://' : 'http://', trailing_slash: false }

  config.x.streaming_api_base_url = ENV.fetch('STREAMING_API_BASE_URL') do
    if Rails.env.production?
      "ws#{https ? 's' : ''}://#{web_host}"
    else
      "ws://#{ENV['REMOTE_DEV'] == 'true' ? host.split(':').first : 'localhost'}:4000"
    end
  end

  config.x.jam_proxy_base_url = ENV.fetch('JAM_PROXY_BASE_URL') do
    if Rails.env.production?
      "http#{https ? 's' : ''}://#{web_host}"
    else
      "http://#{ENV['REMOTE_DEV'] == 'true' ? host.split(':').first : 'localhost'}:8000"
    end
  end

  config.x.jam_stun_server = ENV.fetch('JAM_STUN_SERVER', 'stun:stun.jam.systems:3478')
  config.x.jam_turn_server = ENV.fetch('JAM_TURN_SERVER', 'turn:turn.jam.systems:3478')
  config.x.jam_turn_user = ENV.fetch('JAM_TURN_USER', 'test')
  config.x.jam_turn_password = ENV.fetch('JAM_TURN_PASSWORD', 'yieChoi0PeoKo8ni')


  unless Rails.env.test?
    config.hosts << host if host.present?
    config.hosts << web_host if web_host.present?
    config.hosts.concat(alternate_domains) if alternate_domains.present?
    config.host_authorization = { exclude: ->(request) { request.path == '/health' } }
  end
end
