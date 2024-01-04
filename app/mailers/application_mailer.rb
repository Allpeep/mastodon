# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  layout 'mailer'

  helper :application
  helper :instance
  helper :formatting

  after_action :set_autoreply_headers!

  default from: email_address_with_name(Rails.configuration.action_mailer.default_options[:from], Setting.site_title)

  protected

  def locale_for_account(account, &block)
    I18n.with_locale(account.user_locale || I18n.default_locale, &block)
  end

  def set_autoreply_headers!
    headers['Precedence'] = 'list'
    headers['X-Auto-Response-Suppress'] = 'All'
    headers['Auto-Submitted'] = 'auto-generated'
  end
end
