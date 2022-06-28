# frozen_string_literal: true

class REST::JamSerializer < ActiveModel::Serializer
  attributes :id, :room_id, :speakers, :jam_seed, :server_url

  has_many :speakers, serializer: REST::AccountSerializer


  def id
    object.id.to_s
  end

  def jam_seed
    scope.account.jam_seed
  end

  def server_url
    Rails.configuration.x.jam_url
  end

end
