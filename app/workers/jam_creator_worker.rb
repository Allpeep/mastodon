# frozen_string_literal: true

class JamCreatorWorker
  include Sidekiq::Worker
  include SsrHelper

  sidekiq_options queue: 'pull', retry: 3

  EMPTY_ROOM = {
    name: '',
    description: '',
    speakers: [],
    moderators: [],
  }


  def perform(status_id)
    status = Status.find(status_id)

    jam_host = Rails.configuration.x.jam_url

    jam = status.jam
    room_id = jam.room_id
    speakers = jam.speakers
    creator = status.account
    room_config = {
      name: 'Jam',
      description: '',
      speakers: speakers.map(&:jam_identity),
      moderators: [creator.jam_identity],
    }

    payload = signData(creator.jam_private_key, room_config)

    response = HTTP.post("#{jam_host}/_/pantry/api/v1/rooms/#{room_id}", json: payload)
    Rails.logger.error response.status
    raise unless response.status.success?

  rescue HTTP::Error => e
    Rails.logger.error e

  rescue ActiveRecord::RecordNotFound
    true
  end
end
