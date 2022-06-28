# == Schema Information
#
# Table name: jams
#
#  id         :bigint(8)        not null, primary key
#  room_id    :string           not null
#  status_id  :bigint(8)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Jam < ApplicationRecord
  belongs_to :status

  def speakers
    status.active_mentions.map(&:account) + [status.account]
  end
end
