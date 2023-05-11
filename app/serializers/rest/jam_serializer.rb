# frozen_string_literal: true

class REST::JamSerializer < ActiveModel::Serializer
  attributes :id, :room_id, :speakers, :jam_seed, :jam_host, :room_config

  has_many :speakers, serializer: REST::AccountSerializer


  def id
    object.id.to_s
  end

  def jam_seed
    scope ? scope.account.jam_seed : nil
  end

end
